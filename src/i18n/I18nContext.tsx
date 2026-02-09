import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ru } from './ru';
import { en } from './en';
import { type BaseTranslations } from './types';

type Language = 'ru' | 'en';

interface I18nContextType {
    t: BaseTranslations;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const translations: Record<Language, BaseTranslations> = { ru, en };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(() => {
        const saved = localStorage.getItem('routify-lang');
        return (saved === 'ru' || saved === 'en') ? saved : 'ru';
    });

    useEffect(() => {
        localStorage.setItem('routify-lang', language);
    }, [language]);

    return (
        <I18nContext.Provider value={{ t: translations[language], language, setLanguage }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within I18nProvider');
    }
    return context;
};
