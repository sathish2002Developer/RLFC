import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import RefexGroupLogo from "../../images/RLS_Logo.png"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect current route for active menu highlight
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  // { name: "Products", href: "/products" },
  { name: "Capabilities", href: "/capabilities" },
  { name: "ESG", href: "/sustainability" },
  { name: "Careers", href: "https://www.refex.group/careers/", external: true }, // updated
  { name: "Contact", href: "/contact" },
];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" data-aos="fade-down" data-aos-duration="800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="block">
              <img
               style={{
                 height:"90px"
               }}
                src={RefexGroupLogo}
                alt="Refex Life Sciences"
                className=" w-auto hover:opacity-80 transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
          {navItems.map((item) => {
  const isActive = currentPath === item.href;
  const linkClass = `font-semibold text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${
    isActive ? "text-blue-600" : "text-gray-700 hover:text-green-600"
  }`;

  if (item.name === "About Us") {
    return (
      <div key={item.href} className="relative group">
        <Link
          to={item.href}
          className={linkClass}
          style={{ fontFamily: "Montserrat, sans-serif", fontSize:"17px" }}
        >
          {item.name}
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white shadow-lg rounded-md border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="py-2">
            <Link
              to="/about"
              state={{  activeTab: 'journey'}}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Our Journey
            </Link>
            <Link
              to="/about"
              state={{  activeTab: 'vision' }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Vision & Mission
            </Link>
            <Link
              to="/about"
              state={{ activeTab: 'leadership' }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Leadership Team
            </Link>
            {/* <Link
              to="/about"
              state={{ activeTab:"management" }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Management Team
            </Link> */}
          </div>
        </div>
      </div>
    );
  }

  return item.external ? (
    <a
      key={item.href}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      style={{ fontFamily: "Montserrat, sans-serif" ,fontSize:"17px" }}
    >
      {item.name}
    </a>
  ) : (
    <Link
      key={item.href}
      to={item.href}
      className={linkClass}
      style={{ fontFamily: "Montserrat, sans-serif", fontSize:"17px" }}
    >
      {item.name}
    </Link>
  );
})}

          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-green-600 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <i className="ri-close-line text-2xl"></i>
              ) : (
                <i className="ri-menu-line text-2xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              const linkClass = `block font-semibold text-sm transition-all duration-300 ${
                isActive ? "text-blue-600" : "text-gray-700 hover:text-green-600"
              }`;

              if (item.name === "About Us") {
                return (
                  <div key={item.href} className="space-y-2">
                    <Link
                      to={item.href}
                      className={linkClass}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                    <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                      <Link
                        to="/about"
                        state={{  activeTab: 'journey'}}
                        className="block text-sm text-gray-700 hover:text-green-600"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Our Journey
                      </Link>
                    <Link
                      to="/about"
                      state={{  activeTab: 'vision' }}
                      className="block text-sm text-gray-700 hover:text-green-600"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Vision & Mission
                    </Link>
                      <Link
                        to="/about"
                        state={{ activeTab: 'leadership' }}
                        className="block text-sm text-gray-700 hover:text-green-600"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Leadership Team
                      </Link>
                    {/* <Link
                      to="/about"
                      state={{ scrollTop: true }}
                      className="block text-sm text-gray-700 hover:text-green-600"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Management Team
                    </Link> */}
                    </div>
                  </div>
                );
              }

              return item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={linkClass}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
