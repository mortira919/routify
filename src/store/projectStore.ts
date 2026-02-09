import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type {
    FlowNode,
    FlowEdge,
    Project,
    DataModel,
    ProjectSettings,
    EndpointConfig,
    DatabaseConfig,
    LogicConfig,
    AuthConfig,
    ResponseConfig
} from '../types';
import { v4 as uuid } from 'uuid';

interface ProjectState {
    project: Project;
    selectedNodeId: string | null;

    setProject: (project: Project) => void;
    setProjectName: (name: string) => void;

    addNode: (type: string, position: { x: number; y: number }) => void;
    updateNode: (nodeId: string, data: Partial<FlowNode['data']>) => void;
    removeNode: (nodeId: string) => void;
    setSelectedNode: (nodeId: string | null) => void;
    updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;

    addEdge: (edge: FlowEdge) => void;
    removeEdge: (edgeId: string) => void;

    addModel: (model: DataModel) => void;
    updateModel: (name: string, model: DataModel) => void;
    removeModel: (name: string) => void;

    updateSettings: (settings: Partial<ProjectSettings>) => void;

    resetProject: () => void;
    exportProject: () => string;
    importProject: (json: string) => void;

    hasCompletedOnboarding: boolean;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
}

const defaultSettings: ProjectSettings = {
    database: 'postgresql',
    port: 3000,
    basePath: '/api',
    enableSwagger: true,
    enableCors: true,
    corsOrigins: ['*'],
    target: 'typescript',
    apiStyle: 'rest',
};

const createDefaultProject = (): Project => ({
    id: uuid(),
    name: 'Untitled Project',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    nodes: [],
    edges: [],
    models: [],
    settings: defaultSettings,
});

const defaultEndpointConfig: EndpointConfig = {
    method: 'GET',
    path: '/api/resource',

    // Swagger
    summary: 'Get resource',
    description: '',
    tags: [],
    deprecated: false,

    // Auth
    auth: {
        required: false,
        type: 'none',
        roles: [],
        tokenLocation: 'header',
        headerName: 'Authorization',
    },

    // Parameters
    pathParams: [],
    queryParams: [],
    bodySchema: [],

    // Responses
    responses: [{
        statusCode: 200,
        description: 'Successful response',
        schema: [],
        example: '',
    }],
};

const defaultDatabaseConfig: DatabaseConfig = {
    operation: 'read',
    model: '',
    filters: [],
    select: [],
};

const defaultLogicConfig: LogicConfig = {
    type: 'condition',
    conditions: [],
};

const defaultAuthConfig: AuthConfig = {
    type: 'jwt',
    tokenLocation: 'header',
    headerName: 'Authorization',
    roles: [],
};

const defaultResponseConfig: ResponseConfig = {
    statusCode: 200,
    contentType: 'json',
    schema: [],
    headers: {},
};

const getDefaultConfig = (type: string) => {
    switch (type) {
        case 'endpoint': return { type: 'endpoint' as const, config: { ...defaultEndpointConfig } };
        case 'database': return { type: 'database' as const, config: { ...defaultDatabaseConfig } };
        case 'logic': return { type: 'logic' as const, config: { ...defaultLogicConfig } };
        case 'auth': return { type: 'auth' as const, config: { ...defaultAuthConfig } };
        case 'response': return { type: 'response' as const, config: { ...defaultResponseConfig } };
        default: return { type: 'endpoint' as const, config: { ...defaultEndpointConfig } };
    }
};

export const useProjectStore = create<ProjectState>()(
    persist(
        immer((set, get) => ({
            project: createDefaultProject(),
            selectedNodeId: null,
            hasCompletedOnboarding: false,

            completeOnboarding: () => set((state) => {
                state.hasCompletedOnboarding = true;
            }),

            resetOnboarding: () => set((state) => {
                state.hasCompletedOnboarding = false;
            }),

            setProject: (project) => set((state) => {
                state.project = project;
            }),

            setProjectName: (name) => set((state) => {
                state.project.name = name;
                state.project.updatedAt = new Date();
            }),

            addNode: (type, position) => set((state) => {
                const newNode: FlowNode = {
                    id: uuid(),
                    type,
                    position,
                    data: getDefaultConfig(type),
                };
                state.project.nodes.push(newNode);
                state.project.updatedAt = new Date();
                state.selectedNodeId = newNode.id;
            }),

            updateNode: (nodeId, data) => set((state) => {
                const node = state.project.nodes.find(n => n.id === nodeId);
                if (node) {
                    node.data = { ...node.data, ...data } as typeof node.data;
                    state.project.updatedAt = new Date();
                }
            }),

            removeNode: (nodeId) => set((state) => {
                state.project.nodes = state.project.nodes.filter(n => n.id !== nodeId);
                state.project.edges = state.project.edges.filter(
                    e => e.source !== nodeId && e.target !== nodeId
                );
                if (state.selectedNodeId === nodeId) {
                    state.selectedNodeId = null;
                }
                state.project.updatedAt = new Date();
            }),

            setSelectedNode: (nodeId) => set((state) => {
                state.selectedNodeId = nodeId;
            }),

            updateNodePosition: (nodeId, position) => set((state) => {
                const node = state.project.nodes.find(n => n.id === nodeId);
                if (node) {
                    node.position = position;
                }
            }),

            addEdge: (edge) => set((state) => {
                const exists = state.project.edges.some(
                    e => e.source === edge.source && e.target === edge.target
                );
                if (!exists) {
                    state.project.edges.push(edge);
                    state.project.updatedAt = new Date();
                }
            }),

            removeEdge: (edgeId) => set((state) => {
                state.project.edges = state.project.edges.filter(e => e.id !== edgeId);
                state.project.updatedAt = new Date();
            }),

            addModel: (model) => set((state) => {
                state.project.models.push(model);
                state.project.updatedAt = new Date();
            }),

            updateModel: (name, model) => set((state) => {
                const index = state.project.models.findIndex(m => m.name === name);
                if (index !== -1) {
                    state.project.models[index] = model;
                    state.project.updatedAt = new Date();
                }
            }),

            removeModel: (name) => set((state) => {
                state.project.models = state.project.models.filter(m => m.name !== name);
                state.project.updatedAt = new Date();
            }),

            updateSettings: (settings) => set((state) => {
                state.project.settings = { ...state.project.settings, ...settings };
                state.project.updatedAt = new Date();
            }),

            resetProject: () => set((state) => {
                state.project = createDefaultProject();
                state.selectedNodeId = null;
            }),

            exportProject: () => {
                return JSON.stringify(get().project, null, 2);
            },

            importProject: (json) => set((state) => {
                try {
                    const project = JSON.parse(json);

                    // Migrate nodes to new format if needed
                    if (project.nodes) {
                        project.nodes = project.nodes.map((node: FlowNode) => {
                            if (node.data.type === 'endpoint') {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const config = node.data.config as any;
                                // Migrate old EndpointConfig to new format
                                return {
                                    ...node,
                                    data: {
                                        type: 'endpoint',
                                        config: {
                                            method: config.method || 'GET',
                                            path: config.path || '/api/resource',
                                            summary: config.summary || config.description || '',
                                            description: config.description || '',
                                            tags: config.tags || [],
                                            deprecated: config.deprecated || false,
                                            auth: config.auth || {
                                                required: false,
                                                type: 'none',
                                                roles: [],
                                            },
                                            pathParams: config.pathParams || [],
                                            queryParams: config.queryParams || [],
                                            bodySchema: config.bodySchema || [],
                                            responses: config.responses || [{
                                                statusCode: config.statusCode || 200,
                                                description: 'Successful response',
                                                schema: config.responseSchema || [],
                                            }],
                                        }
                                    }
                                };
                            }
                            return node;
                        });
                    }

                    // Ensure settings exist
                    project.settings = {
                        ...defaultSettings,
                        ...(project.settings || {}),
                    };

                    state.project = project;
                    state.selectedNodeId = null;
                } catch (error) {
                    console.error('Failed to import project:', error);
                    throw error;
                }
            }),
        })),
        {
            name: 'routify-storage',
        }
    )
);
