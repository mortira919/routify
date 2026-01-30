# Routify

No-code backend builder - создавай REST API визуально без написания кода.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Express](https://img.shields.io/badge/Express-4-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)

## Что это?

Routify - визуальный конструктор бэкенда. Перетаскиваешь ноды, соединяешь их, нажимаешь Generate - получаешь готовый Express + MongoDB проект.

## Возможности

- Drag & drop canvas для построения API
- Ноды: Endpoint, Database, Auth, Response  
- Генерация Express.js сервера
- Генерация Mongoose моделей
- Swagger/OpenAPI документация
- Role-based access control (JWT)
- Экспорт в ZIP архив

## Быстрый старт

```bash
# Клонируй репозиторий
git clone https://github.com/mortira919/routify.git
cd routify

# Установи зависимости
npm install

# Запусти dev сервер
npm run dev
```

Открой http://localhost:5173

## Как пользоваться

1. **Load Demo** - загрузи E-Commerce демо проект
2. **Models** - создай свои модели данных (User, Product, Order...)
3. **Перетащи ноды** - Endpoint для роутов, Database для CRUD операций
4. **Соедини ноды** - связи показывают flow данных
5. **Settings** - настрой БД, порт, CORS
6. **Generate Code** - скачай готовый бэкенд

## Структура проекта

```
src/
  components/      # React компоненты
    Canvas/        # Рабочая область с нодами
    Sidebar/       # Панель с доступными нодами
    PropertyPanel/ # Редактор свойств выбранной ноды
    SchemaBuilder/ # Редактор моделей данных
  generators/      # Генераторы кода
    express/       # Express.js генератор
    swagger/       # OpenAPI генератор
  nodes/           # Визуальные ноды (Endpoint, Database...)
  store/           # Zustand state management
  types/           # TypeScript типы
  utils/           # Утилиты и экспортер
```

## Генерируемый бэкенд

После нажатия Generate Code скачивается ZIP с:

- `src/index.js` - Express сервер
- `src/routes/*.js` - API роуты
- `src/models/*.js` - Mongoose модели
- `src/swagger.js` - OpenAPI спецификация
- `package.json` - зависимости
- `README.md` - документация

## Технологии

**Frontend:**
- React 18 + TypeScript
- React Flow (canvas)
- Zustand (state)
- Vite (build)

**Генерируемый Backend:**
- Express.js
- MongoDB + Mongoose
- Swagger UI
- JWT Auth

## Лицензия

MIT
