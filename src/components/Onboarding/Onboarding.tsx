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
