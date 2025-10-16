
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

const Products = () => {
  const [hero, setHero] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('therapeutic');

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

  // Load Product Hero from CMS
  useEffect(() => {
    const loadHero = async () => {
      try {
        const res = await fetch('/api/cms/products/hero');
        if (res.ok) {
          const json = await res.json();
          setHero(json.data);
          try {
            if (typeof window !== 'undefined') {
              const AOS = (await import('aos')).default;
              // Refresh AOS so elements added after mount animate and render immediately
              AOS.refreshHard();
            }
          } catch {}
        }
      } catch (_) {}
    };
    loadHero();
    const onChange = () => loadHero();
    window.addEventListener('productsHeroChanged', onChange);
    return () => window.removeEventListener('productsHeroChanged', onChange);
  }, []);

  const categories = [
    'All Categories',
    'Anti-Histaminic',
    'Anti-Convulsant/Anxiolytic', 
    'Anti-Allergic',
    'Anti-Depressants',
    'ADHD',
    'Antibiotic',
    'Anti-Parkinson',
    'Hypnotic',
    'Anti-Diabetic',
    'Anti-Cancer (Myelofibrosis)',
    'Anti-Cancer (Ovarian)',
    'COPD'
  ];

  const renderHero = () => {
    if (!hero || hero.isActive === false) return null;
    const overlayFrom = hero.overlayFrom || 'rgba(0,0,0,0.5)';
    const overlayTo = hero.overlayTo || 'rgba(0,0,0,0.3)';
    const titleColor = hero.titleColor || '#ffffff';
    const subtitleColor = hero.subtitleColor || 'rgba(255,255,255,0.9)';
    const descriptionColor = hero.descriptionColor || 'rgba(255,255,255,0.8)';
    const aosType = hero.aosType || 'fade-up';
    const aosDuration = hero.aosDuration || 1000;
    const aosDelay = hero.aosDelay || 200;

    return (
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(${overlayFrom}, ${overlayTo}), url('${hero.backgroundImage || ''}')`,
        }}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <h1
              className="text-lg md:text-6xl font-bold mb-3 leading-tight font-montserrat"
              style={{ color: titleColor }}
              data-aos={aosType}
              data-aos-duration={aosDuration}
            >
              <span className="block">{hero.titleLine1 || 'Our Product'}</span>
              <span className="block mt-1">{hero.titleLine2 || 'Portfolio'}</span>
            </h1>
            {hero.subtitle ? (
              <p
                className="text-base max-w-4xl mx-auto font-montserrat mb-2"
                style={{ color: subtitleColor }}
                data-aos={aosType}
                data-aos-duration={aosDuration}
                data-aos-delay={aosDelay}
              >
                {hero.subtitle.split(hero.highlightText || '').join('')}
                {hero.highlightText && (
                  <span className="font-semibold" style={{ color: titleColor }}>
                    {` ${hero.highlightText} `}
                  </span>
                )}
              </p>
            ) : null}
            {hero.description ? (
              <p
                className="text-base max-w-4xl mx-auto font-montserrat"
                style={{ color: descriptionColor }}
                data-aos={aosType}
                data-aos-duration={aosDuration}
                data-aos-delay={aosDelay + 200}
              >
                {hero.description}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      'refex-blue': {
        bg: 'bg-[#2879b6]',
        text: 'text-[#2879b6]',
        border: 'border-[#2879b6]/20',
        hover: 'hover:border-[#2879b6]',
        shadow: 'shadow-[#2879b6]/20'
      },
      'refex-green': {
        bg: 'bg-[#7dc244]',
        text: 'text-[#7dc244]',
        border: 'border-[#7dc244]/20',
        hover: 'hover:border-[#7dc244]',
        shadow: 'shadow-[#7dc244]/20'
      },
      'refex-orange': {
        bg: 'bg-[#ee6a31]',
        text: 'text-[#ee6a31]',
        border: 'border-[#ee6a31]/20',
        hover: 'hover:border-[#ee6a31]',
        shadow: 'shadow-[#ee6a31]/20'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap['refex-blue'];
  };

  const therapeuticAreas = [
    {
      id: 1,
      name: 'Anti-Histaminic',
      icon: 'ri-medicine-bottle-line',
      color: 'refex-blue',
      apiCount: 3,
      completedCount: 3,
      apis: [
        { name: 'Alimemazine Tartrate / Trimeprazine Tartrate', cas: '4330-99-8' },
        { name: 'Doxylamine Succinate', cas: '562-10-7' },
        { name: 'Ebastine', cas: '90729-43-4' }
      ]
    },
    {
      id: 2,
      name: 'Anti-Convulsant/Anxiolytic',
      icon: 'ri-brain-line',
      color: 'refex-green',
      apiCount: 15,
      completedCount: 15,
      apis: [
        { name: 'Alprazolam', cas: '28981-97-7' },
        { name: 'Chlordiazepoxide Base', cas: '58-25-3' },
        { name: 'Chlordiazepoxide HCl', cas: '438-41-5' },
        { name: 'Clobazam', cas: '22316-47-8' },
        { name: 'Clonazepam', cas: '1622-61-3' },
        { name: 'Clotiazepam', cas: '33671-46-4' },
        { name: 'Diazepam', cas: '439-14-5' },
        { name: 'Ethyl Loflazepate', cas: '29177-84-2' },
        { name: 'Etizolam', cas: '40054-69-1' },
        { name: 'Lorazepam', cas: '846-49-1' },
        { name: 'Nitrazepam', cas: '146-22-5' },
        { name: 'Oxazepam', cas: '604-75-1' },
        { name: 'Temazepam', cas: '846-50-4' },
        { name: 'Phenazepam', cas: '51753-57-2' },
        { name: 'Delorazepam', cas: '2894-67-9' }
      ]
    },
    {
      id: 3,
      name: 'Anti-Allergic',
      icon: 'ri-shield-cross-line',
      color: 'refex-orange',
      apiCount: 7,
      completedCount: 7,
      apis: [
        { name: 'Bilastine', cas: '202189-78-4' },
        { name: 'Carbinoxamine Maleate', cas: '3505-38-2' },
        { name: 'Cyproheptadine HCl', cas: '969-33-5' },
        { name: 'Orphenadrine Citrate', cas: '4682-36-4' },
        { name: 'Orphenadrine HCl', cas: '341-69-5' },
        { name: 'Oxomemazine Base', cas: '3689-50-7' },
        { name: 'Oxomemazine HCl', cas: '4784-40-1' }
      ]
    },
    {
      id: 4,
      name: 'Anti-Depressants',
      icon: 'ri-heart-pulse-line',
      color: 'refex-blue',
      apiCount: 15,
      completedCount: 15,
      apis: [
        { name: 'Amitriptyline HCl', cas: '549-18-8' },
        { name: 'Clomipramine HCl', cas: '303-49-1' },
        { name: 'Desvenlafaxine Succinate', cas: '448904-47-0' },
        { name: 'Dothiepin HCl/ Dosulepin', cas: '897-15-4' },
        { name: 'Doxepin HCl', cas: '1229-29-4' },
        { name: 'Duloxetine HCl', cas: '136434-34-9' },
        { name: 'Imipramine HCl', cas: '113-52-0' },
        { name: 'Melitracen HCl', cas: '10563-70-9' },
        { name: 'Nortriptyline HCl', cas: '894-71-3' },
        { name: 'Opipramol Di HCl', cas: '909-39-7' },
        { name: 'Sertraline HCI', cas: '79559-97-0' },
        { name: 'Trimipramine Maleate', cas: '521-78-8' },
        { name: 'Trimipramine Mesylate', cas: '25332-13-2' },
        { name: 'Venlafaxine HCl', cas: '99300-78-4' },
        { name: 'Vortioxetine HBr', cas: '960203-27-4' }
      ]
    },
    {
      id: 5,
      name: 'ADHD',
      icon: 'ri-focus-3-line',
      color: 'refex-green',
      apiCount: 1,
      completedCount: 1,
      apis: [
        { name: 'Atomoxetine HCl', cas: '82248-59-7' }
      ]
    },
    {
      id: 6,
      name: 'Antibiotic',
      icon: 'ri-virus-line',
      color: 'refex-orange',
      apiCount: 2,
      completedCount: 2,
      apis: [
        { name: 'Avibactam', cas: '1192500-31-4' },
        { name: 'Aztreonam', cas: '78110-38-0' }
      ]
    },
    {
      id: 7,
      name: 'Anti-Parkinson',
      icon: 'ri-hand-heart-line',
      color: 'refex-blue',
      apiCount: 1,
      completedCount: 1,
      apis: [
        { name: 'Benserazide HCl', cas: '14919-77-8' }
      ]
    },
    {
      id: 8,
      name: 'Hypnotic',
      icon: 'ri-moon-line',
      color: 'refex-green',
      apiCount: 1,
      completedCount: 1,
      apis: [
        { name: 'Lormetazepam', cas: '848-75-9' }
      ]
    },
    {
      id: 9,
      name: 'Anti-Diabetic',
      icon: 'ri-drop-line',
      color: 'refex-orange',
      apiCount: 3,
      completedCount: 3,
      apis: [
        { name: 'Enavogliflozin', cas: '1415472-28-4' },
        { name: 'Liraglutide', cas: '204656-20-2' },
        { name: 'Bexagliflozin', cas: '1118567-05-7' }
      ]
    },
    {
      id: 10,
      name: 'Anti-Spasmodics',
      icon: 'ri-pulse-line',
      color: 'refex-blue',
      apiCount: 5,
      completedCount: 5,
      apis: [
        { name: 'Fenpiverinium Bromide', cas: '125-60-0' },
        { name: 'Pargeverine HCl', cas: '2765-97-1' },
        { name: 'Pitofenone HCl', cas: '1248-42-6' },
        { name: 'Tiemonium Methylsulfate', cas: '6504-57-0' },
        { name: 'Trihexyphenidyl HCl', cas: '52-49-3' }
      ]
    },
    {
      id: 11,
      name: 'Anxiolytic',
      icon: 'ri-heart-line',
      color: 'refex-green',
      apiCount: 2,
      completedCount: 2,
      apis: [
        { name: 'Buspirone HCl', cas: '33386-08-2' },
        { name: 'Mexazolam', cas: '31868-18-5' }
      ]
    },
    {
      id: 12,
      name: 'Anti-Cancer (Treatment of Myelofibrosis)',
      icon: 'ri-shield-line',
      color: 'refex-orange',
      apiCount: 1,
      completedCount: 1,
      apis: [
        { name: 'Ruxolitinib', cas: '941678-49-5' }
      ]
    },
    {
      id: 13,
      name: 'Anti-Cancer (Treatment of Ovarian Cancer)',
      icon: 'ri-shield-check-line',
      color: 'refex-blue',
      apiCount: 1,
      completedCount: 1,
      apis: [
        { name: 'Trabectedin', cas: '114899-77-3' }
      ]
    },
    {
      id: 14,
      name: 'Anti-Psychotic',
      icon: 'ri-brain-2-line',
      color: 'refex-green',
      apiCount: 9,
      completedCount: 9,
      apis: [
        { name: 'Chlorpromazine HCl', cas: '69-09-0' },
        { name: 'Chlorprothixene HCl', cas: '6469-93-8' },
        { name: 'Clozapine', cas: '5786-21-0' },
        { name: 'Flupentixol Decanoate', cas: '30909-51-4' },
        { name: 'Flupentixol Di HCl', cas: '2413-38-9' },
        { name: 'Fluphenazine Decanoate', cas: '5002-47-1' },
        { name: 'Zuclopenthixol Acetate', cas: '85721-05-7' },
        { name: 'Zuclopenthixol Decanoate', cas: '64053-00-5' },
        { name: 'Xanomeline Tartrate', cas: '152854-19-8' }
      ]
    },
    {
      id: 15,
      name: 'Treatment of Anemia',
      icon: 'ri-heart-pulse-fill',
      color: 'refex-orange',
      apiCount: 6,
      completedCount: 6,
      apis: [
        { name: 'Ferric Carboxymaltose', cas: '9007-72-1' },
        { name: 'Ferric Derisomaltose', cas: '1345510-43-1' },
        { name: 'Ferumoxytol', cas: '722492-56-0' },
        { name: 'Iron Dextran', cas: '9004-66-4' },
        { name: 'Iron Sucrose Complex', cas: '8047-67-4' },
        { name: 'Mitapivat', cas: '1260075-17-9' }
      ]
    },
    {
      id: 16,
      name: 'Treatment of Insomnia',
      icon: 'ri-moon-fill',
      color: 'refex-blue',
      apiCount: 2,
      completedCount: 2,
      apis: [
        { name: 'Eszopiclone', cas: '138729-47-2' },
        { name: 'Zopiclone', cas: '43200-80-2' }
      ]
    },
    {
      id: 17,
      name: 'COPD',
      icon: 'ri-lungs-line',
      color: 'refex-green',
      apiCount: 3,
      completedCount: 3,
      apis: [
        { name: 'Aclidinium Bromide', cas: '320345-99-1' },
        { name: 'Umeclidinium Bromide', cas: '869113-09-7' },
        { name: 'Vilanterol', cas: '503068-34-6' }
      ]
    }
  ];

  // ModePro API Intermediates Data
  const apiIntermediates = [
    {
      category: 'Alfuzosin, Doxazosin, Prazosin, Terazosin',
      products: [
        { name: '2-Chlro-4-amino-6, 7-dimethoxyquinazoline', cas: '23680-84-4', image: 'http://modepro.co.in/images/product/intermediate/cas-23680-84-4.png' }
      ]
    },
    {
      category: 'Alogliptin',
      products: [
        { name: '6-Chloro-3-methyluracil', cas: '4318-56-3', image: 'http://modepro.co.in/images/product/intermediate/cas-4318-56-3.png' }
      ]
    },
    {
      category: 'Amoxapine & Loxapine',
      products: [
        { name: '2-Chlorodibenzo[b,f][1,4]oxazepin-11(10H)-one', cas: '3158-91-6', image: 'http://modepro.co.in/images/product/intermediate/1.png' }
      ]
    },
    {
      category: 'Apixaban',
      products: [
        { name: '5,6-Dihydro-3-(4-morpholinyl)-1-(4-nitrophenyl)-2(1H)-pyridinone', cas: '503615-03-0', image: 'http://modepro.co.in/images/product/intermediate/2.png' },
        { name: 'Ethyl chloro[(4-methoxyphenyl)hydrazono]acetat', cas: '27143-07-3', image: 'http://modepro.co.in/images/product/intermediate/3.png' },
        { name: '5,6-Dihydro-3-(4-morpholinyl)-1-[4-(2-oxo-1-piperidinyl)phenyl]-2(1H)-pyridinone', cas: '545445-44-1', image: 'http://modepro.co.in/images/product/intermediate/4.png' }
      ]
    },
    {
      category: 'Bilastine',
      products: [
        { name: '2-[4-[1-(4,4-dimethyl-5H-oxazol-2yl)-1-methyl-ethyl]phenyl]ethyl 4-methylbenzenesulfonate', cas: '202189-76-2', image: 'http://modepro.co.in/images/product/intermediate/cas-202189-76-2.png' }
      ]
    },
    {
      category: 'Brinzolamide',
      products: [
        { name: '3-Acetyl-2,5-dichlorothiophene', cas: '36157-40-1', image: 'http://modepro.co.in/images/product/intermediate/6.png' }
      ]
    }
  ];

  const pyridineDerivatives = [
    { name: '2-Benzoylpyridine', cas: '91-02-1', image: 'http://modepro.co.in/images/product/pyridine/1.png' },
    { name: '2-Benzylpyridine', cas: '101-82-6', image: 'http://modepro.co.in/images/product/pyridine/2.png' },
    { name: '4-Benzoylpyridine', cas: '14548-46-0', image: 'http://modepro.co.in/images/product/pyridine/3.png' },
    { name: '4-Benzylpyridine', cas: '2116-65-6', image: 'http://modepro.co.in/images/product/pyridine/4.png' }
  ];

  const thiopheneDerivatives = [
    { name: '2-Chlorothiophene', cas: '96-43-5', image: 'http://modepro.co.in/images/product/thiophene/3.png' },
    { name: '3-Chlorothiophene', cas: '17249-80-8', image: 'http://modepro.co.in/images/product/thiophene/4.png' },
    { name: '2-Bromothiophene', cas: '1003-09-4', image: 'http://modepro.co.in/images/product/thiophene/5.png' },
    { name: 'Ethyl-5-chlorothiophene-2-yl sulfonyl carbamate', cas: '849793-87-9', image: 'http://modepro.co.in/images/product/thiophene/8.png' },
    { name: '5-Bromothiophene-2-carboxylic acid', cas: '7311-63-9', image: 'http://modepro.co.in/images/product/thiophene/11.png' },
    { name: '5-Formylthiophene-2-carboxylic acid', cas: '4565-31-5', image: 'http://modepro.co.in/images/product/thiophene/12.png' },
    { name: '2,5-dichlorothiophene-3-carboxylic acid', cas: '36157-41-2', image: 'http://modepro.co.in/images/product/thiophene/14.png' },
    { name: '2-Acetylthiophene', cas: '14345-97-2', image: 'http://modepro.co.in/images/product/thiophene/16.png' },
    { name: '2-Chloro-3- methylthiophene', cas: '14282-76-9', image: 'http://modepro.co.in/images/product/thiophene/17.png' },
    { name: '2-Bromo-3- methylthiophene', cas: '4701-17-1', image: 'http://modepro.co.in/images/product/thiophene/18.png' }
  ];

  const filteredAreas = therapeuticAreas.filter(area => {
    const matchesCategory = selectedCategory === 'All Categories' || area.name === selectedCategory;
    return matchesCategory;
  });

  const closePopup = () => {
    setSelectedArea(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      {hero ? (
        renderHero()
      ) : (
        <section 
          className="relative py-20 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20laboratory%20with%20scientists%20working%20on%20drug%20development%2C%20clean%20sterile%20environment%20with%20advanced%20equipment%2C%20molecular%20structures%20and%20chemical%20formulas%20in%20background%2C%20blue%20and%20white%20color%20scheme%2C%20professional%20medical%20research%20facility%2C%20API%20development%2C%20therapeutic%20innovation%2C%20contemporary%20scientific%20design&width=1920&height=800&seq=products-hero&orientation=landscape')`
          }}
          data-aos="fade-in"
          data-aos-duration="1000"
        >
          <div className="w-full px-6 lg:px-8">
            <div className="text-center">
              <h1 
                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-montserrat"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="400"
              >
                <span className="block">Our Product</span>
                <span className="block mt-1">Portfolio</span>
              </h1>
              <p 
                className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-montserrat mb-8"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="600"
              >
                Leader in <span className="text-[#1D9AD4] font-semibold">Psychotropic Substances</span> & CNS APIs with 40+ years of proven expertise
              </p>
              <p 
                className="text-base text-white/80 max-w-4xl mx-auto font-montserrat"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-delay="800"
              >
                Comprehensive API portfolio across diverse therapeutic segments serving healthcare needs worldwide
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Product Categories Tabs */}
      <section className="py-12 bg-gray-50 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200 w-full max-w-5xl overflow-hidden">
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('therapeutic')}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 text-sm sm:text-base ${
                    activeTab === 'therapeutic'
                      ? 'bg-[#2879b6] text-white shadow-lg'
                      : 'text-gray-600 hover:text-[#2879b6] hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-medicine-bottle-line mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">Therapeutic Areas</span>
                  <span className="sm:hidden">Therapeutic</span>
                </button>
                <button
                  onClick={() => setActiveTab('intermediates')}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 text-sm sm:text-base ${
                    activeTab === 'intermediates'
                      ? 'bg-[#7dc244] text-white shadow-lg'
                      : 'text-gray-600 hover:text-[#7dc244] hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-flask-line mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">API Intermediates</span>
                  <span className="sm:hidden">Intermediates</span>
                </button>
                <button
                  onClick={() => setActiveTab('pyridine')}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 text-sm sm:text-base ${
                    activeTab === 'pyridine'
                      ? 'bg-[#ee6a31] text-white shadow-lg'
                      : 'text-gray-600 hover:text-[#ee6a31] hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-test-tube-line mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">Pyridine Derivatives</span>
                  <span className="sm:hidden">Pyridine</span>
                </button>
                <button
                  onClick={() => setActiveTab('thiophene')}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 text-sm sm:text-base ${
                    activeTab === 'thiophene'
                      ? 'bg-[#2879b6] text-white shadow-lg'
                      : 'text-gray-600 hover:text-[#2879b6] hover:bg-gray-50'
                  }`}
                >
                  <i className="ri-atom-line mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">Thiophene Derivatives</span>
                  <span className="sm:hidden">Thiophene</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Therapeutic Areas Section */}
      {activeTab === 'therapeutic' && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="text-center mb-16"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Therapeutic Areas</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Comprehensive pharmaceutical solutions across diverse therapeutic segments
              </p>
            </div>

            {/* Filter Dropdown */}
            <div 
              className="max-w-md mx-auto mb-16"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="200"
            >
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-2xl border-2 border-gray-300 bg-white text-gray-900 focus:border-[#2879b6] focus:outline-none text-base font-montserrat appearance-none"
                >
                  <option value="All Categories">All Categories</option>
                  {therapeuticAreas.map(area => (
                    <option key={area.id} value={area.name}>{area.name}</option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none"></i>
              </div>
            </div>

            {/* Therapeutic Areas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAreas.map((area, index) => {
                const colors = getColorClasses(area.color);
                const progressPercentage = (area.completedCount / area.apiCount) * 100;
                
                return (
                  <div
                    key={area.id}
                    className={`group bg-white rounded-2xl shadow-lg ${colors.border} border-2 ${colors.hover} hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 hover:scale-105 hover:rotate-1 cursor-pointer overflow-hidden relative`}
                    onClick={() => setSelectedArea(area)}
                    data-aos="zoom-in"
                    data-aos-duration="800"
                    data-aos-delay={index * 100}
                  >
                    {/* Card Content */}
                    <div className="p-8 relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 ${colors.shadow} group-hover:shadow-2xl`}>
                          <i className={`${area.icon} text-2xl text-white group-hover:animate-pulse`}></i>
                        </div>
                        <div className={`px-4 py-2 ${colors.bg} text-white rounded-full text-sm font-bold group-hover:scale-110 transition-transform duration-300`}>
                          {area.apiCount} APIs
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className={`text-2xl font-bold ${colors.text} mb-4 group-hover:text-gray-900 transition-colors duration-300 font-montserrat`}>
                        {area.name}
                      </h3>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 font-medium font-montserrat">Development Progress</span>
                          <span className="text-sm font-bold text-gray-900">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full ${colors.bg} rounded-full transition-all duration-1000 ease-out group-hover:animate-pulse`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* API List Preview */}
                      <div className="space-y-3 mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 font-montserrat">Top APIs:</h4>
                        {area.apis.slice(0, 3).map((api, index) => (
                          <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg group-hover:bg-white transition-colors duration-300">
                            <span className="text-sm font-medium text-gray-900 font-montserrat truncate flex-1 mr-2">
                              {api.name.length > 25 ? api.name.substring(0, 25) + '...' : api.name}
                            </span>
                            <span className="text-xs text-gray-500 font-mono bg-gray-200 px-2 py-1 rounded group-hover:bg-gray-100 transition-colors duration-300">
                              {api.cas}
                            </span>
                          </div>
                        ))}
                        {area.apiCount > 3 && (
                          <div className="text-center">
                            <span className="text-sm text-gray-500 font-montserrat">
                              +{area.apiCount - 3} more APIs
                            </span>
                          </div>
                        )}
                      </div>

                      {/* View All Button */}
                      <button className={`w-full py-3 px-6 ${colors.bg} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl cursor-pointer whitespace-nowrap font-montserrat`}>
                        <i className="ri-eye-line mr-2"></i>
                        View All APIs
                      </button>
                    </div>

                    {/* Hover Gradient Overlay */}
                    <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}></div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredAreas.length === 0 && (
              <div 
                className="text-center py-12"
                data-aos="fade-up"
                data-aos-duration="1000"
              >
                <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-bold text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500">
                  Try adjusting your filter criteria.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* API Intermediates Section */}
      {activeTab === 'intermediates' && (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="text-center mb-16"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#7dc244] to-[#5ba832] text-white rounded-full shadow-lg mb-6">
                <i className="ri-flask-line mr-2 text-xl"></i>
                <span className="font-semibold font-montserrat">Premium Quality</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">API Intermediates</h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-montserrat">
                High-quality pharmaceutical intermediates engineered for various therapeutic applications with precision and excellence
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {apiIntermediates.map((category, categoryIndex) => {
                // Cycle through brand colors
                const brandColors = [
                  { 
                    gradient: 'from-[#2879b6] via-[#3a8bc4] to-[#4c9dd2]',
                    bg: 'bg-[#2879b6]',
                    hover: 'hover:from-[#2879b6]/20 hover:to-[#2879b6]/5',
                    border: 'hover:border-[#2879b6]/30',
                    text: 'group-hover/item:text-[#2879b6]',
                    accent: 'from-[#2879b6]/10 to-[#1e5f8c]/10',
                    accentHover: 'group-hover/item:from-[#2879b6]/20 group-hover/item:to-[#1e5f8c]/20',
                    accentBorder: 'border-[#2879b6]/20',
                    accentText: 'text-[#2879b6]'
                  },
                  { 
                    gradient: 'from-[#7dc244] via-[#6bb83a] to-[#5ba832]',
                    bg: 'bg-[#7dc244]',
                    hover: 'hover:from-[#7dc244]/20 hover:to-[#7dc244]/5',
                    border: 'hover:border-[#7dc244]/30',
                    text: 'group-hover/item:text-[#7dc244]',
                    accent: 'from-[#7dc244]/10 to-[#5ba832]/10',
                    accentHover: 'group-hover/item:from-[#7dc244]/20 group-hover/item:to-[#5ba832]/20',
                    accentBorder: 'border-[#7dc244]/20',
                    accentText: 'text-[#7dc244]'
                  },
                  { 
                    gradient: 'from-[#ee6a31] via-[#f07a47] to-[#f28a5d]',
                    bg: 'bg-[#ee6a31]',
                    hover: 'hover:from-[#ee6a31]/20 hover:to-[#ee6a31]/5',
                    border: 'hover:border-[#ee6a31]/30',
                    text: 'group-hover/item:text-[#ee6a31]',
                    accent: 'from-[#ee6a31]/10 to-[#d55a28]/10',
                    accentHover: 'group-hover/item:from-[#ee6a31]/20 group-hover/item:to-[#d55a28]/20',
                    accentBorder: 'border-[#ee6a31]/20',
                    accentText: 'text-[#ee6a31]'
                  }
                ];
                
                const colorScheme = brandColors[categoryIndex % 3];
                
                return (
                  <div 
                    key={categoryIndex}
                    className="group bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay={categoryIndex * 100}
                  >
                    {/* Header with Brand Color Gradient */}
                    <div className={`relative bg-gradient-to-r ${colorScheme.gradient} px-4 sm:px-8 py-4 sm:py-6 overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                          <i className="ri-test-tube-line text-xl sm:text-2xl text-white"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-white font-montserrat leading-tight">
                            Intermediate For
                          </h3>
                          <p className="text-white/90 font-semibold font-montserrat text-sm sm:text-lg leading-tight">
                            {category.category}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-4 sm:p-8">
                      <div className="space-y-4 sm:space-y-6">
                        {category.products.map((product, productIndex) => (
                          <div 
                            key={productIndex}
                            className={`group/item bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-2xl p-4 sm:p-6 ${colorScheme.hover} transition-all duration-300 border border-gray-200 ${colorScheme.border} hover:shadow-lg`}
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                              {/* Chemical Structure */}
                              <div className="flex-shrink-0 mx-auto sm:mx-0">
                                <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-gray-200 group-hover/item:border-${colorScheme.accentText.split('-')[1]} transition-all duration-300 group-hover/item:shadow-lg`}>
                                  <img 
                                    src={product.image} 
                                    alt={product.name}
                                    className="max-w-full max-h-full object-contain group-hover/item:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `<i class="ri-flask-line text-2xl sm:text-3xl ${colorScheme.accentText}"></i>`;
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              
                              {/* Product Info */}
                              <div className="flex-1 min-w-0 text-center sm:text-left">
                                <h4 className={`font-bold text-gray-900 mb-2 sm:mb-3 font-montserrat text-base sm:text-lg leading-tight ${colorScheme.text} transition-colors duration-300`}>
                                  {product.name}
                                </h4>
                                
                                {/* CAS Number Badge */}
                                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-3 sm:mb-0">
                                  <span className="text-xs sm:text-sm text-gray-500 font-montserrat font-medium">CAS Number:</span>
                                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${colorScheme.accent} px-3 sm:px-4 py-1 sm:py-2 rounded-full border ${colorScheme.accentBorder} ${colorScheme.accentHover} transition-all duration-300`}>
                                    <i className={`ri-hashtag ${colorScheme.accentText} text-xs sm:text-sm`}></i>
                                    <span className={`text-xs sm:text-sm font-mono font-bold ${colorScheme.accentText}`}>
                                      {product.cas}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Quality Indicators */}
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-3 sm:mt-4">
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-gray-600 font-montserrat">High Purity</span>
                                  </div>
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-gray-600 font-montserrat">GMP Certified</span>
                                  </div>
                                  <div className="flex items-center gap-1 sm:gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-gray-600 font-montserrat">Global Standards</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Action Button */}
                              <div className="flex-shrink-0 mx-auto sm:mx-0">
                                <button className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${colorScheme.gradient} rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover/item:rotate-12`}>
                                  <i className="ri-information-line text-base sm:text-lg"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Category Footer */}
                      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r ${colorScheme.gradient} rounded-lg flex items-center justify-center`}>
                              <span className="text-white font-bold text-xs sm:text-sm">{category.products.length}</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 font-montserrat">
                              {category.products.length} Product{category.products.length > 1 ? 's' : ''} Available
                            </span>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Section Footer with CTA */}
            <div className="mt-16 text-center">
              <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200">
                <div className="max-w-3xl mx-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-[#2879b6] to-[#7dc244] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <i className="ri-customer-service-2-line text-xl sm:text-2xl text-white"></i>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 font-montserrat">Need Custom Intermediates?</h3>
                      <p className="text-sm sm:text-base text-gray-600 font-montserrat">Our R&amp;D team can develop tailored solutions for your specific requirements</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#2879b6] to-[#7dc244] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-montserrat text-sm sm:text-base">
                      <i className="ri-phone-line"></i>
                      <span>Contact Our Experts</span>
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-[#7dc244] text-[#7dc244] rounded-xl font-semibold hover:bg-[#7dc244] hover:text-white transition-all duration-300 transform hover:scale-105 font-montserrat text-sm sm:text-base">
                      <i className="ri-file-download-line"></i>
                      <span>Download Catalog</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pyridine Derivatives Section */}
      {activeTab === 'pyridine' && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="text-center mb-16"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Pyridine Derivatives</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Specialized pyridine-based compounds for pharmaceutical applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pyridineDerivatives.map((product, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                  data-aos="zoom-in"
                  data-aos-duration="800"
                  data-aos-delay={index * 100}
                >
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gray-50 rounded-xl mb-4 flex items-center justify-center border border-gray-200 group-hover:border-[#ee6a31] transition-colors duration-300 mx-auto">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<i class="ri-test-tube-line text-4xl text-[#ee6a31]"></i>';
                          }
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 font-montserrat text-lg leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500 font-montserrat">CAS:</span>
                      <span className="text-sm font-mono bg-[#ee6a31]/10 px-3 py-1 rounded-full text-[#ee6a31] font-semibold">
                        {product.cas}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Thiophene Derivatives Section */}
      {activeTab === 'thiophene' && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div 
              className="text-center mb-16"
              data-aos="fade-up"
              data-aos-duration="1000"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Thiophene Derivatives</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Advanced thiophene-based compounds for diverse pharmaceutical applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {thiopheneDerivatives.map((product, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                  data-aos="zoom-in"
                  data-aos-duration="800"
                  data-aos-delay={index * 100}
                >
                  <div className="text-center">
                    <div className="w-28 h-28 bg-gray-50 rounded-xl mb-4 flex items-center justify-center border border-gray-200 group-hover:border-[#2879b6] transition-colors duration-300 mx-auto">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<i className="ri-atom-line text-3xl text-[#2879b6]"></i>';
                          }
                        }}
                      />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-3 font-montserrat text-base leading-tight">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500 font-montserrat">CAS:</span>
                      <span className="text-sm font-mono bg-[#2879b6]/10 px-3 py-1 rounded-full text-[#2879b6] font-semibold">
                        {product.cas}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Excellence Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-16"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">Product Excellence</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              Delivering superior quality APIs with cutting-edge technology and rigorous standards
            </p>
          </div>

          <div className="grid grid-cols-1 md-grid-col-3 gap-8">
            <div 
              className="group text-center p-8 bg-[#2879b6]/10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer"
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="100"
            >
              <div className="w-20 h-20 bg-[#2879b6] rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-[#2879b6]/20 group-hover:shadow-2xl">
                <i className="ri-shield-check-line text-3xl text-white group-hover:animate-pulse"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-montserrat">Quality Assurance</h3>
              <p className="text-gray-600 leading-relaxed font-montserrat">
                Rigorous quality control processes ensuring every API meets international standards and regulatory requirements.
              </p>
            </div>

            <div 
              className="group text-center p-8 bg-[#7dc244]/10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer"
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              <div className="w-20 h-20 bg-[#7dc244] rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-[#7dc244]/20 group-hover:shadow-2xl">
                <i className="ri-lightbulb-line text-3xl text-white group-hover:animate-pulse"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-montserrat">Innovation</h3>
              <p className="text-gray-600 leading-relaxed font-montserrat">
                Continuous research and development to bring cutting-edge pharmaceutical solutions to global markets.
              </p>
            </div>

            <div 
              className="group text-center p-8 bg-[#ee6a31]/10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer"
              data-aos="zoom-in"
              data-aos-duration="800"
              data-aos-delay="300"
            >
              <div className="w-20 h-20 bg-[#ee6a31] rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-[#ee6a31]/20 group-hover:shadow-2xl">
                <i className="ri-global-line text-3xl text-white group-hover:animate-pulse"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-montserrat">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed font-montserrat">
                Trusted partner to pharmaceutical companies in 80+ countries worldwide with proven track record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20manufacturing%20facility%20with%20production%20lines%2C%20advanced%20equipment%2C%20quality%20control%20processes%2C%20blue%20and%20orange%20gradient%20lighting%2C%20professional%20industrial%20environment%2C%20API%20production%2C%20clean%20room%20technology%2C%20contemporary%20pharmaceutical%20setup&width=1920&height=600&seq=products-cta&orientation=landscape')`
        }}
        data-aos="fade-in"
        data-aos-duration="1000"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6 font-montserrat"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="200"
          >
            Ready to Partner with Us?
          </h2>
          <p 
            className="text-xl text-white/90 max-w-3xl mx-auto mb-8 font-montserrat"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            Discover how our pharmaceutical expertise can accelerate your product development and market success.
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="600"
          >
            <a 
              href="/contact" 
              className="bg-[#2879b6] hover:bg-[#1e5f8c] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 font-montserrat"
            >
              <i className="ri-phone-line mr-2"></i>
              Get in Touch
            </a>
            <a 
              href="/capabilities" 
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer border border-white/30 font-montserrat"
            >
              <i className="ri-eye-line mr-2"></i>
              View Capabilities
            </a>
          </div>
        </div>
      </section>

      {/* API Details Popup Modal */}
      {selectedArea && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closePopup();
            }
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100 relative"
            data-aos="zoom-in"
            data-aos-duration="500"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer z-10 shadow-lg"
            >
              <i className="ri-close-line text-gray-600 text-xl"></i>
            </button>

            <div className="relative">
              {/* Header with Area Info */}
              <div className={`${getColorClasses(selectedArea.color).bg} p-8 rounded-t-3xl text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-xl">
                    <i className={`${selectedArea.icon} text-3xl text-white`}></i>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold mb-2 font-montserrat">{selectedArea.name}</h3>
                    <p className="text-white/90 font-semibold font-montserrat">{selectedArea.apiCount} APIs Available</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <i className="ri-check-line text-white/80"></i>
                        <span className="text-sm text-white/80 font-montserrat">100% Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <i className="ri-shield-check-line text-white/80"></i>
                        <span className="text-sm text-white/80 font-montserrat">FDA Approved</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-8">
                  <h4 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">Complete API List</h4>
                  <p className="text-gray-600 leading-relaxed font-montserrat mb-6">
                    Comprehensive list of all Active Pharmaceutical Ingredients available in the {selectedArea.name} therapeutic area.
                  </p>
                </div>

                {/* API Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedArea.apis.map((api: any, index: number) => (
                    <div 
                      key={index} 
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-300 border border-gray-200 hover:border-gray-300"
                      data-aos="fade-up"
                      data-aos-duration="600"
                      data-aos-delay={index * 50}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-2 font-montserrat leading-tight">
                            {api.name}
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-montserrat">CAS ID:</span>
                            <span className="text-sm font-mono bg-white px-2 py-1 rounded border text-gray-700">
                              {api.cas}
                            </span>
                          </div>
                        </div>
                        <div className={`w-8 h-8 ${getColorClasses(selectedArea.color).bg} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}>
                          <i className="ri-flask-line text-white text-sm"></i>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    className={`px-8 py-3 ${getColorClasses(selectedArea.color).bg} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer whitespace-nowrap font-montserrat`}
                  >
                    <i className="ri-download-line mr-2"></i>
                    Download API List
                  </button>
                  <button 
                    className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 cursor-pointer whitespace-nowrap font-montserrat"
                  >
                    <i className="ri-phone-line mr-2"></i>
                    Request Quote
                  </button>
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

export default Products;
