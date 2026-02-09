import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox, Space, Typography, Divider } from 'antd';
import { Database, Globe, Shield, FileCode } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTranslation } from '../../i18n';
import type { ProjectSettings } from '../../types';

const { Title, Text } = Typography;

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DATABASE_OPTIONS = [
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { project, updateSettings } = useProjectStore();
    const { t } = useTranslation();
    const [settings, setSettings] = useState<ProjectSettings>(project.settings);

    useEffect(() => {
        if (isOpen) {
            setSettings(project.settings);
        }
    }, [isOpen, project.settings]);

    const handleSave = () => {
        updateSettings(settings);
        onClose();
    };

    return (
        <Modal
            title={t.settings.title}
            open={isOpen}
            onCancel={onClose}
            onOk={handleSave}
            width={600}
            centered
            className="nvidia-modal"
        >
            <Form layout="vertical">
                <Divider orientation="left" style={{ borderColor: 'var(--border-color)' }}>
                    <Space><Database size={16} /> <Text strong>{t.settings.database.title}</Text></Space>
                </Divider>

                <Form.Item label={t.settings.database.type}>
                    <Select
                        value={settings.database}
                        onChange={(val) => setSettings({ ...settings, database: val as any })}
                        options={DATABASE_OPTIONS}
                    />
                </Form.Item>

                <Divider orientation="left" style={{ borderColor: 'var(--border-color)' }}>
                    <Space><Globe size={16} /> <Text strong>{t.settings.server.title}</Text></Space>
                </Divider>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item label={t.settings.server.port}>
                        <Input
                            type="number"
                            value={settings.port}
                            onChange={(e) => setSettings({ ...settings, port: parseInt(e.target.value) || 3000 })}
                        />
                    </Form.Item>
                    <Form.Item label={t.settings.server.basePath}>
                        <Input
                            value={settings.basePath}
                            onChange={(e) => setSettings({ ...settings, basePath: e.target.value })}
                        />
                    </Form.Item>
                </div>

                <Divider orientation="left" style={{ borderColor: 'var(--border-color)' }}>
                    <Space><Shield size={16} /> <Text strong>{t.settings.features.title}</Text></Space>
                </Divider>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Checkbox
                        checked={settings.enableSwagger}
                        onChange={(e) => setSettings({ ...settings, enableSwagger: e.target.checked })}
                    >
                        {t.settings.features.enableSwagger}
                    </Checkbox>
                    <Checkbox
                        checked={settings.enableCors}
                        onChange={(e) => setSettings({ ...settings, enableCors: e.target.checked })}
                    >
                        {t.settings.features.enableCors}
                    </Checkbox>
                    {settings.enableCors && (
                        <Form.Item label={t.settings.features.corsOrigins} style={{ marginTop: '8px', marginBottom: 0 }}>
                            <Input
                                placeholder={t.settings.features.corsPlaceholder}
                                value={settings.corsOrigins.join(', ')}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    corsOrigins: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                })}
                            />
                        </Form.Item>
                    )}
                </Space>

                <Divider orientation="left" style={{ borderColor: 'var(--border-color)' }}>
                    <Space><FileCode size={16} /> <Text strong>{t.settings.generatedCode.title}</Text></Space>
                </Divider>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item label={t.settings.generatedCode.target}>
                        <Select
                            value={settings.target}
                            onChange={(val) => setSettings({ ...settings, target: val as any })}
                            options={[
                                { value: 'nodejs', label: 'Node.js (Express)' },
                                { value: 'typescript', label: 'TypeScript (Express)' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label={t.settings.generatedCode.apiStyle}>
                        <Select
                            value={settings.apiStyle}
                            onChange={(val) => setSettings({ ...settings, apiStyle: val as any })}
                            options={[
                                { value: 'rest', label: 'RESTful' },
                                { value: 'minimal', label: 'Minimal API' },
                            ]}
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};
