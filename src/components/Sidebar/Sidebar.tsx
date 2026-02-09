import { useState } from 'react';
import { Input, Card, Badge, Space, Typography, Button } from 'antd';
import {
    Plus, Search, Download, FileJson,
    Zap, Database, Shield, MessageSquare,
    ChevronLeft, ChevronRight, HardDrive, Layout as LayoutIcon
} from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTranslation } from '../../i18n';
import styles from './Sidebar.module.css';

const { Text, Title } = Typography;

interface SidebarProps {
    onOpenSchema?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

const NODE_TYPES = [
    {
        type: 'endpoint',
        icon: Zap,
        color: 'var(--method-get)',
        labelKey: 'endpoint',
    },
    {
        type: 'database',
        icon: Database,
        color: 'var(--method-post)',
        labelKey: 'database',
    },
    {
        type: 'auth',
        icon: Shield,
        color: 'var(--method-put)',
        labelKey: 'auth',
    },
    {
        type: 'response',
        icon: MessageSquare,
        color: 'var(--method-patch)',
        labelKey: 'response',
    }
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ onOpenSchema, isOpen, onClose }) => {
    const { exportProject } = useProjectStore();
    const [searchQuery, setSearchQuery] = useState('');
    const { t } = useTranslation();

    const handleDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/routify-node', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const filteredNodes = NODE_TYPES.filter(node => {
        const nodeInfo = t.sidebar.nodes[node.labelKey as keyof typeof t.sidebar.nodes];
        return nodeInfo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            nodeInfo.description.toLowerCase().includes(searchQuery.toLowerCase());
    });

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

    if (!isOpen) {
        return (
            <button
                className={styles.toggleBtnClosed}
                onClick={onClose} // In original App.tsx this toggles mobileMenuOpen
                title="Open Sidebar"
            >
                <ChevronRight size={20} />
            </button>
        );
    }

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles['sidebar--open'] : ''}`}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        <LayoutIcon size={20} />
                    </div>
                    <Title level={4} style={{ margin: 0, fontSize: '18px' }}>Routify</Title>
                </div>
                <Button
                    type="text"
                    icon={<ChevronLeft size={20} />}
                    onClick={onClose}
                    className={styles.closeBtn}
                    title="Close Sidebar"
                />
            </div>

            <div className={styles.search}>
                <Input
                    prefix={<Search size={16} style={{ color: 'var(--text-muted)' }} />}
                    placeholder={t.sidebar.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                />
            </div>

            <div className={styles.content}>
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <Text strong type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {t.sidebar.categories.endpoints}
                        </Text>
                        <Badge count={filteredNodes.length} style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', boxShadow: 'none' }} />
                    </div>

                    <div className={styles.nodeList}>
                        {filteredNodes.map((node) => {
                            const Icon = node.icon;
                            const nodeInfo = t.sidebar.nodes[node.labelKey as keyof typeof t.sidebar.nodes];
                            return (
                                <Card
                                    key={node.type}
                                    size="small"
                                    className={styles.nodeCard}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, node.type)}
                                    styles={{ body: { padding: '12px' } }}
                                    hoverable
                                >
                                    <div className={styles.nodeInfo}>
                                        <div
                                            className={styles.nodeIcon}
                                            style={{ backgroundColor: `${node.color}15`, color: node.color }}
                                        >
                                            <Icon size={18} />
                                        </div>
                                        <div className={styles.nodeText}>
                                            <Text strong style={{ fontSize: '13px', display: 'block' }}>
                                                {nodeInfo.name}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                                {nodeInfo.description}
                                            </Text>
                                        </div>
                                        <Plus size={14} className={styles.addIcon} />
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <Text strong type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {t.sidebar.models}
                        </Text>
                    </div>
                    <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Button
                            block
                            icon={<Download size={16} />}
                            onClick={handleExport}
                            style={{ height: '36px', textAlign: 'left', display: 'flex', alignItems: 'center' }}
                        >
                            {t.sidebar.exportJson}
                        </Button>
                        <Button
                            block
                            icon={<FileJson size={16} />}
                            onClick={onOpenSchema}
                            style={{ height: '36px', textAlign: 'left', display: 'flex', alignItems: 'center' }}
                        >
                            {t.sidebar.models}
                        </Button>
                    </Space>
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.footerStats}>
                    <div className={styles.statItem}>
                        <HardDrive size={12} />
                        <Text type="secondary" style={{ fontSize: '11px', color: 'inherit' }}>Local Storage</Text>
                    </div>
                </div>
            </div>
        </aside>
    );
};
