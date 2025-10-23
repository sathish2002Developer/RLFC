import { useState,useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminContext';
import ImageCarousel from '../../components/feature/ImageCarousel';

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
  visionMission: any;
  heroSlides: any[];
  offerings: any[];
  statistics: any[];
  regulatoryApprovals: any[];
  aboutSections: any[];
  leadership: any[];
  values: any[];
  journey: any[];
  capabilitiesFacilities: any[];
  capabilitiesHero: any;
}

export default function AdminDashboard() {
  const { user, data, logout, addItem, updateItem, deleteItem, updateData } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('home-page');
  const [activeHomeSection, setActiveHomeSection] = useState('hero-slides');
  const [activeAboutSection, setActiveAboutSection] = useState('about-sections');
  const [activeCapabilitiesSection, setActiveCapabilitiesSection] = useState('cap-hero');
  const [activeSustainabilitySection, setActiveSustainabilitySection] = useState<'hero' | 'sdg' | 'policies' | 'vision' | 'innovation' | 'social' | 'footer' | 'heart'>('hero');
  const [activeProductsSection, setActiveProductsSection] = useState<'hero'>('hero');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productsHero, setProductsHero] = useState<any>(null);

  // API-backed hero slides for admin view
  const [heroSlidesApi, setHeroSlidesApi] = useState<any[]>([]);
  const fetchHeroSlides = async () => {
    try {
      const res = await fetch('/api/cms/home/slides');
      if (res.ok) {
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : json;
        setHeroSlidesApi((rows || []).slice().sort((a: any, b: any) => (a.order||0)-(b.order||0)));
        // notify public site to refresh
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('heroSlidesChanged'));
        }
      }
    } catch {}
  };
  useEffect(() => { fetchHeroSlides(); }, []);

  // API-backed offerings for admin view
  const [offeringsApi, setOfferingsApi] = useState<any[]>([]);
  const fetchOfferings = async () => {
    try {
      const res = await fetch('/api/cms/home/offerings');
      if (res.ok) {
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : json;
        setOfferingsApi((rows || []).slice().sort((a: any, b: any) => (a.order||0)-(b.order||0)));
      }
    } catch {}
  };
  useEffect(() => { fetchOfferings(); }, []);

  // API-backed statistics for admin view
  const [statisticsApi, setStatisticsApi] = useState<any[]>([]);
  const fetchStatistics = async () => {
    try {
      console.log('🔄 Admin: Fetching statistics from API...');
      const res = await fetch('/api/cms/home/statistics');
      if (res.ok) {
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : json;
        setStatisticsApi((rows || []).slice().sort((a: any, b: any) => (a.order||0)-(b.order||0)));
        console.log('✅ Admin: Statistics loaded from API:', rows?.length || 0, rows);
      } else {
        console.error('❌ Admin: Statistics API failed:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('❌ Admin: Statistics API error:', error);
    }
  };
  useEffect(() => { fetchStatistics(); }, []);

  // API-backed about data for admin view
  const [aboutApi, setAboutApi] = useState<any>({ hero: null, visionMission: null, sections: [], leadership: [], values: [], journey: [], aboutJourney: null });
  
  // Local state for about vision mission editing
  const [aboutVisionMissionLocal, setAboutVisionMissionLocal] = useState<any>(null);
  
  // Mission points modal state
  const [aboutMpModalOpen, setAboutMpModalOpen] = useState(false);
  const [aboutMpMode, setAboutMpMode] = useState<'add'|'edit'>('add');
  const [aboutMpEditingId, setAboutMpEditingId] = useState<string|undefined>();
  const [aboutMpForm, setAboutMpForm] = useState<any>({ 
    title: '', 
    description: '', 
    order: 1, 
    isActive: true 
  });
  const fetchAboutData = async () => {
    try {
      const res = await fetch('/api/cms/about');
      if (res.ok) {
        const json = await res.json();
        console.log('🔍 About API Response:', json);
        setAboutApi(json.data || json);
      } else {
        console.log('❌ About API Error:', res.status, res.statusText);
      }
    } catch (error) {
      console.log('❌ About API Fetch Error:', error);
    }
  };
  useEffect(() => { fetchAboutData(); }, []);

  // Products Hero CMS
  const fetchProductsHero = async () => {
    try {
      const res = await fetch('/api/cms/products/hero');
      if (res.ok) {
        const json = await res.json();
        setProductsHero(json.data);
      }
    } catch {}
  };
  useEffect(() => { fetchProductsHero(); }, []);

  // Image upload helper
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return json.imageUrl;
      }
      return null;
    } catch (e) {
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const saveProductsHero = async () => {
    try {
      const res = await fetch('/api/cms/products/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productsHero || {}),
      });
      if (!res.ok) throw new Error('Failed to save');
      await fetchProductsHero();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('productsHeroChanged'));
      }
      alert('Product Hero saved');
    } catch (e) {
      alert('Failed to save Product Hero');
    }
  };

  // Initialize local state when API data loads
  useEffect(() => {
    if (aboutApi.visionMission) {
      setAboutVisionMissionLocal(aboutApi.visionMission);
    }
  }, [aboutApi.visionMission]);

  // Save about vision mission to API
  const saveAboutVisionMission = async (data: any) => {
    try {
      const response = await fetch('/api/cms/about/vision-mission', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert('About Vision & Mission saved successfully!');
        // Refresh the API data
        await fetchAboutData();
        // Notify about page to refresh
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('aboutDataChanged'));
        }
        return true;
      } else {
        const errorData = await response.text();
        console.error('Save failed:', errorData);
        alert('Failed to save About Vision & Mission');
        return false;
      }
    } catch (error) {
      console.error('Error saving About Vision & Mission:', error);
      alert('Error saving About Vision & Mission');
      return false;
    }
  };

  // Mission points management functions
  const openAboutMpModal = (mode: 'add'|'edit', point?: any) => {
    setAboutMpMode(mode);
    if (mode === 'edit' && point) {
      setAboutMpEditingId(point.id);
      setAboutMpForm({ 
        title: point.title || '', 
        description: point.description || '', 
        order: point.order || 1, 
        isActive: point.isActive !== false 
      });
    } else {
      setAboutMpEditingId(undefined);
      setAboutMpForm({ 
        title: '', 
        description: '', 
        order: (aboutVisionMissionLocal?.missionPoints || []).length + 1, 
        isActive: true 
      });
    }
    setAboutMpModalOpen(true);
  };

  const closeAboutMpModal = () => {
    setAboutMpModalOpen(false);
    setAboutMpForm({ title: '', description: '', order: 1, isActive: true });
  };

  const saveAboutMpModal = () => {
    if (!aboutVisionMissionLocal) return;
    
    const existing = aboutVisionMissionLocal.missionPoints || [];
    if (aboutMpMode === 'add') {
      const newPoint = { 
        id: `mp-${Date.now()}`, 
        title: aboutMpForm.title, 
        description: aboutMpForm.description,
        order: Number(aboutMpForm.order) || 0, 
        isActive: !!aboutMpForm.isActive 
      };
      const updated = [...existing, newPoint];
      setAboutVisionMissionLocal({ ...aboutVisionMissionLocal, missionPoints: updated });
    } else if (aboutMpMode === 'edit' && aboutMpEditingId) {
      const updated = existing.map((p: any) => 
        p.id === aboutMpEditingId 
          ? { ...p, title: aboutMpForm.title, description: aboutMpForm.description, order: Number(aboutMpForm.order) || 0, isActive: !!aboutMpForm.isActive } 
          : p
      );
      setAboutVisionMissionLocal({ ...aboutVisionMissionLocal, missionPoints: updated });
    }
    closeAboutMpModal();
  };

  const deleteAboutMissionPoint = (id: string) => {
    if (!aboutVisionMissionLocal) return;
    const updated = (aboutVisionMissionLocal.missionPoints || []).filter((p: any) => p.id !== id);
    setAboutVisionMissionLocal({ ...aboutVisionMissionLocal, missionPoints: updated });
  };

  // API-backed regulatory approvals for admin view
  const [regulatoryApi, setRegulatoryApi] = useState<any[]>([]);
  const fetchRegulatory = async () => {
    try {
      const res = await fetch('/api/cms/home/regulatory');
      if (res.ok) {
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : json;
        setRegulatoryApi((rows || []).slice().sort((a: any, b: any) => (a.order||0)-(b.order||0)));
      }
    } catch {}
  };
  useEffect(() => { fetchRegulatory(); }, []);

  // API-backed sustainability data for admin view
  const [sustainabilityApi, setSustainabilityApi] = useState<any>(null);
  
  // Innovation & Transformation state
  const [itSectionTitle, setItSectionTitle] = useState('');
  const [itSectionDescription, setItSectionDescription] = useState('');
  const [itIsActive, setItIsActive] = useState(true);

  // Footer Section state
  const [footerTitle, setFooterTitle] = useState('');
  const [footerSubtitle, setFooterSubtitle] = useState('');
  const [footerCtaText, setFooterCtaText] = useState('');
  const [footerCtaIcon, setFooterCtaIcon] = useState('');
  const [footerBgImage, setFooterBgImage] = useState('');
  const [footerIsActive, setFooterIsActive] = useState(true);

  // Social Section state
  const [socialTitle, setSocialTitle] = useState('');
  const [socialDescription, setSocialDescription] = useState('');
  const [socialIsActive, setSocialIsActive] = useState(true);
  const [csrCards, setCsrCards] = useState<any[]>([]);
  const [csrImpactTitle, setCsrImpactTitle] = useState('');
  const [csrImpactDescription, setCsrImpactDescription] = useState('');
  const [csrImpactItems, setCsrImpactItems] = useState<any[]>([]);
  // Sustainability — Heart section state
  const [heartMainTitle, setHeartMainTitle] = useState<string>('');
  const [heartMainSubtitle, setHeartMainSubtitle] = useState<string>('');
  const [heartSections, setHeartSections] = useState<any[]>([]); // [{title,description,icon,image,metrics:[{title,subtitle}] }]
  const [heartCommitments, setHeartCommitments] = useState<any[]>([]);
  const [heartIsActive, setHeartIsActive] = useState<boolean>(true);
  const fetchSustainability = async () => {
    try {
      const res = await fetch('/api/cms/sustainability');
      if (res.ok) {
        const json = await res.json();
        setSustainabilityApi(json.data || json);
      }
    } catch {}
  };
  useEffect(() => { fetchSustainability(); }, []);

  // API-backed capabilities data for admin view
  const [capabilitiesApi, setCapabilitiesApi] = useState<any>({
    hero: null,
    research: null,
    facilities: []
  });
  const fetchCapabilities = async () => {
    try {
      const res = await fetch('https://refexlifesciences.com/api/cms/capabilities');
      if (res.ok) {
        const json = await res.json();
        setCapabilitiesApi(json.data || json);
      }
    } catch {}
  };
  useEffect(() => { fetchCapabilities(); }, []);
  const getAuthToken = () => localStorage.getItem('auth_token') || localStorage.getItem('token') || '';
  const authHeaders = (): Record<string, string> => {
    const t = getAuthToken();
    return t ? { 'Authorization': `Bearer ${t}` } : {};
  };

  // Sustainability local state and helpers
  const sustainability: any = (data as any).sustainability || { hero: { title: '', description: '', backgroundImage: '' }, sdgCards: [], policies: [] };
  const [sustHeroTitle, setSustHeroTitle] = useState<string>(sustainability.hero?.title || '');
  const [sustHeroDescription, setSustHeroDescription] = useState<string>(sustainability.hero?.description || '');
  const [sustHeroBg, setSustHeroBg] = useState<string>(sustainability.hero?.backgroundImage || '');

  // Update local state when API data changes
  useEffect(() => {
    if (sustainabilityApi?.hero) {
      setSustHeroTitle(sustainabilityApi.hero.title || '');
      setSustHeroDescription(sustainabilityApi.hero.description || '');
      setSustHeroBg(sustainabilityApi.hero.backgroundImage || '');
    }
    if (sustainabilityApi?.innovationTransformation) {
      setItSectionTitle(sustainabilityApi.innovationTransformation.sectionTitle || '');
      setItSectionDescription(sustainabilityApi.innovationTransformation.sectionDescription || '');
      setItIsActive(sustainabilityApi.innovationTransformation.isActive !== false);
    }
    if (sustainabilityApi?.footer) {
      setFooterTitle(sustainabilityApi.footer.title || '');
      setFooterSubtitle(sustainabilityApi.footer.subtitle || '');
      setFooterCtaText(sustainabilityApi.footer.ctaText || '');
      setFooterCtaIcon(sustainabilityApi.footer.ctaIcon || '');
      setFooterBgImage(sustainabilityApi.footer.backgroundImageUrl || '');
      setFooterIsActive(sustainabilityApi.footer.isActive !== false);
    }
    if (sustainabilityApi?.social) {
      setSocialTitle(sustainabilityApi.social.sectionTitle || '');
      setSocialDescription(sustainabilityApi.social.sectionDescription || '');
      setSocialIsActive(sustainabilityApi.social.isActive !== false);
      setCsrCards(sustainabilityApi.social.csrCards || []);
      setCsrImpactTitle(sustainabilityApi.social.csrImpactTitle || '');
      setCsrImpactDescription(sustainabilityApi.social.csrImpactDescription || '');
      setCsrImpactItems(sustainabilityApi.social.csrImpactItems || []);
    }
    if ((sustainabilityApi as any)?.heart) {
      const h = (sustainabilityApi as any).heart;
      setHeartMainTitle(h.mainTitle || '');
      setHeartMainSubtitle(h.mainSubtitle || '');
      setHeartSections(Array.isArray(h.sections) ? h.sections : []);
      setHeartCommitments(Array.isArray(h.commitments) ? h.commitments : []);
      setHeartIsActive(h.isActive !== false);
    }
  }, [sustainabilityApi]);

  // Innovation & Transformation helpers - using API data
  const digitalSolutionsSorted: any[] = (sustainabilityApi?.digitalSolutions || []).slice().sort((a: any, b: any) => (a.order||0) - (b.order||0));
  const researchInnovationSorted: any[] = (sustainabilityApi?.researchInnovations || []).slice().sort((a: any, b: any) => (a.order||0) - (b.order||0));
  
  // Save Innovation & Transformation section
  const saveInnovationTransformation = async () => {
    try {
      await fetch('/api/cms/sustainability/innovation-transformation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: itSectionTitle,
          sectionDescription: itSectionDescription,
          isActive: itIsActive
        })
      });
      await fetchSustainability();
    } catch {}
  };
  
  // Digital Solutions CRUD
  const addDigitalCard = async () => {
    try {
      const nextOrder = (sustainabilityApi?.digitalSolutions?.length || 0) + 1;
      await fetch('/api/cms/sustainability/digital-solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardTitle: 'New Title',
          cardSubtitle: '',
          cardDescription: '',
          order: nextOrder,
          isActive: true
        })
      });
      await fetchSustainability();
    } catch {}
  };
  
  const updateDigitalField = async (id: string, field: string, value: any) => {
    try {
      await fetch(`/api/cms/sustainability/digital-solutions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: field === 'order' ? Number(value)||0 : field === 'isActive' ? !!value : value
        })
      });
      await fetchSustainability();
    } catch {}
  };
  
  const deleteDigitalCard = async (id: string) => {
    try {
      await fetch(`/api/cms/sustainability/digital-solutions/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      await fetchSustainability();
    } catch {}
  };
  
  // Research & Innovation CRUD
  const addResearchCard = async () => {
    try {
      const nextOrder = (sustainabilityApi?.researchInnovations?.length || 0) + 1;
      await fetch('/api/cms/sustainability/research-innovations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardTitle: 'New Title',
          cardSubtitle: '',
          cardDescription: '',
          order: nextOrder,
          isActive: true
        })
      });
      await fetchSustainability();
    } catch {}
  };
  
  const updateResearchField = async (id: string, field: string, value: any) => {
    try {
      await fetch(`/api/cms/sustainability/research-innovations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: field === 'order' ? Number(value)||0 : field === 'isActive' ? !!value : value
        })
      });
      await fetchSustainability();
    } catch {}
  };
  
  const deleteResearchCard = async (id: string) => {
    try {
      await fetch(`/api/cms/sustainability/research-innovations/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      await fetchSustainability();
    } catch {}
  };

  // Save Footer Section
  const saveFooterSection = async () => {
    try {
      await fetch('/api/cms/sustainability/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: footerTitle,
          subtitle: footerSubtitle,
          ctaText: footerCtaText,
          ctaIcon: footerCtaIcon,
          backgroundImageUrl: footerBgImage,
          isActive: footerIsActive
        })
      });
      await fetchSustainability();
    } catch {}
  };

  // Save Social Section
  const saveSocialSection = async () => {
    try {
      await fetch('/api/cms/sustainability/social', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: socialTitle,
          sectionDescription: socialDescription,
          isActive: socialIsActive,
          csrCards: csrCards,
          csrImpactTitle: csrImpactTitle,
          csrImpactDescription: csrImpactDescription,
          csrImpactItems: csrImpactItems
        })
      });
      await fetchSustainability();
    } catch {}
  };

  // CSR Cards management
  const addCsrCard = () => {
    const newCard = {
      id: `csr-${Date.now()}`,
      cardTitle: 'New CSR Card',
      cardSubtitle: '',
      cardDescription: '',
      highlightText: '',
      icon: 'ri-star-line',
      gradientColors: '#2879b6,#3a8bc4',
      isActive: true,
      order: csrCards.length + 1
    };
    setCsrCards([...csrCards, newCard]);
  };

  const updateCsrCard = (id: string, field: string, value: any) => {
    setCsrCards(csrCards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const deleteCsrCard = (id: string) => {
    setCsrCards(csrCards.filter(card => card.id !== id));
  };

  // CSR Impact Items management
  const addCsrImpactItem = () => {
    const newItem = {
      id: `csri-${Date.now()}`,
      title: 'New Impact Item',
      description: '',
      icon: 'ri-star-line',
      gradientColors: '#2879b6,#3a8bc4',
      isActive: true,
      order: csrImpactItems.length + 1
    };
    setCsrImpactItems([...csrImpactItems, newItem]);
  };

  const updateCsrImpactItem = (id: string, field: string, value: any) => {
    setCsrImpactItems(csrImpactItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const deleteCsrImpactItem = (id: string) => {
    setCsrImpactItems(csrImpactItems.filter(item => item.id !== id));
  };

  const saveSustainabilityHero = () => {
    (updateData as any)('sustainability', {
      ...sustainability,
      hero: {
        ...(sustainability.hero || {}),
        title: sustHeroTitle,
        description: sustHeroDescription,
        backgroundImage: sustHeroBg,
        isActive: true
      }
    });
  };

  const sdgCardsSorted: any[] = (sustainability.sdgCards || []).slice().sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  const addSdgCard = () => {
    openSdgModal('add');
  };
  const updateSdgField = (id: string, field: 'number'|'title'|'contribution'|'icon'|'color'|'order'|'isActive', value: any) => {
    const updated = (sustainability.sdgCards || []).map((c: any) => c.id === id ? { ...c, [field]: (field === 'number' || field === 'order') ? Number(value) || 0 : value } : c);
    (updateData as any)('sustainability', { ...sustainability, sdgCards: updated });
  };
  const deleteSdgCard = (id: string) => {
    const updated = (sustainability.sdgCards || []).filter((c: any) => c.id !== id);
    (updateData as any)('sustainability', { ...sustainability, sdgCards: updated });
  };

  // SDG Modal (add/edit)
  const [sdgModalOpen, setSdgModalOpen] = useState(false);
  const [sdgModalMode, setSdgModalMode] = useState<'add'|'edit'>('add');
  const [sdgEditingId, setSdgEditingId] = useState<string|undefined>(undefined);
  const [sdgForm, setSdgForm] = useState<any>({ number: 3, title: '', contribution: '', icon: 'ri-heart-pulse-line', color: '#2879b6', order: (sustainability.sdgCards?.length||0)+1, isActive: true });
  const openSdgModal = (mode: 'add'|'edit', card?: any) => {
    setSdgModalMode(mode);
    if (mode === 'edit' && card) {
      setSdgEditingId(card.id);
      setSdgForm({ number: card.number, title: card.title, contribution: card.contribution, icon: card.icon, color: card.color, order: card.order, isActive: !!card.isActive });
    } else {
      setSdgEditingId(undefined);
      setSdgForm({ number: 3, title: 'New SDG', contribution: '', icon: 'ri-heart-pulse-line', color: '#2879b6', order: (sustainability.sdgCards?.length||0)+1, isActive: true });
    }
    setSdgModalOpen(true);
  };
  const closeSdgModal = () => setSdgModalOpen(false);
  const saveSdgModal = () => {
    if (sdgModalMode === 'add') {
      const newCard = { id: `sdg-${Date.now()}`, ...sdgForm, number: Number(sdgForm.number)||0, order: Number(sdgForm.order)||0 };
      (updateData as any)('sustainability', { ...sustainability, sdgCards: [ ...(sustainability.sdgCards || []), newCard ] });
    } else if (sdgModalMode === 'edit' && sdgEditingId) {
      const updated = (sustainability.sdgCards || []).map((c: any) => c.id === sdgEditingId ? { ...c, ...sdgForm, number: Number(sdgForm.number)||0, order: Number(sdgForm.order)||0 } : c);
      (updateData as any)('sustainability', { ...sustainability, sdgCards: updated });
    }
    setSdgModalOpen(false);
  };

  const addPolicy = () => {
    const nextOrder = (sustainability.policies?.length || 0) + 1;
    const newPolicy = { id: `pol-${Date.now()}`, title: 'New Policy', description: '', icon: 'ri-shield-check-line', color: '#2879b6', isActive: true, order: nextOrder };
    (updateData as any)('sustainability', { ...sustainability, policies: [ ...(sustainability.policies || []), newPolicy ] });
  };
  const updatePolicyField = (id: string, field: 'title'|'description'|'icon'|'color'|'order'|'isActive', value: any) => {
    const updated = (sustainability.policies || []).map((p: any) => p.id === id ? { ...p, [field]: field === 'order' ? Number(value) || 0 : value } : p);
    (updateData as any)('sustainability', { ...sustainability, policies: updated });
  };
  const deletePolicy = (id: string) => {
    const updated = (sustainability.policies || []).filter((p: any) => p.id !== id);
    (updateData as any)('sustainability', { ...sustainability, policies: updated });
  };

  // Vision & Mission (sustainability) - using API data
  const vm = sustainabilityApi?.visionMission || { visionDescription: '', missionPoints: [] };
  const [vmVisionDesc, setVmVisionDesc] = useState<string>(vm.visionDescription || '');
  
  // Local state for vision mission editing
  const [visionMissionLocal, setVisionMissionLocal] = useState<any>(null);
  
  const missionPointsSorted: any[] = (visionMissionLocal?.missionPoints || vm.missionPoints || []).slice().sort((a: any, b: any) => (a.order||0) - (b.order||0));
  const saveVisionDesc = () => {
    // This is just for local state management, the real save happens with saveVisionMission
    setVmVisionDesc(vmVisionDesc);
  };

  // Initialize local state when API data loads
  useEffect(() => {
    if (sustainabilityApi?.visionMission) {
      setVisionMissionLocal(sustainabilityApi.visionMission);
      setVmVisionDesc(sustainabilityApi.visionMission.visionDescription || '');
    }
  }, [sustainabilityApi?.visionMission]);

  // Update vision description in local state when it changes
  useEffect(() => {
    if (visionMissionLocal) {
      setVisionMissionLocal({ ...visionMissionLocal, visionDescription: vmVisionDesc });
    }
  }, [vmVisionDesc]);

  // Function to sync all form data with local state
  const syncFormData = () => {
    if (visionMissionLocal) {
      const syncedData = {
        ...visionMissionLocal,
        visionDescription: vmVisionDesc,
      };
      setVisionMissionLocal(syncedData);
      return syncedData;
    }
    return visionMissionLocal;
  };

  const saveVisionMission = async () => {
    try {
      // Sync all form data before saving
      const syncedData = syncFormData();
      
      // Ensure all required fields are present with current values
      const updatedLocalState = {
        ...syncedData,
        visionDescription: vmVisionDesc, // Always use the current textarea value
        sectionTitle: syncedData?.sectionTitle || '',
        sectionSubtitle: syncedData?.sectionSubtitle || '',
        visionTitle: syncedData?.visionTitle || '',
        visionSubtitle: syncedData?.visionSubtitle || '',
        missionTitle: syncedData?.missionTitle || '',
        missionSubtitle: syncedData?.missionSubtitle || '',
        visionPoints: syncedData?.visionPoints || [],
        missionPoints: syncedData?.missionPoints || [],
        stats: syncedData?.stats || [],
        isActive: syncedData?.isActive !== false
      };
      
      console.log('Saving vision mission data:', updatedLocalState); // Debug log
      console.log('Current vision description:', vmVisionDesc); // Debug log
      console.log('Synced data:', syncedData); // Debug log
      
      const response = await fetch('/api/cms/sustainability/vision-mission', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLocalState),
      });
      
      if (response.ok) {
        alert('Vision & Mission saved successfully!');
        
        // Refresh the API data
        await fetchSustainability();
        
        // Force update the local state with the saved data
        const savedData = await response.json();
        if (savedData.data) {
          setVisionMissionLocal(savedData.data);
          setVmVisionDesc(savedData.data.visionDescription || '');
        }
        
        // Also refresh the website by opening it in a new tab to verify changes
        const websiteUrl = window.location.origin.replace('9000', '9000') + '/sustainability';
        console.log('Changes saved! Check the website at:', websiteUrl);
        console.log('Updated local state:', savedData.data);
      } else {
        const errorData = await response.text();
        console.error('Save failed:', errorData);
        alert('Failed to save Vision & Mission');
      }
    } catch (error) {
      console.error('Error saving Vision & Mission:', error);
      alert('Error saving Vision & Mission');
    }
  };
  const [mpModalOpen, setMpModalOpen] = useState(false);
  const [mpMode, setMpMode] = useState<'add'|'edit'>('add');
  const [mpEditingId, setMpEditingId] = useState<string|undefined>();
  const [mpForm, setMpForm] = useState<any>({ text: '', order: (missionPointsSorted.length||0)+1, isActive: true });

  // Vision Points Modal State
  const [vpModalOpen, setVpModalOpen] = useState(false);
  const [vpMode, setVpMode] = useState<'add'|'edit'>('add');
  const [vpEditingId, setVpEditingId] = useState<string|undefined>();
  const [vpForm, setVpForm] = useState<any>({ 
    icon: 'ri-check-line', 
    text: '', 
    color: '#2879b6', 
    order: ((visionMissionLocal?.visionPoints || []).length||0)+1, 
    isActive: true 
  });
  const openMpModal = (mode: 'add'|'edit', point?: any) => {
    setMpMode(mode);
    if (mode === 'edit' && point) {
      setMpEditingId(point.id);
      setMpForm({ text: point.text, order: point.order, isActive: !!point.isActive });
    } else {
      setMpEditingId(undefined);
      setMpForm({ text: '', order: (missionPointsSorted.length||0)+1, isActive: true });
    }
    setMpModalOpen(true);
  };
  const closeMpModal = () => setMpModalOpen(false);
  const saveMpModal = () => {
    const existing = missionPointsSorted;
    if (mpMode === 'add') {
      const newPoint = { id: `mp-${Date.now()}`, text: mpForm.text, order: Number(mpForm.order)||0, isActive: !!mpForm.isActive };
      const updated = [...existing, newPoint];
      setVisionMissionLocal({ ...visionMissionLocal, missionPoints: updated });
    } else if (mpMode === 'edit' && mpEditingId) {
      const updated = existing.map((p: any) => p.id === mpEditingId ? { ...p, text: mpForm.text, order: Number(mpForm.order)||0, isActive: !!mpForm.isActive } : p);
      setVisionMissionLocal({ ...visionMissionLocal, missionPoints: updated });
    }
    setMpModalOpen(false);
  };

  // Vision Points Modal Functions
  const openVpModal = (mode: 'add'|'edit', point?: any) => {
    setVpMode(mode);
    if (mode === 'edit' && point) {
      setVpEditingId(point.id);
      setVpForm({ 
        icon: point.icon, 
        text: point.text, 
        color: point.color, 
        order: point.order, 
        isActive: !!point.isActive 
      });
    } else {
      setVpEditingId(undefined);
      setVpForm({ 
        icon: 'ri-check-line', 
        text: '', 
        color: '#2879b6', 
        order: ((visionMissionLocal?.visionPoints || []).length||0)+1, 
        isActive: true 
      });
    }
    setVpModalOpen(true);
  };
  const closeVpModal = () => setVpModalOpen(false);
  const saveVpModal = () => {
    const existing = (visionMissionLocal?.visionPoints || []);
    if (vpMode === 'add') {
      const newPoint = { 
        id: `vp-${Date.now()}`, 
        icon: vpForm.icon, 
        text: vpForm.text, 
        color: vpForm.color, 
        order: Number(vpForm.order)||0, 
        isActive: !!vpForm.isActive 
      };
      const updated = [...existing, newPoint];
      setVisionMissionLocal({ ...visionMissionLocal, visionPoints: updated });
    } else if (vpMode === 'edit' && vpEditingId) {
      const updated = existing.map((p: any) => p.id === vpEditingId ? { 
        ...p, 
        icon: vpForm.icon, 
        text: vpForm.text, 
        color: vpForm.color, 
        order: Number(vpForm.order)||0, 
        isActive: !!vpForm.isActive 
      } : p);
      setVisionMissionLocal({ ...visionMissionLocal, visionPoints: updated });
    }
    setVpModalOpen(false);
  };
  const deleteMissionPoint = (id: string) => {
    const updated = missionPointsSorted.filter((p: any) => p.id !== id);
    setVisionMissionLocal({ ...visionMissionLocal, missionPoints: updated });
  };

  const deleteVisionPoint = (id: string) => {
    const updated = (visionMissionLocal?.visionPoints || []).filter((p: any) => p.id !== id);
    setVisionMissionLocal({ ...visionMissionLocal, visionPoints: updated });
  };

  const deleteStat = (id: string) => {
    const updated = (visionMissionLocal?.stats || []).filter((s: any) => s.id !== id);
    setVisionMissionLocal({ ...visionMissionLocal, stats: updated });
  };

  // Map brand color keys to hex (fallback to given value if already hex)
  const getColorValue = (color: string) => {
    const colorMap = {
      'refex-blue': '#2879b6',
      'refex-green': '#7dc244',
      'refex-orange': '#ee6a31'
    } as const;
    return (colorMap as any)[color] || color || '#2879b6';
  };

  const handleLogout = () => {
    logout();
  };

  const handleAdd = () => {
    setModalType('add');
    setEditingItem(null);
    setFormData({
      achievements: [] // Initialize achievements as empty array
    });
    setShowModal(true);
  };

  const handleEdit = (item: any) => {
    setModalType('edit');
    setEditingItem(item);
    // Ensure achievements is always an array
    const formData = {
      ...item,
      achievements: Array.isArray(item.achievements) ? item.achievements : (item.achievements ? [item.achievements] : [])
    };
    setFormData(formData);
    setShowModal(true);
  };

  const handleDelete = (item: any) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      let sectionKey: keyof AdminData;
      
      if (activeTab === 'home-page') {
        const sectionMap: { [key: string]: keyof AdminData } = {
          'hero-slides': 'heroSlides',
          'offerings': 'offerings',
          'statistics': 'statistics',
          'regulatory': 'regulatoryApprovals'
        };
        sectionKey = sectionMap[activeHomeSection] as keyof AdminData;
        if (sectionKey === 'heroSlides' && item?.id) {
          (async () => {
            try {
              await fetch(`/api/cms/home/slides/${item.id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...authHeaders() as any } });
              await fetchHeroSlides();
            } catch {}
          })();
          return;
        }
        if (sectionKey === 'statistics' && item?.id) {
          (async () => {
            try {
              await fetch(`/api/cms/home/statistics/${item.id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...authHeaders() as any } });
              await fetchStatistics();
            } catch {}
          })();
          return;
        }
        if (sectionKey === 'offerings' && item?.id) {
          (async () => {
            try {
              await fetch(`/api/cms/home/offerings/${item.id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...authHeaders() as any } });
              await fetchOfferings();
            } catch {}
          })();
          return;
        }
        if (sectionKey === 'regulatoryApprovals' && item?.id) {
          (async () => {
            try {
              await fetch(`/api/cms/home/regulatory/${item.id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...authHeaders() as any } });
              await fetchRegulatory();
            } catch {}
          })();
          return;
        }
      } else if (activeTab === 'about-page') {
        const sectionMap: { [key: string]: keyof AdminData } = {
          'about-hero': 'aboutHero',
          'about-journey-image': 'aboutJourneyImage',
          'vision-mission': 'visionMission',
          'about-sections': 'aboutSections',
          'advisory-board': 'leadership',
          'technical-leadership': 'leadership',
          'management-team': 'leadership',
          'values': 'values',
          'journey': 'journey'
        };
        sectionKey = sectionMap[activeAboutSection] as keyof AdminData;
        if (sectionKey === 'aboutHero' || sectionKey === 'visionMission' || sectionKey === 'aboutJourneyImage') {
          // single object; nothing to delete
          return;
        }
        
        // Handle leadership delete via API
        if (sectionKey === 'leadership' && item?.id) {
          (async () => {
            try {
              console.log('🗑️ Deleting leadership member:', item.id);
              const response = await fetch(`/api/cms/about/leadership/${item.id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any }
              });
              
              if (response.ok) {
                console.log('✅ Leadership member deleted successfully');
                await fetchAboutData();
                // Notify website to refresh
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('aboutDataChanged'));
                }
                alert('Leadership member deleted successfully!');
              } else {
                console.error('❌ Leadership delete failed:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
                alert('Failed to delete leadership member. Please try again.');
              }
            } catch (error) {
              console.error('❌ Leadership delete error:', error);
              alert(`Error deleting leadership member: ${error}`);
            }
          })();
          return;
        }
    } else if (activeTab === 'capabilities') {
      // Facilities delete via API
      if (activeCapabilitiesSection === 'cap-facilities' && item?.id) {
        (async () => {
          try {
            await fetch('https://refexlifesciences.com/api/cms/capabilities/facilities/' + item.id, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json', ...authHeaders() as any }
            });
            await fetchCapabilities();
          } catch {}
        })();
        return;
      }
      return;
      } else {
        return;
      }
      
      deleteItem(sectionKey, item.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let sectionKey: keyof AdminData = 'capabilitiesFacilities'; // Default fallback
    
    if (activeTab === 'home-page') {
      const sectionMap: { [key: string]: keyof AdminData } = {
        'hero-slides': 'heroSlides',
        'offerings': 'offerings',
        'statistics': 'statistics',
        'regulatory': 'regulatoryApprovals'
      };
      sectionKey = sectionMap[activeHomeSection] as keyof AdminData;
      if (sectionKey === 'heroSlides') {
        // Create or update via API
        (async () => {
          try {
            if (modalType === 'add') {
              await fetch('/api/cms/home/slides', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify({
                  title: formData.title || '',
                  image: formData.image || '',
                  order: Number(formData.order)||0,
                  isActive: !!formData.isActive
                })
              });
            } else if ((editingItem as any)?.id) {
              await fetch(`/api/cms/home/slides/${(editingItem as any).id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify({
                  title: formData.title || '',
                  image: formData.image || '',
                  order: Number(formData.order)||0,
                  isActive: !!formData.isActive
                })
              });
            }
            await fetchHeroSlides();
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('heroSlidesChanged'));
            }
          } catch {}
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
      if (sectionKey === 'statistics') {
        // Statistics create/update via API
        (async () => {
          try {
            const payload = {
              title: formData.title || '',
              value: formData.value || '',
              description: formData.description || '',
              image: formData.image || '',
              color: formData.color || '#2879b6',
              order: Number(formData.order)||0,
              isActive: !!formData.isActive,
            };
            if (modalType === 'add') {
              await fetch('/api/cms/home/statistics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            } else if ((editingItem as any)?.id) {
              await fetch(`/api/cms/home/statistics/${(editingItem as any).id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            }
            await fetchStatistics();
          } catch {}
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
      if (sectionKey === 'offerings') {
        // Offerings create/update via API
        (async () => {
          try {
            const payload = {
              title: formData.title || '',
              description: formData.description || '',
              icon: formData.icon || 'ri-star-line',
              color: formData.color || 'refex-blue',
              metric: formData.metric || '',
              unit: formData.unit || '',
              order: Number(formData.order)||0,
              isActive: !!formData.isActive,
            };
            if (modalType === 'add') {
              await fetch('/api/cms/home/offerings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            } else if ((editingItem as any)?.id) {
              await fetch(`/api/cms/home/offerings/${(editingItem as any).id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            }
            await fetchOfferings();
          } catch {}
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
      if (sectionKey === 'regulatoryApprovals') {
        // Regulatory Approvals create/update via API
        (async () => {
          try {
            const payload = {
              title: formData.title || '',
              description: formData.description || '',
              image: formData.image || '',
              link: formData.link || '',
              color: formData.color || '#2879b6',
              order: Number(formData.order)||0,
              isActive: !!formData.isActive,
            };
            if (modalType === 'add') {
              await fetch('/api/cms/home/regulatory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            } else if ((editingItem as any)?.id) {
              await fetch(`/api/cms/home/regulatory/${(editingItem as any).id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            }
            await fetchRegulatory();
          } catch {}
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
    } else if (activeTab === 'about-page') {
      const sectionMap: { [key: string]: keyof AdminData } = {
        'about-hero': 'aboutHero',
        'about-journey-image': 'aboutJourneyImage',
        'vision-mission': 'visionMission',
        'about-sections': 'aboutSections',
        'advisory-board': 'leadership',
        'technical-leadership': 'leadership',
        'management-team': 'leadership',
        'values': 'values',
        'journey': 'journey'
      };
      sectionKey = sectionMap[activeAboutSection] as keyof AdminData;
      if (sectionKey === 'aboutJourneyImage') {
        (async () => {
          try {
            // Check if we have new images to upload
            const hasNewImages = formData.images && formData.images.some((img: any) => img.isNew && img.file);
            
            let response;
            if (hasNewImages) {
              // Use FormData for file uploads
              const formDataToSend = new FormData();
              formDataToSend.append('title', formData.title || 'Our Journey');
              formDataToSend.append('summary', formData.summary || '');
              formDataToSend.append('image', formData.image || '');
              formDataToSend.append('isActive', String(formData.isActive ?? true));
              
              // Add existing images (non-new images)
              const existingImages = formData.images.filter((img: any) => !img.isNew).map((img: any) => img.url);
              formDataToSend.append('images', JSON.stringify(existingImages));
              
              // Add new image files
              const newImageFiles = formData.images.filter((img: any) => img.isNew && img.file);
              for (const imageItem of newImageFiles) {
                formDataToSend.append('images', imageItem.file);
              }
              
              response = await fetch('/api/cms/about/journey/upload', {
                method: 'PUT',
                headers: { ...authHeaders() as any },
                body: formDataToSend
              });
            } else {
              // Use regular JSON for non-file updates
              const imageUrls = formData.images ? formData.images.map((img: any) => img.url || img) : [];
              response = await fetch('/api/cms/about/journey', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify({
                  title: formData.title || 'Our Journey',
                  summary: formData.summary || '',
                  image: formData.image || '',
                  images: imageUrls,
                  isActive: formData.isActive ?? true
                })
              });
            }
            if (response.ok) {
              // Refresh the API data to update preview
              await fetchAboutData();
              alert('About Journey saved successfully!');
            } else {
              alert('Failed to save About Journey');
            }
          } catch (error) {
            console.error('Error saving About Journey:', error);
            alert('Error saving About Journey');
          }
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
      if (sectionKey === 'aboutHero') {
        (async () => {
          try {
            const response = await fetch('/api/cms/about/hero', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
              body: JSON.stringify({
                title: formData.title || '',
                subtitle: formData.subtitle || '',
                description: formData.description || '',
                backgroundImage: formData.backgroundImage || '',
                logoCards: formData.logoCards || [],
                isActive: formData.isActive ?? true
              })
            });
            if (response.ok) {
              // Refresh the API data to update preview
              await fetchAboutData();
              alert('About Hero saved successfully!');
            } else {
              alert('Failed to save About Hero');
            }
          } catch (error) {
            console.error('Error saving About Hero:', error);
            alert('Error saving About Hero');
          }
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
    } else if (activeTab === 'capabilities') {
      // Facilities create/update via API
      if (activeCapabilitiesSection === 'cap-facilities') {
       
        (async () => {
          
          try {
            const payload = {
              name: formData.name || '',
              type: formData.type || '',
              location: formData.location || null,
              capacity: formData.capacity || null,
              established: formData.established || null,
              image: formData.image || null,
              capabilities: Array.isArray(formData.capabilities) ? formData.capabilities : (formData.capabilities || []),
              approvals: Array.isArray(formData.approvals) ? formData.approvals : (formData.approvals || []),
              color: formData.color || null,
              order: Number(formData.order) || 0,
              isActive: formData.isActive !== undefined ? !!formData.isActive : true,
            };
            if (modalType === 'add') {
              await fetch('/api/cms/capabilities/facilities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            } else if ((editingItem as any)?.id) {
              await fetch(`https://refexlifesciences.com/api/cms/capabilities/facilities/${(editingItem as any).id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            }
            await fetchCapabilities();
          } catch {}
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
      if (editingItem === 'capabilities-hero') {
        // Save via API
        (async () => {
          try {
            await fetch('/api/cms/capabilities/hero', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
              body: JSON.stringify({
                title: formData.title || '',
                subtitle: formData.subtitle || '',
                description: formData.description || '',
                subDescription: formData.subDescription || '',
                backgroundImage: formData.backgroundImage || '',
                isActive: formData.isActive ?? true
              })
            });
            await fetchCapabilities();
          } catch {}
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
      if (editingItem === 'capabilities-research') {
        // Save via API
        (async () => {
          try {
            await fetch('/api/cms/capabilities/research', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
              body: JSON.stringify({
                title: formData.title || '',
                description: formData.description || '',
                image: formData.image || '',
                apiCard: formData.apiCard || null,
                fdfCard: formData.fdfCard || null,
                promise: formData.promise || null,
                isActive: formData.isActive ?? true
              })
            });
            await fetchCapabilities();
          } catch {}
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }

    } else if (activeTab === 'contact-page') {
      if (editingItem === 'contact-hero') {
        // Update all hero fields
        const next = {
          ...(data as any).contactHero,
          title: formData.title || '',
          subtitle: formData.subtitle || '',
          description: formData.description || '',
          backgroundImage: formData.backgroundImage || '',
          isActive: formData.isActive ?? true
        };
        updateData('contactHero' as any, next);
        setEditingItem(null);
        setFormData({});
        return;
      }
      if (editingItem === 'contact-get-in-touch') {
        // Update all get in touch fields
        const next = {
          ...(data as any).contactGetInTouch,
          title: formData.title || '',
          description: formData.description || '',
          location: {
            title: formData.locationTitle || '',
            address: formData.locationAddress || '',
            icon: formData.locationIcon || '',
            color: formData.locationColor || ''
          },
          phone: {
            title: formData.phoneTitle || '',
            number: formData.phoneNumber || '',
            hours: formData.phoneHours || '',
            icon: formData.phoneIcon || '',
            color: formData.phoneColor || ''
          },
          email: {
            title: formData.emailTitle || '',
            address: formData.emailAddress || '',
            responseTime: formData.emailResponseTime || '',
            icon: formData.emailIcon || '',
            color: formData.emailColor || ''
          },
          businessHours: {
            title: formData.businessHoursTitle || '',
            mondayFriday: formData.businessHoursMondayFriday || '',
            saturday: formData.businessHoursSaturday || '',
            sunday: formData.businessHoursSunday || ''
          },
          isActive: formData.isActive ?? true
        };
        updateData('contactGetInTouch' as any, next);
        setEditingItem(null);
        setFormData({});
        return;
      }
      if (editingItem === 'contact-user') {
        if (modalType === 'add') {
          const newUser = {
            id: Date.now().toString(),
            name: formData.name || '',
            email: formData.email || '',
            phone: formData.phone || '',
            department: formData.department || '',
            position: formData.position || '',
            avatar: formData.avatar || '',
            isActive: formData.isActive ?? true,
            order: formData.order || 0
          };
          const updatedUsers = [...((data as any).contactUsers || []), newUser];
          updateData('contactUsers' as any, updatedUsers);
        } else {
          const updatedUsers = ((data as any).contactUsers || []).map((user: any) =>
            user.id === formData.id
              ? {
                  ...user,
                  name: formData.name || '',
                  email: formData.email || '',
                  phone: formData.phone || '',
                  department: formData.department || '',
                  position: formData.position || '',
                  avatar: formData.avatar || '',
                  isActive: formData.isActive ?? true,
                  order: formData.order || 0
                }
              : user
          );
          updateData('contactUsers' as any, updatedUsers);
        }
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
      if (editingItem === 'home-global-impact') {
        // Update home global impact section
        const next = {
          ...(data as any).homeGlobalImpact,
          title: formData.title || '',
          description: formData.description || '',
          isActive: formData.isActive ?? true
        };
        updateData('homeGlobalImpact' as any, next);
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
    } else {
      return;
    }

    if (sectionKey === 'aboutHero') {
      // direct update object
      updateData('aboutHero', formData);
    } else if (sectionKey === 'aboutJourneyImage') {
      updateData('aboutJourneyImage', formData.image || '');
    } else if (sectionKey === 'visionMission') {
      const normalized = { ...formData } as any;
      if (typeof normalized.missionPointsRaw === 'string') {
        try {
          normalized.missionPoints = JSON.parse(normalized.missionPointsRaw);
        } catch {}
        delete normalized.missionPointsRaw;
      }
      // Save to API instead of local data
      saveAboutVisionMission(normalized);
    } else {
      // Normalize Advisory Board category when editing/adding through Advisory tab
      if (sectionKey === 'leadership' && activeAboutSection === 'advisory-board') {
        formData.category = 'Advisory Board';
      }
      // Normalize Technical Leadership Team category when editing/adding through Technical Leadership tab
      if (sectionKey === 'leadership' && activeAboutSection === 'technical-leadership') {
        formData.category = 'Technical Leadership Team';
      }
      // Normalize Management Team category when editing/adding through Management Team tab
      if (sectionKey === 'leadership' && activeAboutSection === 'management-team') {
        formData.category = 'Management Team';
      }
      
      // Handle leadership API calls
      if (sectionKey === 'leadership') {
        (async () => {
          try {
            const payload = {
              name: formData.name || '',
              position: formData.position || '',
              category: formData.category || '',
              description: formData.description || '',
              achievements: Array.isArray(formData.achievements) ? formData.achievements : (formData.achievements || []),
              experience: formData.experience || '',
              education: formData.education || '',
              image: formData.image || '',
              color: formData.color || 'refex-blue',
              order: Number(formData.order) || 0,
              isActive: formData.isActive !== undefined ? !!formData.isActive : true,
            };
            
            console.log('🔍 Leadership Save Payload:', payload);
            
            let response;
            if (modalType === 'add') {
              response = await fetch('/api/cms/about/leadership', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            } else if ((editingItem as any)?.id) {
              response = await fetch(`/api/cms/about/leadership/${(editingItem as any).id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...authHeaders() as any },
                body: JSON.stringify(payload)
              });
            }
            
            if (response && response.ok) {
              console.log('✅ Leadership saved successfully');
              await fetchAboutData();
              // Notify website to refresh
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('aboutDataChanged'));
              }
              alert(`${formData.category} member saved successfully!`);
            } else {
              console.error('❌ Leadership save failed:', response?.status, response?.statusText);
              const errorText = await response?.text();
              console.error('Error details:', errorText);
              alert(`Failed to save ${formData.category} member. Please try again.`);
            }
          } catch (error) {
            console.error('❌ Leadership save error:', error);
            alert(`Error saving ${formData.category} member: ${error}`);
          }
        })();
        setShowModal(false);
        setFormData({});
        setEditingItem(null);
        return;
      }
      if (sectionKey === 'capabilitiesFacilities') {
        if (typeof formData.capabilitiesRaw === 'string') {
          formData.capabilities = (formData.capabilitiesRaw as string).split('\n').map((s: string) => s.trim()).filter(Boolean);
          delete formData.capabilitiesRaw;
        }
        if (typeof formData.approvalsRaw === 'string') {
          formData.approvals = (formData.approvalsRaw as string).split('\n').map((s: string) => s.trim()).filter(Boolean);
          delete formData.approvalsRaw;
        }
      }
      if (modalType === 'add') {
        if (typeof formData.achievementsRaw === 'string') {
          formData.achievements = (formData.achievementsRaw as string).split('\n').map(s => s.trim()).filter(Boolean);
          delete formData.achievementsRaw;
        }
       
      } else {
        if (typeof formData.achievementsRaw === 'string') {
          formData.achievements = (formData.achievementsRaw as string).split('\n').map(s => s.trim()).filter(Boolean);
          delete formData.achievementsRaw;
        }
        
      }
    }
    
    setShowModal(false);
    setFormData({});
    setEditingItem(null);
    setImagePreview(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('image', file);

        // Upload image to server
        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          const imageUrl = `${result.imageUrl}`;
          
          // Set preview and form data
          setImagePreview(imageUrl);
          setFormData((prev: any) => ({
            ...prev,
            image: imageUrl
          }));
          
          alert('Image uploaded successfully!');
        } else {
          const error = await response.json();
          alert(`Upload failed: ${error.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image. Please try again.');
      }
    }
  };

  const StatCard = ({ title, value, icon, color, change }: any) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <i className="ri-arrow-up-line mr-1"></i>
              {change}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <i className={`${icon} text-xl`} style={{ color }}></i>
        </div>
      </div>
    </div>
  );

  const DataTable = ({ title, data, columns }: any) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col: any, index: number) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item: any, index: number) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map((col: any, colIndex: number) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {col.render ? col.render(item[col.key]) : item[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <i className="ri-shield-user-line text-white"></i>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <i className="ri-logout-box-line mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'home-page', label: 'Home Page', icon: 'ri-home-line' },
              { id: 'about-page', label: 'About Page', icon: 'ri-information-line' },
              { id: 'capabilities', label: 'Capabilities', icon: 'ri-cpu-line' },
              { id: 'contact-page', label: 'Contact Page', icon: 'ri-phone-line' },
              { id: 'products', label: 'Products', icon: 'ri-medicine-bottle-line' },
              { id: 'sustainability', label: 'Sustainability', icon: 'ri-leaf-line' },
              { id: 'settings', label: 'Settings', icon: 'ri-settings-line' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab removed */}

        {/* Home Page Tab - Unified Management */}
        {activeTab === 'home-page' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Home Page Management</h2>
            </div>

            {/* Home Page Sections Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex space-x-4 overflow-x-auto">
                {[
                  { id: 'hero-slides', label: 'Hero Slides', icon: 'ri-image-line', count: data.heroSlides.length },
                  { id: 'offerings', label: 'What We Offer', icon: 'ri-star-line', count: data.offerings.length },
                  { id: 'statistics', label: 'Global Impact', icon: 'ri-global-line', count: data.statistics.length },
                  { id: 'regulatory', label: 'Regulatory', icon: 'ri-shield-check-line', count: data.regulatoryApprovals.length }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveHomeSection(section.id)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeHomeSection === section.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <i className={`${section.icon} mr-2`}></i>
                    <span className="font-medium">{section.label}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      activeHomeSection === section.id
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {section.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Slides Section */}
            {activeHomeSection === 'hero-slides' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Hero Slides Management</h3>
                  <button 
                    onClick={() => handleAdd()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Slide
                  </button>
                </div>
                <DataTable
                  title="Hero Slides"
                  data={(heroSlidesApi.length ? heroSlidesApi : data.heroSlides)}
                  columns={[
                    { key: 'title', header: 'Title' },
                    { 
                      key: 'image', 
                      header: 'Preview',
                      render: (value: string) => (
                        <img src={value} alt="Slide" className="w-16 h-10 object-cover rounded" />
                      )
                    },
                    { key: 'order', header: 'Order' },
                    { 
                      key: 'isActive', 
                      header: 'Status',
                      render: (value: boolean) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {value ? 'Active' : 'Inactive'}
                        </span>
                      )
                    }
                  ]}
                />
              </div>
            )}
       
         

            {/* Offerings Section */}
            {activeHomeSection === 'offerings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">What We Offer Management</h3>
                  <button 
                    onClick={() => handleAdd()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Offering
                  </button>
                </div>
                <DataTable
                  title="Offerings"
                  data={offeringsApi.length ? offeringsApi : data.offerings}
                  columns={[
                    { key: 'title', header: 'Title' },
                    { key: 'description', header: 'Description' },
                    { key: 'metric', header: 'Metric' },
                    { key: 'unit', header: 'Unit' },
                    { 
                      key: 'color', 
                      header: 'Color',
                      render: (value: string) => (
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: getColorValue(value) }}></div>
                          <span className="text-xs">{value}</span>
                        </div>
                      )
                    },
                    { key: 'order', header: 'Order' },
                    { 
                      key: 'isActive', 
                      header: 'Status',
                      render: (value: boolean) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {value ? 'Active' : 'Inactive'}
                        </span>
                      )
                    }
                  ]}
                />
              </div>
            )}

            {/* Statistics Section */}
            {activeHomeSection === 'statistics' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Global Impact & Excellence</h3>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setModalType('edit');
                        setEditingItem('home-global-impact');
                        const globalImpactData = (data as any).homeGlobalImpact || {};
                        const formDataToSet = {
                          title: globalImpactData.title || '',
                          description: globalImpactData.description || '',
                          isActive: globalImpactData.isActive ?? true
                        };
                        setFormData(formDataToSet);
                        setShowModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <i className="ri-edit-line mr-2"></i>
                      Edit Section
                    </button>
                    <button 
                      onClick={() => {
                        setModalType('add');
                        setEditingItem('statistics');
                        setFormData({
                          title: '',
                          value: '',
                          description: '',
                          image: '',
                          color: 'refex-blue',
                          order: (data.statistics || []).length + 1,
                          isActive: true
                        });
                        setShowModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Statistic
                    </button>
                  </div>
                </div>

                {/* Global Impact Preview */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Preview</h4>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-center mb-8">
                      <h4 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 font-montserrat">
                        {(data as any).homeGlobalImpact?.title || 'Global Impact & Excellence'}
                      </h4>
                      <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed font-montserrat">
                        {(data as any).homeGlobalImpact?.description || 'Trusted by healthcare professionals worldwide with proven expertise and unwavering commitment to quality'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {(() => {
                        const finalStats = (statisticsApi.length > 0 ? statisticsApi : data.statistics) || [];
                        const filteredStats = finalStats.filter((stat: any) => stat.isActive).sort((a: any, b: any) => a.order - b.order);
                        console.log('🔍 Admin Global Impact Preview:', {
                          statisticsApi: statisticsApi.length,
                          dataStatistics: data.statistics?.length || 0,
                          finalStats: finalStats.length,
                          filteredStats: filteredStats.length,
                          usingApi: statisticsApi.length > 0
                        });
                        return filteredStats;
                      })().map((stat: any, index: number) => (
                        <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 hover:rotate-1 cursor-pointer border-l-4 relative" style={{ borderColor: getColorValue(stat.color) }}>
                          {/* Card Image */}
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={stat.image || 'https://via.placeholder.com/400x200?text=Image'} 
                              alt={stat.title}
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-600/20 to-transparent"></div>
                          </div>
                          
                          {/* Card Content */}
                          <div className="p-6">
                            <div className="text-center">
                              <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300" style={{ color: getColorValue(stat.color), fontFamily: 'Montserrat, sans-serif' }}>
                                {stat.value}
                              </div>
                              <h3 className="text-base font-bold text-gray-800 mb-2 transition-colors duration-300 group-hover:text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {stat.title}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {stat.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setModalType('edit');
                                setEditingItem('statistics');
                                setFormData({
                                  id: stat.id,
                                  title: stat.title,
                                  value: stat.value,
                                  description: stat.description,
                                  image: stat.image,
                                  color: stat.color,
                                  order: stat.order,
                                  isActive: stat.isActive
                                });
                                setShowModal(true);
                              }}
                              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                              title="Edit"
                            >
                              <i className="ri-edit-line text-sm"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this statistic?')) {
                                  deleteItem('statistics', stat.id);
                                }
                              }}
                              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                              title="Delete"
                            >
                              <i className="ri-delete-bin-line text-sm"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DataTable
                  title="Statistics"
                  data={statisticsApi.length ? statisticsApi : data.statistics}
                  columns={[
                    { key: 'title', header: 'Title' },
                    { key: 'value', header: 'Value' },
                    { key: 'description', header: 'Description' },
                    { 
                      key: 'image', 
                      header: 'Preview',
                      render: (value: string) => (
                        <img src={value} alt="Stat" className="w-16 h-10 object-cover rounded" />
                      )
                    },
                    { 
                      key: 'color', 
                      header: 'Color',
                      render: (value: string) => (
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: value }}></div>
                          <span className="text-xs">{value}</span>
                        </div>
                      )
                    },
                    { key: 'order', header: 'Order' },
                    { 
                      key: 'isActive', 
                      header: 'Status',
                      render: (value: boolean) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {value ? 'Active' : 'Inactive'}
                        </span>
                      )
                    }
                  ]}
                />
              </div>
            )}

            {/* Regulatory Section */}
            {activeHomeSection === 'regulatory' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Regulatory Approvals</h3>
                  <button 
                    onClick={() => handleAdd()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Approval
                  </button>
                </div>
                <DataTable
                  title="Regulatory Approvals"
                  data={regulatoryApi.length ? regulatoryApi : data.regulatoryApprovals}
                  columns={[
                    { key: 'title', header: 'Title' },
                    { key: 'description', header: 'Description' },
                    { 
                      key: 'image', 
                      header: 'Logo',
                      render: (value: string) => (
                        <img src={value} alt="Logo" className="w-16 h-10 object-contain rounded" />
                      )
                    },
                    {
                      key: 'link',
                      header: 'Link',
                      render: (value: string) => (
                        value ? <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open</a> : <span className="text-gray-400">—</span>
                      )
                    },
                    { 
                      key: 'color', 
                      header: 'Color',
                      render: (value: string) => (
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: value }}></div>
                          <span className="text-xs">{value}</span>
                        </div>
                      )
                    },
                    { key: 'order', header: 'Order' },
                    { 
                      key: 'isActive', 
                      header: 'Status',
                      render: (value: boolean) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {value ? 'Active' : 'Inactive'}
                        </span>
                      )
                    }
                  ]}
                />
              </div>
            )}

          </div>
        )}

        {/* About Page Tab */}
        {activeTab === 'about-page' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">About Page Management</h2>
            </div>

            {/* About Page Sections Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex space-x-4 overflow-x-auto">
                {[ 
                  { id: 'about-hero', label: 'About Hero', icon: 'ri-layout-top-line', count: 1 },
                  { id: 'about-journey-image', label: 'Journey Carousel', icon: 'ri-image-line', count: 1 },
                  { id: 'vision-mission', label: 'Vision & Mission', icon: 'ri-eye-line', count: 1 },
                
                  { id: 'advisory-board', label: 'Advisory Board', icon: 'ri-team-line', count: ((aboutApi as any)?.leadership || data.leadership || []).filter((m: any) => (m.category || '').toLowerCase() === 'advisory board').length },
                  { id: 'technical-leadership', label: 'Technical Leadership Team', icon: 'ri-flask-line', count: (aboutApi?.leadership || []).filter((m: any) => (m.category || '').toLowerCase() === 'technical leadership team').length },
                  { id: 'management-team', label: 'Management Team', icon: 'ri-user-star-line', count: ((aboutApi as any)?.leadership || data.leadership || []).filter((m: any) => (m.category || '').toLowerCase() === 'management team').length },
                
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveAboutSection(section.id)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeAboutSection === section.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <i className={`${section.icon} mr-2`}></i>
                    <span className="font-medium">{section.label}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      activeAboutSection === section.id
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {section.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* About Journey Content */}
            {activeAboutSection === 'about-journey-image' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">About Journey</h3>
                  <button
                    onClick={() => {
                      setModalType('edit');
                      setEditingItem('about-journey-image');
                      const aj = aboutApi.aboutJourney || {};
                      setFormData({
                        title: aj.title || 'Our Journey',
                        summary: aj.summary || 'From pioneering refrigerants to transforming healthcare – a roadmap of innovation, growth, and strategic evolution with emphasis on pharmaceutical excellence.',
                        image: aj.image || '',
                        images: aj.images ? aj.images.map((img: string) => ({ url: img, isNew: false })) : [],
                        isActive: aj.isActive ?? true
                      });
                      setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-edit-line mr-2"></i>
                    Edit Journey
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Title</p>
                      <p className="text-gray-900 font-semibold">{aboutApi.aboutJourney?.title || 'Our Journey'}</p>
                      <p className="text-sm text-gray-500 mt-4 mb-1">Summary</p>
                      <p className="text-gray-900">{aboutApi.aboutJourney?.summary || 'From pioneering refrigerants to transforming healthcare – a roadmap of innovation, growth, and strategic evolution with emphasis on pharmaceutical excellence.'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Journey Images</p>
                      <div className="w-full h-56 bg-gray-50 rounded-lg overflow-hidden">
                        <ImageCarousel
                          images={
                            aboutApi.aboutJourney?.images && aboutApi.aboutJourney?.images.length > 0
                              ? aboutApi.aboutJourney?.images
                              : aboutApi.aboutJourney?.image
                                ? [aboutApi.aboutJourney?.image]
                                : []
                          }
                          alt="Journey Preview"
                          className="w-full h-full"
                          autoPlay={true}
                          autoPlayInterval={4000}
                          showDots={true}
                          showArrows={true}
                        />
                      </div>
                      {aboutApi.aboutJourney?.images && aboutApi.aboutJourney?.images.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Carousel with {aboutApi.aboutJourney?.images.length} images
                        </p>
                      )}
                      {aboutApi.aboutJourney?.image && (!aboutApi.aboutJourney?.images || aboutApi.aboutJourney?.images.length === 0) && (
                        <p className="text-xs text-gray-500 mt-2">
                          Single image (legacy mode)
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vision & Mission Content */}
            {activeAboutSection === 'vision-mission' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Vision & Mission</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openAboutMpModal('add')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Mission Point
                    </button>
                    <button
                      onClick={() => {
                        setModalType('edit');
                        setEditingItem('vision-mission');
                        setFormData({
                          ...(aboutVisionMissionLocal || aboutApi.visionMission || {}),
                          missionPointsRaw: JSON.stringify((aboutVisionMissionLocal?.missionPoints || aboutApi.visionMission?.missionPoints || []), null, 2)
                        });
                        setShowModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <i className="ri-edit-line mr-2"></i>
                      Edit Vision & Mission
                    </button>
                    <button
                      onClick={async () => {
                        if (aboutVisionMissionLocal) {
                          const success = await saveAboutVisionMission(aboutVisionMissionLocal);
                          if (success) {
                            setAboutVisionMissionLocal(null);
                          }
                        }
                      }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <i className="ri-save-line mr-2"></i>
                      Save All Changes
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Vision Title</p>
                      <p className="text-gray-900 font-semibold">{aboutApi.visionMission?.visionTitle || 'Our Vision'}</p>
                      <p className="text-sm text-gray-500 mt-4 mb-1">Vision Description</p>
                      <p className="text-gray-900">{aboutApi.visionMission?.visionDescription || ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Vision Image</p>
                      <img src={aboutApi.visionMission?.visionImage} alt="Vision" className="w-full h-40 object-cover rounded" />
                    </div>
                  </div>
                  <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mission Title</p>
                      <p className="text-gray-900 font-semibold">{(aboutVisionMissionLocal || aboutApi.visionMission)?.missionTitle || 'Our Mission'}</p>
                      <p className="text-sm text-gray-500 mt-4 mb-1">Mission Points</p>
                      <div className="space-y-2">
                        {((aboutVisionMissionLocal || aboutApi.visionMission)?.missionPoints || [])
                          .filter((p: any) => p.isActive !== false)
                          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                          .map((p: any, idx: number) => (
                          <div key={p.id || idx} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{p.title}</div>
                              <div className="text-sm text-gray-600 mt-1">{p.description}</div>
                              <div className="text-xs text-gray-500 mt-1">Order: {p.order || 0}</div>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <button
                                onClick={() => openAboutMpModal('edit', p)}
                                className="text-blue-600 hover:text-blue-700 p-1"
                                title="Edit"
                              >
                                <i className="ri-edit-line text-sm"></i>
                              </button>
                              <button
                                onClick={() => deleteAboutMissionPoint(p.id)}
                                className="text-red-600 hover:text-red-700 p-1"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-6-line text-sm"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Mission Image</p>
                      <img src={aboutApi.visionMission?.missionImage} alt="Mission" className="w-full h-40 object-cover rounded" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Hero Content */}
            {activeAboutSection === 'about-hero' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">About Hero</h3>
                  <button
                    onClick={() => {
                      setModalType('edit');
                      setEditingItem('about-hero');
                      const ah = aboutApi.hero || {};
                      setFormData({
                        ...ah,
                        logoCards: Array.isArray((ah as any).logoCards) ? (ah as any).logoCards : []
                      });
                      setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-edit-line mr-2"></i>
                    Edit Hero
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Title</p>
                      <p className="text-gray-900 font-semibold">{aboutApi.hero?.title || 'About RLS'}</p>
                      {aboutApi.hero?.subtitle && (
                        <>
                          <p className="text-sm text-gray-500 mt-4 mb-1">Subtitle</p>
                          <p className="text-gray-900">{aboutApi.hero.subtitle}</p>
                        </>
                      )}
                      {aboutApi.hero?.description && (
                        <>
                          <p className="text-sm text-gray-500 mt-4 mb-1">Description</p>
                          <p className="text-gray-900">{aboutApi.hero.description}</p>
                        </>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Background Preview</p>
                      <img src={aboutApi.hero?.backgroundImage} alt="About Hero" className="w-full h-40 object-cover rounded" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About Sections Content */}
            {activeAboutSection === 'about-sections' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">About Sections Management</h3>
                  <button
                    onClick={() => handleAdd()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Section
                  </button>
                </div>
                <DataTable
                  title="About Sections"
                  data={data.aboutSections || []}
                  columns={[
                    { key: 'title', header: 'TITLE' },
                    { key: 'content', header: 'CONTENT' },
                    { 
                      key: 'icon', 
                      header: 'ICON',
                      render: (value: string) => <i className={`${value} text-lg`}></i>
                    }
                  ]}
                />
              </div>
            )}

            {/* Leadership Content - Removed per request */}

            {/* Advisory Board Content */}
            {activeAboutSection === 'advisory-board' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Advisory Board Management</h3>
                  <button
                    onClick={() => {
                      setModalType('add');
                      setEditingItem(null);
                      setFormData({
                        name: '',
                        position: '',
                        description: '',
                        achievements: [],
                        experience: '',
                        education: '',
                        image: '',
                        color: 'refex-blue',
                        category: 'Advisory Board',
                        isActive: true,
                        order: ((aboutApi as any)?.leadership || data.leadership || []).filter((m: any) => (m.category || '').toLowerCase() === 'advisory board').length + 1
                      });
                      setImagePreview(null);
                      setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Advisor
                  </button>
                </div>

                {/* Advisory Board Preview */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Advisory Board Preview</h4>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-wrap justify-center gap-8 items-center">
                      {((aboutApi as any)?.leadership || data.leadership || [])
                        .filter((leader: any) => (leader.category || '').toLowerCase() === 'advisory board' && leader.isActive)
                        .sort((a: any, b: any) => a.order - (b.order || 0))
                        .map((leader: any, index: number) => {
                          const getColorClasses = (color: string) => {
                            const colorMap = {
                              'refex-blue': { border: 'border-[#2879b6]', text: 'text-[#2879b6]' },
                              'refex-green': { border: 'border-[#7dc244]', text: 'text-[#7dc244]' },
                              'refex-orange': { border: 'border-[#ee6a31]', text: 'text-[#ee6a31]' }
                            };
                            return colorMap[color as keyof typeof colorMap] || colorMap['refex-blue'];
                          };
                          const colors = getColorClasses(leader.color || 'refex-blue');
                          return (
                            <div
                              key={index}
                              className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 flex flex-col items-center"
                            >
                              <div
                                className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white ${colors.border} group-hover:shadow-3xl transition-all duration-500`}
                              >
                                <img
                                  src={leader.image || 'https://via.placeholder.com/160x160?text=Advisor'}
                                  alt={leader.name}
                                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/160x160?text=Image+Not+Available';
                                  }}
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
                    
                    {(((aboutApi as any)?.leadership || data.leadership || []).filter((leader: any) => (leader.category || '').toLowerCase() === 'advisory board' && leader.isActive).length === 0) && (
                      <div className="text-center py-8">
                        <i className="ri-team-line text-4xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500 font-montserrat">No Advisory Board members added yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <DataTable
                  title="Advisory Board"
                  data={((aboutApi as any)?.leadership || data.leadership || []).filter((m: any) => (m.category || '').toLowerCase() === 'advisory board')}
                  columns={[
                    { key: 'name', header: 'NAME' },
                    { key: 'position', header: 'POSITION' },
                    {
                      key: 'image',
                      header: 'PHOTO',
                      render: (value: string) => (
                        <img src={value || 'https://via.placeholder.com/150'} alt="Advisor" className="w-12 h-12 rounded-full object-cover border" />
                      )
                    },
                    { key: 'experience', header: 'EXPERIENCE' },
                    { key: 'education', header: 'EDUCATION' },
                    {
                      key: 'isActive',
                      header: 'STATUS',
                      render: (value: boolean) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {value ? 'Active' : 'Inactive'}
                        </span>
                      )
                    },
                    {
                      key: 'actions',
                      header: 'ACTIONS',
                      render: (item: any) => (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(item.id);
                              setFormData({
                                ...item,
                                achievementsRaw: Array.isArray(item.achievements) ? item.achievements.join('\n') : ''
                              });
                              setImagePreview(null);
                              setShowModal(true);
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => deleteItem('leadership', item.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      )
                    }
                  ]}
                />
              </div>
            )}

            {/* Technical Leadership Team Content */}
            {activeAboutSection === 'technical-leadership' && (
                   <div className="space-y-6">
                   <div className="flex justify-between items-center">
                     <h3 className="text-xl font-semibold text-gray-800">Advisory Board Management</h3>
                     <button
                       onClick={() => {
                         setModalType('add');
                         setEditingItem(null);
                         setFormData({
                           name: '',
                           position: '',
                           description: '',
                           achievements: [],
                           experience: '',
                           education: '',
                           image: '',
                           color: 'refex-blue',
                           category: 'Advisory Board',
                           isActive: true,
                           order: ((aboutApi as any)?.leadership || data.leadership || []).filter((m: any) => (m.category || '').toLowerCase() === 'technical leadership team').length + 1
                         });
                         setImagePreview(null);
                         setShowModal(true);
                       }}
                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                     >
                       <i className="ri-add-line mr-2"></i>
                       Add Technical Leader
                     </button>
                   </div>
   
                   {/* Advisory Board Preview */}
                   <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                     <div className="p-6 border-b border-gray-200">
                       <h4 className="text-lg font-semibold text-gray-800 mb-4">Advisory Board Preview</h4>
                     </div>
                     
                     <div className="p-6">
                       <div className="flex flex-wrap justify-center gap-8 items-center">
                         {((aboutApi as any)?.leadership || data.leadership || [])
                           .filter((leader: any) => (leader.category || '').toLowerCase() === 'technical leadership team' && leader.isActive)
                           .sort((a: any, b: any) => a.order - (b.order || 0))
                           .map((leader: any, index: number) => {
                             const getColorClasses = (color: string) => {
                               const colorMap = {
                                 'refex-blue': { border: 'border-[#2879b6]', text: 'text-[#2879b6]' },
                                 'refex-green': { border: 'border-[#7dc244]', text: 'text-[#7dc244]' },
                                 'refex-orange': { border: 'border-[#ee6a31]', text: 'text-[#ee6a31]' }
                               };
                               return colorMap[color as keyof typeof colorMap] || colorMap['refex-blue'];
                             };
                             const colors = getColorClasses(leader.color || 'refex-blue');
                             return (
                               <div
                                 key={index}
                                 className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 flex flex-col items-center"
                               >
                                 <div
                                   className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white ${colors.border} group-hover:shadow-3xl transition-all duration-500`}
                                 >
                                   <img
                                     src={leader.image || 'https://via.placeholder.com/160x160?text=Advisor'}
                                     alt={leader.name}
                                     className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                     onError={(e) => {
                                       e.currentTarget.src = 'https://via.placeholder.com/160x160?text=Image+Not+Available';
                                     }}
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
                       
                       {(((aboutApi as any)?.leadership || data.leadership || []).filter((leader: any) => (leader.category || '').toLowerCase() === 'technical leadership team' && leader.isActive).length === 0) && (
                         <div className="text-center py-8">
                           <i className="ri-team-line text-4xl text-gray-300 mb-4"></i>
                           <p className="text-gray-500 font-montserrat">No Advisory Board members added yet</p>
                         </div>
                       )}
                     </div>
                   </div>
   
                   <DataTable
                     title="Technical Leadership Team"
                     data={((aboutApi as any)?.leadership || data.leadership || []).filter((m: any) => (m.category || '').toLowerCase() === 'technical leadership team')}
                     columns={[
                       { key: 'name', header: 'NAME' },
                       { key: 'position', header: 'POSITION' },
                       {
                         key: 'image',
                         header: 'PHOTO',
                         render: (value: string) => (
                           <img src={value || 'https://via.placeholder.com/150'} alt="Advisor" className="w-12 h-12 rounded-full object-cover border" />
                         )
                       },
                       { key: 'experience', header: 'EXPERIENCE' },
                       { key: 'education', header: 'EDUCATION' },
                       {
                         key: 'isActive',
                         header: 'STATUS',
                         render: (value: boolean) => (
                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                             {value ? 'Active' : 'Inactive'}
                           </span>
                         )
                       },
                       {
                         key: 'actions',
                         header: 'ACTIONS',
                         render: (item: any) => (
                           <div className="flex space-x-2">
                             <button
                               onClick={() => {
                                 setEditingItem(item.id);
                                 setFormData({
                                   ...item,
                                   achievementsRaw: Array.isArray(item.achievements) ? item.achievements.join('\n') : ''
                                 });
                                 setImagePreview(null);
                                 setShowModal(true);
                               }}
                               className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                             >
                               <i className="ri-edit-line"></i>
                             </button>
                             <button
                               onClick={() => deleteItem('leadership', item.id)}
                               className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                             >
                               <i className="ri-delete-bin-line"></i>
                             </button>
                           </div>
                         )
                       }
                     ]}
                   />
                 </div>
              
            )}

            {/* Management Team Content */}
            {activeAboutSection === 'management-team' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Management Team</h3>
                  <button
                    onClick={() => {
                      setModalType('add');
                      setEditingItem(null);
                      setFormData({
                        name: '',
                        position: '',
                        description: '',
                        achievements: [],
                        experience: '',
                        education: '',
                        image: '',
                        color: 'refex-blue',
                        category: 'Management Team',
                        isActive: true,
                        order: ((aboutApi as any)?.leadership || data.leadership || []).filter((m: any) => (m.category || '').toLowerCase() === 'management team').length + 1
                      });
                      setImagePreview(null);
                      setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Member
                  </button>
                </div>

                {/* Management Team Preview */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Management Team Preview</h4>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-wrap justify-center gap-8 items-center">
                      {((aboutApi as any)?.leadership || data.leadership || [])
                        .filter((leader: any) => (leader.category || '').toLowerCase() === 'management team' && leader.isActive)
                        .sort((a: any, b: any) => a.order - (b.order || 0))
                        .map((leader: any, index: number) => {
                          const getColorClasses = (color: string) => {
                            const colorMap = {
                              'refex-blue': { border: 'border-[#2879b6]', text: 'text-[#2879b6]' },
                              'refex-green': { border: 'border-[#7dc244]', text: 'text-[#7dc244]' },
                              'refex-orange': { border: 'border-[#ee6a31]', text: 'text-[#ee6a31]' }
                            };
                            return colorMap[color as keyof typeof colorMap] || colorMap['refex-blue'];
                          };
                          const colors = getColorClasses(leader.color || 'refex-blue');
                          return (
                            <div
                              key={index}
                              className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 flex flex-col items-center"
                            >
                              <div
                                className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white ${colors.border} group-hover:shadow-3xl transition-all duration-500`}
                              >
                                <img
                                  src={leader.image || 'https://via.placeholder.com/160x160?text=Manager'}
                                  alt={leader.name}
                                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/160x160?text=Image+Not+Available';
                                  }}
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
                    
                    {(((aboutApi as any)?.leadership || data.leadership || []).filter((leader: any) => (leader.category || '').toLowerCase() === 'management team' && leader.isActive).length === 0) && (
                      <div className="text-center py-8">
                        <i className="ri-user-star-line text-4xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500 font-montserrat">No Management Team members added yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <DataTable
                  title="Management Team"
                  data={((aboutApi as any)?.leadership || data.leadership || []).filter((m: any) => (m.category || '').toLowerCase() === 'management team')}
                  columns={[
                    { key: 'name', header: 'NAME' },
                    { key: 'position', header: 'POSITION' },
                    {
                      key: 'image',
                      header: 'PHOTO',
                      render: (value: string) => (
                        <img src={value} alt="Member" className="w-12 h-12 rounded-full object-cover border" />
                      )
                    },
                    { key: 'order', header: 'ORDER' },
                    {
                      key: 'isActive',
                      header: 'STATUS',
                      render: (value: boolean) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {value ? 'Active' : 'Inactive'}
                        </span>
                      )
                    }
                  ]}
                />
              </div>
            )}

            {/* Values Content */}
            {activeAboutSection === 'values' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Values Management</h3>
                  <button
                    onClick={() => handleAdd()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Value
                  </button>
                </div>
                <DataTable
                  title="Core Values"
                  data={data.values || []}
                  columns={[
                    { key: 'title', header: 'TITLE' },
                    { key: 'description', header: 'DESCRIPTION' },
                    { 
                      key: 'icon', 
                      header: 'ICON',
                      render: (value: string) => <i className={`${value} text-lg`}></i>
                    }
                  ]}
                />
              </div>
            )}

            {/* Journey Content */}
            {activeAboutSection === 'journey' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Journey Management</h3>
                  <button
                    onClick={() => handleAdd()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Milestone
                  </button>
                </div>
                <DataTable
                  title="Company Journey"
                  data={data.journey || []}
                  columns={[
                    { key: 'title', header: 'TITLE' },
                    { key: 'description', header: 'DESCRIPTION' },
                    { key: 'year', header: 'YEAR' }
                  ]}
                />
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex space-x-4 overflow-x-auto">
                {[
                  { id: 'hero', label: 'Hero', icon: 'ri-layout-top-line' },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveProductsSection(section.id as any)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeProductsSection === section.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <i className={`${section.icon} mr-2`}></i>
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {activeProductsSection === 'hero' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Product Hero Section</h3>
                  <button onClick={saveProductsHero} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                    <i className="ri-save-line mr-2"></i>
                    Save Hero
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm text-gray-600">Background Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="mt-1 w-full border rounded px-3 py-2" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImage(file);
                          if (url) setProductsHero({ ...(productsHero||{}), backgroundImage: url });
                        }
                      }}
                    />
                    {productsHero?.backgroundImage && (
                      <div className="mt-2">
                        <img src={productsHero.backgroundImage} alt="Preview" className="w-32 h-20 object-cover rounded" />
                        <p className="text-xs text-gray-500 mt-1">Current: {productsHero.backgroundImage}</p>
                      </div>
                    )}
                    {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">Overlay From</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.overlayFrom || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), overlayFrom: e.target.value })} placeholder="rgba(0,0,0,0.5)" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">Overlay To</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.overlayTo || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), overlayTo: e.target.value })} placeholder="rgba(0,0,0,0.3)" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">Title Line 1</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.titleLine1 || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), titleLine1: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">Title Line 2</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.titleLine2 || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), titleLine2: e.target.value })} />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm text-gray-600">Subtitle / Tagline</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.subtitle || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), subtitle: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">Highlight Text (inside subtitle)</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.highlightText || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), highlightText: e.target.value })} />
                  </label>
                  <label className="block md:col-span-2">
                    <span className="text-sm text-gray-600">Description Paragraph</span>
                    <textarea className="mt-1 w-full border rounded px-3 py-2 h-24" value={productsHero?.description || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), description: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">Title Color</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.titleColor || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), titleColor: e.target.value })} placeholder="#ffffff" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">Subtitle Color</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.subtitleColor || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), subtitleColor: e.target.value })} placeholder="rgba(255,255,255,0.9)" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">Description Color</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.descriptionColor || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), descriptionColor: e.target.value })} placeholder="rgba(255,255,255,0.8)" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">AOS Type</span>
                    <input className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.aosType || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), aosType: e.target.value })} placeholder="fade-up" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">AOS Duration (ms)</span>
                    <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.aosDuration || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), aosDuration: Number(e.target.value) })} placeholder="1000" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">AOS Delay (ms)</span>
                    <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={productsHero?.aosDelay || ''} onChange={(e) => setProductsHero({ ...(productsHero||{}), aosDelay: Number(e.target.value) })} placeholder="200" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-gray-600">Active</span>
                    <div>
                      <input type="checkbox" checked={productsHero?.isActive ?? true} onChange={(e) => setProductsHero({ ...(productsHero||{}), isActive: e.target.checked })} />
                    </div>
                  </label>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600">Live Preview uses frontend logic after saving.</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Capabilities Tab */}
        {activeTab === 'capabilities' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex space-x-4 overflow-x-auto">
                {[
                  { id: 'cap-hero', label: 'Hero', icon: 'ri-layout-top-line' },
                  { id: 'cap-research', label: 'Research', icon: 'ri-flask-line' },
                  { id: 'cap-facilities', label: 'Facilities', icon: 'ri-hospital-line', count: capabilitiesApi.facilities?.length || (data as any).capabilitiesFacilities?.length || 0 }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveCapabilitiesSection(section.id)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeCapabilitiesSection === section.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <i className={`${section.icon} mr-2`}></i>
                    <span className="font-medium">{section.label}</span>
                    {section.count !== undefined && (
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                        activeCapabilitiesSection === section.id ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {section.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Capabilities: Hero */}
            {activeCapabilitiesSection === 'cap-hero' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Capabilities Hero Section</h3>
                  <button
                    onClick={() => {
                      setModalType('edit');
                      setEditingItem('capabilities-hero');
                      const heroData = capabilitiesApi.hero || (data as any).capabilitiesHero || {};
                      const formDataToSet = {
                        title: heroData.title || '',
                        subtitle: heroData.subtitle || '',
                        description: heroData.description || '',
                        subDescription: heroData.subDescription || '',
                        backgroundImage: heroData.backgroundImage || '',
                        isActive: heroData.isActive ?? true
                      };
                      setFormData(formDataToSet);
                      setShowModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-edit-2-line mr-2"></i>
                    Edit Hero Section
                  </button>
                </div>

                {/* Preview Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Preview</h4>
                  </div>
                  
                  {/* Hero Preview */}
                  <div className="p-6">
                    <div className="relative h-60 w-full rounded overflow-hidden mb-6">
                      <img 
                        src={capabilitiesApi.hero?.backgroundImage || (data as any).capabilitiesHero?.backgroundImage || 'https://via.placeholder.com/800x400?text=Background+Image'} 
                        alt="Hero Background" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                          <h4 className="text-2xl md:text-3xl font-bold mb-2 font-montserrat">
                            {capabilitiesApi.hero?.title || (data as any).capabilitiesHero?.title || 'Capabilities'}
                          </h4>
                          {(capabilitiesApi.hero?.subtitle || (data as any).capabilitiesHero?.subtitle) && (
                            <p className="text-lg font-montserrat mb-4">
                              {(data as any).capabilitiesHero.subtitle}
                            </p>
                          )}
                          
                          {/* Description Preview */}
                          {(data as any).capabilitiesHero?.description && (
                            <p className="text-sm text-white/90 max-w-2xl mx-auto leading-relaxed font-montserrat mb-2">
                              {(data as any).capabilitiesHero.description}
                            </p>
                          )}
                          
                          {/* Sub Description Preview */}
                          {(data as any).capabilitiesHero?.subDescription && (
                            <p className="text-xs text-white/80 max-w-3xl mx-auto font-montserrat">
                              {(data as any).capabilitiesHero.subDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Content Details:</h5>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Title:</span> {(data as any).capabilitiesHero?.title || 'Not set'}
                          </p>
                          {(data as any).capabilitiesHero?.subtitle && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Subtitle:</span> {(data as any).capabilitiesHero.subtitle}
                            </p>
                          )}
                          {(data as any).capabilitiesHero?.description && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Description:</span> {(data as any).capabilitiesHero.description}
                            </p>
                          )}
                          {(data as any).capabilitiesHero?.subDescription && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Sub Description:</span> {(data as any).capabilitiesHero.subDescription}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Background Image:</span> 
                          <a href={(data as any).capabilitiesHero?.backgroundImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                            View Image
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Capabilities: Research */}
            {activeCapabilitiesSection === 'cap-research' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">Research & Development Excellence</h3>
                  <button
                    onClick={() => {
                      setModalType('edit');
                      setEditingItem('capabilities-research');
                      const researchData = capabilitiesApi.research || {};
                      console.log('Research Data:', researchData);
                      console.log('API Card Data:', researchData.apiCard);
                      const formDataToSet = {
                        title: researchData.title || '',
                        description: researchData.description || '',
                        image: researchData.image || '',
                        isActive: researchData.isActive ?? true,
                        apiCard: {
                          title: researchData.apiCard?.title || '',
                          subtitle: researchData.apiCard?.subtitle || '',
                          icon: researchData.apiCard?.icon || '',
                          color: researchData.apiCard?.color || '',
                          points: researchData.apiCard?.points || []
                        },
                        fdfCard: {
                          title: researchData.fdfCard?.title || '',
                          subtitle: researchData.fdfCard?.subtitle || '',
                          icon: researchData.fdfCard?.icon || '',
                          color: researchData.fdfCard?.color || '',
                          points: researchData.fdfCard?.points || []
                        },
                        promise: {
                          title: researchData.promise?.title || '',
                          description: researchData.promise?.description || '',
                          icon: researchData.promise?.icon || ''
                        }
                      };
                      console.log('Form Data to Set:', formDataToSet);
                      setFormData(formDataToSet);
                      setShowModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="ri-edit-2-line mr-2"></i>
                    Edit Research Section
                  </button>
                </div>

                {/* Preview Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Preview</h4>
                  </div>
                  
                  {/* Main Title & Description */}
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                      {capabilitiesApi.research?.title || (data as any).capabilitiesResearch?.title || 'Research & Development Excellence'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {capabilitiesApi.research?.description || (data as any).capabilitiesResearch?.description || 'At Refex Life Sciences, innovation is our engine of growth...'}
                    </p>
                  </div>

                  {/* Cards Preview */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* API Card Preview */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 bg-[${(data as any).capabilitiesResearch?.apiCard?.color || '#2879b6'}] rounded-lg flex items-center justify-center`}>
                            <i className={`${(data as any).capabilitiesResearch?.apiCard?.icon || 'ri-flask-line'} text-white text-sm`}></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {capabilitiesApi.research?.apiCard?.title || (data as any).capabilitiesResearch?.apiCard?.title || 'API R&D Strengths'}
                            </h4>
                            <p className={`text-xs text-[${(data as any).capabilitiesResearch?.apiCard?.color || '#2879b6'}]`}>
                              {capabilitiesApi.research?.apiCard?.subtitle || (data as any).capabilitiesResearch?.apiCard?.subtitle || 'Advanced Process Development'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {((capabilitiesApi.research?.apiCard?.points || (data as any).capabilitiesResearch?.apiCard?.points) || []).slice(0, 3).map((point: any, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className={`w-1 h-1 bg-[${(data as any).capabilitiesResearch?.apiCard?.color || '#2879b6'}] rounded-full mt-2 flex-shrink-0`}></div>
                              <div>
                                <p className="text-xs font-medium text-gray-800">{point.title}</p>
                                <p className="text-xs text-gray-600">{point.description}</p>
                              </div>
                            </div>
                          ))}
                          {((data as any).capabilitiesResearch?.apiCard?.points || []).length > 3 && (
                            <p className="text-xs text-gray-500">+{((data as any).capabilitiesResearch?.apiCard?.points || []).length - 3} more points</p>
                          )}
                        </div>
                      </div>

                      {/* FDF Card Preview */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 bg-[${(data as any).capabilitiesResearch?.fdfCard?.color || '#7dc244'}] rounded-lg flex items-center justify-center`}>
                            <i className={`${(data as any).capabilitiesResearch?.fdfCard?.icon || 'ri-capsule-line'} text-white text-sm`}></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {capabilitiesApi.research?.fdfCard?.title || (data as any).capabilitiesResearch?.fdfCard?.title || 'FDF R&D Strengths'}
                            </h4>
                            <p className={`text-xs text-[${(data as any).capabilitiesResearch?.fdfCard?.color || '#7dc244'}]`}>
                              {capabilitiesApi.research?.fdfCard?.subtitle || (data as any).capabilitiesResearch?.fdfCard?.subtitle || 'Complex Formulation Development'}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {((capabilitiesApi.research?.fdfCard?.points || (data as any).capabilitiesResearch?.fdfCard?.points) || []).slice(0, 3).map((point: any, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className={`w-1 h-1 bg-[${(data as any).capabilitiesResearch?.fdfCard?.color || '#7dc244'}] rounded-full mt-2 flex-shrink-0`}></div>
                              <div>
                                <p className="text-xs font-medium text-gray-800">{point.title}</p>
                                <p className="text-xs text-gray-600">{point.description}</p>
                              </div>
                            </div>
                          ))}
                          {((data as any).capabilitiesResearch?.fdfCard?.points || []).length > 3 && (
                            <p className="text-xs text-gray-500">+{((data as any).capabilitiesResearch?.fdfCard?.points || []).length - 3} more points</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Promise Section Preview */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4 text-center">
                      <div className={`w-12 h-12 bg-[${(data as any).capabilitiesResearch?.fdfCard?.color || '#7dc244'}] rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <i className={`${capabilitiesApi.research?.promise?.icon || (data as any).capabilitiesResearch?.promise?.icon || 'ri-lightbulb-line'} text-white`}></i>
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-2">
                        {capabilitiesApi.research?.promise?.title || (data as any).capabilitiesResearch?.promise?.title || 'Our R&D Promise'}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {capabilitiesApi.research?.promise?.description || (data as any).capabilitiesResearch?.promise?.description || 'Through a relentless focus on innovation...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Capabilities: Facilities Table */}
            {activeCapabilitiesSection === 'cap-facilities' && (
            <DataTable
              title="Facilities"
              data={capabilitiesApi.facilities || data.capabilitiesFacilities || []}
              columns={[
              
                {
                  key: 'image',
                  header: 'IMAGE',
                  render: (value: string) => (
                    <img src={value} alt="Facility" className="w-16 h-12 object-cover rounded border" />
                  )
                },
                { key: 'name', header: 'NAME' },
                { key: 'type', header: 'TYPE' },
                { key: 'location', header: 'LOCATION' },
                { key: 'capacity', header: 'CAPACITY' },
                { key: 'established', header: 'EST.' },
                {
                  key: 'capabilities',
                  header: 'CAPABILITIES',
                  render: (value: string[] = []) => Array.isArray(value) ? `${value.length}` : '0'
                },
                {
                  key: 'approvals',
                  header: 'APPROVALS',
                  render: (value: string[] = []) => Array.isArray(value) ? `${value.length}` : '0'
                },
                { key: 'order', header: 'ORDER' },
                {
                  key: 'isActive',
                  header: 'STATUS',
                  render: (value: boolean) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {value ? 'Active' : 'Inactive'}
                    </span>
                  )
                }
              ]}
            />
            )}
          </div>
        )}

        {/* Contact Page Tab */}
        {activeTab === 'contact-page' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Contact Page Management</h2>
            </div>

            {/* Contact Hero Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Contact Hero Section</h3>
                <button
                  onClick={() => {
                    setEditingItem('contact-hero');
                    const heroData = (data as any).contactHero || {};
                    const formDataToSet = {
                      title: heroData.title || '',
                      subtitle: heroData.subtitle || '',
                      description: heroData.description || '',
                      backgroundImage: heroData.backgroundImage || '',
                      isActive: heroData.isActive ?? true
                    };
                    setFormData(formDataToSet);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <i className="ri-edit-line mr-2"></i>
                  Edit Hero Section
                </button>
              </div>

              {/* Preview Section */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Preview</h4>
                </div>
                
                {/* Hero Preview */}
                <div className="p-6">
                  <div className="relative h-60 w-full rounded overflow-hidden mb-6">
                    <img 
                      src={(data as any).contactHero?.backgroundImage || 'https://via.placeholder.com/800x400?text=Background+Image'} 
                      alt="Hero Background" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        <h4 className="text-2xl md:text-3xl font-bold mb-2 font-montserrat">
                          {(data as any).contactHero?.title || 'Contact Us'}
                        </h4>
                        {(data as any).contactHero?.subtitle && (
                          <p className="text-lg font-montserrat mb-4">
                            {(data as any).contactHero.subtitle}
                          </p>
                        )}
                        
                        {/* Description Preview */}
                        {(data as any).contactHero?.description && (
                          <p className="text-sm text-white/90 max-w-2xl mx-auto leading-relaxed font-montserrat mb-2">
                            {(data as any).contactHero.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="text-sm font-semibold text-gray-700 mb-2">Content Details:</h5>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Title:</span> {(data as any).contactHero?.title || 'Not set'}
                        </p>
                        {(data as any).contactHero?.subtitle && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Subtitle:</span> {(data as any).contactHero.subtitle}
                          </p>
                        )}
                        {(data as any).contactHero?.description && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Description:</span> {(data as any).contactHero.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Background Image:</span> 
                        <a href={(data as any).contactHero?.backgroundImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                          View Image
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sustainability Tab */}
        {activeTab === 'sustainability' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Sustainability Page Management</h2>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex space-x-4 overflow-x-auto">
                {[
                  { id: 'hero', label: 'Hero', icon: 'ri-image-line', count: 1 },
                  { id: 'heart', label: 'Heart Section', icon: 'ri-heart-2-line', count: ((sustainabilityApi?.heart?.sections||[]).length || 0) + ((sustainabilityApi?.heart?.commitments||[]).length || 0) },
                  { id: 'sdg', label: 'UN SDGs', icon: 'ri-global-line', count: (sustainability.sdgCards || []).length },
                  { id: 'policies', label: 'Policies', icon: 'ri-shield-check-line', count: (sustainability.policies || []).length },
                  { id: 'vision', label: 'Vision & Mission', icon: 'ri-compass-3-line', count: ((sustainability.visionMission?.missionPoints||[]).length || 0) + 1 },
                  { id: 'innovation', label: 'Innovation & Transformation', icon: 'ri-cpu-line', count: ((sustainability.innovationAndTransformation?.digitalSolutions||[]).length + (sustainability.innovationAndTransformation?.researchInnovation||[]).length) },
                  { id: 'social', label: 'Social Responsibility', icon: 'ri-community-line', count: ((sustainability.socialResponsibility?.csrCards||[]).length + (sustainability.socialResponsibility?.csrImpactItems||[]).length) },
                  { id: 'footer', label: 'Footer Section', icon: 'ri-footprint-line', count: 1 }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSustainabilitySection(section.id as any)}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                      activeSustainabilitySection === section.id
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <i className={`${section.icon} mr-2`}></i>
                    <span className="font-medium">{section.label}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      activeSustainabilitySection === section.id
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {section.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {activeSustainabilitySection === 'hero' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600">Title</label>
                    <input 
                      className="mt-1 w-full border rounded px-3 py-2" 
                      value={sustHeroTitle} 
                      onChange={(e) => setSustHeroTitle(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Description</label>
                    <textarea 
                      className="mt-1 w-full border rounded px-3 py-2 h-28" 
                      value={sustHeroDescription} 
                      onChange={(e) => setSustHeroDescription(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Background Image</label>
                    <input 
                      type="file"
                      accept="image/*"
                      className="mt-1 w-full border rounded px-3 py-2" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await uploadImage(file);
                          if (url) setSustHeroBg(url);
                        }
                      }}
                    />
                    {sustHeroBg && (
                      <div className="mt-2">
                        <img src={sustHeroBg} alt="Preview" className="w-32 h-20 object-cover rounded" />
                        <p className="text-xs text-gray-500 mt-1">Current: {sustHeroBg}</p>
                      </div>
                    )}
                    {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                  </div>
                  <div>
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/cms/sustainability/hero', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              title: sustHeroTitle,
                              description: sustHeroDescription,
                              backgroundImage: sustHeroBg,
                              isActive: true
                            })
                          });
                          await fetchSustainability();
                        } catch {}
                      }} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Save Hero
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-0 overflow-hidden">
                  <div
                    className="relative p-8 min-h-[260px] flex items-center justify-center text-center bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.35)), url('${sustHeroBg || ''}')`
                    }}
                  >
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3">{sustHeroTitle || 'Preview Title'}</h3>
                      <p className="text-white/90 max-w-xl mx-auto">{sustHeroDescription || 'Preview description will appear here.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSustainabilitySection === 'heart' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Sustainability — The Heart of Our Progress</h3>
                    <button
                      onClick={async () => {
                        try {
                          await fetch('/api/cms/sustainability/heart', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              mainTitle: heartMainTitle,
                              mainSubtitle: heartMainSubtitle,
                              sections: heartSections,
                              commitments: heartCommitments,
                              isActive: heartIsActive
                            })
                          });
                          await fetchSustainability();
                          if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('sustainabilityHeartChanged'))
                          }
                        } catch {}
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <i className="ri-save-line mr-2"></i>
                      Save Section
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm text-gray-600">Main Title</span>
                      <input className="mt-1 w-full border rounded px-3 py-2" value={heartMainTitle} onChange={(e) => setHeartMainTitle(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Active</span>
                      <div>
                        <input type="checkbox" checked={heartIsActive} onChange={(e) => setHeartIsActive(e.target.checked)} />
                      </div>
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm text-gray-600">Main Subtitle</span>
                      <textarea className="mt-1 w-full border rounded px-3 py-2 h-24" value={heartMainSubtitle} onChange={(e) => setHeartMainSubtitle(e.target.value)} />
                    </label>
                  </div>
                </div>

                {/* Sections (3) */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Sections (Environmental, Social, Governance)</h3>
                    <button
                      onClick={() => setHeartSections((prev) => ([...prev, { title: '', description: '', icon: 'ri-leaf-line', image: '', metrics: [{ title: '', subtitle: '' }] }]))}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Section
                    </button>
                  </div>

                  <div className="space-y-4">
                    {heartSections.map((s, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-500">Section #{idx + 1}</span>
                          <button
                            onClick={() => {
                              const copy = [...heartSections];
                              copy.splice(idx, 1);
                              setHeartSections(copy);
                            }}
                            className="text-red-600 hover:text-red-700 text-sm"
                            title="Remove section"
                          >
                            <i className="ri-delete-bin-6-line mr-1"></i>
                            Remove
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="block">
                            <span className="text-sm text-gray-600">Title</span>
                            <input className="mt-1 w-full border rounded px-3 py-2" value={s.title} onChange={(e) => {
                              const copy = [...heartSections]; copy[idx].title = e.target.value; setHeartSections(copy);
                            }} />
                          </label>
                          <label className="block">
                            <span className="text-sm text-gray-600">Icon (Remix/Icon class)</span>
                            <input className="mt-1 w-full border rounded px-3 py-2" value={s.icon||''} onChange={(e) => { const copy=[...heartSections]; copy[idx].icon=e.target.value; setHeartSections(copy); }} />
                          </label>
                          <label className="block md:col-span-2">
                            <span className="text-sm text-gray-600">Description</span>
                            <textarea className="mt-1 w-full border rounded px-3 py-2 h-24" value={s.description||''} onChange={(e) => { const copy=[...heartSections]; copy[idx].description=e.target.value; setHeartSections(copy); }} />
                          </label>
                          <label className="block md:col-span-2">
                            <span className="text-sm text-gray-600">Image</span>
                            <input 
                              type="file"
                              accept="image/*"
                              className="mt-1 w-full border rounded px-3 py-2" 
                              onChange={async (e) => { 
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await uploadImage(file);
                                  if (url) {
                                    const copy=[...heartSections]; 
                                    copy[idx].image=url; 
                                    setHeartSections(copy);
                                  }
                                }
                              }} 
                            />
                            {s.image && (
                              <div className="mt-2">
                                <img src={s.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                                <p className="text-xs text-gray-500 mt-1">Current: {s.image}</p>
                              </div>
                            )}
                            {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                          </label>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Metrics</h4>
                            <button onClick={() => { const copy=[...heartSections]; (copy[idx].metrics=copy[idx].metrics||[]).push({ title: '', subtitle: '' }); setHeartSections(copy); }} className="text-blue-600 hover:text-blue-700"><i className="ri-add-line mr-1"></i>Add Metric</button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(s.metrics||[]).map((m:any, mi:number) => (
                              <div key={mi} className="grid grid-cols-2 gap-2 items-start">
                                <input className="border rounded px-2 py-1" placeholder="Title" value={m.title||''} onChange={(e)=>{ const copy=[...heartSections]; copy[idx].metrics[mi].title=e.target.value; setHeartSections(copy); }} />
                                <input className="border rounded px-2 py-1" placeholder="Subtitle" value={m.subtitle||''} onChange={(e)=>{ const copy=[...heartSections]; copy[idx].metrics[mi].subtitle=e.target.value; setHeartSections(copy); }} />
                                <div className="col-span-2 text-right">
                                  <button
                                    onClick={() => { const copy=[...heartSections]; copy[idx].metrics.splice(mi,1); setHeartSections(copy); }}
                                    className="text-red-600 hover:text-red-700 text-xs"
                                  >
                                    <i className="ri-delete-bin-line mr-1"></i>
                                    Remove Metric
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Commitments (4) */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Sustainability Commitments</h3>
                    <button onClick={() => setHeartCommitments((prev)=> ([...prev, { title: '', subtitle: '', icon: 'ri-leaf-line', color: 'refex-green' }]))} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-add-line mr-2"></i>
                      Add Commitment
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {heartCommitments.map((c, ci) => (
                      <div key={ci} className="border rounded-lg p-4 space-y-2">
                        <input className="w-full border rounded px-2 py-1" placeholder="Title" value={c.title||''} onChange={(e)=>{ const copy=[...heartCommitments]; copy[ci].title=e.target.value; setHeartCommitments(copy); }} />
                        <input className="w-full border rounded px-2 py-1" placeholder="Subtitle" value={c.subtitle||''} onChange={(e)=>{ const copy=[...heartCommitments]; copy[ci].subtitle=e.target.value; setHeartCommitments(copy); }} />
                        <input className="w-full border rounded px-2 py-1" placeholder="Icon (class)" value={c.icon||''} onChange={(e)=>{ const copy=[...heartCommitments]; copy[ci].icon=e.target.value; setHeartCommitments(copy); }} />
                        <select className="w-full border rounded px-2 py-1" value={c.color||'refex-green'} onChange={(e)=>{ const copy=[...heartCommitments]; copy[ci].color=e.target.value; setHeartCommitments(copy); }}>
                          <option value="refex-green">refex-green</option>
                          <option value="refex-blue">refex-blue</option>
                          <option value="refex-orange">refex-orange</option>
                        </select>
                        <div className="text-right pt-1">
                          <button
                            onClick={() => { const copy=[...heartCommitments]; copy.splice(ci,1); setHeartCommitments(copy); }}
                            className="text-red-600 hover:text-red-700 text-xs"
                          >
                            <i className="ri-delete-bin-6-line mr-1"></i>
                            Remove Commitment
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
               {activeSustainabilitySection === 'social' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Social Responsibility - Section</h3>
                    <button onClick={saveSocialSection} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-save-line mr-2"></i>
                      Save Social Section
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm text-gray-600">Section Title</span>
                      <input className="mt-1 w-full border rounded px-3 py-2" value={socialTitle} onChange={(e) => setSocialTitle(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Active</span>
                      <div>
                        <input type="checkbox" checked={socialIsActive} onChange={(e) => setSocialIsActive(e.target.checked)} />
                      </div>
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm text-gray-600">Section Description (rich text)</span>
                      <textarea className="mt-1 w-full border rounded px-3 py-2 h-28" value={socialDescription} onChange={(e) => setSocialDescription(e.target.value)} />
                    </label>
                  </div>
                </div>

                {/* CSR Cards */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">CSR Cards</h3>
                    <button onClick={addCsrCard} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-add-line mr-2"></i>
                      Add Card
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Title</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Subtitle</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Highlight</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Icon</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Gradient</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Active</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {csrCards.slice().sort((a: any, b: any) => (a.order||0)-(b.order||0)).map((c: any) => (
                          <tr key={c.id} className="align-top">
                            <td className="px-3 py-2 min-w-[180px]"><input className="w-full border rounded px-2 py-1" value={c.cardTitle} onChange={(e) => updateCsrCard(c.id, 'cardTitle', e.target.value)} /></td>
                            <td className="px-3 py-2 min-w-[160px]"><input className="w-full border rounded px-2 py-1" value={c.cardSubtitle||''} onChange={(e) => updateCsrCard(c.id, 'cardSubtitle', e.target.value)} /></td>
                            <td className="px-3 py-2 min-w-[180px]"><input className="w-full border rounded px-2 py-1" value={c.highlightText||''} onChange={(e) => updateCsrCard(c.id, 'highlightText', e.target.value)} /></td>
                            <td className="px-3 py-2 w-44"><input className="w-full border rounded px-2 py-1" value={c.icon||''} onChange={(e) => updateCsrCard(c.id, 'icon', e.target.value)} /></td>
                            <td className="px-3 py-2 w-56"><input className="w-full border rounded px-2 py-1" value={c.gradientColors||''} onChange={(e) => updateCsrCard(c.id, 'gradientColors', e.target.value)} /></td>
                            <td className="px-3 py-2 w-24"><input type="number" className="w-full border rounded px-2 py-1" value={c.order||0} onChange={(e) => updateCsrCard(c.id, 'order', Number(e.target.value)||0)} /></td>
                            <td className="px-3 py-2 w-24"><input type="checkbox" checked={!!c.isActive} onChange={(e) => updateCsrCard(c.id, 'isActive', e.target.checked)} /></td>
                            <td className="px-3 py-2 w-24 text-right">
                              <button onClick={() => deleteCsrCard(c.id)} className="text-red-600 hover:text-red-700"><i className="ri-delete-bin-6-line"></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CSR Impact */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">CSR Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label className="block">
                      <span className="text-sm text-gray-600">Impact Title</span>
                      <input className="mt-1 w-full border rounded px-3 py-2" value={csrImpactTitle} onChange={(e) => setCsrImpactTitle(e.target.value)} />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm text-gray-600">Impact Description (rich text)</span>
                      <textarea className="mt-1 w-full border rounded px-3 py-2 h-28" value={csrImpactDescription} onChange={(e) => setCsrImpactDescription(e.target.value)} />
                    </label>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold">Impact Items</h4>
                    <button onClick={addCsrImpactItem} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-add-line mr-2"></i>
                      Add Impact Item
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Title</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Description</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Icon</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Gradient</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Active</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {csrImpactItems.slice().sort((a: any, b: any) => (a.order||0)-(b.order||0)).map((it: any) => (
                          <tr key={it.id} className="align-top">
                            <td className="px-3 py-2 min-w-[180px]"><input className="w-full border rounded px-2 py-1" value={it.title} onChange={(e) => updateCsrImpactItem(it.id, 'title', e.target.value)} /></td>
                            <td className="px-3 py-2 min-w-[260px]"><textarea className="w-full border rounded px-2 py-1 h-16" value={it.description||''} onChange={(e) => updateCsrImpactItem(it.id, 'description', e.target.value)} /></td>
                            <td className="px-3 py-2 w-44"><input className="w-full border rounded px-2 py-1" value={it.icon||''} onChange={(e) => updateCsrImpactItem(it.id, 'icon', e.target.value)} /></td>
                            <td className="px-3 py-2 w-56"><input className="w-full border rounded px-2 py-1" value={it.gradientColors||''} onChange={(e) => updateCsrImpactItem(it.id, 'gradientColors', e.target.value)} /></td>
                            <td className="px-3 py-2 w-24"><input type="number" className="w-full border rounded px-2 py-1" value={it.order||0} onChange={(e) => updateCsrImpactItem(it.id, 'order', Number(e.target.value)||0)} /></td>
                            <td className="px-3 py-2 w-24"><input type="checkbox" checked={!!it.isActive} onChange={(e) => updateCsrImpactItem(it.id, 'isActive', e.target.checked)} /></td>
                            <td className="px-3 py-2 w-24 text-right">
                              <button onClick={() => deleteCsrImpactItem(it.id)} className="text-red-600 hover:text-red-700"><i className="ri-delete-bin-6-line"></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSustainabilitySection === 'vision' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-800">Vision & Mission</h3>
                    <button
                      onClick={saveVisionMission}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <i className="ri-save-line"></i>
                      Save Vision & Mission
                    </button>
                  </div>

                  {/* Titles & Subtitles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm text-gray-600">Section Title</span>
                      <input
                        className="mt-1 w-full border rounded px-3 py-2"
                        value={visionMissionLocal?.sectionTitle || ''}
                        onChange={(e) => setVisionMissionLocal({ ...visionMissionLocal, sectionTitle: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Section Subtitle</span>
                      <input
                        className="mt-1 w-full border rounded px-3 py-2"
                        value={visionMissionLocal?.sectionSubtitle || ''}
                        onChange={(e) => setVisionMissionLocal({ ...visionMissionLocal, sectionSubtitle: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Vision Title</span>
                      <input
                        className="mt-1 w-full border rounded px-3 py-2"
                        value={visionMissionLocal?.visionTitle || ''}
                        onChange={(e) => setVisionMissionLocal({ ...visionMissionLocal, visionTitle: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Vision Subtitle</span>
                      <input
                        className="mt-1 w-full border rounded px-3 py-2"
                        value={visionMissionLocal?.visionSubtitle || ''}
                        onChange={(e) => setVisionMissionLocal({ ...visionMissionLocal, visionSubtitle: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Mission Title</span>
                      <input
                        className="mt-1 w-full border rounded px-3 py-2"
                        value={visionMissionLocal?.missionTitle || ''}
                        onChange={(e) => setVisionMissionLocal({ ...visionMissionLocal, missionTitle: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Mission Subtitle</span>
                      <input
                        className="mt-1 w-full border rounded px-3 py-2"
                        value={visionMissionLocal?.missionSubtitle || ''}
                        onChange={(e) => setVisionMissionLocal({ ...visionMissionLocal, missionSubtitle: e.target.value })}
                      />
                    </label>
                  </div>

                  {/* Vision Description */}
                  <div>
                    <label className="block text-sm text-gray-600">Vision Description</label>
                    <textarea className="mt-1 w-full border rounded px-3 py-2 h-28" value={vmVisionDesc} onChange={(e) => setVmVisionDesc(e.target.value)} />
                    <div className="flex justify-end mt-2">
                      <button onClick={saveVisionDesc} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save Vision</button>
                    </div>
                  </div>

                  {/* Mission Points */}
                  <div className="flex items-center justify-between mt-4">
                    <h4 className="text-lg font-semibold">Mission Points</h4>
                    <button onClick={() => openMpModal('add')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-add-line mr-2"></i>
                      Add Mission Point
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Text</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Active</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {missionPointsSorted.map((mp: any) => (
                          <tr key={mp.id}>
                            <td className="px-3 py-2 min-w-[260px]"><div className="line-clamp-2">{mp.text}</div></td>
                            <td className="px-3 py-2 w-24">{mp.order}</td>
                            <td className="px-3 py-2 w-24">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${mp.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{mp.isActive ? 'Active' : 'Inactive'}</span>
                            </td>
                            <td className="px-3 py-2 w-32 text-right space-x-2">
                              <button onClick={() => openMpModal('edit', mp)} className="text-blue-600 hover:text-blue-700"><i className="ri-edit-2-line"></i></button>
                              <button onClick={() => deleteMissionPoint(mp.id)} className="text-red-600 hover:text-red-700"><i className="ri-delete-bin-6-line"></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Vision Points */}
                  <div className="flex items-center justify-between mt-8">
                    <h4 className="text-lg font-semibold">Vision Points</h4>
                    <button
                      onClick={() => openVpModal('add')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Vision Point
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Icon</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Text</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Color</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Active</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(visionMissionLocal?.visionPoints || []).slice().sort((a: any, b: any) => (a.order||0) - (b.order||0)).map((vp: any) => (
                          <tr key={vp.id} className="align-top">
                            <td className="px-3 py-2 w-40">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: vp.color || '#2879b6' }}>
                                  <i className={`${vp.icon || 'ri-check-line'} text-white text-sm`}></i>
                                </div>
                                <span className="text-sm text-gray-600">{vp.icon}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 min-w-[260px]">
                              <div className="line-clamp-2 text-sm">{vp.text}</div>
                            </td>
                            <td className="px-3 py-2 w-40">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: vp.color || '#2879b6' }}></div>
                                <span className="text-sm text-gray-600">{vp.color}</span>
                              </div>
                            </td>
                            <td className="px-3 py-2 w-24">
                              <span className="text-sm text-gray-600">{vp.order}</span>
                            </td>
                            <td className="px-3 py-2 w-24">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${vp.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {vp.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-3 py-2 w-32 text-right space-x-2">
                              <button onClick={() => openVpModal('edit', vp)} className="text-blue-600 hover:text-blue-700">
                                <i className="ri-edit-2-line"></i>
                              </button>
                              <button onClick={() => deleteVisionPoint(vp.id)} className="text-red-600 hover:text-red-700">
                                <i className="ri-delete-bin-6-line"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mt-8">
                    <h4 className="text-lg font-semibold">Stats</h4>
                    <button
                      onClick={() => {
                        const existing = (visionMissionLocal?.stats || []);
                        const next = [
                          ...existing,
                          { id: `vs-${Date.now()}`, label: 'Label', value: '0', color: '#2879b6', order: (existing.length || 0) + 1, isActive: true }
                        ];
                        setVisionMissionLocal({ ...visionMissionLocal, stats: next });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add Stat
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Label</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Value</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Color</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Active</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(visionMissionLocal?.stats || []).slice().sort((a: any, b: any) => (a.order||0) - (b.order||0)).map((st: any) => (
                          <tr key={st.id} className="align-top">
                            <td className="px-3 py-2 min-w-[200px]">
                              <input className="w-full border rounded px-2 py-1" value={st.label}
                                onChange={(e) => {
                                  const updated = (visionMissionLocal?.stats || []).map((s: any) => s.id === st.id ? { ...s, label: e.target.value } : s);
                                  setVisionMissionLocal({ ...visionMissionLocal, stats: updated });
                                }} />
                            </td>
                            <td className="px-3 py-2 w-40">
                              <input className="w-full border rounded px-2 py-1" value={st.value}
                                onChange={(e) => {
                                  const updated = (visionMissionLocal?.stats || []).map((s: any) => s.id === st.id ? { ...s, value: e.target.value } : s);
                                  setVisionMissionLocal({ ...visionMissionLocal, stats: updated });
                                }} />
                            </td>
                            <td className="px-3 py-2 w-40">
                              <input className="w-full border rounded px-2 py-1" value={st.color}
                                onChange={(e) => {
                                  const updated = (visionMissionLocal?.stats || []).map((s: any) => s.id === st.id ? { ...s, color: e.target.value } : s);
                                  setVisionMissionLocal({ ...visionMissionLocal, stats: updated });
                                }} />
                            </td>
                            <td className="px-3 py-2 w-24">
                              <input type="number" className="w-full border rounded px-2 py-1" value={st.order}
                                onChange={(e) => {
                                  const updated = (visionMissionLocal?.stats || []).map((s: any) => s.id === st.id ? { ...s, order: Number(e.target.value)||0 } : s);
                                  setVisionMissionLocal({ ...visionMissionLocal, stats: updated });
                                }} />
                            </td>
                            <td className="px-3 py-2 w-24">
                              <input type="checkbox" checked={!!st.isActive}
                                onChange={(e) => {
                                  const updated = (visionMissionLocal?.stats || []).map((s: any) => s.id === st.id ? { ...s, isActive: e.target.checked } : s);
                                  setVisionMissionLocal({ ...visionMissionLocal, stats: updated });
                                }} />
                            </td>
                            <td className="px-3 py-2 w-24 text-right">
                              <button
                                onClick={() => deleteStat(st.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <i className="ri-delete-bin-6-line"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Preview</h3>
                  <div className="space-y-6">
                    <div className="rounded-3xl border p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{visionMissionLocal?.visionTitle || 'Our Vision'}</h4>
                      <p className="text-sm text-gray-600 mb-4">{visionMissionLocal?.visionSubtitle || 'Sustainable Healthcare Partner'}</p>
                      <p className="text-gray-700">{vmVisionDesc || 'Vision description preview...'}</p>
                    </div>
                    <div className="rounded-3xl border p-6">
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{visionMissionLocal?.missionTitle || 'Our Mission'}</h4>
                      <p className="text-sm text-gray-600 mb-4">{visionMissionLocal?.missionSubtitle || 'Impactful Solutions'}</p>
                      <div className="space-y-3">
                        {missionPointsSorted.map((mp: any) => (
                          <div key={mp.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-[#7dc244]/5 to-transparent rounded-xl border">
                            <div className="w-6 h-6 bg-[#7dc244] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <i className="ri-check-line text-white text-sm"></i>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{mp.text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#7dc244]/10 mt-6">
                        {(visionMissionLocal?.stats || []).slice().sort((a: any, b: any) => (a.order||0) - (b.order||0)).filter((s: any) => s.isActive).map((s: any) => (
                          <div key={s.id} className="text-center">
                            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                            <div className="text-xs text-gray-600">{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission Point Modal */}
                {mpModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{mpMode === 'add' ? 'Add Mission Point' : 'Edit Mission Point'}</h3>
                        <button onClick={closeMpModal} className="text-gray-500 hover:text-gray-700"><i className="ri-close-line text-xl"></i></button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <label className="block">
                          <span className="text-sm text-gray-600">Text</span>
                          <textarea className="mt-1 w-full border rounded px-3 py-2 h-24" value={mpForm.text} onChange={(e) => setMpForm({ ...mpForm, text: e.target.value })} />
                        </label>
                        <label className="block">
                          <span className="text-sm text-gray-600">Order</span>
                          <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={mpForm.order} onChange={(e) => setMpForm({ ...mpForm, order: e.target.value })} />
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={!!mpForm.isActive} onChange={(e) => setMpForm({ ...mpForm, isActive: e.target.checked })} />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                      <div className="flex justify-end mt-6 space-x-3">
                        <button onClick={closeMpModal} className="px-4 py-2 rounded border">Cancel</button>
                        <button onClick={saveMpModal} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vision Point Modal */}
                {vpModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{vpMode === 'add' ? 'Add Vision Point' : 'Edit Vision Point'}</h3>
                        <button onClick={closeVpModal} className="text-gray-500 hover:text-gray-700"><i className="ri-close-line text-xl"></i></button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <label className="block">
                          <span className="text-sm text-gray-600">Icon</span>
                          <input 
                            className="mt-1 w-full border rounded px-3 py-2" 
                            value={vpForm.icon} 
                            onChange={(e) => setVpForm({ ...vpForm, icon: e.target.value })} 
                            placeholder="ri-check-line"
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm text-gray-600">Text</span>
                          <textarea className="mt-1 w-full border rounded px-3 py-2 h-24" value={vpForm.text} onChange={(e) => setVpForm({ ...vpForm, text: e.target.value })} />
                        </label>
                        <label className="block">
                          <span className="text-sm text-gray-600">Color</span>
                          <input 
                            className="mt-1 w-full border rounded px-3 py-2" 
                            value={vpForm.color} 
                            onChange={(e) => setVpForm({ ...vpForm, color: e.target.value })} 
                            placeholder="#2879b6"
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm text-gray-600">Order</span>
                          <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={vpForm.order} onChange={(e) => setVpForm({ ...vpForm, order: e.target.value })} />
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={!!vpForm.isActive} onChange={(e) => setVpForm({ ...vpForm, isActive: e.target.checked })} />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                      <div className="flex justify-end mt-6 space-x-3">
                        <button onClick={closeVpModal} className="px-4 py-2 rounded border">Cancel</button>
                        <button onClick={saveVpModal} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeSustainabilitySection === 'sdg' && (
              <div className="space-y-6">
                {/* Preview first */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">UN SDGs Preview</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {((sustainabilityApi?.sdgCards || []).slice().sort((a: any, b: any) => (a.order||0)-(b.order||0))).map((card: any) => (
                      <div key={card.id} className="rounded-xl border p-4 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: card.color }}>
                          <i className={`${card.icon} text-xl`}></i>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">SDG {card.number}: {card.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{card.contribution}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Table second */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">UN SDG Cards</h3>
                    <button 
                      onClick={() => {
                        setSdgForm({ number: 3, title: 'New SDG', contribution: '', icon: 'ri-heart-pulse-line', color: '#2879b6', order: (sustainabilityApi?.sdgCards?.length||0)+1, isActive: true });
                        setSdgModalMode('add');
                        setSdgModalOpen(true);
                      }} 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Add SDG Card
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">#</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Title</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Contribution</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Icon</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Color</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Active</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {((sustainabilityApi?.sdgCards || []).slice().sort((a: any, b: any) => (a.order||0)-(b.order||0))).map((card: any) => (
                          <tr key={card.id} className="align-top">
                            <td className="px-3 py-2 w-20">{card.number}</td>
                            <td className="px-3 py-2 min-w-[180px]">{card.title}</td>
                            <td className="px-3 py-2 min-w-[260px]"><div className="line-clamp-3 text-gray-700">{card.contribution}</div></td>
                            <td className="px-3 py-2 w-40">{card.icon}</td>
                            <td className="px-3 py-2 w-40">{card.color}</td>
                            <td className="px-3 py-2 w-24">{card.order}</td>
                            <td className="px-3 py-2 w-24">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${card.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{card.isActive ? 'Active' : 'Inactive'}</span>
                            </td>
                            <td className="px-3 py-2 w-32 text-right space-x-2">
                              <button 
                                onClick={() => {
                                  setSdgForm({ ...card });
                                  setSdgModalMode('edit');
                                  setSdgModalOpen(true);
                                }} 
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <i className="ri-edit-2-line"></i>
                              </button>
                              <button 
                                onClick={async () => {
                                  try {
                                    await fetch(`/api/cms/sustainability/sdg/${card.id}`, {
                                      method: 'DELETE',
                                      headers: { 'Content-Type': 'application/json' }
                                    });
                                    await fetchSustainability();
                                  } catch {}
                                }} 
                                className="text-red-600 hover:text-red-700"
                              >
                                <i className="ri-delete-bin-6-line"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* SDG Modal */}
                {sdgModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">{sdgModalMode === 'add' ? 'Add SDG Card' : 'Edit SDG Card'}</h3>
                        <button onClick={closeSdgModal} className="text-gray-500 hover:text-gray-700"><i className="ri-close-line text-xl"></i></button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="block">
                          <span className="text-sm text-gray-600">SDG Number</span>
                          <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={sdgForm.number} onChange={(e) => setSdgForm({ ...sdgForm, number: e.target.value })} />
                        </label>
                        <label className="block">
                          <span className="text-sm text-gray-600">Order</span>
                          <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={sdgForm.order} onChange={(e) => setSdgForm({ ...sdgForm, order: e.target.value })} />
                        </label>
                        <label className="block md:col-span-2">
                          <span className="text-sm text-gray-600">Title</span>
                          <input className="mt-1 w-full border rounded px-3 py-2" value={sdgForm.title} onChange={(e) => setSdgForm({ ...sdgForm, title: e.target.value })} />
                        </label>
                        <label className="block md:col-span-2">
                          <span className="text-sm text-gray-600">Contribution</span>
                          <textarea className="mt-1 w-full border rounded px-3 py-2 h-24" value={sdgForm.contribution} onChange={(e) => setSdgForm({ ...sdgForm, contribution: e.target.value })} />
                        </label>
                        <label className="block">
                          <span className="text-sm text-gray-600">Icon</span>
                          <input className="mt-1 w-full border rounded px-3 py-2" value={sdgForm.icon} onChange={(e) => setSdgForm({ ...sdgForm, icon: e.target.value })} />
                        </label>
                        <label className="block">
                          <span className="text-sm text-gray-600">Color</span>
                          <input className="mt-1 w-full border rounded px-3 py-2" value={sdgForm.color} onChange={(e) => setSdgForm({ ...sdgForm, color: e.target.value })} />
                        </label>
                        <label className="flex items-center space-x-2 md:col-span-2">
                          <input type="checkbox" checked={!!sdgForm.isActive} onChange={(e) => setSdgForm({ ...sdgForm, isActive: e.target.checked })} />
                          <span className="text-sm text-gray-700">Active</span>
                        </label>
                      </div>
                      <div className="flex justify-end mt-6 space-x-3">
                        <button onClick={closeSdgModal} className="px-4 py-2 rounded border">Cancel</button>
                        <button 
                          onClick={async () => {
                            try {
                              const payload = {
                                number: Number(sdgForm.number) || 0,
                                title: sdgForm.title || '',
                                contribution: sdgForm.contribution || '',
                                icon: sdgForm.icon || 'ri-heart-pulse-line',
                                color: sdgForm.color || '#2879b6',
                                order: Number(sdgForm.order) || 0,
                                isActive: !!sdgForm.isActive
                              };
                              
                              if (sdgModalMode === 'add') {
                                await fetch('/api/cms/sustainability/sdg', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(payload)
                                });
                              } else {
                                await fetch(`/api/cms/sustainability/sdg/${sdgForm.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(payload)
                                });
                              }
                              await fetchSustainability();
                              closeSdgModal();
                            } catch {}
                          }} 
                          className="px-4 py-2 rounded bg-blue-600 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeSustainabilitySection === 'innovation' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Innovation & Transformation - Section</h3>
                    <button onClick={saveInnovationTransformation} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-save-line mr-2"></i>
                      Save Section
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm text-gray-600">Section Title</span>
                      <input className="mt-1 w-full border rounded px-3 py-2" value={itSectionTitle} onChange={(e) => setItSectionTitle(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Active</span>
                      <div>
                        <input type="checkbox" checked={itIsActive} onChange={(e) => setItIsActive(e.target.checked)} />
                      </div>
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm text-gray-600">Section Description (rich text)</span>
                      <textarea className="mt-1 w-full border rounded px-3 py-2 h-28" value={itSectionDescription} onChange={(e) => setItSectionDescription(e.target.value)} />
                    </label>
                  </div>
                </div>

                {/* Digital Solutions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Digital Solutions</h3>
                    <button onClick={addDigitalCard} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-add-line mr-2"></i>
                      Add Card
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Title</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Subtitle</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Description</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Active</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {digitalSolutionsSorted.map((c: any) => (
                          <tr key={c.id} className="align-top">
                            <td className="px-3 py-2 min-w-[180px]"><input className="w-full border rounded px-2 py-1" value={c.cardTitle} onChange={(e) => updateDigitalField(c.id, 'cardTitle', e.target.value)} /></td>
                            <td className="px-3 py-2 min-w-[160px]"><input className="w-full border rounded px-2 py-1" value={c.cardSubtitle||''} onChange={(e) => updateDigitalField(c.id, 'cardSubtitle', e.target.value)} /></td>
                            <td className="px-3 py-2 min-w-[260px]"><textarea className="w-full border rounded px-2 py-1 h-16" value={c.cardDescription||''} onChange={(e) => updateDigitalField(c.id, 'cardDescription', e.target.value)} /></td>
                            <td className="px-3 py-2 w-24"><input type="number" className="w-full border rounded px-2 py-1" value={c.order||0} onChange={(e) => updateDigitalField(c.id, 'order', e.target.value)} /></td>
                            <td className="px-3 py-2 w-24"><input type="checkbox" checked={!!c.isActive} onChange={(e) => updateDigitalField(c.id, 'isActive', e.target.checked)} /></td>
                            <td className="px-3 py-2 w-24 text-right">
                              <button onClick={() => deleteDigitalCard(c.id)} className="text-red-600 hover:text-red-700"><i className="ri-delete-bin-6-line"></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Research & Innovation */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Research & Innovation</h3>
                    <button onClick={addResearchCard} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-add-line mr-2"></i>
                      Add Card
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Title</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Subtitle</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Description</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Active</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {researchInnovationSorted.map((c: any) => (
                          <tr key={c.id} className="align-top">
                            <td className="px-3 py-2 min-w-[180px]"><input className="w-full border rounded px-2 py-1" value={c.cardTitle} onChange={(e) => updateResearchField(c.id, 'cardTitle', e.target.value)} /></td>
                            <td className="px-3 py-2 min-w-[160px]"><input className="w-full border rounded px-2 py-1" value={c.cardSubtitle||''} onChange={(e) => updateResearchField(c.id, 'cardSubtitle', e.target.value)} /></td>
                            <td className="px-3 py-2 min-w-[260px]"><textarea className="w-full border rounded px-2 py-1 h-16" value={c.cardDescription||''} onChange={(e) => updateResearchField(c.id, 'cardDescription', e.target.value)} /></td>
                            <td className="px-3 py-2 w-24"><input type="number" className="w-full border rounded px-2 py-1" value={c.order||0} onChange={(e) => updateResearchField(c.id, 'order', e.target.value)} /></td>
                            <td className="px-3 py-2 w-24"><input type="checkbox" checked={!!c.isActive} onChange={(e) => updateResearchField(c.id, 'isActive', e.target.checked)} /></td>
                            <td className="px-3 py-2 w-24 text-right">
                              <button onClick={() => deleteResearchCard(c.id)} className="text-red-600 hover:text-red-700"><i className="ri-delete-bin-6-line"></i></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSustainabilitySection === 'policies' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Policies</h3>
                    <button onClick={addPolicy} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-add-line mr-2"></i>
                      Add Policy
                    </button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Title</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Description</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Icon</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Color</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Order</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">Active</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(sustainability.policies || []).slice().sort((a: any, b: any) => (a.order||0) - (b.order||0)).map((pol: any) => (
                          <tr key={pol.id} className="align-top">
                            <td className="px-3 py-2 min-w-[180px]">
                              <input className="w-full border rounded px-2 py-1" value={pol.title} onChange={(e) => updatePolicyField(pol.id, 'title', e.target.value)} />
                            </td>
                            <td className="px-3 py-2 min-w-[260px]">
                              <textarea className="w-full border rounded px-2 py-1 h-16" value={pol.description} onChange={(e) => updatePolicyField(pol.id, 'description', e.target.value)} />
                            </td>
                            <td className="px-3 py-2 w-40">
                              <input className="w-full border rounded px-2 py-1" value={pol.icon} onChange={(e) => updatePolicyField(pol.id, 'icon', e.target.value)} />
                            </td>
                            <td className="px-3 py-2 w-40">
                              <input className="w-full border rounded px-2 py-1" value={pol.color} onChange={(e) => updatePolicyField(pol.id, 'color', e.target.value)} />
                            </td>
                            <td className="px-3 py-2 w-24">
                              <input type="number" className="w-full border rounded px-2 py-1" value={pol.order} onChange={(e) => updatePolicyField(pol.id, 'order', e.target.value)} />
                            </td>
                            <td className="px-3 py-2 w-24">
                              <input type="checkbox" checked={!!pol.isActive} onChange={(e) => updatePolicyField(pol.id, 'isActive', e.target.checked)} />
                            </td>
                            <td className="px-3 py-2 w-24 text-right">
                              <button onClick={() => deletePolicy(pol.id)} className="text-red-600 hover:text-red-700">
                                <i className="ri-delete-bin-6-line"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Policies Preview</h3>
                  <div className="space-y-3">
                    {(sustainability.policies || []).slice().sort((a: any, b: any) => (a.order||0) - (b.order||0)).map((pol: any) => (
                      <div key={pol.id} className="flex items-start gap-3 border rounded-lg p-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: pol.color }}>
                          <i className={`${pol.icon}`}></i>
                        </div>
                        <div>
                          <div className="font-medium">{pol.title}</div>
                          <div className="text-sm text-gray-600">{pol.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
                 {activeSustainabilitySection === 'footer' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Footer Section (Final Hero)</h3>
                    <button onClick={saveFooterSection} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
                      <i className="ri-save-line mr-2"></i>
                      Save Footer Section
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm text-gray-600">Title</span>
                      <input className="mt-1 w-full border rounded px-3 py-2" value={footerTitle} onChange={(e) => setFooterTitle(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">CTA Text</span>
                      <input className="mt-1 w-full border rounded px-3 py-2" value={footerCtaText} onChange={(e) => setFooterCtaText(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">CTA Icon (e.g., ri-heart-pulse-line)</span>
                      <input className="mt-1 w-full border rounded px-3 py-2" value={footerCtaIcon} onChange={(e) => setFooterCtaIcon(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Background Image</span>
                      <input 
                        type="file"
                        accept="image/*"
                        className="mt-1 w-full border rounded px-3 py-2" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImage(file);
                            if (url) setFooterBgImage(url);
                          }
                        }}
                      />
                      {footerBgImage && (
                        <div className="mt-2">
                          <img src={footerBgImage} alt="Preview" className="w-32 h-20 object-cover rounded" />
                          <p className="text-xs text-gray-500 mt-1">Current: {footerBgImage}</p>
                        </div>
                      )}
                      {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                    </label>
                    <label className="block md:col-span-2">
                      <span className="text-sm text-gray-600">Subtitle (rich text)</span>
                      <textarea className="mt-1 w-full border rounded px-3 py-2 h-28" value={footerSubtitle} onChange={(e) => setFooterSubtitle(e.target.value)} />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-600">Active</span>
                      <div>
                        <input type="checkbox" checked={footerIsActive} onChange={(e) => setFooterIsActive(e.target.checked)} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                <i className="ri-add-line mr-2"></i>
                Add User
              </button>
            </div>
            <DataTable
              title="Users"
              data={data.users}
              columns={[
                { key: 'name', header: 'Name' },
                { key: 'email', header: 'Email' },
                { key: 'role', header: 'Role' },
                { 
                  key: 'status', 
                  header: 'Status',
                  render: (value: string) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {value}
                    </span>
                  )
                }
              ]}
            />

            {/* Contact Get in Touch Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Get in Touch Section</h3>
                <button
                  onClick={() => {
                    setEditingItem('contact-get-in-touch');
                    const getInTouchData = (data as any).contactGetInTouch || {};
                    const formDataToSet = {
                      title: getInTouchData.title || '',
                      description: getInTouchData.description || '',
                      locationTitle: getInTouchData.location?.title || '',
                      locationAddress: getInTouchData.location?.address || '',
                      locationIcon: getInTouchData.location?.icon || '',
                      locationColor: getInTouchData.location?.color || '',
                      phoneTitle: getInTouchData.phone?.title || '',
                      phoneNumber: getInTouchData.phone?.number || '',
                      phoneHours: getInTouchData.phone?.hours || '',
                      phoneIcon: getInTouchData.phone?.icon || '',
                      phoneColor: getInTouchData.phone?.color || '',
                      emailTitle: getInTouchData.email?.title || '',
                      emailAddress: getInTouchData.email?.address || '',
                      emailResponseTime: getInTouchData.email?.responseTime || '',
                      emailIcon: getInTouchData.email?.icon || '',
                      emailColor: getInTouchData.email?.color || '',
                      businessHoursTitle: getInTouchData.businessHours?.title || '',
                      businessHoursMondayFriday: getInTouchData.businessHours?.mondayFriday || '',
                      businessHoursSaturday: getInTouchData.businessHours?.saturday || '',
                      businessHoursSunday: getInTouchData.businessHours?.sunday || '',
                      isActive: getInTouchData.isActive ?? true
                    };
                    setFormData(formDataToSet);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <i className="ri-edit-line mr-2"></i>
                  Edit Get in Touch Section
                </button>
              </div>

              {/* Preview Section */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Preview</h4>
                </div>
                
                {/* Get in Touch Preview */}
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                        {(data as any).contactGetInTouch?.title || 'Get in Touch'}
                      </h4>
                      <p className="text-lg text-gray-600 leading-relaxed font-montserrat">
                        {(data as any).contactGetInTouch?.description || 'Description not set'}
                      </p>
                    </div>

                    {/* Contact Details Preview */}
                    <div className="space-y-6">
                      {/* Location */}
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          (data as any).contactGetInTouch?.location?.color === 'refex-blue' ? 'bg-blue-600' :
                          (data as any).contactGetInTouch?.location?.color === 'refex-green' ? 'bg-green-600' :
                          'bg-orange-600'
                        }`}>
                          <i className={`${(data as any).contactGetInTouch?.location?.icon || 'ri-map-pin-line'} text-white text-xl`}></i>
                        </div>
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                            {(data as any).contactGetInTouch?.location?.title || 'Our Location'}
                          </h5>
                          <p className="text-gray-600 font-montserrat" dangerouslySetInnerHTML={{
                            __html: (data as any).contactGetInTouch?.location?.address || 'Address not set'
                          }}></p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          (data as any).contactGetInTouch?.phone?.color === 'refex-blue' ? 'bg-blue-600' :
                          (data as any).contactGetInTouch?.phone?.color === 'refex-green' ? 'bg-green-600' :
                          'bg-orange-600'
                        }`}>
                          <i className={`${(data as any).contactGetInTouch?.phone?.icon || 'ri-phone-line'} text-white text-xl`}></i>
                        </div>
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                            {(data as any).contactGetInTouch?.phone?.title || 'Phone'}
                          </h5>
                          <p className="text-gray-600 font-montserrat">
                            {(data as any).contactGetInTouch?.phone?.number || 'Phone number not set'}
                          </p>
                          <p className="text-sm text-gray-500 font-montserrat">
                            {(data as any).contactGetInTouch?.phone?.hours || 'Hours not set'}
                          </p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          (data as any).contactGetInTouch?.email?.color === 'refex-blue' ? 'bg-blue-600' :
                          (data as any).contactGetInTouch?.email?.color === 'refex-green' ? 'bg-green-600' :
                          'bg-orange-600'
                        }`}>
                          <i className={`${(data as any).contactGetInTouch?.email?.icon || 'ri-mail-line'} text-white text-xl`}></i>
                        </div>
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 mb-2 font-montserrat">
                            {(data as any).contactGetInTouch?.email?.title || 'Email'}
                          </h5>
                          <p className="text-gray-600 font-montserrat">
                            {(data as any).contactGetInTouch?.email?.address || 'Email address not set'}
                          </p>
                          <p className="text-sm text-gray-500 font-montserrat">
                            {(data as any).contactGetInTouch?.email?.responseTime || 'Response time not set'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Business Hours Preview */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h5 className="text-lg font-semibold text-gray-900 mb-4 font-montserrat">
                        {(data as any).contactGetInTouch?.businessHours?.title || 'Business Hours'}
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-montserrat">Monday - Friday</span>
                          <span className="text-gray-900 font-semibold font-montserrat">
                            {(data as any).contactGetInTouch?.businessHours?.mondayFriday || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-montserrat">Saturday</span>
                          <span className="text-gray-900 font-semibold font-montserrat">
                            {(data as any).contactGetInTouch?.businessHours?.saturday || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-montserrat">Sunday</span>
                          <span className="text-gray-900 font-semibold font-montserrat">
                            {(data as any).contactGetInTouch?.businessHours?.sunday || 'Not set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Users Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Contact Users</h3>
                <button
                  onClick={() => {
                    setModalType('add');
                    setEditingItem('contact-user');
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      department: '',
                      position: '',
                      avatar: '',
                      isActive: true,
                      order: (data as any).contactUsers?.length || 0
                    });
                    setShowModal(true);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Add User
                </button>
              </div>

              {/* Users Preview */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Users Preview</h4>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {((data as any).contactUsers || [])
                      .filter((user: any) => user.isActive)
                      .sort((a: any, b: any) => a.order - b.order)
                      .map((user: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-3">
                          <img 
                            src={user.avatar || 'https://via.placeholder.com/50x50?text=User'} 
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/50x50?text=User';
                            }}
                          />
                          <div>
                            <h5 className="font-semibold text-gray-800 text-sm">{user.name}</h5>
                            <p className="text-xs text-gray-600">{user.position}</p>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p><span className="font-medium">Department:</span> {user.department}</p>
                          <p><span className="font-medium">Email:</span> {user.email}</p>
                          <p><span className="font-medium">Phone:</span> {user.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Users Data Table */}
              <DataTable
                title="Contact Users"
                data={(data as any).contactUsers || []}
                columns={[
                  {
                    key: 'avatar',
                    header: 'Avatar',
                    render: (value: string, item: any) => (
                      <img 
                        src={value || 'https://via.placeholder.com/40x40?text=User'} 
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/40x40?text=User';
                        }}
                      />
                    )
                  },
                  { key: 'name', header: 'Name' },
                  { key: 'email', header: 'Email' },
                  { key: 'phone', header: 'Phone' },
                  { key: 'department', header: 'Department' },
                  { key: 'position', header: 'Position' },
                  { key: 'order', header: 'Order' },
                  { 
                    key: 'isActive', 
                    header: 'Status',
                    render: (value: boolean) => (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {value ? 'Active' : 'Inactive'}
                      </span>
                    )
                  }
                ]}
                onEdit={(item: any) => {
                  setModalType('edit');
                  setEditingItem('contact-user');
                  setFormData({
                    id: item.id,
                    name: item.name || '',
                    email: item.email || '',
                    phone: item.phone || '',
                    department: item.department || '',
                    position: item.position || '',
                    avatar: item.avatar || '',
                    isActive: item.isActive ?? true,
                    order: item.order || 0
                  });
                  setShowModal(true);
                }}
                onDelete={(item: any) => {
                  const updatedUsers = ((data as any).contactUsers || []).filter((u: any) => u.id !== item.id);
                  updateData('contactUsers' as any, updatedUsers);
                }}
              />
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={data.settings.siteName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="UTC">UTC</option>
                    <option value="EST">EST</option>
                    <option value="PST">PST</option>
                  </select>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Hero Form - Available from any tab */}
      {editingItem === 'contact-hero' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Edit Contact Hero Section</h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (optional)</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Main description text"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadImage(file);
                        if (url) handleInputChange('backgroundImage', url);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.backgroundImage && (
                    <div className="mt-2">
                      <img src={formData.backgroundImage} alt="Preview" className="w-32 h-20 object-cover rounded" />
                      <p className="text-xs text-gray-500 mt-1">Current: {formData.backgroundImage}</p>
                    </div>
                  )}
                  {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setFormData({});
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Contact Get in Touch Form - Available from any tab */}
      {editingItem === 'contact-get-in-touch' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Edit Get in Touch Section</h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Section */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Main Content</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.locationTitle || ''}
                        onChange={(e) => handleInputChange('locationTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <input
                        type="text"
                        value={formData.locationIcon || ''}
                        onChange={(e) => handleInputChange('locationIcon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ri-map-pin-line"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <select
                        value={formData.locationColor || ''}
                        onChange={(e) => handleInputChange('locationColor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="refex-blue">Refex Blue</option>
                        <option value="refex-green">Refex Green</option>
                        <option value="refex-orange">Refex Orange</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address (HTML allowed)</label>
                      <textarea
                        value={formData.locationAddress || ''}
                        onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Refex Building, 67, Bazullah Road&lt;br /&gt;Parthasarathy Puram, T Nagar&lt;br /&gt;Chennai, 600017"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Phone Section */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Phone</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.phoneTitle || ''}
                        onChange={(e) => handleInputChange('phoneTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={formData.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <input
                        type="text"
                        value={formData.phoneIcon || ''}
                        onChange={(e) => handleInputChange('phoneIcon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ri-phone-line"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <select
                        value={formData.phoneColor || ''}
                        onChange={(e) => handleInputChange('phoneColor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="refex-blue">Refex Blue</option>
                        <option value="refex-green">Refex Green</option>
                        <option value="refex-orange">Refex Orange</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                      <input
                        type="text"
                        value={formData.phoneHours || ''}
                        onChange={(e) => handleInputChange('phoneHours', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Monday - Friday, 9:00 AM - 6:00 PM IST"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Section */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Email</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.emailTitle || ''}
                        onChange={(e) => handleInputChange('emailTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.emailAddress || ''}
                        onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                      <input
                        type="text"
                        value={formData.emailIcon || ''}
                        onChange={(e) => handleInputChange('emailIcon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ri-mail-line"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <select
                        value={formData.emailColor || ''}
                        onChange={(e) => handleInputChange('emailColor', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="refex-blue">Refex Blue</option>
                        <option value="refex-green">Refex Green</option>
                        <option value="refex-orange">Refex Orange</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                      <input
                        type="text"
                        value={formData.emailResponseTime || ''}
                        onChange={(e) => handleInputChange('emailResponseTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="We'll respond within 24 hours"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Business Hours Section */}
                <div className="border-b border-gray-200 pb-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Business Hours</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.businessHoursTitle || ''}
                        onChange={(e) => handleInputChange('businessHoursTitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monday - Friday</label>
                      <input
                        type="text"
                        value={formData.businessHoursMondayFriday || ''}
                        onChange={(e) => handleInputChange('businessHoursMondayFriday', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="9:00 AM - 6:00 PM"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Saturday</label>
                      <input
                        type="text"
                        value={formData.businessHoursSaturday || ''}
                        onChange={(e) => handleInputChange('businessHoursSaturday', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10:00 AM - 4:00 PM"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sunday</label>
                      <input
                        type="text"
                        value={formData.businessHoursSunday || ''}
                        onChange={(e) => handleInputChange('businessHoursSunday', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Closed"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setFormData({});
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {modalType === 'add' ? 'Add New' : 'Edit'} {
                    activeTab === 'home-page'
                      ? activeHomeSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      : activeTab === 'about-page'
                        ? activeAboutSection.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                        : 'Capabilities'
                  }
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Home Page Forms (scoped) */}
                {activeTab === 'home-page' && (
                  <>
                {/* Hero Slides Form */}
                {activeHomeSection === 'hero-slides' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImage(file);
                            if (url) handleInputChange('image', url);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                          <p className="text-xs text-gray-500 mt-1">Current: {formData.image}</p>
                        </div>
                      )}
                      {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                    </div>
                    {/* Description field intentionally removed as requested */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <input
                        type="number"
                        value={formData.order || ''}
                        onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive || false}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                    </div>
                  </>
                )}

                {/* Offerings Form */}
                {activeHomeSection === 'offerings' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
                        <input
                          type="text"
                          value={formData.metric || ''}
                          onChange={(e) => handleInputChange('metric', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                        <input
                          type="text"
                          value={formData.unit || ''}
                          onChange={(e) => handleInputChange('unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                      <select
                        value={formData.color || 'refex-blue'}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="refex-blue">Refex Blue (#2879b6)</option>
                        <option value="refex-green">Refex Green (#7dc244)</option>
                        <option value="refex-orange">Refex Orange (#ee6a31)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <input
                        type="number"
                        value={formData.order || ''}
                        onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive || false}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                    </div>
                  </>
                )}

                {/* Statistics Form */}
                {activeHomeSection === 'statistics' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                      <input
                        type="number"
                        value={formData.value || ''}
                        onChange={(e) => handleInputChange('value', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImage(file);
                            if (url) handleInputChange('image', url);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                          <p className="text-xs text-gray-500 mt-1">Current: {formData.image}</p>
                        </div>
                      )}
                      {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                      <select
                        value={formData.color || 'refex-blue'}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="refex-blue">Refex Blue (#2879b6)</option>
                        <option value="refex-green">Refex Green (#7dc244)</option>
                        <option value="refex-orange">Refex Orange (#ee6a31)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <input
                        type="number"
                        value={formData.order || ''}
                        onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive || false}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                    </div>
                  </>
                )}

                {/* Regulatory Form */}
                {activeHomeSection === 'regulatory' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImage(file);
                            if (url) handleInputChange('image', url);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                          <p className="text-xs text-gray-500 mt-1">Current: {formData.image}</p>
                        </div>
                      )}
                      {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link URL (optional)</label>
                      <input
                        type="url"
                        value={formData.link || ''}
                        onChange={(e) => handleInputChange('link', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://regulator.example"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <input
                        type="color"
                        value={formData.color || '#2879b6'}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <input
                        type="number"
                        value={formData.order || ''}
                        onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive || false}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                    </div>
                  </>
                )}
                  </>
                )}

                {/* About Page Forms */}
                {activeTab === 'about-page' && (
                  <>
                    {/* Vision & Mission Form */}
                    {activeAboutSection === 'vision-mission' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vision Title</label>
                          <input
                            type="text"
                            value={formData.visionTitle || ''}
                            onChange={(e) => handleInputChange('visionTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vision Description</label>
                          <textarea
                            value={formData.visionDescription || ''}
                            onChange={(e) => handleInputChange('visionDescription', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Vision Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadImage(file);
                                if (url) handleInputChange('visionImage', url);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {formData.visionImage && (
                            <div className="mt-2">
                              <img src={formData.visionImage} alt="Preview" className="w-32 h-20 object-cover rounded" />
                              <p className="text-xs text-gray-500 mt-1">Current: {formData.visionImage}</p>
                            </div>
                          )}
                          {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mission Title</label>
                          <input
                            type="text"
                            value={formData.missionTitle || ''}
                            onChange={(e) => handleInputChange('missionTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mission Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadImage(file);
                                if (url) handleInputChange('missionImage', url);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {formData.missionImage && (
                            <div className="mt-2">
                              <img src={formData.missionImage} alt="Preview" className="w-32 h-20 object-cover rounded" />
                              <p className="text-xs text-gray-500 mt-1">Current: {formData.missionImage}</p>
                            </div>
                          )}
                          {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mission Points (JSON)</label>
                          <textarea
                            value={formData.missionPointsRaw ?? JSON.stringify(formData.missionPoints || [], null, 2)}
                            onChange={(e) => handleInputChange('missionPointsRaw', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
                            rows={6}
                          />
                        </div>
                      </>
                    )}
                    {/* About Journey Form */}
                    {activeAboutSection === 'about-journey-image' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Journey Title</label>
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Journey Summary</label>
                          <textarea
                            value={formData.summary || ''}
                            onChange={(e) => handleInputChange('summary', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Journey Images (Carousel)</label>
                          <div className="space-y-4">
                            {/* Multiple Image Upload */}
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-2">Add New Images</label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                  const files = Array.from(e.target.files || []);
                                  if (files.length > 0) {
                                    const newImages = [...(formData.images || [])];
                                    // Store actual File objects instead of uploading immediately
                                    for (const file of files) {
                                      // Create a preview URL for display
                                      const previewUrl = URL.createObjectURL(file);
                                      // Store both the file and preview URL
                                      newImages.push({
                                        file: file,
                                        preview: previewUrl,
                                        name: file.name,
                                        isNew: true
                                      });
                                    }
                                    handleInputChange('images', newImages);
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <p className="text-xs text-gray-500 mt-1">You can select multiple images at once</p>
                            </div>

                            {/* Current Images Display */}
                            {formData.images && formData.images.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                  Current Images ({formData.images.length})
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {formData.images.map((imageItem: any, index: number) => {
                                    const imageUrl = typeof imageItem === 'string' ? imageItem : imageItem.preview || imageItem.url;
                                    return (
                                      <div key={index} className="relative group">
                                        <img 
                                          src={imageUrl} 
                                          alt={`Journey ${index + 1}`} 
                                          className="w-full h-24 object-cover rounded-lg border border-gray-200" 
                                        />
                                        <button
                                          onClick={() => {
                                            const newImages = formData.images.filter((_: any, i: number) => i !== index);
                                            handleInputChange('images', newImages);
                                          }}
                                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                          title="Remove image"
                                        >
                                          ×
                                        </button>
                                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                                          {index + 1}
                                        </div>
                                        {imageItem.isNew && (
                                          <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                                            NEW
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Legacy Single Image Support */}
                            <div className="border-t pt-4">
                              <label className="block text-sm font-medium text-gray-600 mb-2">Legacy Single Image (for backward compatibility)</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = await uploadImage(file);
                                    if (url) handleInputChange('image', url);
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {formData.image && (
                                <div className="mt-2">
                                  <img src={formData.image} alt="Legacy Preview" className="w-32 h-20 object-cover rounded" />
                                  <p className="text-xs text-gray-500 mt-1">Legacy: {formData.image}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive ?? true}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">Active</label>
                        </div>
                      </>
                    )}
                    {/* About Hero Form */}
                    {activeAboutSection === 'about-hero' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                          <input
                            type="text"
                            value={formData.subtitle || ''}
                            onChange={(e) => handleInputChange('subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadImage(file);
                                if (url) handleInputChange('backgroundImage', url);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {formData.backgroundImage && (
                            <div className="mt-2">
                              <img src={formData.backgroundImage} alt="Preview" className="w-32 h-20 object-cover rounded" />
                              <p className="text-xs text-gray-500 mt-1">Current: {formData.backgroundImage}</p>
                            </div>
                          )}
                          {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive ?? true}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
                        </div>

                        {/* Logo Cards */}
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Company Logo Cards</label>
                            <button
                              type="button"
                              onClick={() => {
                                const next = [ ...(formData.logoCards || []), { name: '', logoUrl: '', link: '' } ];
                                handleInputChange('logoCards', next);
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                            >
                              <i className="ri-add-line mr-1"></i>
                              Add Logo Card
                            </button>
                          </div>
                          <div className="space-y-3">
                            {(formData.logoCards || []).map((card: any, idx: number) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border p-3 rounded">
                                <div className="md:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                                  <input
                                    type="text"
                                    value={card.name || ''}
                                    onChange={(e) => {
                                      const next = [ ...(formData.logoCards || []) ];
                                      next[idx] = { ...next[idx], name: e.target.value };
                                      handleInputChange('logoCards', next);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <div className="md:col-span-5">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Logo URL</label>
                                  <input
                                    type="url"
                                    value={card.logoUrl || ''}
                                    onChange={(e) => {
                                      const next = [ ...(formData.logoCards || []) ];
                                      next[idx] = { ...next[idx], logoUrl: e.target.value };
                                      handleInputChange('logoCards', next);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <div className="md:col-span-3">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Link (optional)</label>
                                  <input
                                    type="url"
                                    value={card.link || ''}
                                    onChange={(e) => {
                                      const next = [ ...(formData.logoCards || []) ];
                                      next[idx] = { ...next[idx], link: e.target.value };
                                      handleInputChange('logoCards', next);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <div className="md:col-span-1 flex md:justify-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const next = (formData.logoCards || []).filter((_: any, i: number) => i !== idx);
                                      handleInputChange('logoCards', next);
                                    }}
                                    className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                                    title="Remove"
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {/* About Sections Form */}
                    {activeAboutSection === 'about-sections' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                          <textarea
                            value={formData.content || ''}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                          <input
                            type="text"
                            value={formData.icon || ''}
                            onChange={(e) => handleInputChange('icon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ri-heart-line"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                          <input
                            type="color"
                            value={formData.color || '#2879b6'}
                            onChange={(e) => handleInputChange('color', e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                          <input
                            type="number"
                            value={formData.order || ''}
                            onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive || false}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                            Active
                          </label>
                        </div>
                      </>
                    )}

                    {/* Leadership Form (Advisory Board, Technical Leadership Team and Management Team use same form) */}
                    {(activeAboutSection === 'leadership' || activeAboutSection === 'advisory-board' || activeAboutSection === 'technical-leadership' || activeAboutSection === 'management-team') && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                          <input
                            type="text"
                            value={formData.position || ''}
                            onChange={(e) => handleInputChange('position', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            required
                          />
                        </div>
                        {(activeAboutSection === 'leadership' || activeAboutSection === 'technical-leadership') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                              value={formData.category || 'Technical Leadership Team'}
                              onChange={(e) => handleInputChange('category', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="Advisory Board">Advisory Board</option>
                              <option value="Technical Leadership Team">Technical Leadership Team</option>
                              <option value="Management Team">Management Team</option>
                            </select>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Achievements</label>
                          <div className="space-y-2">
                            {(formData.achievements || []).map((achievement: string, index: number) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={achievement}
                                  onChange={(e) => {
                                    const newAchievements = [...(formData.achievements || [])];
                                    newAchievements[index] = e.target.value;
                                    handleInputChange('achievements', newAchievements);
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder={`Achievement ${index + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newAchievements = (formData.achievements || []).filter((_: any, i: number) => i !== index);
                                    handleInputChange('achievements', newAchievements);
                                  }}
                                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const newAchievements = [...(formData.achievements || []), ''];
                                handleInputChange('achievements', newAchievements);
                              }}
                              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 rounded-lg transition-colors flex items-center justify-center"
                            >
                              <i className="ri-add-line mr-2"></i>
                              Add Achievement
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                            <input
                              type="text"
                              value={formData.experience || ''}
                              onChange={(e) => handleInputChange('experience', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                            <input
                              type="text"
                              value={formData.education || ''}
                              onChange={(e) => handleInputChange('education', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                            <select
                              value={formData.color || 'refex-blue'}
                              onChange={(e) => handleInputChange('color', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="refex-blue">Refex Blue (#2879b6)</option>
                              <option value="refex-green">Refex Green (#7dc244)</option>
                              <option value="refex-orange">Refex Orange (#ee6a31)</option>
                            </select>
                            <div className="mt-2 flex space-x-2">
                              <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 rounded-full bg-[#2879b6]"></div>
                                <span className="text-xs text-gray-600">Blue</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 rounded-full bg-[#7dc244]"></div>
                                <span className="text-xs text-gray-600">Green</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <div className="w-4 h-4 rounded-full bg-[#ee6a31]"></div>
                                <span className="text-xs text-gray-600">Orange</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                          
                          {/* Image Preview */}
                          {(imagePreview || formData.image) && (
                            <div className="mb-4">
                              <img
                                src={imagePreview || formData.image}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                              />
                            </div>
                          )}
                          
                          {/* Upload Option */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Max size: 1MB. Supported formats: JPG, PNG, GIF. Use external URLs for larger images.</p>
                          </div>
                          
                          {/* URL Option */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Image URL</label>
                            <input
                              type="text"
                              value={formData.image || ''}
                              onChange={(e) => {
                                handleInputChange('image', e.target.value);
                                setImagePreview(null);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://example.com/image.jpg or upload file above"
                            />
                          </div>
                        </div>
                       
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                          <input
                            type="number"
                            value={formData.order || ''}
                            onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive || false}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                            Active
                          </label>
                        </div>
                      </>
                    )}

                    {/* Values Form */}
                    {activeAboutSection === 'values' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                          <input
                            type="text"
                            value={formData.icon || ''}
                            onChange={(e) => handleInputChange('icon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="ri-heart-line"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                          <input
                            type="color"
                            value={formData.color || '#2879b6'}
                            onChange={(e) => handleInputChange('color', e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                          <input
                            type="number"
                            value={formData.order || ''}
                            onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive || false}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                            Active
                          </label>
                        </div>
                      </>
                    )}

                    {/* Journey Form */}
                    {activeAboutSection === 'journey' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                          <input
                            type="text"
                            value={formData.year || ''}
                            onChange={(e) => handleInputChange('year', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="2022-2023"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadImage(file);
                                if (url) handleInputChange('image', url);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {formData.image && (
                            <div className="mt-2">
                              <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                              <p className="text-xs text-gray-500 mt-1">Current: {formData.image}</p>
                            </div>
                          )}
                          {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                          <input
                            type="color"
                            value={formData.color || '#2879b6'}
                            onChange={(e) => handleInputChange('color', e.target.value)}
                            className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                          <input
                            type="number"
                            value={formData.order || ''}
                            onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive || false}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                            Active
                          </label>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Capabilities Form */}
                {activeTab === 'capabilities' && (
                  <>
                    {/* Capabilities Hero Form */}
                    {editingItem === 'capabilities-hero' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (optional)</label>
                          <input
                            type="text"
                            value={formData.subtitle || ''}
                            onChange={(e) => handleInputChange('subtitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="Main description text"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sub Description (optional)</label>
                          <textarea
                            value={formData.subDescription || ''}
                            onChange={(e) => handleInputChange('subDescription', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                            placeholder="Additional description text"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await uploadImage(file);
                                if (url) handleInputChange('backgroundImage', url);
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {formData.backgroundImage && (
                            <div className="mt-2">
                              <img src={formData.backgroundImage} alt="Preview" className="w-32 h-20 object-cover rounded" />
                              <p className="text-xs text-gray-500 mt-1">Current: {formData.backgroundImage}</p>
                            </div>
                          )}
                          {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                        </div>
                      </>
                    )}
                       {editingItem === 'capabilities-research' && (
                      <>
                        {/* Main Section */}
                        <div className="border-b border-gray-200 pb-6 mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Main Section</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                              <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <textarea
                                value={formData.description || ''}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const url = await uploadImage(file);
                                    if (url) handleInputChange('image', url);
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {formData.image && (
                                <div className="mt-2">
                                  <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                                  <p className="text-xs text-gray-500 mt-1">Current: {formData.image}</p>
                                </div>
                              )}
                              {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                            </div>
                          </div>
                        </div>

                        {/* API Card */}
                        <div className="border-b border-gray-200 pb-6 mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">API R&D Card</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Card Title</label>
                              <input
                                type="text"
                                value={formData.apiCard?.title || ''}
                                onChange={(e) => {
                                  console.log('API Card Title Change:', e.target.value);
                                  handleInputChange('apiCard', { ...formData.apiCard, title: e.target.value });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">Current value: "{formData.apiCard?.title || 'empty'}"</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                              <input
                                type="text"
                                value={formData.apiCard?.subtitle || ''}
                                onChange={(e) => {
                                  console.log('API Card Subtitle Change:', e.target.value);
                                  handleInputChange('apiCard', { ...formData.apiCard, subtitle: e.target.value });
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                              <p className="text-xs text-gray-500 mt-1">Current value: "{formData.apiCard?.subtitle || 'empty'}"</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Remix Icon class)</label>
                              <input
                                type="text"
                                value={formData.apiCard?.icon || ''}
                                onChange={(e) => handleInputChange('apiCard', { ...formData.apiCard, icon: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., ri-flask-line"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Color (Hex)</label>
                              <input
                                type="text"
                                value={formData.apiCard?.color || ''}
                                onChange={(e) => handleInputChange('apiCard', { ...formData.apiCard, color: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="#2879b6"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                              <div className="space-y-3">
                                {(formData.apiCard?.points || []).map((point: any, index: number) => (
                                  <div key={index} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                      <input
                                        type="text"
                                        value={point.title || ''}
                                        onChange={(e) => {
                                          const newPoints = [...(formData.apiCard?.points || [])];
                                          newPoints[index] = { ...newPoints[index], title: e.target.value };
                                          handleInputChange('apiCard', { ...formData.apiCard, points: newPoints });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Point title"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <input
                                        type="text"
                                        value={point.description || ''}
                                        onChange={(e) => {
                                          const newPoints = [...(formData.apiCard?.points || [])];
                                          newPoints[index] = { ...newPoints[index], description: e.target.value };
                                          handleInputChange('apiCard', { ...formData.apiCard, points: newPoints });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Point description"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newPoints = (formData.apiCard?.points || []).filter((_: any, i: number) => i !== index);
                                        handleInputChange('apiCard', { ...formData.apiCard, points: newPoints });
                                      }}
                                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPoints = [...(formData.apiCard?.points || []), { title: '', description: '' }];
                                    handleInputChange('apiCard', { ...formData.apiCard, points: newPoints });
                                  }}
                                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                                >
                                  <i className="ri-add-line mr-2"></i>
                                  Add Point
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* FDF Card */}
                        <div className="border-b border-gray-200 pb-6 mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">FDF R&D Card</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Card Title</label>
                              <input
                                type="text"
                                value={formData.fdfCard?.title || ''}
                                onChange={(e) => handleInputChange('fdfCard', { ...formData.fdfCard, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                              <input
                                type="text"
                                value={formData.fdfCard?.subtitle || ''}
                                onChange={(e) => handleInputChange('fdfCard', { ...formData.fdfCard, subtitle: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Remix Icon class)</label>
                              <input
                                type="text"
                                value={formData.fdfCard?.icon || ''}
                                onChange={(e) => handleInputChange('fdfCard', { ...formData.fdfCard, icon: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., ri-capsule-line"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Color (Hex)</label>
                              <input
                                type="text"
                                value={formData.fdfCard?.color || ''}
                                onChange={(e) => handleInputChange('fdfCard', { ...formData.fdfCard, color: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="#7dc244"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                              <div className="space-y-3">
                                {(formData.fdfCard?.points || []).map((point: any, index: number) => (
                                  <div key={index} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                      <input
                                        type="text"
                                        value={point.title || ''}
                                        onChange={(e) => {
                                          const newPoints = [...(formData.fdfCard?.points || [])];
                                          newPoints[index] = { ...newPoints[index], title: e.target.value };
                                          handleInputChange('fdfCard', { ...formData.fdfCard, points: newPoints });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Point title"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <input
                                        type="text"
                                        value={point.description || ''}
                                        onChange={(e) => {
                                          const newPoints = [...(formData.fdfCard?.points || [])];
                                          newPoints[index] = { ...newPoints[index], description: e.target.value };
                                          handleInputChange('fdfCard', { ...formData.fdfCard, points: newPoints });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Point description"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newPoints = (formData.fdfCard?.points || []).filter((_: any, i: number) => i !== index);
                                        handleInputChange('fdfCard', { ...formData.fdfCard, points: newPoints });
                                      }}
                                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                                    >
                                      <i className="ri-delete-bin-line"></i>
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newPoints = [...(formData.fdfCard?.points || []), { title: '', description: '' }];
                                    handleInputChange('fdfCard', { ...formData.fdfCard, points: newPoints });
                                  }}
                                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                                >
                                  <i className="ri-add-line mr-2"></i>
                                  Add Point
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Promise Section */}
                        <div className="pb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">R&D Promise Section</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Promise Title</label>
                              <input
                                type="text"
                                value={formData.promise?.title || ''}
                                onChange={(e) => handleInputChange('promise', { ...formData.promise, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Promise Description</label>
                              <textarea
                                value={formData.promise?.description || ''}
                                onChange={(e) => handleInputChange('promise', { ...formData.promise, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Remix Icon class)</label>
                              <input
                                type="text"
                                value={formData.promise?.icon || ''}
                                onChange={(e) => handleInputChange('promise', { ...formData.promise, icon: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., ri-lightbulb-line"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive ?? true}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">Active</label>
                        </div>
                      </>
                    )}

                    {/* Generic Form Fields - Only show for facilities */}
                    {editingItem && !['capabilities-hero', 'capabilities-research'].includes(editingItem) && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                          value={formData.type || 'API Manufacturing'}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option>API Manufacturing</option>
                          <option>Oncology & Specialty Intermediates</option>
                          <option>Formulations & Complex Generics</option>
                          <option>Packaging & Customization</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Established</label>
                        <input
                          type="text"
                          value={formData.established || ''}
                          onChange={(e) => handleInputChange('established', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                        <input
                          type="text"
                          value={formData.capacity || ''}
                          onChange={(e) => handleInputChange('capacity', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImage(file);
                            if (url) handleInputChange('image', url);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <img src={formData.image} alt="Preview" className="w-32 h-20 object-cover rounded" />
                          <p className="text-xs text-gray-500 mt-1">Current: {formData.image}</p>
                        </div>
                      )}
                      {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Capabilities</label>
                      <div className="space-y-2">
                        {(Array.isArray(formData.capabilities) && formData.capabilities.length > 0 ? formData.capabilities : ['']).map((cap: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={cap}
                              onChange={(e) => setFormData((prev: any) => {
                                const next = Array.isArray(prev.capabilities) ? [...prev.capabilities] : [];
                                next[idx] = e.target.value;
                                return { ...prev, capabilities: next };
                              })}
                              placeholder="e.g., High-vacuum distillation"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData((prev: any) => {
                                const next = (Array.isArray(prev.capabilities) ? [...prev.capabilities] : []);
                                next.splice(idx, 1);
                                return { ...prev, capabilities: next.length ? next : [''] };
                              })}
                              className="px-2 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                              title="Remove"
                            >
                              <i className="ri-delete-bin-6-line"></i>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData((prev: any) => ({ ...prev, capabilities: [...(prev.capabilities || []), ''] }))}
                          className="mt-1 inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
                        >
                          <i className="ri-add-line mr-1"></i>
                          Add Capability
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Approval Logos (URLs)</label>
                      <div className="space-y-2">
                        {(Array.isArray(formData.approvals) && formData.approvals.length > 0 ? formData.approvals : ['']).map((url: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={url}
                              onChange={(e) => setFormData((prev: any) => {
                                const next = Array.isArray(prev.approvals) ? [...prev.approvals] : [];
                                next[idx] = e.target.value;
                                return { ...prev, approvals: next };
                              })}
                              placeholder="https://example.com/logo.png"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData((prev: any) => {
                                const next = (Array.isArray(prev.approvals) ? [...prev.approvals] : []);
                                next.splice(idx, 1);
                                return { ...prev, approvals: next.length ? next : [''] };
                              })}
                              className="px-2 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                              title="Remove"
                            >
                              <i className="ri-delete-bin-6-line"></i>
                            </button>
                          
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setFormData((prev: any) => ({ ...prev, approvals: [...(prev.approvals || []), ''] }))}
                          className="mt-1 inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
                        >
                          <i className="ri-add-line mr-1"></i>
                          Add Logo
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <select
                          value={formData.color || 'refex-blue'}
                          onChange={(e) => handleInputChange('color', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="refex-blue">refex-blue</option>
                          <option value="refex-green">refex-green</option>
                          <option value="refex-orange">refex-orange</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                        <input
                          type="number"
                          value={formData.order || 1}
                          onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="flex items-center mt-7">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive ?? true}
                          onChange={(e) => handleInputChange('isActive', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">Active</label>
                      </div>
                    </div>
                  </>
                )}

                {/* Contact Hero Form */}
                {editingItem === 'contact-hero' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (optional)</label>
                      <input
                        type="text"
                        value={formData.subtitle || ''}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Main description text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadImage(file);
                            if (url) handleInputChange('backgroundImage', url);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.backgroundImage && (
                        <div className="mt-2">
                          <img src={formData.backgroundImage} alt="Preview" className="w-32 h-20 object-cover rounded" />
                          <p className="text-xs text-gray-500 mt-1">Current: {formData.backgroundImage}</p>
                        </div>
                      )}
                      {uploadingImage && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                    </div>
                  </>
                )}

                {/* Contact User Form */}
                {editingItem === 'contact-user' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                      <input
                        type="text"
                        value={formData.department || ''}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        value={formData.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                      <input
                        type="url"
                        value={formData.avatar || ''}
                        onChange={(e) => handleInputChange('avatar', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                      <input
                        type="number"
                        value={formData.order || 0}
                        onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive || false}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </>
                )}

                {/* Home Global Impact Form */}
                {editingItem === 'home-global-impact' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Section description text"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive || false}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </>
                )}
                 
                  </>
                )}

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setImagePreview(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {modalType === 'add' ? 'Add' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* About Mission Points Modal */}
      {aboutMpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{aboutMpMode === 'add' ? 'Add Mission Point' : 'Edit Mission Point'}</h3>
              <button onClick={closeAboutMpModal} className="text-gray-500 hover:text-gray-700">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={aboutMpForm.title}
                  onChange={(e) => setAboutMpForm({ ...aboutMpForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter mission point title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={aboutMpForm.description}
                  onChange={(e) => setAboutMpForm({ ...aboutMpForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter mission point description"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                  <input
                    type="number"
                    value={aboutMpForm.order}
                    onChange={(e) => setAboutMpForm({ ...aboutMpForm, order: Number(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={aboutMpForm.isActive}
                      onChange={(e) => setAboutMpForm({ ...aboutMpForm, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeAboutMpModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveAboutMpModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {aboutMpMode === 'add' ? 'Add' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
