import {
    Collapse,
    Select,
    Input,
    Button,
    Empty,
    Space,
    Typography,
    Checkbox,
    Form
} from 'antd';
import {
    X, MousePointer2, Trash2,
    Shield, FileText, Settings, Database, Zap, Tag
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTranslation } from '../../i18n';
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

const { TextArea } = Input;
const { Text, Title } = Typography;

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const DB_OPERATIONS = ['create', 'read', 'update', 'delete', 'list'] as const;

export const PropertyPanel: React.FC = () => {
    const { project, selectedNodeId, setSelectedNode, updateNode, removeNode } = useProjectStore();
    const { t } = useTranslation();

    const selectedNode = project.nodes.find(n => n.id === selectedNodeId);

    if (!selectedNode) {
        return (
            <aside className={styles.panel}>
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                    <Empty
                        image={<MousePointer2 size={48} style={{ color: 'var(--text-muted)' }} />}
                        description={
                            <Space direction="vertical" align="center">
                                <Text strong style={{ fontSize: '16px' }}>{t.propertyPanel.noNodeSelected}</Text>
                                <Text type="secondary">{t.propertyPanel.noNodeSelectedHint}</Text>
                            </Space>
                        }
                    />
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

    const renderEndpointForm = (config: EndpointConfig) => {
        const items = [
            {
                key: 'basic',
                label: <Space><Settings size={14} /> {t.propertyPanel.sections.basic}</Space>,
                children: (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>Method</Text>
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
                        </div>
                        <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{t.propertyPanel.fields.path}</Text>
                            <Input
                                value={config.path}
                                onChange={(e) => updateConfig({ path: e.target.value })}
                                placeholder={t.propertyPanel.fields.pathPlaceholder}
                            />
                        </div>
                    </Space>
                ),
            },
            {
                key: 'swagger',
                label: <Space><FileText size={14} /> {t.propertyPanel.sections.documentation}</Space>,
                children: (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{t.propertyPanel.fields.summary}</Text>
                            <Input
                                value={config.summary}
                                onChange={(e) => updateConfig({ summary: e.target.value })}
                                placeholder={t.propertyPanel.fields.summaryPlaceholder}
                            />
                        </div>
                        <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{t.propertyPanel.fields.description}</Text>
                            <TextArea
                                value={config.description}
                                onChange={(e) => updateConfig({ description: e.target.value })}
                                placeholder={t.propertyPanel.fields.descriptionPlaceholder}
                                rows={3}
                            />
                        </div>
                        <div>
                            <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{t.propertyPanel.fields.tags}</Text>
                            <TagInput
                                tags={config.tags}
                                onChange={(tags) => updateConfig({ tags })}
                                placeholder={t.propertyPanel.fields.tagsPlaceholder}
                                suggestions={COMMON_TAGS}
                            />
                        </div>
                        <Checkbox
                            checked={config.deprecated}
                            onChange={(e) => updateConfig({ deprecated: e.target.checked })}
                        >
                            {t.propertyPanel.fields.markAsDeprecated}
                        </Checkbox>
                    </Space>
                ),
            },
            {
                key: 'auth',
                label: <Space><Shield size={14} /> {t.propertyPanel.sections.authentication}</Space>,
                children: (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Checkbox
                            checked={config.auth.required}
                            onChange={(e) => updateConfig({
                                auth: { ...config.auth, required: e.target.checked }
                            })}
                        >
                            {t.propertyPanel.fields.requireAuth}
                        </Checkbox>

                        {config.auth.required && (
                            <>
                                <div>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{t.propertyPanel.fields.authType}</Text>
                                    <Select
                                        style={{ width: '100%' }}
                                        value={config.auth.type}
                                        onChange={(value) => updateConfig({
                                            auth: { ...config.auth, type: value }
                                        })}
                                        options={[...AUTH_TYPES]}
                                    />
                                </div>
                                <div>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>{t.propertyPanel.fields.requiredRoles}</Text>
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
                    </Space>
                ),
            },
            {
                key: 'params',
                label: <Space><Database size={14} /> {t.propertyPanel.sections.parameters}</Space>,
                children: (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>{t.propertyPanel.fields.queryParams}</Text>
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
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>{t.propertyPanel.fields.pathParams}</Text>
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
                    </Space>
                ),
            },
            {
                key: 'body',
                label: <Space><Zap size={14} /> {t.propertyPanel.sections.requestBody}</Space>,
                hidden: !(config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH'),
                children: (
                    <SchemaEditor
                        schema={config.bodySchema}
                        onChange={(bodySchema) => updateConfig({ bodySchema })}
                        title={t.propertyPanel.fields.bodySchema}
                    />
                ),
            },
            {
                key: 'response',
                label: <Space><Tag size={14} /> {t.propertyPanel.sections.response}</Space>,
                children: (
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        {config.responses.map((resp, index) => (
                            <div key={index} style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
                                <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <Select
                                        style={{ width: '180px' }}
                                        value={resp.statusCode}
                                        onChange={(value) => {
                                            const newResponses = [...config.responses];
                                            newResponses[index] = { ...resp, statusCode: value };
                                            updateConfig({ responses: newResponses });
                                        }}
                                        options={HTTP_STATUS_CODES.map(c => ({ value: c.code, label: c.label }))}
                                    />
                                    {config.responses.length > 1 && (
                                        <Button
                                            type="text"
                                            danger
                                            icon={<Trash2 size={14} />}
                                            onClick={() => {
                                                const newResponses = config.responses.filter((_, i) => i !== index);
                                                updateConfig({ responses: newResponses });
                                            }}
                                        />
                                    )}
                                </Space>
                                <Input
                                    style={{ marginBottom: '8px' }}
                                    value={resp.description}
                                    onChange={(e) => {
                                        const newResponses = [...config.responses];
                                        newResponses[index] = { ...resp, description: e.target.value };
                                        updateConfig({ responses: newResponses });
                                    }}
                                    placeholder={t.propertyPanel.fields.responseDescription}
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
                        <Button
                            block
                            type="dashed"
                            onClick={() => {
                                updateConfig({
                                    responses: [...config.responses, createDefaultResponse(400)]
                                });
                            }}
                        >
                            {t.propertyPanel.buttons.addResponse}
                        </Button>
                    </Space>
                ),
            }
        ].filter(item => !item.hidden);

        return <Collapse items={items} defaultActiveKey={['basic']} ghost expandIconPosition="end" />;
    };

    const renderDatabaseForm = (config: DatabaseConfig) => (
        <Space direction="vertical" style={{ width: '100%', padding: '16px' }} size="large">
            <div>
                <Text strong style={{ display: 'block', marginBottom: '12px' }}>{t.propertyPanel.sections.operation}</Text>
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

            <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>{t.propertyPanel.sections.model}</Text>
                <Form.Item label={t.propertyPanel.fields.modelName} layout="vertical">
                    <Input
                        value={config.model}
                        onChange={(e) => updateConfig({ model: e.target.value })}
                        placeholder={t.propertyPanel.fields.modelPlaceholder}
                    />
                </Form.Item>
            </div>
        </Space>
    );

    const getNodeTitle = () => {
        const nodeTypes = t.propertyPanel.nodeTypes;
        switch (selectedNode.data.type) {
            case 'endpoint': return nodeTypes.endpoint;
            case 'database': return nodeTypes.database;
            case 'response': return nodeTypes.response;
            case 'auth': return nodeTypes.auth;
            default: return nodeTypes.node;
        }
    };

    return (
        <aside className={styles.panel}>
            <div className={styles.header}>
                <Title level={5} style={{ margin: 0, color: 'var(--text-primary)' }}>{getNodeTitle()}</Title>
                <Button type="text" icon={<X size={18} />} onClick={handleClose} />
            </div>

            <div className={styles.content}>
                {selectedNode.data.type === 'endpoint' && renderEndpointForm(selectedNode.data.config)}
                {selectedNode.data.type === 'database' && renderDatabaseForm(selectedNode.data.config)}
            </div>

            <div className={styles.actions}>
                <Button
                    danger
                    block
                    icon={<Trash2 size={16} />}
                    onClick={handleDelete}
                    style={{ height: '40px' }}
                >
                    {t.propertyPanel.deleteNode}
                </Button>
            </div>
        </aside>
    );
};
