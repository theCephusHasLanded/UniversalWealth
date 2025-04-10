import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es' | 'fr' | 'zh' | 'ja' | 'ru' | 'xh' | 'ar' | 'ht';

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Simple translation dictionary with nested objects for different sections
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Add language.ht entry
    'language.ht': 'Kreyòl Ayisyen',
    // Common
    'app.name': 'LKHN UNIVERSAL WEALTH',
    'app.tagline': 'QUANTUM ECOSYSTEM',
    'app.overview': 'An exclusive ecosystem that redefines prosperity through avant-garde digital finance, curated spaces, and proprietary AI-driven insights.',
    'app.explore': 'DISCOVER ELEVATED PROSPERITY',
    'app.exclusive.heading': 'EXCLUSIVE INVESTMENT OPPORTUNITY',
    'app.exclusive.subheading': 'Limited access wealth creation ecosystem',
    'app.join': 'REQUEST MEMBERSHIP',
    'app.access': 'ACCESS PLATFORM',
    'app.exclusive.feature1': 'By invitation only',
    'app.exclusive.feature2': 'Limited membership',
    'app.exclusive.feature3': 'Curated investment opportunities',
    'app.testimonials.heading': 'MEMBER EXPERIENCES',
    'app.members.heading': 'MEMBERS-ONLY BENEFITS',
    'app.testimonial1.quote': 'LKHN\'s exclusive approach to wealth building has accelerated my portfolio growth beyond what I thought possible. The AI insights are truly game-changing.',
    'app.testimonial1.name': 'Alexandra M.',
    'app.testimonial1.title': 'Angel Investor',
    'app.testimonial2.quote': 'Having access to LKHN\'s curated opportunities has transformed my investment strategy. The physical Hub spaces create connections that simply aren\'t possible elsewhere.',
    'app.testimonial2.name': 'Jackson W.',
    'app.testimonial2.title': 'Family Office Manager',
    'app.members.feature1.title': 'Private Investment Circles',
    'app.members.feature1.desc': 'Exclusive access to pre-market opportunities and member-led investment pools for elevated capital access.',
    'app.members.feature2.title': 'Invitation-Only Events',
    'app.members.feature2.desc': 'Curated networking and educational gatherings with industry leaders and wealth visionaries.',
    'app.members.feature3.title': 'Bespoke AI Analysis',
    'app.members.feature3.desc': 'Personalized artificial intelligence tools calibrated to your specific wealth goals and risk tolerance.',
    'app.invitecode.heading': 'Have an invitation code?',
    'common.save': 'Save',
    'common.saving': 'Saving...',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.update': 'Update',
    'common.loading': 'Loading...',
    'common.backToHome': 'Back to Home',
    'common.search': 'Search',
    'common.viewAll': 'View All',
    'common.seeMore': 'See More',
    'common.readMore': 'Read More',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.empty': 'No new notifications',
    'notifications.viewAll': 'View All Notifications',
    
    // Footer
    'footer.copyright': 'All rights reserved',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.cookies': 'Cookies',
    'footer.contact': 'Contact',
    'footer.email': 'info@lkhn.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.consultation': 'Book a Consultation',
    'footer.back_to_top': 'Back to top',
    
    // Navigation
    'nav.invite': 'Invite',
    'nav.overview': 'Overview',
    'nav.wealth': 'Wealth',
    'nav.hub': 'Hub',
    'nav.trendcrypto': 'TrendCrypto',
    'nav.lificosm': 'Lificosm',
    'nav.forum': 'Forum',
    'nav.profile': 'Profile',
    
    // Dashboard
    'dashboard.components': 'ECOSYSTEM COMPONENTS',
    'dashboard.pillars': 'THE THREE PILLARS',
    'dashboard.impact': 'COMMUNITY IMPACT',
    'dashboard.universal': 'UNIVERSAL WEALTH VISION',
    'dashboard.impact.desc': 'Creating sustainable prosperity across underserved communities',
    
    // Platforms
    'wealth.name': 'WEALTH BY LKHN',
    'wealth.description': 'Exclusive financial ecosystem with proprietary AI and advanced credit-building strategies',
    'hub.name': 'LKHN HUB',
    'hub.description': 'Curated members-only spaces for networking, creation, and financial mastery',
    'trendcrypto.name': 'LKHN TRENDCRYPTO',
    'trendcrypto.description': 'Sophisticated crypto analysis with proprietary algorithms and early access opportunities',
    'lificosm.name': 'LIFICOSM',
    'lificosm.description': 'Member-exclusive community platform enabling collaborative prosperity creation',
    
    // Lificosm Events
    'lificosm.events.title': 'Community Events',
    'lificosm.events.subtitle': 'Exclusive gatherings for LKHN members',
    'lificosm.events.all': 'All Categories',
    'lificosm.events.education': 'Education',
    'lificosm.events.culture': 'Culture',
    'lificosm.events.community': 'Community',
    'lificosm.events.attending': 'attending',
    'lificosm.events.registered': 'Registered',
    'lificosm.events.rsvp': 'RSVP',
    
    // Lificosm Marketplace
    'lificosm.marketplace.title': 'Community Marketplace',
    'lificosm.marketplace.subtitle': 'Exchange goods and services with other members',
    'lificosm.marketplace.newListing': 'New Listing',
    'lificosm.marketplace.exchange': 'Exchange',
    'lificosm.marketplace.forSale': 'For Sale',
    'lificosm.marketplace.contact': 'Contact Seller',
    
    // Authentication
    'auth.login': 'Sign In',
    'auth.signup': 'Create Account',
    'auth.logout': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.sendResetLink': 'Send Reset Link',
    'auth.googleLogin': 'Continue with Google',
    'auth.needAccount': 'Need an account? Sign up',
    'auth.haveAccount': 'Already have an account? Sign in',
    'auth.backToLogin': 'Back to sign in',
    'auth.or': 'OR',
    
    // Profile
    'profile.editProfile': 'Edit Profile',
    'profile.overview': 'Overview',
    'profile.activity': 'Activity',
    'profile.connections': 'Connections',
    'profile.settings': 'Settings',
    'profile.about': 'About',
    'profile.noBio': 'This user has not added a bio yet.',
    'profile.memberSince': 'Member since',
    'profile.adminRole': 'Administrator',
    'profile.leaderRole': 'Community Leader',
    'profile.businessRole': 'Business Owner',
    'profile.memberRole': 'Member',
    'profile.achievements': 'Achievements',
    'profile.noAchievements': 'No achievements unlocked yet.',
    'profile.stats': 'Statistics',
    'profile.wealthScore': 'Wealth Score',
    'profile.creditScore': 'Credit Score',
    'profile.contributions': 'Community Contributions',
    'profile.events': 'Events Attended',
    'profile.socialLinks': 'Social Links',
    'profile.noSocialLinks': 'No social links added yet.',
    'profile.profileImage': 'Profile Image',
    'profile.coverImage': 'Cover Image',
    'profile.coverPhoto': 'Cover Photo',
    'profile.displayName': 'Display Name',
    'profile.bio': 'Bio',
    'profile.location': 'Location',
    'profile.website': 'Website',
    'profile.phoneNumber': 'Phone Number',
    'profile.message': 'Message',
    'profile.connect': 'Connect',
    'profile.noConnections': 'No Connections Yet',
    'profile.connectionsEmpty': 'You haven\'t connected with anyone yet. Start building your network!',
    'profile.connectedSince': 'Connected since',
    'profile.errorTitle': 'Error Loading Profile',
    'profile.userNotFound': 'User Not Found',
    'profile.userNotFoundDesc': 'The user profile you\'re looking for doesn\'t exist or has been removed.',
    'profile.noActivity': 'No Recent Activity',
    'profile.activityEmpty': 'Your activity history will appear here once you start using the platform.',
    'profile.activityHistory': 'Activity History',
    'profile.settingsTitle': 'User Settings',
    'profile.settingsDesc': 'Manage your account settings, preferences, and privacy options.',
    'profile.goToSettings': 'Go to Settings',
    
    // Forum
    'forum.title': 'Community Forum',
    'forum.description': 'Connect with other LKHN members, share ideas, ask questions, and contribute to our growing community.',
    'forum.searchPlaceholder': 'Search posts, topics, and tags...',
    'forum.filter': 'Filter',
    'forum.newPost': 'New Post',
    'forum.allCategories': 'All Categories',
    'forum.posts': 'posts',
    'forum.featuredPosts': 'Featured Posts',
    'forum.recentPosts': 'Recent Posts',
    'forum.searchResults': 'Search Results',
    'forum.noPosts': 'No Posts Yet',
    'forum.noSearchResults': 'No Results Found',
    'forum.noCategoryPosts': 'No Posts in This Category',
    'forum.tryDifferentSearch': 'Try different keywords or browse categories',
    'forum.beFirstToPost': 'Be the first to post in this category',
    'forum.createPost': 'Create Post',
    
    // Metrics
    'metric.users': 'Users',
    'metric.credit': 'Avg. Credit Increase',
    'metric.capital': 'Total Capital Accessed',
    'metric.locations': 'Active Locations',
    'metric.visitors': 'Monthly Visitors',
    'metric.businesses': 'Local Businesses Supported',
    'metric.premium': 'Premium Users',
    'metric.detection': 'Trend Detection Lead Time',
    'metric.performance': 'Avg. Portfolio Performance',
    'metric.investment': 'Community Investment',
    'metric.score': 'Avg Credit Score Increase',
    'metric.jobs': 'Jobs Created',
    'metric.workshops': 'Financial Literacy Workshops',
    'metric.lificosm.members': 'Active Members',
    'metric.lificosm.businesses': 'Local Businesses',
    'metric.lificosm.savings': 'Savings Generated',
    
    // Language selector
    'language': 'Language',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
  },
  es: {
    // Language names
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.ht': 'Kreyòl Ayisyen',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
    
    // Common
    'app.name': 'RIQUEZA UNIVERSAL LKHN',
    'app.tagline': 'ECOSISTEMA CUÁNTICO',
    'app.overview': 'Un ecosistema integral que integra finanzas digitales, espacios físicos y perspectivas impulsadas por IA para crear acceso universal a la prosperidad.',
    'app.explore': 'EXPLORAR INTEGRACIÓN CUÁNTICA',
    
    // Footer
    'footer.copyright': 'Todos los derechos reservados',
    'footer.legal': 'Legal',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos y Condiciones',
    'footer.cookies': 'Cookies',
    'footer.contact': 'Contacto',
    'footer.email': 'info@lkhn.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.consultation': 'Reservar una Consulta',
    'footer.back_to_top': 'Volver arriba',
    
    // Navigation
    'nav.overview': 'General',
    'nav.wealth': 'Riqueza',
    'nav.hub': 'Centro',
    'nav.trendcrypto': 'TendenciaCripto',
    'nav.lificosm': 'Lificosm',
    
    // Dashboard
    'dashboard.components': 'COMPONENTES DEL ECOSISTEMA',
    'dashboard.pillars': 'LOS TRES PILARES',
    'dashboard.impact': 'IMPACTO COMUNITARIO',
    'dashboard.universal': 'IMPACTO DE LA RIQUEZA UNIVERSAL',
    'dashboard.impact.desc': 'Creando prosperidad sostenible en comunidades desatendidas',
    
    // Platforms
    'wealth.name': 'RIQUEZA POR LKHN',
    'wealth.description': 'Plataforma de inclusión financiera con asistente de IA y creación de crédito en 4 pagos',
    'hub.name': 'CENTRO LKHN',
    'hub.description': 'Espacios físicos para la comunidad, creación y educación financiera',
    'trendcrypto.name': 'LKHN TENDENCIACRIPTO',
    'trendcrypto.description': 'Análisis de criptomonedas impulsado por IA con enfoque en XRP y monedas emergentes',
    
    // Lificosm Events
    'lificosm.events.title': 'Eventos de la Comunidad',
    'lificosm.events.subtitle': 'Encuentros exclusivos para miembros de LKHN',
    'lificosm.events.all': 'Todas las Categorías',
    'lificosm.events.education': 'Educación',
    'lificosm.events.culture': 'Cultura',
    'lificosm.events.community': 'Comunidad',
    'lificosm.events.attending': 'asistentes',
    'lificosm.events.registered': 'Registrado',
    'lificosm.events.rsvp': 'CONFIRMAR',
    
    // Lificosm Marketplace
    'lificosm.marketplace.title': 'Mercado Comunitario',
    'lificosm.marketplace.subtitle': 'Intercambia bienes y servicios con otros miembros',
    'lificosm.marketplace.newListing': 'Nuevo Anuncio',
    'lificosm.marketplace.exchange': 'Intercambio',
    'lificosm.marketplace.forSale': 'En Venta',
    'lificosm.marketplace.contact': 'Contactar Vendedor',
    
    // Metrics
    'metric.users': 'Usuarios',
    'metric.credit': 'Aumento de Crédito Promedio',
    'metric.capital': 'Capital Total Accedido',
    'metric.locations': 'Ubicaciones Activas',
    'metric.visitors': 'Visitantes Mensuales',
    'metric.businesses': 'Negocios Locales Apoyados',
    'metric.premium': 'Usuarios Premium',
    'metric.detection': 'Tiempo de Anticipación de Tendencias',
    'metric.performance': 'Rendimiento Promedio de Cartera',
    'metric.investment': 'Inversión Comunitaria',
    'metric.score': 'Aumento Promedio de Puntaje Crediticio',
    'metric.jobs': 'Empleos Creados',
    'metric.workshops': 'Talleres de Educación Financiera',
    
    // Language selector
    'language': 'Idioma',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
  },
  fr: {
    // Language names
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.ht': 'Kreyòl Ayisyen',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
    
    // Common
    'app.name': 'RICHESSE UNIVERSELLE LKHN',
    'app.tagline': 'ÉCOSYSTÈME QUANTIQUE',
    'app.overview': 'Un écosystème complet intégrant la finance numérique, les espaces physiques et les perspectives basées sur l\'IA pour créer un accès universel à la prospérité.',
    'app.explore': 'EXPLORER L\'INTÉGRATION QUANTIQUE',
    
    // Footer
    'footer.copyright': 'Tous droits réservés',
    'footer.legal': 'Mentions Légales',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions Générales',
    'footer.cookies': 'Cookies',
    'footer.contact': 'Contact',
    'footer.email': 'info@lkhn.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.consultation': 'Réserver une Consultation',
    'footer.back_to_top': 'Retour en haut',
    
    // Navigation
    'nav.overview': 'Aperçu',
    'nav.wealth': 'Richesse',
    'nav.hub': 'Centre',
    'nav.trendcrypto': 'TendanceCrypto',
    'nav.lificosm': 'Lificosm',
    
    // Dashboard
    'dashboard.components': 'COMPOSANTS DE L\'ÉCOSYSTÈME',
    'dashboard.pillars': 'LES TROIS PILIERS',
    'dashboard.impact': 'IMPACT COMMUNAUTAIRE',
    'dashboard.universal': 'IMPACT DE LA RICHESSE UNIVERSELLE',
    'dashboard.impact.desc': 'Créer une prospérité durable dans les communautés mal desservies',
    
    // Platforms
    'wealth.name': 'RICHESSE PAR LKHN',
    'wealth.description': 'Plateforme d\'inclusion financière avec assistant IA et renforcement du crédit en 4 paiements',
    'hub.name': 'CENTRE LKHN',
    'hub.description': 'Espaces physiques pour la communauté, la création et l\'éducation financière',
    'trendcrypto.name': 'LKHN TENDANCECRYPTO',
    'trendcrypto.description': 'Analyse crypto alimentée par IA avec un accent sur XRP et les monnaies émergentes',

    // Lificosm Events
    'lificosm.events.title': 'Événements Communautaires',
    'lificosm.events.subtitle': 'Rassemblements exclusifs pour les membres LKHN',
    'lificosm.events.all': 'Toutes les Catégories',
    'lificosm.events.education': 'Éducation',
    'lificosm.events.culture': 'Culture',
    'lificosm.events.community': 'Communauté',
    'lificosm.events.attending': 'participants',
    'lificosm.events.registered': 'Inscrit',
    'lificosm.events.rsvp': 'RÉSERVER',
    
    // Lificosm Marketplace
    'lificosm.marketplace.title': 'Marché Communautaire',
    'lificosm.marketplace.subtitle': 'Échangez des biens et services avec d\'autres membres',
    'lificosm.marketplace.newListing': 'Nouvelle Annonce',
    'lificosm.marketplace.exchange': 'Échange',
    'lificosm.marketplace.forSale': 'À Vendre',
    'lificosm.marketplace.contact': 'Contacter le Vendeur',
    
    // Metrics
    'metric.users': 'Utilisateurs',
    'metric.credit': 'Augmentation Moyenne du Crédit',
    'metric.capital': 'Capital Total Accessible',
    'metric.locations': 'Emplacements Actifs',
    'metric.visitors': 'Visiteurs Mensuels',
    'metric.businesses': 'Entreprises Locales Soutenues',
    'metric.premium': 'Utilisateurs Premium',
    'metric.detection': 'Délai de Détection des Tendances',
    'metric.performance': 'Performance Moyenne du Portefeuille',
    'metric.investment': 'Investissement Communautaire',
    'metric.score': 'Augmentation Moyenne du Score de Crédit',
    'metric.jobs': 'Emplois Créés',
    'metric.workshops': 'Ateliers d\'Éducation Financière',
    
    // Language selector
    'language': 'Langue',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
  },
  zh: {
    // Language names
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.ht': 'Kreyòl Ayisyen',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
    
    // Common
    'app.name': 'LKHN 环球财富',
    'app.tagline': '量子生态系统',
    'app.overview': '一个全面的生态系统，整合数字金融、实体空间和人工智能驱动的洞察，创造普遍的繁荣机会。',
    'app.explore': '探索量子整合',
    
    // Footer
    'footer.copyright': '版权所有',
    'footer.legal': '法律信息',
    'footer.privacy': '隐私政策',
    'footer.terms': '条款和条件',
    'footer.cookies': 'Cookies',
    'footer.contact': '联系我们',
    'footer.email': 'info@lkhn.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.consultation': '预约咨询',
    'footer.back_to_top': '返回顶部',
    
    // Navigation
    'nav.overview': '概览',
    'nav.wealth': '财富',
    'nav.hub': '中心',
    'nav.trendcrypto': '趋势加密',
    'nav.lificosm': 'Lificosm',
    
    // Dashboard
    'dashboard.components': '生态系统组件',
    'dashboard.pillars': '三大支柱',
    'dashboard.impact': '社区影响',
    'dashboard.universal': '环球财富影响',
    'dashboard.impact.desc': '为服务欠缺的社区创造可持续繁荣',
    
    // Platforms
    'wealth.name': 'LKHN 财富',
    'wealth.description': '金融普惠平台，配备人工智能助手和四期付款信用建设',
    'hub.name': 'LKHN 中心',
    'hub.description': '为社区、创造和金融教育提供的实体空间',
    'trendcrypto.name': 'LKHN 趋势加密',
    'trendcrypto.description': '由人工智能驱动的加密分析，专注于XRP和新兴币种',

    // Lificosm Events
    'lificosm.events.title': '社区活动',
    'lificosm.events.subtitle': 'LKHN会员专属聚会',
    'lificosm.events.all': '所有类别',
    'lificosm.events.education': '教育',
    'lificosm.events.culture': '文化',
    'lificosm.events.community': '社区',
    'lificosm.events.attending': '参与者',
    'lificosm.events.registered': '已注册',
    'lificosm.events.rsvp': '预约',
    
    // Lificosm Marketplace
    'lificosm.marketplace.title': '社区市场',
    'lificosm.marketplace.subtitle': '与其他会员交换商品和服务',
    'lificosm.marketplace.newListing': '新上架',
    'lificosm.marketplace.exchange': '交换',
    'lificosm.marketplace.forSale': '待售',
    'lificosm.marketplace.contact': '联系卖家',
    
    // Metrics
    'metric.users': '用户',
    'metric.credit': '平均信用增长',
    'metric.capital': '总可获取资金',
    'metric.locations': '活跃地点',
    'metric.visitors': '每月访客',
    'metric.businesses': '支持的本地企业',
    'metric.premium': '高级用户',
    'metric.detection': '趋势检测提前时间',
    'metric.performance': '平均投资组合表现',
    'metric.investment': '社区投资',
    'metric.score': '平均信用评分增长',
    'metric.jobs': '创造就业机会',
    'metric.workshops': '金融知识讲座',
    
    // Language selector
    'language': '语言',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
  },
  ja: {
    // Language names
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.ht': 'Kreyòl Ayisyen',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
    
    // Common
    'app.name': 'LKHN ユニバーサルウェルス',
    'app.tagline': '量子エコシステム',
    'app.overview': 'デジタル金融、物理的空間、AIによる洞察を統合し、すべての人に繁栄へのアクセスを創出する包括的なエコシステム。',
    'app.explore': '量子統合を探索する',
    
    // Footer
    'footer.copyright': '無断複製禁止',
    'footer.legal': '法的情報',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',
    'footer.cookies': 'Cookie',
    'footer.contact': 'お問い合わせ',
    'footer.email': 'info@lkhn.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.consultation': '相談予約',
    'footer.back_to_top': 'トップに戻る',
    
    // Navigation
    'nav.overview': '概要',
    'nav.wealth': 'ウェルス',
    'nav.hub': 'ハブ',
    'nav.trendcrypto': 'トレンドクリプト',
    'nav.lificosm': 'ライフィコズム',
    
    // Dashboard
    'dashboard.components': 'エコシステム構成要素',
    'dashboard.pillars': '三本柱',
    'dashboard.impact': 'コミュニティへの影響',
    'dashboard.universal': 'ユニバーサルウェルスの影響',
    'dashboard.impact.desc': '十分なサービスを受けていないコミュニティ全体で持続可能な繁栄を創出',
    
    // Platforms
    'wealth.name': 'LKHNによるウェルス',
    'wealth.description': 'AIアシスタントと4回払いクレジット構築機能を備えた金融包摂プラットフォーム',
    'hub.name': 'LKHNハブ',
    'hub.description': 'コミュニティ、創造、金融教育のための物理的空間',
    'trendcrypto.name': 'LKHN トレンドクリプト',
    'trendcrypto.description': 'XRPと新興コインに焦点を当てたAIパワー暗号分析',

    // Lificosm Events
    'lificosm.events.title': 'コミュニティイベント',
    'lificosm.events.subtitle': 'LKHNメンバー限定の集まり',
    'lificosm.events.all': 'すべてのカテゴリー',
    'lificosm.events.education': '教育',
    'lificosm.events.culture': '文化',
    'lificosm.events.community': 'コミュニティ',
    'lificosm.events.attending': '参加者',
    'lificosm.events.registered': '登録済み',
    'lificosm.events.rsvp': '予約する',
    
    // Lificosm Marketplace
    'lificosm.marketplace.title': 'コミュニティマーケット',
    'lificosm.marketplace.subtitle': '他のメンバーと商品やサービスを交換する',
    'lificosm.marketplace.newListing': '新規出品',
    'lificosm.marketplace.exchange': '交換',
    'lificosm.marketplace.forSale': '販売中',
    'lificosm.marketplace.contact': '出品者に連絡',
    
    // Metrics
    'metric.users': 'ユーザー',
    'metric.credit': '平均クレジット増加',
    'metric.capital': '総アクセス資本',
    'metric.locations': 'アクティブな拠点',
    'metric.visitors': '月間訪問者',
    'metric.businesses': '支援された地元企業',
    'metric.premium': 'プレミアムユーザー',
    'metric.detection': 'トレンド検出リードタイム',
    'metric.performance': '平均ポートフォリオパフォーマンス',
    'metric.investment': 'コミュニティ投資',
    'metric.score': '平均クレジットスコア増加',
    'metric.jobs': '創出された雇用',
    'metric.workshops': '金融リテラシーワークショップ',
    
    // Language selector
    'language': '言語',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
  },
  ru: {
    // Language names
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.ht': 'Kreyòl Ayisyen',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
    
    // Common
    'app.name': 'LKHN УНИВЕРСАЛЬНОЕ БОГАТСТВО',
    'app.tagline': 'КВАНТОВАЯ ЭКОСИСТЕМА',
    'app.overview': 'Комплексная экосистема, интегрирующая цифровые финансы, физические пространства и аналитику на базе ИИ для создания всеобщего доступа к процветанию.',
    'app.explore': 'ИССЛЕДОВАТЬ КВАНТОВУЮ ИНТЕГРАЦИЮ',
    
    // Footer
    'footer.copyright': 'Все права защищены',
    'footer.legal': 'Правовая информация',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
    'footer.cookies': 'Cookies',
    'footer.contact': 'Контакты',
    'footer.email': 'info@lkhn.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.consultation': 'Записаться на консультацию',
    'footer.back_to_top': 'Наверх',
    
    // Navigation
    'nav.overview': 'Обзор',
    'nav.wealth': 'Богатство',
    'nav.hub': 'Хаб',
    'nav.trendcrypto': 'ТрендКрипто',
    'nav.lificosm': 'Лификосм',
    
    // Dashboard
    'dashboard.components': 'КОМПОНЕНТЫ ЭКОСИСТЕМЫ',
    'dashboard.pillars': 'ТРИ СТОЛПА',
    'dashboard.impact': 'ВЛИЯНИЕ НА СООБЩЕСТВО',
    'dashboard.universal': 'ВЛИЯНИЕ УНИВЕРСАЛЬНОГО БОГАТСТВА',
    'dashboard.impact.desc': 'Создание устойчивого процветания в недостаточно обслуживаемых сообществах',
    
    // Platforms
    'wealth.name': 'БОГАТСТВО ОТ LKHN',
    'wealth.description': 'Платформа финансовой инклюзивности с ИИ-ассистентом и построением кредитного рейтинга через оплату в 4 этапа',
    'hub.name': 'LKHN ХАБ',
    'hub.description': 'Физические пространства для сообщества, творчества и финансового образования',
    'trendcrypto.name': 'LKHN ТРЕНДКРИПТО',
    'trendcrypto.description': 'Криптоанализ на базе ИИ с фокусом на XRP и новые монеты',

    // Lificosm Events
    'lificosm.events.title': 'Мероприятия Сообщества',
    'lificosm.events.subtitle': 'Эксклюзивные встречи для членов LKHN',
    'lificosm.events.all': 'Все Категории',
    'lificosm.events.education': 'Образование',
    'lificosm.events.culture': 'Культура',
    'lificosm.events.community': 'Сообщество',
    'lificosm.events.attending': 'участников',
    'lificosm.events.registered': 'Зарегистрирован',
    'lificosm.events.rsvp': 'РЕГИСТРАЦИЯ',
    
    // Lificosm Marketplace
    'lificosm.marketplace.title': 'Маркетплейс Сообщества',
    'lificosm.marketplace.subtitle': 'Обменивайтесь товарами и услугами с другими участниками',
    'lificosm.marketplace.newListing': 'Новое Объявление',
    'lificosm.marketplace.exchange': 'Обмен',
    'lificosm.marketplace.forSale': 'Продажа',
    'lificosm.marketplace.contact': 'Связаться с Продавцом',
    
    // Metrics
    'metric.users': 'Пользователи',
    'metric.credit': 'Средний рост кредита',
    'metric.capital': 'Общий доступный капитал',
    'metric.locations': 'Активные локации',
    'metric.visitors': 'Ежемесячные посетители',
    'metric.businesses': 'Поддержанные местные бизнесы',
    'metric.premium': 'Премиум пользователи',
    'metric.detection': 'Время опережения обнаружения тренда',
    'metric.performance': 'Средняя эффективность портфеля',
    'metric.investment': 'Инвестиции в сообщество',
    'metric.score': 'Средний рост кредитного рейтинга',
    'metric.jobs': 'Созданные рабочие места',
    'metric.workshops': 'Мастер-классы по финансовой грамотности',
    
    // Language selector
    'language': 'Язык',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
  },
  xh: {
    // Language names
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.ht': 'Kreyòl Ayisyen',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
    
    // Common
    'app.name': 'LKHN UBUTYEBI JIKELELE',
    'app.tagline': 'INKQUBO YEQUANTUM',
    'app.overview': 'Inkqubo epheleleyo ehlanganisa iimali ezidijithali, iindawo zesiqhelo kunye nezinto ezikhokhelwe yi-AI ukudala ukufikelela jikelele kuphuhliso.',
    'app.explore': 'HLOLA UMASILINGANE WEQUANTUM',
    
    // Footer
    'footer.copyright': 'Onke amalungelo agciniwe',
    'footer.legal': 'Esemthethweni',
    'footer.privacy': 'Umgaqo-nkqubo Wabucala',
    'footer.terms': 'Imiqathango',
    'footer.cookies': 'Cookies',
    'footer.contact': 'Qhagamshelana',
    'footer.email': 'info@lkhn.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.consultation': 'Buka iNgcebiso',
    'footer.back_to_top': 'Buyela phezulu',
    
    // Navigation
    'nav.overview': 'Inkcazelo',
    'nav.wealth': 'Ubutyebi',
    'nav.hub': 'Iziko',
    'nav.trendcrypto': 'Crypto Ehambayo',
    'nav.lificosm': 'Lificosm',
    
    // Dashboard
    'dashboard.components': 'IZINTO ZENKQUBO',
    'dashboard.pillars': 'IINTSIKA EZINTATHU',
    'dashboard.impact': 'IMPEMBELELO YOLUNTU',
    'dashboard.universal': 'IMPEMBELELO YOBUTYEBI JIKELELE',
    'dashboard.impact.desc': 'Ukudala inkqubela eyondeleyo kubulungisa kulo nto linganjelwe ngokupheleleyo',
    
    // Platforms
    'wealth.name': 'UBUTYEBI NGE-LKHN',
    'wealth.description': 'Iplatifomu yokubandakanywa kwezemali kunye noncedo lwe-AI kunye nokwakha isikolo semali sika-4',
    'hub.name': 'IZIKO LE-LKHN',
    'hub.description': 'Iindawo ezibonakalayo zoluntu, ukuyila kunye nemfundo yezemali',
    'trendcrypto.name': 'LKHN CRYPTO EHAMBAYO',
    'trendcrypto.description': 'Uhlalutyo lwe-crypto olukhokhelwe yi-AI olugxininisa ku-XRP kunye neekhoyini eziphuhlikayo',

    // Lificosm Events
    'lificosm.events.title': 'Iziganeko zoLuntu',
    'lificosm.events.subtitle': 'Iintlanganiso ezikhethekileyo zamalungu e-LKHN',
    'lificosm.events.all': 'Zonke iiKhathegori',
    'lificosm.events.education': 'IMfundo',
    'lificosm.events.culture': 'INkcubeko',
    'lificosm.events.community': 'ULuntu',
    'lificosm.events.attending': 'abazimasi',
    'lificosm.events.registered': 'Ubhalisile',
    'lificosm.events.rsvp': 'BHALA',
    
    // Lificosm Marketplace
    'lificosm.marketplace.title': 'IMarike yoLuntu',
    'lificosm.marketplace.subtitle': 'Tshintshiselana ngeempahla neenkonzo namanye amalungu',
    'lificosm.marketplace.newListing': 'Ukubhengeza Okutsha',
    'lificosm.marketplace.exchange': 'Ukutshintshisana',
    'lificosm.marketplace.forSale': 'Ethengiswa',
    'lificosm.marketplace.contact': 'Qhagamshelana noMthengisi',
    
    // Metrics
    'metric.users': 'Abasebenzisi',
    'metric.credit': 'Ukunyuka kwesibonda esizizulu',
    'metric.capital': 'Inkunzi ifikelela kuyo',
    'metric.locations': 'Iindawo ezisetyenziswayo',
    'metric.visitors': 'Abatyeleli benyanga',
    'metric.businesses': 'Amashishini Endawo Axhasiweyo',
    'metric.premium': 'Abasebenzisi be-Premium',
    'metric.detection': 'Ixesha lokukhokela uhlolo lwetrendi',
    'metric.performance': 'Umsebenzi wesiqingatha esiyavureji',
    'metric.investment': 'Utyalo-mali loLuntu',
    'metric.score': 'Ukunyuka kwesikali sesikali seemali',
    'metric.jobs': 'Imisebenzi Eyakhiweyo',
    'metric.workshops': 'Iiworkshops zemfundo yezeeMali',
    
    // Language selector
    'language': 'Ulwimi',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
  },
  ht: {
    // Language names
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.ht': 'Kreyòl Ayisyen',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
    
    // Common
    'app.name': 'LKHN RICHÈS INIVÈSÈL',
    'app.tagline': 'EKOSISTÈM KWANTIK',
    'app.overview': 'Yon ekosistèm konplè ki entegre finans dijital, espas fizik ak pèspektiv AI pou kreye aksè inivèsèl nan pwosperite.',
    'app.explore': 'EKSPLORE ENTEGRASYON KWANTIK',
    
    // Footer
    'footer.copyright': 'Tout dwa rezève',
    'footer.legal': 'Legal',
    'footer.privacy': 'Règleman sou Konfidansyalite',
    'footer.terms': 'Tèm ak Kondisyon',
    'footer.cookies': 'Cookies',
    'footer.contact': 'Kontakte',
    'footer.email': 'info@lkhn.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.consultation': 'Rezève yon Konsiltasyon',
    'footer.back_to_top': 'Retounen an wo',
    
    // Navigation
    'nav.overview': 'Apèsi',
    'nav.wealth': 'Richès',
    'nav.hub': 'Sant',
    'nav.trendcrypto': 'TrendCrypto',
    'nav.lificosm': 'Lificosm',
    'nav.forum': 'Fowòm',
    'nav.profile': 'Pwofil',
    
    // Dashboard
    'dashboard.components': 'KONPOZAN EKOSISTÈM',
    'dashboard.pillars': 'TWAZAN PILYE',
    'dashboard.impact': 'ENPAK KOMINOTE',
    'dashboard.universal': 'ENPAK RICHÈS INIVÈSÈL',
    'dashboard.impact.desc': 'Kreye pwosperite dirab nan kominote ki pa gen ase sèvis yo',
    
    // Platforms
    'wealth.name': 'RICHÈS PA LKHN',
    'wealth.description': 'Platfòm enklizyon finansye ak asistan AI ak konstriksyon kredi an 4 peman',
    'hub.name': 'SANT LKHN',
    'hub.description': 'Espas fizik pou kominote, kreyasyon ak edikasyon finansye',
    'trendcrypto.name': 'LKHN TRENDCRYPTO',
    'trendcrypto.description': 'Analiz crypto alimante AI ki konsantre sou XRP ak lajan kap monte',
    
    // Language selector
    'language': 'Lang',
  },
  ar: {
    // Language names
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.ht': 'Kreyòl Ayisyen',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
    
    // Common
    'app.name': 'الثروة العالمية LKHN',
    'app.tagline': 'نظام بيئي كمومي',
    'app.overview': 'نظام بيئي شامل يدمج التمويل الرقمي والمساحات المادية والرؤى المدعومة بالذكاء الاصطناعي لإنشاء وصول عالمي للازدهار.',
    'app.explore': 'استكشاف التكامل الكمومي',
    
    // Footer
    'footer.copyright': 'جميع الحقوق محفوظة',
    'footer.legal': 'قانوني',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'الشروط والأحكام',
    'footer.cookies': 'ملفات تعريف الارتباط',
    'footer.contact': 'اتصل بنا',
    'footer.email': 'info@lkhn.com',
    'footer.phone': '+1 (555) 123-4567',
    'footer.consultation': 'حجز استشارة',
    'footer.back_to_top': 'العودة إلى الأعلى',
    
    // Navigation
    'nav.overview': 'نظرة عامة',
    'nav.wealth': 'الثروة',
    'nav.hub': 'المركز',
    'nav.trendcrypto': 'اتجاه العملات المشفرة',
    'nav.lificosm': 'ليفيكوسم',
    
    // Dashboard
    'dashboard.components': 'مكونات النظام البيئي',
    'dashboard.pillars': 'الركائز الثلاث',
    'dashboard.impact': 'تأثير المجتمع',
    'dashboard.universal': 'تأثير الثروة العالمية',
    'dashboard.impact.desc': 'خلق ازدهار مستدام عبر المجتمعات التي تعاني من نقص الخدمات',
    
    // Platforms
    'wealth.name': 'الثروة من LKHN',
    'wealth.description': 'منصة شمول مالي مع مساعد ذكاء اصطناعي وبناء ائتمان بتقسيط على 4 مراحل',
    'hub.name': 'مركز LKHN',
    'hub.description': 'مساحات مادية للمجتمع والإبداع والتعليم المالي',
    'trendcrypto.name': 'اتجاه العملات المشفرة LKHN',
    'trendcrypto.description': 'تحليل للعملات المشفرة مدعوم بالذكاء الاصطناعي مع التركيز على XRP والعملات الناشئة',

    // Lificosm Events
    'lificosm.events.title': 'فعاليات المجتمع',
    'lificosm.events.subtitle': 'لقاءات حصرية لأعضاء LKHN',
    'lificosm.events.all': 'جميع الفئات',
    'lificosm.events.education': 'التعليم',
    'lificosm.events.culture': 'الثقافة',
    'lificosm.events.community': 'المجتمع',
    'lificosm.events.attending': 'الحضور',
    'lificosm.events.registered': 'مسجل',
    'lificosm.events.rsvp': 'تأكيد الحضور',
    
    // Lificosm Marketplace
    'lificosm.marketplace.title': 'سوق المجتمع',
    'lificosm.marketplace.subtitle': 'تبادل السلع والخدمات مع الأعضاء الآخرين',
    'lificosm.marketplace.newListing': 'إعلان جديد',
    'lificosm.marketplace.exchange': 'تبادل',
    'lificosm.marketplace.forSale': 'للبيع',
    'lificosm.marketplace.contact': 'التواصل مع البائع',
    
    // Metrics
    'metric.users': 'المستخدمون',
    'metric.credit': 'متوسط زيادة الائتمان',
    'metric.capital': 'إجمالي رأس المال الذي تم الوصول إليه',
    'metric.locations': 'المواقع النشطة',
    'metric.visitors': 'الزوار الشهريون',
    'metric.businesses': 'الشركات المحلية المدعومة',
    'metric.premium': 'المستخدمون المميزون',
    'metric.detection': 'وقت اكتشاف الاتجاهات',
    'metric.performance': 'متوسط أداء المحفظة',
    'metric.investment': 'استثمار المجتمع',
    'metric.score': 'متوسط زيادة درجة الائتمان',
    'metric.jobs': 'الوظائف التي تم إنشاؤها',
    'metric.workshops': 'ورش عمل محو الأمية المالية',
    
    // Language selector
    'language': 'اللغة',
    'language.en': 'English',
    'language.es': 'Español',
    'language.fr': 'Français',
    'language.zh': '中文',
    'language.ja': '日本語',
    'language.ru': 'Русский',
    'language.xh': 'isiXhosa',
    'language.ar': 'العربية',
  },
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  
  // Get translation for a key
  const t = (key: string): string => {
    const translation = translations[language][key];
    return translation || key; // Return the key itself as fallback
  };

  // Set language and store in localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lkhn-language', lang);
  };

  // Load language preference from localStorage on component mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem('lkhn-language') as Language;
    if (storedLanguage && Object.keys(translations).includes(storedLanguage)) {
      setLanguageState(storedLanguage);
      
      // Set RTL attribute for Arabic language
      if (storedLanguage === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }
    }
  }, []);
  
  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use translations
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
