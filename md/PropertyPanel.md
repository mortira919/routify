# Property Panel

The Property Panel is a contextual editor that appears when a user selects a node on the Canvas. It allows for fine-grained configuration of each node's behavior.

## Technical Realization

### Core Technologies
- **React**: Manages the complex conditional rendering based on the selected node type.
- **Zustand**: Directly reads and writes node configuration data in the store.
- **Lucide React**: Icons for section headers (Shield, FileText, Zap, etc.).
- **CSS Modules**: Provides scoped layout and styling for the editor fields.

### Implementation Details
- **Contextual Forms**: Dynamically switches between the **Endpoint Form** and the **Database Form** depending on whether an endpoint or database node is selected.
- **Section-based Layout**: Uses expandable sections to group related settings (Basic, Auth, Params, Response).
- **Sub-editors**: Integrates specialized components like `SchemaEditor`, `TagInput`, and `RoleSelector` for complex data management.
- **Real-time Feedback**: Updates to the form are immediately pushed back to the node configuration in the store, providing instant visual feedback on the Canvas.

## Code Snippets

### Conditional Form Rendering
The panel determines what to show based on the selected node's data type:
```tsx
<div className={styles.content}>
    {selectedNode.data.type === 'endpoint' && renderEndpointForm(selectedNode.data.config)}
    {selectedNode.data.type === 'database' && renderDatabaseForm(selectedNode.data.config)}
</div>
```

### Config Update Utility
A specialized function to update the configuration of the selected node:
```typescript
const updateConfig = (updates: Partial<EndpointConfig | DatabaseConfig>) => {
    updateNode(selectedNode.id, {
        ...selectedNode.data,
        config: { ...selectedNode.data.config, ...updates },
    } as typeof selectedNode.data);
};
```

### Section Logic
Handling the expansion/collapse state of the panels:
```typescript
const toggleSection = (section: SectionName) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
        newExpanded.delete(section);
    } else {
        newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
};
```
