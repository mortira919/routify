# Project Settings

The Settings screen allows users to configure project-wide parameters, such as the target database, server port, and API base path.

## Technical Realization

### Core Technologies
- **React**: Manages local form state before saving to the global store.
- **Zustand**: Persists settings globally.
- **Lucide React**: Icons for visual categorization (Database, Globe, Shield).

### Implementation Details
- **Local State Management**: Uses a local `settings` state to capture user changes without immediately affecting the whole project. Changes are committed to the global store only when clicking "Save".
- **Dynamic Options**: Backend generation logic adapts based on these settings (e.g., choosing between Mongoose or Prisma depending on the database choice).
- **Toggle Features**: Users can enable/disable high-level features like Swagger documentation and CORS support.

## Code Snippets

### Database Configuration Options
```typescript
const DATABASE_OPTIONS = [
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
] as const;
```

### Save Handler
Committing local form state to the project store:
```typescript
const handleSave = () => {
    updateSettings(settings); // updateSettings comes from useProjectStore()
    onClose();
};
```

### Features Configuration
Handling CORS and Swagger toggles:
```tsx
<label className={styles.checkbox}>
    <input
        type="checkbox"
        checked={settings.enableSwagger}
        onChange={(e) => setSettings({ ...settings, enableSwagger: e.target.checked })}
    />
    <span>{t.settings.features.enableSwagger}</span>
</label>
<label className={styles.checkbox}>
    <input
        type="checkbox"
        checked={settings.enableCors}
        onChange={(e) => setSettings({ ...settings, enableCors: e.target.checked })}
    />
    <span>{t.settings.features.enableCors}</span>
</label>
```
