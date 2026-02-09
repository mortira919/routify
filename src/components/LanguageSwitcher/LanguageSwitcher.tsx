import React from 'react';
import { Radio } from 'antd';
import { useTranslation } from '../../i18n';

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useTranslation();

    return (
        <Radio.Group
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            size="small"
            buttonStyle="solid"
            className="language-switcher"
        >
            <Radio.Button value="ru">RU</Radio.Button>
            <Radio.Button value="en">EN</Radio.Button>
        </Radio.Group>
    );
};
