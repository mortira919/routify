# Sidebar

The Sidebar acts as a node palette and project navigation bar, allowing users to discover and add new functionality to their project.

## Technical Realization

### Core Technologies
- **React**: Manages the sidebar's state and search functionality.
- **HTML5 Drag and Drop**: Enables dragging nodes from the sidebar onto the canvas.
- **Lucide React**: Provides the icons for node types and actions.

### Implementation Details
- **Node Categorization**: Nodes are grouped into Endpoints, Data, and Security categories.
- **Search and Filter**: Users can search for nodes by name or description. The filter logic is applied in real-time as the user types.
- **Project Actions**: Contains global actions like opening the Schema Editor and exporting the project as a JSON file.
- **Proactive Help**: Includes tooltips and hints that explain what each node does and why it's used.

## Code Snippets

### Drag Handle Logic
Attaching data to the drag event so the Canvas knows which node type is being added:
```typescript
const handleDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/routify-node', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};
```

### Search/Filter Logic
Filtering the node types based on the user's search query:
```typescript
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
```

### Project Export
Serializing the project state to a downloadable JSON file:
```typescript
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
```
