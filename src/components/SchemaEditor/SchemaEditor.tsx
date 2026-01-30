import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import type { SchemaField } from '../../types';
import styles from './SchemaEditor.module.css';

interface SchemaEditorProps {
    schema: SchemaField[];
    onChange: (schema: SchemaField[]) => void;
    title?: string;
}

const FIELD_TYPES = ['string', 'number', 'boolean', 'object', 'array'] as const;

const createEmptyField = (): SchemaField => ({
    name: '',
    type: 'string',
    required: false,
    description: '',
});

export const SchemaEditor: React.FC<SchemaEditorProps> = ({ schema, onChange, title }) => {
    const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set());

    const addField = () => {
        onChange([...schema, createEmptyField()]);
    };

    const removeField = (index: number) => {
        onChange(schema.filter((_, i) => i !== index));
    };

    const updateField = (index: number, updates: Partial<SchemaField>) => {
        const newSchema = [...schema];
        newSchema[index] = { ...newSchema[index], ...updates };
        onChange(newSchema);
    };

    const toggleExpand = (fieldName: string) => {
        const newExpanded = new Set(expandedFields);
        if (newExpanded.has(fieldName)) {
            newExpanded.delete(fieldName);
        } else {
            newExpanded.add(fieldName);
        }
        setExpandedFields(newExpanded);
    };

    const renderField = (field: SchemaField, index: number, depth: number = 0) => {
        const hasChildren = field.type === 'object' || field.type === 'array';
        const isExpanded = expandedFields.has(`${depth}-${index}`);
        const key = `${depth}-${index}`;

        return (
            <div key={key} className={styles.fieldWrapper} style={{ marginLeft: depth * 20 }}>
                <div className={styles.field}>
                    {hasChildren && (
                        <button
                            className={styles.expandBtn}
                            onClick={() => toggleExpand(key)}
                        >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    )}

                    <input
                        type="text"
                        className={styles.nameInput}
                        value={field.name}
                        onChange={(e) => updateField(index, { name: e.target.value })}
                        placeholder="Field name"
                    />

                    <select
                        className={styles.typeSelect}
                        value={field.type}
                        onChange={(e) => updateField(index, {
                            type: e.target.value as SchemaField['type'],
                            children: (e.target.value === 'object' || e.target.value === 'array')
                                ? (field.children || [])
                                : undefined
                        })}
                    >
                        {FIELD_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <label className={styles.requiredLabel}>
                        <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateField(index, { required: e.target.checked })}
                        />
                        <span>Required</span>
                    </label>

                    <input
                        type="text"
                        className={styles.descInput}
                        value={field.description}
                        onChange={(e) => updateField(index, { description: e.target.value })}
                        placeholder="Description"
                    />

                    <button
                        className={styles.deleteBtn}
                        onClick={() => removeField(index)}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                {hasChildren && isExpanded && (
                    <div className={styles.children}>
                        <SchemaEditor
                            schema={field.children || []}
                            onChange={(children) => updateField(index, { children })}
                        />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.editor}>
            {title && <h5 className={styles.title}>{title}</h5>}

            <div className={styles.fields}>
                {schema.map((field, index) => renderField(field, index))}
            </div>

            <button className={styles.addBtn} onClick={addField}>
                <Plus size={14} />
                Add Field
            </button>
        </div>
    );
};
