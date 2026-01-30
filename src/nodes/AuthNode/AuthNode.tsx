import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Shield } from 'lucide-react';
import type { AuthConfig } from '../../types';
import styles from '../node.module.css';

interface AuthNodeData {
    type: 'auth';
    config: AuthConfig;
}

const authTypeLabels: Record<string, string> = {
    jwt: 'JWT Token',
    apiKey: 'API Key',
    basic: 'Basic Auth',
    none: 'No Auth',
};

export const AuthNode: React.FC<NodeProps> = memo(({ data, selected }) => {
    const nodeData = data as unknown as AuthNodeData;
    const config = nodeData.config;

    return (
        <div className={`${styles.node} ${selected ? styles['node--selected'] : ''}`}>
            <Handle
                type="target"
                position={Position.Left}
                className={styles.handleInput}
            />

            <div className={styles.header}>
                <div className={`${styles.icon} ${styles['icon--auth']}`}>
                    <Shield size={18} color="white" />
                </div>
                <div className={styles.headerContent}>
                    <div className={styles.title}>Authentication</div>
                    <div className={styles.subtitle}>{authTypeLabels[config.type]}</div>
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Type</span>
                    <span className={styles.infoValue}>{config.type.toUpperCase()}</span>
                </div>
                {config.roles && config.roles.length > 0 && (
                    <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>Roles</span>
                        <span className={styles.infoValue}>{config.roles.join(', ')}</span>
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

AuthNode.displayName = 'AuthNode';
