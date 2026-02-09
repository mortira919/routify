import { useState } from 'react';
import {
    Plus, Trash2, Database, Key, Hash,
    ToggleLeft, Calendar, FileJson, Type,
    Link2, ChevronDown, ChevronRight, Asterisk
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTranslation } from '../../i18n';
import type { DataModel, ModelField } from '../../types';
import styles from './SchemaBuilder.module.css';

const FIELD_TYPES = [
    { value: 'String', labelKey: 'string', icon: Type },
    { value: 'Int', labelKey: 'integer', icon: Hash },
    { value: 'Float', labelKey: 'float', icon: Hash },
    { value: 'Boolean', labelKey: 'boolean', icon: ToggleLeft },
    { value: 'DateTime', labelKey: 'dateTime', icon: Calendar },
    { value: 'Json', labelKey: 'json', icon: FileJson },
] as const;

const createDefaultField = (): ModelField => ({
    name: '',
    type: 'String',
    isRequired: false,
    isUnique: false,
    isId: false,
});

export const SchemaBuilder: React.FC = () => {
    const { project, addModel, updateModel, removeModel } = useProjectStore();
    const { t } = useTranslation();
    const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
    const [newModelName, setNewModelName] = useState('');
    const [editingField, setEditingField] = useState<{ model: string; index: number } | null>(null);

    const toggleExpand = (modelName: string) => {
        setExpandedModels(prev => {
            const next = new Set(prev);
            if (next.has(modelName)) {
                next.delete(modelName);
            } else {
                next.add(modelName);
            }
            return next;
        });
    };

    const handleAddModel = () => {
        if (!newModelName.trim()) return;

        // Check for duplicates
        if (project.models.some(m => m.name.toLowerCase() === newModelName.toLowerCase())) {
            alert(t.schemaBuilder.errors.duplicateModel);
            return;
        }

        const model: DataModel = {
            name: newModelName.trim(),
            fields: [
                { name: '_id', type: 'String', isRequired: true, isUnique: true, isId: true },
            ],
        };
        addModel(model);
        setNewModelName('');
        setExpandedModels(prev => new Set(prev).add(model.name));
    };

    const handleAddField = (modelName: string) => {
        const model = project.models.find(m => m.name === modelName);
        if (!model) return;

        const newField = createDefaultField();
        newField.name = `field${model.fields.length}`;

        updateModel(modelName, {
            ...model,
            fields: [...model.fields, newField],
        });

        setEditingField({ model: modelName, index: model.fields.length });
    };

    const handleUpdateField = (modelName: string, fieldIndex: number, updates: Partial<ModelField>) => {
        const model = project.models.find(m => m.name === modelName);
        if (!model) return;

        const updatedFields = model.fields.map((field, i) =>
            i === fieldIndex ? { ...field, ...updates } : field
        );

        updateModel(modelName, { ...model, fields: updatedFields });
    };

    const handleRemoveField = (modelName: string, fieldIndex: number) => {
        const model = project.models.find(m => m.name === modelName);
        if (!model) return;

        const field = model.fields[fieldIndex];
        if (field.isId) {
            alert(t.schemaBuilder.errors.cannotRemoveId);
            return;
        }

        updateModel(modelName, {
            ...model,
            fields: model.fields.filter((_, i) => i !== fieldIndex),
        });
    };

    const handleRemoveModel = (modelName: string) => {
        if (!confirm(t.schemaBuilder.errors.confirmDelete.replace('{name}', modelName))) return;
        removeModel(modelName);
    };

    const getFieldIcon = (type: string) => {
        const fieldType = FIELD_TYPES.find(t => t.value === type);
        return fieldType?.icon || Type;
    };

    const getFieldTypeLabel = (labelKey: string) => {
        const labels = t.schemaBuilder.fieldTypes as Record<string, string>;
        return labels[labelKey] || labelKey;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Database size={20} className={styles.headerIcon} />
                <h2>{t.schemaBuilder.title}</h2>
                <span className={styles.badge}>{project.models.length}</span>
            </div>

            {/* Add new model */}
            <div className={styles.addModel}>
                <input
                    type="text"
                    placeholder={t.schemaBuilder.newModelPlaceholder}
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddModel()}
                    className={styles.modelInput}
                />
                <button
                    className={styles.addBtn}
                    onClick={handleAddModel}
                    disabled={!newModelName.trim()}
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Models list */}
            <div className={styles.models}>
                {project.models.length === 0 && (
                    <div className={styles.empty}>
                        <Database size={32} />
                        <p>{t.schemaBuilder.noModels}</p>
                        <span>{t.schemaBuilder.noModelsHint}</span>
                    </div>
                )}

                {project.models.map((model) => {
                    const isExpanded = expandedModels.has(model.name);

                    return (
                        <div key={model.name} className={styles.model}>
                            <div
                                className={styles.modelHeader}
                                onClick={() => toggleExpand(model.name)}
                            >
                                <span className={styles.expand}>
                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </span>
                                <Database size={16} className={styles.modelIcon} />
                                <span className={styles.modelName}>{model.name}</span>
                                <span className={styles.fieldCount}>{model.fields.length} {t.schemaBuilder.fields}</span>
                                <button
                                    className={styles.deleteModelBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveModel(model.name);
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            {isExpanded && (
                                <div className={styles.fields}>
                                    {model.fields.map((field, index) => {
                                        const FieldIcon = getFieldIcon(field.type);
                                        const isEditing = editingField?.model === model.name && editingField?.index === index;

                                        return (
                                            <div key={index} className={styles.field}>
                                                <div className={styles.fieldMain}>
                                                    <FieldIcon size={14} className={styles.fieldIcon} />

                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={field.name}
                                                            onChange={(e) => handleUpdateField(model.name, index, { name: e.target.value })}
                                                            onBlur={() => setEditingField(null)}
                                                            onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                                                            className={styles.fieldNameInput}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span
                                                            className={styles.fieldName}
                                                            onClick={() => !field.isId && setEditingField({ model: model.name, index })}
                                                        >
                                                            {field.name}
                                                        </span>
                                                    )}

                                                    <select
                                                        value={field.type}
                                                        onChange={(e) => handleUpdateField(model.name, index, {
                                                            type: e.target.value as ModelField['type']
                                                        })}
                                                        className={styles.typeSelect}
                                                        disabled={field.isId}
                                                    >
                                                        {FIELD_TYPES.map(ft => (
                                                            <option key={ft.value} value={ft.value}>
                                                                {getFieldTypeLabel(ft.labelKey)}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <div className={styles.fieldFlags}>
                                                        {field.isId && (
                                                            <span className={styles.flagId} title={t.schemaBuilder.flags.primaryKey}>
                                                                <Key size={12} />
                                                            </span>
                                                        )}
                                                        <button
                                                            className={`${styles.flagBtn} ${field.isRequired ? styles.active : ''}`}
                                                            onClick={() => handleUpdateField(model.name, index, { isRequired: !field.isRequired })}
                                                            title={t.schemaBuilder.flags.required}
                                                            disabled={field.isId}
                                                        >
                                                            <Asterisk size={12} />
                                                        </button>
                                                        <button
                                                            className={`${styles.flagBtn} ${field.isUnique ? styles.active : ''}`}
                                                            onClick={() => handleUpdateField(model.name, index, { isUnique: !field.isUnique })}
                                                            title={t.schemaBuilder.flags.unique}
                                                            disabled={field.isId}
                                                        >
                                                            <Link2 size={12} />
                                                        </button>
                                                    </div>

                                                    {!field.isId && (
                                                        <button
                                                            className={styles.deleteBtn}
                                                            onClick={() => handleRemoveField(model.name, index)}
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <button
                                        className={styles.addFieldBtn}
                                        onClick={() => handleAddField(model.name)}
                                    >
                                        <Plus size={14} />
                                        {t.schemaBuilder.addField}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
