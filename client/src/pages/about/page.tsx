

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import  journeyImage from "../../images/jou.png"
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';
import ImageCarousel from '../../components/feature/ImageCarousel';
import Rlfc from "../../images/RLFC-web.png"
import Extrovis from "../../images/Extrovis.png"
import ModeProLogo from "../../images/Modepro-web.png"
import AboutFoot from "../../images/about-footer.jpg"
import { useAdminAuth } from '../../contexts/AdminContext';
import User from "../../images/images.png"

  const About = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const currentLang = i18n.language || 'en';
    const isEnglish = currentLang === 'en';
    const [activeTab, setActiveTab] = useState('journey');
  const [selectedLeader, setSelectedLeader] = useState<any>(null);
  const [pendingTargetTab, setPendingTargetTab] = useState<string | null>(null);
  const { data } = useAdminAuth();
  const [currentJourneyHeading, setCurrentJourneyHeading] = useState('');
  
  // Update journey heading when language changes
  useEffect(() => {
    setCurrentJourneyHeading(t("ourJourney"));
  }, [t, i18n.language]);

  // API data for About page
  const [aboutApi, setAboutApi] = useState<any>({ hero: null, visionMission: null, sections: [], leadership: [], values: [], journey: [], aboutJourney: null });
  const [isLoading, setIsLoading] = useState(true);

  // Journey carousel headings for each image
  const journeyHeadings = useMemo(() => [
    t("refexJourney"),
    t("refexJourneyShort"),
  ], [t]);

  // Callback function for carousel slide changes
  const handleJourneySlideChange = (index: number) => {
    if (journeyHeadings[index]) {
      setCurrentJourneyHeading(journeyHeadings[index]);
    }
  };
  
  useEffect(() => {
    const loadAbout = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/cms/about');
        if (res.ok) {
          const json = await res.json();
          setAboutApi(json.data || json);
        }
      } catch (_) {
        // Keep fallback data if API fails
      } finally {
        setIsLoading(false);
      }
    };
    loadAbout();
    
    // Listen for changes from admin
    const handleAboutDataChange = () => {
      loadAbout();
    };
    
    window.addEventListener('aboutDataChanged', handleAboutDataChange);
    return () => window.removeEventListener('aboutDataChanged', handleAboutDataChange);
  }, []);

  // If navigated with scrollTop flag, ensure top scroll
  useEffect(() => {
    if (location.state && (location.state as any).scrollTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Clear the state to avoid repeated scrolling
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Use API data with fallback to local data
  const visionMission = aboutApi?.visionMission || (data as any)?.visionMission;

  // Scroll to top when page loads
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

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

  // Handle navigation state for tab activation (from other pages)
  useEffect(() => {
    if (location.state?.activeTab) {
      const target = location.state.activeTab as string;
      setActiveTab(target);
      setPendingTargetTab(target);
      // First, ensure we are at the very top so sticky bars position correctly
      window.scrollTo({ top: 0, behavior: 'auto' });
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // After loading completes, scroll to the pending target section with retries
  useEffect(() => {
    if (!isLoading && pendingTargetTab) {
      let attempts = 0;
      const maxAttempts = 10;
      const attemptScroll = () => {
        const el = document.getElementById(pendingTargetTab);
        if (el) {
          scrollToSection(pendingTargetTab);
          setPendingTargetTab(null);
          return;
        }
        attempts += 1;
        if (attempts < maxAttempts) {
          setTimeout(attemptScroll, 100);
        } else {
          setPendingTargetTab(null);
        }
      };
      // Defer to next tick to allow layout stabilization
      setTimeout(attemptScroll, 0);
    }
  }, [isLoading, pendingTargetTab]);

  // Note: we highlight tabs on scroll; clicking the tab buttons uses scrollToSection below

  const closePopup = () => {
    setSelectedLeader(null);
  };


   // Get leadership data from API
  const AdvisoryBoard = (aboutApi as any)?.leadership?.filter((leader: any) => 
    leader.category === 'Advisory Board' && leader.isActive
  ) || data.leadership?.filter(leader => 
    leader.category === 'Advisory Board' && leader.isActive
  ) || [];

  const ManagementTeam = (aboutApi as any)?.leadership?.filter((leader: any) => 
    leader.category === 'Management Team' && leader.isActive
  ) || data.leadership?.filter(leader => 
    leader.category === 'Management Team' && leader.isActive
  ) || [];

  const TechnicalLeaders = (aboutApi as any)?.leadership?.filter((leader: any) => 
    leader.category === 'Technical Leadership Team' && leader.isActive
  ) || data.leadership?.filter(leader => 
    leader.category === 'Technical Leadership Team' && leader.isActive
  ) || [];

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
      const headerHeight = 100; // Account for sticky header and tab bar
      const sectionTop = section.offsetTop - headerHeight;
      
      // Set active tab immediately
      setActiveTab(id);
      
      // Scroll to section
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth"
      });
    }
  };

  // Highlight tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["journey", "vision", "management", "leadership" ];
      const scrollPos = window.scrollY + 150; // Adjust offset for better detection
      let currentSection = "journey"; // Default to journey

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop - 100; // Add buffer
          if (scrollPos >= sectionTop) {
            currentSection = sections[i];
            break;
          }
        }
      }
      
      setActiveTab(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


   if(isLoading) {
      return (
        <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2879b6]"></div>
        </div>
      </div>
     )
   }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section (Admin-managed) */}

      
         <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))`,
        }}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-lg md:text-6xl  font-bold text-white mb-6 leading-tight font-montserrat"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <span className="block">{isEnglish && ((aboutApi as any)?.hero?.title || data.aboutHero?.title) ? ((aboutApi as any)?.hero?.title || data.aboutHero?.title) : t("aboutRLS")}</span>
              {/* <span className="block mt-1">Sciences</span> */}
            </h1>
            {(isEnglish && ((aboutApi as any)?.hero?.subtitle || data.aboutHero?.subtitle)) || (!isEnglish && t("aboutHeroSubtitle")) ? (
            <p
              className="text-base text-white max-w-4xl mx-auto font-montserrat mb-2 md:text-lg "
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
                dangerouslySetInnerHTML={{ __html: isEnglish && ((aboutApi as any)?.hero?.subtitle || data.aboutHero?.subtitle) ? ((aboutApi as any)?.hero?.subtitle || data.aboutHero.subtitle) : t("aboutHeroSubtitle")} }
              
            >
           
            </p>
            ) : null}
            {(isEnglish && ((aboutApi as any)?.hero?.description || data.aboutHero?.description)) || (!isEnglish && t("aboutHeroDescription")) ? (
             
            <p
              className="text-base text-white max-w-4xl mx-auto font-montserrat md:text-lg"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
               dangerouslySetInnerHTML={{ __html: isEnglish && ((aboutApi as any)?.hero?.description || data.aboutHero?.description) ? ((aboutApi as any)?.hero?.description || data.aboutHero.description) : t("aboutHeroDescription")} }
            >
            
            </p>
            ) : null}
          </div>
             <div className="flex flex-wrap justify-center items-center gap-12 mt-16">
              {/* RL Fine Chem */}
              <div 
                className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-110"
                onClick={() => window.open('https://modepro.co.in/', '_blank')}
                data-aos="zoom-in"
                data-aos-duration="800"
                data-aos-delay="200"
              >
                <div className="w-60 h-60 bg-white backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 p-4">
                  <img 
                    src={ModeProLogo}
                    alt="Modepro Logo" 
                    className="w-60 h-60 object-contain"
                  />
                </div>
             
              </div>
              <div 
                className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-110"
                onClick={() => window.open('https://www.rlfinechem.com/', '_blank')}
                data-aos="zoom-in"
                data-aos-duration="800"
                data-aos-delay="100"
              >
               
                <div className="w-60 h-60 bg-white backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 p-4">
                  <img 
                 
                    src={Rlfc} 
                    alt="Modepro Logo" 
                    className="w-60 h-60 object-contain"
                  />
                </div>
             
              </div>
  
              {/* Modepro */}
         
  
              {/* Extrovis */}
              <div 
                className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-110"
                onClick={() => window.open('https://www.extrovis.com/', '_blank')}
                data-aos="zoom-in"
                data-aos-duration="800"
                data-aos-delay="300"
              >
               
                <div className="w-60 h-60 bg-white backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 p-4">
                  <img 
                    src={Extrovis} 
                    alt="Modepro Logo" 
                    className="w-60 h-60 object-contain"
                  />
                </div>
            
               </div>
             </div>
          
        </div>
      </section>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2879b6]"></div>
              <span className="font-montserrat">{t("loadingContent")}</span>
            </div>
          </div>
        </div>
      )}

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
                <span className="hidden sm:inline">{t("ourJourney")}</span>
                <span className="sm:hidden">{t("journey")}</span>
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
                <span className="hidden sm:inline">{t("ourVisionMission")}</span>
                <span className="sm:hidden">{t("vision")}</span>
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
                <span className="hidden sm:inline">{t("leadershipTeam")}</span>
                <span className="sm:hidden">{t("leadership")}</span>
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
              <h2 
                key={currentJourneyHeading}
                className="text-3xl md:text-4xl font-bold mb-4 hover:scale-105 transition-all duration-500 text-gray-800 font-montserrat"
              >
                { currentJourneyHeading}
              </h2>
                {currentJourneyHeading === t("refexJourneyShort") || (isEnglish && currentJourneyHeading === "Refex's Journey") ?
                <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed hover:text-gray-800 transition-colors duration-300 font-montserrat">
                {isEnglish && (aboutApi as any)?.aboutJourney?.summary ? (aboutApi as any)?.aboutJourney?.summary : t("journeyDescription2")}
              </p>:
                 <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed hover:text-gray-800 transition-colors duration-300 font-montserrat">
                 {t("journeyDescription1")}
              </p>}
            </div>

            <div className="flex justify-center mb-16" data-aos="fade-up" data-aos-duration="1200">
              <div className="max-w-6xl w-full">
                <ImageCarousel
                  images={
                    (aboutApi as any)?.aboutJourney?.images && (aboutApi as any)?.aboutJourney?.images.length > 0
                      ? (aboutApi as any)?.aboutJourney?.images
                      : [
                          journeyImage,
                          "/images/2151111131.jpg",
                          "/images/group-healthcare-experts-with-face-masks-talking-meeting-medical-clinic.jpg",
                          "/images/doctor-from-future-concept (1).jpg",
                          "/images/image -3.jpg",
                          "/images/image-4.jpg"
                        ]
                  }
                  alt="Refex Group Milestones Timeline"
                  className="w-full"
                  autoPlay={true}
                  autoPlayInterval={15000}
                  showDots={true}
                  showArrows={true}
                  onSlideChange={handleJourneySlideChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className=" bg-white relative overflow-hidden">
         <h2 className="text-3xl py-3 text-center md:text-4xl font-bold mb-4 text-gray-800 font-montserrat">
         {t("ourVisionMission")}
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
                            src={  visionMission?.visionImage || "https://readdy.ai/api/search-image?query=Futuristic%20pharmaceutical%20vision%20concept%20with%20innovative%20drug%20development%20laboratory%2C%20advanced%20technology%2C%20scientists%20working%20on%20life-changing%20medications%2C%20modern%20research%20facility%20with%20blue%20and%20cyan%20lighting%2C%20professional%20healthcare%20innovation%20atmosphere&width=600&height=400&seq=vision-concept&orientation=landscape"}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#2879b6]/20 to-transparent rounded-3xl"></div>
                          {/* <div 
                            className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#2879b6] to-[#2879b6] rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl"
                            data-aos="zoom-in"
                            data-aos-duration="800"
                            data-aos-delay="800"
                          >
                            <i className="ri-eye-line text-2xl lg:text-3xl text-white"></i>
                          </div> */}
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
                          >{isEnglish && visionMission?.visionTitle ? visionMission.visionTitle : t("ourVision")}</h3>
                        </div>
                        
                        <div 
                          className="bg-gradient-to-br from-[#2879b6]/10 to-[#2879b6]/5 rounded-2xl p-6 lg:p-8 shadow-lg border border-[#2879b6]/20"
                          data-aos="zoom-in"
                          data-aos-duration="1000"
                          data-aos-delay="800"
                        >
                          <p className="text-base lg:text-lg text-gray-700 leading-relaxed font-montserrat">
                            {isEnglish && visionMission?.visionDescription ? visionMission.visionDescription : t("visionDescription")}
                          </p>
                        </div>
                        
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Mission */}
                  <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                      <div 
                        className="w-full order-2 lg:order-2"
                        data-aos="fade-up"
                        data-aos-duration="800"
                      >
                        <div className="relative ">
                          <img 
                            alt="Our Mission" 
                            style={{height:'400px'}}
                            className="w-full  object-cover object-center rounded-3xl shadow-2xl" 
                            src={  visionMission?.missionImage || "https://readdy.ai/api/search-image?query=Pharmaceutical%20mission%20concept%20showing%20integrated%20supply%20chain%20and%20AI-powered%20research%2C%20modern%20production%20facility%20with%20advanced%20automation%2C%20scientists%20collaborating%20on%20drug%20development%2C%20green%20and%20emerald%20lighting%20atmosphere%2C%20professional%20healthcare%20manufacturing%20environment&width=600&height=600&seq=mission-concept&orientation=squarish"}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#7dc244]/20 to-transparent rounded-3xl"></div>
                          {/* <div 
                            className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-[#7dc244] to-[#7dc244] rounded-3xl flex items-center justify-center shadow-2xl"
                            data-aos="fade-up"
                            data-aos-duration="800"
                          >
                            <i className="ri-eye-line  text-2xl text-white"></i>
                          </div> */}
                        </div>
                      </div>
                      
                      <div 
                        className="w-full space-y-6 lg:space-y-8 order-1 lg:order-1 h-full"
                        data-aos="fade-up"
                        data-aos-duration="800"
                      >
                        <div className="flex items-center gap-4 mb-6 lg:mb-8">
                          <div 
                            className="w-2 h-12 lg:h-16 bg-gradient-to-b from-[#7dc244] to-[#7dc244] rounded-full"
                            data-aos="fade-up"
                            data-aos-duration="800"
                          ></div>
                          <h3 
                            className="text-2xl lg:text-3xl font-bold text-gray-800 font-montserrat"
                            data-aos="fade-up"
                            data-aos-duration="800"
                          >{isEnglish && visionMission?.missionTitle ? visionMission.missionTitle : t("ourMission")}</h3>
                        </div>
                        
                        <div className="space-y-4 lg:space-y-6">
                          {((isEnglish && visionMission?.missionPoints && visionMission.missionPoints.length > 0) ? visionMission.missionPoints : [
                            {
                              title: t("missionPoint1Title"),
                              description: t("missionPoint1Description")
                            },
                            {
                              title: t("missionPoint2Title"),
                              description: t("missionPoint2Description")
                            }
                          ]).map((point: any, index: number) => (
                            <div 
                              key={index}
                              className="group relative bg-gradient-to-br from-[#7dc244]/10 to-[#7dc244]/5 rounded-2xl p-4 lg:p-6 shadow-lg border border-[#7dc244]/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                              data-aos="fade-up"
                              data-aos-duration="800"
                            >
                              <div className="flex items-start gap-3 lg:gap-4">
                                <div className="mt-1 w-3 h-3 bg-[#7dc244] rounded-full flex-shrink-0"></div>
                                <div>
                                  {/* <h4 className="font-bold text-gray-800 mb-2 group-hover:scale-105 transition-transform duration-300 font-montserrat text-sm lg:text-base">
                                    {point.title || point.text}
                                  </h4> */}
                                  <p className="text-gray-600 text-xs lg:text-sm leading-relaxed font-montserrat">
                                    {point.description || point.text}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
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
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 font-montserrat">{t("ourCoreValues")}</h3>
                      <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
                        {t("coreValuesDescription")}
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
                              {t("innovation")}
                            </h4>
                            <p className="text-gray-600 leading-relaxed font-montserrat text-sm lg:text-base">
                            {t("innovationDescription")}
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
                              {t("integrate")}
                            </h4>
                            <p className="text-gray-600 leading-relaxed font-montserrat text-sm lg:text-base">
                              {t("integrateDescription")}
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
                              {t("improve")}
                            </h4>
                            <p className="text-gray-600 leading-relaxed font-montserrat text-sm lg:text-base">
                              {t("improveDescription")}
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
                              {t("impact")}
                            </h4>
                            <p className="text-gray-600 leading-relaxed font-montserrat text-sm lg:text-base">
                              {t("impactDescription")}
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

          {/* Management Section */}
      <section id="leadership" className=" bg-white">
   
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
      <div
        className="text-center mb-16"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">
          {t("managementTeam")}
        </h2>
        {/* <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
          Experienced leaders driving strategic growth and operational excellence across all business verticals
        </p> */}
      </div>

      <div className="flex flex-wrap justify-center  gap-8 items-center mb-2">
        {
          ManagementTeam
                        .map((leader: any, index: number) => {
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
                    src={leader.image || User}
                    alt={leader.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to default image if the image fails to load
                      e.currentTarget.src = User;
                    }}
                  />
                </div>

                {/* Always Visible Name and Position */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-gray-800 font-montserrat leading-tight">
                    {leader.name}
                  </p>
                  <p
                    className={`text-xs text-gray-500 font-semibold font-montserrat mt-1 leading-tight`}
                  >
                    {leader.position}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

   
    </div>
  </section>

      {/* Leadership Section */}
      <section id="management" className="bg-white " >
        {/* Add your full leadership content here, same as before */}
        
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
     

      {/* Advisory Board */}
      <div className="mb-16 mt-2">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">
          Advisory Board
        </h3>
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {AdvisoryBoard
            
                        .map((leader: any, index: number) => {
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
                      src={leader.image || User}
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
                      className={`text-xs text-gray-500 font-semibold font-montserrat mt-1 leading-tight`}
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
                        {/* <p className="text-white/80 text-sm font-montserrat mt-1">{selectedLeader.category}</p> */}
                        {/* <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <i className="ri-time-line text-white/80"></i>
                            <span className="text-sm text-white/80 font-montserrat">{selectedLeader.experience}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <i className="ri-graduation-cap-line text-white/80"></i>
                            <span className="text-sm  text-white/80 font-montserrat">{selectedLeader.education}</span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <div className="mb-8">
                    <div dangerouslySetInnerHTML={{ __html: selectedLeader.description }}></div>
                      {/* <h4 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">About</h4> */}
            
                      
                    </div>

                    {/* <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Key Achievements</h4>
                      <div className="space-y-3">
                        {(Array.isArray(selectedLeader.achievements) ? selectedLeader.achievements : []).map((achievement: string, index: number) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${getColorClasses(selectedLeader.color).bg} mt-2 flex-shrink-0`}></div>
                            <p className="text-gray-600 font-montserrat">{achievement}</p>
                          </div>
                        ))}
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          )}

             <section 
          className={`py-10 bg-cover bg-center bg-no-repeat`}
        style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('${AboutFoot || ''}')`
          }}
    
          data-aos="fade-in"
          data-aos-duration="1000"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
            <div className="max-w-5xl mx-auto">
              
                <p 
                  className="text-xl text-white/90 leading-relaxed font-montserrat mb-8"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="600"
                 
                >
                {t("footerJourneyText")}
                </p>
           
              <div 
               onClick={() => window.open('https://www.refex.group/', '_blank')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#7dc244] to-[#6bb83a] rounded-2xl text-white font-bold text-lg shadow-xl"
                data-aos="zoom-in"
                data-aos-duration="1000"
                style={{
                   cursor:"pointer"
                }}
                data-aos-delay="800"
              >
                
                <span className="font-montserrat">{t("toKnowMore")}</span>
              </div>
            </div>
          </div>
        </section>

      <Footer />
    </div>
  );
};

export default About;
