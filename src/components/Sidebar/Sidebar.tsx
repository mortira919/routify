import { useState } from 'react';
import {
    Globe,
    Database,
    Send,
    Shield,
    Search,
    Download,
    Zap,
    Layers
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import styles from './Sidebar.module.css';

interface NodeType {
    type: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    iconClass: string;
}

interface SidebarProps {
    onOpenSchema?: () => void;
}

const nodeTypes: Record<string, NodeType[]> = {
    'Endpoints': [
        {
            type: 'endpoint',
            name: 'API Endpoint',
            description: 'HTTP request handler',
            icon: <Globe size={16} color="white" />,
            iconClass: styles['nodeIcon--endpoint'],
        },
    ],
    'Data': [
        {
            type: 'database',
            name: 'Database',
            description: 'CRUD operations',
            icon: <Database size={16} color="white" />,
            iconClass: styles['nodeIcon--database'],
        },
        {
            type: 'response',
            name: 'Response',
            description: 'Send response',
            icon: <Send size={16} color="white" />,
            iconClass: styles['nodeIcon--response'],
        },
    ],
    'Security': [
        {
            type: 'auth',
            name: 'Authentication',
            description: 'JWT, API Key, etc.',
            icon: <Shield size={16} color="white" />,
            iconClass: styles['nodeIcon--auth'],
        },
    ],
};

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSchema }) => {
    const [search, setSearch] = useState('');
    const { exportProject, project } = useProjectStore();

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

    const filteredCategories = Object.entries(nodeTypes).reduce((acc, [category, nodes]) => {
        const filtered = nodes.filter(
            node =>
                node.name.toLowerCase().includes(search.toLowerCase()) ||
                node.description.toLowerCase().includes(search.toLowerCase())
        );
        if (filtered.length > 0) {
            acc[category] = filtered;
        }
        return acc;
    }, {} as Record<string, NodeType[]>);

    return (
        <aside className={styles.sidebar}>
            {/* Logo */}
            <div className={styles.logo}>
                <div className={styles.logoIcon}>
                    <Zap size={20} color="white" />
                </div>
                <span className={styles.logoText}>Routify</span>
            </div>

            {/* Search */}
            <div className={styles.search}>
                <div className={styles.searchWrapper}>
                    <Search size={16} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search nodes..."
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
                        {nodes.map((node) => (
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
                                    <div className={styles.nodeName}>{node.name}</div>
                                    <div className={styles.nodeDesc}>{node.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className={styles.footer}>
                <button className={styles.schemaBtn} onClick={onOpenSchema}>
                    <Layers size={18} />
                    Models
                    <span className={styles.modelBadge}>{project.models.length}</span>
                </button>
                <button className={styles.exportBtn} onClick={handleExport}>
                    <Download size={18} />
                    Export JSON
                </button>
            </div>
        </aside>
    );
};
