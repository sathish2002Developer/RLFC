
import { Link } from 'react-router-dom';
import Rlfc from "../../images/RLFC-Logo.jpg"
import Extrovis from "../../images/Extrovis.png"

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
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
      
      {/* Company Info */}
   

      {/* Quick Links */}
      <div className="w-full md:w-1/3 space-y-6" style={{ paddingLeft: '100px' }}>
        <h3 className="text-xl font-bold text-white font-montserrat mb-6 relative">
          Quick Links
          <div className="absolute -bottom-2 left-0 w-12 h-1 bg-refex-blue rounded-full"></div>
        </h3>
        <ul className="space-y-4">
          <li>
            <Link
              to="/about"
              state={{ scrollTop: true }}
              className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group"
            >
              <i className="ri-arrow-right-s-line text-refex-blue mr-2 group-hover:text-white transition-colors duration-200"></i>
              About RLS
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              state={{ activeTab: 'journey' }}
              className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group"
            >
              <i className="ri-arrow-right-s-line text-refex-blue mr-2 group-hover:text-white transition-colors duration-200"></i>
              Our Journey
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              state={{ activeTab: 'leadership' }}
              className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group"
            >
              <i className="ri-arrow-right-s-line text-refex-blue mr-2 group-hover:text-white transition-colors duration-200"></i>
              Leadership Team
            </Link>
          </li>
          {/* <li>
            <Link
              to="/products"
              className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group"
            >
              <i className="ri-arrow-right-s-line text-refex-green mr-2 group-hover:text-white transition-colors duration-200"></i>
              Products
            </Link>
          </li> */}
          <li>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-200 cursor-pointer font-montserrat text-sm flex items-center group"
            >
              <i className="ri-arrow-right-s-line text-refex-orange mr-2 group-hover:text-white transition-colors duration-200"></i>
              Contact Us
            </Link>
          </li>
        </ul>
      </div>

      {/* Connect With Us */}
      <div className="w-full md:w-1/3 space-y-6">
        <h3 className="text-xl font-bold text-white font-montserrat mb-6 relative">
          Connect With Us
          <div className="absolute -bottom-2 left-0 w-12 h-1 bg-refex-green rounded-full"></div>
        </h3>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.linkedin.com/company/refex-group/"
            target="_blank"
            className="group w-12 h-12 border-2 border-gray-600 hover:border-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
          >
            <i className="ri-linkedin-fill text-gray-400 hover:text-white text-xl group-hover:scale-110 transition-all duration-300"></i>
          </a>
          <a
            href="https://x.com/GroupRefex"
            target="_blank"
            className="group w-12 h-12 border-2 border-gray-600 hover:border-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
          >
            <i className="ri-twitter-x-fill text-gray-400 hover:text-white text-xl group-hover:scale-110 transition-all duration-300"></i>
          </a>
          <a
            href="https://www.facebook.com/refexindustrieslimited/"
            target="_blank"
            className="group w-12 h-12 border-2 border-gray-600 hover:border-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
          >
            <i className="ri-facebook-fill text-gray-400 hover:text-white text-xl group-hover:scale-110 transition-all duration-300"></i>
          </a>
          <a
            href="https://www.instagram.com/refexgroup/"
            target="_blank"
            className="group w-12 h-12 border-2 border-gray-600 hover:border-white rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
          >
            <i className="ri-instagram-fill text-gray-400 hover:text-white text-xl group-hover:scale-110 transition-all duration-300"></i>
          </a>
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
              <Link
                to="https://sites.google.com/refex.co.in/privacy/home"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer font-montserrat hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="https://sites.google.com/refex.co.in/term/home"
                className="text-gray-400 hover:text-white text-sm transition-colors duration-200 cursor-pointer font-montserrat hover:underline"
              >
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
