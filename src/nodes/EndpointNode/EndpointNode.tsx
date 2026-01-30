import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Globe } from 'lucide-react';
import type { EndpointConfig } from '../../types';
import styles from '../node.module.css';

interface EndpointNodeData {
    type: 'endpoint';
    config: EndpointConfig;
}

export const EndpointNode: React.FC<NodeProps> = memo(({ data, selected }) => {
    const nodeData = data as unknown as EndpointNodeData;
    const config = nodeData.config;

    return (
        <div className={`${styles.node} ${selected ? styles['node--selected'] : ''}`}>
            <Handle
                type="target"
                position={Position.Left}
                className={styles.handleInput}
            />

            <div className={styles.header}>
                <div className={`${styles.icon} ${styles['icon--endpoint']}`}>
                    <Globe size={18} color="white" />
                </div>
                <div className={styles.headerContent}>
                    <div className={styles.title}>API Endpoint</div>
                    <div className={styles.subtitle}>HTTP Request Handler</div>
                </div>
            </div>

            <div className={styles.body}>
                <span className={`${styles.method} ${styles[`method--${config.method}`]}`}>
                    {config.method}
                </span>
                <div className={styles.path}>{config.path}</div>
            </div>

            <Handle
                type="source"
                position={Position.Right}
                className={styles.handleOutput}
            />
        </div>
    );
});

EndpointNode.displayName = 'EndpointNode';
