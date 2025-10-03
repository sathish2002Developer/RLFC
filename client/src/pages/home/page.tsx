
import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import HeroSlider from '../../components/feature/HeroSlider';
import Footer from '../../components/feature/Footer';
import Header from '../../components/feature/Header';


export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [currentRegulatorySlide, setCurrentRegulatorySlide] = useState(0);
  
  // Add counters state for statistics animation
  const [counters, setCounters] = useState({
    scientists: 0,
    products: 0,
    markets: 0
  });

  const slides = [
    {
      image: "https://readdy.ai/api/search-image?query=State-of-the-art%20pharmaceutical%20laboratory%20with%20advanced%20scientific%20equipment%20and%20researchers%20in%20white%20coats%2C%20modern%20sterile%20environment%20with%20sophisticated%20instruments%20and%20glass%20beakers%2C%20high-tech%20medical%20research%20facility%20with%20blue%20accent%20lighting%20and%20clean%20white%20surfaces%2C%20professional%20pharmaceutical%20lab%20atmosphere%20showcasing%20innovation%20from%20lab%20to%20life&width=1200&height=600&seq=pharma-lab-1&orientation=landscape",
      title: "Accelerating Healthcare from Lab to Life"
    },
    {
      image: "https://readdy.ai/api/search-image?query=Global%20pharmaceutical%20network%20visualization%20showing%20world%20map%20with%20connecting%20lines%20to%2080%20%20countries%2C%20modern%20digital%20interface%20displaying%20international%20connections%20and%20global%20reach%2C%20professional%20blue%20and%20green%20color%20scheme%20with%20geographic%20elements%2C%20clean%20minimalist%20design%20representing%20worldwide%20pharmaceutical%20distribution&width=1200&height=600&seq=global-reach-2&orientation=landscape",
      title: "Global Reach – Customers in 80+ countries"
    },
    {
      image: "https://readdy.ai/api/search-image?query=Pharmaceutical%20production%20line%20showing%20building%20blocks%20to%20final%20formulations%20process%2C%20modern%20industrial%20facility%20with%20conveyor%20belts%20and%20packaging%20equipment%2C%20clean%20white%20manufacturing%20environment%20with%20blue%20industrial%20machinery%2C%20professional%20pharmaceutical%20manufacturing%20setting%20demonstrating%20reliable%20production%20chain&width=1200&height=600&seq=production-3&orientation=landscape",
      title: "From Building Blocks to Formulations: One Partner. Total Reliability"
    },
    {
      image: "https://readdy.ai/api/search-image?query=Multiple modern pharmaceutical facilities and research centers layout showing 4 global facilities and 3 R&D centres, aerial view of integrated pharmaceutical platform with clean architecture, professional buildings with glass facades and modern design, comprehensive pharmaceutical infrastructure visualization&width=1200&height=600&seq=facilities-4&orientation=landscape",
      title: "4 Global Facilities | 3 R&D Centres | 1 Integrated Pharma Platform"
    }
  ];

  // Regulatory approvals data
  const regulatoryApprovals = [
    {
      icon: 'ri-shield-check-line',
      title: 'FDA',
      description: 'United States Food and Drug Administration',
      color: '#2879b6',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/08/4-1.jpg'
    },
    {
      icon: 'ri-heart-pulse-line',
      title: 'EDQM',
      description: 'European Directorate for Quality of Medicines',
      color: '#7dc244',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/08/3-1.jpg'
    },
    {
      icon: 'ri-leaf-line',
      title: 'ANVISA',
      description: 'Brazilian Health Regulatory Agency',
      color: '#ee6a31',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/08/anvisa-lg.png'
    },
    {
      icon: 'ri-government-line',
      title: 'Health Canada',
      description: 'Health Canada Regulatory Approval',
      color: '#2879b6',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/08/6-1.jpg'
    },
    {
      icon: 'ri-global-line',
      title: 'Health Canada',
      description: 'Canadian Health Regulatory Authority',
      color: '#7dc244',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/08/5-2.jpg'
    },
    {
      icon: 'ri-verified-badge-line',
      title: 'SFDA',
      description: 'State Food and Drug Administration',
      color: '#ee6a31',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/12/1-3.png'
    },
    {
      icon: 'ri-medal-line',
      title: 'TGA',  
      description: 'Therapeutic Goods Administration',
      color: '#2879b6',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/12/9.png'
    },
    {
      icon: 'ri-award-line',
      title: 'MHRA',
      description: 'Medicines and Healthcare products Regulatory Agency',
      color: '#7dc244',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/12/10.png'
    },
    {
      icon: 'ri-hospital-line',
      title: 'WHO GMP',
      description: 'World Health Organization Good Manufacturing Practice',
      color: '#ee6a31',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/08/2-1.jpg'
    },
    {
      icon: 'ri-check-double-line',
      title: 'PMDA',
      description: 'Japan Pharmaceuticals and Medical Devices Agency',
      color: '#2879b6',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/12/2-3.png'
    },
    {
      icon: 'ri-shield-star-line',
      title: 'NMPA',
      description: 'National Medical Products Administration',
      color: '#7dc244',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/12/8.png'
    },
    {
      icon: 'ri-trophy-line',
      title: 'SUKL',
      description: 'State Institute for Drug Control',
      color: '#ee6a31',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/12/7.png'
    },
    {
      icon: 'ri-star-line',
      title: 'SAHPRA',
      description: 'South African Health Products Regulatory Authority',
      color: '#2879b6',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/09/4-3.jpg'
    },
    {
      icon: 'ri-certificate-line',
      title: 'HSA',
      description: 'Health Sciences Authority Singapore',
      color: '#7dc244',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/09/3-3.jpg'
    },
    {
      icon: 'ri-verified-badge-fill',
      title: 'COFEPRIS',
      description: 'Federal Commission for Protection against Health Risks',
      color: '#ee6a31',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/12/5.png'
    },
    {
      icon: 'ri-honour-line',
      title: 'INVIMA',
      description: 'National Institute for Drug and Food Surveillance',
      color: '#2879b6',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/12/6.png'
    }
  ];


  // Auto-scroll for regulatory carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentRegulatorySlide((prev) => (prev + 1) % regulatoryApprovals.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(timer);
  }, [regulatoryApprovals.length]);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000); // Changed from 5000ms to 8000ms (8 seconds)
    return () => clearInterval(timer);
  }, [slides.length]);

  // Enhanced AOS Animation Hook
  useEffect(() => {
    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          
          // Trigger counter animation for statistics section
          if (entry.target.closest('[data-counter-section]')) {
            animateCounters();
          }
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

// ... existing code ...

  // Counter animation function
  const animateCounters = () => {
    const targets = { scientists: 200, products: 150, markets: 80 };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounters({
        scientists: Math.floor(targets.scientists * progress),
        products: Math.floor(targets.products * progress),
        markets: Math.floor(targets.markets * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets); // Ensure final values
      }
    }, increment);
  };

  // Navigation functions for regulatory carousel
  const nextRegulatorySlide = () => {
    setCurrentRegulatorySlide((prev) => (prev + 1) % regulatoryApprovals.length);
  };

  const prevRegulatorySlide = () => {
    setCurrentRegulatorySlide((prev) => (prev - 1 + regulatoryApprovals.length) % regulatoryApprovals.length);
  };

  const goToRegulatorySlide = (index: number) => {
    setCurrentRegulatorySlide(index);
  };

  // Calculate visible slides for regulatory carousel
  const getVisibleRegulatorySlides = () => {
    const visibleCount = 3; // Show 3 cards at a time
    const slides = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentRegulatorySlide + i) % regulatoryApprovals.length;
      slides.push(regulatoryApprovals[index]);
    }
    return slides;
  };

  const offerings = [
    {
      title: "Legacy of Leadership",
      description: "40+ years of proven expertise in psychotropic APIs and complex generics",
      icon: "ri-award-line",
      color: "#2879b6",
      gradient: "from-blue-500 to-cyan-500",
      metric: "40+",
      unit: "Years"
    },
    {
      title: "Global Trust",
      description: "Strong relationships with top pharma innovators and generics across 80+ countries",
      icon: "ri-global-line",
      color: "#7dc244",
      gradient: "from-green-500 to-emerald-500",
      metric: "80+",
      unit: "Countries"
    },
    {
      title: "Diverse Portfolio",
      description: "Market leadership in CNS, antipsychotics, antihistamines, muscle relaxants, and expanding into high-barrier therapies",
      icon: "ri-briefcase-line",
      color: "#ee6a31",
      gradient: "from-orange-500 to-red-500",
      metric: "CNS",
      unit: "Leadership"
    },
    {
      title: "Innovation Engine",
      description: "DSIR-approved R&D and late-stage development capabilities driving differentiated products and faster scale-up",
      icon: "ri-lightbulb-line",
      color: "#2879b6",
      gradient: "from-blue-500 to-indigo-500",
      metric: "R&D",
      unit: "Centers"
    },
    {
      title: "Integrated Value Chain",
      description: "End-to-end strength across KSM, APIs, and FDFs, reducing supply chain risk and ensuring reliability",
      icon: "ri-links-line",
      color: "#7dc244",
      gradient: "from-green-500 to-teal-500",
      metric: "E2E",
      unit: "Solutions"
    },
    {
      title: "World-Class Manufacturing",
      description: "Multiple sites in Karnataka, Andhra Pradesh, and global hubs in Italy and US, scaling seamlessly from grams to tons",
      icon: "ri-factory-line",
      color: "#ee6a31",
      gradient: "from-orange-500 to-amber-500",
      metric: "6",
      unit: "Facilities"
    },
    {
      title: "Regulatory Excellence",
      description: "Approvals and compliance across US, EU, and other major regulated markets",
      icon: "ri-shield-check-line",
      color: "#2879b6",
      gradient: "from-blue-500 to-purple-500",
      metric: "Global",
      unit: "Approvals"
    },
    {
      title: "Partner of Choice",
      description: "Trusted by 550+ customers worldwide for quality, speed, and regulatory support",
      icon: "ri-handshake-line",
      color: "#7dc244",
      gradient: "from-green-500 to-lime-500",
      metric: "550+",
      unit: "Customers"
    },
    {
      title: "Agile Supply Chain",
      description: "Flexible, resilient operations ensuring consistent delivery in volatile environments",
      icon: "ri-truck-line",
      color: "#ee6a31",
      gradient: "from-orange-500 to-pink-500",
      metric: "Resilient",
      unit: "Operations"
    },
    {
      title: "Sustainability Commitment",
      description: "Embedding green chemistry, water-positive initiatives, and ESG practices into every process",
      icon: "ri-leaf-line",
      color: "#7dc244",
      gradient: "from-green-500 to-emerald-500",
      metric: "ESG",
      unit: "Focused"
    },
    {
      title: "Future-Ready Growth",
      description: "Backed by Refex Group's financial strength, infrastructure, and vision for global expansion",
      icon: "ri-rocket-line",
      color: "#2879b6",
      gradient: "from-blue-500 to-cyan-500",
      metric: "Global",
      unit: "Vision"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header - Updated with Refex Group styling */}
      <Header/>

       <HeroSlider/>

      {/* Enhanced Hero Banner with Bubble Effects */}
    

      {/* What We Offer Section - Brand colors and typography */}
       <section className="py-20 bg-gray-50 relative overflow-hidden" data-aos="fade-in" data-aos-duration="200">
        {/* Background Animated Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full animate-pulse" data-aos="zoom-in" data-aos-delay="300" data-aos-duration="2000"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-green-500/5 rounded-full animate-pulse" data-aos="zoom-in" data-aos-delay="600" data-aos-duration="2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/3 rounded-full animate-pulse" data-aos="zoom-in" data-aos-delay="900" data-aos-duration="2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20" data-aos="slide-up" data-aos-duration="1000">
            {/* Floating Badge */}
           

            {/* Main Title with Staggered Animation */}
            <div className="overflow-hidden mb-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 transform" 
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  data-aos="slide-up" data-aos-delay="400" data-aos-duration="1000">
                <span className="inline-block" data-aos="fade-right" data-aos-delay="500" data-aos-duration="800">What</span>
                <span className="inline-block mx-4" data-aos="fade-up" data-aos-delay="700" data-aos-duration="800">We</span>
                <span className="inline-block" data-aos="fade-left" data-aos-delay="900" data-aos-duration="800" style={{ color: '#2879b6' }}>Offer</span>
              </h2>
            </div>
            
            {/* Enhanced Description */}
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed" 
               style={{ fontFamily: 'Montserrat, sans-serif' }}
               data-aos="fade-up" data-aos-delay="1100" data-aos-duration="1000">
              Comprehensive pharmaceutical solutions backed by decades of expertise and global reach, 
              delivering innovation from lab to life across diverse therapeutic areas.
            </p>

            {/* Animated Divider */}
            <div className="flex justify-center mt-8" data-aos="scale-in" data-aos-delay="1300" data-aos-duration="800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#2879b6', animationDelay: '0s' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#7dc244', animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#ee6a31', animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* Enhanced Card Grid Layout with Advanced Animations */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
  {offerings.map((offering, index) => {
    // Correctly calculates a different delay for each card to create a staggered effect.
    // The delay increases by 100ms for each card.
    const staggerDelay = index * 100;
    
    return (
      <div 
        key={index} 
        className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:rotate-1 cursor-pointer overflow-hidden border border-gray-100"
        data-aos="fade-up" // Changed to a normal "fade-up" animation
        data-aos-delay={staggerDelay} // Applies the correct sequential delay
        data-aos-duration="800"
        data-aos-easing="ease-out-cubic"
      >
        
        {/* Enhanced Background Effects */}
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-20 transition-all duration-700 rounded-full blur-xl`} 
             style={{ background: `radial-gradient(circle, ${offering.color}, ${offering.color}88)` }}>
        </div>
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: offering.color, animationDuration: '2s' }}></div>
          <div className="absolute bottom-8 left-6 w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: offering.color, animationDelay: '0.5s', animationDuration: '3s' }}></div>
          <div className="absolute top-1/2 left-4 w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: offering.color, animationDelay: '1s', animationDuration: '2.5s' }}></div>
        </div>
        
        <div className="relative z-10 p-8">
          {/* Enhanced Header Section */}
          <div className="flex items-start justify-between mb-8">
            <div className={`relative w-18 h-18 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`} 
                 style={{ backgroundColor: offering.color }}>
              <i className={`${offering.icon} text-2xl text-white group-hover:scale-110 transition-transform duration-300`}></i>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-pulse" 
                   style={{ backgroundColor: offering.color, filter: 'blur(8px)' }}>
              </div>
            </div>
            
            {/* Enhanced Metric Badge */}
            <div className="text-right transform group-hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold group-hover:animate-pulse" style={{ color: offering.color }}>
                {offering.metric}
              </div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                {offering.unit}
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <h3 className="text-xl font-bold text-gray-800 mb-5 group-hover:scale-105 group-hover:text-gray-900 transition-all duration-500" 
              style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {offering.title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-500 mb-8" 
             style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {offering.description}
          </p>

          {/* Enhanced Bottom Accent with Progress Bar Effect */}
          <div className="relative">
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transform transition-all duration-1000 scale-x-0 group-hover:scale-x-100 origin-left`} 
                   style={{ backgroundColor: offering.color }}>
              </div>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 transform -skew-x-12 group-hover:animate-pulse"
                 style={{ animationDuration: '2s' }}>
            </div>
          </div>
        </div>

        {/* Enhanced Hover Border Effect */}
        <div className={`absolute inset-0 border-2 border-transparent rounded-3xl transition-all duration-700 opacity-0 group-hover:opacity-50 group-hover:scale-105`} 
             style={{ borderColor: offering.color, filter: 'blur(1px)' }}>
        </div>
        
        {/* Corner Accent */}
        <div className="absolute top-0 left-0 w-0 h-0 border-t-4 border-l-4 border-transparent group-hover:border-t-8 group-hover:border-l-8 transition-all duration-500 rounded-tl-3xl" 
             style={{ borderTopColor: offering.color, borderLeftColor: offering.color }}>
        </div>
      </div>
    );
  })}
</div>

          {/* Enhanced Call to Action */}
        
        </div>
      </section>
     

      {/* Statistics Section - Brand colors and typography */}
      <section className="py-16 relative" style={{ background: 'linear-gradient(135deg, rgba(125, 194, 68, 0.1), rgba(40, 121, 182, 0.1))' }} data-aos="fade-up" data-aos-duration="1000" data-counter-section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="800">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 hover:scale-105 transition-transform  duration-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Global Impact & Excellence
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed hover:text-gray-800 transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Trusted by healthcare professionals worldwide with proven expertise and unwavering commitment to quality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
            {/* Scientists Card with Image */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-8 hover:rotate-2 cursor-pointer border-l-4" style={{ borderColor: '#2879b6' }} data-aos="zoom-in" data-aos-delay="300" data-aos-duration="600">
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Professional%20pharmaceutical%20scientists%20and%20researchers%20working%20in%20modern%20laboratory%20with%20advanced%20scientific%20equipment%2C%20team%20of%20dedicated%20professionals%20in%20white%20lab%20coats%20conducting%20pharmaceutical%20research%20and%20development%2C%20clean%20sterile%20laboratory%20environment%20with%20microscopes%20and%20analytical%20instruments&width=400&height=300&seq=scientists-research&orientation=landscape"
                  alt="Scientists & Researchers"
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-600/20 to-transparent"></div>
                
                {/* Floating Icon */}
                {/* <div className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" style={{ backgroundColor: 'rgba(40, 121, 182, 0.9)' }}>
                  <i className="ri-microscope-line text-xl text-white"></i>
                </div> */}
              </div>
              
              {/* Card Content */}
              <div className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#2879b6', fontFamily: 'Montserrat, sans-serif' }}>
                    {counters.scientists}+
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-blue-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Scientists & Researchers
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Dedicated professionals driving innovation in pharmaceutical research and development
                  </p>
                </div>
              </div>
            </div>

            {/* Products Card with Image */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-8 hover:rotate-2 cursor-pointer border-l-4" style={{ borderColor: '#7dc244' }} data-aos="zoom-in" data-aos-delay="450" data-aos-duration="600">
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Comprehensive%20portfolio%20of%20high-quality%20pharmaceutical%20products%20and%20APIs%2C%20modern%20pharmaceutical%20manufacturing%20facility%20with%20medicine%20bottles%20and%20complex%20generic%20formulations%2C%20professional%20pharmaceutical%20production%20line%20with%20quality%20control%20systems&width=400&height=300&seq=pharma-products&orientation=landscape"
                  alt="Pharmaceutical Products"
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-green-600/20 to-transparent"></div>
                
                {/* Floating Icon */}
                {/* <div className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" style={{ backgroundColor: 'rgba(125, 194, 68, 0.9)' }}>
                  <i className="ri-medicine-bottle-line text-xl text-white"></i>
                </div> */}
              </div>
              
              {/* Card Content */}
              <div className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#7dc244', fontFamily: 'Montserrat, sans-serif' }}>
                    {counters.products}+
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-green-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Pharmaceutical Products
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Comprehensive portfolio of high-quality APIs and complex generic formulations
                  </p>
                </div>
              </div>
            </div>

            {/* Markets Card with Image */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-8 hover:rotate-2 cursor-pointer border-l-4" style={{ borderColor: '#ee6a31' }} data-aos="zoom-in" data-aos-delay="600" data-aos-duration="600">
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src="https://readdy.ai/api/search-image?query=Global%20pharmaceutical%20markets%20and%20international%20healthcare%20distribution%20network%2C%20world%20map%20showing%20diverse%20international%20markets%20with%20regulatory%20excellence%2C%20professional%20pharmaceutical%20distribution%20across%20multiple%20countries%20with%20modern%20logistics&width=400&height=300&seq=global-markets&orientation=landscape"
                  alt="Global Markets"
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 via-orange-600/20 to-transparent"></div>
                
                {/* Floating Icon */}
                {/* <div className="absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" style={{ backgroundColor: 'rgba(238, 106, 49, 0.9)' }}>
                  <i className="ri-global-line text-xl text-white"></i>
                </div> */}
              </div>
              
              {/* Card Content */}
              <div className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: '#ee6a31', fontFamily: 'Montserrat, sans-serif' }}>
                    {counters.markets}+
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-orange-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Global Markets
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Serving healthcare needs across diverse international markets with regulatory excellence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section - Brand colors and typography */}
    

      {/* Regulatory Approvals Section - Enhanced with Interactive Controls */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
           
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Regulatory Approvals
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Our commitment to quality and compliance is validated by approvals from leading global regulatory authorities, ensuring the highest standards in pharmaceutical manufacturing.
            </p>
          </div>

          {/* Logo Only Carousel with Navigation Arrows - Shows exactly 3 logos */}
          <div className="relative mb-16">
            {/* Left Arrow */}
            <button 
              onClick={prevRegulatorySlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-xl border border-gray-200 hover:border-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <i className="ri-arrow-left-line text-xl text-gray-600 hover:text-blue-600"></i>
            </button>

            {/* Right Arrow */}
            <button 
              onClick={nextRegulatorySlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white hover:bg-gray-50 rounded-full shadow-xl border border-gray-200 hover:border-gray-300 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <i className="ri-arrow-right-line text-xl text-gray-600 hover:text-blue-600"></i>
            </button>

            {/* Carousel Container - Shows exactly 3 logos */}
            {/* Carousel Container - Shows exactly 4 logos */}
<div className="overflow-hidden px-16">
  <div className="flex justify-center items-center space-x-8">
    {regulatoryApprovals.slice(currentRegulatorySlide, currentRegulatorySlide + 4).map((item, index) => (
      <div
        key={currentRegulatorySlide + index}
        className="flex-shrink-0 flex items-center justify-center mb-2 mt-2"
      >
        <div className="flex items-center justify-center h-32 w-64 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 border border-gray-100">
          <img
            src={item.image}
            alt={item.title}
            className="max-h-20 max-w-48 object-contain transition-transform duration-500 cursor-pointer"
            style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
          />
        </div>
      </div>
    ))}
  </div>
</div>

{/* Dot Indicators - Updated for 4-logo groups */}
<div className="flex justify-center mt-10 space-x-2">
  {Array.from({ length: Math.ceil(regulatoryApprovals.length / 4) }, (_, index) => (
    <button
      key={index}
      onClick={() => goToRegulatorySlide(index * 4)}
      className={`w-3 h-3 rounded-full transition-all duration-300 ${
        Math.floor(currentRegulatorySlide / 4) === index
          ? 'bg-blue-600 w-8'
          : 'bg-gray-300 hover:bg-gray-400'
      }`}
    />
  ))}
</div>

          </div>

          {/* Bottom CTA Section */}
        
        </div>
      </section>

   <Footer/>

       
        {/* Enhanced Animation Styles - Added more AOS animations */}
        <style >{`
        [data-aos] {
          opacity: 0;
          transition-property: transform, opacity;
          transition-duration: 0.6s;
          transition-timing-function: ease-out;
        }

        [data-aos].aos-animate {
          opacity: 1;
        }

        [data-aos="fade-up"] {
          transform: translateY(30px);
        }
        [data-aos="fade-up"].aos-animate {
          transform: translateY(0);
        }

        [data-aos="fade-down"] {
          transform: translateY(-30px);
        }
        [data-aos="fade-down"].aos-animate {
          transform: translateY(0);
        }

        [data-aos="fade-left"] {
          transform: translateX(30px);
        }
        [data-aos="fade-left"].aos-animate {
          transform: translateX(0);
        }

        [data-aos="fade-right"] {
          transform: translateX(-30px);
        }
        [data-aos="fade-right"].aos-animate {
          transform: translateX(0);
        }

        [data-aos="zoom-in"] {
          transform: scale(0.95);
        }
        [data-aos="zoom-in"].aos-animate {
          transform: scale(1);
        }

        [data-aos="fade-in"] {
          opacity: 0;
        }
        [data-aos="fade-in"].aos-animate {
          opacity: 1;
        }

        [data-aos="slide-left"] {
          transform: translateX(50px);
        }
        [data-aos="slide-left"].aos-animate {
          transform: translateX(0);
        }

        [data-aos="slide-right"] {
          transform: translateX(-50px);
        }
        [data-aos="slide-right"].aos-animate {
          transform: translateX(0);
        }

        [data-aos="slide-up"] {
          transform: translateY(50px);
        }
        [data-aos="slide-up"].aos-animate {
          transform: translateY(0);
        }

        /* Micro bubble animations */
        ${Array.from({ length: 15 }, (_, i) => `
          @keyframes float-bubble-micro-${i + 1} {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.6; }
            25% { transform: translateY(${-10 - Math.random() * 20}px) translateX(${10 - Math.random() * 20}px) rotate(${90 + Math.random() * 180}deg); opacity: 0.8; }
            50% { transform: translateY(${-20 - Math.random() * 30}px) translateX(${-5 - Math.random() * 15}px) rotate(${180 + Math.random() * 180}deg); opacity: 1; }
            75% { transform: translateY(${-5 - Math.random() * 15}px) translateX(${15 - Math.random() * 30}px) rotate(${270 + Math.random() * 180}deg); opacity: 0.7; }
          }
        `).join('')}

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Simple transitions */
        * {
          transition: color 0.3s ease, background-color 0.3s ease;
        }

        /* Bubble hover effects */
        .bubble-large:hover {
          transform: scale(1.1);
          transition: transform 0.3s ease;
        }

        .bubble-medium:hover {
          transform: scale(1.15);
          transition: transform 0.3s ease;
        }

        .bubble-small:hover {
          transform: scale(1.2);
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}
