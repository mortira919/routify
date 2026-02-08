import { X, GraduationCap } from 'lucide-react';
import { useTranslation } from '../../i18n';
import styles from './TutorialPanel.module.css';

interface TutorialPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TutorialPanel: React.FC<TutorialPanelProps> = ({ isOpen, onClose }) => {
    const t = useTranslation();

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.panel}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <GraduationCap size={22} className={styles.titleIcon} />
                        {t.tutorial.title}
                    </h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    {t.tutorial.steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <div className={styles.stepNumber}>{index + 1}</div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepText}>{step.text}</p>
                        </div>
                    ))}

                    <div className={styles.tip}>
                        {t.tutorial.tip}
                    </div>
                </div>
            </div>
        </div>
    );
};
