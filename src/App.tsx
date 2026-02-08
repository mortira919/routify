import { useState } from 'react';
import { Play, FileJson, Settings, Check, Loader2, Sparkles, GraduationCap } from 'lucide-react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/Canvas/Canvas';
import { PropertyPanel } from './components/PropertyPanel/PropertyPanel';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { SchemaPanel } from './components/SchemaPanel/SchemaPanel';
import { TutorialPanel } from './components/TutorialPanel';
import { useProjectStore } from './store/projectStore';
import { useTranslation } from './i18n';
import { ProjectExporter } from './utils/ProjectExporter';
import './App.css';

// E-Commerce Demo Project - Full Store API with Roles
const createDemoProject = () => ({
  nodes: [
    // === PRODUCTS CRUD ===
    {
      id: 'ep-products-list',
      type: 'endpoint',
      position: { x: 80, y: 50 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'GET' as const,
          path: '/api/products',
          summary: 'Список товаров',
          description: 'Получить постраничный список товаров с фильтрами',
          tags: ['Товары', 'Публичное'],
          deprecated: false,
          auth: { required: false, type: 'none' as const, roles: [] },
          pathParams: [],
          queryParams: [
            { name: 'category', type: 'string' as const, required: false, description: 'Фильтр по категории' },
            { name: 'minPrice', type: 'number' as const, required: false, description: 'Минимальная цена' },
            { name: 'maxPrice', type: 'number' as const, required: false, description: 'Максимальная цена' },
            { name: 'limit', type: 'number' as const, required: false, description: 'Товаров на странице' },
          ],
          bodySchema: [],
          responses: [{ statusCode: 200, description: 'Список товаров', schema: [] }],
        }
      }
    },
    {
      id: 'db-products-list',
      type: 'database',
      position: { x: 420, y: 50 },
      data: { type: 'database' as const, config: { operation: 'list' as const, model: 'Product', filters: [], select: [] } }
    },
    {
      id: 'ep-products-create',
      type: 'endpoint',
      position: { x: 80, y: 160 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'POST' as const,
          path: '/api/products',
          summary: 'Создать товар',
          description: 'Добавить новый товар в каталог (только Админ/Менеджер)',
          tags: ['Товары', 'Админ'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['админ', 'менеджер'] },
          pathParams: [],
          queryParams: [],
          bodySchema: [
            { name: 'name', type: 'string' as const, required: true, description: 'Название товара' },
            { name: 'description', type: 'string' as const, required: false, description: 'Описание товара' },
            { name: 'price', type: 'number' as const, required: true, description: 'Цена в копейках' },
            { name: 'stock', type: 'number' as const, required: true, description: 'Количество на складе' },
            { name: 'category', type: 'string' as const, required: true, description: 'ID категории' },
          ],
          responses: [
            { statusCode: 201, description: 'Товар создан', schema: [] },
            { statusCode: 403, description: 'Доступ запрещён', schema: [] },
          ],
        }
      }
    },
    {
      id: 'db-products-create',
      type: 'database',
      position: { x: 420, y: 160 },
      data: { type: 'database' as const, config: { operation: 'create' as const, model: 'Product', filters: [], select: [] } }
    },
    {
      id: 'ep-products-update',
      type: 'endpoint',
      position: { x: 80, y: 270 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'PUT' as const,
          path: '/api/products/:id',
          summary: 'Обновить товар',
          description: 'Обновить данные товара (только Админ/Менеджер)',
          tags: ['Товары', 'Админ'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['админ', 'менеджер'] },
          pathParams: [{ name: 'id', type: 'string' as const, required: true, description: 'ID товара' }],
          queryParams: [],
          bodySchema: [
            { name: 'name', type: 'string' as const, required: false, description: 'Название товара' },
            { name: 'price', type: 'number' as const, required: false, description: 'Цена' },
            { name: 'stock', type: 'number' as const, required: false, description: 'Количество' },
          ],
          responses: [{ statusCode: 200, description: 'Товар обновлён', schema: [] }],
        }
      }
    },
    {
      id: 'db-products-update',
      type: 'database',
      position: { x: 420, y: 270 },
      data: { type: 'database' as const, config: { operation: 'update' as const, model: 'Product', filters: [], select: [] } }
    },
    // === ORDERS CRUD ===
    {
      id: 'ep-orders-list',
      type: 'endpoint',
      position: { x: 550, y: 50 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'GET' as const,
          path: '/api/orders',
          summary: 'Мои заказы',
          description: 'Получить заказы текущего пользователя (или все для админа)',
          tags: ['Заказы'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['покупатель', 'админ', 'менеджер'] },
          pathParams: [],
          queryParams: [
            { name: 'status', type: 'string' as const, required: false, description: 'Фильтр: pending, paid, shipped, delivered' },
          ],
          bodySchema: [],
          responses: [{ statusCode: 200, description: 'Список заказов', schema: [] }],
        }
      }
    },
    {
      id: 'db-orders-list',
      type: 'database',
      position: { x: 890, y: 50 },
      data: { type: 'database' as const, config: { operation: 'list' as const, model: 'Order', filters: [], select: [] } }
    },
    {
      id: 'ep-orders-create',
      type: 'endpoint',
      position: { x: 550, y: 160 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'POST' as const,
          path: '/api/orders',
          summary: 'Создать заказ',
          description: 'Оформить новый заказ (Покупатель)',
          tags: ['Заказы'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['покупатель', 'админ'] },
          pathParams: [],
          queryParams: [],
          bodySchema: [
            { name: 'items', type: 'array' as const, required: true, description: 'Массив {productId, quantity}' },
            { name: 'shippingAddress', type: 'string' as const, required: true, description: 'Адрес доставки' },
          ],
          responses: [
            { statusCode: 201, description: 'Заказ создан', schema: [] },
            { statusCode: 400, description: 'Неверные товары', schema: [] },
          ],
        }
      }
    },
    {
      id: 'db-orders-create',
      type: 'database',
      position: { x: 890, y: 160 },
      data: { type: 'database' as const, config: { operation: 'create' as const, model: 'Order', filters: [], select: [] } }
    },
    {
      id: 'ep-orders-status',
      type: 'endpoint',
      position: { x: 550, y: 270 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'PATCH' as const,
          path: '/api/orders/:id/status',
          summary: 'Обновить статус заказа',
          description: 'Изменить статус заказа (только Админ/Менеджер)',
          tags: ['Заказы', 'Админ'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['админ', 'менеджер'] },
          pathParams: [{ name: 'id', type: 'string' as const, required: true, description: 'ID заказа' }],
          queryParams: [],
          bodySchema: [
            { name: 'status', type: 'string' as const, required: true, description: 'Новый статус: paid, shipped, delivered' },
          ],
          responses: [{ statusCode: 200, description: 'Статус обновлён', schema: [] }],
        }
      }
    },
    {
      id: 'db-orders-status',
      type: 'database',
      position: { x: 890, y: 270 },
      data: { type: 'database' as const, config: { operation: 'update' as const, model: 'Order', filters: [], select: [] } }
    },
    // === USERS MANAGEMENT ===
    {
      id: 'ep-users-list',
      type: 'endpoint',
      position: { x: 80, y: 400 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'GET' as const,
          path: '/api/users',
          summary: 'Список пользователей',
          description: 'Получить всех зарегистрированных пользователей (только Админ)',
          tags: ['Пользователи', 'Админ'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['админ'] },
          pathParams: [],
          queryParams: [
            { name: 'role', type: 'string' as const, required: false, description: 'Фильтр по роли' },
          ],
          bodySchema: [],
          responses: [{ statusCode: 200, description: 'Список пользователей', schema: [] }],
        }
      }
    },
    {
      id: 'db-users-list',
      type: 'database',
      position: { x: 420, y: 400 },
      data: { type: 'database' as const, config: { operation: 'list' as const, model: 'User', filters: [], select: [] } }
    },
    {
      id: 'ep-users-register',
      type: 'endpoint',
      position: { x: 80, y: 510 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'POST' as const,
          path: '/api/auth/register',
          summary: 'Регистрация',
          description: 'Создать новый аккаунт покупателя',
          tags: ['Авторизация', 'Публичное'],
          deprecated: false,
          auth: { required: false, type: 'none' as const, roles: [] },
          pathParams: [],
          queryParams: [],
          bodySchema: [
            { name: 'email', type: 'string' as const, required: true, description: 'Email адрес' },
            { name: 'password', type: 'string' as const, required: true, description: 'Пароль' },
            { name: 'name', type: 'string' as const, required: true, description: 'Полное имя' },
          ],
          responses: [
            { statusCode: 201, description: 'Пользователь зарегистрирован', schema: [] },
            { statusCode: 409, description: 'Email уже занят', schema: [] },
          ],
        }
      }
    },
    {
      id: 'db-users-register',
      type: 'database',
      position: { x: 420, y: 510 },
      data: { type: 'database' as const, config: { operation: 'create' as const, model: 'User', filters: [], select: [] } }
    },
    // === CATEGORIES ===
    {
      id: 'ep-categories-list',
      type: 'endpoint',
      position: { x: 550, y: 400 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'GET' as const,
          path: '/api/categories',
          summary: 'Список категорий',
          description: 'Получить все категории товаров',
          tags: ['Категории', 'Публичное'],
          deprecated: false,
          auth: { required: false, type: 'none' as const, roles: [] },
          pathParams: [],
          queryParams: [],
          bodySchema: [],
          responses: [{ statusCode: 200, description: 'Список категорий', schema: [] }],
        }
      }
    },
    {
      id: 'db-categories-list',
      type: 'database',
      position: { x: 890, y: 400 },
      data: { type: 'database' as const, config: { operation: 'list' as const, model: 'Category', filters: [], select: [] } }
    },
    {
      id: 'ep-categories-create',
      type: 'endpoint',
      position: { x: 550, y: 510 },
      data: {
        type: 'endpoint' as const,
        config: {
          method: 'POST' as const,
          path: '/api/categories',
          summary: 'Создать категорию',
          description: 'Добавить новую категорию товаров (только Админ)',
          tags: ['Категории', 'Админ'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['админ'] },
          pathParams: [],
          queryParams: [],
          bodySchema: [
            { name: 'name', type: 'string' as const, required: true, description: 'Название категории' },
            { name: 'slug', type: 'string' as const, required: true, description: 'URL slug' },
          ],
          responses: [{ statusCode: 201, description: 'Категория создана', schema: [] }],
        }
      }
    },
    {
      id: 'db-categories-create',
      type: 'database',
      position: { x: 890, y: 510 },
      data: { type: 'database' as const, config: { operation: 'create' as const, model: 'Category', filters: [], select: [] } }
    },
  ],
  edges: [
    // Products
    { id: 'e-prod-list', source: 'ep-products-list', target: 'db-products-list' },
    { id: 'e-prod-create', source: 'ep-products-create', target: 'db-products-create' },
    { id: 'e-prod-update', source: 'ep-products-update', target: 'db-products-update' },
    // Orders
    { id: 'e-ord-list', source: 'ep-orders-list', target: 'db-orders-list' },
    { id: 'e-ord-create', source: 'ep-orders-create', target: 'db-orders-create' },
    { id: 'e-ord-status', source: 'ep-orders-status', target: 'db-orders-status' },
    // Users
    { id: 'e-usr-list', source: 'ep-users-list', target: 'db-users-list' },
    { id: 'e-usr-reg', source: 'ep-users-register', target: 'db-users-register' },
    // Categories
    { id: 'e-cat-list', source: 'ep-categories-list', target: 'db-categories-list' },
    { id: 'e-cat-create', source: 'ep-categories-create', target: 'db-categories-create' },
  ],
  models: [
    {
      name: 'Product',
      fields: [
        { name: '_id', type: 'String', isRequired: true, isUnique: true, isId: true },
        { name: 'name', type: 'String', isRequired: true, isUnique: false, isId: false },
        { name: 'description', type: 'String', isRequired: false, isUnique: false, isId: false },
        { name: 'price', type: 'Int', isRequired: true, isUnique: false, isId: false },
        { name: 'stock', type: 'Int', isRequired: true, isUnique: false, isId: false },
        { name: 'category', type: 'String', isRequired: true, isUnique: false, isId: false },
        { name: 'images', type: 'Json', isRequired: false, isUnique: false, isId: false },
        { name: 'createdAt', type: 'DateTime', isRequired: true, isUnique: false, isId: false },
      ]
    },
    {
      name: 'User',
      fields: [
        { name: '_id', type: 'String', isRequired: true, isUnique: true, isId: true },
        { name: 'email', type: 'String', isRequired: true, isUnique: true, isId: false },
        { name: 'password', type: 'String', isRequired: true, isUnique: false, isId: false },
        { name: 'name', type: 'String', isRequired: true, isUnique: false, isId: false },
        { name: 'role', type: 'String', isRequired: true, isUnique: false, isId: false },
        { name: 'createdAt', type: 'DateTime', isRequired: true, isUnique: false, isId: false },
      ]
    },
    {
      name: 'Order',
      fields: [
        { name: '_id', type: 'String', isRequired: true, isUnique: true, isId: true },
        { name: 'userId', type: 'String', isRequired: true, isUnique: false, isId: false },
        { name: 'items', type: 'Json', isRequired: true, isUnique: false, isId: false },
        { name: 'total', type: 'Int', isRequired: true, isUnique: false, isId: false },
        { name: 'status', type: 'String', isRequired: true, isUnique: false, isId: false },
        { name: 'shippingAddress', type: 'String', isRequired: true, isUnique: false, isId: false },
        { name: 'createdAt', type: 'DateTime', isRequired: true, isUnique: false, isId: false },
      ]
    },
    {
      name: 'Category',
      fields: [
        { name: '_id', type: 'String', isRequired: true, isUnique: true, isId: true },
        { name: 'name', type: 'String', isRequired: true, isUnique: true, isId: false },
        { name: 'slug', type: 'String', isRequired: true, isUnique: true, isId: false },
        { name: 'productCount', type: 'Int', isRequired: false, isUnique: false, isId: false },
      ]
    },
  ]
});

function App() {
  const { project, setProjectName, setProject, importProject } = useProjectStore();
  const t = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const exporter = new ProjectExporter(project);
      await exporter.exportAsZip();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to generate code:', error);
      alert(t.toasts.generateError);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const json = event.target?.result as string;
          try {
            importProject(json);
            alert(t.toasts.importSuccess);
          } catch (error) {
            console.error('Failed to import:', error);
            alert(t.toasts.importError);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleLoadDemo = () => {
    const demo = createDemoProject();
    setProject({
      ...project,
      name: 'Магазин API',
      description: 'Полнофункциональный бэкенд магазина: Товары, Заказы, Пользователи, Категории. Ролевой доступ: админ, менеджер, покупатель.',
      nodes: demo.nodes as typeof project.nodes,
      edges: demo.edges,
      models: demo.models as typeof project.models,
    });
  };

  return (
    <div className="app">
      <Sidebar onOpenSchema={() => setShowSchema(true)} />

      <main className="main">
        <header className="header">
          <div className="projectName">
            <input
              type="text"
              className="projectNameInput"
              value={project.name}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <div className="status">
              <span className="statusDot" />
              {t.header.saved}
            </div>
          </div>

          <div className="headerActions">
            <button className="headerBtn headerBtn--tutorial" onClick={() => setShowTutorial(true)}>
              <GraduationCap size={16} />
              {t.header.tutorial}
            </button>
            <button className="headerBtn headerBtn--demo" onClick={handleLoadDemo}>
              <Sparkles size={16} />
              {t.header.loadDemo}
            </button>
            <button className="headerBtn" onClick={handleImport}>
              <FileJson size={16} />
              {t.header.import}
            </button>
            <button className="headerBtn" onClick={() => setShowSettings(true)}>
              <Settings size={16} />
              {t.header.settings}
            </button>
            <button
              className="headerBtn headerBtn--primary"
              onClick={handleGenerateCode}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="spinning" />
                  {t.header.generating}
                </>
              ) : showSuccess ? (
                <>
                  <Check size={16} />
                  {t.header.downloaded}
                </>
              ) : (
                <>
                  <Play size={16} />
                  {t.header.generateCode}
                </>
              )}
            </button>
          </div>
        </header>

        <div className="canvasWrapper">
          <Canvas />
        </div>
      </main>

      <PropertyPanel />

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <SchemaPanel isOpen={showSchema} onClose={() => setShowSchema(false)} />
      <TutorialPanel isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

      {showSuccess && (
        <div className="toast">
          {t.toasts.backendGenerated}
        </div>
      )}
    </div>
  );
}

export default App;
