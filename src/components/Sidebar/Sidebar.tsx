import { useState } from 'react';
import {
    Globe,
    Database,
    Send,
    Shield,
    Search,
    Download,
    Zap,
    Layers,
    X
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTranslation } from '../../i18n';
import { HintTooltip } from '../ui';
import styles from './Sidebar.module.css';

interface NodeType {
    type: string;
    nameKey: 'endpoint' | 'database' | 'response' | 'auth';
    icon: React.ReactNode;
    iconClass: string;
}

interface SidebarProps {
    onOpenSchema?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSchema, isOpen, onClose }) => {
    const [search, setSearch] = useState('');
    const { exportProject, project } = useProjectStore();
    const t = useTranslation();

    const nodeTypes: Record<string, NodeType[]> = {
        [t.sidebar.categories.endpoints]: [
            {
                type: 'endpoint',
                nameKey: 'endpoint',
                icon: <Globe size={16} color="white" />,
                iconClass: styles['nodeIcon--endpoint'],
            },
        ],
        [t.sidebar.categories.data]: [
            {
                type: 'database',
                nameKey: 'database',
                icon: <Database size={16} color="white" />,
                iconClass: styles['nodeIcon--database'],
            },
            {
                type: 'response',
                nameKey: 'response',
                icon: <Send size={16} color="white" />,
                iconClass: styles['nodeIcon--response'],
            },
        ],
        [t.sidebar.categories.security]: [
            {
                type: 'auth',
                nameKey: 'auth',
                icon: <Shield size={16} color="white" />,
                iconClass: styles['nodeIcon--auth'],
            },
        ],
    };

    const handleDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/routify-node', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleExport = () => {
        const json = exportProject();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'routify-project.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const getHintForNode = (nameKey: 'endpoint' | 'database' | 'response' | 'auth') => {
        const nodeHints = {
            endpoint: t.hints.endpoint,
            database: t.hints.database,
            response: t.hints.response,
            auth: t.hints.auth,
        };
        return nodeHints[nameKey];
    };

    const filteredCategories = Object.entries(nodeTypes).reduce((acc, [category, nodes]) => {
        const filtered = nodes.filter(
            node => {
                const nodeInfo = t.sidebar.nodes[node.nameKey];
                return nodeInfo.name.toLowerCase().includes(search.toLowerCase()) ||
                    nodeInfo.description.toLowerCase().includes(search.toLowerCase());
            }
        );
        if (filtered.length > 0) {
            acc[category] = filtered;
        }
        return acc;
    }, {} as Record<string, NodeType[]>);

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles['sidebar--open'] : ''}`}>
            {/* Logo */}
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Zap size={20} color="white" />
                </div>
                <span className={styles.logoText}>Routify</span>
                {onClose && (
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Search */}
            <div className={styles.search}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder={t.sidebar.searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className={styles.categories}>
                {Object.entries(filteredCategories).map(([category, nodes]) => (
                    <div key={category} className={styles.category}>
                        <h3 className={styles.categoryTitle}>{category}</h3>
                        {nodes.map((node) => {
                            const nodeInfo = t.sidebar.nodes[node.nameKey];
                            const hint = getHintForNode(node.nameKey);

                            return (
                                <div
                                    key={node.type}
                                    className={styles.nodeItem}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, node.type)}
                                >
                                    <div className={`${styles.nodeIcon} ${node.iconClass}`}>
                                        {node.icon}
                                    </div>
                                    <div className={styles.nodeInfo}>
                                        <div className={styles.nodeName}>
                                            {hint ? (
                                                <HintTooltip
                                                    title={hint.title}
                                                    what={hint.what}
                                                    why={hint.why}
                                                    how={hint.how}
                                                >
                                                    {nodeInfo.name}
                                                </HintTooltip>
                                            ) : (
                                                nodeInfo.name
                                            )}
                                        </div>
                                        <div className={styles.nodeDesc}>{nodeInfo.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                <button className={styles.schemaBtn} onClick={onOpenSchema}>
                    <Layers size={18} />
                    {t.sidebar.models}
                    <span className={styles.modelBadge}>{project.models.length}</span>
                </button>
                <button className={styles.exportBtn} onClick={handleExport}>
                    <Download size={18} />
                    {t.sidebar.exportJson}
                </button>
            </div>
        </aside>
    );
};
