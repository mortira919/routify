import type { EndpointConfig, EndpointAuth, ResponseDefinition } from '../types';

export const createDefaultEndpointConfig = (): EndpointConfig => ({
    method: 'GET',
    path: '/api/resource',

    // Swagger
    summary: 'Получить ресурс',
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
    description: statusCode === 200 ? 'Успешный ответ' : 'Ответ с ошибкой',
    schema: [],
    example: '',
});

export const HTTP_STATUS_CODES = [
    { code: 200, label: '200 OK' },
    { code: 201, label: '201 Создано' },
    { code: 204, label: '204 Нет содержимого' },
    { code: 400, label: '400 Неверный запрос' },
    { code: 401, label: '401 Не авторизован' },
    { code: 403, label: '403 Запрещено' },
    { code: 404, label: '404 Не найдено' },
    { code: 409, label: '409 Конфликт' },
    { code: 422, label: '422 Необрабатываемый' },
    { code: 500, label: '500 Ошибка сервера' },
];

export const AUTH_TYPES = [
    { value: 'none', label: 'Без авторизации' },
    { value: 'jwt', label: 'JWT токен' },
    { value: 'apiKey', label: 'API ключ' },
    { value: 'basic', label: 'Basic авторизация' },
] as const;

export const DEFAULT_ROLES = ['админ', 'пользователь', 'гость', 'модератор'];

export const COMMON_TAGS = ['Пользователи', 'Авторизация', 'Товары', 'Заказы', 'Настройки', 'Публичное'];
