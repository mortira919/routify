import { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import styles from './TagInput.module.css';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    suggestions?: string[];
}

export const TagInput: React.FC<TagInputProps> = ({
    tags,
    onChange,
    placeholder = 'Add tag...',
    suggestions = []
}) => {
    const [inputValue, setInputValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredSuggestions = suggestions.filter(
        s => s.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(s)
    );

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }
        setInputValue('');
        setShowSuggestions(false);
    };

    const removeTag = (index: number) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputValue) addTag(inputValue);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.tagsWrapper}>
                {tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>
                        {tag}
                        <button
                            className={styles.removeBtn}
                            onClick={() => removeTag(index)}
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <div className={styles.inputWrapper}>
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.input}
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        placeholder={tags.length === 0 ? placeholder : ''}
                    />
                </div>
            </div>

            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className={styles.suggestions}>
                    {filteredSuggestions.slice(0, 5).map((suggestion) => (
                        <button
                            key={suggestion}
                            className={styles.suggestion}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                addTag(suggestion);
                            }}
                        >
                            <Plus size={12} />
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
