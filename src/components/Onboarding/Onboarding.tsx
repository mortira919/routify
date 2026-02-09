import React from 'react';
import { Button, Typography, Space } from 'antd';
import { ChevronRight, Zap, Target, Cpu, Shield } from 'lucide-react';
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
                    <img src="/apiicon.png" alt="Routify" className={styles.headerLogoImg} />
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

            {/* Features Section - Interactive Demo */}
            <section className={styles.featuresSection}>
                <Title level={2} className={styles.sectionTitle}>
                    <span className={styles.italicAccent}>Инструменты</span> промышленного класса
                </Title>

                <div className={styles.featuresShowcase}>
                    {/* Central Demo Animation */}
                    <div className={styles.demoCenter}>
                        <div className={styles.demoWindow}>
                            <div className={styles.demoWindowHeader}>
                                <span className={styles.demoWindowDot} />
                                <span className={styles.demoWindowDot} />
                                <span className={styles.demoWindowDot} />
                            </div>
                            <div className={styles.demoWindowContent}>
                                <div className={styles.demoPlaceholder}>
                                    <span>demo.gif</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Pills around demo */}
                    <div className={styles.featurePills}>
                        {features.map((item, index) => (
                            <div key={index} className={`${styles.featurePill} ${styles[`featurePill${index + 1}`]}`}>
                                <div className={styles.featurePillIcon}>
                                    <item.icon size={20} />
                                </div>
                                <div className={styles.featurePillContent}>
                                    <Text strong className={styles.featurePillTitle}>{item.title}</Text>
                                    <Text className={styles.featurePillDesc}>{item.desc}</Text>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works - Visual Timeline */}
            <section className={styles.timelineSection}>
                <Title level={2} className={styles.sectionTitle}>
                    <span className={styles.italicAccent}>Как это</span> работает
                </Title>

                <div className={styles.timelineTrack}>
                    <div className={styles.timelineLine} />

                    {t.landing.howItWorks.steps.map((step, index) => (
                        <div key={index} className={`${styles.timelineStep} ${index % 2 === 0 ? styles.timelineLeft : styles.timelineRight}`}>
                            <div className={styles.timelineNode}>
                                <span>{index + 1}</span>
                            </div>
                            <div className={styles.timelineCard}>
                                <Text strong className={styles.timelineTitle}>{step.title}</Text>
                                <Text className={styles.timelineDesc}>{step.desc}</Text>
                                <div className={styles.timelineVisual}>
                                    <div className={styles.timelinePlaceholder}>
                                        <span>step{index + 1}.png</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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

            {/* Use Cases - Floating Cards Design */}
            <section className={styles.useCasesSection}>
                <Title level={2} className={styles.sectionTitle}>
                    <span className={styles.italicAccent}>Для кого</span> это создано?
                </Title>

                <div className={styles.floatingCards}>
                    <div className={`${styles.floatingCard} ${styles.floatingCard1}`}>
                        <div className={styles.floatingCardGlow} />
                        <img src="/startup.png" alt="Startup" className={styles.floatingIcon} />
                        <Text className={styles.floatingTitle}>Стартапы</Text>
                        <Text className={styles.floatingDesc}>
                            От идеи до MVP за считанные часы. Прототипируйте быстрее конкурентов.
                        </Text>
                    </div>

                    <div className={`${styles.floatingCard} ${styles.floatingCard2}`}>
                        <div className={styles.floatingCardGlow} />
                        <img src="/developer.png" alt="Developer" className={styles.floatingIcon} />
                        <Text className={styles.floatingTitle}>Разработчики</Text>
                        <Text className={styles.floatingDesc}>
                            Забудьте про бойлерплейт. Фокус на логике, не на рутине.
                        </Text>
                    </div>

                    <div className={`${styles.floatingCard} ${styles.floatingCard3}`}>
                        <div className={styles.floatingCardGlow} />
                        <img src="/student.png" alt="Student" className={styles.floatingIcon} />
                        <Text className={styles.floatingTitle}>Студенты</Text>
                        <Text className={styles.floatingDesc}>
                            Визуальное понимание архитектуры. Учитесь на практике.
                        </Text>
                    </div>
                </div>
            </section>

            {/* Stats Section - Animated counters */}
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

            {/* Showcase - Bento Grid Design */}
            <section className={styles.showcaseSection}>
                <Title level={2} className={styles.showcaseTitle}>
                    <span className={styles.italicAccent}>Как это</span> работает
                </Title>

                <div className={styles.bentoGrid}>
                    <div className={`${styles.bentoCard} ${styles.bentoLarge}`}>
                        <span className={styles.bentoNumber}>01</span>
                        <div className={styles.bentoContent}>
                            <Text className={styles.bentoHeading}>Визуальное проектирование</Text>
                            <Text className={styles.bentoText}>
                                Drag-and-drop интерфейс. Эндпоинты, базы данных, аутентификация —
                                всё на одном холсте.
                            </Text>
                        </div>
                        <div className={styles.bentoVisual}>
                            <div className={styles.bentoPlaceholder}>
                                <span>canvas.png</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.bentoCard} ${styles.bentoSmall}`}>
                        <span className={styles.bentoNumber}>02</span>
                        <div className={styles.bentoContent}>
                            <Text className={styles.bentoHeading}>Умные схемы</Text>
                            <Text className={styles.bentoText}>
                                Автоматическая валидация типов и связей между моделями.
                            </Text>
                        </div>
                        <div className={styles.bentoVisual}>
                            <div className={styles.bentoPlaceholder}>
                                <span>schema.png</span>
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.bentoCard} ${styles.bentoSmall}`}>
                        <span className={styles.bentoNumber}>03</span>
                        <div className={styles.bentoContent}>
                            <Text className={styles.bentoHeading}>Генерация кода</Text>
                            <Text className={styles.bentoText}>
                                Express.js, Prisma, Swagger — всё в одном архиве.
                            </Text>
                        </div>
                        <div className={styles.bentoVisual}>
                            <div className={styles.bentoPlaceholder}>
                                <span>codegen.png</span>
                            </div>
                        </div>
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
