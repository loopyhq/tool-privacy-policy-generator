import React, { useState, useMemo, useRef, useEffect } from 'react';
import BorderGlow from '../../components/BorderGlow';
import typingMp3 from './typing.mp3';

// --- TYPES & INTERFACES ---
export interface BusinessDetails {
  platformType: 'web' | 'app' | 'extension' | 'multi' | 'website' | 'both';
  urlMode: 'live' | 'planned' | 'app_store';
  name: string;
  url: string;
  policyLocation: string;
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
  category: 'analytics' | 'payment' | 'marketing' | 'auth' | 'support' | 'ads' | 'infra';
  privacyUrl: string;
  cookiesUsed: string[];
  clauseText: string;
  plainSummary: string;
}

export interface DataCollectedOptions {
  personalInfo: boolean; // Account Credentials: Email, username, password hashes
  financialInfo: boolean; // Billing & Payment Details: Credit card info, billing address, tax IDs
  userContent: boolean; // User Generated Content: Uploaded files, prompts, custom code, or media
  communicationData: boolean; // Communication Data: Support tickets, contact form messages
}

export interface PassiveTelemetryOptions {
  serverLogs: boolean; // Server & Hosting Logs: IP addresses, browser user-agents, request timestamps
  deviceTechData: boolean; // Device & Location Data: Approximate location, device hardware specs
  cookiesSession: boolean; // Cookies & Session Tokens: LocalStorage, session cookies, auth tokens
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
  passiveTelemetry: PassiveTelemetryOptions;
  dataPurposes: DataPurposesOptions;
  selectedServices: string[];
  dataRetentionMonths: string;
  dpoEmail: string;
}

type PreviewPanel = 'document' | 'embed';
type EmbedTheme = 'midnight' | 'paper' | 'emerald';

// --- SVG ICON RENDER HELPERS ---
function renderTypeIcon(icon: string, className = "w-5 h-5") {
  switch (icon) {
    case 'web':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
        </svg>
      );
    case 'app':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
        </svg>
      );
    case 'extension':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M12 17v3" />
        </svg>
      );
    case 'multi':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      );
    default:
      return null;
  }
}

function renderStageIcon(icon: string, className = "w-5 h-5") {
  switch (icon) {
    case 'live':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      );
    case 'app_store':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      );
    case 'planned':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 8.5c1.25-1.5 3.5-2.5 3.5-2.5s-1 2.25-2.5 3.5M12 2C6.5 2 2 6.5 2 12c0 2.5 1 4 1.5 4.5S6.5 16 12 12" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2c5.5 0 10 4.5 10 10 0 2.5-1 4-1.5 4.5S17.5 16 12 12M9 15l3-3" />
        </svg>
      );
    default:
      return null;
  }
}

function renderRegionIcon(icon: string, className = "w-5 h-5") {
  switch (icon) {
    case 'eu':
      return (
        <span className="font-bold text-[11px] font-mono tracking-wider text-emerald-400">EU</span>
      );
    case 'us':
      return (
        <span className="font-bold text-[11px] font-mono tracking-wider text-blue-400">US</span>
      );
    case 'in':
      return (
        <span className="font-bold text-[11px] font-mono tracking-wider text-amber-500">IN</span>
      );
    case 'global':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" />
        </svg>
      );
    default:
      return null;
  }
}

function renderCategoryIcon(category: string, className = "w-3.5 h-3.5") {
  switch (category) {
    case 'auth':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    case 'payment':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
        </svg>
      );
    case 'analytics':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'infra':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'support':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    default:
      return null;
  }
}

// --- TYPING MP3 AUDIO MANAGER ---
let typingAudioInstance: HTMLAudioElement | null = null;

function getTypingAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!typingAudioInstance) {
    typingAudioInstance = new Audio(typingMp3 || '/typing.mp3');
    typingAudioInstance.loop = true;
    typingAudioInstance.volume = 0.15; // Low, pleasant background volume
  }
  return typingAudioInstance;
}

function startTypingAudio(isMuted: boolean) {
  if (isMuted) return;
  const audio = getTypingAudio();
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

function stopTypingAudio() {
  if (typingAudioInstance) {
    typingAudioInstance.pause();
    typingAudioInstance.currentTime = 0;
  }
}

// --- TYPEWRITER COMPONENT (Claude-Style Newsreader Serif with Glowing Emerald Beam Cursor) ---
function TypewriterHeading({ text, speed = 35, isMuted = false }: { text: string; speed?: number; isMuted?: boolean }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const indexRef = useRef(0);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted) {
      stopTypingAudio();
    } else if (isTyping) {
      startTypingAudio(false);
    }
  }, [isMuted, isTyping]);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    indexRef.current = 0;

    startTypingAudio(isMutedRef.current);

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        setIsTyping(false);
        stopTypingAudio();
        clearInterval(timer);
      }
    }, speed);

    return () => {
      clearInterval(timer);
      stopTypingAudio();
    };
  }, [text, speed]);

  return (
    <h3
      className="text-3xl sm:text-5xl text-stone-50 mb-6 tracking-tight leading-[1.18] select-none min-h-[2.4em] sm:min-h-[2.3em]"
      style={{ fontFamily: "'Newsreader', 'Georgia', 'Cambria', serif", fontStyle: 'italic', fontWeight: 400 }}
    >
      <span>{displayedText}</span>
      {isTyping && (
        <span className="inline-block w-[3px] h-[0.75em] bg-emerald-400 rounded-full ml-1.5 shadow-[0_0_12px_rgba(52,211,153,0.95)] animate-pulse align-baseline" />
      )}
    </h3>
  );
}

// --- CUSTOM SEARCHABLE DROPDOWN COMPONENT ---
interface CustomDropdownOption {
  value: string;
  label: string;
}

function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Type to search country...',
  onEnter,
  autoFocus = true
}: {
  value: string;
  onChange: (val: string) => void;
  options: CustomDropdownOption[];
  placeholder?: string;
  onEnter?: () => void;
  autoFocus?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (selectedOption) {
          setSearchTerm(selectedOption.label);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm || (selectedOption && searchTerm === selectedOption.label)) {
      return options;
    }
    return options.filter(o =>
      o.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, selectedOption]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          autoFocus={autoFocus}
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => { if (hasInteracted.current) setIsOpen(true); }}
          onClick={() => { hasInteracted.current = true; setIsOpen(true); }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              if (isOpen && filteredOptions.length > 0) {
                const chosen = filteredOptions.find(o => o.value === value) || filteredOptions[0];
                onChange(chosen.value);
                setSearchTerm(chosen.label);
                setIsOpen(false);
              } else {
                setIsOpen(false);
              }
              onEnter?.();
            } else if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 pr-12 text-base text-stone-50 transition-all hover:border-slate-700 focus:outline-none focus:border-slate-600 font-medium placeholder-slate-500"
          placeholder={placeholder}
        />
        <div className="absolute right-4 pointer-events-none text-slate-400">
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-stone-50' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-y-auto max-h-60 p-2 space-y-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setSearchTerm(option.label);
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
            })
          ) : (
            <div className="px-4 py-3 text-xs text-slate-500 font-mono text-center">
              No matching countries found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- LUXURY QUICK OPTION CHIP COMPONENT ---
function LuxuryQuickOption({
  label,
  isSelected,
  onClick
}: {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 interactive-press ${
        isSelected
          ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.18)]'
          : 'bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800/80 hover:border-emerald-500/40 text-slate-400 hover:text-stone-100 shadow-sm hover:shadow-[0_0_15px_rgba(52,211,153,0.12)]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
        isSelected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]' : 'bg-slate-600 group-hover:bg-emerald-400 group-hover:shadow-[0_0_6px_rgba(52,211,153,0.8)]'
      }`} />
      <span>{label}</span>
    </button>
  );
}

// --- CURATED TECH SERVICES LIBRARY ---
const TECH_SERVICES_LIBRARY: TechService[] = [
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
    id: 'firebase',
    name: 'Google Firebase',
    category: 'auth',
    privacyUrl: 'https://policies.google.com/privacy',
    cookiesUsed: ['__session', '_fid'],
    clauseText: 'Backend database, analytical tracking, and authentication services are hosted on Google Firebase platforms under standard Google privacy clauses.',
    plainSummary: 'Powers database and authentication via Google Firebase.'
  },
  {
    id: 'auth0',
    name: 'Auth0 Identity',
    category: 'auth',
    privacyUrl: 'https://www.okta.com/privacy-policy/',
    cookiesUsed: ['auth0_*'],
    clauseText: 'Identity verification, single sign-on, and authentication management are powered by Auth0.',
    plainSummary: 'Manages identity verification and single sign-on logins.'
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    category: 'payment',
    privacyUrl: 'https://stripe.com/privacy',
    cookiesUsed: ['__stripe_mid', '__stripe_sid'],
    clauseText: 'Payment processing is handled securely by Stripe. Credit card and financial transaction details are processed by Stripe under PCI-DSS Level 1 certification. We do not store card details on our servers.',
    plainSummary: 'Processes payments securely without storing credit card numbers.'
  },
  {
    id: 'razorpay',
    name: 'Razorpay Payments',
    category: 'payment',
    privacyUrl: 'https://razorpay.com/privacy/',
    cookiesUsed: ['rzp_*'],
    clauseText: 'Payment and checkout transactions are securely processed by Razorpay. We do not store or see credit card or bank details directly.',
    plainSummary: 'Processes payment and checkout transactions securely.'
  },
  {
    id: 'lemonsqueezy',
    name: 'Lemon Squeezy',
    category: 'payment',
    privacyUrl: 'https://www.lemonsqueezy.com/privacy',
    cookiesUsed: ['_lemon_squeezy_*'],
    clauseText: 'Payment processing, subscription billing, and tax invoicing are managed by Lemon Squeezy acting as our Merchant of Record.',
    plainSummary: 'Acts as our Merchant of Record to handle billing, licensing, and tax invoicing.'
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
    id: 'ga4',
    name: 'Google Analytics 4',
    category: 'analytics',
    privacyUrl: 'https://policies.google.com/privacy',
    cookiesUsed: ['_ga', '_ga_*'],
    clauseText: 'We use Google Analytics 4 to measure aggregated website traffic and user engagement metrics. Google processes anonymized IP addresses and device interaction data.',
    plainSummary: 'Measures site traffic and page views anonymously.'
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel Analytics',
    category: 'analytics',
    privacyUrl: 'https://mixpanel.com/legal/privacy-policy/',
    cookiesUsed: ['mp_*'],
    clauseText: 'Product usage telemetry and event-based feature interactions are tracked via Mixpanel.',
    plainSummary: 'Tracks product usage telemetry and feature interaction metrics.'
  },
  {
    id: 'sentry',
    name: 'Sentry Monitoring',
    category: 'infra',
    privacyUrl: 'https://sentry.io/privacy/',
    cookiesUsed: ['sentry_*'],
    clauseText: 'Real-time error tracking, crash reporting, and frontend/backend performance monitoring are handled by Sentry.',
    plainSummary: 'Monitors crash reports and runtime errors to improve stability.'
  },
  {
    id: 'vercel',
    name: 'Vercel Analytics',
    category: 'infra',
    privacyUrl: 'https://vercel.com/legal/privacy-policy',
    cookiesUsed: ['_vercel_jwt'],
    clauseText: 'Application hosting, edge infrastructure services, and request routing log telemetry are powered by Vercel.',
    plainSummary: 'Provides web hosting, edge network, and performance logs.'
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Network',
    category: 'infra',
    privacyUrl: 'https://www.cloudflare.com/privacypolicy/',
    cookiesUsed: ['__cf_bm', 'cf_ob_info'],
    clauseText: 'Security firewall protection, content delivery network routing, and incoming network request log telemetry are managed by Cloudflare.',
    plainSummary: 'Secures and accelerates site traffic with DNS and proxy logs.'
  },
  {
    id: 'resend',
    name: 'Resend Mailer',
    category: 'support',
    privacyUrl: 'https://resend.com/privacy',
    cookiesUsed: [],
    clauseText: 'Transactional email notifications, onboarding updates, and system communications are delivered through Resend.',
    plainSummary: 'Delivers system transactional and account confirmation emails.'
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
    id: 'mailchimp',
    name: 'Mailchimp Newsletter',
    category: 'support',
    privacyUrl: 'https://mailchimp.com/legal/privacy/',
    cookiesUsed: ['AVS_*'],
    clauseText: 'We manage email marketing lists using Mailchimp. Subscribers may opt out at any time using the unsubscribe link included in every newsletter.',
    plainSummary: 'Manages newsletter subscribers with one-click unsubscribe.'
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

const EMBED_THEME_OPTIONS: Array<{ id: EmbedTheme; label: string; description: string }> = [
  { id: 'midnight', label: 'Midnight', description: 'Dark footer and app settings card.' },
  { id: 'paper', label: 'Paper', description: 'Light docs, help centers, and blogs.' },
  { id: 'emerald', label: 'Emerald', description: 'High-trust launch pages and onboarding.' }
];

const LAW_LABELS: Record<string, string> = {
  gdpr: 'EU GDPR',
  uk_gdpr: 'UK GDPR',
  ccpa: 'CCPA / CPRA',
  us_states: 'US state privacy laws',
  pipeda: 'Canada PIPEDA',
  dpdp_india: 'India DPDP Act',
  aus_privacy: 'Australia Privacy Act',
  lgpd: 'Brazil LGPD',
  popia: 'South Africa POPIA'
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export function PrivacyPolicyGenerator({ defaultView = 'landing' }: { defaultView?: 'landing' | 'wizard' }) {
  const [viewState, setViewState] = useState<'landing' | 'wizard' | 'preview'>(defaultView);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [subQuestionIndex, setSubQuestionIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  const [previewPanel, setPreviewPanel] = useState<PreviewPanel>('document');
  const [embedTheme, setEmbedTheme] = useState<EmbedTheme>('midnight');
  const [showServicesOnCard, setShowServicesOnCard] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'legal' | 'plain'>('legal');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Focus container ref for scroll locking viewport focus
  const questionBoxRef = useRef<HTMLDivElement>(null);
  const wizardRef = useRef<HTMLDivElement>(null);
  const handleCurrentStepNextRef = useRef<() => void>(() => {});

  // Business state
  const [business, setBusiness] = useState<BusinessDetails>({
    platformType: 'web',
    urlMode: 'live',
    name: '',
    url: '',
    policyLocation: '',
    appName: '',
    companyName: '',
    companyAddress: '123 Tech Avenue, Suite 100, San Francisco, CA 94105, USA',
    contactEmail: '',
    effectiveDate: '2026-07-25',
    businessCountry: 'US',
    businessState: 'California'
  });

  const [entityType, setEntityType] = useState<'registered' | 'unregistered'>('unregistered');
  const [aiPractices, setAiPractices] = useState<'no_ai' | 'third_party_ai' | 'custom_ai'>('no_ai');
  const [childrenPrivacy, setChildrenPrivacy] = useState<'no' | 'yes'>('no');
  
  const [grievanceName, setGrievanceName] = useState<string>('');
  const [grievanceEmail, setGrievanceEmail] = useState<string>('');
  const [grievanceAddress, setGrievanceAddress] = useState<string>('');

  // Selected laws
  const [selectedLaws, setSelectedLaws] = useState<string[]>(['global']);

  const step1SubQuestions = useMemo(() => {
    const list = ['type', 'identity'];
    if (entityType === 'registered') {
      list.push('country');
    }
    list.push('stage');
    if (business.urlMode !== 'live') {
      list.push('hosting');
    }
    return list;
  }, [entityType, business.urlMode]);

  const step5SubQuestions = useMemo(() => {
    const list = ['ai', 'children', 'contact_retention'];
    if (selectedLaws.includes('dpdp_india') || selectedLaws.includes('india')) {
      list.push('grievance');
    }
    return list;
  }, [selectedLaws]);

  const totalQuestions = useMemo(() => {
    return step1SubQuestions.length + 3 + step5SubQuestions.length;
  }, [step1SubQuestions, step5SubQuestions]);

  const globalQuestionIndex = useMemo(() => {
    if (wizardStep === 1) return subQuestionIndex;
    if (wizardStep === 2) return step1SubQuestions.length;
    if (wizardStep === 3) return step1SubQuestions.length + 1;
    if (wizardStep === 4) return step1SubQuestions.length + 2;
    if (wizardStep === 5) return step1SubQuestions.length + 3 + subQuestionIndex;
    return 0;
  }, [wizardStep, subQuestionIndex, step1SubQuestions, step5SubQuestions]);

  const progressPercent = Math.round(((globalQuestionIndex + 1) / totalQuestions) * 100);

  // Data collected
  const [dataCollected, setDataCollected] = useState<DataCollectedOptions>({
    personalInfo: true,
    financialInfo: false,
    userContent: false,
    communicationData: false
  });

  // Passive telemetry
  const [passiveTelemetry, setPassiveTelemetry] = useState<PassiveTelemetryOptions>({
    serverLogs: true,
    deviceTechData: true,
    cookiesSession: true
  });

  // Data purposes
  const [dataPurposes, setDataPurposes] = useState<DataPurposesOptions>({
    serviceFulfillment: true,
    marketingEmails: false,
    personalizationAds: false,
    analyticsImprovement: true,
    securityFraud: true,
    sellShareData: false
  });

  // Selected services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Additional details
  const [dataRetentionMonths, setDataRetentionMonths] = useState<string>('24');
  const [dpoEmail, setDpoEmail] = useState<string>('privacy@example.com');
  const [customPolicyText, setCustomPolicyText] = useState<string>('');

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('loopy_sound_muted') === 'true';
    }
    return false;
  });

  const toggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('loopy_sound_muted', String(nextState));
    }
    if (nextState) {
      stopTypingAudio();
    }
  };

  // Smart guardrails effect
  useEffect(() => {
    const hasAnalytics = selectedServices.some(id => ['ga4', 'posthog', 'mixpanel'].includes(id));
    if (hasAnalytics) {
      setPassiveTelemetry(prev => {
        if (!prev.cookiesSession || !prev.deviceTechData) {
          return { ...prev, cookiesSession: true, deviceTechData: true };
        }
        return prev;
      });
    }

    const hasPayment = selectedServices.some(id => ['stripe', 'razorpay', 'lemonsqueezy'].includes(id));
    if (hasPayment) {
      setDataCollected(prev => {
        if (!prev.financialInfo) {
          return { ...prev, financialInfo: true };
        }
        return prev;
      });
    }
  }, [selectedServices]);

  useEffect(() => {
    setBusiness(prev => ({
      ...prev,
      effectiveDate: new Date().toISOString().split('T')[0]
    }));

    const unlockAudio = () => {
      getTypingAudio();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Smooth scroll focus to center active question box in viewport when question changes
  useEffect(() => {
    if (viewState === 'wizard' && questionBoxRef.current) {
      questionBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [wizardStep, subQuestionIndex, viewState]);

  // Always keep ref in sync with the latest handler so window listener never goes stale
  useEffect(() => {
    handleCurrentStepNextRef.current = handleCurrentStepNext;
  });

  // Auto-focus wizard container to steal focus away from Back button
  useEffect(() => {
    if (viewState === 'wizard' && wizardRef.current) {
      wizardRef.current.focus();
    }
  }, [viewState, wizardStep, subQuestionIndex]);

  // Global Enter key listener for wizard step progression
  useEffect(() => {
    if (viewState !== 'wizard') return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (e.defaultPrevented) return;
        e.preventDefault();
        setDirection(1);
        handleCurrentStepNextRef.current();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [viewState]);

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

  const selectedServiceObjects = useMemo(
    () => selectedServices
      .map(id => TECH_SERVICES_LIBRARY.find(service => service.id === id))
      .filter((service): service is TechService => Boolean(service)),
    [selectedServices]
  );

  const hasLiveUrl = business.urlMode === 'live' && Boolean(business.url.trim());
  const normalizedSiteUrl = hasLiveUrl
    ? (business.url.startsWith('http') ? business.url : `https://${business.url}`)
    : '';
  const policySurface = hasLiveUrl
    ? normalizedSiteUrl
    : business.policyLocation || (business.urlMode === 'app_store' ? 'your app store listing or in-app privacy screen' : 'your future website, docs, or app settings screen');
  const collectsAnyData = Object.values(dataCollected).some(Boolean) || Object.values(passiveTelemetry).some(Boolean);
  const highRiskSelections = [
    childrenPrivacy === 'yes' ? 'children or teen data' : '',
    aiPractices === 'custom_ai' ? 'custom model training' : '',
    dataPurposes.sellShareData ? 'sale or sharing of personal data' : '',
    dataPurposes.personalizationAds ? 'personalized advertising' : ''
  ].filter(Boolean);
  const baselineStatus = highRiskSelections.length > 0 ? 'Review needed' : collectsAnyData || selectedServices.length > 0 ? 'Operational baseline' : 'Zero-data baseline';
  const isContinueDisabled = useMemo(() => {
    if (wizardStep === 1) {
      const currentSub = step1SubQuestions[subQuestionIndex];
      if (currentSub === 'identity') {
        return !business.name.trim();
      }
      if (currentSub === 'stage' && business.urlMode === 'live') {
        return !business.url.trim();
      }
      return false;
    }
    if (wizardStep === 5) {
      const currentSub = step5SubQuestions[subQuestionIndex];
      if (currentSub === 'contact_retention') {
        return !business.contactEmail.trim();
      }
      if (currentSub === 'grievance') {
        return !grievanceName.trim() || !grievanceEmail.trim() || !grievanceAddress.trim();
      }
      return false;
    }
    return false;
  }, [wizardStep, subQuestionIndex, step1SubQuestions, step5SubQuestions, business.name, business.url, business.urlMode, business.contactEmail, grievanceName, grievanceEmail, grievanceAddress]);
  const scopeCoveredItems = [
    collectsAnyData ? 'Selected data categories and user-rights language' : 'Zero-data collection statement',
    selectedServiceObjects.length > 0 ? `${selectedServiceObjects.length} third-party service disclosure${selectedServiceObjects.length === 1 ? '' : 's'}` : 'No selected third-party services',
    selectedLaws.length > 0 ? 'Regional privacy addenda selected from your user locations' : 'General privacy baseline',
    'Contact and deletion request instructions'
  ];
  const scopeWatchItems = [
    !hasLiveUrl ? 'Final public URL and canonical policy path still need review once published.' : '',
    'Hosting providers may log IP addresses even when your app stores no account data.',
    selectedServiceObjects.some(service => service.category === 'ads') ? 'Ad pixels may require consent banners and opt-out workflows.' : '',
    highRiskSelections.length > 0 ? `Human review recommended for ${highRiskSelections.join(', ')}.` : '',
    'This is informational software output, not legal advice.'
  ].filter(Boolean);

  const generatedPolicy = useMemo(() => {
    const isLegal = viewMode === 'legal';
    const siteOrApp = {
      web: 'website and SaaS platform',
      app: 'mobile application',
      extension: 'browser extension / desktop application',
      multi: 'cross-platform ecosystem',
      website: 'website',
      both: 'website and mobile application'
    }[business.platformType] || 'digital product';
    
    const entityStr = business.companyName || (business.name ? `${business.name} Team` : 'Company');

    let md = '';

    if (isLegal) {
      md += `# Privacy Policy\n\n`;
      md += `**Effective Date:** ${business.effectiveDate}\n`;
      md += `**Last Updated:** ${business.effectiveDate}\n\n`;

      md += `## Overview & General Information\n`;
      md += `This Privacy Policy governs the manner in which **${entityStr}** ("we", "us", or "our") collects, uses, maintains, and discloses information collected from users ("you" or "User") of the **${siteOrApp}** accessible at ${hasLiveUrl ? `[${policySurface}](${policySurface})` : `**${policySurface}**`}.\n\n`;
      md += `This draft is maintained as a standard privacy baseline. You should review and re-generate this document whenever your tech stack, domain hosting, telemetry, authentication, payments, or legal entity structure changes.\n\n`;

      md += `## Information We Collect\n`;
      md += collectsAnyData
        ? `We collect several categories of information from and about users of our ${siteOrApp}, including:\n\n`
        : `Based on the selected configuration, this ${siteOrApp} does not collect account, payment, geolocation, telemetry, or children's personal data.\n\n`;

      if (dataCollected.personalInfo) {
        md += `- **Account Credentials:** Full name, email address, username, profile credentials, and secure password hashes.\n`;
      }
      if (dataCollected.financialInfo) {
        md += `- **Billing & Payment Details:** Transaction billing address, payment token credentials, and purchase history processed securely by our checkout systems.\n`;
      }
      if (dataCollected.userContent) {
        md += `- **User Generated Content:** Uploaded files, text inputs, prompts, custom code, and media assets provided directly to the service.\n`;
      }
      if (dataCollected.communicationData) {
        md += `- **Communication Logs:** Contact form messages, feedback entries, and emails sent directly to our support channels.\n`;
      }
      if (passiveTelemetry.serverLogs) {
        md += `- **Server & Hosting Logs:** Internet Protocol (IP) addresses, server request headers, client browser user-agents, request timestamps, and routing telemetry recorded automatically by hosting servers.\n`;
      }
      if (passiveTelemetry.deviceTechData) {
        md += `- **Device & Location Data:** Operating system version, browser model, display configurations, approximate city/country location derived from IP addresses, and device specs.\n`;
      }
      if (passiveTelemetry.cookiesSession) {
        md += `- **Cookies & Session Tokens:** LocalStorage preference states, secure session cookies, authentication JSON Web Tokens (JWTs), and cookies.\n`;
      }
      md += `\n`;

      md += `## How We Use Collected Information\n`;
      md += collectsAnyData
        ? `We utilize your information for the following legitimate business purposes:\n\n`
        : `If you contact us directly, we use the information you provide only to respond to your request and maintain basic administrative records.\n\n`;
      
      const needsServiceFulfillment = dataCollected.personalInfo || dataCollected.financialInfo || selectedServiceObjects.some(s => ['clerk', 'supabase', 'firebase', 'auth0', 'stripe', 'razorpay', 'lemonsqueezy'].includes(s.id));
      const needsAnalyticsImprovement = passiveTelemetry.deviceTechData || passiveTelemetry.cookiesSession || selectedServiceObjects.some(s => ['ga4', 'posthog', 'mixpanel'].includes(s.id));
      const needsMarketingEmails = selectedServiceObjects.some(s => ['mailchimp', 'resend', 'intercom'].includes(s.id));
      const needsPersonalizationAds = selectedServiceObjects.some(s => s.id === 'meta_pixel');

      if (needsServiceFulfillment) md += `- **Service Delivery:** Fulfilling order purchases, authentication processing, and maintaining user account profiles.\n`;
      if (needsAnalyticsImprovement) md += `- **Product Optimization:** Measuring visitor traffic, analyzing usage telemetry, diagnosing errors, and improving app performance.\n`;
      if (needsMarketingEmails) md += `- **Product Communication:** Sending periodic product updates, announcements, and newsletters (with clear one-click unsubscribe links).\n`;
      md += `- **Security & Abuse Prevention:** Monitoring server logs, detecting bots, preventing DDoS attacks, and identifying transaction fraud.\n`;
      if (needsPersonalizationAds) md += `- **Ad Personalization:** Displaying context-aware ads and analyzing user interactions with promotional content.\n`;
      md += `\n`;

      md += `## Third-Party Services & Data Disclosures\n`;
      if (selectedServiceObjects.length > 0) {
        md += `We do not sell your personal data. However, we may share necessary data with trusted third-party service providers to power selected platform features. Below is a disclosure of services integrated into our ${siteOrApp}:\n\n`;
        selectedServiceObjects.forEach(service => {
          md += `### ${service.name}\n`;
          md += `${service.clauseText}\n`;
          md += `*Privacy Policy:* [Read ${service.name} Privacy Policy](${service.privacyUrl})\n\n`;
        });
      } else {
        md += `Based on the selected inputs, no third-party tracking, payment, advertising, authentication, newsletter, or support services are currently enabled.\n\n`;
      }

      md += `## Cookies & Tracking Technologies\n`;
      md += passiveTelemetry.cookiesSession || selectedServiceObjects.length > 0
        ? `Our ${siteOrApp} uses cookies, local storage session tokens, and telemetry scripts to manage authentication sessions, remember preferences, measure analytics, and support third-party integrations. You can configure your browser to decline cookies, although some parts of the service may cease to function correctly as a result.\n\n`
        : `Our ${siteOrApp} does not use tracking cookies, analytics pixels, or session trackers. Essential local storage tokens may still be used if necessary to support basic interface preferences or local state preservation.\n\n`;

      if (aiPractices !== 'no_ai') {
        md += `## AI & Machine Learning Practices\n`;
        if (aiPractices === 'third_party_ai') {
          md += `Our ${siteOrApp} utilizes third-party artificial intelligence API integrations (such as OpenAI and Anthropic) to power smart features. Any prompts, inputs, or user content shared with these APIs are processed under zero-retention enterprise terms and are not used by the provider to train public foundation models.\n\n`;
        } else if (aiPractices === 'custom_ai') {
          md += `Our ${siteOrApp} trains proprietary custom machine learning models using anonymized telemetry and user generated content. You can explicitly opt-out of model training at any time by configuring your account settings or emailing **${business.contactEmail}**.\n\n`;
        }
      }

      md += `## Children's Privacy\n`;
      if (childrenPrivacy === 'yes') {
        md += `Our ${siteOrApp} may be accessed by children under the age of 13/16. We comply with COPPA (Children's Online Privacy Protection Act) and GDPR-K regulations. We do not knowingly collect personal data from minors without verified parental consent. If you believe we have collected data from a child without consent, please contact us immediately.\n\n`;
      } else {
        md += `Our ${siteOrApp} is intended strictly for general audiences aged 13+ (or 16+ in some European jurisdictions). We do not knowingly collect or solicit personal data from children under these age limits. If we discover that we have inadvertently collected data from a minor, we will delete it immediately.\n\n`;
      }

      md += `## Specific Jurisdictional Privacy Rights\n\n`;

      if (selectedLaws.includes('gdpr') || selectedLaws.includes('eu_uk')) {
        md += `### European Union & UK General Data Protection Regulation (GDPR)\n`;
        md += `If you reside in the European Union or United Kingdom, you hold the following rights under GDPR:\n`;
        md += `- **Right of Access:** Obtain confirmation of data processing and request a copy of personal data.\n`;
        md += `- **Right to Rectification:** Request correction of inaccurate or incomplete personal records.\n`;
        md += `- **Right to Erasure ("Right to be Forgotten"):** Request deletion of your personal records.\n`;
        md += `- **Right to Restrict & Object:** Object to direct marketing or processing based on legitimate interests.\n`;
        md += `- **Right to Data Portability:** Receive your personal data in a structured, machine-readable format.\n`;
        md += `To exercise your GDPR rights, contact our Data Protection Officer at: **${dpoEmail}** or **${business.contactEmail || 'privacy@example.com'}**.\n\n`;
      }

      if (selectedLaws.includes('ccpa') || selectedLaws.includes('us')) {
        md += `### California Consumer Privacy Act (CCPA / CPRA) & US State Laws\n`;
        md += `California residents and US consumers possess specific rights under state privacy statutes:\n`;
        md += `- **Right to Know & Access:** Request disclosure of categories and specific pieces of personal information collected.\n`;
        md += `- **Right to Opt-Out:** Request that your personal information not be sold or shared for cross-context behavioral advertising.\n`;
        md += `- **Right to Non-Discriminrimination:** We will not discriminate against you for exercising your legal privacy rights.\n`;
        md += `To submit a California CCPA request or opt-out, email **${business.contactEmail || 'privacy@example.com'}** with the subject line "CCPA Data Request".\n\n`;
      }

      if (selectedLaws.includes('pipeda') || selectedLaws.includes('ca')) {
        md += `### Canadian Privacy Rights (PIPEDA)\n`;
        md += `Canadian residents may challenge our compliance with PIPEDA principles by filing an inquiry with our designated Privacy Officer at **${business.contactEmail || 'privacy@example.com'}**.\n\n`;
      }

      if (selectedLaws.includes('dpdp_india') || selectedLaws.includes('india')) {
        md += `### India Digital Personal Data Protection Act (DPDP Act 2023)\n`;
        md += `Indian residents possess the right to seek a summary of personal data processed, request correction and erasure, and register grievances with our Data Fiduciary at **${business.contactEmail || 'privacy@example.com'}**.\n\n`;
        if (grievanceName) {
          md += `**Designated Grievance Officer:**\n`;
          md += `- **Name:** ${grievanceName}\n`;
          md += `- **Email:** [${grievanceEmail}](mailto:${grievanceEmail})\n`;
          md += `- **Address:** ${grievanceAddress}\n\n`;
        }
      }

      md += `## Data Retention & Security Measures\n`;
      if (dataRetentionMonths === 'delete_request') {
        md += `We retain your personal data for as long as your account remains active or until we receive a formal account deletion request. Basic operational logs and invoice transaction details may be archived longer to comply with local financial tax auditing and legal regulations.\n\n`;
      } else {
        md += `We store personal data for up to **${dataRetentionMonths} months** or as long as necessary to satisfy accounting, legal, or administrative obligations. We enforce TLS encryption, firewalls, and restricted administrative access to safeguard data.\n\n`;
      }

      md += `## Contact Us\n`;
      md += `If you have questions, feedback, or data deletion requests regarding this policy, please reach out:\n\n`;
      md += `- **Entity:** ${entityStr}\n`;
      if (business.companyAddress) {
        md += `- **Address:** ${business.companyAddress}\n`;
      }
      md += `- **Contact Email:** [${business.contactEmail || 'privacy@example.com'}](mailto:${business.contactEmail || 'privacy@example.com'})\n`;
      md += `\n**LoopyHQ Baseline Notice:** Generated as a privacy-policy starting point, not a substitute for legal review. Re-generate this policy if you add analytics, tracking SDKs, payment processors, hosting telemetry, databases, or advertising tools.\n`;

    } else {
      md += `# Privacy Policy — In Short\n\n`;
      md += `*This is a clear, human-readable summary of how **${entityStr}** treats privacy for **${policySurface}**.*\n\n`;

      md += `### Our Privacy Promise\n`;
      md += collectsAnyData
        ? `We believe in total transparency. We only ask for information we genuinely need to run and protect the service.\n\n`
        : `Based on the current selected setup, we do not intentionally collect account, payment, telemetry, location, or children data.\n\n`;

      md += `### What We Collect & Why\n`;
      if (dataCollected.personalInfo) md += `- **Account Credentials:** We store your email and secure credentials to manage your account and secure your sessions.\n`;
      if (dataCollected.financialInfo) md += `- **Billing Details:** Financial checkout details go directly to certified processors (like Stripe). We never see or store your full card credentials.\n`;
      if (dataCollected.userContent) md += `- **User Content:** We host the files, prompts, and custom code you upload to run the service features.\n`;
      if (dataCollected.communicationData) md += `- **Support History:** We keep contact form tickets and emails to troubleshoot errors and help you.\n`;
      if (passiveTelemetry.serverLogs || passiveTelemetry.deviceTechData || passiveTelemetry.cookiesSession) {
        md += `- **Technical Telemetry:** We record basic server logs, IP addresses, and cookies to keep the app secure, fast, and bug-free.\n`;
      }
      md += `\n`;

      md += `### Third-Party Services\n`;
      if (selectedServiceObjects.length > 0) {
        selectedServiceObjects.forEach(service => {
          md += `- **${service.name}:** ${service.plainSummary}\n`;
        });
      } else {
        md += `- No external tracking, billing, or ads APIs are enabled.\n`;
      }
      md += `\n`;

      if (aiPractices !== 'no_ai') {
        md += `### AI Features\n`;
        if (aiPractices === 'third_party_ai') {
          md += `- **AI Services:** We pass inputs to AI APIs (like OpenAI) under zero-retention rules. They do not train public models on your data.\n`;
        } else {
          md += `- **Model Training:** We train custom models on usage telemetry. You can opt-out at any time in settings.\n`;
        }
        md += `\n`;
      }

      md += `### You Are in Control\n`;
      md += `You own your personal records. You can ask us to access, update, or completely delete your data at any time by emailing **${business.contactEmail || 'privacy@example.com'}**.\n\n`;

      md += `### Questions?\n`;
      md += `Reach out at **${business.contactEmail || 'privacy@example.com'}** and we will respond promptly.\n`;
    }

    return md;
  }, [business, selectedLaws, dataCollected, passiveTelemetry, selectedServiceObjects, dataRetentionMonths, dpoEmail, viewMode, hasLiveUrl, policySurface, collectsAnyData, aiPractices, childrenPrivacy, grievanceName, grievanceEmail, grievanceAddress, entityType]);

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

  const generatedPrivacyCardHtml = useMemo(() => {
    const entity = escapeHtml(business.companyName || business.name || 'Your product');
    const contact = escapeHtml(business.contactEmail || 'privacy@example.com');
    const surface = escapeHtml(policySurface);
    const lawLabels = selectedLaws.length > 0
      ? selectedLaws.map(id => LAW_LABELS[id] || id.toUpperCase()).slice(0, 4).join(', ')
      : 'Global baseline';
    const serviceLabels = showServicesOnCard && selectedServiceObjects.length > 0
      ? selectedServiceObjects.map(service => escapeHtml(service.name)).join(', ')
      : 'No third-party services selected';
    const theme = {
      midnight: {
        bg: '#020617',
        surface: '#0f172a',
        border: '#1e293b',
        text: '#fafaf9',
        muted: '#cbd5e1',
        accent: '#34d399',
        chip: '#064e3b'
      },
      paper: {
        bg: '#fafaf9',
        surface: '#ffffff',
        border: '#d6d3d1',
        text: '#0f172a',
        muted: '#475569',
        accent: '#0f766e',
        chip: '#ccfbf1'
      },
      emerald: {
        bg: '#022c22',
        surface: '#064e3b',
        border: '#0f766e',
        text: '#ecfdf5',
        muted: '#bbf7d0',
        accent: '#a7f3d0',
        chip: '#065f46'
      }
    }[embedTheme];

    return `<!--
  LOOPYHQ PRIVACY CARD
  Baseline: ${baselineStatus}.
  Re-generate this card whenever your data handling, third-party integrations, or legal structure change.
-->
<section class="loopyhq-privacy-card" aria-label="Privacy summary for ${entity}">
  <style>
    .loopyhq-privacy-card {
      --lhq-bg: ${theme.bg};
      --lhq-surface: ${theme.surface};
      --lhq-border: ${theme.border};
      --lhq-text: ${theme.text};
      --lhq-muted: ${theme.muted};
      --lhq-accent: ${theme.accent};
      --lhq-chip: ${theme.chip};
      max-width: 720px;
      border: 1px solid var(--lhq-border);
      border-radius: 20px;
      background: var(--lhq-surface);
      color: var(--lhq-text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      padding: 28px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      position: relative;
    }
    .loopyhq-privacy-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--lhq-accent), transparent);
      opacity: 0.3;
    }
    .loopyhq-privacy-card * { box-sizing: border-box; }
    .loopyhq-privacy-card__header { display: flex; justify-content: space-between; gap: 20px; align-items: flex-start; margin-bottom: 24px; }
    .loopyhq-privacy-card__kicker { color: var(--lhq-accent); font-size: 11px; font-weight: 900; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px; }
    .loopyhq-privacy-card h2 { font-size: 26px; line-height: 1.2; margin: 0; letter-spacing: -0.5px; font-weight: 700; }
    .loopyhq-privacy-card__status {
      background: linear-gradient(135deg, var(--lhq-chip) 0%, var(--lhq-border) 100%);
      color: var(--lhq-text);
      border: 1px solid var(--lhq-border);
      border-radius: 12px;
      padding: 8px 12px;
      font-size: 11px;
      font-weight: 900;
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .loopyhq-privacy-card__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; margin-bottom: 6px; }
    .loopyhq-privacy-card__item {
      border: 1px solid var(--lhq-border);
      border-radius: 14px;
      padding: 16px;
      background: var(--lhq-bg);
      transition: all 200ms ease;
    }
    .loopyhq-privacy-card__item:hover { border-color: var(--lhq-accent); background: linear-gradient(135deg, var(--lhq-bg) 0%, var(--lhq-surface) 100%); }
    .loopyhq-privacy-card__label { color: var(--lhq-muted); font-size: 10px; font-weight: 900; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    .loopyhq-privacy-card__value { color: var(--lhq-text); font-size: 14px; line-height: 1.5; margin: 0; font-weight: 500; }
    .loopyhq-privacy-card__footer { display: flex; justify-content: space-between; gap: 16px; align-items: center; border-top: 1px solid var(--lhq-border); margin-top: 20px; padding-top: 16px; color: var(--lhq-muted); font-size: 11px; line-height: 1.5; }
    .loopyhq-privacy-card a { color: var(--lhq-accent); font-weight: 700; text-decoration: none; border-bottom: 1px dotted currentColor; }
    .loopyhq-privacy-card a:hover { border-bottom-style: solid; }
    @media (max-width: 560px) {
      .loopyhq-privacy-card { padding: 20px; }
      .loopyhq-privacy-card h2 { font-size: 22px; }
      .loopyhq-privacy-card__header, .loopyhq-privacy-card__footer { flex-direction: column; align-items: flex-start; }
      .loopyhq-privacy-card__grid { grid-template-columns: 1fr; }
    }
  </style>
  <div class="loopyhq-privacy-card__header">
    <div>
      <p class="loopyhq-privacy-card__kicker">Privacy Summary</p>
      <h2>${entity}</h2>
    </div>
    <span class="loopyhq-privacy-card__status">${escapeHtml(baselineStatus)}</span>
  </div>
  <div class="loopyhq-privacy-card__grid">
    <div class="loopyhq-privacy-card__item">
      <p class="loopyhq-privacy-card__label">Policy Surface</p>
      <p class="loopyhq-privacy-card__value">${surface}</p>
    </div>
    <div class="loopyhq-privacy-card__item">
      <p class="loopyhq-privacy-card__label">Frameworks</p>
      <p class="loopyhq-privacy-card__value">${escapeHtml(lawLabels)}</p>
    </div>
    <div class="loopyhq-privacy-card__item">
      <p class="loopyhq-privacy-card__label">Third Parties</p>
      <p class="loopyhq-privacy-card__value">${serviceLabels}</p>
    </div>
    <div class="loopyhq-privacy-card__item">
      <p class="loopyhq-privacy-card__label">Data Requests</p>
      <p class="loopyhq-privacy-card__value">Email ${contact} for access, deletion, correction, or opt-out requests.</p>
    </div>
  </div>
  <div class="loopyhq-privacy-card__footer">
    <span>Generated as a baseline summary. Review before publishing.</span>
    <a href="https://loopyhq.com/tools/privacy-policy-generator" target="_blank" rel="noopener noreferrer">Created by LoopyHQ</a>
  </div>
</section>`;
  }, [business, policySurface, selectedLaws, selectedServiceObjects, showServicesOnCard, embedTheme, baselineStatus]);

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
    if (subQuestionIndex < step1SubQuestions.length - 1) {
      setSubQuestionIndex(subQuestionIndex + 1);
    } else {
      setWizardStep(2);
      setSubQuestionIndex(0);
    }
  };

  const handleChapter1Back = () => {
    setDirection(-1);
    if (subQuestionIndex > 0) {
      setSubQuestionIndex(subQuestionIndex - 1);
    }
  };

  // Unified back handler for wizard navigation
  const handleWizardBack = () => {
    setDirection(-1);
    if (wizardStep === 1 && subQuestionIndex > 0) {
      setSubQuestionIndex(subQuestionIndex - 1);
    } else if (wizardStep === 2) {
      setWizardStep(1);
      setSubQuestionIndex(step1SubQuestions.length - 1);
    } else if (wizardStep === 3) {
      setWizardStep(2);
      setSubQuestionIndex(0);
    } else if (wizardStep === 4) {
      setWizardStep(3);
      setSubQuestionIndex(0);
    } else if (wizardStep === 5 && subQuestionIndex > 0) {
      setSubQuestionIndex(subQuestionIndex - 1);
    } else if (wizardStep === 5 && subQuestionIndex === 0) {
      setWizardStep(4);
      setSubQuestionIndex(0);
    }
  };

  const handleChapter5Next = () => {
    if (subQuestionIndex < step5SubQuestions.length - 1) {
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

  const handleCurrentStepNext = () => {
    if (wizardStep === 1) {
      const currentSub = step1SubQuestions[subQuestionIndex];
      if (currentSub === 'identity' && !business.name.trim()) return;
      if (currentSub === 'stage' && business.urlMode === 'live' && !business.url.trim()) return;
      handleChapter1Next();
    } else if (wizardStep === 2) {
      setWizardStep(3);
      setSubQuestionIndex(0);
    } else if (wizardStep === 3) {
      setWizardStep(4);
      setSubQuestionIndex(0);
    } else if (wizardStep === 4) {
      setWizardStep(5);
      setSubQuestionIndex(0);
    } else if (wizardStep === 5) {
      const currentSub = step5SubQuestions[subQuestionIndex];
      if (currentSub === 'contact_retention' && !business.contactEmail.trim()) return;
      handleChapter5Next();
    }
  };

  const handleExitWizard = () => {
    stopTypingAudio();
    if (typeof window !== 'undefined') {
      window.location.assign('/tools/privacy-policy-generator');
      return;
    }
    setViewState('landing');
  };

  const handleCopyMarkdown = () => {
    const textToCopy = isEditable && customPolicyText ? customPolicyText : generatedPolicy;
    copyToClipboard(textToCopy, 'Copied Markdown to clipboard!');
  };

  const handleCopyHtml = () => {
    copyToClipboard(generatedHtml, 'Copied HTML to clipboard!');
  };

  const handleCopyPrivacyCard = () => {
    copyToClipboard(generatedPrivacyCardHtml, 'Copied Privacy Card embed!');
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
    <div id="generator-workspace" className="w-full max-w-5xl mx-auto font-sans" ref={questionBoxRef}>

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
              GDPR &bull; CCPA &bull; PIPEDA &bull; DPDP Baseline
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-50 tracking-tight leading-tight mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Generate Your Privacy Policy in Seconds
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal mb-8">
              Create a privacy policy baseline draft and embeddable summary card for your website or app. 100% free, 100% in your browser with zero server data collection.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 my-8">
              <a href="/tools/privacy-policy-generator/create" className="block">
                <BorderGlow
                  edgeSensitivity={30}
                  glowColor="160 84 65"
                  backgroundColor="#0f172a"
                  borderRadius={20}
                  glowRadius={35}
                  glowIntensity={1.2}
                  coneSpread={25}
                  animated={true}
                  colors={['#34d399', '#38bdf8', '#a855f7']}
                  className="group cursor-pointer transition-all duration-700 ease-out hover:scale-[1.018]"
                >
                  <div className="px-10 py-4 sm:py-5 flex items-center justify-center gap-3">
                    <span className="text-base sm:text-lg font-extrabold text-stone-50 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      Start Generating Policy
                    </span>
                    <span className="text-emerald-400 font-bold text-xl transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </div>
                </BorderGlow>
              </a>
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
              <h4 className="font-bold text-sm text-stone-50 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Regional Addenda</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Pre-configured baseline clauses for EU GDPR, California CCPA/CPRA, Canada PIPEDA, and India DPDP Act.</p>
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
        <div
          className="min-h-[70vh] sm:min-h-[78vh] flex flex-col justify-center my-2 outline-none"
          tabIndex={-1}
          ref={wizardRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCurrentStepNext();
            }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handleExitWizard}
              className="text-xs font-bold text-slate-500 hover:text-stone-50 transition-colors inline-flex items-center gap-1 interactive-press rounded-lg px-3 py-1 hover:bg-slate-900/50"
            >
              ← Exit
            </button>

            <button
              type="button"
              onClick={toggleSound}
              className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 interactive-press ${
                isMuted
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  : 'bg-slate-900 border-slate-700 text-stone-200 hover:border-emerald-500/50 hover:shadow-[0_0_12px_rgba(52,211,153,0.15)]'
              }`}
              title={isMuted ? 'Unmute typing sound' : 'Mute typing sound'}
            >
              {isMuted ? (
                <>
                  {/* Speaker muted / off */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-slate-500">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                  <span>Sound Off</span>
                </>
              ) : (
                <>
                  {/* Speaker with sound waves */}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-emerald-400">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                  <span className="text-stone-200">Sound On</span>
                </>
              )}
            </button>
          </div>

          {/* ── PROGRESS BAR ── */}
          <div className="relative h-[2px] bg-slate-800/80 rounded-full overflow-hidden mb-8">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
              style={{ background: 'linear-gradient(90deg, #059669, #34d399)', width: `${progressPercent}%` }}
            />
          </div>

          {/* ── QUESTION FLOW ── */}
          <div key={`${wizardStep}-${subQuestionIndex}`} className="w-full">
            <div className="max-w-2xl mx-auto min-h-[380px] flex flex-col justify-between">
                <div>

                  {/* ── CH1 Q1: Product Type ── */}
                  {wizardStep === 1 && step1SubQuestions[subQuestionIndex] === 'type' && (
                    <div>
                      <TypewriterHeading text="What type of product are you generating this policy for?" isMuted={isMuted} />
                      <div className="grid grid-cols-1 gap-3 mt-6">
                        {[
                          { type: 'web', title: 'Web Application / SaaS', desc: 'SaaS platforms, web portals, landing pages, blogs.', icon: 'web' },
                          { type: 'app', title: 'Mobile App', desc: 'Native iOS or Android applications listed in app stores.', icon: 'app' },
                          { type: 'extension', title: 'Chrome Extension / Desktop App', desc: 'Browser extensions, desktop plugins, local desktop clients.', icon: 'extension' },
                          { type: 'multi', title: 'Multi-platform Ecosystem', desc: 'Ecosystem spanning web apps, mobile apps, and browser extensions.', icon: 'multi' }
                        ].map(item => (
                          <div
                            key={item.type}
                            onClick={() => setBusiness({ ...business, platformType: item.type as any })}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex items-center justify-between gap-4 ${
                              business.platformType === item.type
                                ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                business.platformType === item.type
                                  ? 'bg-stone-50/10 border border-stone-50/20 text-stone-50'
                                  : 'bg-slate-900 border border-slate-800/80 text-slate-400'
                              }`}>
                                {renderTypeIcon(item.icon, "w-5 h-5")}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.title}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
                              </div>
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

                  {/* ── CH1 Q2: Identity & Legal Entity ── */}
                  {wizardStep === 1 && step1SubQuestions[subQuestionIndex] === 'identity' && (
                    <div>
                      <TypewriterHeading text="What is the name of your product and who operates it?" isMuted={isMuted} />
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Product Name</label>
                          <input
                            type="text"
                            autoFocus
                            value={business.name}
                            onChange={e => setBusiness({ ...business, name: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 focus:outline-none focus:border-slate-600 font-medium"
                            placeholder="e.g. Acme SaaS"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Operating Entity Status</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setEntityType('unregistered');
                                setBusiness({ ...business, companyName: '' });
                              }}
                              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                                entityType === 'unregistered'
                                  ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              <h4 className="font-bold text-xs text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>Not a registered company yet</h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">Individual, Sole Proprietor, Open Source project.</p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setEntityType('registered')}
                              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                                entityType === 'registered'
                                  ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              <h4 className="font-bold text-xs text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>Registered Legal Entity</h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">LLC, C-Corp, Pvt Ltd, Inc., etc.</p>
                            </button>
                          </div>
                        </div>

                        {entityType === 'registered' && (
                          <div className="animate-fadeIn">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registered Company Name</label>
                            <input
                              type="text"
                              value={business.companyName}
                              onChange={e => setBusiness({ ...business, companyName: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 focus:outline-none focus:border-slate-600 font-medium"
                              placeholder="e.g. Acme Studio LLC"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── CH1 Q2a: Country of Registration ── */}
                  {wizardStep === 1 && step1SubQuestions[subQuestionIndex] === 'country' && (
                    <div>
                      <TypewriterHeading text={business.companyName ? `In which country is ${business.companyName} legally registered?` : "Where is your business legally registered?"} isMuted={isMuted} />
                      <p className="text-xs text-slate-400 leading-relaxed font-medium mt-2 mb-6">This determines the baseline legal jurisdiction that governs your corporate obligations.</p>
                      <div className="mt-6">
                        <CustomDropdown
                          value={business.businessCountry}
                          onChange={val => handleCountryChange(val)}
                          options={COUNTRY_OPTIONS}
                          onEnter={() => { setDirection(1); handleChapter1Next(); }}
                        />
                        <div className="inline-flex items-center gap-1.5 mt-2">
                          <kbd className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-[11px] font-mono font-semibold shadow-sm">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>
                            Enter
                          </kbd>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── CH1 Q3: Product Stage & Access Point ── */}
                  {wizardStep === 1 && step1SubQuestions[subQuestionIndex] === 'stage' && (
                    <div>
                      <TypewriterHeading text="Where can users currently access your product?" isMuted={isMuted} />
                      <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { mode: 'live', title: 'Live Web URL', desc: 'Already published. Reference the actual canonical URL.', icon: 'live' },
                            { mode: 'app_store', title: 'App Store Listing Only', desc: 'iOS App Store, Google Play, or extension store listing.', icon: 'app_store' },
                            { mode: 'planned', title: 'Unreleased / Stealth / Pre-Launch', desc: 'Not live yet, or stealth launch page only.', icon: 'planned' }
                          ].map(option => (
                            <button
                              key={option.mode}
                              type="button"
                              onClick={() => setBusiness({
                                ...business,
                                urlMode: option.mode as BusinessDetails['urlMode'],
                                url: option.mode === 'live' ? business.url : '',
                                policyLocation: option.mode === 'planned' ? (business.policyLocation || '/privacy') : business.policyLocation
                              })}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex items-center justify-between gap-4 text-left w-full ${
                                business.urlMode === option.mode
                                  ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                                  business.urlMode === option.mode
                                    ? 'bg-stone-50/10 border border-stone-50/20 text-stone-50'
                                    : 'bg-slate-900 border border-slate-800/80 text-slate-400'
                                }`}>
                                  {renderStageIcon(option.icon, "w-5 h-5")}
                                </div>
                                <div>
                                  <span className="block font-bold text-sm text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>{option.title}</span>
                                  <span className="block text-xs text-slate-400 leading-relaxed mt-0.5">{option.desc}</span>
                                </div>
                              </div>
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                business.urlMode === option.mode ? 'bg-stone-50 text-slate-950' : 'border border-slate-700 bg-slate-950'
                              }`}>
                                {business.urlMode === option.mode && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </span>
                            </button>
                          ))}
                        </div>

                        {business.urlMode === 'live' && (
                          <div className="animate-fadeIn">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Canonical Website URL</label>
                            <input
                              type="url"
                              autoFocus
                              value={business.url}
                              onChange={e => setBusiness({ ...business, url: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 focus:outline-none focus:border-slate-600 font-medium"
                              placeholder="https://example.com"
                            />
                          </div>
                        )}

                        {business.urlMode === 'app_store' && (
                          <div className="animate-fadeIn">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">App Store Link or Bundle ID</label>
                            <input
                              type="text"
                              autoFocus
                              value={business.url}
                              onChange={e => setBusiness({ ...business, url: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 focus:outline-none focus:border-slate-600 font-medium"
                              placeholder="e.g. https://apps.apple.com/app/id... or com.acme.app"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── CH1 Q4: Hosting Location ── */}
                  {wizardStep === 1 && step1SubQuestions[subQuestionIndex] === 'hosting' && (
                    <div>
                      <TypewriterHeading text={business.urlMode === 'app_store' ? "Where will users access this privacy policy?" : "Where will the privacy policy be hosted?"} isMuted={isMuted} />
                      <p className="text-xs text-slate-400 leading-relaxed font-medium mt-2 mb-6">Let users know where they can view the full policy.</p>
                      <div className="mt-6">
                        <input
                          type="text"
                          autoFocus
                          value={business.policyLocation}
                          onChange={e => setBusiness({ ...business, policyLocation: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-lg text-stone-50 focus:outline-none focus:border-slate-600 mb-3 font-medium"
                          placeholder="e.g. /privacy"
                        />
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="text-[11px] font-mono text-slate-500 mr-1 select-none">Suggestions:</span>
                          {business.urlMode === 'app_store' ? (
                            <>
                              <LuxuryQuickOption label="In-app Settings (/privacy)" isSelected={business.policyLocation === '/privacy'} onClick={() => setBusiness({ ...business, policyLocation: '/privacy' })} />
                              <LuxuryQuickOption label="App Store Description" isSelected={business.policyLocation === 'App Store listing'} onClick={() => setBusiness({ ...business, policyLocation: 'App Store listing' })} />
                            </>
                          ) : (
                            <>
                              <LuxuryQuickOption label="Web Route (/privacy)" isSelected={business.policyLocation === '/privacy'} onClick={() => setBusiness({ ...business, policyLocation: '/privacy' })} />
                              <LuxuryQuickOption label="GitHub README" isSelected={business.policyLocation === 'GitHub README'} onClick={() => setBusiness({ ...business, policyLocation: 'GitHub README' })} />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
 
                   {/* ── CH2: User Territory & Regulatory Scope ── */}
                  {wizardStep === 2 && (
                    <div>
                      <TypewriterHeading text="Where are your primary users located?" isMuted={isMuted} />
                      <p className="text-xs text-slate-400 leading-relaxed font-medium mt-2 mb-6">Select all jurisdictions where you have significant traffic. Relevant privacy compliance sections will be auto-generated.</p>
                      <div className="space-y-3">
                        {[
                          { id: 'gdpr', title: 'European Union & UK', badge: 'GDPR / UK DPA', desc: 'Triggers GDPR/UK DPA 2018 addenda, data processing rights, and lawful basis disclosures.', icon: 'eu' },
                          { id: 'ccpa', title: 'United States & California', badge: 'CCPA / CPRA', desc: 'Triggers CCPA/CPRA & US State Privacy disclosures including user access, correction, and opt-out rights.', icon: 'us' },
                          { id: 'dpdp_india', title: 'India', badge: 'DPDP Act 2023', desc: 'Triggers Digital Personal Data Protection Act compliance, consent management, and Grievance Officer details.', icon: 'in' },
                          { id: 'global', title: 'Global / General Audience', badge: 'International Baseline', desc: 'Applies general baseline privacy disclosures and universal data handling standards.', icon: 'global' }
                        ].map(region => {
                          const isSelected = selectedLaws.includes(region.id);
                          return (
                            <div
                              key={region.id}
                              onClick={() => {
                                if (isSelected) setSelectedLaws(selectedLaws.filter(id => id !== region.id));
                                else setSelectedLaws([...selectedLaws, region.id]);
                              }}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex items-center justify-between gap-4 ${
                                isSelected ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md' : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all font-bold text-xs ${
                                  isSelected
                                    ? 'bg-stone-50/10 border border-stone-50/20 text-stone-50'
                                    : 'bg-slate-900 border border-slate-800/80 text-slate-400'
                                }`}>
                                  {renderRegionIcon(region.icon, "w-5 h-5")}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="font-bold text-sm text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>{region.title}</h4>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">{region.badge}</span>
                                  </div>
                                  <p className="text-xs text-slate-400 leading-relaxed">{region.desc}</p>
                                </div>
                              </div>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                isSelected ? 'bg-stone-50 text-slate-950' : 'border border-slate-700 bg-slate-950'
                              }`}>
                                {isSelected && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── CH3: Data Footprint & Passive Infrastructure ── */}
                  {wizardStep === 3 && (
                    <div>
                      <TypewriterHeading text="What user data does your product handle?" isMuted={isMuted} />
                      <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">Select active collections (provided directly by users) and passive telemetry (collected by your tech stack).</p>
                      
                      <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="text-[11px] font-mono text-slate-500 mr-1 select-none">Quick Presets:</span>
                        <LuxuryQuickOption
                          label="Zero Data / Stateless"
                          isSelected={!Object.values(dataCollected).some(Boolean) && !Object.values(passiveTelemetry).some(Boolean)}
                          onClick={() => {
                            setDataCollected({ personalInfo: false, financialInfo: false, userContent: false, communicationData: false });
                            setPassiveTelemetry({ serverLogs: false, deviceTechData: false, cookiesSession: false });
                            setSelectedServices([]);
                          }}
                        />
                        <LuxuryQuickOption
                          label="Standard SaaS Stack"
                          isSelected={dataCollected.personalInfo && passiveTelemetry.cookiesSession && passiveTelemetry.deviceTechData}
                          onClick={() => {
                            setDataCollected({ personalInfo: true, financialInfo: false, userContent: false, communicationData: true });
                            setPassiveTelemetry({ serverLogs: true, deviceTechData: true, cookiesSession: true });
                          }}
                        />
                        <LuxuryQuickOption
                          label="E-Commerce / Paid Product"
                          isSelected={dataCollected.personalInfo && dataCollected.financialInfo && passiveTelemetry.cookiesSession}
                          onClick={() => {
                            setDataCollected({ personalInfo: true, financialInfo: true, userContent: false, communicationData: true });
                            setPassiveTelemetry({ serverLogs: true, deviceTechData: true, cookiesSession: true });
                          }}
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Active Data Collection (User Provided)</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                              { key: 'personalInfo', title: 'Account Credentials', desc: 'Email, username, password hashes.' },
                              { key: 'financialInfo', title: 'Billing & Payment Details', desc: 'Credit card details, billing address, tax IDs.' },
                              { key: 'userContent', title: 'User Generated Content', desc: 'Uploaded files, prompts, custom code, media.' },
                              { key: 'communicationData', title: 'Communication Data', desc: 'Support chat logs, contact form messages.' }
                            ].map(item => {
                              const isChecked = dataCollected[item.key as keyof DataCollectedOptions];
                              return (
                                <div
                                  key={item.key}
                                  onClick={() => setDataCollected({ ...dataCollected, [item.key]: !isChecked })}
                                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex flex-col justify-between ${
                                    isChecked ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md' : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-bold text-xs text-stone-50">{item.title}</h5>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                      isChecked ? 'bg-stone-50 text-slate-950' : 'border border-slate-700 bg-slate-950'
                                    }`}>
                                      {isChecked && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Passive Technical Telemetry (Infrastructure & Logs)</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {[
                              { key: 'serverLogs', title: 'Server & Hosting Logs', desc: 'IP addresses, request timestamps, user-agents.' },
                              { key: 'deviceTechData', title: 'Device & Location Data', desc: 'Approximate location via IP, browser hardware specs.' },
                              { key: 'cookiesSession', title: 'Cookies & Session Tokens', desc: 'LocalStorage, session cookies, auth tokens.' }
                            ].map(item => {
                              const isChecked = passiveTelemetry[item.key as keyof PassiveTelemetryOptions];
                              return (
                                <div
                                  key={item.key}
                                  onClick={() => setPassiveTelemetry({ ...passiveTelemetry, [item.key]: !isChecked })}
                                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex flex-col justify-between ${
                                    isChecked ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md' : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <h5 className="font-bold text-xs text-stone-50">{item.title}</h5>
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                      isChecked ? 'bg-stone-50 text-slate-950' : 'border border-slate-700 bg-slate-950'
                                    }`}>
                                      {isChecked && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── CH4: Tech Stack Integration ── */}
                  {wizardStep === 4 && (
                    <div>
                      <TypewriterHeading text="Which third-party services are wired into your app?" isMuted={isMuted} />
                      <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">Select all integration SDKs. Data disclosure clauses will be auto-generated.</p>
                      
                      <div className="space-y-4">
                        {[
                          { category: 'auth', title: 'Auth & Users', services: ['clerk', 'supabase', 'firebase', 'auth0'] },
                          { category: 'payment', title: 'Payments', services: ['stripe', 'razorpay', 'lemonsqueezy'] },
                          { category: 'analytics', title: 'Analytics', services: ['posthog', 'ga4', 'mixpanel'] },
                          { category: 'infra', title: 'Infra & Logs', services: ['sentry', 'vercel', 'cloudflare'] },
                          { category: 'support', title: 'Support & Mail', services: ['resend', 'intercom', 'mailchimp'] }
                        ].map(cat => (
                          <div key={cat.category} className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900">
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              {renderCategoryIcon(cat.category, "w-3.5 h-3.5 text-slate-500")}
                              {cat.title}
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {cat.services.map(srvId => {
                                const service = TECH_SERVICES_LIBRARY.find(s => s.id === srvId)!;
                                const isSelected = selectedServices.includes(srvId);
                                return (
                                  <button
                                    key={srvId}
                                    type="button"
                                    onClick={() => toggleService(srvId)}
                                    className={`px-3 py-2 rounded-xl border text-[11px] font-semibold text-left transition-all ${
                                      isSelected
                                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300 shadow-sm animate-pulse'
                                        : 'bg-slate-950 border-slate-800/80 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                                    }`}
                                  >
                                    {service.name.replace(' Authentication', '').replace(' Payments', '').replace(' Telemetry', '').replace(' Analytics', '').replace(' Identity', '').replace(' Monitoring', '').replace(' Network', '').replace(' Mailer', '').replace(' Chat', '').replace(' Newsletter', '')}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}

                        {entityType === 'unregistered' && selectedServices.some(id => ['stripe', 'razorpay', 'lemonsqueezy'].includes(id)) && (
                          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 leading-relaxed font-semibold flex gap-2 items-start">
                            <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Note: Payment gateways usually require a registered business entity or sole proprietorship tax ID for merchant verification.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── CH5 Q1: AI & ML Practices ── */}
                  {wizardStep === 5 && step5SubQuestions[subQuestionIndex] === 'ai' && (
                    <div>
                      <TypewriterHeading text="Does your app use AI features or processing?" isMuted={isMuted} />
                      <div className="grid grid-cols-1 gap-3 mt-6">
                        {[
                          { value: 'no_ai', title: 'No AI Features Used', desc: 'No artificial intelligence or machine learning APIs integrated.' },
                          { value: 'third_party_ai', title: 'Uses 3rd Party AI APIs', desc: 'Integrates OpenAI, Anthropic, or other foundation model provider APIs.' },
                          { value: 'custom_ai', title: 'Trains Custom Models', desc: 'Uses user data to train custom proprietary machine learning models.' }
                        ].map(item => (
                          <div
                            key={item.value}
                            onClick={() => setAiPractices(item.value as any)}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 interactive-press flex items-center justify-between ${
                              aiPractices === item.value
                                ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                                : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <div>
                              <h4 className="font-bold text-sm text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.title}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              aiPractices === item.value ? 'bg-stone-50 text-slate-950' : 'border border-slate-700 bg-slate-950'
                            }`}>
                              {aiPractices === item.value && (
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

                  {/* ── CH5 Q2: Children's Privacy ── */}
                  {wizardStep === 5 && step5SubQuestions[subQuestionIndex] === 'children' && (
                    <div>
                      <TypewriterHeading text={business.name ? `Is ${business.name} directed at or accessible to children?` : "Is your product directed at children under 13/16?"} isMuted={isMuted} />
                      <div className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { value: 'no', title: 'No', desc: 'Intended strictly for general audiences (13+ / 16+).' },
                            { value: 'yes', title: 'Yes', desc: 'Targets or knowingly allows usage by minors under 13/16.' }
                          ].map(item => (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => setChildrenPrivacy(item.value as any)}
                              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                                childrenPrivacy === item.value
                                  ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              <h4 className="font-bold text-xs text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.title}</h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">{item.desc}</p>
                            </button>
                          ))}
                        </div>

                        {childrenPrivacy === 'yes' && (
                          <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-xs text-red-300 leading-relaxed font-semibold animate-pulse flex gap-2 items-start">
                            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>WARNING: Apps targeting minors require explicit parental consent workflows and customized legal review.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ── CH5 Q3: Contact & Retention ── */}
                  {wizardStep === 5 && step5SubQuestions[subQuestionIndex] === 'contact_retention' && (
                    <div>
                      <TypewriterHeading text="Data Rights & Retention Setup" isMuted={isMuted} />
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Privacy Contact Email</label>
                          <input
                            type="email"
                            autoFocus
                            value={business.contactEmail}
                            onChange={e => setBusiness({ ...business, contactEmail: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 focus:outline-none focus:border-slate-600 font-medium"
                            placeholder="privacy@example.com"
                          />
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-[11px] font-mono text-slate-500 mr-1 select-none">Quick options:</span>
                            <LuxuryQuickOption label="Don't have a privacy email yet" isSelected={business.contactEmail === 'privacy@example.com'} onClick={() => setBusiness({ ...business, contactEmail: 'privacy@example.com' })} />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Data Retention Duration</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <button
                              type="button"
                              onClick={() => setDataRetentionMonths('delete_request')}
                              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                                dataRetentionMonths === 'delete_request'
                                  ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              <h4 className="font-bold text-xs text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>Until account deletion request</h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">Recommended standard practice for SaaS applications.</p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDataRetentionMonths('24')}
                              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                                dataRetentionMonths !== 'delete_request'
                                  ? 'bg-slate-900 border-stone-50 text-stone-50 shadow-md'
                                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              <h4 className="font-bold text-xs text-stone-50" style={{ fontFamily: 'Outfit, sans-serif' }}>Fixed Retention Period</h4>
                              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">Delete/anonymize records after a fixed number of months.</p>
                            </button>
                          </div>

                          {dataRetentionMonths !== 'delete_request' && (
                            <div className="animate-fadeIn mt-2">
                              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Retention Duration (Months)</label>
                              <input
                                type="number"
                                value={dataRetentionMonths}
                                onChange={e => setDataRetentionMonths(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 focus:outline-none focus:border-slate-600 font-medium"
                                placeholder="24"
                              />
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="text-[11px] font-mono text-slate-500 select-none">Suggestions:</span>
                                <LuxuryQuickOption label="12 months" isSelected={dataRetentionMonths === '12'} onClick={() => setDataRetentionMonths('12')} />
                                <LuxuryQuickOption label="24 months" isSelected={dataRetentionMonths === '24'} onClick={() => setDataRetentionMonths('24')} />
                                <LuxuryQuickOption label="36 months" isSelected={dataRetentionMonths === '36'} onClick={() => setDataRetentionMonths('36')} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── CH5 Q4: India Grievance Officer ── */}
                  {wizardStep === 5 && step5SubQuestions[subQuestionIndex] === 'grievance' && (
                    <div>
                      <TypewriterHeading text="India DPDP Grievance Officer" isMuted={isMuted} />
                      <p className="text-xs text-slate-400 leading-relaxed font-medium mt-2 mb-6">Under the India DPDP Act 2023, you must appoint a Grievance Officer to address user data complaints.</p>
                      <div className="mt-6 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Grievance Officer Name</label>
                          <input
                            type="text"
                            autoFocus
                            value={grievanceName}
                            onChange={e => setGrievanceName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 focus:outline-none focus:border-slate-600 font-medium"
                            placeholder="e.g. Rohan Sharma"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Officer Email</label>
                          <input
                            type="email"
                            value={grievanceEmail}
                            onChange={e => setGrievanceEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 focus:outline-none focus:border-slate-600 font-medium"
                            placeholder="e.g. grievance@example.com"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Physical Address</label>
                          <input
                            type="text"
                            value={grievanceAddress}
                            onChange={e => setGrievanceAddress(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-base text-stone-50 focus:outline-none focus:border-slate-600 font-medium"
                            placeholder="e.g. 4th Floor, Tech Hub Building, Bangalore, Karnataka, 560001, India"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                {/* ── UNIFIED NAV FOOTER ── */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-900 mt-8">
                  <button
                    type="button"
                    onClick={handleWizardBack}
                    disabled={wizardStep === 1 && subQuestionIndex === 0}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-stone-50 transition-colors disabled:opacity-0 disabled:pointer-events-none"
                  >
                    ← Previous
                  </button>

                  <button
                    type="button"
                    onClick={() => { setDirection(1); handleCurrentStepNext(); }}
                    disabled={isContinueDisabled}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 text-xs font-bold rounded-xl hover:from-emerald-400 hover:to-emerald-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed interactive-press shadow-lg"
                  >
                    {wizardStep === 5 && subQuestionIndex === step5SubQuestions.length - 1 ? '✨ Generate Privacy Policy' : 'Continue →'}
                  </button>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* STATE 3: LIVE POLICY PREVIEW & OUTPUT */}
      {viewState === 'preview' && (
        <div className="py-6">
          <div className="mb-5 flex flex-col gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
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
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 text-[11px] font-bold text-emerald-300">
                  {baselineStatus}
                </span>
                <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-bold text-slate-400">
                  {selectedLaws.length} framework{selectedLaws.length === 1 ? '' : 's'}
                </span>
                <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-[11px] font-bold text-slate-400">
                  {selectedServiceObjects.length} service{selectedServiceObjects.length === 1 ? '' : 's'}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-stone-50 sm:text-3xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Privacy output workspace
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                Review the generated policy, inspect what is covered, then export the full document or the LoopyHQ privacy card embed.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
                <button
                  onClick={() => setPreviewPanel('document')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    previewPanel === 'document' ? 'bg-slate-800 text-stone-50' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Document
                </button>
                <button
                  onClick={() => setPreviewPanel('embed')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    previewPanel === 'embed' ? 'bg-slate-800 text-stone-50' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Embed Card
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <p className="text-xs font-bold text-stone-50">Covered by this baseline</p>
                <ul className="mt-3 space-y-2">
                  {scopeCoveredItems.map(item => (
                    <li key={item} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
                <p className="text-xs font-bold text-amber-300">Needs verification</p>
                <ul className="mt-3 space-y-2">
                  {scopeWatchItems.map(item => (
                    <li key={item} className="flex gap-2 text-xs leading-relaxed text-amber-100/80">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="min-w-0">
              {previewPanel === 'document' && (
                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
                      <button
                        onClick={() => setViewMode('legal')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          viewMode === 'legal' ? 'bg-slate-800 text-stone-50' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Full legal text
                      </button>
                      <button
                        onClick={() => setViewMode('plain')}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          viewMode === 'plain' ? 'bg-slate-800 text-stone-50' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Plain English
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <label className="mr-1 flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-400">
                        <input
                          type="checkbox"
                          checked={isEditable}
                          onChange={e => setIsEditable(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-stone-50"
                        />
                        Inline editing
                      </label>
                      <button
                        onClick={handleCopyMarkdown}
                        className="interactive-press rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-stone-50 transition-all hover:bg-slate-800"
                      >
                        Copy Markdown
                      </button>
                      <button
                        onClick={handleCopyHtml}
                        className="interactive-press rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-stone-50 transition-all hover:bg-slate-800"
                      >
                        Copy HTML
                      </button>
                      <button
                        onClick={handleDownloadTxt}
                        className="interactive-press rounded-xl bg-stone-50 px-3.5 py-1.5 text-xs font-bold text-slate-950 transition-all hover:bg-stone-200"
                      >
                        Download .md
                      </button>
                    </div>
                  </div>

                  {isEditable && (
                    <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-400">
                      <span className="font-bold">Notice:</span> Edited clauses should be reviewed before publishing.
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 selection:bg-slate-800 sm:p-8">
                    {isEditable ? (
                      <textarea
                        value={customPolicyText || generatedPolicy}
                        onChange={e => setCustomPolicyText(e.target.value)}
                        className="h-[560px] w-full resize-none bg-transparent font-mono text-xs leading-relaxed text-slate-300 focus:outline-none"
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                    )}
                  </div>
                </div>
              )}

              {previewPanel === 'embed' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div>
                      <p className="text-xs font-bold text-stone-50">Embeddable privacy card</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-400">Standalone HTML/CSS for footers, onboarding, settings panels, or docs.</p>
                    </div>
                    <button
                      onClick={handleCopyPrivacyCard}
                      className="interactive-press rounded-xl bg-stone-50 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-stone-200"
                    >
                      Copy Card Snippet
                    </button>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {EMBED_THEME_OPTIONS.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setEmbedTheme(theme.id)}
                          className={`interactive-press rounded-xl border px-3 py-2 text-left transition-all ${
                            embedTheme === theme.id
                              ? 'border-stone-50 bg-slate-900 text-stone-50'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <span className="block text-xs font-bold">{theme.label}</span>
                          <span className="block text-[11px] leading-snug opacity-80">{theme.description}</span>
                        </button>
                      ))}
                      <label className="ml-auto flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-400">
                        <input
                          type="checkbox"
                          checked={showServicesOnCard}
                          onChange={e => setShowServicesOnCard(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-stone-50"
                        />
                        Show services
                      </label>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4" dangerouslySetInnerHTML={{ __html: generatedPrivacyCardHtml }} />
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                      <p className="text-xs font-bold text-stone-50">HTML snippet</p>
                      <span className="text-[11px] font-mono text-slate-500">Includes LoopyHQ attribution</span>
                    </div>
                    <pre className="max-h-[360px] overflow-auto p-4 text-[11px] leading-relaxed text-slate-300"><code>{generatedPrivacyCardHtml}</code></pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
