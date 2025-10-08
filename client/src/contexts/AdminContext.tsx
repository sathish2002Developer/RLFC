import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

interface AdminData {
  products: any[];
  users: any[];
  orders: any[];
  analytics: any;
  settings: any;
  aboutHero: {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage: string;
    isActive?: boolean;
  };
  aboutJourneyImage: string;
  visionMission: {
    visionTitle: string;
    visionDescription: string;
    visionImage: string;
    missionTitle: string;
    missionImage: string;
    missionPoints: { title: string; description: string }[];
  };
  heroSlides: any[];
  offerings: any[];
  statistics: any[];
  regulatoryApprovals: any[];
  aboutSections: any[];
  leadership: any[];
  values: any[];
  journey: any[];
  capabilitiesFacilities: any[];
  capabilitiesHero: {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage: string;
    isActive?: boolean;
  };
  capabilitiesResearch: {
    title: string;
    description: string;
    image: string;
    isActive?: boolean;
    apiCard: {
      title: string;
      subtitle: string;
      icon: string;
      color: string;
      points: { title: string; description: string }[];
    };
    fdfCard: {
      title: string;
      subtitle: string;
      icon: string;
      color: string;
      points: { title: string; description: string }[];
    };
    promise: {
      title: string;
      description: string;
      icon: string;
    };
  };
  contactHero: {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage: string;
    isActive?: boolean;
  };
  contactGetInTouch: {
    title: string;
    description: string;
    location: {
      title: string;
      address: string;
      icon: string;
      color: string;
    };
    phone: {
      title: string;
      number: string;
      hours: string;
      icon: string;
      color: string;
    };
    email: {
      title: string;
      address: string;
      responseTime: string;
      icon: string;
      color: string;
    };
    businessHours: {
      title: string;
      mondayFriday: string;
      saturday: string;
      sunday: string;
    };
    isActive?: boolean;
  };
  contactUsers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    avatar?: string;
    isActive: boolean;
    order: number;
  }[];
  homeGlobalImpact: {
    title: string;
    description: string;
    isActive?: boolean;
  };
  // Optional Sustainability CMS
  sustainability?: {
    hero: {
      title: string;
      subtitle?: string;
      description?: string;
      backgroundImage: string;
      isActive?: boolean;
    };
    sdgCards: {
      id: string;
      number: number;
      title: string;
      contribution: string;
      color: string;
      icon: string;
      isActive: boolean;
      order: number;
    }[];
    policies: {
      id: string;
      title: string;
      description: string;
      icon: string;
      color: string;
      isActive: boolean;
      order: number;
    }[];
    visionMission?: {
      sectionTitle: string;
      sectionSubtitle: string;
      visionTitle: string;
      visionSubtitle: string;
      visionDescription: string;
      visionPoints: { id: string; icon: string; text: string; color: string; order: number; isActive: boolean }[];
      missionTitle: string;
      missionSubtitle: string;
      missionPoints: { id: string; icon: string; text: string; color: string; order: number; isActive: boolean }[];
      stats: { id: string; label: string; value: string; color: string; order: number; isActive: boolean }[];
    };
    innovationAndTransformation?: {
      sectionTitle: string;
      sectionDescription: string; // rich text
      isActive?: boolean;
      digitalSolutions: {
        id: string;
        cardTitle: string;
        cardSubtitle: string;
        cardDescription: string; // rich text
        isActive: boolean;
        order: number;
      }[];
      researchInnovation: {
        id: string;
        cardTitle: string;
        cardSubtitle: string;
        cardDescription: string; // rich text
        isActive: boolean;
        order: number;
      }[];
    };
    socialResponsibility?: {
      sectionTitle: string;
      sectionDescription: string; // rich text
      csrCards: {
        id: string;
        cardTitle: string;
        cardSubtitle: string;
        cardDescription: string; // rich text
        highlightText: string;
        icon: string;
        gradientColors: string; // e.g. "#2879b6,#3a8bc4"
        isActive: boolean;
        order: number;
      }[];
      csrImpactTitle: string;
      csrImpactDescription: string; // rich text
      csrImpactItems: {
        id: string;
        title: string;
        description: string;
        icon: string;
        gradientColors: string; // e.g. "#7dc244,#6bb83a"
        isActive: boolean;
        order: number;
      }[];
      isActive?: boolean;
    };
    footerSection?: {
      title: string;
      subtitle: string; // rich text
      ctaText: string;
      ctaIcon: string;
      backgroundImageUrl: string;
      isActive?: boolean;
    };
  };
}

interface AdminContextType {
  user: AdminUser | null;
  data: AdminData;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  updateData: (key: keyof AdminData, value: any) => void;
  addItem: (key: keyof AdminData, item: any) => void;
  updateItem: (key: keyof AdminData, id: string, updates: any) => void;
  deleteItem: (key: keyof AdminData, id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'admin_user',
  DATA: 'admin_data'
};

// Helper function to compress data for storage
const compressDataForStorage = (data: AdminData) => {
  const compressed = { ...data };
  
  // Compress leadership images - convert base64 to smaller format or remove if too large
  if (compressed.leadership) {
    compressed.leadership = compressed.leadership.map((leader: any) => {
      if (leader.image && leader.image.startsWith('data:image/')) {
        // If image is base64 and larger than 100KB, replace with placeholder
        const base64Size = (leader.image.length * 3) / 4;
        if (base64Size > 100000) { // 100KB
          leader.image = 'https://via.placeholder.com/150';
        }
      }
      return leader;
    });
  }
  
  // Remove any other large base64 data
  Object.keys(compressed).forEach(key => {
    if (typeof compressed[key as keyof AdminData] === 'object' && compressed[key as keyof AdminData] !== null) {
      const obj = compressed[key as keyof AdminData] as any;
      if (Array.isArray(obj)) {
        obj.forEach((item: any) => {
          if (item.image && item.image.startsWith('data:image/')) {
            const base64Size = (item.image.length * 3) / 4;
            if (base64Size > 100000) {
              item.image = 'https://via.placeholder.com/150';
            }
          }
        });
      }
    }
  });
  
  return compressed;
};

// Helper function to handle quota exceeded error
const handleQuotaExceeded = (data: AdminData) => {
  try {
    // Try to save only essential data without images
    const essentialData = {
      ...data,
      leadership: data.leadership?.map((leader: any) => ({
        ...leader,
        image: leader.image?.startsWith('data:image/') ? 'https://via.placeholder.com/150' : leader.image
      })) || []
    };
    
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(essentialData));
    console.log('✅ Saved essential data without large images');
    
    // Show user notification
    if (typeof window !== 'undefined') {
      alert('Storage quota exceeded. Large images have been replaced with placeholders. Please use external image URLs instead of uploading large files.');
    }
  } catch (error) {
    console.error('❌ Failed to save even essential data:', error);
    // Last resort: clear localStorage and start fresh
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(defaultData));
    alert('Storage quota exceeded. Data has been reset to defaults. Please use external image URLs instead of uploading large files.');
  }
};

const defaultData: AdminData = {
  aboutHero: {
    title: 'About RLS',
    subtitle: '',
    description: '',
    backgroundImage: "https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20corporate%20headquarters%20building%20with%20professional%20architecture%2C%20dark%20blue%20and%20navy%20color%20scheme%2C%20contemporary%20glass%20facade%2C%20corporate%20excellence%20atmosphere%2C%20professional%20healthcare%20company%20facilities%2C%20business%20leadership%20environment%2C%20clean%20modern%20design&width=1920&height=800&seq=about-hero-dark&orientation=landscape",
    isActive: true
  },
  aboutJourneyImage: "https://readdy.ai/api/search-image?query=Company%20journey%20timeline%20graphic%20for%20pharma%20brand%2C%20clean%20modern%20horizontal%20timeline%20with%20milestones%2C%20blue%20and%20white%20corporate%20style%2C%20high%20resolution%20banner&width=1600&height=600&seq=pharma-journey-timeline&orientation=landscape",
  visionMission: {
    visionTitle: 'Our Vision',
    visionDescription: 'To transform global healthcare by building an innovation driven, integrated pharmaceutical platform from India, delivering affordable, accessible and life changing drugs that address unmet patient needs.',
    visionImage: 'https://readdy.ai/api/search-image?query=Futuristic%20pharmaceutical%20vision%20concept%20with%20innovative%20drug%20development%20laboratory%2C%20advanced%20technology%2C%20scientists%20working%20on%20life-changing%20medications%2C%20modern%20research%20facility%20with%20blue%20and%20cyan%20lighting%2C%20professional%20healthcare%20innovation%20atmosphere&width=600&height=400&seq=vision-concept&orientation=landscape',
    missionTitle: 'Our Mission',
    missionImage: 'https://readdy.ai/api/search-image?query=Pharmaceutical%20mission%20concept%20showing%20integrated%20supply%20chain%20and%20AI-powered%20research%2C%20modern%20production%20facility%20with%20advanced%20automation%2C%20scientists%20collaborating%20on%20drug%20development%2C%20green%20and%20emerald%20lighting%20atmosphere%2C%20professional%20healthcare%20manufacturing%20environment&width=600&height=600&seq=mission-concept&orientation=squarish',
    missionPoints: [
      { title: 'Build a future-ready integrated pharma platform', description: 'Delivering high-quality APIs and complex generic formulations across CNS, respiratory, and specialty therapies.' },
      { title: 'Leverage technology innovation in R&D and manufacturing', description: 'Accelerating development cycles with AI-enabled research and continuous flow chemistry.' },
      { title: 'Deepen global footprint', description: 'Expand reach across 80+ markets with responsive supply chains and local presence.' },
      { title: 'Sustainability through Green Chemistry', description: 'Implement water-positive initiatives, reduce carbon footprint, and embed ESG.' }
    ]
  },
  products: [
    {
      id: '1',
      name: 'Paracetamol API',
      category: 'Analgesic',
      price: 150,
      stock: 1000,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Ibuprofen API',
      category: 'Anti-inflammatory',
      price: 200,
      stock: 750,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ],
  orders: [
    {
      id: '1',
      customerName: 'John Doe',
      productName: 'Paracetamol API',
      quantity: 100,
      total: 15000,
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      customerName: 'Jane Smith',
      productName: 'Ibuprofen API',
      quantity: 50,
      total: 10000,
      status: 'completed',
      createdAt: new Date().toISOString()
    }
  ],
  analytics: {
    totalProducts: 2,
    totalUsers: 2,
    totalOrders: 2,
    totalRevenue: 25000,
    monthlyRevenue: 25000,
    topProducts: ['Paracetamol API', 'Ibuprofen API']
  },
  settings: {
    siteName: 'Pharmaceutical Admin Panel',
    currency: 'USD',
    timezone: 'UTC'
  },
  heroSlides: [
    {
      id: '1',
      image: "https://readdy.ai/api/search-image?query=State-of-the-art%20pharmaceutical%20laboratory%20with%20advanced%20scientific%20equipment%20and%20researchers%20in%20white%20coats%2C%20modern%20sterile%20environment%20with%20sophisticated%20instruments%20and%20glass%20beakers%2C%20high-tech%20medical%20research%20facility%20with%20blue%20accent%20lighting%20and%20clean%20white%20surfaces%2C%20professional%20pharmaceutical%20lab%20atmosphere%20showcasing%20innovation%20from%20lab%20to%20life&width=1200&height=600&seq=pharma-lab-1&orientation=landscape",
      title: "Accelerating Healthcare from Lab to Life",
      order: 1,
      isActive: true
    },
    {
      id: '2',
      image: "https://readdy.ai/api/search-image?query=Global%20pharmaceutical%20network%20visualization%20showing%20world%20map%20with%20connecting%20lines%20to%2080%20%20countries%2C%20modern%20digital%20interface%20displaying%20international%20connections%20and%20global%20reach%2C%20professional%20blue%20and%20green%20color%20scheme%20with%20geographic%20elements%2C%20clean%20minimalist%20design%20representing%20worldwide%20pharmaceutical%20distribution&width=1200&height=600&seq=global-reach-2&orientation=landscape",
      title: "Global Reach – Customers in 80+ countries",
      order: 2,
      isActive: true
    },
    {
      id: '3',
      image: "https://readdy.ai/api/search-image?query=Pharmaceutical%20production%20line%20showing%20building%20blocks%20to%20final%20formulations%20process%2C%20modern%20industrial%20facility%20with%20conveyor%20belts%20and%20packaging%20equipment%2C%20clean%20white%20manufacturing%20environment%20with%20blue%20industrial%20machinery%2C%20professional%20pharmaceutical%20manufacturing%20setting%20demonstrating%20reliable%20production%20chain&width=1200&height=600&seq=production-3&orientation=landscape",
      title: "From Building Blocks to Formulations: One Partner. Total Reliability",
      order: 3,
      isActive: true
    },
    {
      id: '4',
      image: "https://readdy.ai/api/search-image?query=Multiple modern pharmaceutical facilities and research centers layout showing 4 global facilities and 3 R&D centres, aerial view of integrated pharmaceutical platform with clean architecture, professional buildings with glass facades and modern design, comprehensive pharmaceutical infrastructure visualization&width=1200&height=600&seq=facilities-4&orientation=landscape",
      title: "4 Global Facilities | 3 R&D Centres | 1 Integrated Pharma Platform",
      order: 4,
      isActive: true
    }
  ],
  offerings: [
    {
      id: '1',
      title: "Legacy of Leadership",
      description: "40+ years of proven expertise in psychotropic APIs and complex generics",
      icon: "ri-award-line",
      color: "#2879b6",
      gradient: "from-blue-500 to-cyan-500",
      metric: "40+",
      unit: "Years",
      order: 1,
      isActive: true
    },
    {
      id: '2',
      title: "Global Trust",
      description: "Strong relationships with top pharma innovators and generics across 80+ countries",
      icon: "ri-global-line",
      color: "#7dc244",
      gradient: "from-green-500 to-emerald-500",
      metric: "80+",
      unit: "Countries",
      order: 2,
      isActive: true
    },
    {
      id: '3',
      title: "Diverse Portfolio",
      description: "Market leadership in CNS, antipsychotics, antihistamines, muscle relaxants, and expanding into high-barrier therapies",
      icon: "ri-briefcase-line",
      color: "#ee6a31",
      gradient: "from-orange-500 to-red-500",
      metric: "CNS",
      unit: "Leadership",
      order: 3,
      isActive: true
    },
    {
      id: '4',
      title: "Legacy of Leadership",
      description: "40+ years of proven expertise in psychotropic APIs and complex generics",
      icon: "ri-award-line",
      color: "#2879b6",
      gradient: "from-blue-500 to-cyan-500",
      metric: "40+",
      unit: "Years",
      order: 4,
      isActive: true
    },
    {
      id: '5',
      title: "Global Trust",
      description: "Strong relationships with top pharma innovators and generics across 80+ countries",
      icon: "ri-global-line",
      color: "#7dc244",
      gradient: "from-green-500 to-emerald-500",
      metric: "80+",
      unit: "Countries",
      order: 5,
      isActive: true
    },
    {
      id: '6',
      title: "Diverse Portfolio",
      description: "Market leadership in CNS, antipsychotics, antihistamines, muscle relaxants, and expanding into high-barrier therapies",
      icon: "ri-briefcase-line",
      color: "#ee6a31",
      gradient: "from-orange-500 to-red-500",
      metric: "CNS",
      unit: "Leadership",
      order: 6,
      isActive: true
    },
    {
      id: '7',
      title: "Innovation Engine",
      description: "DSIR-approved R&D and late-stage development capabilities driving differentiated products and faster scale-up",
      icon: "ri-lightbulb-line",
      color: "#2879b6",
      gradient: "from-purple-500 to-indigo-500",
      metric: "R&D",
      unit: "Centers",
      order: 7,
      isActive: true
    },
    {
      id: '8',
      title: "Integrated Value Chain",
      description: "End-to-end strength across KSM, APIs, and FDFs, reducing supply chain risk and ensuring reliability",
      icon: "ri-links-line",
      color: "#7dc244",
      gradient: "from-teal-500 to-cyan-500",
      metric: "E2E",
      unit: "Solutions",
      order: 8,
      isActive: true
    },
    {
      id: '9',
      title: "World-Class Manufacturing",
      description: "Multiple sites in Karnataka, Andhra Pradesh, and global hubs in Italy and US, scaling seamlessly from grams to tons",
      icon: "ri-flask-line",
      color: "#ee6a31",
      gradient: "from-pink-500 to-rose-500",
      metric: "6",
      unit: "Facilities",
      order: 9,
      isActive: true
    },
    {
      id: '10',
      title: "Regulatory Excellence",
      description: "Approvals and compliance across US, EU, and other major regulated markets",
      icon: "ri-shield-check-line",
      color: "#2879b6",
      gradient: "from-blue-500 to-purple-500",
      metric: "Global",
      unit: "Approvals",
      order: 10,
      isActive: true
    },
    {
      id: '11',
      title: "Partner of Choice",
      description: "Trusted by 550+ customers worldwide for quality, speed, and regulatory support",
      icon: "ri-line-chart-line",
      color: "#7dc244",
      gradient: "from-emerald-500 to-green-500",
      metric: "550+",
      unit: "Customers",
      order: 11,
      isActive: true
    },
    {
      id: '12',
      title: "Agile Supply Chain",
      description: "Flexible, resilient operations ensuring consistent delivery in volatile environments",
      icon: "ri-truck-line",
      color: "#ee6a31",
      gradient: "from-orange-500 to-amber-500",
      metric: "Resilient",
      unit: "Operations",
      order: 12,
      isActive: true
    },
    {
      id: '13',
      title: "Sustainability Commitment",
      description: "Embedding green chemistry, water-positive initiatives, and ESG practices into every process",
      icon: "ri-leaf-line",
      color: "#7dc244",
      gradient: "from-green-500 to-lime-500",
      metric: "ESG",
      unit: "Focused",
      order: 13,
      isActive: true
    },
    {
      id: '14',
      title: "Future-Ready Growth",
      description: "Backed by Refex Group's financial strength, infrastructure, and vision for global expansion",
      icon: "ri-rocket-line",
      color: "#2879b6",
      gradient: "from-indigo-500 to-purple-500",
      metric: "Global",
      unit: "Vision",
      order: 14,
      isActive: true
    }
  ],
  statistics: [
    {
      id: '1',
      title: 'Scientists & Researchers',
      value: 200,
      description: 'Dedicated professionals driving innovation in pharmaceutical research and development',
      image: 'https://readdy.ai/api/search-image?query=Professional%20pharmaceutical%20scientists%20and%20researchers%20working%20in%20modern%20laboratory%20with%20advanced%20scientific%20equipment%2C%20team%20of%20dedicated%20professionals%20in%20white%20lab%20coats%20conducting%20pharmaceutical%20research%20and%20development%2C%20clean%20sterile%20laboratory%20environment%20with%20microscopes%20and%20analytical%20instruments&width=400&height=300&seq=scientists-research&orientation=landscape',
      color: '#2879b6',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      title: 'Pharmaceutical Products',
      value: 150,
      description: 'Comprehensive portfolio of high-quality APIs and complex generic formulations',
      image: 'https://readdy.ai/api/search-image?query=Comprehensive%20portfolio%20of%20high-quality%20pharmaceutical%20products%20and%20APIs%2C%20modern%20pharmaceutical%20manufacturing%20facility%20with%20medicine%20bottles%20and%20complex%20generic%20formulations%2C%20professional%20pharmaceutical%20production%20line%20with%20quality%20control%20systems&width=400&height=300&seq=pharma-products&orientation=landscape',
      color: '#7dc244',
      order: 2,
      isActive: true
    },
    {
      id: '3',
      title: 'Global Markets',
      value: 80,
      description: 'Serving healthcare needs across diverse international markets with regulatory excellence',
      image: 'https://readdy.ai/api/search-image?query=Global%20pharmaceutical%20markets%20and%20international%20healthcare%20distribution%20network%2C%20world%20map%20showing%20diverse%20international%20markets%20with%20regulatory%20excellence%2C%20professional%20pharmaceutical%20distribution%20across%20multiple%20countries%20with%20modern%20logistics&width=400&height=300&seq=global-markets&orientation=landscape',
      color: '#ee6a31',
      order: 3,
      isActive: true
    }
  ],
  regulatoryApprovals: [
    {
      id: '1',
      icon: 'ri-shield-check-line',
      title: 'FDA',
      description: 'United States Food and Drug Administration',
      color: '#2879b6',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/08/4-1.jpg',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      icon: 'ri-heart-pulse-line',
      title: 'EDQM',
      description: 'European Directorate for Quality of Medicines',
      color: '#7dc244',
      image: 'https://www.rlfinechem.com/wp-content/uploads/2023/08/3-1.jpg',
      order: 2,
      isActive: true
    }
  ],
  aboutSections: [
    {
      id: '1',
      title: 'Our Mission',
      content: 'To accelerate healthcare innovation by providing high-quality pharmaceutical solutions that improve patient outcomes worldwide.',
      icon: 'ri-target-line',
      color: '#2879b6',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      title: 'Our Vision',
      content: 'To be the global leader in pharmaceutical innovation, setting new standards for quality, reliability, and patient care.',
      icon: 'ri-eye-line',
      color: '#7dc244',
      order: 2,
      isActive: true
    },
    {
      id: '3',
      title: 'Our Values',
      content: 'Integrity, Innovation, Excellence, and Patient-Centricity guide everything we do in our mission to improve global health.',
      icon: 'ri-heart-line',
      color: '#ee6a31',
      order: 3,
      isActive: true
    },
    {
      id: '4',
      title: 'Quality Commitment',
      content: 'We maintain the highest standards of quality and regulatory compliance across all our manufacturing and research facilities.',
      icon: 'ri-award-line',
      color: '#2879b6',
      order: 4,
      isActive: true
    }
  ],
  leadership: [
    // Advisory Board
    {
      id: '1',
      name: 'Dr. Brian Tempest',
      position: 'Advisor',
      category: 'Advisory Board',
      description: '45+ years of pharma leadership experience, former CEO of Ranbaxy – instrumental in shaping global pharma presence.',
      achievements: [
        '45+ years of pharma leadership experience',
        'Former CEO, Ranbaxy – instrumental in shaping global pharma presence',
        'Deep expertise in strategy, governance & global pharmaceutical markets',
        'Advisor to boards & shareholders of leading pharma companies',
        'Recognized thought leader with proven foresight in industry transformation'
      ],
      experience: '45+ Years',
      education: 'Pharmaceutical Leadership',
      image: 'https://via.placeholder.com/150',
      color: 'refex-blue',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      name: 'K. Raghavendra Rao',
      position: 'Advisor',
      category: 'Advisory Board',
      description: '40+ years of pharma industry expertise, founder of Orchid Pharma – built from the ground up to a leading company.',
      achievements: [
        '40+ years of pharma industry expertise',
        'Founder of Orchid Pharma – built from the ground up to a leading company',
        'Educational background: B.Com + MBA (IIM Ahmedabad)',
        'Entrepreneurial excellence in product selection, innovation & strategic growth',
        'Influential leader shaping the Indian pharmaceutical sector with lasting impact'
      ],
      experience: '40+ Years',
      education: 'B.Com + MBA (IIM Ahmedabad)',
      image: 'https://via.placeholder.com/150',
      color: 'refex-green',
      order: 2,
      isActive: true
    },
    // Technical Leadership Team
    {
      id: '3',
      name: 'Rajesh Naik',
      position: 'Executive Director – Operations',
      category: 'Technical Leadership Team',
      description: "26+ years in pharma technical operations. Ex-Dr. Reddy's, GSK, Biocon & Zydus; expert in manufacturing, SCM, EHS & operational excellence.",
      achievements: [
        '26+ years in pharma technical operations',
        "Ex-Dr. Reddy's, GSK, Biocon & Zydus experience",
        'Expert in manufacturing and supply chain management',
        'Specialist in EHS & operational excellence',
        'Led multiple facility scale-up projects'
      ],
      experience: '26+ Years',
      education: 'Technical Operations',
      image: 'https://via.placeholder.com/150',
      color: 'refex-orange',
      order: 3,
      isActive: true
    },
    {
      id: '4',
      name: 'Dr. Ramasubramanian Shanmuganathan',
      position: 'Head R & D',
      category: 'Technical Leadership Team',
      description: '29+ years in pharma R&D leadership with experience at AstraZeneca, Syngene, Cadila & Jubilant. Brings deep scientific expertise to drive innovation and pipeline growth.',
      achievements: [
        '29+ years in pharma R&D leadership',
        'Experience at AstraZeneca, Syngene, Cadila & Jubilant',
        'Deep scientific expertise in drug development',
        'Drives innovation and pipeline growth',
        'Led multiple successful product launches'
      ],
      experience: '29+ Years',
      education: 'PhD, Pharmaceutical Sciences',
      image: 'https://via.placeholder.com/150',
      color: 'refex-blue',
      order: 4,
      isActive: true
    },
    {
      id: '5',
      name: 'Mathijs Steegstra',
      position: 'Global Head of Scientific Affairs',
      category: 'Technical Leadership Team',
      description: '20+ years in pharma quality & regulatory across USA, Europe & MENA. Pharmacy graduate from Groningen; expertise in approvals, compliance & sterile facility management.',
      achievements: [
        '20+ years in pharma quality & regulatory',
        'Experience across USA, Europe & MENA regions',
        'Pharmacy graduate from Groningen University',
        'Expertise in regulatory approvals and compliance',
        'Specialist in sterile facility management'
      ],
      experience: '20+ Years',
      education: 'Pharmacy Graduate, Groningen',
      image: 'https://via.placeholder.com/150',
      color: 'refex-green',
      order: 5,
      isActive: true
    },
    {
      id: '6',
      name: 'Dr. Rajasekhara Reddy',
      position: 'Formulations R&D Head',
      category: 'Technical Leadership Team',
      description: "15+ years in formulations R&D; expertise in complex generics (liposomes, microspheres, nanoparticles, drug–device combos). PhD in Pharma Sciences; ex-Alembic, Hospira, Dr. Reddy's.",
      achievements: [
        '15+ years in formulations R&D',
        'Expertise in complex generics (liposomes, microspheres, nanoparticles)',
        'Specialist in drug–device combination products',
        'PhD in Pharmaceutical Sciences',
        "Ex-Alembic, Hospira, Dr. Reddy's"
      ],
      experience: '15+ Years',
      education: 'PhD, Pharmaceutical Sciences',
      image: 'https://via.placeholder.com/150',
      color: 'refex-orange',
      order: 6,
      isActive: true
    },
    // Management Team
    {
      id: '7',
      name: 'Anil Jain',
      position: 'Chairman & MD, Refex Group',
      category: 'Management Team',
      description: 'Visionary entrepreneur who built Refex from scratch, championing innovation, sustainability, and Make-in-India.',
      achievements: [
        'Built Refex Group from scratch',
        'Champion of innovation and sustainability',
        'Leader in Make-in-India initiatives',
        'Visionary entrepreneur with proven track record',
        'Strategic leader driving group expansion'
      ],
      experience: '40+ Years',
      education: 'Entrepreneurial Leadership',
      image: 'https://via.placeholder.com/150',
      color: 'refex-blue',
      order: 7,
      isActive: true
    },
    {
      id: '8',
      name: 'Dinesh Agarwal',
      position: 'Group CEO, Refex Group',
      category: 'Management Team',
      description: "Chartered Accountant with 20+ years' experience, renowned for strategic insight and execution, shaping Refex's growth into sustainable success.",
      achievements: [
        "Chartered Accountant with 20+ years' experience",
        'Renowned for strategic insight and execution',
        "Shaped Refex's growth into sustainable success",
        'Expert in financial strategy and operations',
        'Leader in business transformation'
      ],
      experience: '20+ Years',
      education: 'Chartered Accountant',
      image: 'https://via.placeholder.com/150',
      color: 'refex-green',
      order: 8,
      isActive: true
    },
    {
      id: '9',
      name: 'Mr. Hanumantha Rao Kamma',
      position: 'Chief Strategy Officer',
      category: 'Management Team',
      description: "23+ years in pharma with expertise in strategy, BD & sourcing. Master's in International Management; ex-senior leader across global markets.",
      achievements: [
        '23+ years in pharmaceutical industry',
        'Expertise in strategy, business development & sourcing',
        "Master's in International Management",
        'Ex-senior leader across global markets',
        'Strategic planning and execution specialist'
      ],
      experience: '23+ Years',
      education: "Master's in International Management",
      image: 'https://via.placeholder.com/150',
      color: 'refex-orange',
      order: 9,
      isActive: true
    },
    {
      id: '10',
      name: 'Sharat Narasapur',
      position: 'CEO, Refex Life Sciences',
      category: 'Management Team',
      description: "25+ years in chemicals & pharma, ex-Dr. Reddy's & SeQuent MD. Strategic leader blending technical expertise with commercial acumen for sustainable growth.",
      achievements: [
        '25+ years in chemicals & pharmaceutical industry',
        "Ex-Dr. Reddy's & SeQuent Managing Director",
        'Strategic leader with technical expertise',
        'Commercial acumen for sustainable growth',
        'Expert in business transformation'
      ],
      experience: '25+ Years',
      education: 'Chemical & Pharmaceutical Leadership',
      image: 'https://via.placeholder.com/150',
      color: 'refex-blue',
      order: 10,
      isActive: true
    },
    {
      id: '11',
      name: 'Dr. Janos Vaczi',
      position: 'Managing Director and CEO',
      category: 'Management Team',
      description: '25+ years in pharma with global MNC leadership. MD, Hungary; ex-President International Ops & senior roles across Europe.',
      achievements: [
        '25+ years in pharmaceutical industry',
        'Global MNC leadership experience',
        'MD qualification from Hungary',
        'Ex-President International Operations',
        'Senior roles across European markets'
      ],
      experience: '25+ Years',
      education: 'MD, Hungary',
      image: 'https://via.placeholder.com/150',
      color: 'refex-green',
      order: 11,
      isActive: true
    },
    {
      id: '12',
      name: 'Amit Shrivastava',
      position: 'Chief Marketing Officer',
      category: 'Management Team',
      description: 'President – Marketing, deep expertise in the API space, with strengths in portfolio strategy, competitive intelligence, and regulatory affairs, enabling growth in high-value, niche segments.',
      achievements: [
        'President – Marketing with deep API expertise',
        'Strengths in portfolio strategy and competitive intelligence',
        'Expert in regulatory affairs',
        'Enables growth in high-value, niche segments',
        'Strategic marketing leadership'
      ],
      experience: '20+ Years',
      education: 'Marketing & Business Strategy',
      image: 'https://via.placeholder.com/150',
      color: 'refex-orange',
      order: 12,
      isActive: true
    },
    {
      id: '13',
      name: 'PV Raghavendra Rao',
      position: 'CFO',
      category: 'Management Team',
      description: "CA with 25 years in financial management across pharma. Ex-CFO at Sequent, Macleods & Solara; 14 years at Dr. Reddy's. Expert in FP&A, taxation, treasury & strategy with a Goldratt Master Executive Certificate.",
      achievements: [
        'CA with 25 years in financial management',
        'Ex-CFO at Sequent, Macleods & Solara',
        '14 years experience at Dr. Reddy\'s',
        'Expert in FP&A, taxation, treasury & strategy',
        'Goldratt Master Executive Certificate holder'
      ],
      experience: '25+ Years',
      education: 'CA, Goldratt Master Executive Certificate',
      image: 'https://via.placeholder.com/150',
      color: 'refex-blue',
      order: 13,
      isActive: true
    },
    {
      id: '14',
      name: 'Srinivasan Pagadala',
      position: 'Chief HR Officer',
      category: 'Management Team',
      description: '25+ years in HR across pharma & healthcare. Specialist in talent, transformation & employee relations. Ex-Dr. Reddy\'s, Novartis, GVK Bio, Biological E, and Solara Active Pharma.',
      achievements: [
        '25+ years in HR across pharma & healthcare',
        'Specialist in talent, transformation & employee relations',
        'Ex-Dr. Reddy\'s, Novartis, GVK Bio experience',
        'Experience at Biological E and Solara Active Pharma',
        'Expert in organizational development'
      ],
      experience: '25+ Years',
      education: 'HR & Organizational Development',
      image: 'https://via.placeholder.com/150',
      color: 'refex-green',
      order: 14,
      isActive: true
    }
  ],
  values: [
    {
      id: '1',
      title: 'Innovation',
      description: 'Transform global healthcare by building an innovation driven, integrated pharmaceutical platform from India, delivering affordable, accessible and life changing drugs.',
      icon: 'ri-lightbulb-line',
      color: '#2879b6',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      title: 'Integrate',
      description: 'Build a fully integrated, backward linked supply chain delivering consistent, world class standards.',
      icon: 'ri-links-line',
      color: '#7dc244',
      order: 2,
      isActive: true
    },
    {
      id: '3',
      title: 'Improve',
      description: 'Leverage the amalgamation of AI and advanced research to shorten development timelines, enhance efficiency and deliver solutions faster.',
      icon: 'ri-rocket-line',
      color: '#ee6a31',
      order: 3,
      isActive: true
    },
    {
      id: '4',
      title: 'Impact',
      description: 'Drive affordability and global reach, ensuring life changing therapies are within every patient\'s reach.',
      icon: 'ri-heart-pulse-line',
      color: '#2879b6',
      order: 4,
      isActive: true
    }
  ],
  journey: [
    {
      id: '1',
      title: 'Foundation',
      description: 'Refex Group established with focus on refrigerants and industrial solutions, building a strong foundation for future expansion.',
      image: 'https://readdy.ai/api/search-image?query=Industrial%20refrigerant%20facility%20with%20modern%20equipment%20and%20clean%20manufacturing%20environment%2C%20professional%20industrial%20building%20with%20blue%20and%20white%20color%20scheme&width=600&height=400&seq=foundation-1&orientation=landscape',
      year: '1980s',
      color: '#2879b6',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      title: 'Healthcare Entry',
      description: 'Strategic entry into healthcare sector with acquisition of RL Fine Chem, bringing four decades of pharmaceutical expertise.',
      image: 'https://readdy.ai/api/search-image?query=Pharmaceutical%20acquisition%20and%20healthcare%20entry%20concept%2C%20modern%20pharmaceutical%20facility%20with%20professional%20architecture%2C%20blue%20and%20green%20color%20scheme&width=600&height=400&seq=healthcare-entry-2&orientation=landscape',
      year: '2022',
      color: '#7dc244',
      order: 2,
      isActive: true
    },
    {
      id: '3',
      title: 'Global Expansion',
      description: 'Acquisition of Extrovis (Switzerland) and Modepro (Pune) to create a fully integrated life sciences platform with global reach.',
      image: 'https://readdy.ai/api/search-image?query=Global%20pharmaceutical%20expansion%20and%20international%20acquisitions%2C%20world%20map%20with%20pharmaceutical%20facilities%2C%20professional%20blue%20and%20orange%20color%20scheme&width=600&height=400&seq=global-expansion-3&orientation=landscape',
      year: '2022-2023',
      color: '#ee6a31',
      order: 3,
      isActive: true
    }
  ]
  ,
  capabilitiesFacilities: [
    {
      id: '1',
      name: 'Hindupur Plant',
      type: 'API Manufacturing',
      established: '2004',
      location: 'Hindupur, India',
      capacity: '270 KL',
      color: 'refex-blue',
      image: 'https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20API%20manufacturing%20facility%20with%20large%20reactor%20vessels%2C%20advanced%20chemical%20processing%20equipment%2C%20blue%20industrial%20lighting%2C%20clean%20sterile%20environment%2C%20professional%20pharmaceutical%20production%20plant%2C%20high-tech%20manufacturing%20setup&width=600&height=400&seq=hindupur-plant&orientation=landscape',
      capabilities: ['Hydrogenation', 'High-vacuum distillation', 'High-temperature reactions'],
      approvals: ['WHO', 'GMP', 'WC', 'ISO 9001', 'ISO 18001', 'ISO 45001'],
      description: 'Our flagship API manufacturing facility with nearly two decades of operational excellence, specializing in complex chemical synthesis and advanced pharmaceutical intermediates.',
      order: 1,
      isActive: true
    },
    {
      id: '2',
      name: 'Gauribidnaur Plant',
      type: 'API Manufacturing',
      established: '2016',
      location: 'Gauribidnaur, India',
      capacity: '225 KL',
      color: 'refex-green',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1qLknDvhw740LxaKtofvAyEXEcw03tOA9aA&s',
      capabilities: ['Pilot facility', 'In-house testing laboratories'],
      approvals: ['USFDA', 'WHO GMP', 'ISO 9001', 'ISO 45001', 'ISO 14001', 'ISO 22301'],
      description: 'Advanced pilot facility with comprehensive testing capabilities, designed for process development and scale-up operations with full regulatory compliance.',
      order: 2,
      isActive: true
    },
    {
      id: '3',
      name: 'Kurkumbh Plant',
      type: 'Oncology & Specialty Intermediates',
      established: '2020',
      location: 'Kurkumbh, India',
      capacity: '100 KL',
      color: 'refex-orange',
      image: 'https://readdy.ai/api/search-image?query=USFDA%20approved%20oncology%20pharmaceutical%20manufacturing%20facility%20with%20specialized%20containment%20systems%2C%20orange%20industrial%20lighting%2C%20high-pressure%20reaction%20vessels%2C%20advanced%20safety%20systems%2C%20professional%20oncology%20drug%20production%20plant&width=600&height=400&seq=kurkumbh-plant&orientation=landscape',
      capabilities: ['−20°C to +250°C reactions', '2–3 Torr distillation', '15 Bar high-pressure operations'],
      approvals: ['USFDA inspection (2022, compliant)'],
      description: 'USFDA-approved facility specializing in oncology and specialty intermediates with extreme temperature and pressure capabilities for complex pharmaceutical synthesis.',
      order: 3,
      isActive: true
    },
    {
      id: '4',
      name: 'Ambernath Facility',
      type: 'Oncology & Specialty Intermediates',
      established: '2020',
      location: 'Ambernath, India',
      capacity: 'Scalable manufacturing',
      color: 'refex-blue',
      image: 'https://readdy.ai/api/search-image?query=CMO%20pharmaceutical%20partnering%20facility%20with%20flexible%20manufacturing%20capabilities%2C%20blue%20industrial%20design%2C%20scalable%20production%20equipment%2C%20customer-focused%20manufacturing%20environment%2C%20professional%20pharmaceutical%20contract%20manufacturing&width=600&height=400&seq=ambernath-facility&orientation=landscape',
      capabilities: ['CMO partnering unit', 'Scalable manufacturing', 'Customer flexibility'],
      approvals: ['GMP Standards'],
      description: 'CMO partnering unit supporting scalable manufacturing and customer flexibility.',
      order: 4,
      isActive: true
    },
    {
      id: '5',
      name: 'Sermoneta Facility',
      type: 'Formulations & Complex Generics',
      established: '1970s',
      location: 'Sermoneta, Italy',
      capacity: '550 million units annually',
      color: 'refex-green',
      image: 'https://readdy.ai/api/search-image?query=European%20pharmaceutical%20formulations%20facility%20with%20sterile%20injectable%20production%20lines%2C%20modern%20clean%20rooms%2C%20green%20industrial%20design%2C%20advanced%20aseptic%20processing%20equipment%2C%20professional%20pharmaceutical%20manufacturing%20in%20Italy&width=600&height=400&seq=sermoneta-facility&orientation=landscape',
      capabilities: ['Sterile injectables (oncology)', 'Onco OSDs', 'Cephalosporins', 'Monobactams'],
      approvals: ['EUGMP', 'FDA', 'ANVISA', 'PMDA', 'Health Canada'],
      description: 'Legacy: Over five decades of operations. Legacy European facility with over five decades of operations, specializing in sterile injectables and complex oncology formulations with global regulatory approvals.',
      order: 5,
      isActive: true
    },
    {
      id: '6',
      name: 'Sugar Land Facility',
      type: 'Formulations & Complex Generics',
      established: '2023',
      location: 'Sugar Land, Texas, USA',
      capacity: '20 million units annually',
      color: 'refex-orange',
      image: 'https://readdy.ai/api/search-image?query=Modern%20US%20pharmaceutical%20facility%20specializing%20in%20oncology%20topicals%20and%20oral%20liquids%2C%20orange%20industrial%20lighting%2C%20advanced%20formulation%20equipment%2C%20clean%20manufacturing%20environment%2C%20professional%20pharmaceutical%20production%20in%20Texas&width=600&height=400&seq=sugar-land-facility&orientation=landscape',
      capabilities: ['Oncology & hormonal topicals', 'Oral liquids', 'Dermatology formats'],
      approvals: ['USFDA', 'Health Canada'],
      description: 'Recently acquired US facility focused on oncology and hormonal topicals, providing strategic access to North American markets with specialized formulation capabilities.',
      order: 6,
      isActive: true
    },
    {
      id: '7',
      name: 'Hungary Packaging Facility',
      type: 'Packaging & Customization',
      established: '2022',
      location: 'Hungary',
      capacity: 'Flexible late-stage customization',
      color: 'refex-blue',
      image: 'https://readdy.ai/api/search-image?query=European%20pharmaceutical%20packaging%20facility%20with%20automated%20packaging%20lines%2C%20blue%20industrial%20design%2C%20flexible%20customization%20equipment%2C%20modern%20pharmaceutical%20packaging%20systems%2C%20professional%20drug%20packaging%20operations&width=600&height=400&seq=hungary-facility&orientation=landscape',
      capabilities: ['Flexible late-stage customization', 'OSDs & vials'],
      approvals: ['NCPHP (EU)'],
      description: 'Strategic European packaging facility providing flexible late-stage customization for oral solid dosage forms and vials, enabling market-specific requirements.',
      order: 7,
      isActive: true
    }
  ]
  ,
  capabilitiesHero: {
    title: 'Advanced Technology for',
    subtitle: 'Superior Performance',
    description: 'At Refex Life Sciences, our strength lies in the seamless integration of world-class manufacturing facilities, cutting-edge R&D, and robust regulatory expertise. Together, these capabilities enable us to deliver high-quality APIs and complex generics with consistency, scalability, and speed.',
    backgroundImage: "https://readdy.ai/api/search-image?query=Advanced%20pharmaceutical%20technology%20and%20manufacturing%20capabilities%2C%20modern%20industrial%20facility%20with%20cutting-edge%20equipment%2C%20blue%20and%20orange%20lighting%2C%20professional%20pharmaceutical%20innovation%20environment%2C%20high-tech%20manufacturing%20excellence&width=1920&height=800&seq=capabilities-hero&orientation=landscape",
    isActive: true
  },
  capabilitiesResearch: {
    title: 'Research & Development Excellence',
    description: 'At Refex Life Sciences, innovation is our engine of growth. With world-class R&D centres and a team of over 200 scientists, we are advancing the frontiers of both API development and complex finished dosage formulations (FDFs). Our research is focused on creating differentiated, sustainable, and patient‑centric solutions that address unmet needs across global healthcare.',
    image: 'https://readdy.ai/api/search-image?query=Pharmaceutical%20R%26D%20laboratory%20with%20scientists%20and%20advanced%20equipment%2C%20blue%20lighting%2C%20innovative%20research%20environment&width=1200&height=600&seq=rd-excellence&orientation=landscape',
    isActive: true,
    apiCard: {
      title: 'API R&D Strengths',
      subtitle: 'Advanced Process Development',
      icon: 'ri-flask-line',
      color: '#2879b6',
      points: [
        { title: 'Sustainable Process Development', description: 'Cost-effective, eco-friendly synthesis strategies for scalability and compliance.' },
        { title: 'Chiral Chemistry Expertise', description: 'Development of scalable chiral processes using advanced resolution and enzymatic techniques.' },
        { title: 'Complex Chemistry Capabilities', description: 'Proven expertise in Grignard reactions, N- & O-alkylations, borohydride reductions, and other specialized chemistries.' },
        { title: 'Impurity & Genotoxic Control', description: 'In-house synthesis, profiling, and validated risk management strategies ensuring global compliance.' },
        { title: 'Technology Transfer', description: 'Dedicated technical services team supporting seamless process scale‑up, HAZOP studies, and safety assessments.' },
        { title: 'Green Chemistry Principles', description: 'Embedding sustainability into every stage of product and process development.' },
        { title: 'Regulatory Support', description: 'Full‑fledged analytical R&D enabling robust filings and global regulatory responses.' }
      ]
    },
    fdfCard: {
      title: 'FDF R&D Strengths',
      subtitle: 'Complex Formulation Development',
      icon: 'ri-capsule-line',
      color: '#7dc244',
      points: [
        { title: 'Cross‑Functional Expertise', description: 'Integrating analytical, engineering, clinical, QA, and regulatory capabilities to deliver holistic solutions.' },
        { title: 'Innovation in Dosage Forms', description: 'Focus on complex injectables, novel drug delivery systems, and differentiated generics.' },
        { title: 'Proven Track Record', description: 'Successfully taking highly complex products from concept to commercialization, ensuring speed, compliance, and scalability.' }
      ]
    },
    promise: {
      title: 'Our R&D Promise',
      description: 'Through a relentless focus on innovation, sustainability, and regulatory excellence, Refex Life Sciences is shaping the future of healthcare – from breakthrough APIs to complex formulations that improve patient outcomes worldwide',
      icon: 'ri-lightbulb-line'
    }
  },
  contactHero: {
    title: 'Contact Us',
    subtitle: '',
    description: 'Ready to accelerate your healthcare solutions? Get in touch with our team of experts and discover how we can help bring your pharmaceutical innovations to life.',
    backgroundImage: "https://www.rlfinechem.com/wp-content/uploads/2025/07/Contact-us.webp",
    isActive: true
  },
  contactGetInTouch: {
    title: 'Get in Touch',
    description: 'We\'re here to help you navigate the complex world of pharmaceutical development. Whether you need API manufacturing, formulation development, or regulatory support, our team is ready to assist.',
    location: {
      title: 'Our Location',
      address: 'Refex Building, 67, Bazullah Road<br />Parthasarathy Puram, T Nagar<br />Chennai, 600017',
      icon: 'ri-map-pin-line',
      color: 'refex-blue'
    },
    phone: {
      title: 'Phone',
      number: '044 - 43405900/950',
      hours: 'Monday - Friday, 9:00 AM - 6:00 PM IST',
      icon: 'ri-phone-line',
      color: 'refex-green'
    },
    email: {
      title: 'Email',
      address: 'info@refex.co.in',
      responseTime: 'We\'ll respond within 24 hours',
      icon: 'ri-mail-line',
      color: 'refex-orange'
    },
    businessHours: {
      title: 'Business Hours',
      mondayFriday: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    isActive: true
  },
  contactUsers: [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@refex.co.in',
      phone: '+91 98765 43210',
      department: 'Research & Development',
      position: 'Head of R&D',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      order: 1
    },
    {
      id: '2',
      name: 'Ms. Priya Sharma',
      email: 'priya.sharma@refex.co.in',
      phone: '+91 98765 43211',
      department: 'Quality Assurance',
      position: 'Quality Manager',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      order: 2
    },
    {
      id: '3',
      name: 'Mr. Amit Patel',
      email: 'amit.patel@refex.co.in',
      phone: '+91 98765 43212',
      department: 'Manufacturing',
      position: 'Production Manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      order: 3
    },
    {
      id: '4',
      name: 'Dr. Sunita Reddy',
      email: 'sunita.reddy@refex.co.in',
      phone: '+91 98765 43213',
      department: 'Regulatory Affairs',
      position: 'Regulatory Head',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      isActive: true,
      order: 4
    }
  ],
  homeGlobalImpact: {
    title: 'Global Impact & Excellence',
    description: 'Trusted by healthcare professionals worldwide with proven expertise and unwavering commitment to quality',
    isActive: true
  },
  // Sustainability CMS defaults to mirror website content
  sustainability: {
    hero: {
      title: 'Transforming Health, Empowering Sustainability',
      subtitle: '',
      description:
        'Refex Life Sciences represents our collective vision of building a healthier, cleaner, and more sustainable world. Anchored in innovation and responsibility, we seek to redefine healthcare through affordable technology, ethical practices, and environmental stewardship.',
      backgroundImage:
        "https://readdy.ai/api/search-image?query=Sustainable%20pharmaceutical%20manufacturing%20with%20green%20technology%2C%20renewable%20energy%2C%20clean%20water%20systems%2C%20eco-friendly%20industrial%20facility%2C%20blue%20and%20green%20lighting%2C%20environmental%20responsibility%20in%20healthcare%2C%20modern%20sustainable%20infrastructure&width=1920&height=800&seq=sustainability-hero&orientation=landscape",
      isActive: true
    },
    sdgCards: [
      { id: 'sdg-3', number: 3, title: 'Good Health & Well-being', contribution: 'Promoting affordable, accessible healthcare and preventive medicine through our comprehensive pharmaceutical solutions and global reach across 80+ countries.', color: '#2879b6', icon: 'ri-heart-pulse-line', isActive: true, order: 1 },
      { id: 'sdg-6', number: 6, title: 'Clean Water & Sanitation', contribution: "Supporting Group's water restoration and water positivity projects, implementing sustainable water management practices across all our manufacturing facilities.", color: '#7dc244', icon: 'ri-drop-line', isActive: true, order: 2 },
      { id: 'sdg-7', number: 7, title: 'Affordable & Clean Energy', contribution: 'Committing to renewable energy transition for operations, implementing solar and wind energy solutions across our global manufacturing facilities.', color: '#ee6a31', icon: 'ri-sun-line', isActive: true, order: 3 },
      { id: 'sdg-9', number: 9, title: 'Industry, Innovation & Infrastructure', contribution: 'Encouraging R&D in sustainable life sciences and green manufacturing, investing in cutting‑up technology and innovation centers.', color: '#2879b6', icon: 'ri-building-line', isActive: true, order: 4 },
      { id: 'sdg-12', number: 12, title: 'Responsible Consumption & Production', contribution: 'Emphasising waste reduction, circular use of materials, and efficient resource utilisation through green chemistry principles and sustainable manufacturing processes.', color: '#7dc244', icon: 'ri-recycle-line', isActive: true, order: 5 },
      { id: 'sdg-13', number: 13, title: 'Climate Action', contribution: "Supporting Group's Net Zero Carbon 2040 mission through green infrastructure, renewable energy adoption, and carbon footprint reduction initiatives.", color: '#ee6a31', icon: 'ri-leaf-line', isActive: true, order: 6 },
      { id: 'sdg-17', number: 17, title: 'Partnerships for the Goals', contribution: 'Collaborating with research institutions, NGOs, and global initiatives for sustainable healthcare, fostering partnerships that drive innovation and positive impact across the pharmaceutical industry.', color: '#2879b6', icon: 'ri-team-line', isActive: true, order: 7 }
    ],
    policies: [
      { id: 'pol-1', title: 'Code of Conduct & Ethics', description: 'Promotes integrity, fairness, and anti-bribery standards.', icon: 'ri-shield-check-line', color: '#2879b6', isActive: true, order: 1 },
      { id: 'pol-2', title: 'Sustainability Policy', description: 'Comprehensive framework for environmental and social responsibility.', icon: 'ri-leaf-line', color: '#7dc244', isActive: true, order: 2 },
      { id: 'pol-3', title: 'Health, Safety & Environment (HSE) Policy', description: 'Ensures zero harm, safe workplaces, and proactive risk management.', icon: 'ri-shield-line', color: '#ee6a31', isActive: true, order: 3 },
      { id: 'pol-4', title: 'Diversity & Inclusion Policy', description: 'Encourages gender balance and equal opportunity.', icon: 'ri-group-line', color: '#2879b6', isActive: true, order: 4 },
      { id: 'pol-5', title: 'Quality Policy', description: 'Upholds international benchmarks for process and product excellence.', icon: 'ri-award-line', color: '#7dc244', isActive: true, order: 5 },
      { id: 'pol-6', title: 'Whistleblower Policy', description: 'Protects transparency and accountability through grievance redressal mechanisms.', icon: 'ri-alarm-warning-line', color: '#ee6a31', isActive: true, order: 6 }
    ],
    footerSection: {
      title: 'Towards a Sustainable Tomorrow',
      subtitle: "Refex Life Sciences is not just a business; it is a commitment to responsible growth, human well‑being, and environmental harmony. By leveraging the Refex Group's experience, ESG leadership, and sustainability roadmap, we aim to emerge as a pioneering force in sustainable healthcare and life sciences.",
      ctaText: 'Delivering "Health with Purpose" for Generations to Come',
      ctaIcon: 'ri-heart-pulse-line',
      backgroundImageUrl: "https://readdy.ai/api/search-image?query=Sustainable%20future%20vision%20with%20green%20technology%2C%20renewable%20energy%2C%20clean%20environment%2C%20modern%20sustainable%20infrastructure&width=1920&height=800&seq=sustainable-vision&orientation=landscape",
      isActive: true
    },
    socialResponsibility: {
      sectionTitle: 'Social Responsibility and Community Engagement',
      sectionDescription: "Even as an emerging entity, Refex Life Sciences aligns with the Group's CSR priorities, supporting initiatives that create lasting positive impact in the communities we serve.",
      csrCards: [
        { id: 'csr-1', cardTitle: 'Child Education', cardSubtitle: '& Skill Development', cardDescription: 'Supporting educational initiatives and skill development programs to empower children and youth with knowledge and opportunities for a brighter future.', highlightText: "Building Tomorrow's Leaders", icon: 'ri-book-open-line', gradientColors: '#2879b6,#3a8bc4', isActive: true, order: 1 },
        { id: 'csr-2', cardTitle: 'Health Awareness', cardSubtitle: '& Preventive Care', cardDescription: 'Promoting health awareness campaigns and preventive care programs to improve community health outcomes and reduce healthcare disparities.', highlightText: 'Healthier Communities', icon: 'ri-heart-pulse-line', gradientColors: '#7dc244,#6bb83a', isActive: true, order: 2 },
        { id: 'csr-3', cardTitle: 'Environmental', cardSubtitle: 'Conservation', cardDescription: 'Leading water body rejuvenation and afforestation initiatives to restore ecosystems and combat climate change for a sustainable future.', highlightText: 'Protecting Our Planet', icon: 'ri-leaf-line', gradientColors: '#26bde2,#1a9bc7', isActive: true, order: 3 }
      ],
      csrImpactTitle: 'Community Impact Through Partnership',
      csrImpactDescription: 'These programs are implemented through Group-supported NGOs and foundations, amplifying our positive community impact and creating sustainable change.',
      csrImpactItems: [
        { id: 'csri-1', title: 'Education', description: 'Supporting schools and skill development centers', icon: 'ri-graduation-cap-line', gradientColors: '#2879b6,#3a8bc4', isActive: true, order: 1 },
        { id: 'csri-2', title: 'Healthcare', description: 'Mobile health clinics and awareness programs', icon: 'ri-hospital-line', gradientColors: '#7dc244,#6bb83a', isActive: true, order: 2 },
        { id: 'csri-3', title: 'Environment', description: 'Tree plantation and water conservation projects', icon: 'ri-plant-line', gradientColors: '#26bde2,#1a9bc7', isActive: true, order: 3 }
      ],
      isActive: true
    },
    innovationAndTransformation: {
      sectionTitle: 'Innovation and Digital Transformation',
      sectionDescription: "Guided by the Group's strong digitalisation strategy, Refex Life Sciences is embracing technology to enhance operational efficiency, reduce environmental impact, and promote research-driven outcomes.",
      isActive: true,
      digitalSolutions: [
        { id: 'ds-1', cardTitle: 'Process Optimization', cardSubtitle: 'Data-Driven Excellence', cardDescription: 'Implementation of data-driven decision-making tools for process optimization and operational excellence.', isActive: true, order: 1 },
        { id: 'ds-2', cardTitle: 'Digital Documentation', cardSubtitle: 'Traceability & Compliance', cardDescription: 'Development of digital documentation systems for enhanced traceability and regulatory compliance.', isActive: true, order: 2 },
        { id: 'ds-3', cardTitle: 'AI Healthcare Analytics', cardSubtitle: 'Predictive Insights', cardDescription: 'Exploring AI-based healthcare analytics for early disease detection and predictive insights.', isActive: true, order: 3 }
      ],
      researchInnovation: [
        { id: 'ri-1', cardTitle: 'Institutional Collaboration', cardSubtitle: 'Purposeful Innovation', cardDescription: 'Collaboration with research institutions for developing sustainable pharma and biotech solutions.', isActive: true, order: 1 },
        { id: 'ri-2', cardTitle: 'Sustainable Solutions', cardSubtitle: 'Green Manufacturing', cardDescription: 'Focus on developing environmentally friendly pharmaceutical manufacturing processes.', isActive: true, order: 2 },
        { id: 'ri-3', cardTitle: 'Long-term Impact', cardSubtitle: 'Societal & Ecological Benefits', cardDescription: 'Innovation focusing on long-term societal and ecological benefits for future generations.', isActive: true, order: 3 }
      ]
    },
    visionMission: {
      sectionTitle: 'Vision & Mission',
      sectionSubtitle: 'Our commitment to sustainable healthcare and environmental stewardship',
      visionTitle: 'Our Vision',
      visionSubtitle: 'Sustainable Healthcare Partner',
      visionDescription: 'To become a trusted and sustainable healthcare partner, delivering impactful life science solutions that improve lives while preserving the environment for future generations.',
      visionPoints: [
        { id: 'vp-1', icon: 'ri-heart-pulse-line', text: 'Transform global healthcare through innovation-driven pharmaceutical solutions', color: '#2879b6', order: 1, isActive: true },
        { id: 'vp-2', icon: 'ri-earth-line', text: 'Preserve environmental resources for sustainable future generations', color: '#2879b6', order: 2, isActive: true },
        { id: 'vp-3', icon: 'ri-shield-check-line', text: 'Build trusted partnerships across global healthcare ecosystems', color: '#2879b6', order: 3, isActive: true },
        { id: 'vp-4', icon: 'ri-lightbulb-line', text: 'Drive impactful life science innovations for better patient outcomes', color: '#2879b6', order: 4, isActive: true }
      ],
      missionTitle: 'Our Mission',
      missionSubtitle: 'Impactful Solutions',
      missionPoints: [
        { id: 'mp-1', icon: 'ri-check-line', text: 'Deliver innovative, affordable, and high-quality healthcare solutions', color: '#7dc244', order: 1, isActive: true },
        { id: 'mp-2', icon: 'ri-check-line', text: 'Embed sustainability and ethics at the heart of every decision', color: '#7dc244', order: 2, isActive: true },
        { id: 'mp-3', icon: 'ri-check-line', text: 'Empower communities through accessible healthcare and education', color: '#7dc244', order: 3, isActive: true },
        { id: 'mp-4', icon: 'ri-check-line', text: "Contribute to India's sustainable development and climate goals", color: '#7dc244', order: 4, isActive: true }
      ],
      stats: [
        { id: 'vs-1', label: 'Core Pillars', value: '4', color: '#2879b6', order: 1, isActive: true },
        { id: 'vs-2', label: 'Commitment', value: '100%', color: '#2879b6', order: 2, isActive: true }
      ]
    }
  }
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [data, setData] = useState<AdminData>(defaultData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedData = localStorage.getItem(STORAGE_KEYS.DATA);

    console.log('🔄 AdminContext: Loading data from localStorage...', savedData ? 'Found data' : 'No data found');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // migration: ensure aboutHero exists
        if (!parsedData.aboutHero) parsedData.aboutHero = defaultData.aboutHero;
        if (!parsedData.aboutJourneyImage) parsedData.aboutJourneyImage = defaultData.aboutJourneyImage;
        if (!parsedData.visionMission) parsedData.visionMission = defaultData.visionMission;
        // ensure capabilities CMS defaults exist
        if (!parsedData.capabilitiesFacilities) parsedData.capabilitiesFacilities = defaultData.capabilitiesFacilities;
        if (!parsedData.capabilitiesHero) parsedData.capabilitiesHero = defaultData.capabilitiesHero;
        if (!parsedData.capabilitiesResearch) parsedData.capabilitiesResearch = defaultData.capabilitiesResearch;
        if (!parsedData.contactHero) parsedData.contactHero = defaultData.contactHero;
        if (!parsedData.contactGetInTouch) parsedData.contactGetInTouch = defaultData.contactGetInTouch;
        if (!parsedData.contactUsers) parsedData.contactUsers = defaultData.contactUsers;
        if (!parsedData.homeGlobalImpact) parsedData.homeGlobalImpact = defaultData.homeGlobalImpact;
        // ensure sustainability defaults
        if (!parsedData.sustainability) parsedData.sustainability = (defaultData as any).sustainability;
        if (parsedData.sustainability && !parsedData.sustainability.visionMission) parsedData.sustainability.visionMission = (defaultData as any).sustainability.visionMission;
        // ensure innovationAndTransformation defaults
        if (parsedData.sustainability && !parsedData.sustainability.innovationAndTransformation) {
          parsedData.sustainability.innovationAndTransformation = (defaultData as any).sustainability.innovationAndTransformation;
        }
        if (parsedData.sustainability && !parsedData.sustainability.socialResponsibility) {
          parsedData.sustainability.socialResponsibility = (defaultData as any).sustainability.socialResponsibility;
        }
        if (parsedData.sustainability && !parsedData.sustainability.footerSection) {
          parsedData.sustainability.footerSection = (defaultData as any).sustainability.footerSection;
        }
        // migration: ensure new fields exist on visionMission
        if (parsedData.sustainability?.visionMission) {
          const vm = parsedData.sustainability.visionMission as any;
          const defVm = (defaultData as any).sustainability.visionMission;
          vm.sectionTitle = vm.sectionTitle || defVm.sectionTitle;
          vm.sectionSubtitle = vm.sectionSubtitle || defVm.sectionSubtitle;
          vm.visionTitle = vm.visionTitle || defVm.visionTitle;
          vm.visionSubtitle = vm.visionSubtitle || defVm.visionSubtitle;
          vm.visionPoints = Array.isArray(vm.visionPoints) ? vm.visionPoints : defVm.visionPoints;
          vm.missionTitle = vm.missionTitle || defVm.missionTitle;
          vm.missionSubtitle = vm.missionSubtitle || defVm.missionSubtitle;
          vm.stats = Array.isArray(vm.stats) ? vm.stats : defVm.stats;
        }
        // normalize innovationAndTransformation arrays
        if (parsedData.sustainability?.innovationAndTransformation) {
          const it = parsedData.sustainability.innovationAndTransformation as any;
          const defIt = (defaultData as any).sustainability.innovationAndTransformation;
          it.sectionTitle = it.sectionTitle || defIt.sectionTitle;
          it.sectionDescription = it.sectionDescription || defIt.sectionDescription;
          it.isActive = it.isActive ?? defIt.isActive ?? true;
          it.digitalSolutions = Array.isArray(it.digitalSolutions) ? it.digitalSolutions : defIt.digitalSolutions;
          it.researchInnovation = Array.isArray(it.researchInnovation) ? it.researchInnovation : defIt.researchInnovation;
          // sort and filter
          it.digitalSolutions = it.digitalSolutions.filter((c: any) => c.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0));
          it.researchInnovation = it.researchInnovation.filter((c: any) => c.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0));
        }
        if (parsedData.sustainability?.socialResponsibility) {
          const sr = parsedData.sustainability.socialResponsibility as any;
          const defSr = (defaultData as any).sustainability.socialResponsibility;
          sr.sectionTitle = sr.sectionTitle || defSr.sectionTitle;
          sr.sectionDescription = sr.sectionDescription || defSr.sectionDescription;
          sr.csrImpactTitle = sr.csrImpactTitle || defSr.csrImpactTitle;
          sr.csrImpactDescription = sr.csrImpactDescription || defSr.csrImpactDescription;
          sr.isActive = sr.isActive ?? true;
          sr.csrCards = Array.isArray(sr.csrCards) ? sr.csrCards : defSr.csrCards;
          sr.csrImpactItems = Array.isArray(sr.csrImpactItems) ? sr.csrImpactItems : defSr.csrImpactItems;
          sr.csrCards = sr.csrCards.filter((c: any) => c.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0));
          sr.csrImpactItems = sr.csrImpactItems.filter((c: any) => c.isActive !== false).sort((a: any, b: any) => (a.order||0) - (b.order||0));
        }
        if (parsedData.sustainability?.footerSection) {
          const fs = parsedData.sustainability.footerSection as any;
          const defFs = (defaultData as any).sustainability.footerSection;
          fs.title = fs.title || defFs.title;
          fs.subtitle = fs.subtitle || defFs.subtitle;
          fs.ctaText = fs.ctaText || defFs.ctaText;
          fs.ctaIcon = fs.ctaIcon || defFs.ctaIcon;
          fs.backgroundImageUrl = fs.backgroundImageUrl || defFs.backgroundImageUrl;
          fs.isActive = fs.isActive ?? defFs.isActive ?? true;
        }
        // normalize leadership entries to ensure categories/images/colors exist
        if (Array.isArray(parsedData.leadership)) {
          parsedData.leadership = parsedData.leadership.map((m: any, idx: number) => {
            const inferredCategory = m.category || (typeof m.position === 'string' && m.position.toLowerCase().includes('advisor')
              ? 'Advisory Board'
              : 'Technical Leadership Team');
            const normalizedColor = typeof m.color === 'string' && m.color.startsWith('refex-') ? m.color : 'refex-blue';
            return {
              order: m.order ?? idx + 1,
              isActive: m.isActive ?? true,
              image: m.image || 'https://via.placeholder.com/300x300?text=Leader',
              category: inferredCategory,
              color: normalizedColor,
              ...m
            };
          });

          // Migration: ensure default Management Team entries exist
          try {
            const existingKeySet = new Set(
              parsedData.leadership.map((m: any) => `${(m.category||'').toLowerCase()}::${(m.name||'').toLowerCase()}`)
            );
            const defaultsToMerge = (defaultData.leadership || []).filter((m: any) =>
              (m.category || '').toLowerCase() === 'management team'
            );
            const missing = defaultsToMerge.filter((m: any) => !existingKeySet.has(`${(m.category||'').toLowerCase()}::${(m.name||'').toLowerCase()}`));
            if (missing.length > 0) {
              parsedData.leadership = [...parsedData.leadership, ...missing];
            }
          } catch {}
        }
        console.log('📥 AdminContext: Loaded data:', {
          heroSlides: parsedData.heroSlides?.length || 0,
          offerings: parsedData.offerings?.length || 0,
          statistics: parsedData.statistics?.length || 0,
          regulatoryApprovals: parsedData.regulatoryApprovals?.length || 0,
          aboutSections: parsedData.aboutSections?.length || 0,
          leadership: parsedData.leadership?.length || 0,
          values: parsedData.values?.length || 0,
          journey: parsedData.journey?.length || 0
        });
        setData(parsedData);
      } catch (error) {
        console.error('❌ AdminContext: Error parsing saved data:', error);
      }
    } else {
      console.log('📝 AdminContext: Using default data');
    }
    
    // Mark as initialized to prevent overwriting localStorage on first load
    setIsInitialized(true);
  }, []);

  // Save data to localStorage whenever data changes (but not on initial load)
  useEffect(() => {
    if (!isInitialized) {
      console.log('⏳ AdminContext: Not initialized yet, skipping save...');
      return;
    }
    
    console.log('💾 AdminContext: Data changed, saving to localStorage...', {
      heroSlides: data.heroSlides?.length || 0,
      offerings: data.offerings?.length || 0,
      statistics: data.statistics?.length || 0,
      regulatoryApprovals: data.regulatoryApprovals?.length || 0,
      aboutSections: data.aboutSections?.length || 0,
      leadership: data.leadership?.length || 0,
      values: data.values?.length || 0,
      journey: data.journey?.length || 0,
      capabilitiesFacilities: (data as any).capabilitiesFacilities?.length || 0
    });
    
    try {
      // Compress and clean data before saving
      const compressedData = compressDataForStorage(data);
      localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(compressedData));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('⚠️ localStorage quota exceeded, implementing fallback storage...');
        handleQuotaExceeded(data);
      } else {
        console.error('❌ Error saving to localStorage:', error);
      }
    }
    
    // Dispatch custom event to notify home page
    window.dispatchEvent(new CustomEvent('adminDataChanged'));
  }, [data, isInitialized]);

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.DATA && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing updated data:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const adminUser: AdminUser = {
      username: credentials.username,
      isAuthenticated: true
    };
    
    setUser(adminUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(adminUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const updateData = (key: keyof AdminData, value: any) => {
    setData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addItem = (key: keyof AdminData, item: any) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    console.log('➕ Adding item to', key, newItem);
    
    setData(prev => {
      const current = prev[key] as any;
      const nextValue = Array.isArray(current) ? [...current, newItem] : newItem;
      const newData = {
        ...prev,
        [key]: nextValue
      } as any;
      // Save to localStorage with compression
      try {
        const compressedData = compressDataForStorage(newData);
        localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(compressedData));
        const count = Array.isArray(newData[key]) ? (newData[key] as any[]).length : 1;
        console.log('💾 Saved to localStorage:', count, 'items in', key);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('⚠️ localStorage quota exceeded in addItem, implementing fallback...');
          handleQuotaExceeded(newData);
        } else {
          console.error('❌ Error saving to localStorage in addItem:', error);
        }
      }
      
      // Dispatch custom event to notify home page
      window.dispatchEvent(new CustomEvent('adminDataChanged'));
      
      return newData;
    });
  };

  const updateItem = (key: keyof AdminData, id: string, updates: any) => {
    console.log('✏️ Updating item in', key, 'with id', id, updates);
    
    setData(prev => {
      const current = prev[key] as any;
      let updatedValue: any;
      if (Array.isArray(current)) {
        updatedValue = (current as any[]).map((item: any) => item.id === id ? { ...item, ...updates } : item);
      } else if (current && typeof current === 'object') {
        updatedValue = { ...current, ...updates };
      } else {
        updatedValue = updates;
      }
      const newData = {
        ...prev,
        [key]: updatedValue
      } as any;
      // Save to localStorage with compression
      try {
        const compressedData = compressDataForStorage(newData);
        localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(compressedData));
        const count = Array.isArray(newData[key]) ? (newData[key] as any[]).length : 1;
        console.log('💾 Updated and saved to localStorage:', count, 'items in', key);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('⚠️ localStorage quota exceeded in updateItem, implementing fallback...');
          handleQuotaExceeded(newData);
        } else {
          console.error('❌ Error saving to localStorage in updateItem:', error);
        }
      }
      
      // Dispatch custom event to notify home page
      window.dispatchEvent(new CustomEvent('adminDataChanged'));
      
      return newData;
    });
  };

  const deleteItem = (key: keyof AdminData, id: string) => {
    console.log('🗑️ Deleting item from', key, 'with id', id);
    
    setData(prev => {
      const current = prev[key] as any;
      let nextValue: any;
      if (Array.isArray(current)) {
        nextValue = (current as any[]).filter((item: any) => item.id !== id);
      } else {
        // For object values, deleting by id is a no-op; keep current
        nextValue = current;
      }
      const newData = {
        ...prev,
        [key]: nextValue
      } as any;
      // Save to localStorage with compression
      try {
        const compressedData = compressDataForStorage(newData);
        localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(compressedData));
        const count = Array.isArray(newData[key]) ? (newData[key] as any[]).length : (newData[key] ? 1 : 0);
        console.log('💾 Deleted and saved to localStorage:', count, 'items in', key);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('⚠️ localStorage quota exceeded in deleteItem, implementing fallback...');
          handleQuotaExceeded(newData);
        } else {
          console.error('❌ Error saving to localStorage in deleteItem:', error);
        }
      }
      
      // Dispatch custom event to notify home page
      window.dispatchEvent(new CustomEvent('adminDataChanged'));
      
      return newData;
    });
  };

  const value: AdminContextType = {
    user,
    data,
    login,
    logout,
    updateData,
    addItem,
    updateItem,
    deleteItem
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminProvider');
  }
  return context;
}
