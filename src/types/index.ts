export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Extended Endpoint Configuration
export interface EndpointConfig {
    // Basic
    method: HttpMethod;
    path: string;

    // Swagger Documentation
    summary: string;
    description: string;
    tags: string[];
    deprecated: boolean;

    // Authentication
    auth: EndpointAuth;

    // Parameters
    pathParams: ParamConfig[];
    queryParams: ParamConfig[];
    bodySchema: SchemaField[];

    // Responses
    responses: ResponseDefinition[];

    // Rate Limiting
    rateLimit?: RateLimitConfig;
}

export interface EndpointAuth {
    required: boolean;
    type: 'none' | 'jwt' | 'apiKey' | 'basic';
    roles: string[];
    tokenLocation?: 'header' | 'cookie' | 'query';
    headerName?: string;
}

export interface RateLimitConfig {
    enabled: boolean;
    requests: number;
    windowMs: number; // milliseconds
}

export interface ResponseDefinition {
    statusCode: number;
    description: string;
    schema: SchemaField[];
    example?: string; // JSON string
}

export interface ParamConfig {
    name: string;
    type: 'string' | 'number' | 'boolean';
    required: boolean;
    description: string;
    example?: string;
    enum?: string[]; // Allowed values
}

export interface SchemaField {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
    description: string;
    example?: string;
    enum?: string[];
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    children?: SchemaField[]; // For object/array types
}

export interface DatabaseConfig {
    operation: 'create' | 'read' | 'update' | 'delete' | 'list';
    model: string;
    filters: FilterConfig[];
    select: string[];
    orderBy?: { field: string; direction: 'asc' | 'desc' };
    limit?: number;
}

export interface FilterConfig {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
    value: string;
    source: 'static' | 'query' | 'body' | 'param';
}

export interface LogicConfig {
    type: 'condition' | 'transform' | 'validate';
    conditions?: ConditionConfig[];
    transform?: TransformConfig;
    validation?: ValidationConfig[];
}

export interface ConditionConfig {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'exists' | 'notExists';
    value: string;
}

export interface TransformConfig {
    input: string;
    output: string;
    expression: string;
}

export interface ValidationConfig {
    field: string;
    rule: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'enum';
    value?: string | number;
    message: string;
}

export interface AuthConfig {
    type: 'jwt' | 'apiKey' | 'basic' | 'none';
    tokenLocation?: 'header' | 'cookie' | 'query';
    headerName?: string;
    roles?: string[];
}

export interface ResponseConfig {
    statusCode: number;
    contentType: 'json' | 'text' | 'html';
    schema: SchemaField[];
    headers: Record<string, string>;
}

export interface MiddlewareConfig {
    type: 'cors' | 'rateLimit' | 'logging' | 'custom';
    options: Record<string, unknown>;
}

// Node type union
export type NodeData =
    | { type: 'endpoint'; config: EndpointConfig }
    | { type: 'database'; config: DatabaseConfig }
    | { type: 'logic'; config: LogicConfig }
    | { type: 'auth'; config: AuthConfig }
    | { type: 'response'; config: ResponseConfig }
    | { type: 'middleware'; config: MiddlewareConfig };

// React Flow node wrapper
export interface FlowNode {
    id: string;
    type: string;
    position: { x: number; y: number };
    data: NodeData;
    selected?: boolean;
}

export interface FlowEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
}

// Project structure
export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    nodes: FlowNode[];
    edges: FlowEdge[];
    models: DataModel[];
    settings: ProjectSettings;
}

export interface DataModel {
    name: string;
    fields: ModelField[];
}

export interface ModelField {
    name: string;
    type: 'String' | 'Int' | 'Float' | 'Boolean' | 'DateTime' | 'Json';
    isRequired: boolean;
    isUnique: boolean;
    isId: boolean;
    default?: string;
    relation?: {
        model: string;
        field: string;
        type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    };
}

export interface ProjectSettings {
    database: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
    port: number;
    basePath: string;
    enableSwagger: boolean;
    enableCors: boolean;
    corsOrigins: string[];
    target: 'nodejs' | 'typescript';
    apiStyle: 'rest' | 'minimal';
}
