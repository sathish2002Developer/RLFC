
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { SubmissionSuccessOverlay } from '../../components/feature/SubmissionSuccessOverlay';
import { useAdminAuth } from '../../contexts/AdminContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Type declarations for external libraries
declare global {
  interface Window {
    AOS: any;
    grecaptcha: any;
    onRecaptchaSuccess: (token: string) => void;
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function useEmailValidation(value: string, required: boolean) {
  const error = useMemo(() => {
    const trimmed = value.trim();
    if (required && !trimmed) return 'Email is required';
    if (!trimmed) return undefined;
    return EMAIL_REGEX.test(trimmed) ? undefined : 'Enter a valid email address';
  }, [required, value]);

  return { error };
}

function usePhoneValidation(valueE164: string, required: boolean) {
  const error = useMemo(() => {
    const trimmed = valueE164.trim();
    if (required && !trimmed) return 'Enter a valid phone number';
    if (!trimmed) return undefined;

    const parsed = parsePhoneNumberFromString(trimmed.startsWith('+') ? trimmed : `+${trimmed}`);
    if (!parsed || !parsed.isValid()) return 'Enter a valid phone number';
    return undefined;
  }, [required, valueE164]);

  return { error };
}

type IndiaCityRow = {
  label: string;
  name: string;
  stateCode: string;
  stateName: string;
};

const TOP_CITY_FIRST_NAMES = [
  'Mumbai',
  'Delhi',
  'New Delhi',
  'Bengaluru',
  'Bangalore',
  'Hyderabad',
  'Ahmedabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Coimbatore',
];

const MAX_COMBO_OPTIONS = 150;

const PRODUCT_OPTIONS = ['Modepro', 'RLFC', 'Extrovis'] as const;

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function isSubsequence(s: string, t: string): boolean {
  let i = 0;
  for (let j = 0; j < t.length && i < s.length; j++) {
    if (t[j] === s[i]) i++;
  }
  return i === s.length;
}

function matchScore(query: string, label: string): number {
  const q = query.trim().toLowerCase();
  const l = label.toLowerCase();
  if (!q.length) return 0;
  if (l === q) return 10000;
  if (l.startsWith(q)) return 8000 + Math.max(0, 200 - l.length);
  const idx = l.indexOf(q);
  if (idx !== -1) return 6000 - idx * 15;
  if (isSubsequence(q, l)) return 4000 - levenshtein(q, l.slice(0, Math.min(64, l.length)));
  const cityPart = l.split(',')[0].trim();
  const d = levenshtein(q, cityPart.slice(0, Math.min(cityPart.length, 32)));
  if (d <= Math.max(2, Math.floor(q.length / 3))) return 2000 - d * 100;
  const d2 = levenshtein(q.slice(0, 24), l.slice(0, 48));
  if (d2 <= Math.max(3, Math.floor(q.length / 2))) return 800 - d2 * 50;
  return -1;
}

function rankCitiesWhenEmpty(list: IndiaCityRow[]): IndiaCityRow[] {
  const pri = (label: string) => {
    const cityPart = label.split(',')[0].trim().toLowerCase();
    const i = TOP_CITY_FIRST_NAMES.findIndex((t) => {
      const tl = t.toLowerCase();
      return cityPart === tl || cityPart.startsWith(tl) || tl.startsWith(cityPart);
    });
    return i === -1 ? 999 : i;
  };
  return [...list].sort((a, b) => {
    const pa = pri(a.label);
    const pb = pri(b.label);
    if (pa !== pb) return pa - pb;
    return a.label.localeCompare(b.label);
  });
}

function filterAndRankCities(query: string, list: IndiaCityRow[]): IndiaCityRow[] {
  const q = query.trim();
  if (!q) return rankCitiesWhenEmpty(list);
  const scored = list
    .map((row) => ({ row, score: matchScore(q, row.label) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.row.label.localeCompare(b.row.label));
  return scored.map((x) => x.row);
}

const Contact = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isEnglish = currentLang === 'en';
  const { data } = useAdminAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    city: '',
    product: '',
    company: '',
    message: ''
  });
  const [touched, setTouched] = useState<{ email: boolean; phone: boolean; city: boolean }>({
    email: false,
    phone: false,
    city: false
  });
  const [indiaCities, setIndiaCities] = useState<IndiaCityRow[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [cityQuery, setCityQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'error'>('idle');
  const [successOverlayOpen, setSuccessOverlayOpen] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');

  const handleSuccessOverlayDone = useCallback(() => {
    setSuccessOverlayOpen(false);
  }, []);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize AOS when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out'
      });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setCitiesLoading(true);
        const res = await fetch('/api/geo/india-cities');
        const data = await res.json();
        if (!cancelled && data.success && Array.isArray(data.cities)) {
          setIndiaCities(data.cities);
        }
      } catch {
        if (!cancelled) setIndiaCities([]);
      } finally {
        if (!cancelled) setCitiesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load reCAPTCHA script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Define reCAPTCHA callback
    (window as any).onRecaptchaSuccess = (token: string) => {
      setRecaptchaToken(token);
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Validation functions
  const validateName = (name: string) => {
    // Only allow alphabets, spaces, hyphens, and apostrophes
    return /^[a-zA-Z\s\-']+$/.test(name);
  };

  const emailValidation = useEmailValidation(formData.email, true);
  const phoneValidation = usePhoneValidation(formData.phone, true);

  const filteredCities = useMemo(
    () => filterAndRankCities(cityQuery, indiaCities).slice(0, MAX_COMBO_OPTIONS),
    [cityQuery, indiaCities]
  );

  const cityError = useMemo(() => {
    if (!formData.city.trim()) return 'City is required';
    return undefined;
  }, [formData.city]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Apply validation based on field type
    if (name === 'name' && value && !validateName(value)) {
      return; // Don't update if invalid
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailBlur = () => setTouched(prev => ({ ...prev, email: true }));
  const handlePhoneBlur = () => setTouched(prev => ({ ...prev, phone: true }));
  const handleCityBlur = () => setTouched(prev => ({ ...prev, city: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    setTouched({ email: true, phone: true, city: true });

    if (emailValidation.error || phoneValidation.error || cityError) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Validate message length
    if (formData.message.length > 500) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        }),
      });

      if (response.ok) {
        setSuccessOverlayOpen(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          countryCode: '+91',
          city: '',
          product: '',
          company: '',
          message: ''
        });
        setCityQuery('');
        setTouched({ email: false, phone: false, city: false });
        setRecaptchaToken('');
        // Reset reCAPTCHA
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {successOverlayOpen && (
        <SubmissionSuccessOverlay onDone={handleSuccessOverlayDone} />
      )}
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('${data?.contactHero?.backgroundImage || "https://www.rlfinechem.com/wp-content/uploads/2025/07/Contact-us.webp"}')`
        }}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <h1 
              className="text-5xl lg:text-6xl font-bold text-white mb-6 font-montserrat"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              {isEnglish && data?.contactHero?.title ? data.contactHero.title : t("contactHeroTitle")}
            </h1>
            <p 
              className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-montserrat mb-8"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              {isEnglish && data?.contactHero?.subtitle ? data.contactHero.subtitle : (isEnglish && data?.contactHero?.description ? data.contactHero.description : t("contactHeroSubtitle"))}
            </p>
            {/* <div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              <a 
                href="#contact-form" 
                className="bg-refex-blue hover:bg-refex-blue-dark text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 font-montserrat"
              >
                <i className="ri-mail-line mr-2"></i>
                Email Us
              </a>
              <a 
                href="#map-section" 
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer border border-white/30 font-montserrat"
              >
                <i className="ri-map-pin-line mr-2"></i>
                Visit Our Office
              </a>
            </div> */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information - Slide from Right */}
            <div 
              className="space-y-12"
              data-aos="fade-right"
              data-aos-duration="1000"
              data-aos-offset="200"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 font-montserrat">
                  {isEnglish && data?.contactGetInTouch?.title ? data.contactGetInTouch.title : t("contactGetInTouchTitle")}
                </h2>
                {/* <p className="text-lg text-gray-600 leading-relaxed font-montserrat">
                  {data?.contactGetInTouch?.description || 'We\'re here to help you navigate the complex world of pharmaceutical development. Whether you need API manufacturing, formulation development, or regulatory support, our team is ready to assist.'}
                </p> */}
              </div>

              {/* Contact Details */}
              <div className="space-y-8">
                <div 
                  className="flex items-start space-x-4"
                  data-aos="fade-right"
                  data-aos-duration="800"
                  data-aos-delay="100"
                >
                  {/* <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    data?.contactGetInTouch?.location?.color === 'refex-blue' ? 'bg-refex-blue' :
                    data?.contactGetInTouch?.location?.color === 'refex-green' ? 'bg-refex-green' :
                    'bg-refex-orange'
                  }`}>
                    <i className={`${data?.contactGetInTouch?.location?.icon || 'ri-map-pin-line'} text-white text-xl`}></i>
                  </div> */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">
                       {t("contactOurAddress")}
                    </h3>
                    <p className="text-gray-600 font-montserrat" dangerouslySetInnerHTML={{ __html: t("contactMainAddress") }}></p>
                  </div>
                </div>

                {/* <div 
                  className="flex items-start space-x-4"
                  data-aos="fade-right"
                  data-aos-duration="800"
                  data-aos-delay="200"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    data?.contactGetInTouch?.phone?.color === 'refex-blue' ? 'bg-refex-blue' :
                    data?.contactGetInTouch?.phone?.color === 'refex-green' ? 'bg-refex-green' :
                    'bg-refex-orange'
                  }`}>
                    <i className={`${data?.contactGetInTouch?.phone?.icon || 'ri-phone-line'} text-white text-xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">
                      {data?.contactGetInTouch?.phone?.title || 'Phone'}
                    </h3>
                    <p className="text-gray-600 font-montserrat">
                      { '+91-44-43405900/950'}
                    </p>
                   
                  </div>
                </div> */}
                   <div 
                  className="flex items-start space-x-4"
                  data-aos="fade-right"
                  data-aos-duration="800"
                  data-aos-delay="300"
                >
                  {/* <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    data?.contactGetInTouch?.email?.color === 'refex-blue' ? 'bg-refex-blue' :
                    data?.contactGetInTouch?.email?.color === 'refex-green' ? 'bg-refex-green' :
                    'bg-refex-orange'
                  }`}>
                    <i className={`${data?.contactGetInTouch?.email?.icon || 'ri-mail-line'} text-white text-xl`}></i>
                  </div> */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">
                      {t("contactOtherAddresses")}
                    </h3>
                    <p className="text-gray-600 font-montserrat" dangerouslySetInnerHTML={{ __html: t("contactAddressBangalore") }}></p>
                     <br />
                     
                    <p className="text-gray-600 font-montserrat" dangerouslySetInnerHTML={{ __html: t("contactAddressMumbai") }}></p>
                    <br />
                    <p className="text-gray-600 font-montserrat" dangerouslySetInnerHTML={{ __html: t("contactAddressSwitzerland") }}></p>

                  
                  </div>
                </div>

                <div 
                  className="flex items-start space-x-4"
                  data-aos="fade-right"
                  data-aos-duration="800"
                  data-aos-delay="300"
                >
                  {/* <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    data?.contactGetInTouch?.email?.color === 'refex-blue' ? 'bg-refex-blue' :
                    data?.contactGetInTouch?.email?.color === 'refex-green' ? 'bg-refex-green' :
                    'bg-refex-orange'
                  }`}>
                    <i className={`${data?.contactGetInTouch?.email?.icon || 'ri-mail-line'} text-white text-xl`}></i>
                  </div> */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 font-montserrat">
                      {isEnglish && data?.contactGetInTouch?.email?.title ? data.contactGetInTouch.email.title : t("contactEmail")}
                    </h3>
                    <p className="text-gray-600 font-montserrat">
                      { 'info@refexlifeseciences.com'}
                    </p>
                  
                  </div>
                </div>
              </div>

              {/* Business Hours */}
           
            </div>
                  
            {/* Contact Form - Slide from Left */}
            <div 
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              data-aos="fade-left"
              data-aos-duration="1000"
              data-aos-offset="200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 font-montserrat">{t("contactFormTitle")}</h3>
              
              <form id="contact-form" data-readdy-form onSubmit={handleSubmit} className="space-y-6">
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="100"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      {t("contactFormNameLabel")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-refex-blue focus:border-transparent transition-all duration-200 text-sm font-montserrat"
                      placeholder={t("contactFormNamePlaceholder")}
                    />
                  
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      {t("contactFormEmailLabel")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleEmailBlur}
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-refex-blue focus:border-transparent transition-all duration-200 text-sm font-montserrat"
                      placeholder={t("contactFormEmailPlaceholder")}
                    />
                    {touched.email && emailValidation.error && (
                      <p className="mt-1 text-xs text-refex-orange font-montserrat">{emailValidation.error}</p>
                    )}
                  </div>
                </div>

                <div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="200"
                >
                  <div>
  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
    {t("contactFormPhoneLabel")}
  </label>
  <PhoneInput
    country="in"
    value={(formData.phone || '').replace(/^\+/, '')}
    onChange={(value: string) => {
      const next = value ? (value.startsWith('+') ? value : `+${value}`) : '';
      setFormData(prev => ({ ...prev, phone: next }));
    }}
    inputProps={{
      name: 'phone',
      required: true,
      onBlur: handlePhoneBlur
    }}
    placeholder={t("contactFormPhonePlaceholder")}
    containerClass="!w-full"
    inputClass="!w-full !h-auto !py-3 !pl-12 !pr-4 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-refex-blue focus:!border-transparent !transition-all !duration-200 !text-sm !font-montserrat"
    buttonClass="!border !border-gray-300 !rounded-l-lg"
  />
  {touched.phone && phoneValidation.error && (
    <p className="mt-1 text-xs text-refex-orange font-montserrat">{phoneValidation.error}</p>
  )}
</div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      {t("contactFormCompanyLabel")}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-refex-blue focus:border-transparent transition-all duration-200 text-sm font-montserrat"
                      placeholder={t("contactFormCompanyPlaceholder")}
                    />
                  </div>
                </div>

                <div
                  className="relative z-50"
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="250"
                >
                  <label
                    htmlFor="city-combobox"
                    className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat"
                  >
                    City *
                  </label>
                  <input type="hidden" name="city" value={formData.city} required readOnly />
                  <Combobox
                    value={formData.city}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, city: val ?? '' }));
                      setCityQuery('');
                    }}
                    onClose={() => setCityQuery('')}
                  >
                    <div className="relative z-50">
                      <ComboboxInput
                        id="city-combobox"
                        autoComplete="off"
                        displayValue={() => formData.city}
                        onChange={(e) => setCityQuery(e.target.value)}
                        onBlur={handleCityBlur}
                        placeholder={
                          citiesLoading ? 'Loading cities…' : 'Search or select your city'
                        }
                        disabled={citiesLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-refex-blue focus:border-transparent transition-all duration-200 text-sm font-montserrat pr-10 disabled:bg-gray-50 disabled:text-gray-500"
                      />
                      <ComboboxButton
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                      >
                        <i className="ri-arrow-down-s-line text-lg" aria-hidden />
                      </ComboboxButton>
                      <ComboboxOptions className="absolute z-[200] mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white py-1 shadow-xl ring-1 ring-black/5 focus:outline-none empty:invisible">
                        {citiesLoading ? (
                          <div className="px-4 py-2 text-sm text-gray-500 font-montserrat">
                            Loading cities…
                          </div>
                        ) : filteredCities.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-gray-500 font-montserrat">
                            No cities match your search.
                          </div>
                        ) : (
                          filteredCities.map((c) => (
                            <ComboboxOption
                              key={`${c.stateCode}-${c.name}-${c.label}`}
                              value={c.label}
                              className="cursor-pointer px-4 py-2 text-sm font-montserrat text-gray-800 data-[focus]:bg-refex-blue/10 data-[selected]:font-semibold"
                            >
                              {c.label}
                            </ComboboxOption>
                          ))
                        )}
                      </ComboboxOptions>
                    </div>
                  </Combobox>
                  {touched.city && cityError && (
                    <p className="mt-1 text-xs text-refex-orange font-montserrat">{cityError}</p>
                  )}
                </div>

                <div
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="275"
                >
                  <label
                    htmlFor="product"
                    className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat"
                  >
                    Products *
                  </label>
                  <select
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-refex-blue focus:border-transparent transition-all duration-200 text-sm font-montserrat bg-white"
                  >
                    <option value="" disabled>
                      Select a product
                    </option>
                    {PRODUCT_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div 
                  className="relative z-0"
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="300"
                >
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                    {t("contactFormMessageLabel")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    maxLength={500}
                    rows={6}
                    autoComplete="off"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-refex-blue focus:border-transparent transition-all duration-200 resize-none text-sm font-montSerrat"
                    placeholder={t("contactFormMessagePlaceholder")}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1 font-montserrat">
                    {formData.message.length}/500 {t("contactFormCharacters")}
                  </div>
                </div>

                {/* Submit Status Messages */}
                {submitStatus === 'error' && (
                  <div 
                    className="bg-red-50 border border-refex-orange rounded-lg p-4"
                    data-aos="fade-up"
                    data-aos-duration="500"
                  >
                    <div className="flex items-center">
                      <i className="ri-error-warning-line text-refex-orange text-xl mr-3"></i>
                      <p className="text-refex-orange font-montserrat">{t("contactFormError")}</p>
                    </div>
                  </div>
                )}

                {/* reCAPTCHA */}
                <div 
                  className="flex justify-center"
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="350"
                >
                  <div 
                    className="g-recaptcha" 
                    data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    data-callback="onRecaptchaSuccess"
                  ></div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !recaptchaToken}
                  className="w-full bg-refex-blue hover:bg-refex-blue-dark text-white py-4 px-8 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 font-montserrat"
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="400"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      {t("contactFormSubmitting")}
                    </span>
                  ) : !recaptchaToken ? (
                    t("contactFormRecaptchaRequired")
                  ) : (
                    t("contactFormSubmitButton")
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      {/* <section id="map-section" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-12"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-montserrat">Visit Our Office</h2>
            <p className="text-lg text-gray-600 font-montserrat mb-6">Find us at our headquarters in Chennai</p>
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <a 
                href="mailto:info@refex.co.in" 
                className="bg-refex-blue hover:bg-refex-blue-dark text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 font-montserrat"
              >
                <i className="ri-mail-send-line mr-2"></i>
                Send Email
              </a>
              <a 
                href="https://maps.google.com/?q=Refex+Building,+67,+Bazullah+Road,+Parthasarathy+Puram,+T+Nagar,+Chennai,+600017" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-refex-green hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 font-montserrat"
              >
                <i className="ri-navigation-line mr-2"></i>
                Get Directions
              </a>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            data-aos="zoom-in"
            data-aos-duration="1000"
            data-aos-delay="300"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.7234567890123!2d80.2345678!3d13.0456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267e3f0e12345%3A0x123456789abcdef0!2sBazullah%20Rd%2C%20Parthasarathi%20Puram%2C%20T.%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu%20600017!5e0!3m2!1sen!2sin!4v1635959542834!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Refex Life Sciences Location"
            />
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

export default Contact;
