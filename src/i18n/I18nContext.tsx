import { createContext, useContext, type ReactNode } from 'react';
import { ru, type Translations } from './ru';

interface I18nContextType {
    t: Translations;
}

const I18nContext = createContext<I18nContextType>({ t: ru });

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <I18nContext.Provider value={{ t: ru }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within I18nProvider');
    }
    return context.t;
};
