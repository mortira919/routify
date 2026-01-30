import { useCallback, useRef } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    BackgroundVariant,
    applyNodeChanges,
    applyEdgeChanges,
    ReactFlowProvider,
} from '@xyflow/react';
import type { Connection, NodeChange, EdgeChange, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useProjectStore } from '../../store/projectStore';
import { EndpointNode } from '../../nodes/EndpointNode/EndpointNode';
import { DatabaseNode } from '../../nodes/DatabaseNode/DatabaseNode';
import { ResponseNode } from '../../nodes/ResponseNode/ResponseNode';
import { AuthNode } from '../../nodes/AuthNode/AuthNode';
import styles from './Canvas.module.css';
import { v4 as uuid } from 'uuid';

const nodeTypes = {
    endpoint: EndpointNode,
    database: DatabaseNode,
    response: ResponseNode,
    auth: AuthNode,
};

const CanvasInner: React.FC = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const { project, addNode, addEdge, setSelectedNode, updateNodePosition } = useProjectStore();
    const setProject = useProjectStore((state) => state.setProject);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => {
            const updatedNodes = applyNodeChanges(changes, project.nodes as Node[]);

            changes.forEach((change) => {
                if (change.type === 'position' && change.position) {
                    updateNodePosition(change.id, change.position);
                }
                if (change.type === 'select') {
                    if (change.selected) {
                        setSelectedNode(change.id);
                    }
                }
            });

            setProject({ ...project, nodes: updatedNodes as typeof project.nodes });
        },
        [project, setProject, updateNodePosition, setSelectedNode]
    );

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            const updatedEdges = applyEdgeChanges(changes, project.edges as Edge[]);
            setProject({ ...project, edges: updatedEdges as typeof project.edges });
        },
        [project, setProject]
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            if (connection.source && connection.target) {
                addEdge({
                    id: uuid(),
                    source: connection.source,
                    target: connection.target,
                    sourceHandle: connection.sourceHandle ?? undefined,
                    targetHandle: connection.targetHandle ?? undefined,
                });
            }
        },
        [addEdge]
    );

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            setSelectedNode(node.id);
        },
        [setSelectedNode]
    );

    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    }, [setSelectedNode]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const nodeType = event.dataTransfer.getData('application/routify-node');
            if (!nodeType || !reactFlowWrapper.current) return;

            const bounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = {
                x: event.clientX - bounds.left - 110,
                y: event.clientY - bounds.top - 50,
            };

            addNode(nodeType, position);
        },
        [addNode]
    );

    return (
        <div className={styles.canvas} ref={reactFlowWrapper}>
            <ReactFlow
                nodes={project.nodes as Node[]}
                edges={project.edges as Edge[]}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onDragOver={onDragOver}
                onDrop={onDrop}
                fitView
                snapToGrid
                snapGrid={[16, 16]}
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                }}
            >
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="var(--canvas-grid-dot)"
                />
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        switch (node.type) {
                            case 'endpoint': return '#6366f1';
                            case 'database': return '#22d3ee';
                            case 'response': return '#10b981';
                            case 'auth': return '#f59e0b';
                            default: return '#64748b';
                        }
                    }}
                    maskColor="rgb(0 0 0 / 0.8)"
                />
            </ReactFlow>
        </div>
    );
};

export const Canvas: React.FC = () => {
    return (
        <ReactFlowProvider>
            <CanvasInner />
        </ReactFlowProvider>
    );
};
