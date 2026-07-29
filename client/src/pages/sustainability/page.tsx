
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdminAuth } from '../../contexts/AdminContext';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

const Sustainability = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const isEnglish = currentLang === 'en';
  
  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath: string | undefined | null): string => {
    if (!imagePath) return '';
    // If already a full URL (starts with http), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If relative path, prepend API base URL
    if (imagePath.startsWith('/')) {
      return `https://refexls.com${imagePath}`;
    }
    return imagePath;
  };
  
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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data } = useAdminAuth();
  const [sustainabilityApi, setSustainabilityApi] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'digital' | 'research'>('digital');

  // Fetch sustainability data from API
  useEffect(() => {
    const fetchSustainability = async () => {
      try {
        const res = await fetch("https://refexls.com/api/cms/sustainability", {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          setSustainabilityApi(json.data || json);
        }
      } catch {}
    };
    fetchSustainability();
  }, []);

  // Use API data with fallback to local data
  const vm = sustainabilityApi?.visionMission || (data as any)?.sustainability?.visionMission;
  const innovationSection = sustainabilityApi?.innovationTransformation || (data as any)?.sustainability?.innovationAndTransformation;
  // Get translated digital solutions for non-English languages
  const digitalSolutions = useMemo(() => {
    if (isEnglish && sustainabilityApi?.digitalSolutions && sustainabilityApi.digitalSolutions.length > 0) {
      return sustainabilityApi.digitalSolutions.filter((c: any) => c.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0));
    }
    // Return static translated cards for non-English
    return [
      { id: 'dig-1', cardTitle: t("esgDigitalCard1Title"), cardDescription: t("esgDigitalCard1Description"), isActive: true, order: 1 },
      { id: 'dig-2', cardTitle: t("esgDigitalCard2Title"), cardDescription: t("esgDigitalCard2Description"), isActive: true, order: 2 },
      { id: 'dig-3', cardTitle: t("esgDigitalCard3Title"), cardDescription: t("esgDigitalCard3Description"), isActive: true, order: 3 }
    ];
  }, [isEnglish, sustainabilityApi?.digitalSolutions, t, i18n.language]);

  // Get translated research innovation for non-English languages
  const researchInnovation = useMemo(() => {
    if (isEnglish && sustainabilityApi?.researchInnovations && sustainabilityApi.researchInnovations.length > 0) {
      return sustainabilityApi.researchInnovations.filter((c: any) => c.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0));
    }
    // Return static translated cards for non-English
    return [
      { id: 'res-1', cardTitle: t("esgResearchCard1Title"), cardDescription: t("esgResearchCard1Description"), isActive: true, order: 1 },
      { id: 'res-2', cardTitle: t("esgResearchCard2Title"), cardDescription: t("esgResearchCard2Description"), isActive: true, order: 2 },
      { id: 'res-3', cardTitle: t("esgResearchCard3Title"), cardDescription: t("esgResearchCard3Description"), isActive: true, order: 3 }
    ];
  }, [isEnglish, sustainabilityApi?.researchInnovations, t, i18n.language]);
  const socialResponsibility = sustainabilityApi?.social || (data as any)?.sustainability?.socialResponsibility;
  const footerSection = sustainabilityApi?.footer || (data as any)?.sustainability?.footerSection;
  const heart = sustainabilityApi?.heart;
  
  // Get translated CSR cards for non-English languages
  const csrCards = useMemo(() => {
    if (isEnglish && socialResponsibility?.csrCards && socialResponsibility.csrCards.length > 0) {
      return socialResponsibility.csrCards.filter((c: any) => c.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0));
    }
    // Return static translated cards for non-English
    return [
      { 
        id: 'csr-1', 
        cardTitle: t("esgCsrCard1Title"), 
        cardSubtitle: t("esgCsrCard1Subtitle"), 
        cardDescription: t("esgCsrCard1Description"), 
        highlightText: t("esgCsrCard1Highlight"),
        icon: 'ri-book-open-line', 
        gradientColors: '#2879b6,#3a8bc4', 
        isActive: true, 
        order: 1 
      },
      { 
        id: 'csr-2', 
        cardTitle: t("esgCsrCard2Title"), 
        cardSubtitle: t("esgCsrCard2Subtitle"), 
        cardDescription: t("esgCsrCard2Description"), 
        highlightText: t("esgCsrCard2Highlight"),
        icon: 'ri-heart-pulse-line', 
        gradientColors: '#7dc244,#6bb83a', 
        isActive: true, 
        order: 2 
      },
      { 
        id: 'csr-3', 
        cardTitle: t("esgCsrCard3Title"), 
        cardSubtitle: t("esgCsrCard3Subtitle"), 
        cardDescription: t("esgCsrCard3Description"), 
        highlightText: t("esgCsrCard3Highlight"),
        icon: 'ri-leaf-line', 
        gradientColors: '#26bde2,#1a9bc7', 
        isActive: true, 
        order: 3 
      }
    ];
  }, [isEnglish, socialResponsibility?.csrCards, t, i18n.language]);
  
  // Get translated CSR impact items for non-English languages
  const csrImpactItems = useMemo(() => {
    if (isEnglish && socialResponsibility?.csrImpactItems && socialResponsibility.csrImpactItems.length > 0) {
      return socialResponsibility.csrImpactItems.filter((c: any) => c.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0));
    }
    // Return static translated items for non-English
    return [
      { 
        id: 'csri-1', 
        title: t("esgCsrImpact1Title"), 
        description: t("esgCsrImpact1Description"), 
        icon: 'ri-graduation-cap-line', 
        gradientColors: '#2879b6,#3a8bc4', 
        isActive: true, 
        order: 1 
      },
      { 
        id: 'csri-2', 
        title: t("esgCsrImpact2Title"), 
        description: t("esgCsrImpact2Description"), 
        icon: 'ri-hospital-line', 
        gradientColors: '#7dc244,#6bb83a', 
        isActive: true, 
        order: 2 
      },
      { 
        id: 'csri-3', 
        title: t("esgCsrImpact3Title"), 
        description: t("esgCsrImpact3Description"), 
        icon: 'ri-plant-line', 
        gradientColors: '#26bde2,#1a9bc7', 
        isActive: true, 
        order: 3 
      }
    ];
  }, [isEnglish, socialResponsibility?.csrImpactItems, t, i18n.language]);
  const visionDescription = isEnglish && vm?.visionDescription ? vm.visionDescription : t("esgVisionDescription");
  const missionPoints = (() => {
    if (isEnglish && vm?.missionPoints && vm.missionPoints.length > 0) {
      return vm.missionPoints.filter((p: any) => p.isActive).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }
    // Use static translations for non-English
    return [
      { id: 'mp-1', text: t("esgMissionPoint1"), order: 1, isActive: true },
      { id: 'mp-2', text: t("esgMissionPoint2"), order: 2, isActive: true },
      { id: 'mp-3', text: t("esgMissionPoint3"), order: 3, isActive: true },
      { id: 'mp-4', text: t("esgMissionPoint4"), order: 4, isActive: true }
    ];
  })();

  // Get translated heart sections for non-English languages - always use API images
  const getTranslatedHeartSections = useMemo(() => {
    if (heart?.sections && heart.sections.length > 0) {
      const apiSections = heart.sections.slice(0, 3);
      if (isEnglish) {
        // Convert image URLs for English as well
        return apiSections.map((sec: any) => ({
          ...sec,
          image: getImageUrl(sec.image)
        }));
      }
      // For non-English: use API images but translated text
      return apiSections.map((sec: any, index: number) => {
        const translatedTitles = [
          t("esgHeartEnvironmentalTitle"),
          t("esgHeartSocialTitle"),
          t("esgHeartGovernanceTitle")
        ];
        const translatedDescriptions = [
          t("esgHeartEnvironmentalDescription"),
          t("esgHeartSocialDescription"),
          t("esgHeartGovernanceDescription")
        ];
        const translatedMetrics = [
          [
            { title: t("esgHeartMetricNetZero") || "Net Zero", subtitle: t("esgHeartMetricCarbon2040") || "Carbon by 2040" },
            { title: t("esgHeartMetricGreenTech") || "Green Tech", subtitle: t("esgHeartMetricInnovation") || "Innovation Focus" }
          ],
          [
            { title: t("esgHeartMetricHealthcare") || "Healthcare", subtitle: t("esgHeartMetricAccessAll") || "Access for All" },
            { title: t("esgHeartMetricEducation") || "Education", subtitle: t("esgHeartMetricCommunityGrowth") || "Community Growth" }
          ],
          [
            { title: t("esgHeartMetricZeroHarm") || "Zero Harm", subtitle: t("esgHeartMetricAllOperations") || "All Operations" },
            { title: t("esgHeartMetric100Percent") || "100%", subtitle: t("esgHeartMetricTransparency") || "Transparency" }
          ]
        ];
        return {
          ...sec,
          title: translatedTitles[index] || sec.title,
          description: translatedDescriptions[index] || sec.description,
          metrics: translatedMetrics[index] || sec.metrics,
          image: getImageUrl(sec.image) // Always use API image with full URL
        };
      });
    }
    // Fallback if no API data
    return [
      {
        title: t("esgHeartEnvironmentalTitle"),
        description: t("esgHeartEnvironmentalDescription"),
        icon: "ri-leaf-line",
        color: "#7dc244",
        metrics: [
          { title: t("esgHeartMetricNetZero") || "Net Zero", subtitle: t("esgHeartMetricCarbon2040") || "Carbon by 2040" },
          { title: t("esgHeartMetricGreenTech") || "Green Tech", subtitle: t("esgHeartMetricInnovation") || "Innovation Focus" }
        ],
        image: ""
      },
      {
        title: t("esgHeartSocialTitle"),
        description: t("esgHeartSocialDescription"),
        icon: "ri-group-line",
        color: "#2879b6",
        metrics: [
          { title: t("esgHeartMetricHealthcare") || "Healthcare", subtitle: t("esgHeartMetricAccessAll") || "Access for All" },
          { title: t("esgHeartMetricEducation") || "Education", subtitle: t("esgHeartMetricCommunityGrowth") || "Community Growth" }
        ],
        image: ""
      },
      {
        title: t("esgHeartGovernanceTitle"),
        description: t("esgHeartGovernanceDescription"),
        icon: "ri-shield-check-line",
        color: "#ee6a31",
        metrics: [
          { title: t("esgHeartMetricZeroHarm") || "Zero Harm", subtitle: t("esgHeartMetricAllOperations") || "All Operations" },
          { title: t("esgHeartMetric100Percent") || "100%", subtitle: t("esgHeartMetricTransparency") || "Transparency" }
        ],
        image: ""
      }
    ];
  }, [heart?.sections, isEnglish, t, i18n.language]);

  const heartSections = getTranslatedHeartSections;
  
  // Get translated heart commitments for non-English languages
  const heartCommitments = useMemo(() => {
    if (heart?.commitments && heart.commitments.length > 0) {
      const apiCommitments = heart.commitments.slice(0, 4);
      if (isEnglish) {
        return apiCommitments;
      }
      // For non-English: use API structure but translated text
      return apiCommitments.map((commitment: any, index: number) => {
        const translatedTitles = [
          t("esgHeartCommitmentNetZero") || "Net Zero",
          t("esgHeartCommitmentWaterPositive") || "Water Positive",
          t("esgHeartCommitmentZeroWaste") || "Zero Waste",
          t("esgHeartCommitmentRenewableEnergy") || "100% Renewable"
        ];
        const translatedSubtitles = [
          t("esgHeartCommitmentCarbon2040") || "Carbon Emissions by 2040",
          t("esgHeartCommitmentWaterPositiveSub") || "Operations by 2030",
          t("esgHeartCommitmentZeroWasteSub") || "To Landfill by 2025",
          t("esgHeartCommitmentRenewableEnergySub") || "Energy by 2035"
        ];
        return {
          ...commitment,
          title: translatedTitles[index] || commitment.title,
          subtitle: translatedSubtitles[index] || commitment.subtitle
        };
      });
    }
    // Fallback if no API data
    return [
      { title: t("esgHeartCommitmentNetZero") || "Net Zero", subtitle: t("esgHeartCommitmentCarbon2040") || "Carbon Emissions by 2040", icon: "ri-leaf-line", color: "refex-green" },
      { title: t("esgHeartCommitmentWaterPositive") || "Water Positive", subtitle: t("esgHeartCommitmentWaterPositiveSub") || "Operations by 2030", icon: "ri-drop-line", color: "refex-blue" },
      { title: t("esgHeartCommitmentZeroWaste") || "Zero Waste", subtitle: t("esgHeartCommitmentZeroWasteSub") || "To Landfill by 2025", icon: "ri-recycle-line", color: "refex-green" },
      { title: t("esgHeartCommitmentRenewableEnergy") || "100% Renewable", subtitle: t("esgHeartCommitmentRenewableEnergySub") || "Energy by 2035", icon: "ri-sun-line", color: "refex-orange" }
    ];
  }, [heart?.commitments, isEnglish, t, i18n.language]);

  // Use API data for SDG cards with translated contributions for non-English
  const sdgData = useMemo(() => {
    const apiCards = sustainabilityApi?.sdgCards || [];
    if (apiCards.length > 0) {
      const sortedCards = apiCards
        .filter((c: any) => c.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
      
      if (isEnglish) {
        return sortedCards.map((card: any) => ({
          number: card.number,
          title: card.title,
          contribution: card.contribution,
          color: card.color,
          icon: card.icon
        }));
      }
      
      // For non-English: use API structure but translated contributions
      const contributionKeys: Record<number, string> = {
        3: "esgSdg3Contribution",
        6: "esgSdg6Contribution",
        7: "esgSdg7Contribution",
        9: "esgSdg9Contribution",
        12: "esgSdg12Contribution",
        13: "esgSdg13Contribution",
        17: "esgSdg17Contribution"
      };
      
      return sortedCards.map((card: any) => ({
        number: card.number,
        title: card.title,
        contribution: t(contributionKeys[card.number] || `esgSdg${card.number}Contribution`) || card.contribution,
        color: card.color,
        icon: card.icon
      }));
    }
    
    // Fallback to hardcoded data if no API data
    return [
      {
        number: 3,
        title: 'Good Health & Well-being',
        contribution: 'Promoting affordable, accessible healthcare and preventive medicine through our comprehensive pharmaceutical solutions and global reach across 80+ countries.',
        color: '#2879b6',
        icon: 'ri-heart-pulse-line'
      },
      {
        number: 6,
        title: 'Clean Water & Sanitation',
        contribution: "Supporting Group's water restoration and water positivity projects, implementing sustainable water management practices across all our manufacturing facilities.",
        color: '#7dc244',
        icon: 'ri-drop-line'
      },
      {
        number: 7,
        title: 'Affordable & Clean Energy',
        contribution: 'Committing to renewable energy transition for operations, implementing solar and wind energy solutions across our global manufacturing facilities.',
        color: '#ee6a31',
        icon: 'ri-sun-line'
      },
      {
        number: 9,
        title: 'Industry, Innovation & Infrastructure',
        contribution: 'Encouraging R&D in sustainable life sciences and green manufacturing, investing in cutting‑up technology and innovation centers.',
        color: '#2879b6',
        icon: 'ri-building-line'
      },
      {
        number: 12,
        title: 'Responsible Consumption & Production',
        contribution: 'Emphasising waste reduction, circular use of materials, and efficient resource utilisation through green chemistry principles and sustainable manufacturing processes.',
        color: '#7dc244',
        icon: 'ri-recycle-line'
      },
      {
        number: 13,
        title: 'Climate Action',
        contribution: "Supporting Group's Net Zero Carbon 2040 mission through green infrastructure, renewable energy adoption, and carbon footprint reduction initiatives.",
        color: '#ee6a31',
        icon: 'ri-leaf-line'
      },
      {
        number: 17,
        title: 'Partnerships for the Goals',
        contribution: 'Collaborating with research institutions, NGOs, and global initiatives for sustainable healthcare, fostering partnerships that drive innovation and positive impact across the pharmaceutical industry.',
        color: '#2879b6',
        icon: 'ri-team-line'
      }
    ];
  }, [sustainabilityApi?.sdgCards, isEnglish, t, i18n.language]);

  // policies rendered elsewhere; kept via admin

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('${getImageUrl(sustainabilityApi?.hero?.backgroundImage)}')`,
        }}
      >
        <div className="w-full px-6 lg:px-4">
          <div className="text-center">
           
            <h1
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-montserrat"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              <span className="block">{isEnglish && sustainabilityApi?.hero?.title ? sustainabilityApi.hero.title.split(',')[0]?.trim() : t("esgHeroTitle1")}</span>
              <span className="block mt-1">{isEnglish && sustainabilityApi?.hero?.title?.includes('Empowering') ? sustainabilityApi.hero.title.split(',')[1]?.trim() : t("esgHeroTitle2")}</span>
            </h1>
            <p
              className="text-lg text-white/90 max-w-4xl mx-auto leading-relaxed font-montserrat mb-8"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="600"
            >
              {isEnglish && sustainabilityApi?.hero?.description ? sustainabilityApi.hero.description : t("esgHeroDescription")}
            </p>
            <p
              className="text-sm text-white/80 max-w-5xl mx-auto font-montserrat"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="800"
            >
              {t("esgHeroSubDescription")}
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#2879b6]/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#7dc244]/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12"
               data-aos="fade-up"
               data-aos-duration="1000">
          
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-montserrat">
              {isEnglish && vm?.sectionTitle ? vm.sectionTitle : t("esgVisionMissionTitle")}
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto font-montserrat">
              {isEnglish && vm?.sectionSubtitle ? vm.sectionSubtitle : t("esgVisionMissionSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision Card */}
            <div 
              data-aos="fade-right" 
              data-aos-duration="1000"
              className="group h-full"
            >
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2879b6]/10 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#2879b6]/5 to-transparent rounded-full transform -translate-x-6 translate-y-6"></div>
                
                <div className="relative p-8 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 font-montserrat">{isEnglish && vm?.visionTitle ? vm.visionTitle : t("esgVisionTitle")}</h3>
                      <p className="text-[#2879b6] font-semibold font-montserrat text-sm">{isEnglish && vm?.visionSubtitle ? vm.visionSubtitle : t("esgVisionSubtitle")}</p>
                    </div>
                  </div>

                  {/* Content - Flex grow to fill space */}
                  <div className="flex-1 flex flex-col">
                    <div className="bg-gradient-to-br from-[#2879b6]/5 to-transparent rounded-2xl p-6 border border-[#2879b6]/10 mb-6">
                      <p className="text-gray-700 leading-relaxed font-montserrat text-base">{visionDescription}</p>
                    </div>

                    {/* Vision Focus Areas - Using API data */}
                    <div className="space-y-4 flex-1 mb-6">
                      {(vm?.visionPoints || []).filter((vp: any) => vp.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0)).map((vp: any) => (
                        <div key={vp.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#2879b6]/5 to-transparent rounded-xl border border-[#2879b6]/10 hover:border-[#2879b6]/20 transition-colors duration-300">
                          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: vp.color || '#2879b6' }}>
                            <i className={`${vp.icon || 'ri-check-line'} text-white text-sm`}></i>
                          </div>
                          <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                            {vp.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Stats - Using API data */}
                    {/* <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#2879b6]/10 mt-auto">
                      {(vm?.stats || []).filter((s: any) => s.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0)).map((s: any, index: number) => (
                        <div key={s.id} className="text-center">
                          <div className="text-lg font-bold" style={{ color: s.color || '#2879b6' }}>{s.value}</div>
                          <div className="text-xs text-gray-600 font-montserrat">{s.label}</div>
                          {index < (vm?.stats || []).filter((s: any) => s.isActive !== false).length - 1 && (
                            <div className="w-px h-8 bg-[#2879b6]/20"></div>
                          )}
                        </div>
                      ))}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div 
              data-aos="fade-left" 
              data-aos-duration="1000"
              className="group h-full"
            >
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full flex flex-col">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7dc244]/10 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#7dc244]/5 to-transparent rounded-full transform -translate-x-6 translate-y-6"></div>
                
                <div className="relative p-8 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                   
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 font-montserrat">{isEnglish && vm?.missionTitle ? vm.missionTitle : t("esgMissionTitle")}</h3>
                      <p className="text-[#7dc244] font-semibold font-montserrat text-sm">{isEnglish && vm?.missionSubtitle ? vm.missionSubtitle : t("esgMissionSubtitle")}</p>
                    </div>
                  </div>

                  {/* Content - Flex grow to fill space */}
                  <div className="flex-1 flex flex-col">
                    {/* Mission Points */}
                    <div className="space-y-4 flex-1 mb-6">
                      {missionPoints.map((mp: any) => (
                        <div key={mp.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#7dc244]/5 to-transparent rounded-xl border border-[#7dc244]/10 hover:border-[#7dc244]/20 transition-colors duration-300">
                          <div className="w-6 h-6 bg-[#7dc244] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <i className="ri-check-line text-white text-sm"></i>
                          </div>
                          <p className="text-gray-700 font-montserrat text-sm leading-relaxed">{mp.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Stats */}
                    {/* <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#7dc244]/10 mt-auto">
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#7dc244]">4</div>
                        <div className="text-xs text-gray-600 font-montserrat">Key Focus Areas</div>
                      </div>
                      <div className="w-px h-8 bg-[#7dc244]/20"></div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#7dc244]">100%</div>
                        <div className="text-xs text-gray-600 font-montserrat">Commitment</div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
       
        </div>
      </section>

     {/* Heart Section - dynamic from CMS */}
     {heart?.isActive !== false && (
  <section className="py-16 bg-white relative overflow-hidden scroll-smooth">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* Section Heading */}
      <div
        className="text-center mb-16"
        data-aos="fade-down"
        data-aos-duration="2000"
        data-aos-offset="200"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 font-montserrat">
          {isEnglish && heart?.mainTitle ? heart.mainTitle : t("esgHeartTitle")}
        </h2>
        <p className="text-base text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
          {isEnglish && heart?.mainSubtitle ? heart.mainSubtitle : t("esgHeartSubtitle")}
        </p>
      </div>

      {/* Dynamic Heart Sections */}
      <div className="space-y-16 mb-20">
        {heartSections.map((sec: any, idx: number) => (
          <div
            key={idx}
            className={`flex flex-col lg:flex-row ${
              idx % 2 === 0 ? '' : 'lg:flex-row-reverse'
            } items-center gap-8 lg:gap-16`}
            data-aos={idx % 2 === 0 ? 'fade-right' : 'fade-left'}
            data-aos-duration="2500"
            data-aos-delay={`${(idx + 1) * 150}`}
            data-aos-offset="300"
          >
            {/* Text Card */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <div
                className={`bg-gradient-to-br rounded-3xl p-6 sm:p-8 border transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${
                  idx === 0
                    ? 'from-[#7dc244]/10 to-[#7dc244]/5 border-[#7dc244]/20'
                    : idx === 1
                    ? 'from-[#2879b6]/10 to-[#2879b6]/5 border-[#2879b6]/20'
                    : 'from-[#ee6a31]/10 to-[#ee6a31]/5 border-[#ee6a31]/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      idx === 0
                        ? 'bg-gradient-to-br from-[#7dc244] to-[#6bb83a]'
                        : idx === 1
                        ? 'bg-gradient-to-br from-[#2879b6] to-[#3a8bc4]'
                        : 'bg-gradient-to-br from-[#ee6a31] to-[#d55a28]'
                    }`}
                  >
                    <i
                      className={`${
                        sec.icon ||
                        (idx === 0
                          ? 'ri-leaf-line'
                          : idx === 1
                          ? 'ri-group-line'
                          : 'ri-shield-check-line')
                      } text-2xl text-white`}
                    ></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 font-montserrat">
                      {sec.title}
                    </h3>
                    <p className="text-gray-600 font-montserrat leading-relaxed mb-6">
                      {sec.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(sec.metrics || []).slice(0, 2).map((m: any, mi: number) => (
                        <div
                          key={mi}
                          className={`bg-white/60 rounded-xl p-4 border backdrop-blur-sm ${
                            idx === 0
                              ? 'border-[#7dc244]/20'
                              : idx === 1
                              ? 'border-[#2879b6]/20'
                              : 'border-[#ee6a31]/20'
                          }`}
                        >
                          <div
                            className={`text-lg font-bold mb-1 ${
                              idx === 0
                                ? 'text-[#7dc244]'
                                : idx === 1
                                ? 'text-[#2879b6]'
                                : 'text-[#ee6a31]'
                            }`}
                          >
                            {m.title}
                          </div>
                          <div className="text-sm text-gray-600 font-montserrat">
                            {m.subtitle}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2">
              <div className="relative w-full">
                {sec.image && (
                  <img
                    src={getImageUrl(sec.image)}
                    alt={sec.title}
                    className="w-full h-auto max-h-80 object-cover rounded-3xl shadow-2xl transition-transform duration-[2500ms] ease-in-out group-hover:scale-105"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div
                  className={`absolute inset-0 rounded-3xl transition-all duration-1000 ${
                    idx === 0
                      ? 'bg-gradient-to-t from-[#7dc244]/20 to-transparent'
                      : idx === 1
                      ? 'bg-gradient-to-t from-[#2879b6]/20 to-transparent'
                      : 'bg-gradient-to-t from-[#ee6a31]/20 to-transparent'
                  }`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Commitments Grid */}
      <div
        className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-6 sm:p-8 md:p-12 shadow-inner"
        data-aos="fade-up"
        data-aos-duration="2500"
        data-aos-delay="400"
      >
        <div className="text-center mb-10">
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 font-montserrat">
            {t("esgHeartCommitmentsTitle")}
          </h3>
          <p className="text-gray-600 font-montserrat max-w-3xl mx-auto">
            {t("esgHeartCommitmentsSubtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {heartCommitments.map((c: any, ci: number) => (
            <div
              key={ci}
              className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
              data-aos="zoom-in"
              data-aos-duration="2000"
              data-aos-delay={`${(ci + 1) * 100}`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  c.color === 'refex-green'
                    ? 'bg-gradient-to-br from-[#7dc244] to-[#6bb83a]'
                    : c.color === 'refex-blue'
                    ? 'bg-gradient-to-br from-[#2879b6] to-[#3a8bc4]'
                    : 'bg-gradient-to-br from-[#ee6a31] to-[#d55a28]'
                }`}
              >
                <i className={`${c.icon || 'ri-leaf-line'} text-2xl text-white`}></i>
              </div>
              <div
                className={`text-2xl font-bold mb-2 ${
                  c.color === 'refex-green'
                    ? 'text-[#7dc244]'
                    : c.color === 'refex-blue'
                    ? 'text-[#2879b6]'
                    : 'text-[#ee6a31]'
                }`}
              >
                {c.title}
              </div>
              <div className="text-sm text-gray-600 font-montserrat">
                {c.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)}



      {/* Sustainability Philosophy Section */}
   

      {/* UN SDG Alignment Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16"
               data-aos="fade-down"
               data-aos-duration="1000">
      
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 font-montserrat">
              {t("esgSdgTitle")}
            </h2>
            <p className="text-base text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
              {t("esgSdgSubtitle")}
            </p>
          </div>

          {/* SDG Cards - Linear Flow Design */}
          <div className="space-y-8">
            {/* Row 1 - SDG 3 & 6 */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform -translate-y-2 overflow-hidden"
                   data-aos="slide-right"
                   data-aos-duration="800"
                   data-aos-delay="100">
                <div className="flex flex-col md:flex-row">
                <div
  className="p-8 md:w-1/3 flex items-center justify-center"
  style={{
    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/c/c4/Sustainable_Development_Goal_3.png')`,
    backgroundSize: "contain",       // keeps full image visible
    backgroundPosition: "center",    // centers the image
    backgroundRepeat: "no-repeat",   // prevents tiling
   // optional: adds base color behind image
                 // required for visibility
  }}
>
</div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg font-montserrat">{t("esgSdgContribution")}</h4>
                    <p className="text-gray-600 leading-relaxed font-montserrat">
                      {isEnglish ? sdgData[0].contribution : t("esgSdg3Contribution")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform -translate-y-2 overflow-hidden"
                   data-aos="slide-left"
                   data-aos-duration="800"
                   data-aos-delay="200">
                <div className="flex flex-col md:flex-row">
                <div
  className="p-8 md:w-1/3 flex items-center justify-center"
  style={{
    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/8/87/Sustainable_Development_Goal_6.png')`,
    backgroundSize: "contain",       // keeps full image visible
    backgroundPosition: "center",    // centers the image
    backgroundRepeat: "no-repeat",   // prevents tiling
   // optional: adds base color behind image
                 // required for visibility
  }}
>
</div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg font-montserrat">{t("esgSdgContribution")}</h4>
                    <p className="text-gray-600 leading-relaxed font-montserrat">
                      {isEnglish ? sdgData[1].contribution : t("esgSdg6Contribution")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 - SDG 7 & 9 */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform -translate-y-2 overflow-visible"
                   data-aos="slide-right"
                   data-aos-duration="800"
                   data-aos-delay="300">
                <div className="flex flex-col md:flex-row">
                          <div
  className="p-8 md:w-1/3 flex items-center justify-center"
  style={{
    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/a/aa/Sustainable_Development_Goal_07CleanEnergy.svg')`,
    backgroundSize: "contain",       // keeps full image visible
    backgroundPosition: "center",    // centers the image
    backgroundRepeat: "no-repeat",   // prevents tiling
   // optional: adds base color behind image
                 // required for visibility
  }}
>
</div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg font-montserrat">{t("esgSdgContribution")}</h4>
                    <p className="text-gray-600 leading-relaxed font-montserrat">
                      {isEnglish ? sdgData[2].contribution : t("esgSdg7Contribution")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform -translate-y-2 overflow-visible"
                   data-aos="slide-left"
                   data-aos-duration="800"
                   data-aos-delay="400">
                <div className="flex flex-col md:flex-row">
                <div
  className="p-8 md:w-1/3 flex items-center justify-center"
  style={{
    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/1/13/Sustainable_Development_Goal_09Industry.svg')`,
    backgroundSize: "contain",       // keeps full image visible
    backgroundPosition: "center",    // centers the image
    backgroundRepeat: "no-repeat",   // prevents tiling
   // optional: adds base color behind image
                 // required for visibility
  }}
>
</div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg font-montserrat">{t("esgSdgContribution")}</h4>
                    <p className="text-gray-600 leading-relaxed font-montserrat">
                      {isEnglish ? sdgData[3].contribution : t("esgSdg9Contribution")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3 - SDG 12 & 13 */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform -translate-y-2 overflow-visible"
                   data-aos="slide-right"
                   data-aos-duration="800"
                   data-aos-delay="500">
                <div className="flex flex-col md:flex-row">
                <div
  className="p-8 md:w-1/3 flex items-center justify-center"
  style={{
    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/6/65/Sustainable_Development_Goal_12ResponsibleConsumption.svg')`,
    backgroundSize: "contain",       // keeps full image visible
    backgroundPosition: "center",    // centers the image
    backgroundRepeat: "no-repeat",   // prevents tiling
   // optional: adds base color behind image
                 // required for visibility
  }}
>
</div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg font-montserrat">{t("esgSdgContribution")}</h4>
                    <p className="text-gray-600 leading-relaxed font-montserrat">
                      {isEnglish ? sdgData[4].contribution : t("esgSdg12Contribution")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform -translate-y-2 overflow-visible"
                   data-aos="slide-left"
                   data-aos-duration="800"
                   data-aos-delay="600">
                <div className="flex flex-col md:flex-row">
                <div
  className="p-8 md:w-1/3 flex items-center justify-center"
  style={{
    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/7/7b/Sustainable_Development_Goal_13Climate.svg')`,
    backgroundSize: "contain",       // keeps full image visible
    backgroundPosition: "center",    // centers the image
    backgroundRepeat: "no-repeat",   // prevents tiling
   // optional: adds base color behind image
                 // required for visibility
  }}
>
</div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg font-montserrat">{t("esgSdgContribution")}</h4>
                    <p className="text-gray-600 leading-relaxed font-montserrat">
                      {isEnglish ? sdgData[5].contribution : t("esgSdg13Contribution")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4 - SDG 17 (Centered) */}
            <div className="flex justify-center">
              <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform -translate-y-2 overflow-visible"
                   data-aos="zoom-in"
                   data-aos-duration="800"
                   data-aos-delay="700">
                <div className="flex flex-col md:flex-row">
                <div
  className="p-8 md:w-1/3 flex items-center justify-center"
  style={{
    backgroundImage: `url('https://upload.wikimedia.org/wikipedia/commons/c/cf/Sustainable_Development_Goal_17.png')`,
    backgroundSize: "contain",       // keeps full image visible
    backgroundPosition: "center",    // centers the image
    backgroundRepeat: "no-repeat",   // prevents tiling
   // optional: adds base color behind image
                 // required for visibility
  }}
>
</div>
                  <div className="p-8 md:w-2/3 flex flex-col justify-center">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg font-montserrat">{t("esgSdgContribution")}</h4>
                    <p className="text-gray-600 leading-relaxed font-montserrat">
                      {isEnglish ? sdgData[6].contribution : t("esgSdg17Contribution")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Impact Section */}
          {/* <div className="mt-16 bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 md:p-12 text-center"
               data-aos="fade-up"
               data-aos-duration="1000">
            <div className="w-20 h-20 bg-gradient-to-br from-[#2879b6] to-[#7dc244] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-global-line text-3xl text-white"></i>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 font-montserrat">
              Global Impact Through Local Action
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto font-montserrat">
              By aligning with the UN Sustainable Development Goals, we ensure that our business growth contributes to solving global challenges while creating lasting positive impact in the communities we serve.
            </p>
          </div> */}
        </div>
      </section>

      {/* Innovation & Digital Transformation Section */}
      {innovationSection?.isActive !== false && (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10"
                 data-aos="fade-down"
                 data-aos-duration="1000">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 font-montserrat">
                {isEnglish && innovationSection?.sectionTitle ? innovationSection.sectionTitle : t("esgInnovationTitle")}
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
                {isEnglish && innovationSection?.sectionDescription ? (
                  <span dangerouslySetInnerHTML={{ __html: innovationSection.sectionDescription }} />
                ) : (
                  t("esgInnovationDescription")
                )}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white rounded-full shadow border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveTab('digital')}
                  className={`px-5 py-2 text-sm font-semibold font-montserrat ${activeTab==='digital' ? 'bg-[#2879b6] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {t("esgDigitalSolutionsTab")}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('research')}
                  className={`px-5 py-2 text-sm font-semibold font-montserrat ${activeTab==='research' ? 'bg-[#7dc244] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {t("esgResearchInnovationTab")}
                </button>
              </div>
            </div>

            {/* Tab Panels */}
            {activeTab === 'digital' && (
              <div className="mb-12" data-aos="fade-right" data-aos-duration="800">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 font-montserrat mb-2">{t("esgDigitalSolutionsTitle")}</h3>
                    <p className="text-[#2879b6] font-semibold font-montserrat text-lg">{t("esgDigitalSolutionsSubtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {digitalSolutions.map((card: any) => (
                      <div key={card.id} className="bg-gradient-to-br from-[#2879b6]/10 to-[#2879b6]/5 rounded-xl p-6 border border-[#2879b6]/20">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 bg-[#2879b6] rounded-full"></div>
                          <h4 className="font-bold text-gray-800 font-montserrat">{card.cardTitle}</h4>
                        </div>
                        {card.cardSubtitle && (
                          <p className="text-xs text-[#2879b6] font-semibold font-montserrat mb-2">{card.cardSubtitle}</p>
                        )}
                        {card.cardDescription && (
                          <p className="text-sm text-gray-600 font-montserrat leading-relaxed" dangerouslySetInnerHTML={{ __html: card.cardDescription }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'research' && (
              <div className="mb-12" data-aos="fade-left" data-aos-duration="800">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 font-montserrat mb-2">{t("esgResearchInnovationTitle")}</h3>
                    <p className="text-[#7dc244] font-semibold font-montserrat text-lg">{t("esgResearchInnovationSubtitle")}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {researchInnovation.map((card: any) => (
                      <div key={card.id} className="bg-gradient-to-br from-[#7dc244]/10 to-[#7dc244]/5 rounded-xl p-6 border border-[#7dc244]/20">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-3 h-3 bg-[#7dc244] rounded-full"></div>
                          <h4 className="font-bold text-gray-800 font-montserrat">{card.cardTitle}</h4>
                        </div>
                        {card.cardSubtitle && (
                          <p className="text-xs text-[#7dc244] font-semibold font-montserrat mb-2">{card.cardSubtitle}</p>
                        )}
                        {card.cardDescription && (
                          <p className="text-sm text-gray-600 font-montserrat leading-relaxed" dangerouslySetInnerHTML={{ __html: card.cardDescription }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Social Responsibility Section (CMS-driven) */}
      {(socialResponsibility?.isActive ?? true) && (
        <section className="py-10 bg-gradient-to-br from-green-50 to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-aos="fade-down" data-aos-duration="1000">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
                {isEnglish && socialResponsibility?.sectionTitle ? socialResponsibility.sectionTitle : t("esgSocialTitle")}
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed font-montserrat">
                {isEnglish && socialResponsibility?.sectionDescription ? (
                  <span dangerouslySetInnerHTML={{ __html: socialResponsibility.sectionDescription }} />
                ) : (
                  t("esgSocialDescription")
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {csrCards.map((c: any, idx: number) => {
                const [from, to] = (c.gradientColors || '').split(',');
                const delay = (idx + 1) * 100;
                return (
                  <div key={c.id}
                    className="bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                    data-aos="zoom-in"
                    data-aos-duration="800"
                    data-aos-delay={String(delay)}
                  >
                    <div className={`bg-gradient-to-br p-6 text-white`} style={{ backgroundImage: `linear-gradient(to bottom right, ${from || '#2879b6'}, ${to || '#3a8bc4'})` }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <i className={`${c.icon || 'ri-star-line'} text-xl text-white`}></i>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-montserrat">{c.cardTitle}</h3>
                          {c.cardSubtitle && (<p className="text-sm opacity-90">{c.cardSubtitle}</p>)}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      {c.cardDescription && (
                        <p className="text-gray-600 text-sm leading-relaxed font-montserrat" dangerouslySetInnerHTML={{ __html: c.cardDescription }} />
                      )}
                      {c.highlightText && (
                        <div className="mt-4 flex items-center text-[#2879b6] text-sm font-semibold">
                          <i className="ri-arrow-right-line mr-2"></i>
                          {c.highlightText}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CSR Impact */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-8 md:p-12 border border-green-100" data-aos="fade-up" data-aos-duration="1000">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#7dc244] to-[#6bb83a] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <i className="ri-community-line text-3xl text-white"></i>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-montserrat">{isEnglish && socialResponsibility?.csrImpactTitle ? socialResponsibility.csrImpactTitle : t("esgSocialImpactTitle")}</h3>
                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto font-montserrat">
                  {isEnglish && socialResponsibility?.csrImpactDescription ? (
                    <span dangerouslySetInnerHTML={{ __html: socialResponsibility.csrImpactDescription }} />
                  ) : (
                    t("esgSocialImpactDescription")
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {csrImpactItems.map((it: any) => {
                  const [from, to] = (it.gradientColors || '').split(',');
                  return (
                    <div key={it.id} className="text-center">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundImage: `linear-gradient(to bottom right, ${from || '#2879b6'}, ${to || '#3a8bc4'})` }}>
                        <i className={`${it.icon || 'ri-star-line'} text-2xl text-white`}></i>
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2 font-montserrat">{it.title}</h4>
                      <p className="text-sm text-gray-600 font-montserrat">{it.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final Vision Section (CMS-driven) */}
      {(footerSection?.isActive ?? true) && (
        <section 
          className="py-10 bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage: footerSection?.backgroundImageUrl ? `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('${getImageUrl(footerSection.backgroundImageUrl)}')` : 'none'
          }}
          data-aos="fade-in"
          data-aos-duration="1000"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 
              className="text-3xl md:text-5xl font-bold text-white mb-8 font-montserrat leading-tight"
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-delay="400"
            >
              {isEnglish && footerSection?.title ? footerSection.title : t("esgFooterTitle")}
            </h2>
            <div className="max-w-5xl mx-auto">
              {isEnglish && footerSection?.subtitle && (
                <p 
                  className="text-xl text-white/90 leading-relaxed font-montserrat mb-8"
                  data-aos="fade-up"
                  data-aos-duration="1000"
                  data-aos-delay="600"
                  dangerouslySetInnerHTML={{ __html: footerSection.subtitle }}
                />
              )}
              <div 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#7dc244] to-[#6bb83a] rounded-2xl text-white font-bold text-lg shadow-xl"
                data-aos="zoom-in"
                data-aos-duration="1000"
                data-aos-delay="800"
              >
                <i className={`${footerSection?.ctaIcon || 'ri-heart-pulse-line'} mr-3 text-xl`}></i>
                <span className="font-montserrat">{isEnglish && footerSection?.ctaText ? footerSection.ctaText : t("esgFooterCta")}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      {/* <section 
        className="py-20 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Sustainable%20future%20partnership%20concept%20with%20green%20technology%2C%20renewable%20energy%2C%20clean%20environment%2C%20handshake%20collaboration%2C%20blue%20and%20green%20lighting%2C%20professional%20sustainability%20partnership%2C%20environmental%20responsibility&width=1920&height=600&seq=sustainability-cta&orientation=landscape')`
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
            Join Our Sustainability Journey
          </h2>
          <p 
            className="text-xl text-white/90 max-w-3xl mx-auto mb-8 font-montserrat"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="400"
          >
            Partner with us in creating a healthier, cleaner, and more sustainable world through innovative healthcare solutions
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="600"
          >
            <a 
              href="/contact" 
              className="bg-[#7dc244] hover:bg-[#6bb83a] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transform hover:-scale-105 font-montserrat"
            >
              <i className="ri-leaf-line mr-2"></i>
              Partner with Us
            </a>
            <a 
              href="/capabilities" 
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer border border-white/30 font-montserrat"
            >
              <i className="ri-eye-line mr-2"></i>
              Explore Our Capabilities
            </a>
          </div>
        </div>
      </section> */}

      <Footer />
    </div>
  );
};

export default Sustainability;
