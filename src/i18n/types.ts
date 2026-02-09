export interface BaseTranslations {
    header: {
        saved: string;
        loadDemo: string;
        import: string;
        settings: string;
        generateCode: string;
        generating: string;
        downloaded: string;
        tutorial: string;
    };
    sidebar: {
        searchPlaceholder: string;
        models: string;
        exportJson: string;
        categories: {
            endpoints: string;
            data: string;
            security: string;
        };
        nodes: {
            endpoint: { name: string; description: string };
            database: { name: string; description: string };
            response: { name: string; description: string };
            auth: { name: string; description: string };
        };
    };
    propertyPanel: {
        noNodeSelected: string;
        noNodeSelectedHint: string;
        deleteNode: string;
        nodeTypes: {
            endpoint: string;
            database: string;
            response: string;
            auth: string;
            node: string;
        };
        sections: {
            basic: string;
            documentation: string;
            authentication: string;
            parameters: string;
            requestBody: string;
            response: string;
            operation: string;
            model: string;
        };
        fields: {
            path: string;
            pathPlaceholder: string;
            summary: string;
            summaryPlaceholder: string;
            description: string;
            descriptionPlaceholder: string;
            tags: string;
            tagsPlaceholder: string;
            markAsDeprecated: string;
            requireAuth: string;
            authType: string;
            requiredRoles: string;
            queryParams: string;
            pathParams: string;
            bodySchema: string;
            responseDescription: string;
            modelName: string;
            modelPlaceholder: string;
        };
        buttons: {
            addResponse: string;
        };
    };
    settings: {
        title: string;
        database: { title: string; type: string };
        server: { title: string; port: string; basePath: string };
        features: {
            title: string;
            enableSwagger: string;
            enableCors: string;
            corsOrigins: string;
            corsPlaceholder: string;
        };
        generatedCode: { title: string; target: string; apiStyle: string };
        buttons: { cancel: string; save: string };
    };
    schemaBuilder: {
        title: string;
        newModelPlaceholder: string;
        noModels: string;
        noModelsHint: string;
        fields: string;
        addField: string;
        fieldTypes: {
            string: string;
            integer: string;
            float: string;
            boolean: string;
            dateTime: string;
            json: string;
        };
        flags: { required: string; unique: string; primaryKey: string };
        errors: {
            duplicateModel: string;
            cannotRemoveId: string;
            confirmDelete: string;
        };
    };
    nodes: {
        endpoint: { title: string; subtitle: string };
        database: { title: string; noModel: string; filters: string; operations: Readonly<Record<string, string>> };
        response: { title: string; subtitle: string };
        auth: { title: string; subtitle: string };
    };
    defaults: {
        authTypes: Readonly<Record<string, string>>;
        roles: readonly string[];
        tags: readonly string[];
        responses: { successful: string; error: string };
        endpoint: { summary: string };
    };
    hints: {
        endpoint: Readonly<Record<string, string>>;
        database: Readonly<Record<string, string>>;
        response: Readonly<Record<string, string>>;
        auth: Readonly<Record<string, string>>;
        connectNodes: { title: string; text: string };
        sections: Readonly<Record<string, string>>;
    };
    tutorial: {
        title: string;
        close: string;
        steps: readonly { readonly title: string; readonly text: string }[];
        tip: string;
    };
    toasts: {
        backendGenerated: string;
        importSuccess: string;
        importError: string;
        generateError: string;
    };
    landing: {
        hero: { title1: string; title2: string; subtitle: string; cta: string };
        features: {
            title: string;
            flow: { title: string; desc: string };
            schema: { title: string; desc: string };
            codegen: { title: string; desc: string };
            security: { title: string; desc: string };
        };
        steps: { title: string; step1: string; step2: string; step3: string };
        finalCta: { title: string; subtitle: string; button: string };
        howItWorks: {
            title: string;
            steps: readonly { title: string; desc: string }[];
        };
        techStack: {
            title: string;
            items: readonly { name: string; desc: string }[];
        };
        footer: { status: string };
    };
}
