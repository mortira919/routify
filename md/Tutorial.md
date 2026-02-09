# Tutorial Panel

The Tutorial Panel provides users with a step-by-step guide on how to use Routify effectively.

## Technical Realization

### Core Technologies
- **React**: Handles the presentation of tutorial steps.
- **i18n Translation System**: Content is fully localized, allowing the tutorial to adapt to the user's language setting.
- **CSS Modules**: Provides scoped styling for the tutorial steps and tips.

### Implementation Details
- **Step-by-Step UI**: Iterates through a set of predefined steps defined in the translation files.
- **Backdrop Handling**: Features a "click outside to close" mechanism.
- **Icons**: Uses `GraduationCap` for the title and `X` for closing.

## Code Snippets

### Rendering Tutorial Steps
The panel dynamically renders steps from the translation object:
```tsx
<div className={styles.content}>
    {t.tutorial.steps.map((step, index) => (
        <div key={index} className={styles.step}>
            <div className={styles.stepNumber}>{index + 1}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.text}</p>
        </div>
    ))}
</div>
```

### Modal Overlay Logic
Close when the backdrop (the dark area behind the panel) is clicked:
```typescript
const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
};
```
