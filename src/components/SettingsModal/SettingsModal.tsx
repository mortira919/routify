import { useState } from 'react';
import { X, Database, Globe, Shield, FileCode } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTranslation } from '../../i18n';
import type { ProjectSettings } from '../../types';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DATABASE_OPTIONS = [
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
] as const;

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { project, updateSettings } = useProjectStore();
    const t = useTranslation();
    const [settings, setSettings] = useState<ProjectSettings>(project.settings);

    if (!isOpen) return null;

    const handleSave = () => {
        updateSettings(settings);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{t.settings.title}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    {/* Database */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Database size={18} />
                            <h3>{t.settings.database.title}</h3>
                        </div>
                        <div className={styles.field}>
                            <label>{t.settings.database.type}</label>
                            <select
                                value={settings.database}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    database: e.target.value as ProjectSettings['database']
                                })}
                            >
                                {DATABASE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Server */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Globe size={18} />
                            <h3>{t.settings.server.title}</h3>
                        </div>
                        <div className={styles.fieldRow}>
                            <div className={styles.field}>
                                <label>{t.settings.server.port}</label>
                                <input
                                    type="number"
                                    value={settings.port}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        port: parseInt(e.target.value) || 3000
                                    })}
                                />
                            </div>
                            <div className={styles.field}>
                                <label>{t.settings.server.basePath}</label>
                                <input
                                    type="text"
                                    value={settings.basePath}
                                    onChange={(e) => setSettings({ ...settings, basePath: e.target.value })}
                                    placeholder="/api"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <Shield size={18} />
                            <h3>{t.settings.features.title}</h3>
                        </div>
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={settings.enableSwagger}
                                onChange={(e) => setSettings({ ...settings, enableSwagger: e.target.checked })}
                            />
                            <span>{t.settings.features.enableSwagger}</span>
                        </label>
                        <label className={styles.checkbox}>
                            <input
                                type="checkbox"
                                checked={settings.enableCors}
                                onChange={(e) => setSettings({ ...settings, enableCors: e.target.checked })}
                            />
                            <span>{t.settings.features.enableCors}</span>
                        </label>
                        {settings.enableCors && (
                            <div className={styles.field}>
                                <label>{t.settings.features.corsOrigins}</label>
                                <input
                                    type="text"
                                    value={settings.corsOrigins.join(', ')}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        corsOrigins: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                    })}
                                    placeholder={t.settings.features.corsPlaceholder}
                                />
                            </div>
                        )}
                    </div>

                    {/* Code Info */}
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <FileCode size={18} />
                            <h3>{t.settings.generatedCode.title}</h3>
                        </div>
                        <div className={styles.info}>
                            <p>{t.settings.generatedCode.target}: <strong>Express.js + {settings.database === 'mongodb' ? 'Mongoose' : 'Prisma'}</strong></p>
                            <p>{t.settings.generatedCode.apiStyle}: <strong>REST</strong></p>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        {t.settings.buttons.cancel}
                    </button>
                    <button className={styles.saveBtn} onClick={handleSave}>
                        {t.settings.buttons.save}
                    </button>
                </div>
            </div>
        </div>
    );
};
