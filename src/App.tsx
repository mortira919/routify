import { useState } from 'react';
import { Play, FileJson, Settings, Check, Loader2, Sparkles } from 'lucide-react';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Canvas } from './components/Canvas/Canvas';
import { PropertyPanel } from './components/PropertyPanel/PropertyPanel';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { SchemaPanel } from './components/SchemaPanel/SchemaPanel';
import { useProjectStore } from './store/projectStore';
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
          summary: 'List all products',
          description: 'Get paginated list of products with optional filters',
          tags: ['Products', 'Public'],
          deprecated: false,
          auth: { required: false, type: 'none' as const, roles: [] },
          pathParams: [],
          queryParams: [
            { name: 'category', type: 'string' as const, required: false, description: 'Filter by category' },
            { name: 'minPrice', type: 'number' as const, required: false, description: 'Minimum price' },
            { name: 'maxPrice', type: 'number' as const, required: false, description: 'Maximum price' },
            { name: 'limit', type: 'number' as const, required: false, description: 'Items per page' },
          ],
          bodySchema: [],
          responses: [{ statusCode: 200, description: 'List of products', schema: [] }],
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
          summary: 'Create product',
          description: 'Add new product to catalog (Admin/Manager only)',
          tags: ['Products', 'Admin'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['admin', 'manager'] },
          pathParams: [],
          queryParams: [],
          bodySchema: [
            { name: 'name', type: 'string' as const, required: true, description: 'Product name' },
            { name: 'description', type: 'string' as const, required: false, description: 'Product description' },
            { name: 'price', type: 'number' as const, required: true, description: 'Price in cents' },
            { name: 'stock', type: 'number' as const, required: true, description: 'Available stock' },
            { name: 'category', type: 'string' as const, required: true, description: 'Category ID' },
          ],
          responses: [
            { statusCode: 201, description: 'Product created', schema: [] },
            { statusCode: 403, description: 'Forbidden - Admin only', schema: [] },
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
          summary: 'Update product',
          description: 'Update product details (Admin/Manager only)',
          tags: ['Products', 'Admin'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['admin', 'manager'] },
          pathParams: [{ name: 'id', type: 'string' as const, required: true, description: 'Product ID' }],
          queryParams: [],
          bodySchema: [
            { name: 'name', type: 'string' as const, required: false, description: 'Product name' },
            { name: 'price', type: 'number' as const, required: false, description: 'Price' },
            { name: 'stock', type: 'number' as const, required: false, description: 'Stock' },
          ],
          responses: [{ statusCode: 200, description: 'Product updated', schema: [] }],
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
          summary: 'Get my orders',
          description: 'Get orders for current user (or all for admin)',
          tags: ['Orders'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['customer', 'admin', 'manager'] },
          pathParams: [],
          queryParams: [
            { name: 'status', type: 'string' as const, required: false, description: 'Filter: pending, paid, shipped, delivered' },
          ],
          bodySchema: [],
          responses: [{ statusCode: 200, description: 'List of orders', schema: [] }],
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
          summary: 'Create order',
          description: 'Place a new order (Customer)',
          tags: ['Orders'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['customer', 'admin'] },
          pathParams: [],
          queryParams: [],
          bodySchema: [
            { name: 'items', type: 'array' as const, required: true, description: 'Array of {productId, quantity}' },
            { name: 'shippingAddress', type: 'string' as const, required: true, description: 'Shipping address' },
          ],
          responses: [
            { statusCode: 201, description: 'Order created', schema: [] },
            { statusCode: 400, description: 'Invalid items', schema: [] },
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
          summary: 'Update order status',
          description: 'Change order status (Admin/Manager only)',
          tags: ['Orders', 'Admin'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['admin', 'manager'] },
          pathParams: [{ name: 'id', type: 'string' as const, required: true, description: 'Order ID' }],
          queryParams: [],
          bodySchema: [
            { name: 'status', type: 'string' as const, required: true, description: 'New status: paid, shipped, delivered' },
          ],
          responses: [{ statusCode: 200, description: 'Status updated', schema: [] }],
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
          summary: 'List all users',
          description: 'Get all registered users (Admin only)',
          tags: ['Users', 'Admin'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['admin'] },
          pathParams: [],
          queryParams: [
            { name: 'role', type: 'string' as const, required: false, description: 'Filter by role' },
          ],
          bodySchema: [],
          responses: [{ statusCode: 200, description: 'List of users', schema: [] }],
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
          summary: 'Register user',
          description: 'Create new customer account',
          tags: ['Auth', 'Public'],
          deprecated: false,
          auth: { required: false, type: 'none' as const, roles: [] },
          pathParams: [],
          queryParams: [],
          bodySchema: [
            { name: 'email', type: 'string' as const, required: true, description: 'Email address' },
            { name: 'password', type: 'string' as const, required: true, description: 'Password' },
            { name: 'name', type: 'string' as const, required: true, description: 'Full name' },
          ],
          responses: [
            { statusCode: 201, description: 'User registered', schema: [] },
            { statusCode: 409, description: 'Email already exists', schema: [] },
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
          summary: 'List categories',
          description: 'Get all product categories',
          tags: ['Categories', 'Public'],
          deprecated: false,
          auth: { required: false, type: 'none' as const, roles: [] },
          pathParams: [],
          queryParams: [],
          bodySchema: [],
          responses: [{ statusCode: 200, description: 'List of categories', schema: [] }],
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
          summary: 'Create category',
          description: 'Add new product category (Admin only)',
          tags: ['Categories', 'Admin'],
          deprecated: false,
          auth: { required: true, type: 'jwt' as const, roles: ['admin'] },
          pathParams: [],
          queryParams: [],
          bodySchema: [
            { name: 'name', type: 'string' as const, required: true, description: 'Category name' },
            { name: 'slug', type: 'string' as const, required: true, description: 'URL slug' },
          ],
          responses: [{ statusCode: 201, description: 'Category created', schema: [] }],
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      const exporter = new ProjectExporter(project);
      await exporter.exportAsZip();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to generate code:', error);
      alert('Failed to generate code. Please try again.');
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
            alert('Project imported successfully!');
          } catch (error) {
            console.error('Failed to import:', error);
            alert('Failed to import project. Make sure it\'s a valid Routify project file.');
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
      name: 'E-Commerce Shop API',
      description: 'Full-featured shop backend with Products, Orders, Users, and Categories. Role-based access: admin, manager, customer.',
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
              Saved
            </div>
          </div>

          <div className="headerActions">
            <button className="headerBtn headerBtn--demo" onClick={handleLoadDemo}>
              <Sparkles size={16} />
              Load Demo
            </button>
            <button className="headerBtn" onClick={handleImport}>
              <FileJson size={16} />
              Import
            </button>
            <button className="headerBtn" onClick={() => setShowSettings(true)}>
              <Settings size={16} />
              Settings
            </button>
            <button
              className="headerBtn headerBtn--primary"
              onClick={handleGenerateCode}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="spinning" />
                  Generating...
                </>
              ) : showSuccess ? (
                <>
                  <Check size={16} />
                  Downloaded!
                </>
              ) : (
                <>
                  <Play size={16} />
                  Generate Code
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

      {showSuccess && (
        <div className="toast">
          ✅ Backend generated successfully! Check your downloads folder.
        </div>
      )}
    </div>
  );
}

export default App;
