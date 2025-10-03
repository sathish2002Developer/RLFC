
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
     <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-refex-blue rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-refex-green rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-6 lg:px-8 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <img 
                  style={{
                     cursor:"pointer"
                  }}
                  src="https://static.readdy.ai/image/fee7c46f86ab0abd00d243769e1016cd/1d58d4112a718d2b16f06f3a09a7875a.png" 
                  alt="Refex Life Sciences" 
                  className="h-12 w-auto filter"
                />
                </div>
                <p className="text-gray-300 leading-relaxed font-montserrat text-base max-w-md">
                  Leading pharmaceutical innovation with 40+ years of expertise in APIs and complex generics, serving 80+ countries worldwide with cutting-edge healthcare solutions.
                </p>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-refex-blue/30 transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-refex-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="ri-mail-line text-white text-lg"></i>
                    </div>
                    <div style={{
                     cursor:"pointer"
                  }}>
                      <h4 className="text-white font-semibold font-montserrat mb-1">Email Us</h4>
                      <p className="text-gray-300 font-montserrat text-sm">info@refex.co.in</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-refex-green/30 transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-refex-green rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="ri-phone-line text-white text-lg"></i>
                    </div>
                    <div style={{
                     cursor:"pointer"
                  }}>
                      <h4 className="text-white font-semibold font-montserrat mb-1">Call Us</h4>
                      <p className="text-gray-300 font-montserrat text-sm">044 - 43405900/950</p>
                    </div>
                  </div>
                </div>
              </div>

         
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white font-montserrat mb-6 relative">
                Quick Links
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-refex-blue rounded-full"></div>
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/about-rls" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line text-refex-blue mr-2 group-hover:text-white transition-colors duration-200"></i>
                    About RLS
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line text-refex-blue mr-2 group-hover:text-white transition-colors duration-200"></i>
                    History/Journey
                  </Link>
                </li>
                <li>
                  <Link to="/leadership" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line text-refex-blue mr-2 group-hover:text-white transition-colors duration-200"></i>
                    Leadership Team
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line text-refex-green mr-2 group-hover:text-white transition-colors duration-200"></i>
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/capabilities" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line text-refex-green mr-2 group-hover:text-white transition-colors duration-200"></i>
                    Capabilities
                  </Link>
                </li>
                <li>
                  <Link to="/sustainability" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line text-refex-green mr-2 group-hover:text-white transition-colors duration-200"></i>
                    Sustainability
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line text-refex-orange mr-2 group-hover:text-white transition-colors duration-200"></i>
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group">
                    <i className="ri-arrow-right-s-line text-refex-orange mr-2 group-hover:text-white transition-colors duration-200"></i>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white font-montserrat mb-6 relative">
                Connect With Us
                <div className="absolute -bottom-2 left-0 w-12 h-1 bg-refex-green rounded-full"></div>
              </h3>
              
              <div className="flex flex-wrap gap-3">
                <a href="https://www.linkedin.com/company/refex-group/" target='_blank' className="group w-12 h-12 border-2 border-gray-600 hover:border-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer">
                  <i className="ri-linkedin-fill text-gray-400 hover:text-white text-xl group-hover:scale-110 transition-all duration-300"></i>
                </a>
                <a href="https://x.com/GroupRefex" target='_blank' className="group w-12 h-12 border-2 border-gray-600 hover:border-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer">
                  <i className="ri-twitter-x-fill text-gray-400 hover:text-white text-xl group-hover:scale-110 transition-all duration-300"></i>
                </a>
                <a href="https://www.facebook.com/refexindustrieslimited/" target='_blank' className="group w-12 h-12 border-2 border-gray-600 hover:border-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer">
                  <i className="ri-facebook-fill text-gray-400 hover:text-white text-xl group-hover:scale-110 transition-all duration-300"></i>
                </a>
                <a href="https://www.instagram.com/refexgroup/" target='_blank' className="group w-12 h-12 border-2 border-gray-600 hover:border-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer">
                  <i className="ri-instagram-fill text-gray-400 hover:text-white text-xl group-hover:scale-110 transition-all duration-300"></i>
                </a>
              </div>

                  <div
                  style={{
                     cursor:"pointer"
                  }}
                   className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-refex-orange/30 transition-all duration-300">
                <h4 className="text-white font-semibold font-montserrat mb-3 flex items-center">
                  <i className="ri-map-pin-line text-refex-orange mr-2"></i>
                  Visit Us
                </h4>
                <p className="text-gray-300 font-montserrat text-sm leading-relaxed mb-4">
                  Come visit our headquarters and manufacturing facilities in Chennai.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-300 text-sm">
                    <i className="ri-building-line text-refex-orange mr-2 w-4"></i>
                    <span>Refex Building, T Nagar</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <i className="ri-time-line text-refex-orange mr-2 w-4"></i>
                    <span>Mon-Fri: 9 AM - 6 PM</span>
                  </div>
                  <div className="flex items-center text-gray-300 text-sm">
                    <i className="ri-phone-line text-refex-orange mr-2 w-4"></i>
                    <span>044 - 43405900/950</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Bottom Footer */}
      <div className="w-full px-6 lg:px-8 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm font-montserrat flex items-center">
              <i className="ri-copyright-line mr-1"></i>
              2025 Refex Life Sciences. All rights reserved.
            </div>
            <div className="flex items-center space-x-8">
              <Link to="https://www.refex.group/privacy-policy/" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer font-montserrat hover:underline">
                Privacy Policy
              </Link>
              <Link to="https://www.refex.group/terms-of-use/" className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer font-montserrat hover:underline">
                Terms of Service
              </Link>
             
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
