import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Send } from 'lucide-react';
import type { ResponseConfig } from '../../types';
import styles from '../node.module.css';

interface ResponseNodeData {
    type: 'response';
    config: ResponseConfig;
}

export const ResponseNode: React.FC<NodeProps> = memo(({ data, selected }) => {
    const nodeData = data as unknown as ResponseNodeData;
    const config = nodeData.config;

    const getStatusColor = (status: number) => {
        if (status >= 200 && status < 300) return 'var(--accent-success)';
        if (status >= 400 && status < 500) return 'var(--accent-warning)';
        if (status >= 500) return 'var(--accent-danger)';
        return 'var(--text-secondary)';
    };

    return (
        <div className={`${styles.node} ${selected ? styles['node--selected'] : ''}`}>
            <Handle
                type="target"
                position={Position.Left}
                className={styles.handleInput}
            />

            <div className={styles.header}>
                <div className={`${styles.icon} ${styles['icon--response']}`}>
                    <Send size={18} color="white" />
                </div>
                <div className={styles.headerContent}>
                    <div className={styles.title}>Response</div>
                    <div className={styles.subtitle}>Send Response</div>
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Status</span>
                    <span
                        className={styles.infoValue}
                        style={{ color: getStatusColor(config.statusCode) }}
                    >
                        {config.statusCode}
                    </span>
                </div>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Type</span>
                    <span className={styles.infoValue}>{config.contentType.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
});

ResponseNode.displayName = 'ResponseNode';
