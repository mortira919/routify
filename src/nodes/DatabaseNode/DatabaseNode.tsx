import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Database } from 'lucide-react';
import type { DatabaseConfig } from '../../types';
import styles from '../node.module.css';

interface DatabaseNodeData {
    type: 'database';
    config: DatabaseConfig;
}

const operationLabels: Record<string, string> = {
    create: 'Create Record',
    read: 'Find One',
    update: 'Update Record',
    delete: 'Delete Record',
    list: 'Find Many',
};

export const DatabaseNode: React.FC<NodeProps> = memo(({ data, selected }) => {
    const nodeData = data as unknown as DatabaseNodeData;
    const config = nodeData.config;

    return (
        <div className={`${styles.node} ${selected ? styles['node--selected'] : ''}`}>
            <Handle
                type="target"
                position={Position.Left}
                className={styles.handleInput}
            />

            <div className={styles.header}>
                <div className={`${styles.icon} ${styles['icon--database']}`}>
                    <Database size={18} color="white" />
                </div>
                <div className={styles.headerContent}>
                    <div className={styles.title}>Database</div>
                    <div className={styles.subtitle}>{config.model || 'No model selected'}</div>
                </div>
            </div>

            <div className={styles.body}>
                <span className={styles.operation}>
                    <Database size={12} />
                    {operationLabels[config.operation] || config.operation}
                </span>

                {config.filters.length > 0 && (
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Filters</span>
                        <span className={styles.infoValue}>{config.filters.length}</span>
                    </div>
                )}
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className={styles.handleOutput}
            />
        </div>
    );
});

DatabaseNode.displayName = 'DatabaseNode';
