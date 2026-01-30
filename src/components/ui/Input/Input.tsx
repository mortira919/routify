import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    const inputClasses = [
        styles.input,
        error && styles.error,
        className,
    ].filter(Boolean).join(' ');

    if (!label && !error && !helperText) {
        return <input className={inputClasses} {...props} />;
    }

    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <input className={inputClasses} {...props} />
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    helperText,
    className = '',
    ...props
}) => {
    const textareaClasses = [
        styles.input,
        styles.textarea,
        error && styles.error,
        className,
    ].filter(Boolean).join(' ');

    if (!label && !error && !helperText) {
        return <textarea className={textareaClasses} {...props} />;
    }

    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <textarea className={textareaClasses} {...props} />
            {helperText && !error && <span className={styles.helperText}>{helperText}</span>}
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};
