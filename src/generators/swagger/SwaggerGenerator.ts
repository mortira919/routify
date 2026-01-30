import type { Project, EndpointConfig, DatabaseConfig } from '../../types';

interface SwaggerSpec {
    openapi: string;
    info: {
        title: string;
        description: string;
        version: string;
    };
    servers: Array<{ url: string; description: string }>;
    paths: Record<string, Record<string, PathItem>>;
    components: {
        schemas: Record<string, SchemaObject>;
        securitySchemes?: Record<string, SecurityScheme>;
    };
    tags: Array<{ name: string; description: string }>;
}

interface PathItem {
    summary: string;
    description: string;
    tags: string[];
    security?: Array<Record<string, string[]>>;
    parameters?: Parameter[];
    requestBody?: RequestBody;
    responses: Record<string, Response>;
}

interface Parameter {
    name: string;
    in: 'query' | 'path' | 'header';
    required: boolean;
    schema: { type: string };
    description: string;
}

interface RequestBody {
    required: boolean;
    content: {
        'application/json': {
            schema: { $ref: string } | { type: string; properties: Record<string, unknown> };
        };
    };
}

interface Response {
    description: string;
    content?: {
        'application/json': {
            schema: { $ref: string } | { type: string };
        };
    };
}

interface SchemaObject {
    type: string;
    properties?: Record<string, { type: string; description?: string }>;
    required?: string[];
}

interface SecurityScheme {
    type: string;
    scheme?: string;
    bearerFormat?: string;
    in?: string;
    name?: string;
}

export class SwaggerGenerator {
    private project: Project;

    constructor(project: Project) {
        this.project = project;
    }

    generate(): { spec: SwaggerSpec; swaggerJsFile: string } {
        const spec = this.generateSpec();
        const swaggerJsFile = this.generateSwaggerFile(spec);

        return { spec, swaggerJsFile };
    }

    private generateSpec(): SwaggerSpec {
        const paths: SwaggerSpec['paths'] = {};
        const schemas: Record<string, SchemaObject> = {};
        const tags = new Set<string>();

        // Generate schemas from models
        this.project.models.forEach(model => {
            const properties: Record<string, { type: string }> = {};
            const required: string[] = [];

            model.fields.forEach(field => {
                properties[field.name] = { type: this.toSwaggerType(field.type) };
                if (field.isRequired) {
                    required.push(field.name);
                }
            });

            schemas[model.name] = {
                type: 'object',
                properties,
                required: required.length > 0 ? required : undefined,
            };
        });

        // Generate paths from endpoint nodes
        const endpointNodes = this.project.nodes.filter(n => n.data.type === 'endpoint');

        endpointNodes.forEach(node => {
            const config = node.data.config as EndpointConfig;
            const pathKey = config.path;
            const method = config.method.toLowerCase();

            // Extract tags from config or path
            const configTags = config.tags?.length > 0 ? config.tags : [this.extractTag(config.path)];
            configTags.forEach(t => tags.add(t));

            // Find connected database node
            const connectedNodes = this.getConnectedNodes(node.id);
            const dbNode = connectedNodes.find(n => n.data.type === 'database');
            const dbConfig = dbNode?.data.config as DatabaseConfig | undefined;

            // Build path item
            const pathItem: PathItem = {
                summary: config.summary || config.description || `${config.method} ${config.path}`,
                description: config.description || '',
                tags: configTags,
                responses: this.generateResponses(config, dbConfig),
            };

            // Add deprecated flag if set
            if (config.deprecated) {
                (pathItem as PathItem & { deprecated?: boolean }).deprecated = true;
            }

            // Add parameters
            const parameters = this.extractParameters(config);
            if (parameters.length > 0) {
                pathItem.parameters = parameters;
            }

            // Add request body for POST/PUT/PATCH
            if (['post', 'put', 'patch'].includes(method) && dbConfig?.model) {
                pathItem.requestBody = {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: `#/components/schemas/${dbConfig.model}` },
                        },
                    },
                };
            }

            // Check for auth requirement from config or connected auth node
            const authNode = connectedNodes.find(n => n.data.type === 'auth');
            if (authNode || config.auth?.required) {
                pathItem.security = [{ bearerAuth: [] }];
            }

            // Add to paths
            if (!paths[pathKey]) {
                paths[pathKey] = {};
            }
            paths[pathKey][method] = pathItem;
        });

        return {
            openapi: '3.0.3',
            info: {
                title: this.project.name,
                description: this.project.description || 'API generated by Routify',
                version: '1.0.0',
            },
            servers: [
                { url: `http://localhost:${this.project.settings.port}${this.project.settings.basePath}`, description: 'Development server' },
                { url: `https://your-app.onrender.com${this.project.settings.basePath}`, description: 'Production server (Render)' },
            ],
            paths,
            components: {
                schemas,
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            tags: Array.from(tags).map(name => ({
                name,
                description: `${name} operations`,
            })),
        };
    }

    private extractTag(path: string): string {
        const parts = path.split('/').filter(Boolean);
        if (parts.length === 0) return 'default';
        // Skip 'api' if present
        const firstPart = parts[0] === 'api' ? parts[1] : parts[0];
        return firstPart?.replace(/[^a-zA-Z]/g, '') || 'default';
    }

    private extractParameters(config: EndpointConfig): Parameter[] {
        const params: Parameter[] = [];

        // Extract path parameters (e.g., :id)
        const pathParams = config.path.match(/:(\w+)/g) || [];
        pathParams.forEach(param => {
            const name = param.slice(1);
            params.push({
                name,
                in: 'path',
                required: true,
                schema: { type: name === 'id' ? 'string' : 'string' },
                description: `${name} parameter`,
            });
        });

        // Add query params from config
        config.queryParams?.forEach(qp => {
            params.push({
                name: qp.name,
                in: 'query',
                required: qp.required,
                schema: { type: qp.type },
                description: qp.description,
            });
        });

        return params;
    }

    private generateResponses(config: EndpointConfig, dbConfig?: DatabaseConfig): Record<string, Response> {
        const responses: Record<string, Response> = {};

        // Use responses from config if available
        if (config.responses && config.responses.length > 0) {
            config.responses.forEach(resp => {
                const code = resp.statusCode.toString();
                responses[code] = {
                    description: resp.description || 'Response',
                };

                // Add schema if model is connected
                if (dbConfig?.model && resp.statusCode >= 200 && resp.statusCode < 300) {
                    const isArray = dbConfig.operation === 'list';
                    responses[code].content = {
                        'application/json': {
                            schema: isArray
                                ? { type: 'array', items: { $ref: `#/components/schemas/${dbConfig.model}` } } as unknown as { $ref: string }
                                : { $ref: `#/components/schemas/${dbConfig.model}` },
                        },
                    };
                }
            });
        } else {
            // Fallback - generate default responses
            responses['200'] = {
                description: 'Successful response',
            };

            if (dbConfig?.model) {
                const isArray = dbConfig.operation === 'list';
                responses['200'].content = {
                    'application/json': {
                        schema: isArray
                            ? { type: 'array', items: { $ref: `#/components/schemas/${dbConfig.model}` } } as unknown as { $ref: string }
                            : { $ref: `#/components/schemas/${dbConfig.model}` },
                    },
                };
            }
        }

        // Always add error responses if not already present
        if (!responses['400']) responses['400'] = { description: 'Bad request' };
        if (!responses['404']) responses['404'] = { description: 'Not found' };
        if (!responses['500']) responses['500'] = { description: 'Internal server error' };

        return responses;
    }

    private getConnectedNodes(nodeId: string) {
        const connectedIds = new Set<string>();

        this.project.edges.forEach(edge => {
            if (edge.source === nodeId) connectedIds.add(edge.target);
            if (edge.target === nodeId) connectedIds.add(edge.source);
        });

        return this.project.nodes.filter(n => connectedIds.has(n.id));
    }

    private toSwaggerType(type: string): string {
        const typeMap: Record<string, string> = {
            String: 'string',
            Int: 'integer',
            Float: 'number',
            Boolean: 'boolean',
            DateTime: 'string',
            Json: 'object',
        };
        return typeMap[type] || 'string';
    }

    private generateSwaggerFile(spec: SwaggerSpec): string {
        return `const swaggerSpec = ${JSON.stringify(spec, null, 2)};

module.exports = swaggerSpec;
`;
    }
}
