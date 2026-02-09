# Schema Editor (Data Modeling)

The Schema Editor allows users to define the data structures (models) that their API will interact with. This serves as the blueprint for database operations and validation.

## Technical Realization

### Core Technologies
- **React**: Handles the complex form state and UI rendering.
- **Zustand**: Synchronizes model changes across the application.
- **Lucide React**: Provides icons for different data types (String, Int, Boolean, etc.).

### Implementation Details
- **Field Management**: Users can add, update, and remove fields from models. Each model automatically starts with a primary key (`_id`).
- **Data Types**: Supports multiple data types including String, Int, Float, Boolean, DateTime, and Json.
- **Validation Flags**: Fields can be marked as "Required" or "Unique".
- **Real-time Synchronization**: As users edit models, the workspace store is updated immediately, affecting the options available in Database nodes on the Canvas.

## Code Snippets

### Model Creation Logic
Default model structure with an ID field:
```typescript
const handleAddModel = () => {
    if (!newModelName.trim()) return;

    const model: DataModel = {
        name: newModelName.trim(),
        fields: [
            { name: '_id', type: 'String', isRequired: true, isUnique: true, isId: true },
        ],
    };
    addModel(model);
    setNewModelName('');
};
```

### Supported Data Types
The set of available field types:
```typescript
const FIELD_TYPES = [
    { value: 'String', labelKey: 'string', icon: Type },
    { value: 'Int', labelKey: 'integer', icon: Hash },
    { value: 'Float', labelKey: 'float', icon: Hash },
    { value: 'Boolean', labelKey: 'boolean', icon: ToggleLeft },
    { value: 'DateTime', labelKey: 'dateTime', icon: Calendar },
    { value: 'Json', labelKey: 'json', icon: FileJson },
] as const;
```

### Field Update Handler
Updating specific properties of a model field:
```typescript
const handleUpdateField = (modelName: string, fieldIndex: number, updates: Partial<ModelField>) => {
    const model = project.models.find(m => m.name === modelName);
    if (!model) return;

    const updatedFields = model.fields.map((field, i) =>
        i === fieldIndex ? { ...field, ...updates } : field
    );

    updateModel(modelName, { ...model, fields: updatedFields });
};
```
