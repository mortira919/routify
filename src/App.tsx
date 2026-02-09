import { useState, useEffect } from 'react';
import {
  Button,
  Space,
  Input,
  Tooltip,
  Badge,
  message
} from 'antd';
import {
  Play, FileJson, Settings,
  Loader2, Sparkles, GraduationCap,
  Menu, X, Home
} from 'lucide-react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/Canvas/Canvas';
import { PropertyPanel } from './components/PropertyPanel/PropertyPanel';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { SchemaPanel } from './components/SchemaPanel/SchemaPanel';
import { TutorialPanel } from './components/TutorialPanel';
import { Onboarding } from './components/Onboarding';
import { MobileOverlay } from './components/MobileOverlay';
import { useProjectStore } from './store/projectStore';
import { useTranslation } from './i18n';
import { LanguageSwitcher } from './components/LanguageSwitcher/LanguageSwitcher';
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
  ],
  edges: [
    // Products
    { id: 'e-prod-list', source: 'ep-products-list', target: 'db-products-list' },
    { id: 'e-prod-create', source: 'ep-products-create', target: 'db-products-create' },
    { id: 'e-prod-update', source: 'ep-products-update', target: 'db-products-update' },
    // Users
    { id: 'e-usr-list', source: 'ep-users-list', target: 'db-users-list' },
    { id: 'e-usr-reg', source: 'ep-users-register', target: 'db-users-register' },
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
  ]
});

function App() {
  const { project, setProjectName, setProject, importProject, hasCompletedOnboarding, resetOnboarding } = useProjectStore();
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileOnboarding, setShowMobileOnboarding] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileOnboarding(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const exporter = new ProjectExporter(project);
      await exporter.exportAsZip();
      messageApi.success(t.header.downloaded);
    } catch (error) {
      console.error('Failed to generate code:', error);
      messageApi.error(t.toasts.generateError);
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
            messageApi.success(t.toasts.importSuccess);
          } catch (error) {
            console.error('Failed to import:', error);
            messageApi.error(t.toasts.importError);
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
    messageApi.info('Demo project loaded');
  };

  // Mobile overlay - show when on mobile and not viewing onboarding
  if (isMobile && hasCompletedOnboarding && !showMobileOnboarding) {
    return (
      <>
        {contextHolder}
        <MobileOverlay onShowOnboarding={() => setShowMobileOnboarding(true)} />
      </>
    );
  }

  // Mobile onboarding - show presentation on mobile
  if (isMobile && showMobileOnboarding) {
    return (
      <>
        {contextHolder}
        <Onboarding />
      </>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <>
        {contextHolder}
        <Onboarding />
      </>
    );
  }

  return (
    <div className="app">
      {contextHolder}
      {mobileMenuOpen && (
        <div
          className="mobileOverlay mobileOverlay--visible"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        onOpenSchema={() => setShowSchema(true)}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <main className="main">
        <header className="header">
          <Tooltip title="На главную">
            <Button
              className="headerBtn--home"
              icon={<Home size={18} />}
              onClick={resetOnboarding}
              type="text"
            />
          </Tooltip>

          <Button
            className="mobileMenuBtn"
            icon={mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />

          <div className="projectName">
            <Input
              variant="borderless"
              className="projectNameInput"
              value={project.name}
              onChange={(e) => setProjectName(e.target.value)}
              style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}
            />
            <div className="status">
              <Badge status="success" />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px' }}>{t.header.saved}</span>
            </div>
          </div>

          <div className="headerActions">
            <Space size="middle">
              <Tooltip title={t.header.tutorial}>
                <Button
                  icon={<GraduationCap size={18} />}
                  onClick={() => setShowTutorial(true)}
                  className="headerBtn--tutorial"
                  type="primary"
                >
                  <span className="hideOnMobile">{t.header.tutorial}</span>
                </Button>
              </Tooltip>

              <LanguageSwitcher />

              <Tooltip title={t.header.loadDemo}>
                <Button
                  icon={<Sparkles size={18} />}
                  onClick={handleLoadDemo}
                  className="headerBtn--demo"
                >
                  <span className="hideOnMobile">{t.header.loadDemo}</span>
                </Button>
              </Tooltip>

              <Button
                icon={<FileJson size={18} />}
                onClick={handleImport}
              >
                <span className="hideOnMobile">{t.header.import}</span>
              </Button>

              <Button
                icon={<Settings size={18} />}
                onClick={() => setShowSettings(true)}
              >
                <span className="hideOnMobile">{t.header.settings}</span>
              </Button>

              <Button
                type="primary"
                icon={isGenerating ? <Loader2 size={18} className="spinning" /> : <Play size={18} />}
                onClick={handleGenerateCode}
                disabled={isGenerating}
              >
                <span>{isGenerating ? t.header.generating : t.header.generateCode}</span>
              </Button>
            </Space>
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
    </div>
  );
}

export default App;
