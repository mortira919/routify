// English localization for Routify

export const en = {
    // === HEADER ===
    header: {
        saved: 'Saved',
        loadDemo: 'Load Demo',
        import: 'Import',
        settings: 'Settings',
        generateCode: 'Generate Code',
        generating: 'Generating...',
        downloaded: 'Downloaded!',
        tutorial: 'Tutorial',
    },

    // === SIDEBAR ===
    sidebar: {
        searchPlaceholder: 'Search nodes...',
        models: 'Models',
        exportJson: 'Export JSON',
        categories: {
            endpoints: 'Endpoints',
            data: 'Data',
            security: 'Security',
        },
        nodes: {
            endpoint: {
                name: 'API Endpoint',
                description: 'HTTP request handler',
            },
            database: {
                name: 'Database',
                description: 'CRUD operations',
            },
            response: {
                name: 'Response',
                description: 'Send response',
            },
            auth: {
                name: 'Authentication',
                description: 'JWT, API Key, etc.',
            },
        },
    },

    // === PROPERTY PANEL ===
    propertyPanel: {
        noNodeSelected: 'No node selected',
        noNodeSelectedHint: 'Click a node to edit its properties',
        deleteNode: 'Delete Node',

        nodeTypes: {
            endpoint: 'API Endpoint',
            database: 'Database',
            response: 'Response',
            auth: 'Authentication',
            node: 'Node',
        },

        sections: {
            basic: 'Basic Settings',
            documentation: 'Documentation',
            authentication: 'Authentication',
            parameters: 'Parameters',
            requestBody: 'Request Body',
            response: 'Response',
            operation: 'Operation',
            model: 'Model',
        },

        fields: {
            path: 'Path',
            pathPlaceholder: '/api/users/:id',
            summary: 'Summary',
            summaryPlaceholder: 'Brief summary',
            description: 'Description',
            descriptionPlaceholder: 'Detailed description for Swagger...',
            tags: 'Tags',
            tagsPlaceholder: 'Add tags...',
            markAsDeprecated: 'Mark as deprecated',
            requireAuth: 'Require authentication',
            authType: 'Auth Type',
            requiredRoles: 'Required Roles',
            queryParams: 'Query Params',
            pathParams: 'Path Params',
            bodySchema: 'Body Schema',
            responseDescription: 'Response Description',
            modelName: 'Model Name',
            modelPlaceholder: 'User',
        },

        buttons: {
            addResponse: '+ Add Response',
        },
    },

    // === SETTINGS MODAL ===
    settings: {
        title: 'Project Settings',
        database: {
            title: 'Database',
            type: 'Database Type',
        },
        server: {
            title: 'Server',
            port: 'Port',
            basePath: 'Base Path',
        },
        features: {
            title: 'Features',
            enableSwagger: 'Enable Swagger Docs',
            enableCors: 'Enable CORS',
            corsOrigins: 'CORS Origins (comma separated)',
            corsPlaceholder: '*, http://localhost:3000',
        },
        generatedCode: {
            title: 'Generated Code',
            target: 'Target',
            apiStyle: 'API Style',
        },
        buttons: {
            cancel: 'Cancel',
            save: 'Save',
        },
    },

    // === SCHEMA BUILDER ===
    schemaBuilder: {
        title: 'Data Models',
        newModelPlaceholder: 'New model name...',
        noModels: 'No models yet',
        noModelsHint: 'Create your first data model above',
        fields: 'fields',
        addField: 'Add Field',
        fieldTypes: {
            string: 'String',
            integer: 'Integer',
            float: 'Float',
            boolean: 'Boolean',
            dateTime: 'DateTime',
            json: 'JSON',
        },
        flags: {
            required: 'Required',
            unique: 'Unique',
            primaryKey: 'Primary Key',
        },
        errors: {
            duplicateModel: 'Model with this name already exists!',
            cannotRemoveId: 'Cannot remove ID field!',
            confirmDelete: 'Delete model "{name}"? This action cannot be undone.',
        },
    },

    // === NODES ===
    nodes: {
        endpoint: {
            title: 'API Endpoint',
            subtitle: 'HTTP request handler',
        },
        database: {
            title: 'Database',
            noModel: 'No model selected',
            filters: 'Filters',
            operations: {
                create: 'Create record',
                read: 'Find one',
                update: 'Update record',
                delete: 'Delete record',
                list: 'Find many',
            },
        },
        response: {
            title: 'Response',
            subtitle: 'Send data',
        },
        auth: {
            title: 'Authentication',
            subtitle: 'Access check',
        },
    },

    // === DEFAULTS ===
    defaults: {
        authTypes: {
            none: 'No authentication',
            jwt: 'JWT token',
            apiKey: 'API key',
            basic: 'Basic auth',
        },
        roles: ['admin', 'user', 'guest', 'moderator'],
        tags: ['Users', 'Auth', 'Products', 'Orders', 'Settings', 'Public'],
        responses: {
            successful: 'Successful response',
            error: 'Error response',
        },
        endpoint: {
            summary: 'Get resource',
        },
    },

    // === HINTS ===
    hints: {
        endpoint: {
            title: '🌐 API Endpoint',
            what: 'Entry point for HTTP requests to your API.',
            why: 'Needed to create routes that clients can call.',
            how: 'Drag to canvas, set method (GET/POST/...) and path. Connect to database to handle data.',
        },
        database: {
            title: '💾 Database',
            what: 'Database operation (Create, Read, Update, Delete).',
            why: 'Connects API to data storage.',
            how: 'Select operation and model. Connect to endpoint — data will be handled automatically.',
        },
        response: {
            title: '📤 Response',
            what: 'Final response to the client.',
            why: 'Defines exactly what is returned when API is called.',
            how: 'Add after data processing, configure response structure.',
        },
        auth: {
            title: '🔐 Authentication',
            what: 'Access rights check.',
            why: 'Protects private endpoints from unauthorized access.',
            how: 'Select auth type (JWT, API Key) and specify roles.',
        },
        connectNodes: {
            title: '🔗 How to connect nodes?',
            text: 'Drag from output (right) to input (left) of another node. Line shows data flow.',
        },
        sections: {
            basic: 'Basic HTTP endpoint settings: method and URL path.',
            documentation: 'Info for Swagger documentation. Helps other developers understand your API.',
            authentication: 'Endpoint security settings. Enable if access should be restricted.',
            parameters: 'Incoming data from URL (path) and query string.',
            requestBody: 'Structure of data sent by client in request body.',
            response: 'What responses the endpoint can return and their structure.',
        },
    },

    // === TUTORIAL ===
    tutorial: {
        title: 'How to create API',
        close: 'Close',
        steps: [
            {
                title: '1. Create data model',
                text: 'Open "Models" panel in left menu and create a model (e.g. User). Add fields: name, email, etc.',
            },
            {
                title: '2. Add API Endpoint',
                text: 'Drag "API Endpoint" from left panel to canvas. Set method (GET, POST) and path (e.g. /api/users).',
            },
            {
                title: '3. Connect Database',
                text: 'Drag "Database" and connect to endpoint. Select operation (list, create) and your model.',
            },
            {
                title: '4. Set Authentication',
                text: 'If protection is needed — enable "Require Auth" in endpoint properties and select roles.',
            },
            {
                title: '5. Generate Code',
                text: 'Click "Generate Code". A ZIP archive with ready Express.js backend will be downloaded!',
            },
        ],
        tip: '💡 Hover over ? icon near elements for hints.',
    },

    // === TOASTS ===
    toasts: {
        backendGenerated: '✅ Backend generated successfully! Check your downloads.',
        importSuccess: 'Project imported successfully!',
        importError: 'Failed to import project. Make sure it is a Routify file.',
        generateError: 'Failed to generate code. Please try again.',
    },

    // === LANDING PAGE ===
    landing: {
        hero: {
            title1: 'DESIGN YOUR BACKEND',
            title2: 'AT LIGHTSPEED',
            subtitle: 'Visually architect high-performance APIs, define models, and generate production-ready code in seconds.',
            cta: 'INITIALIZE SYSTEM',
        },
        features: {
            title: 'INDUSTRIAL GRADE TOOLS',
            flow: {
                title: 'Visual Flow',
                desc: 'Intuitive node-based editor for complex API logic.',
            },
            schema: {
                title: 'Smart Schemas',
                desc: 'Robust data modeling with strict type validation.',
            },
            codegen: {
                title: 'Fast Generation',
                desc: 'Instant Express.js & TypeScript backend scaffolding.',
            },
            security: {
                title: 'Built-in Security',
                desc: 'JWT and Role-based access control out of the box.',
            }
        },
        steps: {
            title: 'THE WORKFLOW',
            step1: 'Architect flow',
            step2: 'Define models',
            step3: 'Deploy API',
        },
        finalCta: {
            title: 'READY TO BUILD?',
            subtitle: 'Experience the next generation of backend development architecture.',
            button: 'BUILD PRODUCT MANUALLY',
        },
        howItWorks: {
            title: 'HOW IT WORKS',
            steps: [
                { title: 'Project Flow', desc: 'Design your API architecture using an intuitive node-based editor.' },
                { title: 'Data Modeling', desc: 'Define data structures with automatic type and schema generation.' },
                { title: 'Security First', desc: 'Configure role-based access control and authentication in one click.' },
                { title: 'Instant Code', desc: 'Download a production-ready Express.js and TypeScript project.' },
            ]
        },
        techStack: {
            title: 'TECHNOLOGY STACK',
            items: [
                { name: 'Node.js', desc: 'High-performance JavaScript runtime for the server side.' },
                { name: 'TypeScript', desc: 'Strongly typed programming language for bulletproof scaling.' },
                { name: 'Ant Design', desc: 'Professional UI component library for enterprise-grade apps.' },
                { name: 'Express.js', desc: 'The most popular and flexible web framework for Node.js.' },
            ]
        },
        footer: {
            status: 'ROUTIFY // VISUAL API DESIGNER',
        }
    }
} as const;
