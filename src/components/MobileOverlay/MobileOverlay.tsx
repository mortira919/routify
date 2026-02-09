import React from 'react';
import { Monitor, Smartphone, ArrowRight } from 'lucide-react';
import styles from './MobileOverlay.module.css';

interface MobileOverlayProps {
    onShowOnboarding: () => void;
}

export const MobileOverlay: React.FC<MobileOverlayProps> = ({ onShowOnboarding }) => {
    return (
        <div className={styles.overlay}>
            {/* Animated Background */}
            <div className={styles.bgGlow} />
            <div className={styles.bgGrid} />

            {/* Content */}
            <div className={styles.content}>
                {/* Icon */}
                <div className={styles.iconWrapper}>
                    <div className={styles.iconPhone}>
                        <Smartphone size={32} />
                    </div>
                    <div className={styles.iconArrow}>
                        <ArrowRight size={24} />
                    </div>
                    <div className={styles.iconDesktop}>
                        <Monitor size={40} />
                    </div>
                </div>

                {/* Logo */}
                <div className={styles.logo}>
                    <img src="/apiicon.png" alt="Routify" className={styles.logoIcon} />
                </div>

                {/* Title */}
                <h1 className={styles.title}>
                    <span className={styles.italic}>Routify</span> создан для десктопа
                </h1>

                {/* Description */}
                <p className={styles.description}>
                    Визуальный конструктор API требует большого экрана
                    для комфортной работы с drag-and-drop интерфейсом
                </p>

                {/* URL Hint */}
                <div className={styles.urlHint}>
                    <span className={styles.urlLabel}>Откройте на компьютере:</span>
                    <span className={styles.url}>routify.vercel.app</span>
                </div>

                {/* CTA */}
                <button className={styles.ctaButton} onClick={onShowOnboarding}>
                    Посмотреть презентацию
                    <ArrowRight size={18} />
                </button>

                {/* Features Preview */}
                <div className={styles.features}>
                    <div className={styles.featureItem}>
                        <span className={styles.featureEmoji}>🎨</span>
                        <span>Визуальный редактор</span>
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.featureEmoji}>⚡</span>
                        <span>Генерация кода</span>
                    </div>
                    <div className={styles.featureItem}>
                        <span className={styles.featureEmoji}>🔐</span>
                        <span>JWT авторизация</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
