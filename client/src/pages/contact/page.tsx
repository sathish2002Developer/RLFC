
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import { useAdminAuth } from '../../contexts/AdminContext';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// Type declarations for external libraries
declare global {
  interface Window {
    AOS: any;
    grecaptcha: any;
    onRecaptchaSuccess: (token: string) => void;
  }
}

const Contact = () => {
  const { data } = useAdminAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [recaptchaToken, setRecaptchaToken] = useState<string>('');

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

  const validatePhone = (phone: string) => {
    // Only allow digits
    return /^\d*$/.test(phone);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply validation based on field type
    if (name === 'name' && value && !validateName(value)) {
      return; // Don't update if invalid
    }
    
    if (name === 'phone' && value && !validatePhone(value)) {
      return; // Don't update if invalid
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

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
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          countryCode: '+91',
          company: '',
          message: ''
        });
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
              {data?.contactHero?.title || 'Contact Us'}
            </h1>
            {data?.contactHero?.subtitle && (
              <p 
                className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-montserrat mb-8"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                {data.contactHero.subtitle}
              </p>
            )}
            {data?.contactHero?.description && (
              <p 
                className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-montserrat mb-8"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="200"
              >
                {data.contactHero.description}
              </p>
            )}
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
                  {data?.contactGetInTouch?.title || 'Get in Touch'}
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
                       Our Address
                    </h3>
                    <p className="text-gray-600 font-montserrat">
  67, Bazullah Road,<br />
  Partha Sarathy Puram,<br />
  T Nagar, Chennai – 600017<br />
  Tamil Nadu, India
</p>
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
                      {'Other Addresses'}
                    </h3>
                    <p className="text-gray-600 font-montserrat">
                    Phoenix Mall of Asia – Tower 2, 
                    <br />
                    Level 6, Unit 602, Yelahanka Hobli, 
                    <br />
                    Byatarayanapura, Bangalore – 560092,
                    <br />
                    Karnataka, India
                    </p>
                     <br />
                     
                    <p className="text-gray-600 font-montserrat">
                    409, Bezzola Complex,
                    <br />
                    Sion Trombay Road,
                    <br />
                    Chembur, Mumbai - 400 071
                    <br />
Maharashtra, India.
                    </p>
                    <br />
                    <p className="text-gray-600 font-montserrat">
                    Bahnhof-Park 4, 
                    <br />
                    Baar 6340, 
                    <br />
Switzerland
                    </p>

                  
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
                      {data?.contactGetInTouch?.email?.title || 'Email'}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-8 font-montserrat">Send us a Message</h3>
              
              <form id="contact-form" data-readdy-form onSubmit={handleSubmit} className="space-y-6">
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="100"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      Full Name *
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
                      placeholder="Enter your full name"
                    />
                  
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-refex-blue focus:border-transparent transition-all duration-200 text-sm font-montserrat"
                      placeholder="Enter your email address"
                    />
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
    Phone Number
  </label>
  <PhoneInput
    placeholder="Enter your phone number"
    value={formData.phone}
    onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
    defaultCountry="IN"
    international
    countryCallingCodeEditable={false}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-refex-blue focus:border-transparent transition-all duration-200 text-sm font-montserrat"
  />
</div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-refex-blue focus:border-transparent transition-all duration-200 text-sm font-montserrat"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                <div 
                  data-aos="fade-left"
                  data-aos-duration="800"
                  data-aos-delay="300"
                >
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                    Message *
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
                    placeholder="Tell us about your project or inquiry..."
                  />
                  <div className="text-right text-xs text-gray-500 mt-1 font-montserrat">
                    {formData.message.length}/500 characters
                  </div>
                </div>

                {/* Submit Status Messages */}
                {submitStatus === 'success' && (
                  <div 
                    className="bg-green-50 border border-refex-green rounded-lg p-4"
                    data-aos="fade-up" 
                    data-aos-duration="500"
                  >
                    <div className="flex items-center">
                      <i className="ri-check-circle-line text-refex-green text-xl mr-3"></i>
                      <p className="text-refex-green font-montserrat">Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div 
                    className="bg-red-50 border border-refex-orange rounded-lg p-4"
                    data-aos="fade-up"
                    data-aos-duration="500"
                  >
                    <div className="flex items-center">
                      <i className="ri-error-warning-line text-refex-orange text-xl mr-3"></i>
                      <p className="text-refex-orange font-montserrat">Sorry, there was an error sending your message. Please try again or contact us directly.</p>
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
                      Sending...
                    </span>
                  ) : !recaptchaToken ? (
                    'Please complete reCAPTCHA'
                  ) : (
                    'Get in Touch'
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
