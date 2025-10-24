
import { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../../contexts/AdminContext';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';



const Capabilities = () => {
  const [activeTab, setActiveTab] = useState('manufacturing');
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const { data } = useAdminAuth();
  
  // API data for capabilities
  const [capabilitiesData, setCapabilitiesData] = useState<any>({
    hero: null,
    research: null,
    facilities: []
  });
  
  // Load capabilities data from API
  useEffect(() => {
    const loadCapabilities = async () => {
      try {
        const res = await fetch('/api/cms/capabilities');
        if (res.ok) {
          const json = await res.json();  
          setCapabilitiesData(json.data || json);
        }
      } catch (error) {
        console.error('Failed to load capabilities data:', error);
      }
    };
    loadCapabilities();
  }, []);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const manufacturingRef = useRef<HTMLDivElement | null>(null);
  const researchRef = useRef<HTMLDivElement | null>(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!manufacturingRef.current || !researchRef.current) return;
      const manufacturingTop = manufacturingRef.current.getBoundingClientRect().top;
      const researchTop = researchRef.current.getBoundingClientRect().top;

      // Adjust offset if you have a sticky header
      const offset = 150;

      if (researchTop - offset <= 0) {
        setActiveTab('research');
      } else if (manufacturingTop - offset <= 0) {
        setActiveTab('manufacturing');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Removed unused handleTabChange function

  const closePopup = () => {
    setSelectedFacility(null);
  };

  const facilities = (capabilitiesData.facilities || (data as any)?.capabilitiesFacilities || [])
    .filter((facility: any) => facility.isActive)
    .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

  const getColorClasses = (color: string) => {
    const colorMap = {
      'refex-blue': {
        bg: 'bg-[#2879b6]',
        text: 'text-[#2879b6]',
        border: 'border-[#2879b6]/20',
        hover: 'hover:border-[#2879b6]',
        gradient: 'from-[#2879b6] to-[#3a8bc4]'
      },
      'refex-green': {
        bg: 'bg-[#7dc244]',
        text: 'text-[#7dc244]',
        border: 'border-[#7dc244]/20',
        hover: 'hover:border-[#7dc244]',
        gradient: 'from-[#7dc244] to-[#6bb83a]'
      },
      'refex-orange': {
        bg: 'bg-[#ee6a31]',
        text: 'text-[#ee6a31]',
        border: 'border-[#ee6a31]/20',
        hover: 'hover:border-[#ee6a31]',
        gradient: 'from-[#ee6a31] to-[#f07a47]'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap['refex-blue'];
  };
  const isImageUrl = (value: string) => /^https?:\/\//i.test(value);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
    <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('${capabilitiesData.hero?.backgroundImage || data?.capabilitiesHero?.backgroundImage || "https://readdy.ai/api/search-image?query=Advanced%20pharmaceutical%20technology%20and%20manufacturing%20capabilities%2C%20modern%20industrial%20facility%20with%20cutting-edge%20equipment%2C%20blue%20and%20orange%20lighting%2C%20professional%20pharmaceutical%20innovation%20environment%2C%20high-tech%20manufacturing%20excellence&width=1920&height=800&seq=capabilities-hero&orientation=landscape"}')`,
        }}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
           
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-montserrat"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              <span className="block">{capabilitiesData.hero?.title || data?.capabilitiesHero?.title || 'Capabilities'}</span>
              {(capabilitiesData.hero?.subtitle || data?.capabilitiesHero?.subtitle) && (
                <span className="block mt-1">{capabilitiesData.hero?.subtitle || data.capabilitiesHero.subtitle}</span>
              )}
            </h1>
            {/* {(() => {
              const desc = capabilitiesData.hero?.description || data?.capabilitiesHero?.description || '';
              const subDesc = capabilitiesData.hero?.subDescription || data?.capabilitiesHero?.subDescription || '';
              return (
                <>
                  {desc && (
                    <p
                      className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed font-montserrat mb-8"
                      data-aos="fade-up"
                      data-aos-duration="1000"
                      data-aos-delay="600"
                    >
                      {desc}
                    </p>
                  )}
                  {subDesc && (
                    <p
                      className="text-base text-white/80 max-w-5xl mx-auto font-montserrat"
                      data-aos="fade-up"
                      data-aos-duration="1000"
                      data-aos-delay="800"
                    >
                      {subDesc}
                    </p>
                  )}
                </>
              );
            })()} */}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-4 sm:py-8 bg-white border-b border-gray-200 sticky top-20 z-40 tab-content-section">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6">
      <button
        onClick={() =>
          manufacturingRef.current &&
          manufacturingRef.current.scrollIntoView({ behavior: 'smooth' })
        }
        className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-xs sm:text-sm md:text-sm transition-all duration-500 whitespace-nowrap hover:scale-110 cursor-pointer font-montserrat ${
          activeTab === 'manufacturing'
            ? 'bg-gradient-to-r from-[#2879b6] to-[#2879b6] text-white shadow-xl transform scale-110'
            : 'text-gray-600 hover:text-[#2879b6] hover:bg-blue-50 hover:shadow-lg border border-[#2879b6]/20'
        }`}
      >
        Manufacturing Excellence
      </button>

      <button
        onClick={() =>
          researchRef.current &&
          researchRef.current.scrollIntoView({ behavior: 'smooth' })
        }
        className={`px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-2xl font-semibold text-xs sm:text-sm md:text-sm transition-all duration-500 whitespace-nowrap hover:scale-110 cursor-pointer font-montserrat ${
          activeTab === 'research'
            ? 'bg-gradient-to-r from-[#7dc244] to-[#7dc244] text-white shadow-xl transform scale-110'
            : 'text-gray-600 hover:text-[#7dc244] hover:bg-green-50 hover:shadow-lg border border-[#7dc244]/20'
        }`}
      >
        Research & Development Excellence
      </button>
    </div>
  </div>
</section>


        <section ref={manufacturingRef} className="py-5 bg-white">
        
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16"
                 data-aos="fade-down"
                 data-aos-duration="1000">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 font-montserrat">
                Manufacturing Excellence
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
                Our global manufacturing footprint spans APIs, intermediates, and finished formulations, supported by stringent regulatory approvals and world-class infrastructure. Together, these facilities enable us to deliver quality, scale, and reliability to partners across 80+ countries.
              </p>
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">Formulations & Complex Generics with Extrovis Capabilities
</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
  {facilities
    .filter(
      (facility: any) =>
        facility.type === 'Formulations & Complex Generics' ||
        facility.type === 'Packaging & Customization'
    )
    .map((facility: any, index: number) => {
      const colors = getColorClasses(facility.color);

      return (
        <div
          key={facility.id}
          className={`group bg-white rounded-3xl shadow-xl border-2 ${colors.border} ${colors.hover} hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 cursor-pointer overflow-hidden flex flex-col h-full`}
          onClick={() => setSelectedFacility(facility)}
          data-aos="zoom-in"
          data-aos-duration="800"
          data-aos-delay={index * 100}
        >
          {/* Facility Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={facility.image}
              alt={facility.name}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            {/* <div
              className={`absolute top-4 right-4 px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}
            >
              Est. {facility.established}
            </div> */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold font-montserrat">
                {facility.name}
              </h3>
              <p className="text-sm opacity-90 font-montserrat">
                {facility.location}
              </p>
            </div>
          </div>

          {/* Facility Details */}
          <div className="p-6 flex flex-col flex-grow">
            {/* Type and Capacity */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}
              >
                {facility.type}
              </span>
              <span className="text-sm font-bold text-gray-800 font-montserrat ml-5">
                {facility.capacity}
              </span>
            </div>

            {/* Key Capabilities */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-2 font-montserrat">
                Capabilities:
              </h4>
              <div className="space-y-1 max-h-16 overflow-hidden">
                {facility.capabilities.slice(0, 2).map(
                  (capability: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-gray-600 font-montserrat"
                    >
                      <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full`} />
                      <span>{capability}</span>
                    </div>
                  )
                )}
                {facility.capabilities.length > 2 && (
                  <div className="text-xs text-gray-500 font-montserrat">
                    +{facility.capabilities.length - 2} more capabilities
                  </div>
                )}
              </div>
            </div>

            {/* Approvals */}
            <div className="flex flex-wrap gap-2 mb-4">
              {facility.approvals.map(
                (approval: string, idx: number) =>
                  approval && (
                    <div
                      key={idx}
                      className="px-2 py-1 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors duration-200 text-xs font-montserrat text-gray-700"
                    >
                      {approval}
                    </div>
                  )
              )}
            </div>

            {/* View Details Button (stays at bottom) */}
            <div className="mt-auto">
              {/* <button
                className={`w-full py-3 px-4 ${colors.bg} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 cursor-pointer whitespace-nowrap font-montserrat text-sm`}
              >
                <i className="ri-eye-line mr-2"></i>
                View Details
              </button> */}
            </div>
          </div>
        </div>
      );
    })}
</div>
            </div>

            {/* API Manufacturing Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">RLFC Capabilities</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-stretch">
  {facilities
    .filter((facility: any) => facility.type === 'API Manufacturing')
    .map((facility: any, index: number) => {
      const colors = getColorClasses(facility.color);

      return (
        <div
          key={facility.id}
          className={`group bg-white rounded-3xl shadow-xl border-2 ${colors.border} ${colors.hover} hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 cursor-pointer overflow-hidden flex flex-col h-full`}
          onClick={() => setSelectedFacility(facility)}
          data-aos="zoom-in"
          data-aos-duration="800"
          data-aos-delay={index * 100}
        >
          {/* Facility Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={facility.image}
              alt={facility.name}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {/* <div className={`absolute top-4 right-4 px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}>
              Est. {facility.established}
            </div> */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold font-montserrat">{facility.name}</h3>
              <p className="text-sm opacity-90 font-montserrat">{facility.location}</p>
            </div>
          </div>

          {/* Facility Details */}
          <div className="p-6 flex flex-col flex-grow">
            {/* All content except button */}
            <div className="flex-grow flex flex-col">
              {/* Type and Capacity */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}>
                  {facility.type}
                </span>
                <span className="text-sm font-bold text-gray-800 font-montserrat">
                  {facility.capacity}
                </span>
              </div>

              {/* Key Capabilities */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 font-montserrat">Capabilities:</h4>
                <div className="space-y-1">
                  {facility.capabilities.map((capability: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full`} />
                      <span className="text-xs text-gray-600 font-montserrat">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approvals */}
              <div className="flex flex-wrap gap-1 mb-4">
                {facility.approvals.map((approval: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-center p-2 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors duration-200 text-xs font-montserrat text-gray-700"
                  >
                    <p>{approval}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* View Details Button pinned to bottom */}
            <div className="mt-auto">
              {/* <button
                className={`w-full py-3 px-4 ${colors.bg} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 cursor-pointer whitespace-nowrap font-montserrat text-sm`}
              >
                <i className="ri-eye-line mr-2"></i>
                View Details
              </button> */}
            </div>
          </div>
        </div>
      );
    })}
</div>

              
              {/* Expansion Note */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center"
                   data-aos="fade-up"
                   data-aos-duration="1000">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <i className="ri-building-line text-2xl text-[#2879b6]"></i>
                  <h4 className="text-lg font-bold text-gray-800 font-montserrat">Expansion</h4>
                </div>
                <p className="text-gray-700 font-montserrat">
                  Foundation stone laid for a new manufacturing block in 2023, reflecting our growing scale.
                </p>
              </div>
            </div>

            {/* Oncology & Specialty Intermediates Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">Oncology & Speciality Intermediates with Modepro Capabilities</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
  {facilities
    .filter((facility: any) => facility.type === 'Oncology & Specialty Intermediates')
    .map((facility: any, index: number) => {
      const colors = getColorClasses(facility.color);

      return (
        <div
          key={facility.id}
          className={`group bg-white rounded-3xl shadow-xl border-2 ${colors.border} ${colors.hover} hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 cursor-pointer overflow-hidden flex flex-col h-full`}
          onClick={() => setSelectedFacility(facility)}
          data-aos="zoom-in"
          data-aos-duration="800"
          data-aos-delay={index * 100}
        >
          {/* Facility Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={facility.image}
              alt={facility.name}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {/* <div className={`absolute top-4 right-4 px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}>
              Est. {facility.established}
            </div> */}
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold font-montserrat">{facility.name}</h3>
              <p className="text-sm opacity-90 font-montserrat">{facility.location}</p>
            </div>
          </div>

          {/* Facility Details */}
          <div className="p-6 flex flex-col flex-grow">
            {/* CONTENT WRAPPER — everything except button */}
            <div className="flex-grow flex flex-col">
              {/* Type and Capacity */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}>
                  {facility.type}
                </span>
                <span className="text-sm font-bold text-gray-800 font-montserrat">
                  {facility.capacity}
                </span>
              </div>

              {/* Key Capabilities */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 font-montserrat">Capabilities:</h4>
                <div className="space-y-1 max-h-16 overflow-hidden">
                  {facility.capabilities.slice(0, 2).map((capability: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 font-montserrat">
                      <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full`} />
                      <span>{capability}</span>
                    </div>
                  ))}
                  {facility.capabilities.length > 2 && (
                    <div className="text-xs text-gray-500 font-montserrat">
                      +{facility.capabilities.length - 2} more capabilities
                    </div>
                  )}
                </div>
              </div>

              {/* Approvals */}
              <div className="flex flex-wrap gap-2 mb-4">
                {facility.approvals.map((approval: string, idx: number) => (
                  approval && (
                    <div
                      key={idx}
                      className="px-2 py-1 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors duration-200 text-xs font-montserrat text-gray-700"
                    >
                      {approval}
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-auto">
              {/* <button
                className={`w-full py-3 px-4 ${colors.bg} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 cursor-pointer whitespace-nowrap font-montserrat text-sm`}
              >
                <i className="ri-eye-line mr-2"></i>
                View Details
              </button> */}
            </div>
          </div>
        </div>
      );
    })}
</div>


            </div>

            {/* Formulations & Complex Generics Section */}
        
          </div>
     
      </section>

      <section ref={researchRef} className="py-5 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16"
                 data-aos="fade-down"
                 data-aos-duration="1000">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 font-montserrat">
                {capabilitiesData.research?.title || data?.capabilitiesResearch?.title || 'Research & Development Excellence'}
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
                {capabilitiesData.research?.description || data?.capabilitiesResearch?.description || 'At Refex Life Sciences, innovation is our engine of growth. With world-class R&D centres and a team of over 200 scientists, we are advancing the frontiers of both API development and complex finished dosage formulations (FDFs). Our research is focused on creating differentiated, sustainable, and patient‑centric solutions that address unmet needs across global healthcare.'}
              </p>
            </div>

            {/* R&amp;D Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
              {/* API R&D */}
              <div data-aos="fade-right" data-aos-duration="1000" className="flex">
                <div className={`bg-gradient-to-br from-[${capabilitiesData.research?.apiCard?.color || data?.capabilitiesResearch?.apiCard?.color || '#2879b6'}]/10 to-[${capabilitiesData.research?.apiCard?.color || data?.capabilitiesResearch?.apiCard?.color || '#2879b6'}]/5 rounded-3xl p-8 border border-[${capabilitiesData.research?.apiCard?.color || data?.capabilitiesResearch?.apiCard?.color || '#2879b6'}]/20 w-full`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br from-[${capabilitiesData.research?.apiCard?.color || data?.capabilitiesResearch?.apiCard?.color || '#2879b6'}] to-[${capabilitiesData.research?.apiCard?.color || data?.capabilitiesResearch?.apiCard?.color || '#3a8bc4'}] rounded-2xl flex items-center justify-center`}>
                      <i className={`${capabilitiesData.research?.apiCard?.icon || data?.capabilitiesResearch?.apiCard?.icon || 'ri-flask-line'} text-2xl text-white`}></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 font-montserrat">{capabilitiesData.research?.apiCard?.title || data?.capabilitiesResearch?.apiCard?.title || 'API R&D Strengths'}</h3>
                      <p className={`text-[${capabilitiesData.research?.apiCard?.color || data?.capabilitiesResearch?.apiCard?.color || '#2879b6'}] font-semibold font-montserrat`}>{capabilitiesData.research?.apiCard?.subtitle || data?.capabilitiesResearch?.apiCard?.subtitle || 'Advanced Process Development'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {((capabilitiesData.research?.apiCard?.points || data?.capabilitiesResearch?.apiCard?.points) || []).map((point: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 bg-[${capabilitiesData.research?.apiCard?.color || data?.capabilitiesResearch?.apiCard?.color || '#2879b6'}] rounded-full mt-2 flex-shrink-0`}></div>
                        <div>
                          <h4 className="font-semibold text-gray-800 font-montserrat">{point.title}</h4>
                          <p className="text-sm text-gray-600 font-montserrat">{point.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FDF R&D */}
              <div data-aos="fade-left" data-aos-duration="1000" className="flex">
                <div className={`bg-gradient-to-br from-[${capabilitiesData.research?.fdfCard?.color || data?.capabilitiesResearch?.fdfCard?.color || '#7dc244'}]/10 to-[${capabilitiesData.research?.fdfCard?.color || data?.capabilitiesResearch?.fdfCard?.color || '#7dc244'}]/5 rounded-3xl p-8 border border-[${capabilitiesData.research?.fdfCard?.color || data?.capabilitiesResearch?.fdfCard?.color || '#7dc244'}]/20 w-full`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br from-[${capabilitiesData.research?.fdfCard?.color || data?.capabilitiesResearch?.fdfCard?.color || '#7dc244'}] to-[${capabilitiesData.research?.fdfCard?.color || data?.capabilitiesResearch?.fdfCard?.color || '#6bb83a'}] rounded-2xl flex items-center justify-center`}>
                      <i className={`${capabilitiesData.research?.fdfCard?.icon || data?.capabilitiesResearch?.fdfCard?.icon || 'ri-capsule-line'} text-2xl text-white`}></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 font-montserrat">{capabilitiesData.research?.fdfCard?.title || data?.capabilitiesResearch?.fdfCard?.title || 'FDF R&D Strengths'}</h3>
                      <p className={`text-[${capabilitiesData.research?.fdfCard?.color || data?.capabilitiesResearch?.fdfCard?.color || '#7dc244'}] font-semibold font-montserrat`}>{capabilitiesData.research?.fdfCard?.subtitle || data?.capabilitiesResearch?.fdfCard?.subtitle || 'Complex Formulation Development'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {((capabilitiesData.research?.fdfCard?.points || data?.capabilitiesResearch?.fdfCard?.points) || []).map((point: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 bg-[${capabilitiesData.research?.fdfCard?.color || data?.capabilitiesResearch?.fdfCard?.color || '#7dc244'}] rounded-full mt-2 flex-shrink-0`}></div>
                        <div>
                          <h4 className="font-semibold text-gray-800 font-montserrat">{point.title}</h4>
                          <p className="text-sm text-gray-600 font-montserrat">{point.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* R&D Promise */}
            <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-3xl p-8 md:p-12 text-center"
                 data-aos="zoom-in"
                 data-aos-duration="1000">
              <div className="max-w-4xl mx-auto">
                <div className={`w-20 h-20 bg-gradient-to-br from-[${data?.capabilitiesResearch?.fdfCard?.color || '#7dc244'}] to-[${data?.capabilitiesResearch?.fdfCard?.color || '#6bb83a'}] rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <i className={`${data?.capabilitiesResearch?.promise?.icon || 'ri-lightbulb-line'} text-3xl text-white`}></i>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 font-montserrat">{data?.capabilitiesResearch?.promise?.title || 'Our R&D Promise'}</h3>
                <p className="text-lg text-gray-600 leading-relaxed font-montserrat">
                  {data?.capabilitiesResearch?.promise?.description || 'Through a relentless focus on innovation, sustainability, and regulatory excellence, Refex Life Sciences is shaping the future of healthcare – from breakthrough APIs to complex formulations that improve patient outcomes worldwide'}
                </p>
              </div>
            </div>
          </div>
        
        {/* Research & Development Excellence content here */}
      </section>
     



      {/* Facility Details Popup Modal */}
      {selectedFacility && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePopup();
            }
          }}
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 relative">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer z-10 shadow-lg"
            >
              <i className="ri-close-line text-gray-600 text-xl"></i>
            </button>

            <div className="relative">
              {/* Header with Facility Image */}
              <div className="relative h-64 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-3xl font-bold mb-2 font-montserrat">{selectedFacility.name}</h3>
                  <p className="text-white/90 font-semibold font-montserrat">{selectedFacility.location}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-white/80 font-montserrat">Est. {selectedFacility.established}</span>
                    <span className="text-sm text-white/80 font-montserrat">Capacity: {selectedFacility.capacity}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-2 ${getColorClasses(selectedFacility.color).bg} text-white rounded-full font-semibold font-montserrat`}>
                      {selectedFacility.type}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-montserrat text-lg">{selectedFacility.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Capabilities */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Key Capabilities</h4>
                    <div className="space-y-3">
                      {selectedFacility.capabilities.map((capability: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full ${getColorClasses(selectedFacility.color).bg} mt-2 flex-shrink-0`}></div>
                          <p className="text-gray-600 font-montserrat">{capability}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Approvals */}
                  <div>
                   {selectedFacility?.approvals?.length >0 ? 
                    <>
                      <h4 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Regulatory Approvals</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility?.approvals?.map((approval: string, index: number) => (
                         approval &&<div key={index} className="flex items-center justify-center p-2  bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-sm">
                            
                                
                            
                                 <p>{approval}</p>
                            
                         
                            
                        </div>
                      ))}
                    </div>
                    </>
                  
                    :null
}
                  </div>
                </div>

                {/* Footer Actions */}
              
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Capabilities;
