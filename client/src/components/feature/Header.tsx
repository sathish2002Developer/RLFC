import { useState } from "react";
import { useLocation } from "react-router-dom"; // If using React Router

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect current route for active menu highlight
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Capabilities", href: "/capabilities" },
  { name: "Sustainability", href: "/sustainability" },
  { name: "Careers", href: "https://www.refex.group/careers/", external: true }, // updated
  { name: "Contact", href: "/contact" },
];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" data-aos="fade-down" data-aos-duration="800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="https://static.readdy.ai/image/fee7c46f86ab0abd00d243769e1016cd/1d58d4112a718d2b16f06f3a09a7875a.png"
              alt="Refex Life Sciences"
              className="h-16 w-auto"
            />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
          {navItems.map((item) => {
  const isActive = currentPath === item.href;
  const linkClass = `font-semibold text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${
    isActive ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-green-600"
  }`;

  return item.external ? (
    <a
      key={item.href}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {item.name}
    </a>
  ) : (
    <a
      key={item.href}
      href={item.href}
      className={linkClass}
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {item.name}
    </a>
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
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`block font-semibold text-sm transition-all duration-300 ${
                  currentPath === item.href
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-green-600"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
                onClick={() => setMobileMenuOpen(false)} // close after click
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
