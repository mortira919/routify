import type { EndpointConfig, EndpointAuth, ResponseDefinition } from '../types';

export const createDefaultEndpointConfig = (): EndpointConfig => ({
    method: 'GET',
    path: '/api/resource',

    // Swagger
    summary: 'Get resource',
    description: '',
    tags: [],
    deprecated: false,

    // Auth
    auth: createDefaultAuth(),

    // Parameters
    pathParams: [],
    queryParams: [],
    bodySchema: [],

    // Responses
    responses: [createDefaultResponse(200)],

    // Rate Limit
    rateLimit: undefined,
});

export const createDefaultAuth = (): EndpointAuth => ({
    required: false,
    type: 'none',
    roles: [],
    tokenLocation: 'header',
    headerName: 'Authorization',
});

export const createDefaultResponse = (statusCode: number = 200): ResponseDefinition => ({
    statusCode,
    description: statusCode === 200 ? 'Successful response' : 'Error response',
    schema: [],
    example: '',
});

export const HTTP_STATUS_CODES = [
    { code: 200, label: '200 OK' },
    { code: 201, label: '201 Created' },
    { code: 204, label: '204 No Content' },
    { code: 400, label: '400 Bad Request' },
    { code: 401, label: '401 Unauthorized' },
    { code: 403, label: '403 Forbidden' },
    { code: 404, label: '404 Not Found' },
    { code: 409, label: '409 Conflict' },
    { code: 422, label: '422 Unprocessable' },
    { code: 500, label: '500 Server Error' },
];

export const AUTH_TYPES = [
    { value: 'none', label: 'No Auth' },
    { value: 'jwt', label: 'JWT Token' },
    { value: 'apiKey', label: 'API Key' },
    { value: 'basic', label: 'Basic Auth' },
] as const;

export const DEFAULT_ROLES = ['admin', 'user', 'guest', 'moderator'];

export const COMMON_TAGS = ['Users', 'Auth', 'Products', 'Orders', 'Settings', 'Public'];
