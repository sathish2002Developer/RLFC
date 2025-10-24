
import { useState, useEffect, useMemo } from 'react';
import HeroSlider from '../../components/feature/HeroSlider';
import Footer from '../../components/feature/Footer';
import Header from '../../components/feature/Header';
import { useAdminAuth } from '../../contexts/AdminContext';
import ModeProLogo from "../../images/Modepro-web.png"

import Rlfc from "../../images/RLFC-web.png"
import Extrovis from "../../images/Extrovis.png"


export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [currentRegulatorySlide, setCurrentRegulatorySlide] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Get admin data from context
  const { data } = useAdminAuth();
  
  // Map brand color keys to hex for UI usage
  const getColorValue = (color: string) => {
    const colorMap = {
      'refex-blue': '#2879b6',
      'refex-green': '#7dc244',
      'refex-orange': '#ee6a31'
    } as const;
    return (colorMap as any)[color] || color || '#2879b6';
  };
  
  // State for admin data (keeping for backward compatibility)
  const [adminData, setAdminData] = useState({
    heroSlides: [] as any[],
    offerings: [] as any[],
    statistics: [] as any[],
    regulatoryApprovals: [] as any[],
    aboutSections: [] as any[],
    homeGlobalImpact: null as any
  });
  
  // Load data directly from localStorage
  useEffect(() => {
    const loadDataFromStorage = () => {
      try {
        const savedData = localStorage.getItem('admin_data');
        console.log('📦 Loading data from localStorage:', savedData ? 'Found data' : 'No data found');
        console.log('📦 Raw localStorage data:', savedData);
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log('📥 Parsed data from localStorage:', {
            heroSlides: parsedData.heroSlides?.length || 0,
            offerings: parsedData.offerings?.length || 0,
            statistics: parsedData.statistics?.length || 0,
            regulatoryApprovals: parsedData.regulatoryApprovals?.length || 0
          });
          console.log('📥 Full parsed data:', parsedData);
          
          setAdminData({
            heroSlides: parsedData.heroSlides || [],
            offerings: parsedData.offerings || [],
            statistics: parsedData.statistics || [],
            regulatoryApprovals: parsedData.regulatoryApprovals || [],
            aboutSections: parsedData.aboutSections || [],
            homeGlobalImpact: parsedData.homeGlobalImpact || null
          });
          
          console.log('✅ Admin data state updated:', {
            heroSlides: parsedData.heroSlides?.length || 0,
            offerings: parsedData.offerings?.length || 0,
            statistics: parsedData.statistics?.length || 0,
            regulatoryApprovals: parsedData.regulatoryApprovals?.length || 0
          });
        } else {
          console.log('📝 No data in localStorage, using empty arrays');
          setAdminData({
            heroSlides: [],
            offerings: [],
            statistics: [],
            regulatoryApprovals: [],
            aboutSections: [],
            homeGlobalImpact: null
          });
        }
      } catch (error) {
        console.error('❌ Error loading data from localStorage:', error);
        console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
        console.error('❌ Saved data that caused error:', localStorage.getItem('admin_data'));
      }
    };
    
    // Load data on mount
    loadDataFromStorage();
    
    // Test localStorage data preservation
    console.log('🧪 Testing localStorage data preservation...');
    const testData = localStorage.getItem('admin_data');
    if (testData) {
      try {
        const parsed = JSON.parse(testData);
        console.log('✅ localStorage data is valid JSON:', {
          hasHeroSlides: !!parsed.heroSlides,
          hasOfferings: !!parsed.offerings,
          hasStatistics: !!parsed.statistics,
          hasRegulatoryApprovals: !!parsed.regulatoryApprovals
        });
      } catch (e) {
        console.error('❌ localStorage data is corrupted:', e);
      }
    } else {
      console.log('⚠️ No data in localStorage');
    }
    
    // Listen for localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'admin_data') {
        console.log('🔄 localStorage changed, reloading data...');
        loadDataFromStorage();
        setRefreshKey(prev => prev + 1);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      console.log('🔄 Custom storage event, reloading data...');
      loadDataFromStorage();
      setRefreshKey(prev => prev + 1);
    };
    
    window.addEventListener('adminDataChanged', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminDataChanged', handleCustomStorageChange);
    };
  }, []);

  // Listen for context data changes and update local state (optimized)
  useEffect(() => {
    if (data) {
      console.log('🔄 Context data changed, updating local state...', {
        homeGlobalImpact: data.homeGlobalImpact,
        statistics: data.statistics?.length || 0
      });
      
      setAdminData(prev => {
        const newData = {
          ...prev,
          homeGlobalImpact: data.homeGlobalImpact || prev.homeGlobalImpact,
          statistics: data.statistics || prev.statistics
        };
        
        // Only trigger refresh if data actually changed
        if (JSON.stringify(prev.homeGlobalImpact) !== JSON.stringify(newData.homeGlobalImpact) ||
            JSON.stringify(prev.statistics) !== JSON.stringify(newData.statistics)) {
          setRefreshKey(prev => prev + 1);
        }
        
        return newData;
      });
    }
  }, [data?.homeGlobalImpact?.title, data?.homeGlobalImpact?.description, data?.statistics?.length]);

  
  
  // Add counters state for statistics animation
  const [counters, setCounters] = useState({
    scientists: 0,
    products: 0,
    markets: 0
  });

  // API: Load hero slides from server (override localStorage for slides only)
  const [apiSlides, setApiSlides] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('https://refexlifesciences.com/api/cms/home/slides');
        if (res.ok) {
          const json = await res.json();
          const rows = Array.isArray(json?.data) ? json.data : json; // controller returns rows as data
          setApiSlides((rows || []).filter((s: any) => s.isActive).sort((a: any, b: any) => (a.order||0)-(b.order||0)));
        }
      } catch (_) {}
    };
    load();
    const handler = () => load();
    window.addEventListener('heroSlidesChanged', handler);
    return () => window.removeEventListener('heroSlidesChanged', handler);
  }, []);

  // API: Load offerings, statistics, regulatory from server (override localStorage)
  const [offeringsApi, setOfferingsApi] = useState<any[]>([]);
  const [statisticsApi, setStatisticsApi] = useState<any[]>([]);
  const [regulatoryApi, setRegulatoryApi] = useState<any[]>([]);

  useEffect(() => {
    const loadAll = async () => {
      try {
        console.log('🔄 Loading API data...');
        const [offRes, statRes, regRes] = await Promise.all([
          fetch('/api/cms/home/offerings'),
          fetch('/api/cms/home/statistics'),
          fetch('/api/cms/home/regulatory'),
        ]);
        
        console.log('📡 API Response Status:', {
          offerings: offRes.status,
          statistics: statRes.status,
          regulatory: regRes.status
        });
        
        if (offRes.ok) {
          const json = await offRes.json();
          const rows = Array.isArray(json?.data) ? json.data : json;
          setOfferingsApi((rows || []).filter((r: any) => r.isActive).sort((a: any, b: any) => (a.order||0)-(b.order||0)));
          console.log('✅ Offerings loaded:', rows?.length || 0);
        }
        if (statRes.ok) {
          const json = await statRes.json();
          const rows = Array.isArray(json?.data) ? json.data : json;
          setStatisticsApi((rows || []).filter((r: any) => r.isActive).sort((a: any, b: any) => (a.order||0)-(b.order||0)));
          console.log('✅ Statistics loaded:', rows?.length || 0, rows);
        } else {
          console.error('❌ Statistics API failed:', statRes.status, statRes.statusText);
        }
        if (regRes.ok) {
         
          const json = await regRes.json();
          const rows = Array.isArray(json?.data) ? json.data : json;
        
          const filteredRows = (rows || []).filter((r: any) => r.isActive).sort((a: any, b: any) => (a.order||0)-(b.order||0));
           console.log('✅ filteredRowsRegularity:', filteredRows.length);
          setRegulatoryApi(filteredRows);
          console.log('✅ Regulatory loaded:', {
            totalRows: rows?.length || 0,
            activeRows: filteredRows.length,
            rawData: rows,
            filteredData: filteredRows
          });
        } else {
          console.error('❌ Regulatory API failed:', regRes.status, regRes.statusText);
          // Set empty array to ensure we don't fall back to localStorage
          setRegulatoryApi([]);
        }
      } catch (error) {
        console.error('❌ API loading error:', error);
      }
    };
    loadAll();
  }, []);

  // Filter and sort data choosing API over localStorage (optimized with useMemo)
  const heroSlides = useMemo(() => 
    (apiSlides.length > 0 ? apiSlides : adminData.heroSlides)
      .filter(slide => slide.isActive)
      .sort((a, b) => a.order - b.order), 
    [apiSlides, adminData.heroSlides]
  );
  
  const offerings = useMemo(() => 
    (offeringsApi.length > 0 ? offeringsApi : adminData.offerings)
      .filter(offering => offering.isActive)
      .sort((a, b) => a.order - b.order), 
    [offeringsApi, adminData.offerings]
  );
  
  const statistics = useMemo(() => 
    (statisticsApi.length > 0 ? statisticsApi : adminData.statistics)
      .filter(stat => stat.isActive)
      .sort((a, b) => a.order - b.order), 
    [statisticsApi, adminData.statistics]
  );
  
  const regulatoryApprovals = useMemo(() => {
    // Force use of API data only - no localStorage fallback
    const data = regulatoryApi
      .filter(approval => approval.isActive)
      .sort((a, b) => a.order - b.order);
    console.log('🔍 Regulatory Approvals Data (API Only):', {
      regulatoryApi: regulatoryApi.length,
      adminData: adminData.regulatoryApprovals?.length || 0,
      finalData: data.length,
      data: data,
      usingApi: true
    });
    return data;
  }, [regulatoryApi]);

  // Listen for API data changes and refresh (optimized to prevent loops)
  useEffect(() => {
    if (statisticsApi.length > 0) {
      console.log('🔄 API statistics loaded, refreshing display...', {
        statisticsApi: statisticsApi.length
      });
      setRefreshKey(prev => prev + 1);
    }
  }, [statisticsApi.length]); // Only depend on length to prevent infinite loops

  // Listen for regulatory API data changes and refresh
  useEffect(() => {
    if (regulatoryApi.length > 0) {
      console.log('🔄 API regulatory loaded, refreshing display...', {
        regulatoryApi: regulatoryApi.length,
        dataRegulatory: data.regulatoryApprovals?.length || 0
      });
      setRefreshKey(prev => prev + 1);
    }
  }, [regulatoryApi.length]); // Only depend on length to prevent infinite loops

  // Debug: Log current data being used for Global Impact section (optimized)
  useEffect(() => {
    console.log('🔍 Global Impact Debug Info:', {
      contextData: {
        homeGlobalImpact: data?.homeGlobalImpact,
        statistics: data?.statistics?.length || 0
      },
      localData: {
        homeGlobalImpact: adminData?.homeGlobalImpact,
        statistics: adminData?.statistics?.length || 0
      },
      apiData: {
        statisticsApi: statisticsApi?.length || 0,
        finalStatistics: statistics?.length || 0
      },
      finalTitle: data?.homeGlobalImpact?.title || adminData?.homeGlobalImpact?.title || 'Global Impact & Excellence',
      finalDescription: data?.homeGlobalImpact?.description || adminData?.homeGlobalImpact?.description || 'Default description'
    });
  }, [data?.homeGlobalImpact?.title, adminData?.homeGlobalImpact?.title, statisticsApi.length, statistics.length]); // Reduced dependencies
  
  // Debug filtered data (moved to useEffect to prevent render-time logging)
  useEffect(() => {
    console.log('🔍 Filtered data from adminData:', {
      adminData: adminData,
      heroSlides: heroSlides.length,
      offerings: offerings.length,
      statistics: statistics.length,
      regulatoryApprovals: regulatoryApprovals.length
    });
  }, [heroSlides.length, offerings.length, statistics.length, regulatoryApprovals.length]);

  // Use admin-managed slides or fallback to default (optimized with useMemo)
  const slides = useMemo(() => 
    heroSlides.length > 0 ? heroSlides : [], 
    [heroSlides]
  );
  
  // Debug hero slides (moved to useEffect to prevent render-time logging)
  useEffect(() => {
    console.log('🖼️ Hero slides data:', {
      heroSlides: heroSlides.length,
      slides: slides.length,
      adminDataHeroSlides: adminData.heroSlides.length
    });
  }, [heroSlides.length, slides.length, adminData.heroSlides.length]);



  // Auto-scroll for regulatory carousel
  useEffect(() => {
    if (regulatoryApprovals.length === 0) return;
    const timer = setInterval(() => {
      setCurrentRegulatorySlide((prev) => {
        const maxSlide = Math.max(0, regulatoryApprovals.length - 4);
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }, 4000); // 4 seconds per slide
    return () => clearInterval(timer);
  }, [regulatoryApprovals.length]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev: number) => (prev + 1) % slides.length);
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
    const targets = {
      scientists: statistics[0]?.value || 200,
      products: statistics[1]?.value || 150,
      markets: statistics[2]?.value || 80
    };
    
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
    if (regulatoryApprovals.length === 0) return;
    const maxSlide = Math.max(0, regulatoryApprovals.length - 4);
    setCurrentRegulatorySlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevRegulatorySlide = () => {
    if (regulatoryApprovals.length === 0) return;
    setCurrentRegulatorySlide((prev) => Math.max(prev - 1, 0));
  };

  const goToRegulatorySlide = (index: number) => {
    if (regulatoryApprovals.length === 0) return;
    const maxSlide = Math.max(0, regulatoryApprovals.length - 4);
    setCurrentRegulatorySlide(Math.min(index, maxSlide));
  };


  // Use admin-managed offerings directly
  const offeringsData = offerings;

  console.log("regulatoryApi",regulatoryApi)

  return (
     <>
       <div className="min-h-screen bg-white">
      
      {/* Header - Updated with Refex Group styling */}
      <Header/>

       <HeroSlider slides={slides}/>

      {/* Enhanced Hero Banner with Bubble Effects */}
           <section className="py-8  relative" style={{ background: 'linear-gradient(135deg, rgba(125, 194, 68, 0.1), rgba(40, 121, 182, 0.1))' }} data-aos="fade-up" data-aos-duration="1000" data-counter-section>
        <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="800">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 hover:scale-105 transition-transform  duration-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {"Who We Are"}
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed hover:text-gray-800 transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            A leading pharmaceutical platform with 40+ years of API excellence, global partnerships in advanced intermediates, and CRDMO expertise in speciality formulations and antibiotics.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 mt-2" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
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
  
              {/* RL Fine Chem */}
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

           {/* Statistics Section - Brand colors and typography */}
           <section className="py-5 relative" style={{ background: 'linear-gradient(135deg, rgba(125, 194, 68, 0.1), rgba(40, 121, 182, 0.1))' }} data-aos="fade-up" data-aos-duration="1000" data-counter-section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="800">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 hover:scale-105 transition-transform  duration-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {data?.homeGlobalImpact?.title || adminData?.homeGlobalImpact?.title || 'Global Impact & Excellence'}
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed hover:text-gray-800 transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Trusted by partners worldwide for delivering meaningful innovations through science.
            </p>
          </div>

          <div key={`stats-${refreshKey}`} className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200" data-aos-duration="800">
            {statistics.map((stat: any, index: number) => (
              <div key={stat.id} className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-8 hover:rotate-2 cursor-pointer border-l-4" style={{ borderColor: getColorValue(stat.color) }} data-aos="zoom-in" data-aos-delay={300 + (index * 150)} data-aos-duration="600">
                {/* Card Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={stat.image}
                    alt={stat.title}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-600/20 to-transparent"></div>
                </div>
                
                {/* Card Content */}
                <div className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: getColorValue(stat.color), fontFamily: 'Montserrat, sans-serif' }}>
                      {stat.value}+
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {stat.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    

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
          <div className="text-center mb-5" data-aos="slide-up" data-aos-duration="1000">
            {/* Floating Badge */}
           

            {/* Main Title with Staggered Animation */}
            <div className="overflow-hidden mb-2">
              <h2 className="text-2xl md:text-4xl lg:text-4xl font-bold text-gray-800 transform" 
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
            <div className="flex justify-center mt-3" data-aos="scale-in" data-aos-delay="1300" data-aos-duration="800">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#2879b6', animationDelay: '0s' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#7dc244', animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#ee6a31', animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>

          {/* Enhanced Card Grid Layout with Advanced Animations */}
          <div key={refreshKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-2">
            {offeringsData && offeringsData.length > 0 ? offeringsData.map((offering, index) => {
    // Correctly calculates a different delay for each card to create a staggered effect.
    // The delay increases by 100ms for each card.
    const staggerDelay = index * 100;
    
    return (
      <div 
        key={offering.id || index} 
        className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:rotate-1 cursor-pointer overflow-hidden border border-gray-100"
        data-aos="fade-up"
        data-aos-delay={staggerDelay}
        data-aos-duration="800"
        data-aos-easing="ease-out-cubic"
        style={{ 
          opacity: 1, 
          transform: 'translateY(0)', 
          animation: 'fadeInUp 0.8s ease-out forwards'
        }}
      >
        
        {/* Enhanced Background Effects */}
        <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-20 transition-all duration-700 rounded-full blur-xl`} 
             style={{ background: `radial-gradient(circle, ${getColorValue(offering.color)}, ${getColorValue(offering.color)}88)` }}>
        </div>
        
        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: getColorValue(offering.color), animationDuration: '2s' }}></div>
          <div className="absolute bottom-8 left-6 w-1 h-1 rounded-full animate-ping" style={{ backgroundColor: getColorValue(offering.color), animationDelay: '0.5s', animationDuration: '3s' }}></div>
          <div className="absolute top-1/2 left-4 w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: getColorValue(offering.color), animationDelay: '1s', animationDuration: '2.5s' }}></div>
        </div>
        
        <div className="relative z-10 p-8">
          {/* Enhanced Header Section */}
          <div className="flex items-start justify-between mb-8">
            <div className={`relative w-18 h-18 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`} 
                 style={{ backgroundColor: getColorValue(offering.color) }}>
              <i className={`${offering.icon} text-2xl text-white group-hover:scale-110 transition-transform duration-300`}></i>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 animate-pulse" 
                   style={{ backgroundColor: getColorValue(offering.color), filter: 'blur(8px)' }}>
              </div>
            </div>
            
            {/* Enhanced Metric Badge */}
            <div className="text-right transform group-hover:scale-110 transition-transform duration-300">
              <div className="text-3xl font-bold group-hover:animate-pulse" style={{ color: getColorValue(offering.color) }}>
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
                   style={{ backgroundColor: getColorValue(offering.color) }}>
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
             style={{ borderColor: getColorValue(offering.color), filter: 'blur(1px)' }}>
        </div>
        
        {/* Corner Accent */}
        <div className="absolute top-0 left-0 w-0 h-0 border-t-4 border-l-4 border-transparent group-hover:border-t-8 group-hover:border-l-8 transition-all duration-500 rounded-tl-3xl" 
             style={{ borderTopColor: getColorValue(offering.color), borderLeftColor: getColorValue(offering.color) }}>
        </div>
      </div>
    );
  }) : (
    <div className="col-span-full text-center py-12">
      <div className="text-gray-500 text-lg">No offerings available. Please add some in the admin panel.</div>
    </div>
  )}
</div>

          {/* Enhanced Call to Action */}
        
        </div>
      </section>
     

 

      {/* Vision & Mission Section - Brand colors and typography */}
      <section className="py-12 bg-white">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h2 className="text-3xl font-bold mb-4 text-gray-900">Regulatory Approvals</h2>
    <p className="text-gray-700 mb-10 leading-relaxed text-justify">
      Refex Life Sciences operates a worldwide network of state-of-the-art manufacturing facilities seamlessly
      integrated into the group. These facilities comply with the highest international quality standards with
      accreditations from:
    </p>

    <div className="text-center">
   
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 text-gray-800 max-w-3xl mx-auto">
  <li className="flex items-center justify-start">
    <span className="w-3 h-3 rounded-full bg-[#2879b6] mr-3 mt-[2px]"></span>
    <span>US FDA</span>
  </li>
  <li className="flex items-center justify-start">
    <span className="w-3 h-3 rounded-full bg-[#f97316] mr-3 mt-[2px]"></span>
    <span>EU GMP</span>
  </li>
  <li className="flex items-center justify-start">
    <span className="w-3 h-3 rounded-full bg-[#10b981] mr-3 mt-[2px]"></span>
    <span>EDQM</span>
  </li>
  <li className="flex items-center justify-start">
    <span className="w-3 h-3 rounded-full bg-[#6366f1] mr-3 mt-[2px]"></span>
    <span>Health Canada</span>
  </li>
  <li className="flex items-center justify-start">
    <span className="w-3 h-3 rounded-full bg-[#e11d48] mr-3 mt-[2px]"></span>
    <span>ANVISA</span>
  </li>
  <li className="flex items-center justify-start">
    <span className="w-3 h-3 rounded-full bg-[#14b8a6] mr-3 mt-[2px]"></span>
    <span>PMDA</span>
  </li>
  <li className="flex items-center justify-start">
    <span className="w-3 h-3 rounded-full bg-[#facc15] mr-3 mt-[2px]"></span>
    <span>WHO-GMP</span>
  </li>
</ul>


    </div>
  </div>
</section>
    

      {/* Regulatory Approvals Section - Enhanced with Interactive Controls */}
  


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

        /* Card animation keyframes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Ensure cards are visible by default */
        .group {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      `}</style>
    </div>
     </>
  
  );
}
