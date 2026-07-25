import React, { useState, useMemo, useRef, useEffect } from 'react';
import Stepper, { Step } from './Stepper';

// --- TYPES & INTERFACES ---
export interface BusinessDetails {
  platformType: 'website' | 'app' | 'both';
  name: string;
  url: string;
  appName: string;
  companyName: string;
  companyAddress: string;
  contactEmail: string;
  effectiveDate: string;
  businessCountry: string;
  businessState: string;
}

export interface LawOption {
  id: string;
  name: string;
  region: string;
  description: string;
  autoSelectedCountries?: string[];
}

export interface TechService {
  id: string;
  name: string;
  category: 'analytics' | 'payment' | 'marketing' | 'auth' | 'support' | 'ads';
  privacyUrl: string;
  cookiesUsed: string[];
  clauseText: string;
  plainSummary: string;
}

export interface DataCollectedOptions {
  personalInfo: boolean;
  financialInfo: boolean;
  deviceTechData: boolean;
  locationData: boolean;
  childrenData: boolean;
  biometricData: boolean;
}

export interface DataPurposesOptions {
  serviceFulfillment: boolean;
  marketingEmails: boolean;
  personalizationAds: boolean;
  analyticsImprovement: boolean;
  securityFraud: boolean;
  sellShareData: boolean;
}

export interface PrivacyPolicyConfig {
  version: string;
  business: BusinessDetails;
  selectedLaws: string[];
  dataCollected: DataCollectedOptions;
  dataPurposes: DataPurposesOptions;
  selectedServices: string[];
  dataRetentionMonths: string;
  dpoEmail: string;
}

// --- TYPEWRITER COMPONENT (Claude-Style Newsreader Serif with Glowing Emerald Beam Cursor) ---
function TypewriterHeading({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    indexRef.current = 0;

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <h3
      className="text-3xl sm:text-5xl text-stone-50 mb-6 tracking-tight leading-[1.18] select-none flex items-center flex-wrap"
      style={{ fontFamily: "'Newsreader', 'Georgia', 'Cambria', serif", fontStyle: 'italic', fontWeight: 400 }}
    >
      <span>{displayedText}</span>
      {isTyping && (
        <span className="inline-block w-[3px] h-[0.85em] bg-emerald-400 rounded-full ml-2 shadow-[0_0_14px_rgba(52,211,153,0.95)] animate-pulse shrink-0" />
      )}
    </h3>
  );
}

// --- CUSTOM DROPDOWN COMPONENT ---
interface CustomDropdownOption {
  value: string;
  label: string;
}

function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select option...'
}: {
  value: string;
  onChange: (val: string) => void;
  options: CustomDropdownOption[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 flex items-center justify-between transition-all hover:border-slate-700 focus:outline-none focus:border-slate-600 interactive-press"
      >
        <span className="truncate font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-stone-50' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-y-auto max-h-60 p-2 space-y-1">
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-slate-800 text-stone-50 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- CURATED TECH SERVICES LIBRARY ---
const TECH_SERVICES_LIBRARY: TechService[] = [
  {
    id: 'stripe',
    name: 'Stripe Payments',
    category: 'payment',
    privacyUrl: 'https://stripe.com/privacy',
    cookiesUsed: ['__stripe_mid', '__stripe_sid'],
    clauseText: 'Payment processing is handled by Stripe. Credit card and financial transaction details are processed securely by Stripe under PCI-DSS Level 1 certification. We do not store credit card numbers on our servers.',
    plainSummary: 'Processes payment transactions securely without storing credit card numbers.'
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    category: 'analytics',
    privacyUrl: 'https://policies.google.com/privacy',
    cookiesUsed: ['_ga', '_ga_*'],
    clauseText: 'We use Google Analytics 4 to measure aggregated website traffic and user engagement metrics. Google processes anonymized IP addresses and device interaction data.',
    plainSummary: 'Measures site traffic and page views anonymously.'
  },
  {
    id: 'posthog',
    name: 'PostHog Telemetry',
    category: 'analytics',
    privacyUrl: 'https://posthog.com/privacy',
    cookiesUsed: ['ph_*'],
    clauseText: 'We use PostHog for product telemetry, event tracking, and user flow analysis to troubleshoot errors and optimize app performance.',
    plainSummary: 'Analyzes feature usage to fix bugs and improve performance.'
  },
  {
    id: 'clerk',
    name: 'Clerk Authentication',
    category: 'auth',
    privacyUrl: 'https://clerk.com/privacy',
    cookiesUsed: ['__clerk_db_jwt', '__session'],
    clauseText: 'User authentication and session security are provided by Clerk. Clerk handles user profile tokens, multi-factor authentication, and OAuth logins.',
    plainSummary: 'Handles user logins, passwords, and account security.'
  },
  {
    id: 'supabase',
    name: 'Supabase Database',
    category: 'auth',
    privacyUrl: 'https://supabase.com/privacy',
    cookiesUsed: ['sb-*'],
    clauseText: 'Database infrastructure and authentication services are hosted on Supabase encrypted database clusters.',
    plainSummary: 'Hosts user account database securely with encryption.'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp Newsletter',
    category: 'marketing',
    privacyUrl: 'https://mailchimp.com/legal/privacy/',
    cookiesUsed: ['AVS_*'],
    clauseText: 'We manage email marketing lists using Mailchimp. Subscribers may opt out at any time using the unsubscribe link included in every newsletter.',
    plainSummary: 'Manages newsletter subscribers with one-click unsubscribe.'
  },
  {
    id: 'intercom',
    name: 'Intercom Live Chat',
    category: 'support',
    privacyUrl: 'https://www.intercom.com/legal/privacy',
    cookiesUsed: ['intercom-session-*'],
    clauseText: 'We provide real-time support via Intercom. Chat logs and email queries are retained to fulfill customer service requests.',
    plainSummary: 'Powers customer support and live chat widgets.'
  },
  {
    id: 'meta_pixel',
    name: 'Meta / Facebook Pixel',
    category: 'ads',
    privacyUrl: 'https://www.facebook.com/privacy/policy/',
    cookiesUsed: ['_fbp', '_fbc'],
    clauseText: 'We utilize Meta Pixel to measure social media advertisement conversions and display relevant ads on Facebook and Instagram.',
    plainSummary: 'Measures ad conversions on Facebook and Instagram.'
  }
];

const COUNTRY_OPTIONS: CustomDropdownOption[] = [
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'EU', label: 'European Union (Member State)' },
  { value: 'CA', label: 'Canada' },
  { value: 'BR', label: 'Brazil' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'AU', label: 'Australia' },
  { value: 'IN', label: 'India' },
  { value: 'OTHER', label: 'Other Country' }
];

export function PrivacyPolicyGenerator() {
  const [viewState, setViewState] = useState<'landing' | 'wizard' | 'preview'>('landing');
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [subQuestionIndex, setSubQuestionIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'legal' | 'plain'>('legal');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Focus container ref for scroll locking viewport focus
  const questionBoxRef = useRef<HTMLDivElement>(null);

  // Business state
  const [business, setBusiness] = useState<BusinessDetails>({
    platformType: 'website',
    name: '',
    url: '',
    appName: '',
    companyName: '',
    companyAddress: '123 Tech Avenue, Suite 100, San Francisco, CA 94105, USA',
    contactEmail: '',
    effectiveDate: '2026-07-25',
    businessCountry: 'US',
    businessState: 'California'
  });

  // Selected laws
  const [selectedLaws, setSelectedLaws] = useState<string[]>(['gdpr', 'ccpa']);

  // Data collected
  const [dataCollected, setDataCollected] = useState<DataCollectedOptions>({
    personalInfo: true,
    financialInfo: false,
    deviceTechData: true,
    locationData: false,
    childrenData: false,
    biometricData: false
  });

  // Data purposes
  const [dataPurposes, setDataPurposes] = useState<DataPurposesOptions>({
    serviceFulfillment: true,
    marketingEmails: true,
    personalizationAds: false,
    analyticsImprovement: true,
    securityFraud: true,
    sellShareData: false
  });

  // Selected services
  const [selectedServices, setSelectedServices] = useState<string[]>(['ga4', 'stripe']);

  // Additional details
  const [dataRetentionMonths, setDataRetentionMonths] = useState<string>('24');
  const [dpoEmail, setDpoEmail] = useState<string>('privacy@example.com');
  const [customPolicyText, setCustomPolicyText] = useState<string>('');

  useEffect(() => {
    setBusiness(prev => ({
      ...prev,
      effectiveDate: new Date().toISOString().split('T')[0]
    }));
  }, []);

  // Smooth scroll focus to center active question box in viewport when question changes
  useEffect(() => {
    if (viewState === 'wizard' && questionBoxRef.current) {
      questionBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [wizardStep, subQuestionIndex, viewState]);

  const triggerToast = (msg: string) => {
    setCopyFeedback(msg);
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  const copyToClipboard = (text: string, successMsg: string) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => triggerToast(successMsg))
        .catch(() => fallbackCopyTextToClipboard(text, successMsg));
    } else {
      fallbackCopyTextToClipboard(text, successMsg);
    }
  };

  const fallbackCopyTextToClipboard = (text: string, successMsg: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      triggerToast(successMsg);
    } catch (err) {
      alert('Copy failed. Please copy text manually.');
    }
    document.body.removeChild(textArea);
  };

  const handleCountryChange = (country: string) => {
    let lawsToAdd = [...selectedLaws];
    if (country === 'US' && !lawsToAdd.includes('ccpa')) lawsToAdd.push('ccpa', 'us_states');
    if (['UK', 'GB'].includes(country) && !lawsToAdd.includes('uk_gdpr')) lawsToAdd.push('uk_gdpr');
    if (['DE', 'FR', 'NL', 'ES', 'IT', 'EU'].includes(country) && !lawsToAdd.includes('gdpr')) lawsToAdd.push('gdpr');
    if (country === 'CA' && !lawsToAdd.includes('pipeda')) lawsToAdd.push('pipeda');
    if (country === 'BR' && !lawsToAdd.includes('lgpd')) lawsToAdd.push('lgpd');
    if (country === 'ZA' && !lawsToAdd.includes('popia')) lawsToAdd.push('popia');
    if (country === 'AU' && !lawsToAdd.includes('aus_privacy')) lawsToAdd.push('aus_privacy');
    if (country === 'IN' && !lawsToAdd.includes('dpdp_india')) lawsToAdd.push('dpdp_india');

    setBusiness({ ...business, businessCountry: country });
    setSelectedLaws(lawsToAdd);
  };

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const generatedPolicy = useMemo(() => {
    const isLegal = viewMode === 'legal';
    const siteOrApp = business.platformType === 'website' ? 'website' : business.platformType === 'app' ? 'application' : 'website and mobile application';
    const siteUrlStr = business.url || 'https://example.com';
    const entityStr = business.companyName || business.name || 'Company';

    let md = '';

    if (isLegal) {
      md += `# Privacy Policy\n\n`;
      md += `**Effective Date:** ${business.effectiveDate}\n`;
      md += `**Last Updated:** ${business.effectiveDate}\n\n`;

      md += `## 1. Overview & General Information\n`;
      md += `This Privacy Policy governs the manner in which **${entityStr}** ("we", "us", or "our") collects, uses, maintains, and discloses information collected from users ("you" or "User") of the **${siteOrApp}** located at [${siteUrlStr}](${siteUrlStr}).\n\n`;
      md += `We are committed to maintaining the highest standards of data privacy and transparency. By accessing or using our ${siteOrApp}, you agree to the collection and use of information in accordance with this policy.\n\n`;

      md += `## 2. Information We Collect\n`;
      md += `We collect several types of information from and about users of our ${siteOrApp}, including:\n\n`;

      if (dataCollected.personalInfo) {
        md += `- **Personal Identification Information:** Full name, email address, mailing address, telephone number, and user profile data.\n`;
      }
      if (dataCollected.financialInfo) {
        md += `- **Payment & Billing Data:** Credit/debit card numbers, billing addresses, and transaction history processed via PCI-DSS compliant payment gateways.\n`;
      }
      if (dataCollected.deviceTechData) {
        md += `- **Technical & Telemetry Data:** Internet Protocol (IP) address, browser type, operating system version, time zone, and session interaction metrics.\n`;
      }
      if (dataCollected.locationData) {
        md += `- **Geolocation Data:** Geographic location derived from IP address or mobile device permissions.\n`;
      }
      if (dataCollected.biometricData) {
        md += `- **Biometric Identifiers:** Facial recognition or fingerprint local tokens used solely for local device authentication.\n`;
      }
      if (dataCollected.childrenData) {
        md += `- **Children's Information:** Verified parental consent is obtained prior to collecting data from individuals under 13/16 years of age.\n`;
      }
      md += `\n`;

      md += `## 3. How We Use Collected Information\n`;
      md += `We utilize your information for legitimate operational purposes including:\n\n`;
      if (dataPurposes.serviceFulfillment) md += `- Fulfilling order purchases, account creation, and delivering requested platform services.\n`;
      if (dataPurposes.marketingEmails) md += `- Sending periodic promotional updates, product announcements, and newsletters (with one-click opt-out capability).\n`;
      if (dataPurposes.analyticsImprovement) md += `- Analyzing visitor behavior, fixing user experience bottlenecks, and improving performance.\n`;
      if (dataPurposes.securityFraud) md += `- Protecting systems against unauthorized access, malicious attacks, and financial fraud.\n`;
      if (dataPurposes.personalizationAds) md += `- Serving tailored content and advertising recommendations.\n`;
      if (dataPurposes.sellShareData) md += `- Sharing cross-context behavioral marketing data with advertising network partners.\n`;
      md += `\n`;

      md += `## 4. Third-Party Services & Data Disclosures\n`;
      md += `We do not sell your personal data. However, we share necessary data with trusted third-party service providers to power platform features. Below is a disclosure of services integrated into our ${siteOrApp}:\n\n`;

      if (selectedServices.length > 0) {
        selectedServices.forEach(sId => {
          const service = TECH_SERVICES_LIBRARY.find(s => s.id === sId);
          if (service) {
            md += `### ${service.name}\n`;
            md += `${service.clauseText}\n`;
            md += `*Privacy Policy:* [Read ${service.name} Privacy Policy](${service.privacyUrl})\n\n`;
          }
        });
      } else {
        md += `No third-party tracking or payment services are currently enabled.\n\n`;
      }

      md += `## 5. Cookies & Tracking Technologies\n`;
      md += `Our ${siteOrApp} uses cookies, local storage, and web beacons to recognize your preferences and remember session states. You can configure your browser to decline all cookies or alert you when cookies are placed.\n\n`;

      md += `## 6. Specific Jurisdictional Privacy Rights\n\n`;

      if (selectedLaws.includes('gdpr') || selectedLaws.includes('uk_gdpr')) {
        md += `### European Union & UK General Data Protection Regulation (GDPR)\n`;
        md += `If you reside in the European Union or United Kingdom, you hold the following rights under GDPR:\n`;
        md += `- **Right of Access:** Obtain confirmation of data processing and request a copy of personal data.\n`;
        md += `- **Right to Rectification:** Request correction of inaccurate or incomplete personal records.\n`;
        md += `- **Right to Erasure ("Right to be Forgotten"):** Request deletion of your personal records.\n`;
        md += `- **Right to Restrict & Object:** Object to direct marketing or processing based on legitimate interests.\n`;
        md += `- **Right to Data Portability:** Receive your personal data in a structured, machine-readable format.\n`;
        md += `To exercise your GDPR rights, contact our Data Protection Officer at: **${dpoEmail}** or **${business.contactEmail || 'privacy@example.com'}**.\n\n`;
      }

      if (selectedLaws.includes('ccpa') || selectedLaws.includes('us_states')) {
        md += `### California Consumer Privacy Act (CCPA / CPRA) & US State Laws\n`;
        md += `California residents and US consumers possess specific rights under state privacy statutes:\n`;
        md += `- **Right to Know & Access:** Request disclosure of categories and specific pieces of personal information collected.\n`;
        md += `- **Right to Opt-Out:** Request that your personal information not be sold or shared for cross-context behavioral advertising.\n`;
        md += `- **Right to Non-Discrimination:** We will not discriminate against you for exercising your legal privacy rights.\n`;
        md += `To submit a California CCPA request or opt-out, email **${business.contactEmail || 'privacy@example.com'}** with the subject line "CCPA Data Request".\n\n`;
      }

      if (selectedLaws.includes('pipeda')) {
        md += `### Canadian Privacy Rights (PIPEDA)\n`;
        md += `Canadian residents may challenge our compliance with PIPEDA principles by filing an inquiry with our designated Privacy Officer at **${business.contactEmail || 'privacy@example.com'}**.\n\n`;
      }

      if (selectedLaws.includes('dpdp_india')) {
        md += `### India Digital Personal Data Protection Act (DPDP Act 2023)\n`;
        md += `Indian residents possess the right to seek summary of personal data processed, request correction and erasure, and register grievances with our Data Fiduciary at **${business.contactEmail || 'privacy@example.com'}**.\n\n`;
      }

      md += `## 7. Data Retention & Security Measures\n`;
      md += `We store personal data for up to **${dataRetentionMonths} months** or as long as necessary to satisfy accounting, legal, or administrative obligations. We enforce TLS encryption, firewalls, and restricted administrative access to safeguard data.\n\n`;

      md += `## 8. Contact Us\n`;
      md += `If you have questions, feedback, or data deletion requests regarding this policy, please reach out:\n\n`;
      md += `- **Entity:** ${entityStr}\n`;
      md += `- **Address:** ${business.companyAddress}\n`;
      md += `- **Contact Email:** [${business.contactEmail || 'privacy@example.com'}](mailto:${business.contactEmail || 'privacy@example.com'})\n`;

    } else {
      md += `# Privacy Policy — In Short\n\n`;
      md += `*This is a clear, human-readable summary of how **${entityStr}** treats your privacy on **${siteUrlStr}**.*\n\n`;

      md += `### 1. Our Privacy Promise\n`;
      md += `We believe in total transparency. We only ask for information we genuinely need to give you a great service.\n\n`;

      md += `### 2. What We Collect & Why\n`;
      if (dataCollected.personalInfo) md += `- **Contact Info:** We collect your name and email so we can communicate with you and manage your account.\n`;
      if (dataCollected.financialInfo) md += `- **Payments:** Credit card data goes directly to certified payment processors (like Stripe). We never see or store your full card number.\n`;
      if (dataCollected.deviceTechData) md += `- **Analytics & Tech:** We see basic info like browser type and page traffic to keep the site fast and bug-free.\n`;
      md += `\n`;

      md += `### 3. Third-Party Services\n`;
      if (selectedServices.length > 0) {
        selectedServices.forEach(sId => {
          const service = TECH_SERVICES_LIBRARY.find(s => s.id === sId);
          if (service) {
            md += `- **${service.name}:** ${service.plainSummary}\n`;
          }
        });
      } else {
        md += `- No external tracking or ad services are enabled.\n`;
      }
      md += `\n`;

      md += `### 4. You Are in Control\n`;
      md += `You own your personal data. You can ask us to see, update, or completely delete your information anytime by emailing **${business.contactEmail || 'privacy@example.com'}**.\n\n`;

      md += `### 5. Questions?\n`;
      md += `Email us at **${business.contactEmail || 'privacy@example.com'}** and we will respond promptly.\n`;
    }

    return md;
  }, [business, selectedLaws, dataCollected, dataPurposes, selectedServices, dataRetentionMonths, dpoEmail, viewMode]);

  const generatedHtml = useMemo(() => {
    const text = isEditable && customPolicyText ? customPolicyText : generatedPolicy;
    let html = text
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-stone-50 mb-4 font-sans tracking-tight">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-stone-50 mt-6 mb-3 font-sans tracking-tight">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-stone-200 mt-4 mb-2 font-sans">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-50">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-stone-50 underline decoration-slate-600 hover:decoration-stone-50 transition-colors">$1</a>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300 leading-relaxed">$1</li>')
      .replace(/\n\n/g, '<br/><br/>');
    return `<article class="privacy-policy-document text-sm leading-relaxed text-slate-300 font-sans">\n${html}\n</article>`;
  }, [generatedPolicy, isEditable, customPolicyText]);

  // Region Cards for Chapter 2
  const REGION_CARDS = [
    {
      id: 'eu_uk',
      title: 'European Union & United Kingdom',
      badge: 'GDPR & UK DPA 2018',
      desc: 'Mandatory if you have visitors or users in Europe or the UK. Grants strict access & erasure rights.',
      lawIds: ['gdpr', 'uk_gdpr']
    },
    {
      id: 'us_ccpa',
      title: 'United States & California',
      badge: 'CCPA / CPRA & US States',
      desc: 'Required if you serve US residents. Mandates "Do Not Sell/Share Personal Info" opt-out options.',
      lawIds: ['ccpa', 'us_states']
    },
    {
      id: 'ca_pipeda',
      title: 'Canada',
      badge: 'PIPEDA',
      desc: 'Governs private sector organization data handling across Canadian provinces.',
      lawIds: ['pipeda']
    },
    {
      id: 'global_rest',
      title: 'Global & Rest of World',
      badge: 'India DPDP, Australia APPs, Brazil LGPD',
      desc: 'Enforces compliance for Indian, Australian, and Latin American digital users.',
      lawIds: ['dpdp_india', 'aus_privacy', 'lgpd', 'popia']
    }
  ];

  // Data Categories for Chapter 3
  const DATA_CATEGORIES = [
    {
      key: 'personalInfo',
      title: 'Account Profiles & Contact Info',
      desc: 'Names, email addresses, phone numbers, profile credentials.'
    },
    {
      key: 'financialInfo',
      title: 'Payment & Checkout Transactions',
      desc: 'Credit card details processed via certified payment gateways.'
    },
    {
      key: 'deviceTechData',
      title: 'Browser Telemetry & Analytics',
      desc: 'IP addresses, device user-agent, cookies, usage logs.'
    },
    {
      key: 'locationData',
      title: 'Geolocation Positioning',
      desc: 'GPS position coordinates or IP location identification.'
    }
  ];

  // Micro-question step navigation handlers
  const handleChapter1Next = () => {
    if (subQuestionIndex < 4) {
      setSubQuestionIndex(subQuestionIndex + 1);
    } else {
      setWizardStep(2);
      setSubQuestionIndex(0);
    }
  };

  const handleChapter1Back = () => {
    if (subQuestionIndex > 0) {
      setSubQuestionIndex(subQuestionIndex - 1);
    }
  };

  const handleChapter5Next = () => {
    if (subQuestionIndex < 1) {
      setSubQuestionIndex(subQuestionIndex + 1);
    } else {
      setViewState('preview');
    }
  };

  const handleChapter5Back = () => {
    if (subQuestionIndex > 0) {
      setSubQuestionIndex(subQuestionIndex - 1);
    } else {
      setWizardStep(4);
    }
  };

  const handleCopyMarkdown = () => {
    const textToCopy = isEditable && customPolicyText ? customPolicyText : generatedPolicy;
    copyToClipboard(textToCopy, 'Copied Markdown to clipboard!');
  };

  const handleCopyHtml = () => {
    copyToClipboard(generatedHtml, 'Copied HTML to clipboard!');
  };

  const handleDownloadTxt = () => {
    const text = isEditable && customPolicyText ? customPolicyText : generatedPolicy;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `privacy-policy-${(business.name || 'company').toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast('Downloaded Privacy Policy (.md)');
  };

  return (
    <div id="generator-workspace" className="w-full max-w-3xl mx-auto font-sans" ref={questionBoxRef}>

      {copyFeedback && (
        <div className="fixed top-20 right-5 z-50 px-4 py-2.5 bg-slate-900 border border-slate-700 text-stone-50 text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          {copyFeedback}
        </div>
      )}

      {/* STATE 1: HIGH-CONVERTING SEO HERO OVERVIEW PAGE */}
      {viewState === 'landing' && (
        <div className="py-8 sm:py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-mono font-semibold text-emerald-400 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              GDPR &bull; CCPA &bull; PIPEDA &bull; DPDP Act Compliant
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-50 tracking-tight leading-tight mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Generate Your Privacy Policy in Seconds
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal mb-8">
              Create a custom, legally structured Privacy Policy for your website or app. 100% free, 100% in your browser with zero server data collection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setViewState('wizard');
                  setWizardStep(1);
                  setSubQuestionIndex(0);
                }}
                className="w-full sm:w-auto px-8 py-4 bg-stone-50 text-slate-950 text-sm font-extrabold rounded-2xl hover:bg-stone-200 transition-all shadow-xl hover:scale-[1.02] interactive-press"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Start Generating Policy →
              </button>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10 pt-8 border-t border-slate-900">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-xs mb-3">
                01
              </div>
              <h4 className="font-bold text-sm text-stone-50 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>100% Client-Side</h4>
              <p className="text-xs text-slate-400 leading-relaxed">No data ever touches any backend server. Your information stays 100% private in your browser.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-xs mb-3">
                02
              </div>
              <h4 className="font-bold text-sm text-stone-50 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Global Compliance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Pre-configured clauses for EU GDPR, California CCPA/CPRA, Canada PIPEDA, and India DPDP Act.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 font-bold text-xs mb-3">
                03
              </div>
              <h4 className="font-bold text-sm text-stone-50 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Instant Export</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Copy production-ready Markdown or HTML, or download a clean `.md` document in one click.</p>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: IMMERSIVE FULL-VIEWPORT CONVERSATIONAL QUESTIONNAIRE */}
      {viewState === 'wizard' && (
        <div className="min-h-[70vh] sm:min-h-[78vh] flex flex-col justify-center my-2">
          {/* Header Return button */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-900">
            <button
              type="button"
              onClick={() => setViewState('landing')}
              className="text-xs font-semibold text-slate-400 hover:text-stone-50 transition-colors flex items-center gap-1.5"
            >
              ← Back to Overview & FAQs
            </button>
            <span className="text-[11px] font-mono text-slate-500">Step {wizardStep} of 5</span>
          </div>

          <Stepper
            hideIndicators={true}
            hideFooter={true}
            initialStep={wizardStep}
            onStepChange={(step: number) => {
              setWizardStep(step);
              setSubQuestionIndex(0);
            }}
            onFinalStepCompleted={() => setViewState('preview')}
          >
            {/* CHAPTER 1: THE ORIGIN (CONNECTING & ENGAGING STORYTELLING) */}
            <Step>
              <div className="max-w-xl mx-auto min-h-[380px] flex flex-col justify-between">
                <div>
                  {subQuestionIndex === 0 && (
                    <div>
                      <TypewriterHeading text="What type of digital product are you creating?" />
                      <div className="grid grid-cols-1 gap-3 mt-6">
                        {[
                          { type: 'website', title: 'Website or Web Application', desc: 'SaaS platforms, blogs, online stores, landing pages.' },
                          { type: 'app', title: 'Mobile App', desc: 'iOS App Store or Android Google Play native apps.' },
                          { type: 'both', title: 'Both Website & Mobile App', desc: 'Cross-platform ecosystem across web and mobile stores.' }
                        ].map(item => (
                          <div
                            key={item.type}
                            onClick={() => {
                              setBusiness({ ...business, platformType: item.type as any });
                              handleChapter1Next();
                            }}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex items-center justify-between ${
                              business.platformType === item.type
                                ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <div>
                              <h4 className="font-bold text-sm text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.title}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              business.platformType === item.type ? 'bg-stone-50 text-slate-950' : 'border border-slate-700 bg-slate-950'
                            }`}>
                              {business.platformType === item.type && (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {subQuestionIndex === 1 && (
                    <div>
                      <TypewriterHeading text="Great choice. What is your product or website called?" />
                      <div className="mt-6">
                        <input
                          type="text"
                          autoFocus
                          value={business.name}
                          onChange={e => setBusiness({ ...business, name: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && business.name.trim() && handleChapter1Next()}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-lg text-stone-50 focus:outline-none focus:border-slate-600 mb-2 font-medium"
                          placeholder="e.g. Acme SaaS"
                        />
                        <p className="text-xs text-slate-500 font-mono">Press Enter to continue</p>
                      </div>
                    </div>
                  )}

                  {subQuestionIndex === 2 && (
                    <div>
                      <TypewriterHeading text={business.name ? `That's a classy name! What is the legal registered entity behind ${business.name}?` : "What is the legal registered entity behind this?"} />
                      <div className="mt-6">
                        <input
                          type="text"
                          autoFocus
                          value={business.companyName}
                          onChange={e => setBusiness({ ...business, companyName: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && business.companyName.trim() && handleChapter1Next()}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-lg text-stone-50 focus:outline-none focus:border-slate-600 mb-2 font-medium"
                          placeholder="e.g. Acme Studio Inc."
                        />
                        <p className="text-xs text-slate-500 font-mono">Press Enter to continue</p>
                      </div>
                    </div>
                  )}

                  {subQuestionIndex === 3 && (
                    <div>
                      <TypewriterHeading text={business.name ? `Understood. What is the official website URL for ${business.name}?` : "What is your official website URL?"} />
                      <div className="mt-6">
                        <input
                          type="url"
                          autoFocus
                          value={business.url}
                          onChange={e => setBusiness({ ...business, url: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && business.url.trim() && handleChapter1Next()}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-lg text-stone-50 focus:outline-none focus:border-slate-600 mb-2 font-medium"
                          placeholder="https://example.com"
                        />
                        <p className="text-xs text-slate-500 font-mono">Press Enter to continue</p>
                      </div>
                    </div>
                  )}

                  {subQuestionIndex === 4 && (
                    <div>
                      <TypewriterHeading text={business.companyName ? `Where is ${business.companyName} legally registered?` : "Where is your business legally registered?"} />
                      <div className="mt-6">
                        <CustomDropdown
                          value={business.businessCountry}
                          onChange={val => handleCountryChange(val)}
                          options={COUNTRY_OPTIONS}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-8">
                  {subQuestionIndex > 0 ? (
                    <button
                      type="button"
                      onClick={handleChapter1Back}
                      className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-stone-50 transition-colors"
                    >
                      ← Previous Question
                    </button>
                  ) : <div />}

                  <button
                    type="button"
                    onClick={handleChapter1Next}
                    disabled={
                      (subQuestionIndex === 1 && !business.name.trim()) ||
                      (subQuestionIndex === 2 && !business.companyName.trim()) ||
                      (subQuestionIndex === 3 && !business.url.trim())
                    }
                    className="px-6 py-2.5 bg-stone-50 text-slate-950 text-xs font-bold rounded-xl hover:bg-stone-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed interactive-press"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </Step>

            {/* CHAPTER 2: THE AUDIENCE & TERRITORY */}
            <Step>
              <div className="max-w-xl mx-auto min-h-[380px] flex flex-col justify-between">
                <div>
                  <TypewriterHeading text={business.name ? `Got it! Where do users of ${business.name} reside?` : "Where do your users reside?"} />
                  <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                    Privacy laws apply based on visitor residence. Recommended frameworks were auto-configured for {COUNTRY_OPTIONS.find(c => c.value === business.businessCountry)?.label}.
                  </p>

                  <div className="space-y-3">
                    {REGION_CARDS.map(region => {
                      const isSelected = region.lawIds.every(id => selectedLaws.includes(id));
                      return (
                        <div
                          key={region.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedLaws(selectedLaws.filter(id => !region.lawIds.includes(id)));
                            } else {
                              const newLaws = Array.from(new Set([...selectedLaws, ...region.lawIds]));
                              setSelectedLaws(newLaws);
                            }
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex items-start justify-between gap-4 ${
                            isSelected
                              ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                              : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-sm text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                {region.title}
                              </h4>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                {region.badge}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{region.desc}</p>
                          </div>

                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isSelected ? 'bg-stone-50 text-slate-950' : 'border border-slate-700 bg-slate-950'
                          }`}>
                            {isSelected && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(1);
                      setSubQuestionIndex(4);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-stone-50 transition-colors"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(3);
                      setSubQuestionIndex(0);
                    }}
                    className="px-6 py-2.5 bg-stone-50 text-slate-950 text-xs font-bold rounded-xl hover:bg-stone-200 transition-all interactive-press"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </Step>

            {/* CHAPTER 3: THE DATA FOOTPRINT */}
            <Step>
              <div className="max-w-xl mx-auto min-h-[380px] flex flex-col justify-between">
                <div>
                  <TypewriterHeading text="Perfect. What personal data passes through your product?" />
                  <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                    Only select data types your platform actively processes. Keeping options minimal builds transparency.
                  </p>

                  <div className="space-y-3">
                    {DATA_CATEGORIES.map(cat => {
                      const isChecked = dataCollected[cat.key as keyof DataCollectedOptions];
                      return (
                        <div
                          key={cat.key}
                          onClick={() => setDataCollected({ ...dataCollected, [cat.key]: !isChecked })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex items-start justify-between gap-4 ${
                            isChecked
                              ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                              : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex-1">
                            <h4 className="font-bold text-sm text-stone-50 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                              {cat.title}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
                          </div>

                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isChecked ? 'bg-stone-50 text-slate-950' : 'border border-slate-700 bg-slate-950'
                          }`}>
                            {isChecked && (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-8">
                  <button
                    type="button"
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-stone-50 transition-colors"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => setWizardStep(4)}
                    className="px-6 py-2.5 bg-stone-50 text-slate-950 text-xs font-bold rounded-xl hover:bg-stone-200 transition-all interactive-press"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </Step>

            {/* CHAPTER 4: THE TECH ENGINE */}
            <Step>
              <div className="max-w-xl mx-auto min-h-[380px] flex flex-col justify-between">
                <div>
                  <TypewriterHeading text="Makes sense. Which third-party services power your tech engine?" />
                  <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                    Select tools in your tech stack. Required third-party legal disclosures will be auto-inserted.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {TECH_SERVICES_LIBRARY.map(service => {
                      const isSelected = selectedServices.includes(service.id);
                      return (
                        <div
                          key={service.id}
                          onClick={() => toggleService(service.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex flex-col justify-between ${
                            isSelected
                              ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                              : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-stone-50">{service.name}</span>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'bg-stone-50 text-slate-950' : 'border border-slate-700 bg-slate-950'
                            }`}>
                              {isSelected && (
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{service.plainSummary}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-8">
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-stone-50 transition-colors"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWizardStep(5);
                      setSubQuestionIndex(0);
                    }}
                    className="px-6 py-2.5 bg-stone-50 text-slate-950 text-xs font-bold rounded-xl hover:bg-stone-200 transition-all interactive-press"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </Step>

            {/* CHAPTER 5: THE LEGAL SEAL */}
            <Step>
              <div className="max-w-xl mx-auto min-h-[380px] flex flex-col justify-between">
                <div>
                  {subQuestionIndex === 0 && (
                    <div>
                      <TypewriterHeading text={business.name ? `Almost done! Where should users send privacy inquiries for ${business.name}?` : "Where should users send privacy & deletion inquiries?"} />
                      <div className="mt-6">
                        <input
                          type="email"
                          autoFocus
                          value={business.contactEmail}
                          onChange={e => setBusiness({ ...business, contactEmail: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && business.contactEmail.trim() && handleChapter5Next()}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-lg text-stone-50 focus:outline-none focus:border-slate-600 mb-2 font-medium"
                          placeholder="privacy@example.com"
                        />
                        <p className="text-xs text-slate-500 font-mono">Press Enter to continue</p>
                      </div>
                    </div>
                  )}

                  {subQuestionIndex === 1 && (
                    <div>
                      <TypewriterHeading text="Final touch: How many months do you retain user data?" />
                      <div className="mt-6">
                        <input
                          type="number"
                          autoFocus
                          value={dataRetentionMonths}
                          onChange={e => setDataRetentionMonths(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleChapter5Next()}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-lg text-stone-50 focus:outline-none focus:border-slate-600 mb-2 font-medium"
                          placeholder="24"
                        />
                        <p className="text-xs text-slate-500 font-mono">Months (default: 24 months)</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-8">
                  <button
                    type="button"
                    onClick={handleChapter5Back}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-stone-50 transition-colors"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleChapter5Next}
                    className="px-6 py-2.5 bg-stone-50 text-slate-950 text-xs font-bold rounded-xl hover:bg-stone-200 transition-all interactive-press"
                  >
                    {subQuestionIndex === 1 ? 'Generate Privacy Policy →' : 'Continue →'}
                  </button>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      )}

      {/* STATE 3: LIVE POLICY PREVIEW & OUTPUT */}
      {viewState === 'preview' && (
        <div className="py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setViewState('wizard');
                  setWizardStep(1);
                  setSubQuestionIndex(0);
                }}
                className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl transition-all flex items-center gap-1.5"
              >
                ← Edit Answers
              </button>

              <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  onClick={() => setViewMode('legal')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    viewMode === 'legal' ? 'bg-slate-800 text-stone-50' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Full Legal Text
                </button>
                <button
                  onClick={() => setViewMode('plain')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    viewMode === 'plain' ? 'bg-slate-800 text-stone-50' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  "In Short" Plain English
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-400 cursor-pointer mr-2">
                <input
                  type="checkbox"
                  checked={isEditable}
                  onChange={e => setIsEditable(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-stone-50"
                />
                Inline Editing
              </label>

              <button
                onClick={handleCopyMarkdown}
                className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-stone-50 border border-slate-800 rounded-xl transition-all interactive-press"
              >
                Copy Markdown
              </button>

              <button
                onClick={handleCopyHtml}
                className="px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-stone-50 border border-slate-800 rounded-xl transition-all interactive-press"
              >
                Copy HTML
              </button>

              <button
                onClick={handleDownloadTxt}
                className="px-3.5 py-1.5 text-xs font-bold bg-stone-50 hover:bg-stone-200 text-slate-950 rounded-xl transition-all interactive-press"
              >
                Download .md
              </button>
            </div>
          </div>

          {isEditable && (
            <div className="my-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-xl flex items-center gap-2">
              <span className="font-bold">Notice:</span> You are editing the generated text directly. You are responsible for ensuring edited clauses maintain legal validity.
            </div>
          )}

          <div className="mt-4 p-6 sm:p-8 bg-slate-950/60 border border-slate-800 rounded-2xl selection:bg-slate-800">
            {isEditable ? (
              <textarea
                value={customPolicyText || generatedPolicy}
                onChange={e => setCustomPolicyText(e.target.value)}
                className="w-full h-[500px] bg-transparent text-slate-300 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
