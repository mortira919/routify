import { X } from 'lucide-react';
import { SchemaBuilder } from '../SchemaBuilder/SchemaBuilder';
import styles from './SchemaPanel.module.css';

interface SchemaPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SchemaPanel: React.FC<SchemaPanelProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.panel}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={20} />
                </button>
                <SchemaBuilder />
            </div>
        </div>
    );
};
