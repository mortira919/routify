import { useState } from 'react';
import {
    X, MousePointer2, Trash2, ChevronDown, ChevronRight,
    Shield, FileText, Settings, Database, Zap, Tag
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import type { EndpointConfig, DatabaseConfig } from '../../types';
import { SchemaEditor } from '../SchemaEditor/SchemaEditor';
import { TagInput, RoleSelector } from '../ui';
import {
    AUTH_TYPES,
    HTTP_STATUS_CODES,
    COMMON_TAGS,
    DEFAULT_ROLES,
    createDefaultResponse
} from '../../utils/endpointDefaults';
import styles from './PropertyPanel.module.css';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const DB_OPERATIONS = ['create', 'read', 'update', 'delete', 'list'] as const;

type SectionName = 'basic' | 'swagger' | 'auth' | 'params' | 'body' | 'response';

export const PropertyPanel: React.FC = () => {
    const { project, selectedNodeId, setSelectedNode, updateNode, removeNode } = useProjectStore();
    const [expandedSections, setExpandedSections] = useState<Set<SectionName>>(
        new Set(['basic', 'swagger'])
    );

    const selectedNode = project.nodes.find(n => n.id === selectedNodeId);

    const toggleSection = (section: SectionName) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        } else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };

    if (!selectedNode) {
        return (
            <aside className={styles.panel}>
                <div className={styles.empty}>
                    <MousePointer2 size={48} className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>No node selected</h3>
                    <p className={styles.emptyText}>
                        Click on a node to view and edit its properties
                    </p>
                </div>
            </aside>
        );
    }

    const handleClose = () => setSelectedNode(null);
    const handleDelete = () => {
        removeNode(selectedNode.id);
    };

    const updateConfig = (updates: Partial<EndpointConfig | DatabaseConfig>) => {
        updateNode(selectedNode.id, {
            ...selectedNode.data,
            config: { ...selectedNode.data.config, ...updates },
        } as typeof selectedNode.data);
    };

    const renderSection = (
        name: SectionName,
        icon: React.ReactNode,
        title: string,
        content: React.ReactNode
    ) => {
        const isExpanded = expandedSections.has(name);
        return (
            <div className={styles.section}>
                <button
                    className={styles.sectionHeader}
                    onClick={() => toggleSection(name)}
                >
                    <div className={styles.sectionIcon}>{icon}</div>
                    <span className={styles.sectionTitle}>{title}</span>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {isExpanded && (
                    <div className={styles.sectionContent}>
                        {content}
                    </div>
                )}
            </div>
        );
    };

    const renderEndpointForm = (config: EndpointConfig) => (
        <>
            {/* Basic Settings */}
            {renderSection('basic', <Settings size={16} />, 'Basic Settings', (
                <>
                    <div className={styles.methodGrid}>
                        {HTTP_METHODS.map((method) => (
                            <button
                                key={method}
                                className={`${styles.methodBtn} ${config.method === method ? styles[`methodBtn--${method}`] : ''}`}
                                onClick={() => updateConfig({ method })}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Path</label>
                        <input
                            type="text"
                            className={styles.fieldInput}
                            value={config.path}
                            onChange={(e) => updateConfig({ path: e.target.value })}
                            placeholder="/api/users/:id"
                        />
                    </div>
                </>
            ))}

            {/* Swagger Documentation */}
            {renderSection('swagger', <FileText size={16} />, 'Documentation', (
                <>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Summary</label>
                        <input
                            type="text"
                            className={styles.fieldInput}
                            value={config.summary}
                            onChange={(e) => updateConfig({ summary: e.target.value })}
                            placeholder="Brief description"
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Description</label>
                        <textarea
                            className={styles.fieldTextarea}
                            value={config.description}
                            onChange={(e) => updateConfig({ description: e.target.value })}
                            placeholder="Detailed description for Swagger docs..."
                            rows={3}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel}>Tags</label>
                        <TagInput
                            tags={config.tags}
                            onChange={(tags) => updateConfig({ tags })}
                            placeholder="Add tags..."
                            suggestions={COMMON_TAGS}
                        />
                    </div>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={config.deprecated}
                            onChange={(e) => updateConfig({ deprecated: e.target.checked })}
                        />
                        <span>Mark as deprecated</span>
                    </label>
                </>
            ))}

            {/* Authentication */}
            {renderSection('auth', <Shield size={16} />, 'Authentication', (
                <>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={config.auth.required}
                            onChange={(e) => updateConfig({
                                auth: { ...config.auth, required: e.target.checked }
                            })}
                        />
                        <span>Require authentication</span>
                    </label>

                    {config.auth.required && (
                        <>
                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Auth Type</label>
                                <select
                                    className={styles.fieldSelect}
                                    value={config.auth.type}
                                    onChange={(e) => updateConfig({
                                        auth: { ...config.auth, type: e.target.value as EndpointConfig['auth']['type'] }
                                    })}
                                >
                                    {AUTH_TYPES.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.field}>
                                <label className={styles.fieldLabel}>Required Roles</label>
                                <RoleSelector
                                    selectedRoles={config.auth.roles}
                                    onChange={(roles) => updateConfig({
                                        auth: { ...config.auth, roles }
                                    })}
                                    availableRoles={DEFAULT_ROLES}
                                />
                            </div>
                        </>
                    )}
                </>
            ))}

            {/* Request Parameters */}
            {renderSection('params', <Database size={16} />, 'Parameters', (
                <>
                    <div className={styles.subSection}>
                        <h5 className={styles.subTitle}>Query Parameters</h5>
                        <SchemaEditor
                            schema={config.queryParams.map(p => ({
                                name: p.name,
                                type: p.type,
                                required: p.required,
                                description: p.description,
                            }))}
                            onChange={(schema) => updateConfig({
                                queryParams: schema.map(s => ({
                                    name: s.name,
                                    type: s.type as 'string' | 'number' | 'boolean',
                                    required: s.required,
                                    description: s.description,
                                }))
                            })}
                        />
                    </div>
                    <div className={styles.subSection}>
                        <h5 className={styles.subTitle}>Path Parameters</h5>
                        <SchemaEditor
                            schema={config.pathParams.map(p => ({
                                name: p.name,
                                type: p.type,
                                required: p.required,
                                description: p.description,
                            }))}
                            onChange={(schema) => updateConfig({
                                pathParams: schema.map(s => ({
                                    name: s.name,
                                    type: s.type as 'string' | 'number' | 'boolean',
                                    required: s.required,
                                    description: s.description,
                                }))
                            })}
                        />
                    </div>
                </>
            ))}

            {/* Request Body */}
            {(config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH') &&
                renderSection('body', <Zap size={16} />, 'Request Body', (
                    <SchemaEditor
                        schema={config.bodySchema}
                        onChange={(bodySchema) => updateConfig({ bodySchema })}
                        title="Body Schema"
                    />
                ))
            }

            {/* Response */}
            {renderSection('response', <Tag size={16} />, 'Response', (
                <>
                    {config.responses.map((resp, index) => (
                        <div key={index} className={styles.responseBlock}>
                            <div className={styles.responseHeader}>
                                <select
                                    className={styles.statusSelect}
                                    value={resp.statusCode}
                                    onChange={(e) => {
                                        const newResponses = [...config.responses];
                                        newResponses[index] = {
                                            ...resp,
                                            statusCode: parseInt(e.target.value)
                                        };
                                        updateConfig({ responses: newResponses });
                                    }}
                                >
                                    {HTTP_STATUS_CODES.map(({ code, label }) => (
                                        <option key={code} value={code}>{label}</option>
                                    ))}
                                </select>
                                {config.responses.length > 1 && (
                                    <button
                                        className={styles.removeRespBtn}
                                        onClick={() => {
                                            const newResponses = config.responses.filter((_, i) => i !== index);
                                            updateConfig({ responses: newResponses });
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                className={styles.fieldInput}
                                value={resp.description}
                                onChange={(e) => {
                                    const newResponses = [...config.responses];
                                    newResponses[index] = { ...resp, description: e.target.value };
                                    updateConfig({ responses: newResponses });
                                }}
                                placeholder="Response description"
                            />
                            <SchemaEditor
                                schema={resp.schema}
                                onChange={(schema) => {
                                    const newResponses = [...config.responses];
                                    newResponses[index] = { ...resp, schema };
                                    updateConfig({ responses: newResponses });
                                }}
                            />
                        </div>
                    ))}
                    <button
                        className={styles.addResponseBtn}
                        onClick={() => {
                            updateConfig({
                                responses: [...config.responses, createDefaultResponse(400)]
                            });
                        }}
                    >
                        + Add Response
                    </button>
                </>
            ))}
        </>
    );

    const renderDatabaseForm = (config: DatabaseConfig) => (
        <>
            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Operation</h4>
                <div className={styles.methodGrid}>
                    {DB_OPERATIONS.map((op) => (
                        <button
                            key={op}
                            className={`${styles.methodBtn} ${config.operation === op ? styles['methodBtn--active'] : ''}`}
                            style={config.operation === op ? { background: 'var(--accent-secondary)', color: 'white', borderColor: 'var(--accent-secondary)' } : {}}
                            onClick={() => updateConfig({ operation: op })}
                        >
                            {op.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Model</h4>
                <div className={styles.field}>
                    <label className={styles.fieldLabel}>Model Name</label>
                    <input
                        type="text"
                        className={styles.fieldInput}
                        value={config.model}
                        onChange={(e) => updateConfig({ model: e.target.value })}
                        placeholder="User"
                    />
                </div>
            </div>
        </>
    );

    const getNodeTitle = () => {
        switch (selectedNode.data.type) {
            case 'endpoint': return 'API Endpoint';
            case 'database': return 'Database';
            case 'response': return 'Response';
            case 'auth': return 'Authentication';
            default: return 'Node';
        }
    };

    return (
        <aside className={styles.panel}>
            <div className={styles.header}>
                <h3 className={styles.title}>{getNodeTitle()}</h3>
                <button className={styles.closeBtn} onClick={handleClose}>
                    <X size={18} />
                </button>
            </div>

            <div className={styles.content}>
                {selectedNode.data.type === 'endpoint' && renderEndpointForm(selectedNode.data.config)}
                {selectedNode.data.type === 'database' && renderDatabaseForm(selectedNode.data.config)}
            </div>

            <div className={styles.actions}>
                <button className={styles.deleteBtn} onClick={handleDelete}>
                    <Trash2 size={16} style={{ marginRight: '8px' }} />
                    Delete Node
                </button>
            </div>
        </aside>
    );
};
