
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import  journeyImage from "../../images/jou.png"
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import Rlfc from "../../images/RLFC-Logo.jpg"
import Extrovis from "../../images/Extrovis.png"
import User from "../../images/images.png"

const About = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('journey');
  const [selectedLeader, setSelectedLeader] = useState<any>(null);

  // Initialize AOS when component mounts
  useEffect(() => {
    const initAOS = async () => {
      try {
        if (typeof window !== 'undefined') {
          const AOS = (await import('aos')).default;
          AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out',
          });
        }
      } catch (error) {
        console.warn('AOS failed to initialize:', error);
      }
    };

    initAOS();
  }, []);

  // Handle navigation state for tab activation
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Scroll to show the tab content properly
    setTimeout(() => {
      const tabSection = document.querySelector('.tab-content-section');
      if (tabSection) {
        const headerHeight = 80; // Account for sticky header
        const elementPosition = tabSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 20; // Extra 20px padding
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll to top if section not found
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 150); // Increased delay to ensure content is fully rendered
  };

  const closePopup = () => {
    setSelectedLeader(null);
  };

  const leaders = [
    // Advisory Board
    {
      id: 1,
      name: 'Dr. Brian Tempest',
      position: 'Advisor',
      category: 'Advisory Board',
      image: User,
      color: 'refex-blue',
      description: '45+ years of pharma leadership experience, former CEO of Ranbaxy – instrumental in shaping global pharma presence.',
      achievements: [
        '45+ years of pharma leadership experience',
        'Former CEO, Ranbaxy – instrumental in shaping global pharma presence',
        'Deep expertise in strategy, governance & global pharmaceutical markets',
        'Advisor to boards & shareholders of leading pharma companies',
        'Recognized thought leader with proven foresight in industry transformation'
      ],
      experience: '45+ Years',
      education: 'Pharmaceutical Leadership'
    },
    {
      id: 2,
      name: 'K. Raghavendra Rao',
      position: 'Advisor',
      category: 'Advisory Board',
            image: User,

      color: 'refex-green',
      description: '40+ years of pharma industry expertise, founder of Orchid Pharma – built from the ground up to a leading company.',
      achievements: [
        '40+ years of pharma industry expertise',
        'Founder of Orchid Pharma – built from the ground up to a leading company',
        'Educational background: B.Com + MBA (IIM Ahmedabad)',
        'Entrepreneurial excellence in product selection, innovation & strategic growth',
        'Influential leader shaping the Indian pharmaceutical sector with lasting impact'
      ],
      experience: '40+ Years',
      education: 'B.Com + MBA (IIM Ahmedabad)'
    },
    // Technical Leadership Team
    {
      id: 3,
      name: 'Rajesh Naik',
      position: 'Executive Director – Operations',
      category: 'Technical Leadership Team',
            image: User,

      color: 'refex-orange',
      description: "26+ years in pharma technical operations. Ex-Dr. Reddy's, GSK, Biocon & Zydus; expert in manufacturing, SCM, EHS & operational excellence.",
      achievements: [
        '26+ years in pharma technical operations',
        "Ex-Dr. Reddy's, GSK, Biocon & Zydus experience",
        'Expert in manufacturing and supply chain management',
        'Specialist in EHS & operational excellence',
        'Led multiple facility scale-up projects'
      ],
      experience: '26+ Years',
      education: 'Technical Operations'
    },
    {
      id: 4,
      name: 'Dr. Ramasubramanian Shanmuganathan',
      position: 'Head R & D',
      category: 'Technical Leadership Team',
            image: User,

      color: 'refex-blue',
      description: '29+ years in pharma R&D leadership with experience at AstraZeneca, Syngene, Cadila & Jubilant. Brings deep scientific expertise to drive innovation and pipeline growth.',
      achievements: [
        '29+ years in pharma R&D leadership',
        'Experience at AstraZeneca, Syngene, Cadila & Jubilant',
        'Deep scientific expertise in drug development',
        'Drives innovation and pipeline growth',
        'Led multiple successful product launches'
      ],
      experience: '29+ Years',
      education: 'PhD, Pharmaceutical Sciences'
    },
    {
      id: 5,
      name: 'Mathijs Steegstra',
      position: 'Global Head of Scientific Affairs',
      category: 'Technical Leadership Team',
            image: User,

      color: 'refex-green',
      description: '20+ years in pharma quality & regulatory across USA, Europe & MENA. Pharmacy graduate from Groningen; expertise in approvals, compliance & sterile facility management.',
      achievements: [
        '20+ years in pharma quality & regulatory',
        'Experience across USA, Europe & MENA regions',
        'Pharmacy graduate from Groningen University',
        'Expertise in regulatory approvals and compliance',
        'Specialist in sterile facility management'
      ],
      experience: '20+ Years',
      education: 'Pharmacy Graduate, Groningen'
    },
    {
      id: 6,
      name: 'Dr. Rajasekhara Reddy',
      position: 'Formulations R&D Head',
      category: 'Technical Leadership Team',
            image: User,

      color: 'refex-orange',
      description: "15+ years in formulations R&D; expertise in complex generics (liposomes, microspheres, nanoparticles, drug–device combos). PhD in Pharma Sciences; ex-Alembic, Hospira, Dr. Reddy's.",
      achievements: [
        '15+ years in formulations R&D',
        'Expertise in complex generics (liposomes, microspheres, nanoparticles)',
        'Specialist in drug–device combination products',
        'PhD in Pharmaceutical Sciences',
        "Ex-Alembic, Hospira, Dr. Reddy's"
      ],
      experience: '15+ Years',
      education: 'PhD, Pharmaceutical Sciences'
    },
    // Management Team
    {
      id: 7,
      name: 'Anil Jain',
      position: 'Chairman & MD, Refex Group',
      category: 'Management Team',
            image: User,

      color: 'refex-blue',
      description: 'Visionary entrepreneur who built Refex from scratch, championing innovation, sustainability, and Make-in-India.',
      achievements: [
        'Built Refex Group from scratch',
        'Champion of innovation and sustainability',
        'Leader in Make-in-India initiatives',
        'Visionary entrepreneur with proven track record',
        'Strategic leader driving group expansion'
      ],
      experience: '40+ Years',
      education: 'Entrepreneurial Leadership'
    },
    {
      id: 8,
      name: 'Dinesh Agarwal',
      position: 'Group CEO, Refex Group',
      category: 'Management Team',
            image: User,

      color: 'refex-green',
      description: "Chartered Accountant with 20+ years' experience, renowned for strategic insight and execution, shaping Refex's growth into sustainable success.",
      achievements: [
        "Chartered Accountant with 20+ years' experience",
        'Renowned for strategic insight and execution',
        "Shaped Refex's growth into sustainable success",
        'Expert in financial strategy and operations',
        'Leader in business transformation'
      ],
      experience: '20+ Years',
      education: 'Chartered Accountant'
    },
    {
      id: 9,
      name: 'Mr. Hanumantha Rao Kamma',
      position: 'Chief Strategy Officer',
      category: 'Management Team',
            image: User,

      color: 'refex-orange',
      description: "23+ years in pharma with expertise in strategy, BD & sourcing. Master's in International Management; ex-senior leader across global markets.",
      achievements: [
        '23+ years in pharmaceutical industry',
        'Expertise in strategy, business development & sourcing',
        "Master's in International Management",
        'Ex-senior leader across global markets',
        'Strategic planning and execution specialist'
      ],
      experience: '23+ Years',
      education: "Master's in International Management"
    },
    {
      id: 10,
      name: 'Sharat Narasapur',
      position: 'CEO, Refex Life Sciences',
      category: 'Management Team',
            image: User,

      color: 'refex-blue',
      description: "25+ years in chemicals & pharma, ex-Dr. Reddy's & SeQuent MD. Strategic leader blending technical expertise with commercial acumen for sustainable growth.",
      achievements: [
        '25+ years in chemicals & pharmaceutical industry',
        "Ex-Dr. Reddy's & SeQuent Managing Director",
        'Strategic leader with technical expertise',
        'Commercial acumen for sustainable growth',
        'Expert in business transformation'
      ],
      experience: '25+ Years',
      education: 'Chemical & Pharmaceutical Leadership'
    },
    {
      id: 11,
      name: 'Dr. Janos Vaczi',
      position: 'Managing Director and CEO',
      category: 'Management Team',
            image: User,

      color: 'refex-green',
      description: '25+ years in pharma with global MNC leadership. MD, Hungary; ex-President International Ops & senior roles across Europe.',
      achievements: [
        '25+ years in pharmaceutical industry',
        'Global MNC leadership experience',
        'MD qualification from Hungary',
        'Ex-President International Operations',
        'Senior roles across European markets'
      ],
      experience: '25+ Years',
      education: 'MD, Hungary'
    },
    {
      id: 12,
      name: 'Amit Shrivastava',
      position: 'Chief Marketing Officer',
      category: 'Management Team',
            image: User,

      color: 'refex-orange',
      description: 'President – Marketing, deep expertise in the API space, with strengths in portfolio strategy, competitive intelligence, and regulatory affairs, enabling growth in high-value, niche segments.',
      achievements: [
        'President – Marketing with deep API expertise',
        'Strengths in portfolio strategy and competitive intelligence',
        'Expert in regulatory affairs',
        'Enables growth in high-value, niche segments',
        'Strategic marketing leadership'
      ],
      experience: '20+ Years',
      education: 'Marketing & Business Strategy'
    },
    {
      id: 13,
      name: 'PV Raghavendra Rao',
      position: 'CFO',
      category: 'Management Team',
            image: User,

      color: 'refex-blue',
      description: "CA with 25 years in financial management across pharma. Ex-CFO at Sequent, Macleods & Solara; 14 years at Dr. Reddy's. Expert in FP&A, taxation, treasury & strategy with a Goldratt Master Executive Certificate.",
      achievements: [
        'CA with 25 years in financial management',
        'Ex-CFO at Sequent, Macleods & Solara',
        '14 years experience at Dr. Reddy\'s',
        'Expert in FP&A, taxation, treasury & strategy',
        'Goldratt Master Executive Certificate holder'
      ],
      experience: '25+ Years',
      education: 'CA, Goldratt Master Executive Certificate'
    },
    {
      id: 14,
      name: 'Srinivasan Pagadala',
      position: 'Chief HR Officer',
      category: 'Management Team',
            image: User,

      color: 'refex-green',
      description: '25+ years in HR across pharma & healthcare. Specialist in talent, transformation & employee relations. Ex-Dr. Reddy\'s, Novartis, GVK Bio, Biological E, and Solara Active Pharma.',
      achievements: [
        '25+ years in HR across pharma & healthcare',
        'Specialist in talent, transformation & employee relations',
        'Ex-Dr. Reddy\'s, Novartis, GVK Bio experience',
        'Experience at Biological E and Solara Active Pharma',
        'Expert in organizational development'
      ],
      experience: '25+ Years',
      education: 'HR & Organizational Development'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      'refex-blue': { bg: 'from-[#2879b6] to-[#2879b6]', text: 'text-[#2879b6]', border: 'border-[#2879b6]' },
      'refex-green': { bg: 'from-[#7dc244] to-[#7dc244]', text: 'text-[#7dc244]', border: 'border-[#7dc244]' },
      'refex-orange': { bg: 'from-[#ee6a31] to-[#ee6a31]', text: 'text-[#ee6a31]', border: 'border-[#ee6a31]' }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap['refex-blue'];
  };

   const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Highlight tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["journey", "vision", "leadership", "management"];
      const scrollPos = 100; // Adjust offset if needed

      for (const sec of sections) {
        const section = document.getElementById(sec);
         console.log("ssss", section)
        if (section) {
          if (
            scrollPos >= section.offsetTop &&
            scrollPos < section.offsetTop + section.offsetHeight
          ) {
            setActiveTab(sec);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}

         <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20corporate%20headquarters%20building%20with%20professional%20architecture%2C%20dark%20blue%20and%20navy%20color%20scheme%2C%20contemporary%20glass%20facade%2C%20corporate%20excellence%20atmosphere%2C%20professional%20healthcare%20company%20facilities%2C%20business%20leadership%20environment%2C%20clean%20modern%20design&width=1920&height=800&seq=about-hero-dark&orientation=landscape')`,
        }}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-lg md:text-6xl  font-bold text-white mb-6 leading-tight font-montserrat"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <span className="block">  About RLS</span>
              {/* <span className="block mt-1">Sciences</span> */}
            </h1>
            <p
              className="text-base text-white max-w-4xl mx-auto font-montserrat mb-2"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              
              <span className="text-blue-300 font-semibold">Refex Life Sciences (RLS),</span>
               a Refex Group company, was born from the strategic integration 
                of RL Fine Chem's four-decade legacy in active pharmaceutical ingredients (APIs) with 
                the diversified industrial strength of the Refex Group. Established in 2022, RLS represents 
                Refex Group's decisive entry into healthcare, uniting deep pharmaceutical expertise with 
                financial resilience, operational excellence, and global vision.
            </p>
            <p
              className="text-base text-white max-w-4xl mx-auto font-montserrat"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
               Building on RLFC's leadership in psychotropic and niche APIs, and strengthened further 
                through the acquisitions of Extrovis (Switzerland) and Modepro (Pune), RLS today stands 
                as a fully integrated life sciences platform with capabilities across KSM, APIs, and 
                finished formulations committed to advancing global healthcare with innovation, quality, and trust.
              Refex Life Sciences (RLS), a Refex Group company, was born from the strategic integration
              of RL Fine Chem&apos;s four-decade legacy in active pharmaceutical ingredients (APIs) with
              the diversified industrial strength of the Refex Group.
            </p>
          </div>

             <div className="flex flex-wrap justify-center items-center gap-12 mt-16">
            {/* RL Fine Chem */}
            <div 
              className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-110"
              onClick={() => window.open('https://www.rlfinechem.com/about-rlfc/', '_blank')}
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="100"
            >
             
              <div className="w-32 h-32 bg-white backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 p-4">
                <img 
                  src={Rlfc} 
                  alt="Modepro Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#2879b6] text-white rounded-xl font-semibold hover:bg-[#1e5f8c] transition-all duration-300 transform hover:scale-105 font-montserrat whitespace-nowrap">
                <span>Know More</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
              </button>
            </div>

            {/* Modepro */}
            <div 
              className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-110"
              onClick={() => window.open('https://modepro.co.in/aboutus.html', '_blank')}
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              <div className="w-32 h-32 bg-white backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 p-4">
                <img 
                  src="https://static.readdy.ai/image/7319831acd7ae6004cda33ed0f992ba8/2bfdf90f2291d5a627c6ad1606471a6b.png" 
                  alt="Modepro Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#7dc244] text-white rounded-xl font-semibold hover:bg-[#5ba832] transition-all duration-300 transform hover:scale-105 font-montserrat whitespace-nowrap">
                <span>Know More</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
              </button>
            </div>

            {/* Extrovis */}
            <div 
              className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-110"
              onClick={() => window.open('https://www.extrovis.com/our-company/', '_blank')}
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="300"
            >
             
              <div className="w-32 h-32 bg-white backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 p-4">
                <img 
                  src={Extrovis} 
                  alt="Modepro Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#ee6a31] text-white rounded-xl font-semibold hover:bg-[#d55a28] transition-all duration-300 transform hover:scale-105 font-montserrat whitespace-nowrap">
                <span>Know More</span>
                <i className="ri-arrow-right-line group-hover:translate-x-1 transition-transform duration-300"></i>
              </button>
            </div>
          </div>
        </div>
      </section>
 

      {/* About RLS Section */}

         <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40 tab-content-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center overflow-x-auto pb-2" data-aos="fade-in" data-aos-duration="800">
            <div className="flex space-x-3 md:space-x-6 min-w-max px-4 md:px-0">
              <button
                onClick={() => scrollToSection("journey")}
                className={`px-4 md:px-6 py-3 rounded-2xl font-semibold text-xs md:text-sm transition-all duration-500 whitespace-nowrap hover:scale-110 cursor-pointer font-montserrat ${
                  activeTab === "journey"
                    ? "bg-gradient-to-r from-[#2879b6] to-[#2879b6] text-white shadow-xl transform scale-110"
                    : "text-gray-600 hover:text-[#2879b6] hover:bg-blue-50 hover:shadow-lg border border-[#2879b6]/20"
                }`}
              >
                <i className="ri-roadmap-line mr-1 md:mr-2"></i>
                <span className="hidden sm:inline">Our Journey</span>
                <span className="sm:hidden">Journey</span>
              </button>

              <button
                onClick={() => scrollToSection("vision")}
                className={`px-4 md:px-6 py-3 rounded-2xl font-semibold text-xs md:text-sm transition-all duration-500 whitespace-nowrap hover:scale-110 cursor-pointer font-montserrat ${
                  activeTab === "vision"
                    ? "bg-gradient-to-r from-[#7dc244] to-[#7dc244] text-white shadow-xl transform scale-110"
                    : "text-gray-600 hover:text-[#7dc244] hover:bg-green-50 hover:shadow-lg border border-[#7dc244]/20"
                }`}
              >
                <i className="ri-eye-line mr-1 md:mr-2"></i>
                <span className="hidden sm:inline">Our Vision & Mission</span>
                <span className="sm:hidden">Vision</span>
              </button>

              <button
                onClick={() => scrollToSection("leadership")}
                className={`px-4 md:px-6 py-3 rounded-2xl font-semibold text-xs md:text-sm transition-all duration-500 whitespace-nowrap hover:scale-110 cursor-pointer font-montserrat ${
                  activeTab === "leadership"
                    ? "bg-gradient-to-r from-[#ee6a31] to-[#ee6a31] text-white shadow-xl transform scale-110"
                    : "text-gray-600 hover:text-[#ee6a31] hover:bg-orange-50 hover:shadow-lg border border-[#ee6a31]/20"
                }`}
              >
                <i className="ri-team-line mr-1 md:mr-2"></i>
                <span className="hidden sm:inline">Leadership Team</span>
                <span className="sm:hidden">Leadership</span>
              </button>

              <button
                onClick={() => scrollToSection("management")}
                className={`px-4 md:px-6 py-3 rounded-2xl font-semibold text-xs md:text-sm transition-all duration-500 whitespace-nowrap hover:scale-110 cursor-pointer font-montserrat ${
                  activeTab === "management"
                    ? "bg-gradient-to-r from-[#2879b6] to-[#2879b6] text-white shadow-xl transform scale-110"
                    : "text-gray-600 hover:text-[#2879b6] hover:bg-blue-50 hover:shadow-lg border border-[#2879b6]/20"
                }`}
              >
                <i className="ri-user-star-line mr-1 md:mr-2"></i>
                <span className="hidden sm:inline">Management Team</span>
                <span className="sm:hidden">Management</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center mb-12" data-aos="fade-down" data-aos-duration="1000">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 hover:scale-105 transition-transform duration-500 text-gray-800 font-montserrat">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed hover:text-gray-800 transition-colors duration-300 font-montserrat">
                From pioneering refrigerants to transforming healthcare - a roadmap of innovation, growth, and strategic evolution with emphasis on pharmaceutical excellence from 2022-23
              </p>
            </div>

            <div className="flex justify-center mb-16" data-aos="fade-up" data-aos-duration="1200">
              <div className="max-w-7xl w-full">
                <img
                  src={journeyImage}
                  alt="Refex Group Milestones Timeline"
                  className="w-full h-auto object-contain  hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-2 bg-white relative overflow-hidden">
         <h2 className="text-3xl py-3 text-center md:text-4xl font-bold mb-4 text-gray-800 font-montserrat">
         Our Vision & Our Mission
        </h2>
         <section className="py-2 bg-white relative overflow-hidden">
                <div className="absolute inset-0">
                  <div 
                    className="absolute top-20 left-10 w-96 h-96 bg-[#2879b6]/10 rounded-full blur-3xl"
                    data-aos="fade-right"
                    data-aos-duration="2000"
                    data-aos-delay="200"
                  ></div>
                  <div 
                    className="absolute bottom-32 right-20 w-80 h-80 bg-[#7dc244]/10 rounded-full blur-3xl"
                    data-aos="fade-left"
                    data-aos-duration="2000"
                    data-aos-delay="400"
                  ></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  {/* Vision */}
                  <div className="mb-24">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                      <div 
                        className="w-full lg:w-1/2 order-2 lg:order-1"
                        data-aos="fade-right"
                        data-aos-duration="1000"
                        data-aos-delay="200"
                      >
                        <div className="relative">
                          <img 
                            alt="Our Vision" 
                            className="w-full h-64 md:h-80 lg:h-96 object-cover object-center rounded-3xl shadow-2xl" 
                            src="https://readdy.ai/api/search-image?query=Futuristic%20pharmaceutical%20vision%20concept%20with%20innovative%20drug%20development%20laboratory%2C%20advanced%20technology%2C%20scientists%20working%20on%20life-changing%20medications%2C%20modern%20research%20facility%20with%20blue%20and%20cyan%20lighting%2C%20professional%20healthcare%20innovation%20atmosphere&width=600&height=400&seq=vision-concept&orientation=landscape"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2879b6]/20 to-transparent rounded-3xl"></div>
                          <div 
                            className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#2879b6] to-[#2879b6] rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl"
                            data-aos="zoom-in"
                            data-aos-duration="800"
                            data-aos-delay="800"
                          >
                            <i className="ri-eye-line text-2xl lg:text-3xl text-white"></i>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className="w-full lg:w-1/2 space-y-6 lg:space-y-8 order-1 lg:order-2"
                        data-aos="fade-left"
                        data-aos-duration="1000"
                        data-aos-delay="400"
                      >
                        <div className="flex items-center gap-4 mb-6 lg:mb-8">
                          <div 
                            className="w-2 h-12 lg:h-16 bg-gradient-to-b from-[#2879b6] to-[#2879b6] rounded-full"
                            data-aos="slide-down"
                            data-aos-duration="800"
                            data-aos-delay="600"
                          ></div>
                          <h3 
                            className="text-2xl lg:text-3xl font-bold text-gray-800 font-montserrat"
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay="700"
                          >Our Vision</h3>
                        </div>
                        
                        <div 
                          className="bg-gradient-to-br from-[#2879b6]/10 to-[#2879b6]/5 rounded-2xl p-6 lg:p-8 shadow-lg border border-[#2879b6]/20"
                          data-aos="zoom-in"
                          data-aos-duration="1000"
                          data-aos-delay="800"
                        >
                          <p className="text-base lg:text-lg text-gray-700 leading-relaxed font-montserrat">
                            To transform global healthcare by building an innovation driven, integrated pharmaceutical platform from India, delivering affordable, accessible and life changing drugs that address unmet patient needs – from lifestyle diseases to mental health – with a relentless commitment to quality, differentiation and impact.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div 
                            className="bg-white rounded-xl p-4 shadow-md border-l-4 border-[#2879b6]"
                            data-aos="slide-up"
                            data-aos-duration="800"
                            data-aos-delay="1000"
                          >
                            <h4 className="font-bold text-gray-800 mb-2 font-montserrat text-sm lg:text-base">Innovation Driven</h4>
                            <p className="text-xs lg:text-sm text-gray-600 font-montserrat">Advanced pharmaceutical platform</p>
                          </div>
                          <div 
                            className="bg-white rounded-xl p-4 shadow-md border-l-4 border-[#2879b6]"
                            data-aos="slide-up"
                            data-aos-duration="800"
                            data-aos-delay="1200"
                          >
                            <h4 className="font-bold text-gray-800 mb-2 font-montserrat text-sm lg:text-base">Global Impact</h4>
                            <p className="text-xs lg:text-sm text-gray-600 font-montserrat">Life-changing healthcare solutions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mission */}
                  <div>
                    <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
                      <div 
                        className="w-full lg:w-1/2 order-2 lg:order-1"
                        data-aos="fade-left"
                        data-aos-duration="1000"
                        data-aos-delay="200"
                      >
                        <div className="relative">
                          <img 
                            alt="Our Mission" 
                            className="w-full h-full md:h-full lg:h-fullobject-cover object-center rounded-3xl shadow-2xl" 
                            src="https://readdy.ai/api/search-image?query=Pharmaceutical%20mission%20concept%20showing%20integrated%20supply%20chain%20and%20AI-powered%20research%2C%20modern%20production%20facility%20with%20advanced%20automation%2C%20scientists%20collaborating%20on%20drug%20development%2C%20green%20and%20emerald%20lighting%20atmosphere%2C%20professional%20healthcare%20manufacturing%20environment&width=600&height=600&seq=mission-concept&orientation=squarish"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#7dc244]/20 to-transparent rounded-3xl"></div>
                          <div 
                            className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#7dc244] to-[#7dc244] rounded-3xl flex items-center justify-center shadow-2xl"
                            data-aos="zoom-in"
                            data-aos-duration="800"
                            data-aos-delay="800"
                          >
                            <i className="ri-eye-line  text-2xl text-white"></i>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className="w-full lg:w-1/2 space-y-6 lg:space-y-8 order-1 lg:order-2"
                        data-aos="fade-right"
                        data-aos-duration="1000"
                        data-aos-delay="400"
                      >
                        <div className="flex items-center gap-4 mb-6 lg:mb-8">
                          <div 
                            className="w-2 h-12 lg:h-16 bg-gradient-to-b from-[#7dc244] to-[#7dc244] rounded-full"
                            data-aos="slide-down"
                            data-aos-duration="800"
                            data-aos-delay="600"
                          ></div>
                          <h3 
                            className="text-2xl lg:text-3xl font-bold text-gray-800 font-montserrat"
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay="700"
                          >Our Mission</h3>
                        </div>
                        
                        <div className="space-y-4 lg:space-y-6">
                          <div 
                            className="group relative bg-gradient-to-br from-[#7dc244]/10 to-[#7dc244]/5 rounded-2xl p-4 lg:p-6 shadow-lg border border-[#7dc244]/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            data-aos="slide-right"
                            data-aos-duration="800"
                            data-aos-delay="800"
                          >
                            <div className="flex items-start gap-3 lg:gap-4">
                              <div className="mt-1 w-3 h-3 bg-[#7dc244] rounded-full flex-shrink-0"></div>
                              <div>
                                <h4 className="font-bold text-gray-800 mb-2 group-hover:scale-105 transition-transform duration-300 font-montserrat text-sm lg:text-base">Build a future-ready integrated pharma platform</h4>
                                <p className="text-gray-600 text-xs lg:text-sm leading-relaxed font-montserrat">
                                  Delivering high-quality APIs and complex generic formulations across CNS, respiratory, and high-barrier specialty therapies
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className="group relative bg-gradient-to-br from-[#7dc244]/10 to-[#7dc244]/5 rounded-2xl p-4 lg:p-6 shadow-lg border border-[#7dc244]/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            data-aos="slide-right"
                            data-aos-duration="800"
                            data-aos-delay="1000"
                          >
                            <div className="flex items-start gap-3 lg:gap-4">
                              <div className="mt-1 w-3 h-3 bg-[#7dc244] rounded-full flex-shrink-0"></div>
                              <div>
                                <h4 className="font-bold text-gray-800 mb-2 group-hover:scale-105 transition-transform duration-300 font-montserrat text-sm lg:text-base">Leverage technology innovation in R&amp;D and manufacturing</h4>
                                <p className="text-gray-600 text-xs lg:text-sm leading-relaxed font-montserrat">
                                  Accelerating drug development cycles with AI-enabled research and continuous flow chemistry technology
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className="group relative bg-gradient-to-br from-[#7dc244]/10 to-[#7dc244]/5 rounded-2xl p-4 lg:p-6 shadow-lg border border-[#7dc244]/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            data-aos="slide-right"
                            data-aos-duration="800"
                            data-aos-delay="1200"
                          >
                            <div className="flex items-start gap-3 lg:gap-4">
                              <div className="mt-1 w-3 h-3 bg-[#7dc244] rounded-full flex-shrink-0"></div>
                              <div>
                                <h4 className="font-bold text-gray-800 mb-2 group-hover:scale-105 transition-transform duration-300 font-montserrat text-sm lg:text-base">Deepen global footprint</h4>
                                <p className="text-gray-600 text-xs lg:text-sm leading-relaxed font-montserrat">
                                  Expand our reach across 80+ markets with local presence, regional insights, and responsive supply chains to serve global customers effectively
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className="group relative bg-gradient-to-br from-[#7dc244]/10 to-[#7dc244]/5 rounded-2xl p-4 lg:p-6 shadow-lg border border-[#7dc244]/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            data-aos="slide-right"
                            data-aos-duration="800"
                            data-aos-delay="1400"
                          >
                            <div className="flex items-start gap-3 lg:gap-4">
                              <div className="mt-1 w-3 h-3 bg-[#7dc244] rounded-full flex-shrink-0"></div>
                              <div>
                                <h4 className="font-bold text-gray-800 mb-2 group-hover:scale-105 transition-transform duration-300 font-montserrat text-sm lg:text-base">Sustainability through Green Chemistry</h4>
                                <p className="text-gray-600 text-xs lg:text-sm leading-relaxed font-montserrat">
                                  Implement water-positive initiatives, reduce carbon footprint, and build ESG-focused operations as a core pillar of our excellence
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Core Values Section */}
                  <div className="mt-16 lg:mt-20">
                    <div 
                      className="text-center mb-8 lg:mb-12"
                      data-aos="fade-up"
                      data-aos-duration="1000"
                      data-aos-delay="200"
                    >
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 font-montserrat">Our Core Values</h3>
                      <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
                        The fundamental principles that guide our actions and decisions
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      <div 
                        className="group relative bg-gradient-to-br from-[#2879b6]/10 to-[#2879b6]/5 rounded-2xl p-6 lg:p-8 shadow-lg border border-[#2879b6]/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        data-aos="zoom-in"
                        data-aos-duration="800"
                        data-aos-delay="400"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#2879b6] to-[#2879b6] rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <i className="ri-lightbulb-line text-xl lg:text-2xl text-white"></i>
                          </div>
                          <div>
                            <h4 className="text-lg lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4 font-montserrat">
                              Innovation
                            </h4>
                            <p className="text-gray-600 leading-relaxed font-montserrat text-sm lg:text-base">
                              Transform global healthcare by building an innovation driven, integrated
                              pharmaceutical platform from India, delivering affordable, accessible and
                              life changing drugs.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="group relative bg-gradient-to-br from-[#7dc244]/10 to-[#7dc244]/5 rounded-2xl p-6 lg:p-8 shadow-lg border border-[#7dc244]/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        data-aos="zoom-in"
                        data-aos-duration="800"
                        data-aos-delay="600"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#7dc244] to-[#7dc244] rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <i className="ri-links-line text-xl lg:text-2xl text-white"></i>
                          </div>
                          <div>
                            <h4 className="text-lg lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4 font-montserrat">
                              Integrate
                            </h4>
                            <p className="text-gray-600 leading-relaxed font-montserrat text-sm lg:text-base">
                              Build a fully integrated, backward linked supply chain delivering consistent,
                              world class standards.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="group relative bg-gradient-to-br from-[#ee6a31]/10 to-[#ee6a31]/5 rounded-2xl p-6 lg:p-8 shadow-lg border border-[#ee6a31]/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        data-aos="zoom-in"
                        data-aos-duration="800"
                        data-aos-delay="800"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#ee6a31] to-[#ee6a31] rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <i className="ri-rocket-line text-xl lg:text-2xl text-white"></i>
                          </div>
                          <div>
                            <h4 className="text-lg lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4 font-montserrat">
                              Improve
                            </h4>
                            <p className="text-gray-600 leading-relaxed font-montserrat text-sm lg:text-base">
                              Leverage the amalgamation of AI and advanced research to shorten development
                              timelines, enhance efficiency and deliver solutions faster.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className="group relative bg-gradient-to-br from-[#2879b6]/10 to-[#7dc244]/10 rounded-2xl p-6 lg:p-8 shadow-lg border border-[#2879b6]/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
                        data-aos="zoom-in"
                        data-aos-duration="800"
                        data-aos-delay="1000"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#2879b6] to-[#7dc244] rounded-xl lg:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <i className="ri-heart-pulse-line text-xl lg:text-2xl text-white"></i>
                          </div>
                          <div>
                            <h4 className="text-lg lg:text-2xl font-bold text-gray-800 mb-3 lg:mb-4 font-montserrat">
                              Impact
                            </h4>
                            <p className="text-gray-600 leading-relaxed font-montserrat text-sm lg:text-base">
                              Drive affordability and global reach, ensuring life changing therapies are
                              within every patient's reach.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div 
                      className="text-center mt-12 lg:mt-16"
                      data-aos="fade-up"
                      data-aos-duration="1000"
                      data-aos-delay="1200"
                    >
                     
                    </div>
                  </div>
                </div>
              </section>
              
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="bg-white">
        {/* Add your full leadership content here, same as before */}
        
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="text-center mb-16"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 font-montserrat">
          Leadership Team
        </h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
          Visionary leaders driving pharmaceutical innovation and global healthcare transformation
        </p>
      </div>

      {/* Advisory Board */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">
          Advisory Board
        </h3>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {leaders
            .filter((leader) => leader.category === "Advisory Board")
            .map((leader, index) => {
              const colors = getColorClasses(leader.color);
              return (
                <div
                  key={leader.id}
                  className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 flex flex-col items-center"
                  onClick={() => setSelectedLeader(leader)}
                  data-aos="zoom-in"
                  data-aos-duration="800"
                  data-aos-delay={index * 100}
                >
                  <div
                    className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white ${colors.border} group-hover:shadow-3xl transition-all duration-500`}
                  >
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Always Visible Name and Position */}
                  <div className="mt-4 text-center">
                    <p className="text-sm font-bold text-gray-800 font-montserrat leading-tight">
                      {leader.name}
                    </p>
                    <p
                      className={`text-xs ${colors.text} font-semibold font-montserrat mt-1 leading-tight`}
                    >
                      {leader.position}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Technical Leadership Team */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">
          Technical Leadership Team
        </h3>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {leaders
            .filter((leader) => leader.category === "Technical Leadership Team")
            .map((leader, index) => {
              const colors = getColorClasses(leader.color);
              return (
                <div
                  key={leader.id}
                  className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 flex flex-col items-center"
                  onClick={() => setSelectedLeader(leader)}
                  data-aos="zoom-in"
                  data-aos-duration="800"
                  data-aos-delay={index * 100}
                >
                  <div
                    className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white ${colors.border} group-hover:shadow-3xl transition-all duration-500`}
                  >
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Always Visible Name and Position */}
                  <div className="mt-4 text-center">
                    <p className="text-sm font-bold text-gray-800 font-montserrat leading-tight">
                      {leader.name}
                    </p>
                    <p
                      className={`text-xs ${colors.text} font-semibold font-montserrat mt-1 leading-tight`}
                    >
                      {leader.position}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

     
    </div>
  </section>
     

      {/* Management Section */}
      <section id="management" className=" bg-white">
   
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        className="text-center mb-16"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 font-montserrat">
          Management Team
        </h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
          Experienced leaders driving strategic growth and operational excellence across all business verticals
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-8 items-center">
        {leaders
          .filter((leader) => leader.category === "Management Team")
          .map((leader, index) => {
            const colors = getColorClasses(leader.color);
            return (
              <div
                key={leader.id}
                className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 flex flex-col items-center"
                onClick={() => setSelectedLeader(leader)}
                data-aos="zoom-in"
                data-aos-duration="800"
                data-aos-delay={index * 100}
              >
                <div
                  className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white ${colors.border} group-hover:shadow-3xl transition-all duration-500`}
                >
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Always Visible Name and Position */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-gray-800 font-montserrat leading-tight">
                    {leader.name}
                  </p>
                  <p
                    className={`text-xs ${colors.text} font-semibold font-montserrat mt-1 leading-tight`}
                  >
                    {leader.position}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      <div
        className="text-center mt-16"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="600"
      >
        <p className="text-gray-600 font-montserrat">
          <i className="ri-cursor-line mr-2"></i>
          Click on any leader to view their detailed profile
        </p>
      </div>
    </div>
  </section>
     
    

      {/* Tab Navigation */}
     

          {/* Tab Content */}
      

          {/* Vision & Mission Tab */}
         

          {/* Leadership Tab */}
      

{/* Management Tab */}



          {/* Leadership/Management Popup Modal */}
          {selectedLeader && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  closePopup();
                }
              }}
            >
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 relative">
                {/* Close Button */}
                <button
                  onClick={closePopup}
                  className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer z-10 shadow-lg"
                >
                  <i className="ri-close-line text-gray-600 text-xl"></i>
                </button>

                <div className="relative">
                  {/* Header with Image */}
                  <div className={`bg-gradient-to-br ${getColorClasses(selectedLeader.color).bg} p-8 rounded-t-3xl text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                    
                    <div className="relative z-10 flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <img
                          src={selectedLeader.image}
                          alt={selectedLeader.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 font-montserrat">{selectedLeader.name}</h3>
                        <p className="text-white/90 font-semibold font-montserrat">{selectedLeader.position}</p>
                        <p className="text-white/80 text-sm font-montserrat mt-1">{selectedLeader.category}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <i className="ri-time-line text-white/80"></i>
                            <span className="text-sm text-white/80 font-montserrat">{selectedLeader.experience}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="ri-graduation-cap-line text-white/80"></i>
                            <span className="text-sm text-white/80 font-montserrat">{selectedLeader.education}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="mb-8">
                      <h4 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">About</h4>
                      <p className="text-gray-600 leading-relaxed font-montserrat">{selectedLeader.description}</p>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Key Achievements</h4>
                      <div className="space-y-3">
                        {selectedLeader.achievements.map((achievement: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getColorClasses(selectedLeader.color).bg} mt-2 flex-shrink-0`}></div>
                            <p className="text-gray-600 font-montserrat">{achievement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

      <Footer />
    </div>
  );
};

export default About;
