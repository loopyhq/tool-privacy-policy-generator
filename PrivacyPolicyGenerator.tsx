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
        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-stone-50 flex items-center justify-between transition-all hover:border-slate-700 focus:outline-none focus:border-slate-600 interactive-press"
      >
        <span className="truncate font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-stone-50' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-y-auto max-h-60 p-1.5 space-y-1">
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
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-slate-800 text-stone-50 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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

// --- CURATED TECH SERVICES LIBRARY (Chunked & Hick's Law Enforced) ---
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
    name: 'PostHog',
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
  const [activeTab, setActiveTab] = useState<'wizard' | 'preview' | 'cookie-banner' | 'auditor'>('wizard');
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'legal' | 'plain'>('legal');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Cookie Banner options
  const [bannerTheme, setBannerTheme] = useState<'dark' | 'light' | 'navy' | 'emerald' | 'monochrome'>('dark');
  const [bannerPos, setBannerPos] = useState<'bottom-card' | 'bottom-bar' | 'bottom-left' | 'bottom-right'>('bottom-card');

  // Business state
  const [business, setBusiness] = useState<BusinessDetails>({
    platformType: 'website',
    name: 'My Digital App',
    url: 'https://example.com',
    appName: 'My App',
    companyName: 'Acme Studio Inc.',
    companyAddress: '123 Tech Avenue, Suite 100, San Francisco, CA 94105, USA',
    contactEmail: 'privacy@example.com',
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

  // Auditor state
  const [auditInputText, setAuditInputText] = useState<string>('');
  const [auditResults, setAuditResults] = useState<{ score: number; missingClauses: string[]; foundClauses: string[] } | null>(null);

  // File input ref for JSON restore
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBusiness(prev => ({
      ...prev,
      effectiveDate: new Date().toISOString().split('T')[0]
    }));
  }, []);

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
        md += `To exercise your GDPR rights, contact our Data Protection Officer at: **${dpoEmail}** or **${business.contactEmail}**.\n\n`;
      }

      if (selectedLaws.includes('ccpa') || selectedLaws.includes('us_states')) {
        md += `### California Consumer Privacy Act (CCPA / CPRA) & US State Laws\n`;
        md += `California residents and US consumers possess specific rights under state privacy statutes:\n`;
        md += `- **Right to Know & Access:** Request disclosure of categories and specific pieces of personal information collected.\n`;
        md += `- **Right to Opt-Out:** Request that your personal information not be sold or shared for cross-context behavioral advertising.\n`;
        md += `- **Right to Non-Discrimination:** We will not discriminate against you for exercising your legal privacy rights.\n`;
        md += `To submit a California CCPA request or opt-out, email **${business.contactEmail}** with the subject line "CCPA Data Request".\n\n`;
      }

      if (selectedLaws.includes('pipeda')) {
        md += `### Canadian Privacy Rights (PIPEDA)\n`;
        md += `Canadian residents may challenge our compliance with PIPEDA principles by filing an inquiry with our designated Privacy Officer at **${business.contactEmail}**.\n\n`;
      }

      if (selectedLaws.includes('dpdp_india')) {
        md += `### India Digital Personal Data Protection Act (DPDP Act 2023)\n`;
        md += `Indian residents possess the right to seek summary of personal data processed, request correction and erasure, and register grievances with our Data Fiduciary at **${business.contactEmail}**.\n\n`;
      }

      md += `## 7. Data Retention & Security Measures\n`;
      md += `We store personal data for up to **${dataRetentionMonths} months** or as long as necessary to satisfy accounting, legal, or administrative obligations. We enforce TLS encryption, firewalls, and restricted administrative access to safeguard data.\n\n`;

      md += `## 8. Contact Us\n`;
      md += `If you have questions, feedback, or data deletion requests regarding this policy, please reach out:\n\n`;
      md += `- **Entity:** ${entityStr}\n`;
      md += `- **Address:** ${business.companyAddress}\n`;
      md += `- **Contact Email:** [${business.contactEmail}](mailto:${business.contactEmail})\n`;

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
      md += `You own your personal data. You can ask us to see, update, or completely delete your information anytime by emailing **${business.contactEmail}**.\n\n`;

      md += `### 5. Questions?\n`;
      md += `Email us at **${business.contactEmail}** and we will respond promptly.\n`;
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

  const generatedCookieSnippet = useMemo(() => {
    const cookieNames = selectedServices
      .flatMap(sId => TECH_SERVICES_LIBRARY.find(s => s.id === sId)?.cookiesUsed || [])
      .filter(Boolean);

    const themeColors = {
      dark: { bg: '#0f172a', border: '#334155', text: '#fafaf9', btnBg: '#fafaf9', btnText: '#020617', btnSecBg: 'transparent', btnSecBorder: '#475569' },
      light: { bg: '#ffffff', border: '#cbd5e1', text: '#0f172a', btnBg: '#0f172a', btnText: '#ffffff', btnSecBg: 'transparent', btnSecBorder: '#94a3b8' },
      navy: { bg: '#0a192f', border: '#1e3a8a', text: '#f8fafc', btnBg: '#2563eb', btnText: '#ffffff', btnSecBg: 'transparent', btnSecBorder: '#3b82f6' },
      emerald: { bg: '#064e3b', border: '#059669', text: '#ecfdf5', btnBg: '#10b981', btnText: '#022c22', btnSecBg: 'transparent', btnSecBorder: '#34d399' },
      monochrome: { bg: '#000000', border: '#27272a', text: '#ffffff', btnBg: '#ffffff', btnText: '#000000', btnSecBg: 'transparent', btnSecBorder: '#52525b' }
    }[bannerTheme];

    const posStyles = {
      'bottom-card': 'bottom:20px; left:20px; right:20px; max-width:480px; margin:0 auto; border-radius:16px;',
      'bottom-bar': 'bottom:0; left:0; right:0; max-width:100%; border-radius:0;',
      'bottom-left': 'bottom:20px; left:20px; max-width:400px; border-radius:16px;',
      'bottom-right': 'bottom:20px; right:20px; max-width:400px; border-radius:16px;'
    }[bannerPos];

    return `<!-- Loopy HQ Stateless Cookie Banner Snippet -->
<div id="loopy-cookie-banner" style="display:none; position:fixed; ${posStyles} background:${themeColors.bg}; border:1px solid ${themeColors.border}; color:${themeColors.text}; padding:20px; font-family:sans-serif; z-index:999999; box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);">
  <p style="margin:0 0 12px 0; font-size:13px; line-height:1.5; opacity:0.9;">
    We use essential cookies and services (${cookieNames.slice(0, 4).join(', ') || 'analytics'}) to enhance performance and user experience. View our <a href="${business.url}/privacy" style="color:${themeColors.text}; text-decoration:underline;">Privacy Policy</a>.
  </p>
  <div style="display:flex; gap:10px; justify-content:flex-end;">
    <button onclick="rejectLoopyCookies()" style="background:${themeColors.btnSecBg}; border:1px solid ${themeColors.btnSecBorder}; color:${themeColors.text}; padding:7px 14px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:bold;">Decline</button>
    <button onclick="acceptLoopyCookies()" style="background:${themeColors.btnBg}; border:none; color:${themeColors.btnText}; padding:7px 14px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:bold;">Accept</button>
  </div>
</div>

<script>
(function() {
  if (!localStorage.getItem('loopy_cookie_consent')) {
    document.getElementById('loopy-cookie-banner').style.display = 'block';
  }
})();
function acceptLoopyCookies() {
  localStorage.setItem('loopy_cookie_consent', 'accepted');
  document.getElementById('loopy-cookie-banner').style.display = 'none';
}
function rejectLoopyCookies() {
  localStorage.setItem('loopy_cookie_consent', 'declined');
  document.getElementById('loopy-cookie-banner').style.display = 'none';
}
</script>`;
  }, [selectedServices, business.url, bannerTheme, bannerPos]);

  const runPolicyAudit = () => {
    if (!auditInputText.trim()) return;

    const lowerText = auditInputText.toLowerCase();
    const found: string[] = [];
    const missing: string[] = [];

    if (lowerText.includes('collect') || lowerText.includes('information')) found.push('Data Collection Overview');
    else missing.push('Missing: Data Collection Section');

    if (lowerText.includes('gdpr') || lowerText.includes('rights') || lowerText.includes('access') || lowerText.includes('erasure')) found.push('User Legal Rights (GDPR/CCPA)');
    else missing.push('Missing: GDPR / CCPA User Rights Clause');

    if (lowerText.includes('cookie') || lowerText.includes('tracking')) found.push('Cookies & Tracking Disclosure');
    else missing.push('Missing: Cookie & Tracking Clause');

    if (lowerText.includes('retention') || lowerText.includes('store') || lowerText.includes('months')) found.push('Data Retention Period');
    else missing.push('Missing: Data Retention Disclosure');

    if (lowerText.includes('contact') || lowerText.includes('@') || lowerText.includes('email')) found.push('Contact Information & DPO Email');
    else missing.push('Missing: Privacy Contact / DPO Information');

    selectedServices.forEach(sId => {
      const service = TECH_SERVICES_LIBRARY.find(s => s.id === sId);
      if (service) {
        if (lowerText.includes(service.name.toLowerCase()) || lowerText.includes(sId)) {
          found.push(`Integration: ${service.name}`);
        } else {
          missing.push(`Missing Integration Disclosure: ${service.name}`);
        }
      }
    });

    const total = found.length + missing.length;
    const score = total > 0 ? Math.round((found.length / total) * 100) : 0;

    setAuditResults({ score, missingClauses: missing, foundClauses: found });
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
    element.download = `privacy-policy-${business.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast('Downloaded Privacy Policy (.md)');
  };

  const handleExportJson = () => {
    const config: PrivacyPolicyConfig = {
      version: '1.0',
      business,
      selectedLaws,
      dataCollected,
      dataPurposes,
      selectedServices,
      dataRetentionMonths,
      dpoEmail
    };
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `privacy-policy-config-${business.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast('Exported Config JSON (Save State)');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string) as PrivacyPolicyConfig;
          if (parsed.business) setBusiness(parsed.business);
          if (parsed.selectedLaws) setSelectedLaws(parsed.selectedLaws);
          if (parsed.dataCollected) setDataCollected(parsed.dataCollected);
          if (parsed.dataPurposes) setDataPurposes(parsed.dataPurposes);
          if (parsed.selectedServices) setSelectedServices(parsed.selectedServices);
          if (parsed.dataRetentionMonths) setDataRetentionMonths(parsed.dataRetentionMonths);
          if (parsed.dpoEmail) setDpoEmail(parsed.dpoEmail);
          triggerToast('Imported Config JSON & Restored Answers!');
        } catch (err) {
          alert('Invalid JSON configuration file.');
        }
      };
    }
  };

  // Chunked Region Cards for Chapter 2
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

  // Chunked Data Categories for Chapter 3 (Miller's Law: 4 simple choices)
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

  return (
    <div className="w-full max-w-4xl mx-auto font-sans">

      {copyFeedback && (
        <div className="fixed top-20 right-5 z-50 px-4 py-2.5 bg-slate-900 border border-slate-700 text-stone-50 text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          {copyFeedback}
        </div>
      )}

      {/* Seamless Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'wizard' ? 'bg-stone-50 text-slate-950 shadow-md' : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            1. Interactive Story Questionnaire
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'preview' ? 'bg-stone-50 text-slate-950 shadow-md' : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            2. Policy Output & Preview
          </button>

          <button
            onClick={() => setActiveTab('cookie-banner')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'cookie-banner' ? 'bg-stone-50 text-slate-950 shadow-md' : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            3. Cookie Banner
          </button>

          <button
            onClick={() => setActiveTab('auditor')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'auditor' ? 'bg-stone-50 text-slate-950 shadow-md' : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            4. Policy Auditor
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            title="Save configuration state locally"
            className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-stone-50 border border-slate-800 rounded-xl transition-all interactive-press flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Save State
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Load saved state from JSON"
            className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-stone-50 border border-slate-800 rounded-xl transition-all interactive-press flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            Load State
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJson} className="hidden" />
        </div>
      </div>

      {/* TAB 1: STORY-DRIVEN QUESTIONNAIRE (LAWS OF UX ENFORCED) */}
      {activeTab === 'wizard' && (
        <div>
          <Stepper
            initialStep={wizardStep}
            onStepChange={(step: number) => setWizardStep(step)}
            onFinalStepCompleted={() => setActiveTab('preview')}
          >
            {/* CHAPTER 1: THE ORIGIN */}
            <Step>
              <div className="pb-16 max-w-2xl mx-auto">
                <div className="mb-6">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Chapter I &bull; The Origin
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-50 mt-1 mb-2 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    What is the story of your digital creation?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    Let's begin by defining your product identity. Tell us what you are building and where your entity operates.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      1. I am building a...
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['website', 'app', 'both'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setBusiness({ ...business, platformType: type })}
                          className={`py-3 px-4 text-xs font-bold rounded-2xl border text-center capitalize transition-all interactive-press ${
                            business.platformType === type
                              ? 'bg-stone-50 text-slate-950 border-stone-50 shadow-lg'
                              : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                        >
                          {type === 'both' ? 'Website & App' : type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        2. Named (Product / Site Title)
                      </label>
                      <input
                        type="text"
                        value={business.name}
                        onChange={e => setBusiness({ ...business, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-stone-50 focus:outline-none focus:border-slate-600"
                        placeholder="e.g. Acme SaaS"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        3. Operated by (Company / Entity)
                      </label>
                      <input
                        type="text"
                        value={business.companyName}
                        onChange={e => setBusiness({ ...business, companyName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-stone-50 focus:outline-none focus:border-slate-600"
                        placeholder="Acme Technologies Inc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        4. Product URL
                      </label>
                      <input
                        type="url"
                        value={business.url}
                        onChange={e => setBusiness({ ...business, url: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-stone-50 focus:outline-none focus:border-slate-600"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                        5. Primary Business Location
                      </label>
                      <CustomDropdown
                        value={business.businessCountry}
                        onChange={val => handleCountryChange(val)}
                        options={COUNTRY_OPTIONS}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Step>

            {/* CHAPTER 2: THE AUDIENCE & TERRITORY */}
            <Step>
              <div className="pb-8 max-w-2xl mx-auto">
                <div className="mb-6">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Chapter II &bull; The Audience & Territory
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-50 mt-1 mb-2 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Where do your users come from?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    Privacy laws apply based on where your visitors live. Select the regions your product serves (Hick's Law: 4 primary buckets).
                  </p>
                </div>

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
            </Step>

            {/* CHAPTER 3: THE DATA FOOTPRINT */}
            <Step>
              <div className="pb-8 max-w-2xl mx-auto">
                <div className="mb-6">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Chapter III &bull; The Data Footprint
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-50 mt-1 mb-2 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    What personal data does your product process?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    Only select data categories your platform actively handles. Minimizing data collection builds transparency and user trust.
                  </p>
                </div>

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
            </Step>

            {/* CHAPTER 4: THE TECH ENGINE */}
            <Step>
              <div className="pb-8 max-w-2xl mx-auto">
                <div className="mb-6">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Chapter IV &bull; The Tech Engine
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-50 mt-1 mb-2 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Which tools power your experience?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    Select third-party integrations in your tech stack. We will automatically insert their required legal disclosures.
                  </p>
                </div>

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
            </Step>

            {/* CHAPTER 5: THE LEGAL SEAL */}
            <Step>
              <div className="pb-8 max-w-2xl mx-auto">
                <div className="mb-6">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                    Chapter V &bull; The Legal Seal
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-50 mt-1 mb-2 tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Where should users send privacy inquiries?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                    Finalize your policy agreement by declaring your designated privacy contact email and data retention policy.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Privacy Contact Email
                    </label>
                    <input
                      type="email"
                      value={business.contactEmail}
                      onChange={e => setBusiness({ ...business, contactEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-stone-50 focus:outline-none focus:border-slate-600"
                      placeholder="privacy@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Data Retention Period (Months)
                    </label>
                    <input
                      type="number"
                      value={dataRetentionMonths}
                      onChange={e => setDataRetentionMonths(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-stone-50 focus:outline-none focus:border-slate-600"
                      placeholder="24"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                    <h4 className="font-bold text-stone-50 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Privacy Guarantee
                    </h4>
                    <p>
                      Your questionnaire answers are processed 100% locally inside your web browser. No company details or email addresses are ever stored on external servers.
                    </p>
                  </div>
                </div>
              </div>
            </Step>
          </Stepper>
        </div>
      )}

      {/* TAB 2: LIVE POLICY PREVIEW & OUTPUT */}
      {activeTab === 'preview' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                onClick={() => setViewMode('legal')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'legal' ? 'bg-slate-800 text-stone-50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Full Legal Text
              </button>
              <button
                onClick={() => setViewMode('plain')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  viewMode === 'plain' ? 'bg-slate-800 text-stone-50' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                "In Short" Plain English
              </button>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isEditable}
                onChange={e => setIsEditable(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-stone-50"
              />
              Enable Inline Editing
            </label>

            <div className="flex flex-wrap items-center gap-2">
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

      {/* TAB 3: COOKIE BANNER SNIPPET */}
      {activeTab === 'cookie-banner' && (
        <div>
          {/* Header with Top-Right Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Client-Side Cookie Consent Banner Generator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero server dependencies. Embed this snippet on your website to store visitor consent choices directly in their browser's <code className="text-slate-300 font-mono">localStorage</code>.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(generatedCookieSnippet, 'Copied Cookie Banner Snippet!')}
              className="interactive-press px-4 py-2 text-xs font-bold bg-stone-50 text-slate-950 rounded-xl hover:bg-stone-200 transition-all flex items-center gap-2 shrink-0 shadow-lg"
            >
              <svg className="w-4 h-4 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v9.25c0 .621-.504 1.125-1.125 1.125Z" />
              </svg>
              Copy Code
            </button>
          </div>

          {/* Customization Options Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Professional Color Theme Selector */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Professional Color Theme
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['dark', 'light', 'navy', 'emerald', 'monochrome'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setBannerTheme(t)}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl border capitalize transition-all interactive-press text-center ${
                      bannerTheme === t
                        ? 'bg-slate-800 text-stone-50 border-stone-50 shadow-md'
                        : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Position Selector */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Display Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['bottom-card', 'bottom-bar', 'bottom-left', 'bottom-right'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setBannerPos(p)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all interactive-press text-center ${
                      bannerPos === p
                        ? 'bg-slate-800 text-stone-50 border-stone-50 shadow-md'
                        : 'bg-slate-900/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    {p.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Interactive Viewport Mockup Preview */}
          <div className="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl relative h-64 overflow-hidden flex flex-col justify-between select-none">
            {/* Fake Background Website Elements */}
            <div className="opacity-25 pointer-events-none space-y-3 p-2">
              <div className="h-3 w-1/4 bg-slate-700 rounded"></div>
              <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
              <div className="h-2 w-1/2 bg-slate-800 rounded"></div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="h-12 bg-slate-900 rounded-lg border border-slate-800"></div>
                <div className="h-12 bg-slate-900 rounded-lg border border-slate-800"></div>
                <div className="h-12 bg-slate-900 rounded-lg border border-slate-800"></div>
              </div>
            </div>

            <div className="absolute top-3 right-3 text-[10px] font-mono text-emerald-400 font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Live Viewport Motion Preview
            </div>

            {/* Rendered Mock Banner positioned dynamically */}
            <div
              className={`transition-all duration-300 shadow-2xl p-4 text-xs z-10 ${
                bannerPos === 'bottom-card' ? 'absolute bottom-3 left-1/2 -translate-x-1/2 w-11/12 max-w-md rounded-2xl border' :
                bannerPos === 'bottom-bar' ? 'absolute bottom-0 left-0 right-0 w-full rounded-none border-t' :
                bannerPos === 'bottom-left' ? 'absolute bottom-3 left-3 w-10/12 max-w-xs rounded-2xl border' :
                'absolute bottom-3 right-3 w-10/12 max-w-xs rounded-2xl border'
              } ${
                bannerTheme === 'dark' ? 'bg-slate-900 border-slate-700 text-stone-50' :
                bannerTheme === 'light' ? 'bg-white border-slate-200 text-slate-900' :
                bannerTheme === 'navy' ? 'bg-slate-950 border-blue-800 text-slate-100' :
                bannerTheme === 'emerald' ? 'bg-emerald-950 border-emerald-700 text-emerald-100' :
                'bg-black border-zinc-800 text-white'
              }`}
            >
              <p className="mb-3 leading-relaxed text-[11px] opacity-90">
                We use essential cookies and services ({selectedServices.slice(0, 2).join(', ') || 'analytics'}) to improve performance. View our <span className="underline font-bold">Privacy Policy</span>.
              </p>
              <div className="flex gap-2 justify-end">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                  bannerTheme === 'light' ? 'border-slate-300 text-slate-700' : 'border-slate-700 text-slate-300'
                }`}>
                  Decline
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  bannerTheme === 'light' ? 'bg-slate-900 text-white' :
                  bannerTheme === 'emerald' ? 'bg-emerald-400 text-emerald-950' :
                  bannerTheme === 'navy' ? 'bg-blue-600 text-white' :
                  'bg-stone-50 text-slate-950'
                }`}>
                  Accept
                </span>
              </div>
            </div>
          </div>

          {/* Clean Code Output Container with Top-Right Copy Button */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 text-xs text-slate-400 font-mono">
              <span>HTML / JavaScript Embed Code</span>
              <button
                onClick={() => copyToClipboard(generatedCookieSnippet, 'Copied Cookie Banner HTML/JS!')}
                className="interactive-press text-[11px] font-bold text-stone-50 hover:text-white flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v9.25c0 .621-.504 1.125-1.125 1.125Z" />
                </svg>
                Copy Snippet
              </button>
            </div>

            <pre className="p-5 text-xs font-mono text-emerald-400 leading-relaxed max-h-[380px] overflow-x-auto selection:bg-slate-800">
              {generatedCookieSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: POLICY AUDITOR */}
      {activeTab === 'auditor' && (
        <div>
          <h3 className="text-sm font-bold text-stone-50 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            In-Browser Policy Auditor
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Paste an existing Privacy Policy text below to scan it for missing clauses against your declared tech stack and target privacy laws. Runs 100% locally.
          </p>

          <textarea
            value={auditInputText}
            onChange={e => setAuditInputText(e.target.value)}
            placeholder="Paste existing policy text here..."
            rows={8}
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 focus:outline-none focus:border-slate-600 mb-4"
          />

          <button
            onClick={runPolicyAudit}
            className="px-5 py-2.5 bg-stone-50 text-slate-950 text-xs font-bold rounded-xl hover:bg-stone-200 transition-all interactive-press"
          >
            Run In-Browser Audit
          </button>

          {auditResults && (
            <div className="mt-6 p-6 bg-slate-950 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xl text-stone-50">
                  {auditResults.score}%
                </div>
                <div>
                  <h4 className="font-bold text-stone-50 text-sm">Policy Compliance Score</h4>
                  <p className="text-xs text-slate-400">Based on {selectedServices.length} tech integrations and {selectedLaws.length} selected laws.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300">
                  <h5 className="font-bold mb-2 uppercase tracking-wider text-[10px]">Detected / Found Clauses ({auditResults.foundClauses.length})</h5>
                  <ul className="list-disc pl-4 space-y-1">
                    {auditResults.foundClauses.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>

                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300">
                  <h5 className="font-bold mb-2 uppercase tracking-wider text-[10px]">Missing / Recommended Clauses ({auditResults.missingClauses.length})</h5>
                  <ul className="list-disc pl-4 space-y-1">
                    {auditResults.missingClauses.length > 0 ? (
                      auditResults.missingClauses.map((c, i) => <li key={i}>{c}</li>)
                    ) : (
                      <li>No missing clauses detected! Excellent.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
