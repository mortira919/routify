import React from 'react';
import { Button, Typography, Space } from 'antd';
import { Layout as LayoutIcon, ChevronRight, Zap, Target, Cpu, Shield } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { useTranslation } from '../../i18n';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Onboarding.module.css';

const { Title, Text } = Typography;

export const Onboarding: React.FC = () => {
    const completeOnboarding = useProjectStore(state => state.completeOnboarding);
    const { t } = useTranslation();

    const features = [
        { icon: Zap, title: t.landing.features.flow.title, desc: t.landing.features.flow.desc },
        { icon: Target, title: t.landing.features.schema.title, desc: t.landing.features.schema.desc },
        { icon: Cpu, title: t.landing.features.codegen.title, desc: t.landing.features.codegen.desc },
        { icon: Shield, title: t.landing.features.security.title, desc: t.landing.features.security.desc },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                <div className={styles.glow1} />
                <div className={styles.glow2} />
            </div>

            {/* Sticky Header */}
            <header className={styles.landingHeader}>
                <div className={styles.headerLogo}>
                    <LayoutIcon className={styles.headerLogoIcon} size={32} />
                    <span>ROUTIFY</span>
                </div>
                <LanguageSwitcher />
            </header>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <Title level={1} className={styles.title}>
                        {t.landing.hero.title1}
                        <span className={styles.titleAccent}>{t.landing.hero.title2}</span>
                    </Title>
                    <Title level={3} className={styles.subtitle}>
                        {t.landing.hero.subtitle}
                    </Title>
                    <Button
                        type="primary"
                        size="large"
                        icon={<ChevronRight size={20} />}
                        onClick={completeOnboarding}
                        className={styles.getStartedBtn}
                    >
                        {t.landing.hero.cta}
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.sectionContainer}>
                <Title level={2} className={styles.sectionTitle}>
                    {t.landing.features.title}
                </Title>
                <div className={styles.featuresGrid}>
                    {features.map((item, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureIconWrap}>
                                <item.icon size={24} />
                            </div>
                            <Text strong className={styles.featureTitleText}>{item.title}</Text>
                            <Text className={styles.featureDescription}>{item.desc}</Text>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works Section */}
            <section className={styles.stepsContainer}>
                <div className={styles.sectionContainer}>
                    <Title level={2} className={styles.sectionTitle}>
                        {t.landing.howItWorks.title}
                    </Title>
                    <div className={styles.howItWorksGrid}>
                        {t.landing.howItWorks.steps.map((step, index) => (
                            <div key={index} className={styles.stepItem}>
                                <div className={styles.stepNumber}>{index + 1}</div>
                                <div className={styles.stepContent}>
                                    <Text strong className={styles.featureTitleText}>{step.title}</Text>
                                    <Text className={styles.featureDescription}>{step.desc}</Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className={styles.sectionContainer}>
                <Title level={2} className={styles.sectionTitle}>
                    {t.landing.techStack.title}
                </Title>
                <div className={styles.techStackGrid}>
                    {t.landing.techStack.items.map((item, index) => (
                        <div key={index} className={styles.techItem}>
                            <Text strong className={styles.techName}>{item.name}</Text>
                            <Text className={styles.techDesc}>{item.desc}</Text>
                        </div>
                    ))}
                </div>
            </section>

            {/* Use Cases Section */}
            <section className={styles.useCasesSection}>
                <div className={styles.sectionContainer}>
                    <Title level={2} className={styles.sectionTitle}>
                        Для кого это?
                    </Title>
                    <div className={styles.useCasesGrid}>
                        <div className={styles.useCaseCard}>
                            <span className={styles.useCaseEmoji}>🚀</span>
                            <Text className={styles.useCaseTitle}>Стартапы</Text>
                            <Text className={styles.useCaseDesc}>
                                Быстро прототипируйте MVP и получите работающий бэкенд за часы, а не недели.
                            </Text>
                        </div>
                        <div className={styles.useCaseCard}>
                            <span className={styles.useCaseEmoji}>👨‍💻</span>
                            <Text className={styles.useCaseTitle}>Разработчики</Text>
                            <Text className={styles.useCaseDesc}>
                                Автоматизируйте рутину и сосредоточьтесь на бизнес-логике вместо бойлерплейта.
                            </Text>
                        </div>
                        <div className={styles.useCaseCard}>
                            <span className={styles.useCaseEmoji}>🎓</span>
                            <Text className={styles.useCaseTitle}>Студенты</Text>
                            <Text className={styles.useCaseDesc}>
                                Изучайте архитектуру API визуально и понимайте связи между компонентами.
                            </Text>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>10x</span>
                        <span className={styles.statLabel}>Быстрее разработка</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>0</span>
                        <span className={styles.statLabel}>Бойлерплейт код</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>100%</span>
                        <span className={styles.statLabel}>TypeScript</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>∞</span>
                        <span className={styles.statLabel}>Возможностей</span>
                    </div>
                </div>
            </section>

            {/* Showcase Section */}
            <section className={styles.showcaseSection}>
                <Title level={2} className={styles.showcaseTitle}>
                    Как это выглядит
                </Title>

                <div className={styles.showcaseItem}>
                    <div className={styles.showcaseContent}>
                        <span className={styles.showcaseLabel}>Шаг 1</span>
                        <Text className={styles.showcaseHeading}>Визуальное проектирование</Text>
                        <Text className={styles.showcaseText}>
                            Drag-and-drop интерфейс позволяет создавать сложные API буквально перетаскивая узлы.
                            Эндпоинты, базы данных, аутентификация — всё на одном холсте.
                        </Text>
                    </div>
                    <div className={styles.showcaseImage}>
                        🎨
                    </div>
                </div>

                <div className={styles.showcaseItem}>
                    <div className={styles.showcaseContent}>
                        <span className={styles.showcaseLabel}>Шаг 2</span>
                        <Text className={styles.showcaseHeading}>Умные модели данных</Text>
                        <Text className={styles.showcaseText}>
                            Определяйте схемы с автоматической валидацией типов.
                            Связи между моделями создаются интуитивно понятным образом.
                        </Text>
                    </div>
                    <div className={styles.showcaseImage}>
                        📊
                    </div>
                </div>

                <div className={styles.showcaseItem}>
                    <div className={styles.showcaseContent}>
                        <span className={styles.showcaseLabel}>Шаг 3</span>
                        <Text className={styles.showcaseHeading}>Генерация кода</Text>
                        <Text className={styles.showcaseText}>
                            Один клик — и получаете готовый архив с Express.js сервером,
                            Prisma схемами, middleware и полной документацией Swagger.
                        </Text>
                    </div>
                    <div className={styles.showcaseImage}>
                        ⚡
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className={styles.quoteSection}>
                <Text className={styles.quoteText}>
                    "Лучший код — тот, который не нужно писать вручную"
                </Text>
                <span className={styles.quoteAuthor}>— Философия Routify</span>
            </section>

            {/* CTA Section */}
            <section className={styles.finalCta}>
                <Title level={2} className={styles.sectionTitle}>
                    {t.landing.finalCta.title}
                </Title>
                <Title level={4} className={styles.subtitle} style={{ marginBottom: '40px' }}>
                    {t.landing.finalCta.subtitle}
                </Title>
                <Space size="large">
                    <Button
                        type="primary"
                        size="large"
                        onClick={completeOnboarding}
                        className={styles.getStartedBtn}
                    >
                        {t.landing.hero.cta}
                    </Button>
                    <Button
                        size="large"
                        className={styles.manualBtn}
                        onClick={completeOnboarding}
                    >
                        {t.landing.finalCta.button}
                    </Button>
                </Space>
            </section>

            {/* Footer */}
            <footer className={styles.landingFooter}>
                <div className={styles.footerContent}>
                    {t.landing.footer.status}
                </div>
            </footer>
        </div>
    );
};
