import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import styles from './HintTooltip.module.css';

interface HintTooltipProps {
    title: string;
    what?: string;
    why?: string;
    how?: string;
    text?: string;
    children?: React.ReactNode;
}

export const HintTooltip: React.FC<HintTooltipProps> = ({
    title,
    what,
    why,
    how,
    text,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={styles.hintWrapper} ref={tooltipRef}>
            {children}
            <button
                className={styles.hintTrigger}
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                type="button"
                aria-label="Показать подсказку"
            >
                <HelpCircle size={12} />
            </button>

            {isOpen && (
                <div className={styles.hintTooltip}>
                    <h4 className={styles.hintTitle}>{title}</h4>

                    {text && (
                        <p className={styles.hintText}>{text}</p>
                    )}

                    {what && (
                        <div className={styles.hintSection}>
                            <div className={styles.hintLabel}>Что это</div>
                            <p className={styles.hintText}>{what}</p>
                        </div>
                    )}

                    {why && (
                        <div className={styles.hintSection}>
                            <div className={styles.hintLabel}>Зачем</div>
                            <p className={styles.hintText}>{why}</p>
                        </div>
                    )}

                    {how && (
                        <div className={styles.hintSection}>
                            <div className={styles.hintLabel}>Как использовать</div>
                            <p className={styles.hintText}>{how}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
