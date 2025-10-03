
import { useState, useEffect, useRef } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';



const Capabilities = () => {
  const [activeTab, setActiveTab] = useState('manufacturing');
  const [selectedFacility, setSelectedFacility] = useState<any>(null);

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

  const manufacturingRef = useRef(null);
  const researchRef = useRef(null);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const manufacturingTop = manufacturingRef.current?.getBoundingClientRect().top || 0;
      const researchTop = researchRef.current?.getBoundingClientRect().top || 0;

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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setTimeout(() => {
      const tabSection = document.querySelector('.tab-content-section');
      if (tabSection) {
        const headerHeight = 80;
        const elementPosition = tabSection.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  const closePopup = () => {
    setSelectedFacility(null);
  };

  const facilities = [
    {
      id: 1,
      name: 'Hindupur Plant',
      type: 'API Manufacturing',
      established: '2004',
      location: 'Hindupur, India',
      capacity: '270 KL',
      color: 'refex-blue',
      image: 'https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20API%20manufacturing%20facility%20with%20large%20reactor%20vessels%2C%20advanced%20chemical%20processing%20equipment%2C%20blue%20industrial%20lighting%2C%20clean%20sterile%20environment%2C%20professional%20pharmaceutical%20production%20plant%2C%20high-tech%20manufacturing%20setup&width=600&height=400&seq=hindupur-plant&orientation=landscape',
      capabilities: [
        'Hydrogenation',
        'High-vacuum distillation',
        'High-temperature reactions'
      ],
      approvals: ['WHO', 'GMP', 'WC', 'ISO 9001', 'ISO 18001', 'ISO 45001'],
      description: 'Our flagship API manufacturing facility with nearly two decades of operational excellence, specializing in complex chemical synthesis and advanced pharmaceutical intermediates.'
    },
    {
      id: 2,
      name: 'Gauribidnaur Plant',
      type: 'API Manufacturing',
      established: '2016',
      location: 'Gauribidnaur, India',
      capacity: '225 KL',
      color: 'refex-green',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1qLknDvhw740LxaKtofvAyEXEcw03tOA9aA&s',
      capabilities: [
        'Pilot facility',
        'In-house testing laboratories'
      ],
      approvals: ['USFDA', 'WHO GMP', 'ISO 9001', 'ISO 45001', 'ISO 14001', 'ISO 22301'],
      description: 'Advanced pilot facility with comprehensive testing capabilities, designed for process development and scale-up operations with full regulatory compliance.'
    },
    {
      id: 3,
      name: 'Kurkumbh Plant',
      type: 'Oncology & Specialty Intermediates',
      established: '2020',
      location: 'Kurkumbh, India',
      capacity: '100 KL',
      color: 'refex-orange',
      image: 'https://readdy.ai/api/search-image?query=USFDA%20approved%20oncology%20pharmaceutical%20manufacturing%20facility%20with%20specialized%20containment%20systems%2C%20orange%20industrial%20lighting%2C%20high-pressure%20reaction%20vessels%2C%20advanced%20safety%20systems%2C%20professional%20oncology%20drug%20production%20plant&width=600&height=400&seq=kurkumbh-plant&orientation=landscape',
      capabilities: [
        '−20°C to +250°C reactions',
        '2–3 Torr distillation',
        '15 Bar high-pressure operations'
      ],
      approvals: ['USFDA inspection (2022, compliant)'],
      description: 'USFDA-approved facility specializing in oncology and specialty intermediates with extreme temperature and pressure capabilities for complex pharmaceutical synthesis.'
    },
    {
      id: 4,
      name: 'Ambernath Facility',
      type: 'Oncology & Specialty Intermediates',
      established: '2020',
      location: 'Ambernath, India',
      capacity: 'Scalable manufacturing',
      color: 'refex-blue',
      image: 'https://readdy.ai/api/search-image?query=CMO%20pharmaceutical%20partnering%20facility%20with%20flexible%20manufacturing%20capabilities%2C%20blue%20industrial%20design%2C%20scalable%20production%20equipment%2C%20customer-focused%20manufacturing%20environment%2C%20professional%20pharmaceutical%20contract%20manufacturing&width=600&height=400&seq=ambernath-facility&orientation=landscape',
      capabilities: [
        'CMO partnering unit',
        'Scalable manufacturing',
        'Customer flexibility'
      ],
      approvals: ['GMP Standards'],
      description: 'CMO partnering unit supporting scalable manufacturing and customer flexibility.'
    },
    {
      id: 5,
      name: 'Sermoneta Facility',
      type: 'Formulations & Complex Generics',
      established: '1970s',
      location: 'Sermoneta, Italy',
      capacity: '550 million units annually',
      color: 'refex-green',
      image: 'https://readdy.ai/api/search-image?query=European%20pharmaceutical%20formulations%20facility%20with%20sterile%20injectable%20production%20lines%2C%20modern%20clean%20rooms%2C%20green%20industrial%20design%2C%20advanced%20aseptic%20processing%20equipment%2C%20professional%20pharmaceutical%20manufacturing%20in%20Italy&width=600&height=400&seq=sermoneta-facility&orientation=landscape',
      capabilities: [
        'Sterile injectables (oncology)',
        'Onco OSDs',
        'Cephalosporins',
        'Monobactams'
      ],
      approvals: ['EUGMP', 'FDA', 'ANVISA', 'PMDA', 'Health Canada'],
      description: 'Legacy: Over five decades of operations. Legacy European facility with over five decades of operations, specializing in sterile injectables and complex oncology formulations with global regulatory approvals.'
    },
    {
      id: 6,
      name: 'Sugar Land Facility',
      type: 'Formulations & Complex Generics',
      established: '2023',
      location: 'Sugar Land, Texas, USA',
      capacity: '20 million units annually',
      color: 'refex-orange',
      image: 'https://readdy.ai/api/search-image?query=Modern%20US%20pharmaceutical%20facility%20specializing%20in%20oncology%20topicals%20and%20oral%20liquids%2C%20orange%20industrial%20lighting%2C%20advanced%20formulation%20equipment%2C%20clean%20manufacturing%20environment%2C%20professional%20pharmaceutical%20production%20in%20Texas&width=600&height=400&seq=sugar-land-facility&orientation=landscape',
      capabilities: [
        'Oncology & hormonal topicals',
        'Oral liquids',
        'Dermatology formats'
      ],
      approvals: ['USFDA', 'Health Canada'],
      description: 'Recently acquired US facility focused on oncology and hormonal topicals, providing strategic access to North American markets with specialized formulation capabilities.'
    },
    {
      id: 7,
      name: 'Hungary Packaging Facility',
      type: 'Packaging & Customization',
      established: '2022',
      location: 'Hungary',
      capacity: 'Flexible late-stage customization',
      color: 'refex-blue',
      image: 'https://readdy.ai/api/search-image?query=European%20pharmaceutical%20packaging%20facility%20with%20automated%20packaging%20lines%2C%20blue%20industrial%20design%2C%20flexible%20customization%20equipment%2C%20modern%20pharmaceutical%20packaging%20systems%2C%20professional%20drug%20packaging%20operations&width=600&height=400&seq=hungary-facility&orientation=landscape',
      capabilities: [
        'Flexible late-stage customization',
        'OSDs & vials'
      ],
      approvals: ['NCPHP (EU)'],
      description: 'Strategic European packaging facility providing flexible late-stage customization for oral solid dosage forms and vials, enabling market-specific requirements.'
    }
  ];

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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Advanced%20pharmaceutical%20technology%20and%20manufacturing%20capabilities%2C%20modern%20industrial%20facility%20with%20cutting-edge%20equipment%2C%20blue%20and%20orange%20lighting%2C%20professional%20pharmaceutical%20innovation%20environment%2C%20high-tech%20manufacturing%20excellence&width=1920&height=800&seq=capabilities-hero&orientation=landscape')`,
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
              <span className="block">Advanced Technology for</span>
              <span className="block mt-1">Superior Performance</span>
            </h1>
            <p
              className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed font-montserrat mb-8"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="600"
            >
              At Refex Life Sciences, our strength lies in the seamless integration of <span className="text-[#7dc244] font-semibold">world-class manufacturing facilities</span>, cutting-edge R&D, and robust regulatory expertise.
            </p>
            <p
              className="text-base text-white/80 max-w-5xl mx-auto font-montserrat"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="800"
            >
              Together, these capabilities enable us to deliver high-quality APIs and complex generics with consistency, scalability, and speed.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40 tab-content-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center overflow-x-auto pb-2">
            <div className="flex space-x-3 md:space-x-6 min-w-max px-4 md:px-0">
              <button
                onClick={() => manufacturingRef.current.scrollIntoView({ behavior: 'smooth' })}
                className={`px-4 md:px-6 py-3 rounded-2xl font-semibold text-xs md:text-sm transition-all duration-500 whitespace-nowrap hover:scale-110 cursor-pointer font-montserrat ${
                  activeTab === 'manufacturing'
                    ? 'bg-gradient-to-r from-[#2879b6] to-[#2879b6] text-white shadow-xl transform scale-110'
                    : 'text-gray-600 hover:text-[#2879b6] hover:bg-blue-50 hover:shadow-lg border border-[#2879b6]/20'
                }`}
              >
                Manufacturing Excellence
              </button>

              <button
                onClick={() => researchRef.current.scrollIntoView({ behavior: 'smooth' })}
                className={`px-4 md:px-6 py-3 rounded-2xl font-semibold text-xs md:text-sm transition-all duration-500 whitespace-nowrap hover:scale-110 cursor-pointer font-montserrat ${
                  activeTab === 'research'
                    ? 'bg-gradient-to-r from-[#7dc244] to-[#7dc244] text-white shadow-xl transform scale-110'
                    : 'text-gray-600 hover:text-[#7dc244] hover:bg-green-50 hover:shadow-lg border border-[#7dc244]/20'
                }`}
              >
                Research & Development Excellence
              </button>
            </div>
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

            {/* API Manufacturing Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">API Manufacturing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {facilities.filter(facility => facility.type === 'API Manufacturing').map((facility, index) => {
                  const colors = getColorClasses(facility.color);
                  return (
                    <div
                      key={facility.id}
                      className={`group bg-white rounded-3xl shadow-xl border-2 ${colors.border} ${colors.hover} hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 cursor-pointer overflow-hidden`}
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
                        <div className={`absolute top-4 right-4 px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}>
                          Est. {facility.established}
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-bold font-montserrat">{facility.name}</h3>
                          <p className="text-sm opacity-90 font-montserrat">{facility.location}</p>
                        </div>
                      </div>

                      {/* Facility Details */}
                      <div className="p-6">
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
                            {facility.capabilities.map((capability, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full`}></div>
                                <span className="text-xs text-gray-600 font-montserrat">{capability}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Approvals */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {facility.approvals.slice(0, 3).map((approval, idx) => (
                            <div key={idx} className="flex items-center justify-center w-12 h-12 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                              {approval === 'WHO' && <img src="https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2" alt="WHO" className="w-12 h-12 object-contain" />}
                              {approval === 'GMP' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTmW3F6WZRaOMqxNyCwCZ-drvJugYsocqlg&s" />}
                              {approval === 'WC' && <div className="text-xs font-bold text-blue-600">WC</div>}
                              {approval === 'ISO 9001' && <img src="https://png.pngtree.com/png-clipart/20250514/original/pngtree-iso-9001-certified-company-logo-badge-vector-png-image_20971536.png" alt="ISO 9001" className="w-12 h-12 object-contain" />}
                              {approval === 'ISO 18001' && <div className="text-xs font-bold text-green-600">18001</div>}
                              {approval === 'ISO 45001' && <div className="text-xs font-bold text-orange-600">45001</div>}
                              {approval === 'USFDA' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvJd3izOIMXlvfj_MREfBvhy5fJ4phkTkpbA&s" alt="USFDA" className="w-12 h-12 object-contain" />}
                              {approval === 'WHO GMP' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX9QbILJkoYoy1lqldp-rZ2agfRUer0fOkwQ&s" alt="WHO GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'ISO 14001' && <div className="text-xs font-bold text-green-600">14001</div>}
                              {approval === 'ISO 22301' && <div className="text-xs font-bold text-purple-600">22301</div>}
                              {approval === 'USFDA inspection (2022, compliant)' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvJd3izOIMXlvfj_MREfBvhy5fJ4phkTkpbA&s" alt="USFDA" className="w-12 h-12 object-contain" />}
                              {approval === 'GMP Standards' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTmW3F6WZRaOMqxNyCwCZ-drvJugYsocqlg&s" alt="GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'EUGMP' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" alt="EU GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'FDA' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/US-FoodAndDrugAdministration-Logo.svg/120px-US-FoodAndDrugAdministration-Logo.svg.png" alt="FDA" className="w-12 h-12 object-contain" />}
                              {approval === 'ANVISA' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Anvisa_logo.svg/120px-Anvisa_logo.svg.png" alt="ANVISA" className="w-12 h-12 object-contain" />}
                              {approval === 'PMDA' && <div className="text-xs font-bold text-red-600">PMDA</div>}
                              {approval === 'Health Canada' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/120px-Flag_of_Canada_%28Pantone%29.svg.png" alt="Health Canada" className="w-12 h-12 object-contain" />}
                              {approval === 'NCPHP (EU)' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" alt="EU" className="w-12 h-12 object-contain" />}
                              {!['WHO', 'GMP', 'WC', 'ISO 9001', 'ISO 18001', 'ISO 45001', 'USFDA', 'WHO GMP', 'ISO 14001', 'ISO 22301', 'USFDA inspection (2022, compliant)', 'GMP Standards', 'EUGMP', 'FDA', 'ANVISA', 'PMDA', 'Health Canada', 'NCPHP (EU)'].includes(approval) && (
                                <div className="text-xs font-bold text-gray-600">{approval.substring(0, 4)}</div>
                              )}
                            </div>
                          ))}
                          {facility.approvals.length > 3 && (
                            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 text-gray-600 rounded text-xs font-montserrat">
                              +{facility.approvals.length - 3}
                            </div>
                          )}
                        </div>

                        {/* View Details Button */}
                        <button className={`w-full py-3 px-4 ${colors.bg} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 cursor-pointer whitespace-nowrap font-montserrat text-sm`}>
                          <i className="ri-eye-line mr-2"></i>
                          View Details
                        </button>
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
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">Oncology & Specialty Intermediates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {facilities.filter(facility => facility.type === 'Oncology & Specialty Intermediates').map((facility, index) => {
                  const colors = getColorClasses(facility.color);
                  return (
                    <div
                      key={facility.id}
                      className={`group bg-white rounded-3xl shadow-xl border-2 ${colors.border} ${colors.hover} hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 cursor-pointer overflow-hidden`}
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
                        <div className={`absolute top-4 right-4 px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}>
                          Est. {facility.established}
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-bold font-montserrat">{facility.name}</h3>
                          <p className="text-sm opacity-90 font-montserrat">{facility.location}</p>
                        </div>
                      </div>

                      {/* Facility Details */}
                      <div className="p-6">
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
                            {facility.capabilities.map((capability, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full`}></div>
                                <span className="text-xs text-gray-600 font-montserrat">{capability}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Approvals */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {facility.approvals.map((approval, idx) => (
                            <div key={idx} className="flex items-center justify-center w-12 h-12 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                              {approval === 'WHO' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/WHO_logo_logotype.svg/120px-WHO_logo_logotype.svg.png" alt="WHO" className="w-12 h-12 object-contain" />}
                              {approval === 'GMP' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTmW3F6WZRaOMqxNyCwCZ-drvJugYsocqlg&s" alt="GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'WC' && <div className="text-xs font-bold text-blue-600">WC</div>}
                              {approval === 'ISO 9001' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQxQqQxQqQxQqQxQqQxQqQxQqQxQqQxQxQxQ&s" alt="ISO 9001" className="w-12 h-12 object-contain" />}
                              {approval === 'ISO 18001' && <div className="text-xs font-bold text-green-600">18001</div>}
                              {approval === 'ISO 45001' && <div className="text-xs font-bold text-orange-600">45001</div>}
                              {approval === 'USFDA' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvJd3izOIMXlvfj_MREfBvhy5fJ4phkTkpbA&s" alt="USFDA" className="w-12 h-12 object-contain" />}
                              {approval === 'WHO GMP' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX9QbILJkoYoy1lqldp-rZ2agfRUer0fOkwQ&s" alt="WHO GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'ISO 14001' && <div className="text-xs font-bold text-green-600">14001</div>}
                              {approval === 'ISO 22301' && <div className="text-xs font-bold text-purple-600">22301</div>}
                              {approval === 'USFDA inspection (2022, compliant)' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvJd3izOIMXlvfj_MREfBvhy5fJ4phkTkpbA&s" alt="USFDA" className="w-12 h-12 object-contain" />}
                              {approval === 'GMP Standards' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTmW3F6WZRaOMqxNyCwCZ-drvJugYsocqlg&s" alt="GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'EUGMP' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" alt="EU GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'FDA' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/US-FoodAndDrugAdministration-Logo.svg/120px-US-FoodAndDrugAdministration-Logo.svg.png" alt="FDA" className="w-12 h-12 object-contain" />}
                              {approval === 'ANVISA' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Anvisa_logo.svg/120px-Anvisa_logo.svg.png" alt="ANVISA" className="w-12 h-12 object-contain" />}
                              {approval === 'PMDA' && <div className="text-xs font-bold text-red-600">PMDA</div>}
                              {approval === 'Health Canada' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/120px-Flag_of_Canada_%28Pantone%29.svg.png" alt="Health Canada" className="w-12 h-12 object-contain" />}
                              {approval === 'NCPHP (EU)' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" alt="EU" className="w-12 h-12 object-contain" />}
                              {!['WHO', 'GMP', 'WC', 'ISO 9001', 'ISO 18001', 'ISO 45001', 'USFDA', 'WHO GMP', 'ISO 14001', 'ISO 22301', 'USFDA inspection (2022, compliant)', 'GMP Standards', 'EUGMP', 'FDA', 'ANVISA', 'PMDA', 'Health Canada', 'NCPHP (EU)'].includes(approval) && (
                                <div className="text-xs font-bold text-gray-600">{approval.substring(0, 4)}</div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* View Details Button */}
                        <button className={`w-full py-3 px-4 ${colors.bg} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 cursor-pointer whitespace-nowrap font-montserrat text-sm`}>
                          <i className="ri-eye-line mr-2"></i>
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Formulations & Complex Generics Section */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">Formulations & Complex Generics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {facilities.filter(facility => facility.type === 'Formulations & Complex Generics' || facility.type === 'Packaging & Customization').map((facility, index) => {
                  const colors = getColorClasses(facility.color);
                  return (
                    <div
                      key={facility.id}
                      className={`group bg-white rounded-3xl shadow-xl border-2 ${colors.border} ${colors.hover} hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 cursor-pointer overflow-hidden`}
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
                        <div className={`absolute top-4 right-4 px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}>
                          Est. {facility.established}
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-bold font-montserrat">{facility.name}</h3>
                          <p className="text-sm opacity-90 font-montserrat">{facility.location}</p>
                        </div>
                      </div>

                      {/* Facility Details */}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 ${colors.bg} text-white rounded-full text-xs font-semibold`}>
                            {facility.type}
                          </span>
                          <span className="text-sm font-bold text-gray-800 font-montserrat ml-5">
                            {facility.capacity}
                          </span>
                        </div>

                        {/* Key Capabilities */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2 font-montserrat">Capabilities:</h4>
                          <div className="space-y-1">
                            {facility.capabilities.slice(0, 2).map((capability, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 ${colors.bg} rounded-full`}></div>
                                <span className="text-xs text-gray-600 font-montserrat">{capability}</span>
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
                        <div className="flex flex-wrap gap-1 mb-4">
                          {facility.approvals.slice(0, 3).map((approval, idx) => (
                            <div key={idx} className="flex items-center justify-center w-12 h-12 bg-white rounded border border-gray-200 hover:border-gray-300 transition-colors duration-200">
                              {approval === 'WHO' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/WHO_logo_logotype.svg/120px-WHO_logo_logotype.svg.png" alt="WHO" className="w-12 h-12 object-contain" />}
                              {approval === 'GMP' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxvQqQxQqQxQqQxQqQxQqQxQqQxQqQxQqQxQ&s" alt="GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'WC' && <div className="text-xs font-bold text-blue-600">WC</div>}
                              {approval === 'ISO 9001' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQxQqQxQqQxQqQxQqQxQqQxQqQxQqQxQxQxQ&s" alt="ISO 9001" className="w-12 h-12 object-contain" />}
                              {approval === 'ISO 18001' && <div className="text-xs font-bold text-green-600">18001</div>}
                              {approval === 'ISO 45001' && <div className="text-xs font-bold text-orange-600">45001</div>}
                              {approval === 'USFDA' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvJd3izOIMXlvfj_MREfBvhy5fJ4phkTkpbA&s" alt="USFDA" className="w-12 h-12 object-contain" />}
                              {approval === 'WHO GMP' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX9QbILJkoYoy1lqldp-rZ2agfRUer0fOkwQ&s" alt="WHO GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'ISO 14001' && <div className="text-xs font-bold text-green-600">14001</div>}
                              {approval === 'ISO 22301' && <div className="text-xs font-bold text-purple-600">22301</div>}
                              {approval === 'USFDA inspection (2022, compliant)' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/US-FoodAndDrugAdministration-Logo.svg/120px-US-FoodAndDrugAdministration-Logo.svg.png" alt="USFDA" className="w-12 h-12 object-contain" />}
                              {approval === 'GMP Standards' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTmW3F6WZRaOMqxNyCwCZ-drvJugYsocqlg&s" alt="GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'EUGMP' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" alt="EU GMP" className="w-12 h-12 object-contain" />}
                              {approval === 'FDA' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvJd3izOIMXlvfj_MREfBvhy5fJ4phkTkpbA&s" alt="FDA" className="w-12 h-12 object-contain" />}
                              {approval === 'ANVISA' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlCWnK7KyQcEMaGOqRiPloecKNLbYYKVbg5w&s" alt="ANVISA" className="w-12 h-12 object-contain" />}
                              {approval === 'PMDA' && <div className="text-xs font-bold text-red-600">PMDA</div>}
                              {approval === 'Health Canada' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/120px-Flag_of_Canada_%28Pantone%29.svg.png" alt="Health Canada" className="w-12 h-12 object-contain" />}
                              {approval === 'NCPHP (EU)' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" alt="EU" className="w-12 h-12 object-contain" />}
                              {!['WHO', 'GMP', 'WC', 'ISO 9001', 'ISO 18001', 'ISO 45001', 'USFDA', 'WHO GMP', 'ISO 14001', 'ISO 22301', 'USFDA inspection (2022, compliant)', 'GMP Standards', 'EUGMP', 'FDA', 'ANVISA', 'PMDA', 'Health Canada', 'NCPHP (EU)'].includes(approval) && (
                                <div className="text-xs font-bold text-gray-600">{approval.substring(0, 4)}</div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* View Details Button */}
                        <button className={`w-full py-3 px-4 ${colors.bg} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 cursor-pointer whitespace-nowrap font-montserrat text-sm`}>
                          <i className="ri-eye-line mr-2"></i>
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
     
      </section>

      <section ref={researchRef} className="py-5 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16"
                 data-aos="fade-down"
                 data-aos-duration="1000">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 font-montserrat">
                Research & Development Excellence
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
                At Refex Life Sciences, innovation is our engine of growth. With world-class R&amp;D centres and a team of over 200 scientists, we are advancing the frontiers of both API development and complex finished dosage formulations (FDFs). Our research is focused on creating differentiated, sustainable, and patient‑centric solutions that address unmet needs across global healthcare.
              </p>
            </div>

            {/* R&amp;D Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
              {/* API R&amp;D */}
              <div data-aos="fade-right" data-aos-duration="1000">
                <div className="bg-gradient-to-br from-[#2879b6]/10 to-[#2879b6]/5 rounded-3xl p-8 border border-[#2879b6]/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#2879b6] to-[#3a8bc4] rounded-2xl flex items-center justify-center">
                      <i className="ri-flask-line text-2xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 font-montserrat">API R&amp;D Strengths</h3>
                      <p className="text-[#2879b6] font-semibold font-montserrat">Advanced Process Development</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2879b6] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Sustainable Process Development</h4>
                        <p className="text-sm text-gray-600 font-montserrat">Cost-effective, eco-friendly synthesis strategies for scalability and compliance.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2879b6] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Chiral Chemistry Expertise</h4>
                        <p className="text-sm text-gray-600 font-montserrat">Development of scalable chiral processes using advanced resolution and enzymatic techniques.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2879b6] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Complex Chemistry Capabilities</h4>
                        <p className="text-sm text-gray-600 font-montserrat">Proven expertise in Grignard reactions, N- &amp; O-alkylations, borohydride reductions, and other specialized chemistries.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2879b6] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Impurity &amp; Genotoxic Control</h4>
                        <p className="text-sm text-gray-600 font-montserrat">In-house synthesis, profiling, and validated risk management strategies ensuring global compliance.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2879b6] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Technology Transfer</h4>
                        <p className="text-sm text-gray-600 font-montserrat">Dedicated technical services team supporting seamless process scale‑up, HAZOP studies, and safety assessments.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2879b6] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Green Chemistry Principles</h4>
                        <p className="text-sm text-gray-600 font-montserrat">Embedding sustainability into every stage of product and process development.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#2879b6] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Regulatory Support</h4>
                        <p className="text-sm text-gray-600 font-montserrat">Full‑fledged analytical R&amp;D enabling robust filings and global regulatory responses.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FDF R&amp;D */}
              <div data-aos="fade-left" data-aos-duration="1000">
                <div className="bg-gradient-to-br from-[#7dc244]/10 to-[#7dc244]/5 rounded-3xl p-8 border border-[#7dc244]/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#7dc244] to-[#6bb83a] rounded-2xl flex items-center justify-center">
                      <i className="ri-capsule-line text-2xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 font-montserrat">FDF R&amp;D Strengths</h3>
                      <p className="text-[#7dc244] font-semibold font-montserrat">Complex Formulation Development</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#7dc244] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Cross‑Functional Expertise</h4>
                        <p className="text-sm text-gray-600 font-montserrat">Integrating analytical, engineering, clinical, QA, and regulatory capabilities to deliver holistic solutions.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#7dc244] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Innovation in Dosage Forms</h4>
                        <p className="text-sm text-gray-600 font-montserrat">Focus on complex injectables, novel drug delivery systems, and differentiated generics.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#7dc244] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800 font-montserrat">Proven Track Record</h4>
                        <p className="text-sm text-gray-600 font-montserrat">Successfully taking highly complex products from concept to commercialization, ensuring speed, compliance, and scalability.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* R&amp;D Promise */}
            <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-3xl p-8 md:p-12 text-center"
                 data-aos="zoom-in"
                 data-aos-duration="1000">
              <div className="max-w-4xl mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-[#7dc244] to-[#6bb83a] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ri-lightbulb-line text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 font-montserrat">Our R&amp;D Promise</h3>
                <p className="text-lg text-gray-600 leading-relaxed font-montserrat">
                  Through a relentless focus on innovation, sustainability, and regulatory excellence, Refex Life Sciences is shaping the future of healthcare – from breakthrough APIs to complex formulations that improve patient outcomes worldwide
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
                    <h4 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">Regulatory Approvals</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFacility.approvals.map((approval: string, index: number) => (
                        <div key={index} className="flex items-center justify-center w-12 h-12 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-sm">
                          {approval === 'WHO' && <img src="https://cdn.who.int/media/images/default-source/infographics/who-emblem.png?sfvrsn=877bb56a_2" alt="WHO" className="w-15 h-15 object-contain" />}
                          {approval === 'GMP' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTmW3F6WZRaOMqxNyCwCZ-drvJugYsocqlg&s" alt="GMP" className="w-12 h-12 object-contain" />}
                          {approval === 'WC' && <div className="text-sm font-bold text-blue-600">WC</div>}
                          {approval === 'ISO 9001' && <img src="https://png.pngtree.com/png-clipart/20250514/original/pngtree-iso-9001-certified-company-logo-badge-vector-png-image_20971536.png" alt="ISO 9001" className="w-12 h-12 object-contain" />}
                          {approval === 'ISO 18001' && <div className="text-sm font-bold text-green-600">18001</div>}
                          {approval === 'ISO 45001' && <div className="text-sm font-bold text-orange-600">45001</div>}
                          {approval === 'USFDA' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvJd3izOIMXlvfj_MREfBvhy5fJ4phkTkpbA&s" alt="USFDA" className="w-12 h-12 object-contain" />}
                          {approval === 'WHO GMP' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX9QbILJkoYoy1lqldp-rZ2agfRUer0fOkwQ&s" alt="WHO GMP" className="w-12 h-12 object-contain" />}
                          {approval === 'ISO 14001' && <div className="text-sm font-bold text-green-600">14001</div>}
                          {approval === 'ISO 22301' && <div className="text-sm font-bold text-purple-600">22301</div>}
                          {approval === 'USFDA inspection (2022, compliant)' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/US-FoodAndDrugAdministration-Logo.svg/120px-US-FoodAndDrugAdministration-Logo.svg.png" alt="USFDA" className="w-12 h-12 object-contain" />}
                          {approval === 'GMP Standards' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSTmW3F6WZRaOMqxNyCwCZ-drvJugYsocqlg&s" alt="GMP" className="w-12 h-12 object-contain" />}
                          {approval === 'EUGMP' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" alt="EU GMP" className="w-12 h-12 object-contain" />}
                          {approval === 'FDA' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLGbW32p4xWTiioDa_PzEOrIB_pp9-UoHUQ&s" alt="FDA" className="w-12 h-12 object-contain" />}
                          {approval === 'ANVISA' && <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlCWnK7KyQcEMaGOqRiPloecKNLbYYKVbg5w&s" alt="ANVISA" className="w-12 h-12 object-contain" />}
                          {approval === 'PMDA' && <div className="text-sm font-bold text-red-600">PMDA</div>}
                          {approval === 'Health Canada' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/120px-Flag_of_Canada_%28Pantone%29.svg.png" alt="Health Canada" className="w-12 h-12 object-contain" />}
                          {approval === 'NCPHP (EU)' && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/120px-Flag_of_Europe.svg.png" alt="EU" className="w-12 h-12 object-contain" />}
                          {!['WHO', 'GMP', 'WC', 'ISO 9001', 'ISO 18001', 'ISO 45001', 'USFDA', 'WHO GMP', 'ISO 14001', 'ISO 22301', 'USFDA inspection (2022, compliant)', 'GMP Standards', 'EUGMP', 'FDA', 'ANVISA', 'PMDA', 'Health Canada', 'NCPHP (EU)'].includes(approval) && (
                            <div className="text-sm font-bold text-gray-600">{approval.substring(0, 4)}</div>
                          )}
                        </div>
                      ))}
                    </div>
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
