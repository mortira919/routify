# Canvas Screen

The Canvas is the heart of the Routify application. It provides an interactive, node-based workspace where users can visually design their REST API workflows.

## Technical Realization

### Core Technologies
- **@xyflow/react (formerly React Flow)**: The primary library used for rendering the interactive graph. It handles zooming, panning, node dragging, and edge connections.
- **Zustand**: Used for global state management via the `useProjectStore`. The canvas state (nodes and edges) is synchronized with the store.
- **Lucide React**: Provides the icons used within the nodes and controls.

### Implementation Details
- **Custom Node Types**: The canvas uses several custom node types: `endpoint`, `database`, `response`, and `auth`. Each is implemented as a separate React component in `src/nodes/`.
- **Drag and Drop**: Users can drag nodes from the Sidebar and drop them onto the Canvas. This is implemented using the HTML5 Drag and Drop API, with `onDragOver` and `onDrop` handlers.
- **State Synchronization**: All changes to nodes (position, selection, removal) and edges (connection, removal) are immediately reflected in the Zustand store.

## Code Snippets

### Node Types Mapping
The mapping between node types and their React components:
```typescript
const nodeTypes = {
    endpoint: EndpointNode,
    database: DatabaseNode,
    response: ResponseNode,
    auth: AuthNode,
};
```

### Drag and Drop Handler
The logic for adding a new node when it's dropped onto the canvas:
```typescript
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
```

### ReactFlow Integration
The main render loop for the canvas:
```tsx
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
    <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
    <Controls />
    <MiniMap />
</ReactFlow>
```
