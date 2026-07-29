

import { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [selectedLeaderId, setSelectedLeaderId] = useState<number | null>(null);
  const [pendingTargetTab, setPendingTargetTab] = useState<string | null>(null);
  const { data } = useAdminAuth();
  const [currentJourneyHeading, setCurrentJourneyHeading] = useState('');
  
  // Helper function to convert relative image paths to full URLs
  const getImageUrl = (imagePath: string | undefined | null): string => {
    if (!imagePath) return User;
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
          // Handle different response structures
          const apiData = json.data || json;
          setAboutApi(apiData);
        }
      } catch (error) {
        console.error('Error loading about data:', error);
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
    setSelectedLeaderId(null);
  };


   // Helper function to get translated leadership data
  const getTranslatedLeader = useCallback((leader: any) => {
    if (isEnglish) {
      return {
        ...leader,
        image: getImageUrl(leader.image),
        name: leader.name,
        position: leader.position,
        description: leader.description,
        experience: leader.experience,
        education: leader.education
      };
    }
    
    // For non-English: try to get translations, fallback to API data
    const leaderKey = `leader${leader.id}`;
    return {
      ...leader,
      image: getImageUrl(leader.image),
      name: t(`${leaderKey}Name`) || leader.name,
      position: t(`${leaderKey}Position`) || leader.position,
      description: t(`${leaderKey}Description`) || leader.description,
      experience: t(`${leaderKey}Experience`) || leader.experience,
      education: t(`${leaderKey}Education`) || leader.education
    };
  }, [isEnglish, t, i18n.language]);

  // Get leadership data from API with language support and image URL conversion
  const AdvisoryBoard = useMemo(() => {
    // Try multiple possible data structures
    const leadershipData = (aboutApi as any)?.leadership || 
                          (aboutApi as any)?.data?.leadership || 
                          (data as any)?.leadership || 
                          (data as any)?.data?.leadership || 
                          [];
    const apiLeaders = Array.isArray(leadershipData) ? leadershipData.filter((leader: any) => 
      leader && leader.category === 'Advisory Board' && leader.isActive !== false
    ) : [];
    
    return apiLeaders
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .map((leader: any) => getTranslatedLeader(leader));
  }, [aboutApi, data, getTranslatedLeader, i18n.language]);

  const ManagementTeam = useMemo(() => {
    // 1. Determine the current language from i18n or a prop
    const currentLang = i18n.language; 
    
    // --- Define Pre-translated Data (Chinese 'zh' in this case) ---
    // This is the array you provided, stored here or imported from a separate file.
    const zhManagementTeam = [
      {
          "id": 7,
          "name": "阿尼尔·贾殷",
          "position": "主席兼董事总经理 – Refex集团",
          "category": "管理团队",
          "description": "阿尼尔·贾殷是 Refex 集团的董事总经理。他天生具有企业家精神和冒险精神，从小就对商业得心应手。阿尼尔在 17 岁时就开始花时间在他家族的不锈钢贸易业务中。他对发现机遇的热情，在一场与大型空调制造商的会议中，将他引向了制冷剂气体领域。2002年，他奠定了基石，以 Refex Refrigerants Limited（现 Refex Industries Limited）的名义成立了他的第一家制冷剂气体灌装厂。从那时起，他便再也没有回头！阿尼尔稳步地扩展了他的商业视野，Refex 涉足了各种商业领域，如可再生能源、灰烬和煤炭、制药、风险投资、机场运输、医疗技术、绿色出行和电力交易。\r\n\r\n在他的整个职业生涯中，阿尼尔一直是许多企业家的导师。他希望能够指导更多的初创企业，并为他们提供成功所需的资源和平台。他已成功培养了许多这样的企业家。\r\n\r\n阿尼尔坚信可持续发展，并确保 Refex 的商业模式体现了相同的精神。由于所有这些以及更多的成就，阿尼尔赢得了多项行业赞誉，例如《泰晤士报》集团颁发的“泰米尔纳德邦开拓者”、“青年企业家”奖，来自英国的史蒂夫奖，以及邓白氏百强中小企业奖等。Refex 集团在他的领导下，连续两年被 GPTW 认证为“最佳工作场所”。",
          "achievementsJson": "[]",
          "experience": "40+ 年",
          "education": "创业型领导力",
          "image": "/uploads/images/image-1761115782807-909466776.jpg",
          "color": "refex-blue",
          "order": 7,
          "isActive": true,
          "createdAt": "2025-10-08T16:23:33.000Z",
          "updatedAt": "2025-10-24T13:07:36.000Z",
          "achievements": []
      },
      {
          "id": 8,
          "name": "迪内什·阿加瓦尔",
          "position": "集团首席执行官 – Refex集团",
          "category": "管理团队",
          "description": "迪内什·库马尔·阿加瓦尔先生在不同的商业领域拥有精湛的创业技能，为他所有商业事业的持续成功做出了贡献。自 2014 年以来，他的专业知识，结合他发展公司业务的热情和热忱，加速了我们的增长轨迹。\r\n\r\n迪内什先生对数字的敏锐洞察力促进了多家业务的增长，而他在公司财务方面的专业知识（涵盖审计、财务会计和规划、税收和筹资）已帮助他的客户筹集了超过 5,000 亿卢比的资金。他曾与 Aircel 和 Brisk 等知名组织合作，并在太阳能 EPC 分部和公用事业规模的项目中拥有多样化的经验。他还曾担任初创企业、中小企业、成熟企业集团和国际非政府组织的顾问，并因其对管理领域和相关领域的贡献而获得了多项行业认可。",
          "achievementsJson": "[\"拥有 20 年以上经验的特许会计师\",\"以战略洞察力和执行力闻名\",\"塑造了 Refex 向可持续成功发展\",\"财务战略和运营方面的专家\",\"商业转型领域的领导者\"]",
          "experience": "20+ 年",
          "education": "特许会计师",
          "image": "/uploads/images/image-1761115796543-933758637.jpg",
          "color": "refex-green",
          "order": 8,
          "isActive": true,
          "createdAt": "2025-10-08T16:23:33.000Z",
          "updatedAt": "2025-10-24T13:07:44.000Z",
          "achievements": [
              "拥有 20 年以上经验的特许会计师",
              "以战略洞察力和执行力闻名",
              "塑造了 Refex 向可持续成功发展",
              "财务战略和运营方面的专家",
              "商业转型领域的领导者"
          ]
      },
      {
          "id": 9,
          "name": "哈努曼塔·拉奥·卡玛",
          "position": "首席执行官 – RLS",
          "category": "管理团队",
          "description": "哈努曼特·拉奥·卡玛（汉斯）拥有印度本地治里中央大学的国际管理硕士学位。他将对行业趋势和投资组合策略的深刻了解与广泛的专业网络相结合。在担任 Extrovis 瑞士的职位之前，哈努曼塔曾在 Amneal、Ranbaxy 和 Dr. Reddy’s 担任战略采购、投资组合管理和战略业务发展领域的各种管理职位。",
          "achievementsJson": "[]",
          "experience": "23+ 年",
          "education": "国际管理硕士",
          "image": "/uploads/images/image-1761738716293-127419594.jpg",
          "color": "refex-orange",
          "order": 9,
          "isActive": true,
          "createdAt": "2025-10-08T16:23:33.000Z",
          "updatedAt": "2025-10-29T11:52:00.000Z",
          "achievements": []
      },
      {
          "id": 13,
          "name": "PV·拉哈文德拉·拉奥",
          "position": "首席财务官 – RLS",
          "category": "管理团队",
          "description": "拉哈夫是一位卓有成就的特许会计师和金融领导者，拥有大约 25 年的财务管理经验。他的专长涵盖会计、财务规划、预算编制、转让定价、税务、成本核算和资金管理，包括现金流管理、套期保值和从银行获取资金。\r\n\r\n拉哈夫曾在 Sequent Scientific Limited、Macleods Pharmaceuticals Ltd 和 Solara Active Pharma Sciences 担任首席财务官等重要的财务领导职位。他通过在 Dr. Reddy's Laboratories 担任的各种职务获得了丰富的商业金融专业知识。\r\n\r\n拉哈夫对战略制定和实施有着深刻的理解。在他的职业生涯中，拉哈夫作为顾问和咨询师做出了贡献，在财务指导委员会、业务领导委员会和联合指导委员会中扮演了关键角色。",
          "achievementsJson": "[\"拥有 25 年财务管理经验的特许会计师\",\"Sequent、Macleods 和 Solara 的前首席财务官\",\"在 Dr. Reddy's 有 14 年经验\",\"FP&A、税务、财务和战略方面的专家\",\"戈尔德拉特大师级行政证书持有者\"]",
          "experience": "25+ 年",
          "education": "特许会计师, 戈尔德拉特大师级行政证书",
          "image": "/uploads/images/image-1761115929803-567823080.jpg",
          "color": "refex-blue",
          "order": 10,
          "isActive": true,
          "createdAt": "2025-10-08T16:23:33.000Z",
          "updatedAt": "2025-10-25T05:39:02.000Z",
          "achievements": [
              "拥有 25 年财务管理经验的特许会计师",
              "Sequent、Macleods 和 Solara 的前首席财务官",
              "在 Dr. Reddy's 有 14 年经验",
              "FP&A、税务、财务和战略方面的专家",
              "戈尔德拉特大师级行政证书持有者"
          ]
      },
      {
          "id": 14,
          "name": "斯里尼瓦桑·帕加达拉",
          "position": "首席人力资源官 – RLS",
          "category": "管理团队",
          "description": "斯里尼拥有超过 25 年的制药和医疗保健领域人力资源管理经验。他专注于业务人力资源、变革领导力和转型、人才管理以及员工关系。在他的整个职业生涯中，他曾在 Dr. Reddy's、Novartis、GVK Bio 和 Biological E 等顶级制药组织担任过各种高级和负责任的人力资源职位。在担任 Extrovis 的现职之前，斯里尼在 Solara Active Pharma 领导人力资源职能。",
          "achievementsJson": "[\"在制药和医疗保健领域拥有 25 年以上人力资源经验\",\"人才、转型和员工关系专家\",\"曾在 Dr. Reddy's、Novartis、GVK Bio 任职\",\"在 Biological E 和 Solara Active Pharma 拥有经验\",\"组织发展专家\"]",
          "experience": "25+ 年",
          "education": "人力资源与组织发展",
          "image": "/uploads/images/image-1761115945624-842176624.jpg",
          "color": "refex-green",
          "order": 11,
          "isActive": true,
          "createdAt": "2025-10-08T16:23:33.000Z",
          "updatedAt": "2025-10-25T05:39:18.000Z",
          "achievements": [
              "在制药和医疗保健领域拥有 25 年以上人力资源经验",
              "人才、转型和员工关系专家",
              "曾在 Dr. Reddy's、Novartis、GVK Bio 任职",
              "在 Biological E 和 Solara Active Pharma 拥有经验",
              "组织发展专家"
          ]
      },
      {
          "id": 10,
          "name": "沙拉特·纳拉萨普尔",
          "position": "首席执行官 – RLFC",
          "category": "管理团队",
          "description": "沙拉特·纳拉萨普尔是一位经验丰富的领导者，在化工、农化和制药行业拥有超过 35 年的经验。作为 R L Fine Chem Pvt. Ltd. 的董事总经理兼首席执行官，他带来了深厚的技术专业知识、战略眼光和亲力亲为的方法，以推动创新和运营卓越。\r\n\r\n沙拉特是孟买化学技术学院和加尔各答印度管理学院商业领袖项目的校友，他曾在技术转让、GMP合规、监管事务、工艺工程和业务发展等关键职能部门担任领导职务。\r\n\r\n他在 Dr. Reddy’s Laboratories、Sequent Scientific、Aurobindo Pharma 和 Alivira Animal Health 的领导角色反映了他管理复杂项目、优化流程和建立高绩效团队的公认能力。\r\n\r\n沙拉特继续倡导制药行业的可持续增长和创新，并兼任 Alivira Animal Health Ltd. 的非执行董事。",
          "achievementsJson": "[]",
          "experience": "25+ 年",
          "education": "化学与制药领导力",
          "image": "/uploads/images/image-1761115827343-908977995.jpg",
          "color": "refex-blue",
          "order": 12,
          "isActive": true,
          "createdAt": "2025-10-08T16:23:33.000Z",
          "updatedAt": "2025-10-25T05:39:37.000Z",
          "achievements": []
      },
      {
          "id": 17,
          "name": "马蒂斯·斯蒂格斯特拉",
          "position": "全球科学事务负责人, Extrovis",
          "category": "管理团队",
          "description": "马蒂斯·斯蒂格斯特拉在制药行业工作了 20 多年，一直从事涵盖美国、欧洲和 MENA 地区的质量和法规事务角色。他在创新药和仿制药公司都拥有经验，曾为新成立的公司建立法规事务基础设施，并为成熟的公司优化了这些基础设施。\r\n\r\n他获得了各种类型产品（从 NCE 到用途再定位的分子再到复杂的仿制药）的多项上市许可批准。他曾负责包括无菌生产场地在内的多个场地的质量，并处理了多个场地的补救项目。马蒂斯最初来自荷兰，在格罗宁根大学学习药学，拥有药剂师学位，专攻分子药理学。",
          "achievementsJson": "[]",
          "experience": "20+ 年",
          "education": "药学学士, 格罗宁根",
          "image": "/uploads/images/image-1761311021922-916597178.jpg",
          "color": "refex-blue",
          "order": 13,
          "isActive": true,
          "createdAt": "2025-10-24T13:03:45.000Z",
          "updatedAt": "2025-10-25T07:46:07.000Z",
          "achievements": []
      },
      {
          "id": 20,
          "name": "安德烈亚·加扎内奥",
          "position": "全球 MSAT 负责人 - Latina Pharma",
          "category": "管理团队",
          "description": "安德烈亚·加扎内奥在研发和生产方面拥有超过 25 年的经验，这些经验来自于意大利（Italfarmaco 和 Fidia Farmaceutici）和国际制药公司（Novartis、Pfizer、Corden Pharma），涉及药物化学（API、光学活性 API、无菌和冻干 API、抗生素、疫苗、HPD）、技术转让（化学和制药领域）、工艺放大、各种药物形式的制造和包装（颗粒剂和口服固体剂（无菌和非无菌）、抗生素、疫苗（散装产品和成品剂型）、HPD、冻干产品、液体、固体、半固体形式的注射产品；纱布（无菌和非无菌）、软膏（无菌和非无菌）、乳膏（无菌和非无菌）、凝胶（无菌和非无菌）；预充式注射器、无菌单剂量滴眼液、无菌多剂量滴眼液、兽药、医疗器械）。",
          "achievementsJson": "[]",
          "experience": "",
          "education": "",
          "image": "/uploads/images/image-1761731339458-521205392.jpg",
          "color": "refex-blue",
          "order": 14,
          "isActive": true,
          "createdAt": "2025-10-25T06:27:52.000Z",
          "updatedAt": "2025-11-20T07:04:42.000Z",
          "achievements": []
      },
      {
          "id": 19,
          "name": "丹尼·克拉奇奥洛",
          "position": "场地负责人 - Kavis Pharma",
          "category": "管理团队",
          "description": "丹尼·克拉奇奥洛是 Kavis Pharma 位于德克萨斯州舒格兰的制造工厂的总经理，他负责监督场地运营的所有方面，包括制造、质量、法规合规、供应链、工程和财务绩效。丹尼在制药领域拥有超过 25 年的经验，曾领导无菌、非无菌、专业和复杂产品平台方面的团队。\r\n\r\n丹尼的职业生涯始于 Parkedale (King) Pharmaceuticals，在那里他支持质量运营和技术流程。随后，他晋升到 JHP Pharmaceuticals 和 DPT Laboratories 的制造领导职位，获得了 GMP 制造、配药、技术转让和运营卓越方面的广泛专业知识。在 DPT 担任多个运营领导职务后，丹尼晋升为舒格兰工厂的运营总监。在工厂过渡到 Kavis Pharma 后，丹尼被任命为总经理，在新公司结构下继续领导工厂运营。\r\n\r\n丹尼获得了奥克兰大学生物化学理学学士学位。他在 FDA、OSHA 和 EPA 监管要求、精益制造、变更管理和组织发展方面的丰富经验得到了认可。他的领导风格以建立高绩效团队、加强问责制和推动持续改进为中心。丹尼致力于确保舒格兰工厂始终以可靠性、效率和强大的合规文化提供高质量的药品。",
          "achievementsJson": "[]",
          "experience": "",
          "education": "",
          "image": "/uploads/images/image-1761731352378-381340691.jpg",
          "color": "refex-blue",
          "order": 15,
          "isActive": true,
          "createdAt": "2025-10-25T06:26:57.000Z",
          "updatedAt": "2025-11-20T07:02:56.000Z",
          "achievements": []
      },
      {
          "id": 21,
          "name": "克里斯蒂安·瓦尔加",
          "position": "场地负责人 – Pharma Pack",
          "category": "管理团队",
          "description": "克里斯蒂安在汽车、电子、化工和定制制造行业拥有二十多年的领导经验。他拥有机械工程、经济学和 MBA 学位，职业生涯建立在领导复杂项目、塑造和重组组织以及推动精益化运营卓越的基础上。他的背景包括管理生产单位、推动端到端流程改进，以及领导小型运营和办公室团队以及大型国际制造部门。\r\n\r\n他于 2020 年加入 Pharma Pack Hungary Kft.，其明确的使命是建立一个符合 GDP/GMP 标准、灵活且长期可持续的制药组织。从那时起，他通过积极参与国内和国际 GDP/GMP 审计、当局检查以及建立一个新的制造场地，并不断扩大和优化该场地，来巩固他的制药专业知识。",
          "achievementsJson": "[]",
          "experience": "",
          "education": "",
          "image": "/uploads/images/image-1761731369944-821221641.jpg",
          "color": "refex-blue",
          "order": 15,
          "isActive": true,
          "createdAt": "2025-10-25T07:39:03.000Z",
          "updatedAt": "2025-11-20T07:03:28.000Z",
          "achievements": []
      },
      {
          "id": 18,
          "name": "阿米特·蒂瓦里",
          "position": "首席营销官 – Extrovis",
          "category": "管理团队",
          "description": "-",
          "achievementsJson": "[]",
          "experience": "",
          "education": "",
          "image": "/uploads/images/image-1761738744230-894727949.jpg",
          "color": "refex-blue",
          "order": 16,
          "isActive": true,
          "createdAt": "2025-10-25T06:09:20.000Z",
          "updatedAt": "2025-10-29T11:52:28.000Z",
          "achievements": []
      },
      {
          "id": 12,
          "name": "阿米特·什里瓦斯塔瓦",
          "position": "首席营销官 – RLFC",
          "category": "管理团队",
          "description": "阿米特·什里瓦斯塔瓦是一位经验丰富的制药营销领导者，在全球业务发展和战略营销方面拥有超过 25 年的经验。他曾在 Zenfold Sustainable Technologies、Smilax Laboratories、Sun Pharma 和 Biocon 等组织担任领导职务，负责全球范围内的营销运营。阿米特在市场分析、战略规划和药品销售方面拥有扎实的背景。\r\n\r\n他拥有 MBA 学位，并完成了哈佛商学院的创业基础证书课程。阿米特常驻印度班加罗尔，继续推动制药行业的增长和创新。",
          "achievementsJson": "[]",
          "experience": "20+ 年",
          "education": "营销与商业战略",
          "image": "/uploads/images/image-1761115864389-841586860.jpg",
          "color": "refex-orange",
          "order": 17,
          "isActive": true,
          "createdAt": "2025-10-08T16:23:33.000Z",
          "updatedAt": "2025-10-25T08:40:35.000Z",
          "achievements": []
      },
      {
          "id": 15,
          "name": "拉杰什·奈克",
          "position": "执行董事 – 运营, RLFC",
          "category": "管理团队",
          "description": "拉杰什·奈克先生是一位经验丰富的制药运营领导者，在包括 Dr. Reddy’s Laboratories、GSK、Daiichi Sankyo（前 Daiichi-Ranbaxy）、Piramal Enterprises、Teva、Biocon 和 Zydus Life Sciences 在内的领先组织中拥有超过 26 年的经验。他是奥兰加巴德贾瓦哈拉尔尼赫鲁工程学院的化学工程毕业生，并完成了科泽科德印度管理学院的行政工商管理课程（CXO）。\r\n\r\n他带来了技术商业运营方面的深厚专业知识，涵盖制造、供应链管理、工程和项目、EHS、新产品开发项目管理、运营卓越和技术服务（工艺工程）。拉杰什在推动多个站点的运营效率、合规性和可持续制造实践方面发挥了关键作用。他向董事总经理兼首席执行官汇报，并领导一个结构化的团队，包括生产、技术服务、仓库和 PPIC 职能，确保交付管理、监管合规和盈利能力方面的卓越表现。",
          "achievementsJson": "[]",
          "experience": "26+ 年",
          "education": "",
          "image": "/uploads/images/image-1761310866794-321392940.jpg",
          "color": "refex-blue",
          "order": 18,
          "isActive": true,
          "createdAt": "2025-10-24T13:01:15.000Z",
          "updatedAt": "2025-10-25T07:44:39.000Z",
          "achievements": []
      },
      {
          "id": 24,
          "name": "马利卡朱纳·拉奥博士",
          "position": "印度运营负责人, Extrovis",
          "category": "管理团队",
          "description": "-",
          "achievementsJson": "[]",
          "experience": "",
          "education": "",
          "image": "/uploads/images/image-1761731302051-50532743.jpg",
          "color": "refex-blue",
          "order": 18,
          "isActive": true,
          "createdAt": "2025-10-25T08:33:30.000Z",
          "updatedAt": "2025-10-29T09:48:25.000Z",
          "achievements": []
      },
      {
          "id": 22,
          "name": "苏里亚纳拉亚纳·雷古拉加达博士",
          "position": "全球分析科学负责人 - Extrovis",
          "category": "管理团队",
          "description": "苏里亚纳拉亚纳·雷古拉加达博士在分析研发方面拥有二十多年的制药行业经验。他的专长涵盖了广泛的肽和复杂分子，优化实验室运营，确保稳健的方法开发和验证，并在监管框架内率先采用技术，以适应 API 和制剂在美国 FDA、MHRA 和 ENVISA 的发展。苏里亚是化学研究生——他曾在 Eugia Pharma、Alembic、Dr Reddy’s、Concord Laboratories、美国 Qualitest Pharmaceuticals 工作。在 Extrovis，苏里亚领导该集团的分析开发和服务组合。",
          "achievementsJson": "[]",
          "experience": "",
          "education": "",
          "image": "/uploads/images/image-1761731287745-13088173.jpg",
          "color": "refex-blue",
          "order": 19,
          "isActive": true,
          "createdAt": "2025-10-25T07:39:55.000Z",
          "updatedAt": "2025-11-20T07:04:16.000Z",
          "achievements": []
      },
      {
          "id": 16,
          "name": "拉马苏布拉马尼亚姆 S 博士",
          "position": "研发负责人 – RLFC",
          "category": "管理团队",
          "description": "拉马苏布拉马尼亚姆·尚穆加纳坦博士是一位成就卓著的制药研发领导者，在包括 AstraZeneca、Syngene、Cadila Pharma、Jubilant Chemsys、Innovassynth Technologies、Recon、Sanmar Speciality Chemicals、Piramal Healthcare 和 Sai Advantium 在内的领先组织中拥有超过 29 年的经验。\r\n\r\n他拥有哥印拜陀巴拉蒂亚尔大学的化学博士学位，并在推动创新、管线开发和研究卓越方面拥有深厚的科学专业知识。在他的整个职业生涯中，拉马苏布拉马尼亚姆博士在提升研发能力、促进科学创新、运营卓越以及促进稳健产品管线的增长方面发挥了关键作用。",
          "achievementsJson": "[]",
          "experience": "29+ 年",
          "education": "博士, 制药科学",
          "image": "/uploads/images/image-1761310953566-155149712.jpg",
          "color": "refex-blue",
          "order": 20,
          "isActive": true,
          "createdAt": "2025-10-24T13:02:39.000Z",
          "updatedAt": "2025-10-25T07:45:07.000Z",
          "achievements": []
      },
      {
          "id": 23,
          "name": "马哈尔希·迈特拉",
          "position": "首席运营官 - Refex集团",
          "category": "管理团队",
          "description": "-",
          "achievementsJson": "[]",
          "experience": "",
          "education": "",
          "image": "/uploads/images/image-1761731272675-710723872.jpg",
          "color": "refex-blue",
          "order": 21,
          "isActive": true,
          "createdAt": "2025-10-25T07:40:49.000Z",
          "updatedAt": "2025-10-29T09:47:55.000Z",
          "achievements": []
      }
  ]

   const deManagementTeam = [
    {
        "id": 7,
        "name": "Anil Jain",
        "position": "Vorsitzender & MD – Refex Group",
        "category": "Management Team",
        "description": "Anil Jain ist der geschäftsführende Direktor der Refex Group. Von Kindheit an von Unternehmergeist und Wagemut geprägt, lag ihm das Geschäft im Blut. Bereits im zarten Alter von 17 Jahren begann Anil, Zeit im Edelstahlhandelsgeschäft seiner Familie zu verbringen. Seine Leidenschaft, Chancen zu erkennen, führte ihn während eines Treffens mit einem großen Klimaanlagenhersteller in den Bereich der Kältemittelgase. Im Jahr 2002 legte er den Grundstein für die Errichtung seiner ersten Kältemittelgas-Nachfüllanlage unter dem Namen Refex Refrigerants Limited (jetzt Refex Industries Limited). Seitdem gab es keinen Blick zurück! Anil erweiterte langsam und stetig seinen Geschäftshorizont, und Refex wagte sich in verschiedene Geschäftsbereiche vor, darunter Erneuerbare Energien, Asche & Kohle, Pharma, Risikokapital, Flughafentransport, Medizintechnik, Grüne Mobilität und Stromhandel.</br></br>\nWährend seiner gesamten Laufbahn war Anil Mentor für viele Unternehmer. Er wollte mehr Start-ups betreuen und ihnen die Ressourcen und die Plattform für ihren Erfolg geben. Er hat viele solcher Unternehmer erfolgreich hervorgebracht.</br></br>\nAnil fühlt sich der Nachhaltigkeit stark verpflichtet und stellt sicher, dass das Geschäftsmodell von Refex dieses Ethos widerspiegelt. Für all dies und noch viel mehr hat Anil mehrere Branchenauszeichnungen gewonnen, wie den 'Trailblazer of Tamil Nadu', 'Young Entrepreneur' der Times Group, den Stevie Award aus Großbritannien, den Dun & Bradstreet Top 100 SMEs Award usw. Die Refex Group wurde unter seiner Führung zwei Jahre in Folge von GPTW als 'Great Place to Work' zertifiziert.",
        "achievementsJson": "[]",
        "experience": "40+ Jahre",
        "education": "Unternehmerische Führung",
        "image": "/uploads/images/image-1761115782807-909466776.jpg",
        "color": "refex-blue",
        "order": 7,
        "isActive": true,
        "createdAt": "2025-10-08T16:23:33.000Z",
        "updatedAt": "2025-10-24T13:07:36.000Z",
        "achievements": []
    },
    {
        "id": 8,
        "name": "Dinesh Agarwal",
        "position": "Group CEO – Refex Group",
        "category": "Management Team",
        "description": "Herr Dinesh Kumar Agarwal besitzt ausgeprägte unternehmerische Fähigkeiten in verschiedenen Geschäftsbereichen und trägt zu konstantem Erfolg in all seinen geschäftlichen Bestrebungen bei. Seit 2014 hat seine Expertise, kombiniert mit seiner Leidenschaft und seinem Eifer, das Geschäft des Unternehmens auszubauen, unsere Wachstumskurve beschleunigt. </br> </br> Herr Dinesh' Scharfsinn für Zahlen hat das Wachstum mehrerer Unternehmen ermöglicht, während seine Expertise im Bereich Corporate Finance, die Prüfung, Finanzbuchhaltung und -planung, Steuern und Fundraising umfasst, dazu beigetragen hat, über ₹ 5.000 Crores (etwa 50 Milliarden Rupien) für seine Kunden zu beschaffen. Er hat mit renommierten Organisationen wie Aircel und Brisk zusammengearbeitet und verfügt über vielfältige Erfahrungen in den Segmenten Solar EPC und Versorgungsunternehmen-Großprojekten. Er war auch als Berater für Start-ups, KMUs, etablierte Konzerne und internationale NGOs tätig und hat mehrere Branchenauszeichnungen für seinen Beitrag zum Management-Stream und verwandten Bereichen gewonnen.",
        "achievementsJson": "[\"Wirtschaftsprüfer mit 20+ Jahren Erfahrung\",\"Bekannt für strategische Einsicht und Umsetzung\",\"Prägte Refex' Wachstum zu nachhaltigem Erfolg\",\"Experte für Finanzstrategie und Betrieb\",\"Führer in der Geschäftstransformation\"]",
        "experience": "20+ Jahre",
        "education": "Wirtschaftsprüfer",
        "image": "/uploads/images/image-1761115796543-933758637.jpg",
        "color": "refex-green",
        "order": 8,
        "isActive": true,
        "createdAt": "2025-10-08T16:23:33.000Z",
        "updatedAt": "2025-10-24T13:07:44.000Z",
        "achievements": [
            "Wirtschaftsprüfer mit 20+ Jahren Erfahrung",
            "Bekannt für strategische Einsicht und Umsetzung",
            "Prägte Refex' Wachstum zu nachhaltigem Erfolg",
            "Experte für Finanzstrategie und Betrieb",
            "Führer in der Geschäftstransformation"
        ]
    },
    {
        "id": 9,
        "name": "Hanumantha Rao Kamma",
        "position": "CEO – RLS",
        "category": "Management Team",
        "description": "Hanumanth Rao Kamma (Hans) besitzt einen Master-Abschluss in International Management von der Pondicherry Central University, Indien. Er kombiniert ein starkes Wissen über Branchentrends und Portfoliostrategie mit einem weitreichenden professionellen Netzwerk. Vor seiner Tätigkeit bei Extrovis Schweiz hatte Hanumantha verschiedene Führungspositionen in den Bereichen strategische Beschaffung, Portfoliomanagement und strategische Geschäftsentwicklung bei Amneal, Ranbaxy und Dr. Reddy's inne.",
        "achievementsJson": "[]",
        "experience": "23+ Jahre",
        "education": "Master in International Management",
        "image": "/uploads/images/image-1761738716293-127419594.jpg",
        "color": "refex-orange",
        "order": 9,
        "isActive": true,
        "createdAt": "2025-10-08T16:23:33.000Z",
        "updatedAt": "2025-10-29T11:52:00.000Z",
        "achievements": []
    },
    {
        "id": 13,
        "name": "PV Raghavendra Rao",
        "position": "CFO – RLS",
        "category": "Management Team",
        "description": "Raghav ist ein versierter Wirtschaftsprüfer und Finanzexperte mit etwa 25 Jahren Erfahrung im Finanzmanagement. Seine Expertise umfasst Buchhaltung, Finanzplanung, Budgetierung, Verrechnungspreise, Steuern, Kostenrechnung und Treasury-Management, einschließlich Cashflow-Management, Hedging und Beschaffung von Mitteln bei Banken.</br></br>\n\nRaghav hatte prominente Führungspositionen im Finanzwesen inne, wie den Chief Financial Officer bei Sequent Scientific Limited, Macleods Pharmaceuticals Ltd und bei Solara Active Pharma Sciences. Er erwarb umfangreiche Fachkenntnisse im Bereich Business Finance durch verschiedene Rollen bei Dr. Reddy's Laboratories.</br></br>\n\nRaghav verfügt über ein tiefes Verständnis für Strategieentwicklung und -umsetzung. Im Laufe seiner Karriere hat Raghav als Berater und Consultant beigetragen und Schlüsselrollen in Finanzlenkungsausschüssen, Business Leadership Councils und gemeinsamen Lenkungsausschüssen gespielt.",
        "achievementsJson": "[\"Wirtschaftsprüfer mit 25 Jahren Erfahrung im Finanzmanagement\",\"Ehemaliger CFO bei Sequent, Macleods & Solara\",\"14 Jahre Erfahrung bei Dr. Reddy's\",\"Experte für FP&A, Steuern, Treasury & Strategie\",\"Inhaber des Goldratt Master Executive Certificate\"]",
        "experience": "25+ Jahre",
        "education": "Wirtschaftsprüfer, Goldratt Master Executive Certificate",
        "image": "/uploads/images/image-1761115929803-567823080.jpg",
        "color": "refex-blue",
        "order": 10,
        "isActive": true,
        "createdAt": "2025-10-08T16:23:33.000Z",
        "updatedAt": "2025-10-25T05:39:02.000Z",
        "achievements": [
            "Wirtschaftsprüfer mit 25 Jahren Erfahrung im Finanzmanagement",
            "Ehemaliger CFO bei Sequent, Macleods & Solara",
            "14 Jahre Erfahrung bei Dr. Reddy's",
            "Experte für FP&A, Steuern, Treasury & Strategie",
            "Inhaber des Goldratt Master Executive Certificate"
        ]
    },
    {
        "id": 14,
        "name": "Srinivasan Pagadala",
        "position": "CHRO – RLS",
        "category": "Management Team",
        "description": "Srini verfügt über 25 Jahre umfassende Erfahrung im Personalwesen in der Pharma- und Gesundheitsbranche. Er ist spezialisiert auf Business HR, Change Leadership und Transformation, Talentmanagement und Employee Relations. Im Laufe seiner Karriere hatte er verschiedene leitende und verantwortungsvolle HR-Positionen bei Top-Pharmaorganisationen wie Dr. Reddy's, Novartis, GVK Bio und Biological E inne. Vor seiner aktuellen Rolle bei Extrovis leitete Srini die HR-Funktion bei Solara Active Pharma.",
        "achievementsJson": "[\"25+ Jahre Erfahrung im Personalwesen in Pharma & Gesundheitswesen\",\"Spezialist für Talent, Transformation & Employee Relations\",\"Erfahrung bei Dr. Reddy's, Novartis, GVK Bio\",\"Erfahrung bei Biological E und Solara Active Pharma\",\"Experte für Organisationsentwicklung\"]",
        "experience": "25+ Jahre",
        "education": "HR & Organisationsentwicklung",
        "image": "/uploads/images/image-1761115945624-842176624.jpg",
        "color": "refex-green",
        "order": 11,
        "isActive": true,
        "createdAt": "2025-10-08T16:23:33.000Z",
        "updatedAt": "2025-10-25T05:39:18.000Z",
        "achievements": [
            "25+ Jahre Erfahrung im Personalwesen in Pharma & Gesundheitswesen",
            "Spezialist für Talent, Transformation & Employee Relations",
            "Erfahrung bei Dr. Reddy's, Novartis, GVK Bio",
            "Erfahrung bei Biological E und Solara Active Pharma",
            "Experte für Organisationsentwicklung"
        ]
    },
    {
        "id": 10,
        "name": "Sharat Narasapur",
        "position": "CEO – RLFC",
        "category": "Management Team",
        "description": "Sharat Narasapur ist eine erfahrene Führungspersönlichkeit mit über 35 Jahren Erfahrung in der Chemie-, Agrochemie- und Pharmabranche. Als Managing Director und CEO von R L Fine Chem Pvt. Ltd. bringt er tiefgreifende technische Expertise, strategische Vision und eine pragmatische Herangehensweise mit, um Innovation und operative Exzellenz voranzutreiben.</br> </br>\nAls Alumnus des Institute of Chemical Technology, Mumbai, und des Business Leaders Program am IIM Calcutta hat Sharat Schlüsselbereiche in Technologietransfer, GMP-Compliance, regulatorischen Angelegenheiten, Prozess-Engineering und Geschäftsentwicklung geleitet.</br> </br>\nSeine Führungsrollen bei Dr. Reddy's Laboratories, Sequent Scientific, Aurobindo Pharma und Alivira Animal Health spiegeln seine ausgewiesene Fähigkeit wider, komplexe Projekte zu managen, Prozesse zu optimieren und hochleistungsfähige Teams aufzubauen.</br> </br>\nSharat ist weiterhin ein Verfechter von nachhaltigem Wachstum und Innovation in der Pharmaindustrie und dient auch als Non-Executive Director bei Alivira Animal Health Ltd.",
        "achievementsJson": "[]",
        "experience": "25+ Jahre",
        "education": "Chemische & Pharmazeutische Führung",
        "image": "/uploads/images/image-1761115827343-908977995.jpg",
        "color": "refex-blue",
        "order": 12,
        "isActive": true,
        "createdAt": "2025-10-08T16:23:33.000Z",
        "updatedAt": "2025-10-25T05:39:37.000Z",
        "achievements": []
    },
    {
        "id": 17,
        "name": "Mathijs Steegstra",
        "position": "Global Head of Scientific Affairs, Extrovis",
        "category": "Management Team",
        "description": "Mathijs Steegstra ist seit über 20 Jahren in der pharmazeutischen Industrie tätig, stets in Qualitäts- und Regulierungsfunktionen, die die USA, Europa und MENA abdecken. Mit Erfahrung sowohl bei Innovatoren als auch bei Generika hat er RA-Infrastrukturen für neu gegründete Unternehmen aufgebaut und diese für etablierte Unternehmen optimiert. </br> </br>\n\nEr erwirkte mehrere Zulassungen für verschiedene Produkttypen, von NCEs über neu positionierte Moleküle bis hin zu komplexen Generika. Er war verantwortlich für die Qualität mehrerer Standorte, einschließlich steriler Produktionsstätten, und hat Sanierungsprojekte für mehrere Standorte betreut. Ursprünglich aus den Niederlanden, studierte er Pharmazie an der Universität Groningen und besitzt einen Apothekerabschluss mit Spezialisierung auf molekulare Pharmakologie.",
        "achievementsJson": "[]",
        "experience": "20+ Jahre",
        "education": "Apothekerabschluss, Groningen",
        "image": "/uploads/images/image-1761311021922-916597178.jpg",
        "color": "refex-blue",
        "order": 13,
        "isActive": true,
        "createdAt": "2025-10-24T13:03:45.000Z",
        "updatedAt": "2025-10-25T07:46:07.000Z",
        "achievements": []
    },
    {
        "id": 20,
        "name": "Andrea Gazzaneo",
        "position": "Global MSAT Head - Latina Pharma",
        "category": "Management Team",
        "description": "Andrea Gazzaneo verfügt über mehr als 25 Jahre Erfahrung in F&E und Produktion, gesammelt in italienischen (Italfarmaco und Fidia Farmaceutici) und internationalen Pharmaunternehmen (Novartis, Pfizer, Corden Pharma) in der pharmazeutischen Chemie (APIs, optisch aktive APIs, sterile und lyophilisierte APIs, Antibiotika, Impfstoffe, HPD), im Technologietransfer (sowohl im chemischen als auch im pharmazeutischen Bereich), in der Prozessskalierung, in der Herstellung und Verpackung verschiedener pharmazeutischer Formen (Granulate und orale Feststoffe (steril und nicht steril), Antibiotika, Impfstoffe (Bulk-Produkt und fertige Darreichungsformen), HPD, gefriergetrocknete Produkte, injizierbare Produkte in flüssiger, fester, halbfester Form; Gaze (steril und nicht steril), Salben (steril und nicht steril), Cremes (steril und nicht steril), Gele (steril und nicht steril); vorgefüllte Spritzen, sterile Einzeldosis-Augentropfen, sterile Mehrdosis-Augentropfen, Tierarzneimittel, Medizinprodukte).",
        "achievementsJson": "[]",
        "experience": "",
        "education": "",
        "image": "/uploads/images/image-1761731339458-521205392.jpg",
        "color": "refex-blue",
        "order": 14,
        "isActive": true,
        "createdAt": "2025-10-25T06:27:52.000Z",
        "updatedAt": "2025-11-20T07:04:42.000Z",
        "achievements": []
    },
    {
        "id": 19,
        "name": "Danny Cracchiolo",
        "position": "Site Head - Kavis Pharma",
        "category": "Management Team",
        "description": "Danny Cracchiolo ist der General Manager der Produktionsstätte von Kavis Pharma in Sugar Land, Texas, wo er alle Aspekte des Standortbetriebs überwacht, einschließlich Fertigung, Qualität, Einhaltung gesetzlicher Vorschriften, Lieferkette, Engineering und finanzielle Leistung. Mit mehr als 25 Jahren Erfahrung im Pharmasektor hat Danny Teams für sterile, nicht-sterile, Spezial- und komplexe Produktplattformen geleitet. </br> </br>\n\nDannys Karriere begann bei Parkedale (King) Pharmaceuticals, wo er Qualitätsabläufe und technische Prozesse unterstützte. Später stieg er bei JHP Pharmaceuticals und DPT Laboratories in Führungspositionen in der Fertigung auf und erwarb umfassende Expertise in GMP-Fertigung, Compoundierung, technischer Übertragung und operativer Exzellenz. Nachdem er bei DPT mehrere operative Führungspositionen innehatte, stieg Danny zum Director of Operations am Standort Sugar Land auf. Nach der Übernahme des Standorts durch Kavis Pharma wurde Danny zum General Manager ernannt und setzte seine Führung der Standortaktivitäten unter der neuen Unternehmensstruktur fort. </br> </br>\n\nDanny erwarb einen Bachelor of Science in Biochemie an der Oakland University. Er wird für seine umfassende Erfahrung in den regulatorischen Anforderungen von FDA, OSHA und EPA, Lean Manufacturing, Change Management und Organisationsentwicklung anerkannt. Sein Führungsstil konzentriert sich auf den Aufbau hochleistungsfähiger Teams, die Stärkung der Verantwortlichkeit und die Förderung kontinuierlicher Verbesserung. Danny setzt sich dafür ein, dass die Anlage in Sugar Land stets qualitativ hochwertige pharmazeutische Produkte mit Zuverlässigkeit, Effizienz und einer starken Compliance-Kultur liefert.",
        "achievementsJson": "[]",
        "experience": "",
        "education": "",
        "image": "/uploads/images/image-1761731352378-381340691.jpg",
        "color": "refex-blue",
        "order": 15,
        "isActive": true,
        "createdAt": "2025-10-25T06:26:57.000Z",
        "updatedAt": "2025-11-20T07:02:56.000Z",
        "achievements": []
    },
    {
        "id": 21,
        "name": "Krisztián Varga",
        "position": "Site Head – Pharma Pack",
        "category": "Management Team",
        "description": "Krisztián bringt über zwei Jahrzehnte Führungserfahrung in der Automobil-, Elektronik-, Chemie- und kundenspezifischen Fertigungsindustrie mit. Er hat Abschlüsse in Maschinenbau, Wirtschaftswissenschaften und einen MBA und hat seine Karriere auf die Leitung komplexer Projekte, die Gestaltung und Umstrukturierung von Organisationen sowie die Förderung von Lean-basierter operativer Exzellenz aufgebaut. Sein Hintergrund umfasst die Leitung von Produktionseinheiten, die Förderung von End-to-End-Prozessverbesserungen und die Führung sowohl kleiner Betriebs- und Büroteams als auch großer internationaler Fertigungsbereiche. </br> </br>\n\nEr trat 2020 in die Pharma Pack Hungary Kft. ein mit dem klaren Auftrag, eine GDP/GMP-konforme, flexible und langfristig nachhaltige pharmazeutische Organisation aufzubauen. Seitdem hat er seine pharmazeutische Expertise durch aktive Teilnahme an nationalen und internationalen GDP/GMP-Audits, Behördeninspektionen und der Gründung eines neuen Fertigungsstandorts, den er weiterhin erweitert und optimiert, gestärkt.",
        "achievementsJson": "[]",
        "experience": "",
        "education": "",
        "image": "/uploads/images/image-1761731369944-821221641.jpg",
        "color": "refex-blue",
        "order": 15,
        "isActive": true,
        "createdAt": "2025-10-25T07:39:03.000Z",
        "updatedAt": "2025-11-20T07:03:28.000Z",
        "achievements": []
    },
    {
        "id": 18,
        "name": "Amit Tiwari",
        "position": "CMO – Extrovis",
        "category": "Management Team",
        "description": "-",
        "achievementsJson": "[]",
        "experience": "",
        "education": "",
        "image": "/uploads/images/image-1761738744230-894727949.jpg",
        "color": "refex-blue",
        "order": 16,
        "isActive": true,
        "createdAt": "2025-10-25T06:09:20.000Z",
        "updatedAt": "2025-10-29T11:52:28.000Z",
        "achievements": []
    },
    {
        "id": 12,
        "name": "Amit Shrivastava",
        "position": "CMO – RLFC",
        "category": "Management Team",
        "description": "Amit Shrivastava ist eine erfahrene Führungspersönlichkeit im Pharmamarketing mit über 25 Jahren Erfahrung in der globalen Geschäftsentwicklung und im strategischen Marketing. Er hatte Führungspositionen bei Organisationen wie Zenfold Sustainable Technologies, Smilax Laboratories, Sun Pharma und Biocon inne, wo er Marketingaktivitäten auf der ganzen Welt leitete. Amit verfügt über einen starken Hintergrund in Marktanalysen, strategischer Planung und pharmazeutischem Vertrieb. </br> </br> Er besitzt einen MBA und hat ein Zertifikat in Entrepreneurship Essential von der Harvard Business School abgeschlossen. Mit Sitz in Bangalore, Indien, treibt Amit weiterhin das Wachstum und die Innovation im Pharmasektor voran.",
        "achievementsJson": "[]",
        "experience": "20+ Jahre",
        "education": "Marketing & Geschäftsstrategie",
        "image": "/uploads/images/image-1761115864389-841586860.jpg",
        "color": "refex-orange",
        "order": 17,
        "isActive": true,
        "createdAt": "2025-10-08T16:23:33.000Z",
        "updatedAt": "2025-10-25T08:40:35.000Z",
        "achievements": []
    },
    {
        "id": 15,
        "name": "Rajesh Naik",
        "position": "ED – Operations, RLFC",
        "category": "Management Team",
        "description": "Herr Rajesh Naik ist eine erfahrene Führungspersönlichkeit in der Pharmaproduktion mit über 26 Jahren Erfahrung in führenden Organisationen, darunter Dr. Reddy’s Laboratories, GSK, Daiichi Sankyo (ehemals Daiichi-Ranbaxy), Piramal Enterprises, Teva, Biocon und Zydus Life Sciences. Er hat einen Abschluss in Chemieingenieurwesen vom Jawaharlal Nehru Engineering College, Aurangabad, und hat ein Executive Business Management Programm (CXO) am Indian Institute of Management Kozhikode absolviert. </br> </br>\nEr bringt tiefgreifende Expertise in technisch-kommerziellen Operationen mit, die Fertigung, Supply Chain Management, Engineering und Projekte, EHS, Projektmanagement für neue Produktentwicklungen, operative Exzellenz und technische Dienstleistungen (Prozess-Engineering) umfassen. Rajesh hat eine entscheidende Rolle bei der Steigerung der operativen Effizienz, der Einhaltung von Vorschriften und der nachhaltigen Fertigungspraktiken an mehreren Standorten gespielt. Er berichtet dem Managing Director & CEO und leitet ein strukturiertes Team, das die Funktionen Produktion, technische Dienstleistungen, Lager und PPIC umfasst und Exzellenz in der Liefersteuerung, der Einhaltung gesetzlicher Vorschriften und der Rentabilität gewährleistet.",
        "achievementsJson": "[]",
        "experience": "26+ Jahre",
        "education": "",
        "image": "/uploads/images/image-1761310866794-321392940.jpg",
        "color": "refex-blue",
        "order": 18,
        "isActive": true,
        "createdAt": "2025-10-24T13:01:15.000Z",
        "updatedAt": "2025-10-25T07:44:39.000Z",
        "achievements": []
    },
    {
        "id": 24,
        "name": "Dr. Mallikarjuna Rao",
        "position": "Head – India Operations, Extrovis",
        "category": "Management Team",
        "description": "-",
        "achievementsJson": "[]",
        "experience": "",
        "education": "",
        "image": "/uploads/images/image-1761731302051-50532743.jpg",
        "color": "refex-blue",
        "order": 18,
        "isActive": true,
        "createdAt": "2025-10-25T08:33:30.000Z",
        "updatedAt": "2025-10-29T09:48:25.000Z",
        "achievements": []
    },
    {
        "id": 22,
        "name": "Dr. Suryanarayana Regulagadda",
        "position": "Global Head of Analytical Sciences - Extrovis",
        "category": "Management Team",
        "description": "Dr. Suryanarayana Regulagadda verfügt über mehr als zwei Jahrzehnte Erfahrung in der pharmazeutischen Industrie im Bereich Analytische Forschung & Entwicklung. Seine Expertise umfasst eine breite Palette von Peptiden und komplexen Molekülen, die Optimierung von Laborabläufen, die Gewährleistung robuster Methodenentwicklung und -validierung sowie die Speerspitze der Technologieeinführung innerhalb des regulatorischen Rahmens, die den Entwicklungen der USFDA, MHRA und ENVISA bei APIs und Formulierungen Rechnung trägt. Surya ist Postgraduierter in Chemie – er arbeitete bei Eugia Pharma, Alembic, Dr Reddy’s, Concord Laboratories und Qualitest Pharmaceuticals in den USA. Bei Extrovis leitet Surya das Portfolio für analytische Entwicklung und Dienstleistungen der Gruppe.",
        "achievementsJson": "[]",
        "experience": "",
        "education": "",
        "image": "/uploads/images/image-1761731287745-13088173.jpg",
        "color": "refex-blue",
        "order": 19,
        "isActive": true,
        "createdAt": "2025-10-25T07:39:55.000Z",
        "updatedAt": "2025-11-20T07:04:16.000Z",
        "achievements": []
    },
    {
        "id": 16,
        "name": "Dr. Ramasubramanian S",
        "position": "Head of R&D – RLFC",
        "category": "Management Team",
        "description": "Dr. Ramasubramanian Shanmuganathan ist eine versierte Führungspersönlichkeit in der pharmazeutischen Forschung und Entwicklung mit über 29 Jahren Erfahrung in führenden Organisationen, darunter AstraZeneca, Syngene, Cadila Pharma, Jubilant Chemsys, Innovassynth Technologies, Recon, Sanmar Speciality Chemicals, Piramal Healthcare und Sai Advantium. </br> </br> Er besitzt einen Ph.D. in Chemie von der Bharathiar University, Coimbatore, und bringt tiefgreifendes wissenschaftliches Fachwissen mit, um Innovation, Pipeline-Entwicklung und Exzellenz in der Forschung voranzutreiben. Während seiner gesamten Karriere hat Dr. Ramasubramanian eine Schlüsselrolle bei der Weiterentwicklung von F&E-Kapazitäten, der Förderung wissenschaftlicher Innovation, der operativen Exzellenz und dem Beitrag zum Wachstum robuster Produktpipelines im Pharmasektor gespielt.",
        "achievementsJson": "[]",
        "experience": "29+ Jahre",
        "education": "PhD, Pharmazeutische Wissenschaften",
        "image": "/uploads/images/image-1761310953566-155149712.jpg",
        "color": "refex-blue",
        "order": 20,
        "isActive": true,
        "createdAt": "2025-10-24T13:02:39.000Z",
        "updatedAt": "2025-10-25T07:45:07.000Z",
        "achievements": []
    },
    {
        "id": 23,
        "name": "Maharshi Maitra",
        "position": "COS - Refex Group",
        "category": "Management Team",
        "description": "-",
        "achievementsJson": "[]",
        "experience": "",
        "education": "",
        "image": "/uploads/images/image-1761731272675-710723872.jpg",
        "color": "refex-blue",
        "order": 21,
        "isActive": true,
        "createdAt": "2025-10-25T07:40:49.000Z",
        "updatedAt": "2025-10-29T09:47:55.000Z",
        "achievements": []
    }
]


 const huManagementTeam = [
  {
      "id": 7,
      "name": "Anil Jain",
      "position": "Vorsitzender & MD – Refex Group",
      "category": "Management Team",
      "description": "Anil Jain ist der geschäftsführende Direktor der Refex Group. Von Kindheit an von Unternehmergeist und Wagemut geprägt, lag ihm das Geschäft im Blut. Bereits im zarten Alter von 17 Jahren begann Anil, Zeit im Edelstahlhandelsgeschäft seiner Familie zu verbringen. Seine Leidenschaft, Chancen zu erkennen, führte ihn während eines Treffens mit einem großen Klimaanlagenhersteller in den Bereich der Kältemittelgase. Im Jahr 2002 legte er den Grundstein für die Errichtung seiner ersten Kältemittelgas-Nachfüllanlage unter dem Namen Refex Refrigerants Limited (jetzt Refex Industries Limited). Seitdem gab es keinen Blick zurück! Anil erweiterte langsam und stetig seinen Geschäftshorizont, und Refex wagte sich in verschiedene Geschäftsbereiche vor, darunter Erneuerbare Energien, Asche & Kohle, Pharma, Risikokapital, Flughafentransport, Medizintechnik, Grüne Mobilität und Stromhandel.</br></br>\nWährend seiner gesamten Laufbahn war Anil Mentor für viele Unternehmer. Er wollte mehr Start-ups betreuen und ihnen die Ressourcen und die Plattform für ihren Erfolg geben. Er hat viele solcher Unternehmer erfolgreich hervorgebracht.</br></br>\nAnil fühlt sich der Nachhaltigkeit stark verpflichtet und stellt sicher, dass das Geschäftsmodell von Refex dieses Ethos widerspiegelt. Für all dies und noch viel mehr hat Anil mehrere Branchenauszeichnungen gewonnen, wie den 'Trailblazer of Tamil Nadu', 'Young Entrepreneur' der Times Group, den Stevie Award aus Großbritannien, den Dun & Bradstreet Top 100 SMEs Award usw. Die Refex Group wurde unter seiner Führung zwei Jahre in Folge von GPTW als 'Great Place to Work' zertifiziert.",
      "achievementsJson": "[]",
      "experience": "40+ Jahre",
      "education": "Unternehmerische Führung",
      "image": "/uploads/images/image-1761115782807-909466776.jpg",
      "color": "refex-blue",
      "order": 7,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-24T13:07:36.000Z",
      "achievements": []
  },
  {
      "id": 8,
      "name": "Dinesh Agarwal",
      "position": "Group CEO – Refex Group",
      "category": "Management Team",
      "description": "Herr Dinesh Kumar Agarwal besitzt ausgeprägte unternehmerische Fähigkeiten in verschiedenen Geschäftsbereichen und trägt zu konstantem Erfolg in all seinen geschäftlichen Bestrebungen bei. Seit 2014 hat seine Expertise, kombiniert mit seiner Leidenschaft und seinem Eifer, das Geschäft des Unternehmens auszubauen, unsere Wachstumskurve beschleunigt. </br> </br> Herr Dinesh' Scharfsinn für Zahlen hat das Wachstum mehrerer Unternehmen ermöglicht, während seine Expertise im Bereich Corporate Finance, die Prüfung, Finanzbuchhaltung und -planung, Steuern und Fundraising umfasst, dazu beigetragen hat, über ₹ 5.000 Crores (etwa 50 Milliarden Rupien) für seine Kunden zu beschaffen. Er hat mit renommierten Organisationen wie Aircel und Brisk zusammengearbeitet und verfügt über vielfältige Erfahrungen in den Segmenten Solar EPC und Versorgungsunternehmen-Großprojekten. Er war auch als Berater für Start-ups, KMUs, etablierte Konzerne und internationale NGOs tätig und hat mehrere Branchenauszeichnungen für seinen Beitrag zum Management-Stream und verwandten Bereichen gewonnen.",
      "achievementsJson": "[\"Wirtschaftsprüfer mit 20+ Jahren Erfahrung\",\"Bekannt für strategische Einsicht und Umsetzung\",\"Prägte Refex' Wachstum zu nachhaltigem Erfolg\",\"Experte für Finanzstrategie und Betrieb\",\"Führer in der Geschäftstransformation\"]",
      "experience": "20+ Jahre",
      "education": "Wirtschaftsprüfer",
      "image": "/uploads/images/image-1761115796543-933758637.jpg",
      "color": "refex-green",
      "order": 8,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-24T13:07:44.000Z",
      "achievements": [
          "Wirtschaftsprüfer mit 20+ Jahren Erfahrung",
          "Bekannt für strategische Einsicht und Umsetzung",
          "Prägte Refex' Wachstum zu nachhaltigem Erfolg",
          "Experte für Finanzstrategie und Betrieb",
          "Führer in der Geschäftstransformation"
      ]
  },
  {
      "id": 9,
      "name": "Hanumantha Rao Kamma",
      "position": "CEO – RLS",
      "category": "Management Team",
      "description": "Hanumanth Rao Kamma (Hans) besitzt einen Master-Abschluss in International Management von der Pondicherry Central University, Indien. Er kombiniert ein starkes Wissen über Branchentrends und Portfoliostrategie mit einem weitreichenden professionellen Netzwerk. Vor seiner Tätigkeit bei Extrovis Schweiz hatte Hanumantha verschiedene Führungspositionen in den Bereichen strategische Beschaffung, Portfoliomanagement und strategische Geschäftsentwicklung bei Amneal, Ranbaxy und Dr. Reddy's inne.",
      "achievementsJson": "[]",
      "experience": "23+ Jahre",
      "education": "Master in International Management",
      "image": "/uploads/images/image-1761738716293-127419594.jpg",
      "color": "refex-orange",
      "order": 9,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-29T11:52:00.000Z",
      "achievements": []
  },
  {
      "id": 13,
      "name": "PV Raghavendra Rao",
      "position": "CFO – RLS",
      "category": "Management Team",
      "description": "Raghav ist ein versierter Wirtschaftsprüfer und Finanzexperte mit etwa 25 Jahren Erfahrung im Finanzmanagement. Seine Expertise umfasst Buchhaltung, Finanzplanung, Budgetierung, Verrechnungspreise, Steuern, Kostenrechnung und Treasury-Management, einschließlich Cashflow-Management, Hedging und Beschaffung von Mitteln bei Banken.</br></br>\n\nRaghav hatte prominente Führungspositionen im Finanzwesen inne, wie den Chief Financial Officer bei Sequent Scientific Limited, Macleods Pharmaceuticals Ltd und bei Solara Active Pharma Sciences. Er erwarb umfangreiche Fachkenntnisse im Bereich Business Finance durch verschiedene Rollen bei Dr. Reddy's Laboratories.</br></br>\n\nRaghav verfügt über ein tiefes Verständnis für Strategieentwicklung und -umsetzung. Im Laufe seiner Karriere hat Raghav als Berater und Consultant beigetragen und Schlüsselrollen in Finanzlenkungsausschüssen, Business Leadership Councils und gemeinsamen Lenkungsausschüssen gespielt.",
      "achievementsJson": "[\"Wirtschaftsprüfer mit 25 Jahren Erfahrung im Finanzmanagement\",\"Ehemaliger CFO bei Sequent, Macleods & Solara\",\"14 Jahre Erfahrung bei Dr. Reddy's\",\"Experte für FP&A, Steuern, Treasury & Strategie\",\"Inhaber des Goldratt Master Executive Certificate\"]",
      "experience": "25+ Jahre",
      "education": "Wirtschaftsprüfer, Goldratt Master Executive Certificate",
      "image": "/uploads/images/image-1761115929803-567823080.jpg",
      "color": "refex-blue",
      "order": 10,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T05:39:02.000Z",
      "achievements": [
          "Wirtschaftsprüfer mit 25 Jahren Erfahrung im Finanzmanagement",
          "Ehemaliger CFO bei Sequent, Macleods & Solara",
          "14 Jahre Erfahrung bei Dr. Reddy's",
          "Experte für FP&A, Steuern, Treasury & Strategie",
          "Inhaber des Goldratt Master Executive Certificate"
      ]
  },
  {
      "id": 14,
      "name": "Srinivasan Pagadala",
      "position": "CHRO – RLS",
      "category": "Management Team",
      "description": "Srini verfügt über 25 Jahre umfassende Erfahrung im Personalwesen in der Pharma- und Gesundheitsbranche. Er ist spezialisiert auf Business HR, Change Leadership und Transformation, Talentmanagement und Employee Relations. Im Laufe seiner Karriere hatte er verschiedene leitende und verantwortungsvolle HR-Positionen bei Top-Pharmaorganisationen wie Dr. Reddy's, Novartis, GVK Bio und Biological E inne. Vor seiner aktuellen Rolle bei Extrovis leitete Srini die HR-Funktion bei Solara Active Pharma.",
      "achievementsJson": "[\"25+ Jahre Erfahrung im Personalwesen in Pharma & Gesundheitswesen\",\"Spezialist für Talent, Transformation & Employee Relations\",\"Erfahrung bei Dr. Reddy's, Novartis, GVK Bio\",\"Erfahrung bei Biological E und Solara Active Pharma\",\"Experte für Organisationsentwicklung\"]",
      "experience": "25+ Jahre",
      "education": "HR & Organisationsentwicklung",
      "image": "/uploads/images/image-1761115945624-842176624.jpg",
      "color": "refex-green",
      "order": 11,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T05:39:18.000Z",
      "achievements": [
          "25+ Jahre Erfahrung im Personalwesen in Pharma & Gesundheitswesen",
          "Spezialist für Talent, Transformation & Employee Relations",
          "Erfahrung bei Dr. Reddy's, Novartis, GVK Bio",
          "Erfahrung bei Biological E und Solara Active Pharma",
          "Experte für Organisationsentwicklung"
      ]
  },
  {
      "id": 10,
      "name": "Sharat Narasapur",
      "position": "CEO – RLFC",
      "category": "Management Team",
      "description": "Sharat Narasapur ist eine erfahrene Führungspersönlichkeit mit über 35 Jahren Erfahrung in der Chemie-, Agrochemie- und Pharmabranche. Als Managing Director und CEO von R L Fine Chem Pvt. Ltd. bringt er tiefgreifende technische Expertise, strategische Vision und eine pragmatische Herangehensweise mit, um Innovation und operative Exzellenz voranzutreiben.</br> </br>\nAls Alumnus des Institute of Chemical Technology, Mumbai, und des Business Leaders Program am IIM Calcutta hat Sharat Schlüsselbereiche in Technologietransfer, GMP-Compliance, regulatorischen Angelegenheiten, Prozess-Engineering und Geschäftsentwicklung geleitet.</br> </br>\nSeine Führungsrollen bei Dr. Reddy's Laboratories, Sequent Scientific, Aurobindo Pharma und Alivira Animal Health spiegeln seine ausgewiesene Fähigkeit wider, komplexe Projekte zu managen, Prozesse zu optimieren und hochleistungsfähige Teams aufzubauen.</br> </br>\nSharat ist weiterhin ein Verfechter von nachhaltigem Wachstum und Innovation in der Pharmaindustrie und dient auch als Non-Executive Director bei Alivira Animal Health Ltd.",
      "achievementsJson": "[]",
      "experience": "25+ Jahre",
      "education": "Chemische & Pharmazeutische Führung",
      "image": "/uploads/images/image-1761115827343-908977995.jpg",
      "color": "refex-blue",
      "order": 12,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T05:39:37.000Z",
      "achievements": []
  },
  {
      "id": 17,
      "name": "Mathijs Steegstra",
      "position": "Global Head of Scientific Affairs, Extrovis",
      "category": "Management Team",
      "description": "Mathijs Steegstra ist seit über 20 Jahren in der pharmazeutischen Industrie tätig, stets in Qualitäts- und Regulierungsfunktionen, die die USA, Europa und MENA abdecken. Mit Erfahrung sowohl bei Innovatoren als auch bei Generika hat er RA-Infrastrukturen für neu gegründete Unternehmen aufgebaut und diese für etablierte Unternehmen optimiert. </br> </br>\n\nEr erwirkte mehrere Zulassungen für verschiedene Produkttypen, von NCEs über neu positionierte Moleküle bis hin zu komplexen Generika. Er war verantwortlich für die Qualität mehrerer Standorte, einschließlich steriler Produktionsstätten, und hat Sanierungsprojekte für mehrere Standorte betreut. Ursprünglich aus den Niederlanden, studierte er Pharmazie an der Universität Groningen und besitzt einen Apothekerabschluss mit Spezialisierung auf molekulare Pharmakologie.",
      "achievementsJson": "[]",
      "experience": "20+ Jahre",
      "education": "Apothekerabschluss, Groningen",
      "image": "/uploads/images/image-1761311021922-916597178.jpg",
      "color": "refex-blue",
      "order": 13,
      "isActive": true,
      "createdAt": "2025-10-24T13:03:45.000Z",
      "updatedAt": "2025-10-25T07:46:07.000Z",
      "achievements": []
  },
  {
      "id": 20,
      "name": "Andrea Gazzaneo",
      "position": "Global MSAT Head - Latina Pharma",
      "category": "Management Team",
      "description": "Andrea Gazzaneo verfügt über mehr als 25 Jahre Erfahrung in F&E und Produktion, gesammelt in italienischen (Italfarmaco und Fidia Farmaceutici) und internationalen Pharmaunternehmen (Novartis, Pfizer, Corden Pharma) in der pharmazeutischen Chemie (APIs, optisch aktive APIs, sterile und lyophilisierte APIs, Antibiotika, Impfstoffe, HPD), im Technologietransfer (sowohl im chemischen als auch im pharmazeutischen Bereich), in der Prozessskalierung, in der Herstellung und Verpackung verschiedener pharmazeutischer Formen (Granulate und orale Feststoffe (steril und nicht steril), Antibiotika, Impfstoffe (Bulk-Produkt und fertige Darreichungsformen), HPD, gefriergetrocknete Produkte, injizierbare Produkte in flüssiger, fester, halbfester Form; Gaze (steril und nicht steril), Salben (steril und nicht steril), Cremes (steril und nicht steril), Gele (steril und nicht steril); vorgefüllte Spritzen, sterile Einzeldosis-Augentropfen, sterile Mehrdosis-Augentropfen, Tierarzneimittel, Medizinprodukte).",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731339458-521205392.jpg",
      "color": "refex-blue",
      "order": 14,
      "isActive": true,
      "createdAt": "2025-10-25T06:27:52.000Z",
      "updatedAt": "2025-11-20T07:04:42.000Z",
      "achievements": []
  },
  {
      "id": 19,
      "name": "Danny Cracchiolo",
      "position": "Site Head - Kavis Pharma",
      "category": "Management Team",
      "description": "Danny Cracchiolo ist der General Manager der Produktionsstätte von Kavis Pharma in Sugar Land, Texas, wo er alle Aspekte des Standortbetriebs überwacht, einschließlich Fertigung, Qualität, Einhaltung gesetzlicher Vorschriften, Lieferkette, Engineering und finanzielle Leistung. Mit mehr als 25 Jahren Erfahrung im Pharmasektor hat Danny Teams für sterile, nicht-sterile, Spezial- und komplexe Produktplattformen geleitet. </br> </br>\n\nDannys Karriere begann bei Parkedale (King) Pharmaceuticals, wo er Qualitätsabläufe und technische Prozesse unterstützte. Später stieg er bei JHP Pharmaceuticals und DPT Laboratories in Führungspositionen in der Fertigung auf und erwarb umfassende Expertise in GMP-Fertigung, Compoundierung, technischer Übertragung und operativer Exzellenz. Nachdem er bei DPT mehrere operative Führungspositionen innehatte, stieg Danny zum Director of Operations am Standort Sugar Land auf. Nach der Übernahme des Standorts durch Kavis Pharma wurde Danny zum General Manager ernannt und setzte seine Führung der Standortaktivitäten unter der neuen Unternehmensstruktur fort. </br> </br>\n\nDanny erwarb einen Bachelor of Science in Biochemie an der Oakland University. Er wird für seine umfassende Erfahrung in den regulatorischen Anforderungen von FDA, OSHA und EPA, Lean Manufacturing, Change Management und Organisationsentwicklung anerkannt. Sein Führungsstil konzentriert sich auf den Aufbau hochleistungsfähiger Teams, die Stärkung der Verantwortlichkeit und die Förderung kontinuierlicher Verbesserung. Danny setzt sich dafür ein, dass die Anlage in Sugar Land stets qualitativ hochwertige pharmazeutische Produkte mit Zuverlässigkeit, Effizienz und einer starken Compliance-Kultur liefert.",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731352378-381340691.jpg",
      "color": "refex-blue",
      "order": 15,
      "isActive": true,
      "createdAt": "2025-10-25T06:26:57.000Z",
      "updatedAt": "2025-11-20T07:02:56.000Z",
      "achievements": []
  },
  {
      "id": 21,
      "name": "Krisztián Varga",
      "position": "Site Head – Pharma Pack",
      "category": "Management Team",
      "description": "Krisztián bringt über zwei Jahrzehnte Führungserfahrung in der Automobil-, Elektronik-, Chemie- und kundenspezifischen Fertigungsindustrie mit. Er hat Abschlüsse in Maschinenbau, Wirtschaftswissenschaften und einen MBA und hat seine Karriere auf die Leitung komplexer Projekte, die Gestaltung und Umstrukturierung von Organisationen sowie die Förderung von Lean-basierter operativer Exzellenz aufgebaut. Sein Hintergrund umfasst die Leitung von Produktionseinheiten, die Förderung von End-to-End-Prozessverbesserungen und die Führung sowohl kleiner Betriebs- und Büroteams als auch großer internationaler Fertigungsbereiche. </br> </br>\n\nEr trat 2020 in die Pharma Pack Hungary Kft. ein mit dem klaren Auftrag, eine GDP/GMP-konforme, flexible und langfristig nachhaltige pharmazeutische Organisation aufzubauen. Seitdem hat er seine pharmazeutische Expertise durch aktive Teilnahme an nationalen und internationalen GDP/GMP-Audits, Behördeninspektionen und der Gründung eines neuen Fertigungsstandorts, den er weiterhin erweitert und optimiert, gestärkt.",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731369944-821221641.jpg",
      "color": "refex-blue",
      "order": 15,
      "isActive": true,
      "createdAt": "2025-10-25T07:39:03.000Z",
      "updatedAt": "2025-11-20T07:03:28.000Z",
      "achievements": []
  },
  {
      "id": 18,
      "name": "Amit Tiwari",
      "position": "CMO – Extrovis",
      "category": "Management Team",
      "description": "-",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761738744230-894727949.jpg",
      "color": "refex-blue",
      "order": 16,
      "isActive": true,
      "createdAt": "2025-10-25T06:09:20.000Z",
      "updatedAt": "2025-10-29T11:52:28.000Z",
      "achievements": []
  },
  {
      "id": 12,
      "name": "Amit Shrivastava",
      "position": "CMO – RLFC",
      "category": "Management Team",
      "description": "Amit Shrivastava ist eine erfahrene Führungspersönlichkeit im Pharmamarketing mit über 25 Jahren Erfahrung in der globalen Geschäftsentwicklung und im strategischen Marketing. Er hatte Führungspositionen bei Organisationen wie Zenfold Sustainable Technologies, Smilax Laboratories, Sun Pharma und Biocon inne, wo er Marketingaktivitäten auf der ganzen Welt leitete. Amit verfügt über einen starken Hintergrund in Marktanalysen, strategischer Planung und pharmazeutischem Vertrieb. </br> </br> Er besitzt einen MBA und hat ein Zertifikat in Entrepreneurship Essential von der Harvard Business School abgeschlossen. Mit Sitz in Bangalore, Indien, treibt Amit weiterhin das Wachstum und die Innovation im Pharmasektor voran.",
      "achievementsJson": "[]",
      "experience": "20+ Jahre",
      "education": "Marketing & Geschäftsstrategie",
      "image": "/uploads/images/image-1761115864389-841586860.jpg",
      "color": "refex-orange",
      "order": 17,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T08:40:35.000Z",
      "achievements": []
  },
  {
      "id": 15,
      "name": "Rajesh Naik",
      "position": "ED – Operations, RLFC",
      "category": "Management Team",
      "description": "Herr Rajesh Naik ist eine erfahrene Führungspersönlichkeit in der Pharmaproduktion mit über 26 Jahren Erfahrung in führenden Organisationen, darunter Dr. Reddy’s Laboratories, GSK, Daiichi Sankyo (ehemals Daiichi-Ranbaxy), Piramal Enterprises, Teva, Biocon und Zydus Life Sciences. Er hat einen Abschluss in Chemieingenieurwesen vom Jawaharlal Nehru Engineering College, Aurangabad, und hat ein Executive Business Management Programm (CXO) am Indian Institute of Management Kozhikode absolviert. </br> </br>\nEr bringt tiefgreifende Expertise in technisch-kommerziellen Operationen mit, die Fertigung, Supply Chain Management, Engineering und Projekte, EHS, Projektmanagement für neue Produktentwicklungen, operative Exzellenz und technische Dienstleistungen (Prozess-Engineering) umfassen. Rajesh hat eine entscheidende Rolle bei der Steigerung der operativen Effizienz, der Einhaltung von Vorschriften und der nachhaltigen Fertigungspraktiken an mehreren Standorten gespielt. Er berichtet dem Managing Director & CEO und leitet ein strukturiertes Team, das die Funktionen Produktion, technische Dienstleistungen, Lager und PPIC umfasst und Exzellenz in der Liefersteuerung, der Einhaltung gesetzlicher Vorschriften und der Rentabilität gewährleistet.",
      "achievementsJson": "[]",
      "experience": "26+ Jahre",
      "education": "",
      "image": "/uploads/images/image-1761310866794-321392940.jpg",
      "color": "refex-blue",
      "order": 18,
      "isActive": true,
      "createdAt": "2025-10-24T13:01:15.000Z",
      "updatedAt": "2025-10-25T07:44:39.000Z",
      "achievements": []
  },
  {
      "id": 24,
      "name": "Dr. Mallikarjuna Rao",
      "position": "Head – India Operations, Extrovis",
      "category": "Management Team",
      "description": "-",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731302051-50532743.jpg",
      "color": "refex-blue",
      "order": 18,
      "isActive": true,
      "createdAt": "2025-10-25T08:33:30.000Z",
      "updatedAt": "2025-10-29T09:48:25.000Z",
      "achievements": []
  },
  {
      "id": 22,
      "name": "Dr. Suryanarayana Regulagadda",
      "position": "Global Head of Analytical Sciences - Extrovis",
      "category": "Management Team",
      "description": "Dr. Suryanarayana Regulagadda verfügt über mehr als zwei Jahrzehnte Erfahrung in der pharmazeutischen Industrie im Bereich Analytische Forschung & Entwicklung. Seine Expertise umfasst eine breite Palette von Peptiden und komplexen Molekülen, die Optimierung von Laborabläufen, die Gewährleistung robuster Methodenentwicklung und -validierung sowie die Speerspitze der Technologieeinführung innerhalb des regulatorischen Rahmens, die den Entwicklungen der USFDA, MHRA und ENVISA bei APIs und Formulierungen Rechnung trägt. Surya ist Postgraduierter in Chemie – er arbeitete bei Eugia Pharma, Alembic, Dr Reddy’s, Concord Laboratories und Qualitest Pharmaceuticals in den USA. Bei Extrovis leitet Surya das Portfolio für analytische Entwicklung und Dienstleistungen der Gruppe.",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731287745-13088173.jpg",
      "color": "refex-blue",
      "order": 19,
      "isActive": true,
      "createdAt": "2025-10-25T07:39:55.000Z",
      "updatedAt": "2025-11-20T07:04:16.000Z",
      "achievements": []
  },
  {
      "id": 16,
      "name": "Dr. Ramasubramanian S",
      "position": "Head of R&D – RLFC",
      "category": "Management Team",
      "description": "Dr. Ramasubramanian Shanmuganathan ist eine versierte Führungspersönlichkeit in der pharmazeutischen Forschung und Entwicklung mit über 29 Jahren Erfahrung in führenden Organisationen, darunter AstraZeneca, Syngene, Cadila Pharma, Jubilant Chemsys, Innovassynth Technologies, Recon, Sanmar Speciality Chemicals, Piramal Healthcare und Sai Advantium. </br> </br> Er besitzt einen Ph.D. in Chemie von der Bharathiar University, Coimbatore, und bringt tiefgreifendes wissenschaftliches Fachwissen mit, um Innovation, Pipeline-Entwicklung und Exzellenz in der Forschung voranzutreiben. Während seiner gesamten Karriere hat Dr. Ramasubramanian eine Schlüsselrolle bei der Weiterentwicklung von F&E-Kapazitäten, der Förderung wissenschaftlicher Innovation, der operativen Exzellenz und dem Beitrag zum Wachstum robuster Produktpipelines im Pharmasektor gespielt.",
      "achievementsJson": "[]",
      "experience": "29+ Jahre",
      "education": "PhD, Pharmazeutische Wissenschaften",
      "image": "/uploads/images/image-1761310953566-155149712.jpg",
      "color": "refex-blue",
      "order": 20,
      "isActive": true,
      "createdAt": "2025-10-24T13:02:39.000Z",
      "updatedAt": "2025-10-25T07:45:07.000Z",
      "achievements": []
  },
  {
      "id": 23,
      "name": "Maharshi Maitra",
      "position": "COS - Refex Group",
      "category": "Management Team",
      "description": "-",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731272675-710723872.jpg",
      "color": "refex-blue",
      "order": 21,
      "isActive": true,
      "createdAt": "2025-10-25T07:40:49.000Z",
      "updatedAt": "2025-10-29T09:47:55.000Z",
      "achievements": []
  }
]

 const frManagementTeam = [
  {
      "id": 7,
      "name": "Anil Jain",
      "position": "Président & Directeur Général – Refex Group",
      "category": "Équipe de direction",
      "description": "Anil Jain est le Directeur Général du Refex Group. Intrinsèquement entreprenant et audacieux depuis l'enfance, le commerce est venu naturellement à Anil. Dès l'âge de 17 ans, Anil a commencé à passer du temps dans l'entreprise familiale de négoce d'acier inoxydable. Sa passion pour l'identification des opportunités l'a conduit dans le domaine des gaz réfrigérants, lors d'une réunion avec un grand fabricant de climatiseurs. En 2002, il a posé la première pierre pour la création de sa première usine de remplissage de gaz réfrigérant sous le nom de Refex Refrigerants Limited (maintenant Refex Industries Limited). Depuis lors, il n'a cessé d'avancer ! Anil a lentement et régulièrement élargi son horizon commercial, et Refex s'est aventuré dans divers domaines d'activité tels que les énergies renouvelables, les cendres et le charbon, la pharmacie, le capital-risque, le transport aéroportuaire, la technologie médicale, la mobilité verte et le commerce d'électricité.</br></br>\nTout au long de son parcours, Anil a été un mentor pour de nombreux entrepreneurs. Il souhaitait pouvoir encadrer davantage de start-ups et leur donner les ressources et la plateforme dont elles avaient besoin pour réussir. Il a réussi à créer de nombreux entrepreneurs de ce type.</br></br>\nAnil est fortement engagé en faveur de la durabilité et veille à ce que le modèle commercial de Refex reflète la même éthique. Pour tout cela et bien plus encore, Anil a remporté plusieurs distinctions de l'industrie telles que le « Trailblazer of Tamil Nadu », le « Young Entrepreneur » du Times Group, le Stevie Award du Royaume-Uni, le prix Dun & Bradstreet Top 100 PME, etc. Le Refex Group, sous sa direction, a été certifié « Great Place to Work » par GPTW pendant 2 années consécutives.",
      "achievementsJson": "[]",
      "experience": "40+ Ans",
      "education": "Leadership entrepreneurial",
      "image": "/uploads/images/image-1761115782807-909466776.jpg",
      "color": "refex-blue",
      "order": 7,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-24T13:07:36.000Z",
      "achievements": []
  },
  {
      "id": 8,
      "name": "Dinesh Agarwal",
      "position": "PDG du Groupe – Refex Group",
      "category": "Équipe de direction",
      "description": "M. Dinesh Kumar Agarwal possède des compétences entrepreneuriales raffinées dans divers domaines d'activité, contribuant à un succès constant dans toutes ses entreprises. Depuis 2014, son expertise, combinée à sa passion et à son zèle pour développer l'activité de la Société, a accéléré notre trajectoire de croissance. </br> </br> Le sens des chiffres de M. Dinesh a facilité la croissance de plusieurs entreprises, tandis que son expertise en finance d'entreprise, couvrant l'audit, la comptabilité et la planification financières, les impôts et la collecte de fonds, a aidé à lever plus de 5 000 Crores ₹ (environ 50 milliards de roupies) pour ses clients. Il a travaillé avec des organisations réputées comme Aircel et Brisk et possède une expérience diversifiée dans les segments EPC solaire et les projets à l'échelle des services publics. Il a également été consultant pour des start-ups, des PME, des grandes entreprises établies et des ONG internationales et a remporté plusieurs reconnaissances de l'industrie pour sa contribution au domaine du management et aux domaines connexes.",
      "achievementsJson": "[\"Expert-comptable agréé avec plus de 20 ans d'expérience\",\"Reconnu pour sa perspicacité stratégique et son exécution\",\"A façonné la croissance de Refex vers un succès durable\",\"Expert en stratégie financière et en opérations\",\"Leader en transformation d'entreprise\"]",
      "experience": "20+ Ans",
      "education": "Expert-comptable agréé",
      "image": "/uploads/images/image-1761115796543-933758637.jpg",
      "color": "refex-green",
      "order": 8,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-24T13:07:44.000Z",
      "achievements": [
          "Expert-comptable agréé avec plus de 20 ans d'expérience",
          "Reconnu pour sa perspicacité stratégique et son exécution",
          "A façonné la croissance de Refex vers un succès durable",
          "Expert en stratégie financière et en opérations",
          "Leader en transformation d'entreprise"
      ]
  },
  {
      "id": 9,
      "name": "Hanumantha Rao Kamma",
      "position": "PDG – RLS",
      "category": "Équipe de direction",
      "description": "Hanumanth Rao Kamma (Hans) est titulaire d'une maîtrise en management international de l'Université Centrale de Pondicherry, en Inde. Il combine une solide connaissance des tendances de l'industrie et de la stratégie de portefeuille avec un vaste réseau professionnel. Avant d'occuper son poste chez Extrovis Suisse, Hanumantha a occupé diverses fonctions de direction dans les domaines de l'approvisionnement stratégique, de la gestion de portefeuille et du développement commercial stratégique chez Amneal, Ranbaxy et Dr. Reddy’s.",
      "achievementsJson": "[]",
      "experience": "23+ Ans",
      "education": "Maîtrise en Management International",
      "image": "/uploads/images/image-1761738716293-127419594.jpg",
      "color": "refex-orange",
      "order": 9,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-29T11:52:00.000Z",
      "achievements": []
  },
  {
      "id": 13,
      "name": "PV Raghavendra Rao",
      "position": "Directeur Financier (CFO) – RLS",
      "category": "Équipe de direction",
      "description": "Raghav est un expert-comptable agréé accompli et un leader financier avec environ 25 ans d'expérience dans la gestion financière. Son expertise s'étend à la comptabilité, la planification financière, la budgétisation, les prix de transfert, la fiscalité, l'établissement des coûts et la gestion de trésorerie, y compris la gestion des flux de trésorerie, la couverture et l'obtention de fonds auprès des banques.</br></br>\n\nRaghav a occupé des postes de direction financière importants tels que celui de Directeur Financier chez Sequent Scientific Limited, Macleods Pharmaceuticals Ltd et Solara Active Pharma Sciences. Il a acquis une expertise substantielle en finance d'entreprise grâce à divers rôles chez Dr. Reddy's Laboratories.</br></br>\n\nRaghav possède une compréhension approfondie du développement et de la mise en œuvre de stratégies. Au cours de sa carrière, Raghav a contribué en tant que conseiller et consultant, jouant des rôles clés au sein des comités de pilotage financier, des conseils de leadership d'entreprise et des comités de pilotage conjoints.",
      "achievementsJson": "[\"CA avec 25 ans en gestion financière\",\"Ancien CFO chez Sequent, Macleods & Solara\",\"14 ans d'expérience chez Dr. Reddy's\",\"Expert en FP&A, fiscalité, trésorerie & stratégie\",\"Détenteur du Certificat Exécutif Maître Goldratt\"]",
      "experience": "25+ Ans",
      "education": "CA, Certificat Exécutif Maître Goldratt",
      "image": "/uploads/images/image-1761115929803-567823080.jpg",
      "color": "refex-blue",
      "order": 10,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T05:39:02.000Z",
      "achievements": [
          "CA avec 25 ans en gestion financière",
          "Ancien CFO chez Sequent, Macleods & Solara",
          "14 ans d'expérience chez Dr. Reddy's",
          "Expert en FP&A, fiscalité, trésorerie & stratégie",
          "Détenteur du Certificat Exécutif Maître Goldratt"
      ]
  },
  {
      "id": 14,
      "name": "Srinivasan Pagadala",
      "position": "Directeur des Ressources Humaines (CHRO) – RLS",
      "category": "Équipe de direction",
      "description": "Srini possède plus de 25 ans d'expérience étendue dans la gestion des ressources humaines dans les secteurs de la pharmacie et de la santé. Il est spécialisé dans les RH d'entreprise, le leadership et la transformation du changement, la gestion des talents et les relations avec les employés. Tout au long de sa carrière, il a occupé divers postes de haut niveau et de responsabilité en RH dans les principales organisations pharmaceutiques telles que Dr. Reddy's, Novartis, GVK Bio et Biological E. Avant son rôle actuel chez Extrovis, Srini dirigeait la fonction RH chez Solara Active Pharma.",
      "achievementsJson": "[\"25+ ans en RH dans les secteurs de la pharmacie et de la santé\",\"Spécialiste des talents, de la transformation et des relations avec les employés\",\"Ancienne expérience chez Dr. Reddy's, Novartis, GVK Bio\",\"Expérience chez Biological E et Solara Active Pharma\",\"Expert en développement organisationnel\"]",
      "experience": "25+ Ans",
      "education": "RH & Développement Organisationnel",
      "image": "/uploads/images/image-1761115945624-842176624.jpg",
      "color": "refex-green",
      "order": 11,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T05:39:18.000Z",
      "achievements": [
          "25+ ans en RH dans les secteurs de la pharmacie et de la santé",
          "Spécialiste des talents, de la transformation et des relations avec les employés",
          "Ancienne expérience chez Dr. Reddy's, Novartis, GVK Bio",
          "Expérience chez Biological E et Solara Active Pharma",
          "Expert en développement organisationnel"
      ]
  },
  {
      "id": 10,
      "name": "Sharat Narasapur",
      "position": "PDG – RLFC",
      "category": "Équipe de direction",
      "description": "Sharat Narasapur est un leader chevronné avec plus de 35 ans d'expérience dans les secteurs de la chimie, de l'agrochimie et de la pharmacie. En tant que Directeur Général et PDG de R L Fine Chem Pvt. Ltd., il apporte une expertise technique approfondie, une vision stratégique et une approche pratique pour stimuler l'innovation et l'excellence opérationnelle.</br> </br>\nAncien élève de l'Institute of Chemical Technology de Mumbai et du programme Business Leaders de l'IIM Calcutta, Sharat a dirigé des fonctions clés dans le transfert de technologie, la conformité aux BPF, les affaires réglementaires, l'ingénierie des processus et le développement commercial.</br> </br>\nSes rôles de leadership chez Dr. Reddy's Laboratories, Sequent Scientific, Aurobindo Pharma et Alivira Animal Health reflètent sa capacité avérée à gérer des projets complexes, à optimiser les processus et à bâtir des équipes très performantes.</br> </br>\nSharat continue de défendre la croissance durable et l'innovation dans l'industrie pharmaceutique et est également administrateur non exécutif chez Alivira Animal Health Ltd.",
      "achievementsJson": "[]",
      "experience": "25+ Ans",
      "education": "Leadership Chimique & Pharmaceutique",
      "image": "/uploads/images/image-1761115827343-908977995.jpg",
      "color": "refex-blue",
      "order": 12,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T05:39:37.000Z",
      "achievements": []
  },
  {
      "id": 17,
      "name": "Mathijs Steegstra",
      "position": "Responsable mondial des affaires scientifiques, Extrovis",
      "category": "Équipe de direction",
      "description": "Mathijs Steegstra a travaillé dans l'industrie pharmaceutique pendant plus de 20 ans, toujours dans des rôles de Qualité et de Réglementation couvrant les États-Unis, l'Europe et le MENA. Avec une expérience à la fois chez les innovateurs et les génériques, il a mis en place des infrastructures d'affaires réglementaires pour les entreprises nouvellement formées et les a optimisées pour les entreprises établies. </br> </br>\n\nIl a obtenu de multiples autorisations de mise sur le marché pour divers types de produits, allant des NCE aux molécules réorientées en passant par les génériques complexes. Il était responsable de la qualité de plusieurs sites, y compris des sites de production stérile, et a géré des projets d'assainissement pour plusieurs sites. Originaire des Pays-Bas, il a étudié la pharmacie à l'Université de Groningen et est titulaire d'un diplôme de pharmacien, spécialisé en pharmacologie moléculaire.",
      "achievementsJson": "[]",
      "experience": "20+ Ans",
      "education": "Diplômé en Pharmacie, Groningen",
      "image": "/uploads/images/image-1761311021922-916597178.jpg",
      "color": "refex-blue",
      "order": 13,
      "isActive": true,
      "createdAt": "2025-10-24T13:03:45.000Z",
      "updatedAt": "2025-10-25T07:46:07.000Z",
      "achievements": []
  },
  {
      "id": 20,
      "name": "Andrea Gazzaneo",
      "position": "Responsable MSAT Monde - Latina Pharma",
      "category": "Équipe de direction",
      "description": "Andrea Gazzaneo a plus de 25 ans d'expérience, en R&D et en Production, acquise dans des sociétés pharmaceutiques italiennes (Italfarmaco et Fidia Farmaceutici) et internationales (Novartis, Pfizer, Corden Pharma) en chimie pharmaceutique (API, API optiquement actifs, API stériles et lyophilisés, antibiotiques, vaccins, HPD), en Transfert de Technologie (à la fois dans le domaine chimique et pharmaceutique), en mise à l'échelle des processus, en fabrication et conditionnement de diverses formes pharmaceutiques (granulés et solides oraux (stériles et non stériles), antibiotiques, vaccins (produit en vrac et formes posologiques finies), HPD, produits lyophilisés, produits injectables sous forme liquide, solide, semi-solide ; gazes (stériles et non stériles), pommades (stériles et non stériles), crèmes (stériles et non stériles), gels (stériles et non stériles) ; seringues préremplies, collyres unidoses stériles, collyres multidoses stériles, médicaments à usage vétérinaire, dispositifs médicaux).",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731339458-521205392.jpg",
      "color": "refex-blue",
      "order": 14,
      "isActive": true,
      "createdAt": "2025-10-25T06:27:52.000Z",
      "updatedAt": "2025-11-20T07:04:42.000Z",
      "achievements": []
  },
  {
      "id": 19,
      "name": "Danny Cracchiolo",
      "position": "Directeur du Site - Kavis Pharma",
      "category": "Équipe de direction",
      "description": "Danny Cracchiolo est le Directeur Général de l'installation de fabrication de Kavis Pharma à Sugar Land, Texas, où il supervise tous les aspects des opérations du site, y compris la fabrication, la qualité, la conformité réglementaire, la chaîne d'approvisionnement, l'ingénierie et la performance financière. Avec plus de 25 ans d'expérience dans le secteur pharmaceutique, Danny a dirigé des équipes sur des plateformes de produits stériles, non stériles, spécialisés et complexes. </br> </br>\n\nLa carrière de Danny a commencé chez Parkedale (King) Pharmaceuticals, où il a soutenu les opérations de qualité et les processus techniques. Il a ensuite progressé vers des rôles de leadership en fabrication chez JHP Pharmaceuticals et DPT Laboratories, acquérant une vaste expertise en fabrication BPF, en compounding, en transfert technique et en excellence opérationnelle. Après avoir occupé plusieurs postes de direction opérationnelle chez DPT, Danny a été promu Directeur des Opérations sur le site de Sugar Land. Suite à la transition du site vers Kavis Pharma, Danny a été nommé Directeur Général, poursuivant son leadership des opérations du site sous la nouvelle structure d'entreprise. </br> </br>\n\nDanny est titulaire d'un baccalauréat ès sciences en biochimie de l'Université d'Oakland. Il est reconnu pour son expérience étendue dans les exigences réglementaires de la FDA, de l'OSHA et de l'EPA, la fabrication au plus juste (lean manufacturing), la gestion du changement et le développement organisationnel. Son style de leadership est centré sur la construction d'équipes hautement performantes, le renforcement de la responsabilité et la promotion de l'amélioration continue. Danny s'engage à garantir que l'installation de Sugar Land livre constamment des produits pharmaceutiques de haute qualité avec fiabilité, efficacité et une forte culture de conformité.",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731352378-381340691.jpg",
      "color": "refex-blue",
      "order": 15,
      "isActive": true,
      "createdAt": "2025-10-25T06:26:57.000Z",
      "updatedAt": "2025-11-20T07:02:56.000Z",
      "achievements": []
  },
  {
      "id": 21,
      "name": "Krisztián Varga",
      "position": "Directeur du Site – Pharma Pack",
      "category": "Équipe de direction",
      "description": "Krisztián apporte plus de deux décennies d'expérience en leadership dans les industries de l'automobile, de l'électronique, de la chimie et de la fabrication sur mesure. Titulaire de diplômes en génie mécanique, en économie et d'un MBA, il a bâti sa carrière sur la direction de projets complexes, la mise en forme et la restructuration d'organisations, et la promotion de l'excellence opérationnelle basée sur la méthode Lean. Son expérience couvre la gestion d'unités de production, la conduite d'améliorations de processus de bout en bout et la direction de petites équipes opérationnelles et de bureau, ainsi que de grandes divisions de fabrication internationales. </br> </br>\n\nIl a rejoint Pharma Pack Hungary Kft. en 2020 avec un mandat clair de bâtir une organisation pharmaceutique conforme aux BPD/BPF, flexible et durable à long terme. Depuis lors, il a renforcé son expertise pharmaceutique par une participation active aux audits BPD/BPF nationaux et internationaux, aux inspections des autorités et à l'établissement d'un nouveau site de fabrication, qu'il continue d'agrandir et d'optimiser.",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731369944-821221641.jpg",
      "color": "refex-blue",
      "order": 15,
      "isActive": true,
      "createdAt": "2025-10-25T07:39:03.000Z",
      "updatedAt": "2025-11-20T07:03:28.000Z",
      "achievements": []
  },
  {
      "id": 18,
      "name": "Amit Tiwari",
      "position": "Directeur Commercial (CMO) – Extrovis",
      "category": "Équipe de direction",
      "description": "-",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761738744230-894727949.jpg",
      "color": "refex-blue",
      "order": 16,
      "isActive": true,
      "createdAt": "2025-10-25T06:09:20.000Z",
      "updatedAt": "2025-10-29T11:52:28.000Z",
      "achievements": []
  },
  {
      "id": 12,
      "name": "Amit Shrivastava",
      "position": "Directeur Commercial (CMO) – RLFC",
      "category": "Équipe de direction",
      "description": "Amit Shrivastava est un leader chevronné du marketing pharmaceutique avec plus de 25 ans d'expérience dans le développement commercial mondial et le marketing stratégique. Il a occupé des postes de direction dans des organisations telles que Zenfold Sustainable Technologies, Smilax Laboratories, Sun Pharma et Biocon, où il a dirigé les opérations de marketing à travers le monde. Amit possède une solide expérience en analyse de marché, en planification stratégique et en vente de produits pharmaceutiques. </br> </br> Il est titulaire d'un MBA et a obtenu un Certificat en Entrepreneurship Essential de la Harvard Business School. Basé à Bangalore, en Inde, Amit continue de stimuler la croissance et l'innovation dans le secteur pharmaceutique.",
      "achievementsJson": "[]",
      "experience": "20+ Ans",
      "education": "Stratégie Marketing & Commerciale",
      "image": "/uploads/images/image-1761115864389-841586860.jpg",
      "color": "refex-orange",
      "order": 17,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T08:40:35.000Z",
      "achievements": []
  },
  {
      "id": 15,
      "name": "Rajesh Naik",
      "position": "Directeur Exécutif (ED) – Opérations, RLFC",
      "category": "Équipe de direction",
      "description": "M. Rajesh Naik est un leader expérimenté des opérations pharmaceutiques avec plus de 26 ans d'expérience au sein d'organisations de premier plan, notamment Dr. Reddy's Laboratories, GSK, Daiichi Sankyo (anciennement Daiichi-Ranbaxy), Piramal Enterprises, Teva, Biocon et Zydus Life Sciences. Diplômé en génie chimique du Jawaharlal Nehru Engineering College, Aurangabad, et du programme de gestion d'entreprise exécutive (CXO) de l'Indian Institute of Management Kozhikode. </br> </br>\nIl apporte une expertise approfondie dans les opérations technico-commerciales, englobant la fabrication, la gestion de la chaîne d'approvisionnement, l'ingénierie et les projets, l'EHS, la gestion de projet de développement de nouveaux produits, l'excellence opérationnelle et les services techniques (ingénierie des processus). Rajesh a joué un rôle central dans la promotion de l'efficacité opérationnelle, de la conformité et des pratiques de fabrication durable sur plusieurs sites. Il rend compte au Directeur Général et PDG et dirige une équipe structurée comprenant les fonctions de production, de services techniques, d'entrepôt et de PPIC, assurant l'excellence dans la gestion des livraisons, la conformité réglementaire et la rentabilité.",
      "achievementsJson": "[]",
      "experience": "26+ Ans",
      "education": "",
      "image": "/uploads/images/image-1761310866794-321392940.jpg",
      "color": "refex-blue",
      "order": 18,
      "isActive": true,
      "createdAt": "2025-10-24T13:01:15.000Z",
      "updatedAt": "2025-10-25T07:44:39.000Z",
      "achievements": []
  },
  {
      "id": 24,
      "name": "Dr. Mallikarjuna Rao",
      "position": "Responsable des opérations Inde, Extrovis",
      "category": "Équipe de direction",
      "description": "-",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731302051-50532743.jpg",
      "color": "refex-blue",
      "order": 18,
      "isActive": true,
      "createdAt": "2025-10-25T08:33:30.000Z",
      "updatedAt": "2025-10-29T09:48:25.000Z",
      "achievements": []
  },
  {
      "id": 22,
      "name": "Dr. Suryanarayana Regulagadda",
      "position": "Responsable mondial des sciences analytiques - Extrovis",
      "category": "Équipe de direction",
      "description": "Dr. Suryanarayana Regulagadda a plus de deux décennies d'expérience dans l'industrie pharmaceutique en Recherche et Développement Analytique. Son expertise couvre un large éventail de peptides et de molécules complexes, l'optimisation des opérations de laboratoire, l'assurance du développement et de la validation de méthodes robustes, et la direction de l'adoption de technologies dans le cadre réglementaire, répondant aux développements de l'USFDA, MHRA et ENVISA pour les API et les formulations. Surya est titulaire d'un diplôme de troisième cycle en chimie – il a travaillé avec Eugia Pharma, Alembic, Dr Reddy’s, Concord Laboratories, Qualitest Pharmaceuticals aux États-Unis. Chez Extrovis, Surya dirige le portefeuille de développement analytique et de services pour le groupe.",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731287745-13088173.jpg",
      "color": "refex-blue",
      "order": 19,
      "isActive": true,
      "createdAt": "2025-10-25T07:39:55.000Z",
      "updatedAt": "2025-11-20T07:04:16.000Z",
      "achievements": []
  },
  {
      "id": 16,
      "name": "Dr. Ramasubramanian S",
      "position": "Responsable R&D – RLFC",
      "category": "Équipe de direction",
      "description": "Dr. Ramasubramanian Shanmuganathan est un leader accompli en R&D pharmaceutique avec plus de 29 ans d'expérience dans des organisations de premier plan, notamment AstraZeneca, Syngene, Cadila Pharma, Jubilant Chemsys, Innovassynth Technologies, Recon, Sanmar Speciality Chemicals, Piramal Healthcare et Sai Advantium. </br> </br> Il est titulaire d'un Ph.D. en chimie de l'Université Bharathiar, Coimbatore, et apporte une expertise scientifique approfondie pour stimuler l'innovation, le développement de pipeline et l'excellence de la recherche. Tout au long de sa carrière, le Dr Ramasubramanian a joué un rôle clé dans l'avancement des capacités de R&D, la promotion de l'innovation scientifique, l'excellence opérationnelle et la contribution à la croissance de pipelines de produits robustes dans le secteur pharmaceutique.",
      "achievementsJson": "[]",
      "experience": "29+ Ans",
      "education": "PhD, Sciences Pharmaceutiques",
      "image": "/uploads/images/image-1761310953566-155149712.jpg",
      "color": "refex-blue",
      "order": 20,
      "isActive": true,
      "createdAt": "2025-10-24T13:02:39.000Z",
      "updatedAt": "2025-10-25T07:45:07.000Z",
      "achievements": []
  },
  {
      "id": 23,
      "name": "Maharshi Maitra",
      "position": "Chef de Cabinet (COS) - Refex Group",
      "category": "Équipe de direction",
      "description": "-",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731272675-710723872.jpg",
      "color": "refex-blue",
      "order": 21,
      "isActive": true,
      "createdAt": "2025-10-25T07:40:49.000Z",
      "updatedAt": "2025-10-29T09:47:55.000Z",
      "achievements": []
  }
]

  const itManagementTeam = [
  {
      "id": 7,
      "name": "Anil Jain",
      "position": "Président & DG – Refex Group",
      "category": "Équipe de direction",
      "description": "Anil Jain est le Directeur Général du Refex Group. Intrinsèquement entreprenant et audacieux depuis l'enfance, le commerce est venu naturellement à Anil. Dès l'âge de 17 ans, Anil a commencé à passer du temps dans l'entreprise familiale de négoce d'acier inoxydable. Sa passion pour l'identification des opportunités l'a conduit dans le domaine des gaz réfrigérants, lors d'une réunion avec un grand fabricant de climatiseurs. En 2002, il a posé la première pierre pour la création de sa première usine de remplissage de gaz réfrigérant sous le nom de Refex Refrigerants Limited (maintenant Refex Industries Limited). Depuis lors, il n'a cessé d'avancer ! Anil a lentement et régulièrement élargi son horizon commercial, et Refex s'est aventuré dans divers domaines d'activité tels que les énergies renouvelables, les cendres et le charbon, la pharmacie, le capital-risque, le transport aéroportuaire, la technologie médicale, la mobilité verte et le commerce d'électricité.</br></br>\nTout au long de son parcours, Anil a été un mentor pour de nombreux entrepreneurs. Il souhaitait pouvoir encadrer davantage de start-ups et leur donner les ressources et la plateforme dont elles avaient besoin pour réussir. Il a réussi à créer de nombreux entrepreneurs de ce type.</br></br>\nAnil est fortement engagé en faveur de la durabilité et veille à ce que le modèle commercial de Refex reflète la même éthique. Pour tout cela et bien plus encore, Anil a remporté plusieurs distinctions de l'industrie telles que le « Trailblazer of Tamil Nadu », le « Young Entrepreneur » du Times Group, le Stevie Award du Royaume-Uni, le prix Dun & Bradstreet Top 100 PME, etc. Le Refex Group, sous sa direction, a été certifié « Great Place to Work » par GPTW pendant 2 années consécutives.",
      "achievementsJson": "[]",
      "experience": "40+ Ans",
      "education": "Leadership entrepreneurial",
      "image": "/uploads/images/image-1761115782807-909466776.jpg",
      "color": "refex-blue",
      "order": 7,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-24T13:07:36.000Z",
      "achievements": []
  },
  {
      "id": 8,
      "name": "Dinesh Agarwal",
      "position": "PDG du Groupe – Refex Group",
      "category": "Équipe de direction",
      "description": "M. Dinesh Kumar Agarwal possède des compétences entrepreneuriales raffinées dans divers domaines d'activité, contribuant à un succès constant dans toutes ses entreprises. Depuis 2014, son expertise, combinée à sa passion et à son zèle pour développer l'activité de la Société, a accéléré notre trajectoire de croissance. </br> </br> Le sens des chiffres de M. Dinesh a facilité la croissance de plusieurs entreprises, tandis que son expertise en finance d'entreprise, couvrant l'audit, la comptabilité et la planification financières, les impôts et la collecte de fonds, a aidé à lever plus de 5 000 Crores ₹ (environ 50 milliards de roupies) pour ses clients. Il a travaillé avec des organisations réputées comme Aircel et Brisk et possède une expérience diversifiée dans les segments EPC solaire et les projets à l'échelle des services publics. Il a également été consultant pour des start-ups, des PME, des grandes entreprises établies et des ONG internationales et a remporté plusieurs reconnaissances de l'industrie pour sa contribution au domaine du management et aux domaines connexes.",
      "achievementsJson": "[\"Expert-comptable agréé avec plus de 20 ans d'expérience\",\"Reconnu pour sa perspicacité stratégique et son exécution\",\"A façonné la croissance de Refex vers un succès durable\",\"Expert en stratégie financière et en opérations\",\"Leader en transformation d'entreprise\"]",
      "experience": "20+ Ans",
      "education": "Expert-comptable agréé",
      "image": "/uploads/images/image-1761115796543-933758637.jpg",
      "color": "refex-green",
      "order": 8,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-24T13:07:44.000Z",
      "achievements": [
          "Expert-comptable agréé avec plus de 20 ans d'expérience",
          "Reconnu pour sa perspicacité stratégique et son exécution",
          "A façonné la croissance de Refex vers un succès durable",
          "Expert en stratégie financière et en opérations",
          "Leader en transformation d'entreprise"
      ]
  },
  {
      "id": 9,
      "name": "Hanumantha Rao Kamma",
      "position": "PDG – RLS",
      "category": "Équipe de direction",
      "description": "Hanumanth Rao Kamma (Hans) est titulaire d'une maîtrise en management international de l'Université Centrale de Pondicherry, en Inde. Il combine une solide connaissance des tendances de l'industrie et de la stratégie de portefeuille avec un vaste réseau professionnel. Avant d'occuper son poste chez Extrovis Suisse, Hanumantha a occupé diverses fonctions de direction dans les domaines de l'approvisionnement stratégique, de la gestion de portefeuille et du développement commercial stratégique chez Amneal, Ranbaxy et Dr. Reddy’s.",
      "achievementsJson": "[]",
      "experience": "23+ Ans",
      "education": "Maîtrise en Management International",
      "image": "/uploads/images/image-1761738716293-127419594.jpg",
      "color": "refex-orange",
      "order": 9,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-29T11:52:00.000Z",
      "achievements": []
  },
  {
      "id": 13,
      "name": "PV Raghavendra Rao",
      "position": "Directeur Financier (CFO) – RLS",
      "category": "Équipe de direction",
      "description": "Raghav est un expert-comptable agréé accompli et un leader financier avec environ 25 ans d'expérience dans la gestion financière. Son expertise s'étend à la comptabilité, la planification financière, la budgétisation, les prix de transfert, la fiscalité, l'établissement des coûts et la gestion de trésorerie, y compris la gestion des flux de trésorerie, la couverture et l'obtention de fonds auprès des banques.</br></br>\n\nRaghav a occupé des postes de direction financière importants tels que celui de Directeur Financier chez Sequent Scientific Limited, Macleods Pharmaceuticals Ltd et Solara Active Pharma Sciences. Il a acquis une expertise substantielle en finance d'entreprise grâce à divers rôles chez Dr. Reddy's Laboratories.</br></br>\n\nRaghav possède une compréhension approfondie du développement et de la mise en œuvre de stratégies. Au cours de sa carrière, Raghav a contribué en tant que conseiller et consultant, jouant des rôles clés au sein des comités de pilotage financier, des conseils de leadership d'entreprise et des comités de pilotage conjoints.",
      "achievementsJson": "[\"CA avec 25 ans en gestion financière\",\"Ancien CFO chez Sequent, Macleods & Solara\",\"14 ans d'expérience chez Dr. Reddy's\",\"Expert en FP&A, fiscalité, trésorerie & stratégie\",\"Détenteur du Certificat Exécutif Maître Goldratt\"]",
      "experience": "25+ Ans",
      "education": "CA, Certificat Exécutif Maître Goldratt",
      "image": "/uploads/images/image-1761115929803-567823080.jpg",
      "color": "refex-blue",
      "order": 10,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T05:39:02.000Z",
      "achievements": [
          "CA avec 25 ans en gestion financière",
          "Ancien CFO chez Sequent, Macleods & Solara",
          "14 ans d'expérience chez Dr. Reddy's",
          "Expert en FP&A, fiscalité, trésorerie & stratégie",
          "Détenteur du Certificat Exécutif Maître Goldratt"
      ]
  },
  {
      "id": 14,
      "name": "Srinivasan Pagadala",
      "position": "Directeur des RH (CHRO) – RLS",
      "category": "Équipe de direction",
      "description": "Srini possède plus de 25 ans d'expérience étendue dans la gestion des ressources humaines dans les secteurs de la pharmacie et de la santé. Il est spécialisé dans les RH d'entreprise, le leadership et la transformation du changement, la gestion des talents et les relations avec les employés. Tout au long de sa carrière, il a occupé divers postes de haut niveau et de responsabilité en RH dans les principales organisations pharmaceutiques telles que Dr. Reddy's, Novartis, GVK Bio et Biological E. Avant son rôle actuel chez Extrovis, Srini dirigeait la fonction RH chez Solara Active Pharma.",
      "achievementsJson": "[\"25+ ans en RH dans les secteurs de la pharmacie et de la santé\",\"Spécialiste des talents, de la transformation et des relations avec les employés\",\"Ancienne expérience chez Dr. Reddy's, Novartis, GVK Bio\",\"Expérience chez Biological E et Solara Active Pharma\",\"Expert en développement organisationnel\"]",
      "experience": "25+ Ans",
      "education": "RH & Développement Organisationnel",
      "image": "/uploads/images/image-1761115945624-842176624.jpg",
      "color": "refex-green",
      "order": 11,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T05:39:18.000Z",
      "achievements": [
          "25+ ans en RH dans les secteurs de la pharmacie et de la santé",
          "Spécialiste des talents, de la transformation et des relations avec les employés",
          "Ancienne expérience chez Dr. Reddy's, Novartis, GVK Bio",
          "Expérience chez Biological E et Solara Active Pharma",
          "Expert en développement organisationnel"
      ]
  },
  {
      "id": 10,
      "name": "Sharat Narasapur",
      "position": "PDG – RLFC",
      "category": "Équipe de direction",
      "description": "Sharat Narasapur est un leader chevronné avec plus de 35 ans d'expérience dans les secteurs de la chimie, de l'agrochimie et de la pharmacie. En tant que Directeur Général et PDG de R L Fine Chem Pvt. Ltd., il apporte une expertise technique approfondie, une vision stratégique et une approche pratique pour stimuler l'innovation et l'excellence opérationnelle.</br> </br>\nAncien élève de l'Institute of Chemical Technology de Mumbai et du programme Business Leaders de l'IIM Calcutta, Sharat a dirigé des fonctions clés dans le transfert de technologie, la conformité aux BPF, les affaires réglementaires, l'ingénierie des processus et le développement commercial.</br> </br>\nSes rôles de leadership chez Dr. Reddy's Laboratories, Sequent Scientific, Aurobindo Pharma et Alivira Animal Health reflètent sa capacité avérée à gérer des projets complexes, à optimiser les processus et à bâtir des équipes très performantes.</br> </br>\nSharat continue de défendre la croissance durable et l'innovation dans l'industrie pharmaceutique et est également administrateur non exécutif chez Alivira Animal Health Ltd.",
      "achievementsJson": "[]",
      "experience": "25+ Ans",
      "education": "Leadership Chimique & Pharmaceutique",
      "image": "/uploads/images/image-1761115827343-908977995.jpg",
      "color": "refex-blue",
      "order": 12,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T05:39:37.000Z",
      "achievements": []
  },
  {
      "id": 17,
      "name": "Mathijs Steegstra",
      "position": "Responsable mondial des affaires scientifiques, Extrovis",
      "category": "Équipe de direction",
      "description": "Mathijs Steegstra a travaillé dans l'industrie pharmaceutique pendant plus de 20 ans, toujours dans des rôles de Qualité et de Réglementation couvrant les États-Unis, l'Europe et le MENA. Avec une expérience à la fois chez les innovateurs et les génériques, il a mis en place des infrastructures d'affaires réglementaires pour les entreprises nouvellement formées et les a optimisées pour les entreprises établies. </br> </br>\n\nIl a obtenu de multiples autorisations de mise sur le marché pour divers types de produits, allant des NCE aux molécules réorientées en passant par les génériques complexes. Il était responsable de la qualité de plusieurs sites, y compris des sites de production stérile, et a géré des projets d'assainissement pour plusieurs sites. Originaire des Pays-Bas, il a étudié la pharmacie à l'Université de Groningen et est titulaire d'un diplôme de pharmacien, spécialisé en pharmacologie moléculaire.",
      "achievementsJson": "[]",
      "experience": "20+ Ans",
      "education": "Diplômé en Pharmacie, Groningen",
      "image": "/uploads/images/image-1761311021922-916597178.jpg",
      "color": "refex-blue",
      "order": 13,
      "isActive": true,
      "createdAt": "2025-10-24T13:03:45.000Z",
      "updatedAt": "2025-10-25T07:46:07.000Z",
      "achievements": []
  },
  {
      "id": 20,
      "name": "Andrea Gazzaneo",
      "position": "Responsable MSAT Monde - Latina Pharma",
      "category": "Équipe de direction",
      "description": "Andrea Gazzaneo a plus de 25 ans d'expérience, en R&D et en Production, acquise dans des sociétés pharmaceutiques italiennes (Italfarmaco et Fidia Farmaceutici) et internationales (Novartis, Pfizer, Corden Pharma) en chimie pharmaceutique (API, API optiquement actifs, API stériles et lyophilisés, antibiotiques, vaccins, HPD), en Transfert de Technologie (à la fois dans le domaine chimique et pharmaceutique), en mise à l'échelle des processus, en fabrication et conditionnement de diverses formes pharmaceutiques (granulés et solides oraux (stériles et non stériles), antibiotiques, vaccins (produit en vrac et formes posologiques finies), HPD, produits lyophilisés, produits injectables sous forme liquide, solide, semi-solide ; gazes (stériles et non stériles), pommades (stériles et non stériles), crèmes (stériles et non stériles), gels (stériles et non stériles) ; seringues préremplies, collyres unidoses stériles, collyres multidoses stériles, médicaments à usage vétérinaire, dispositifs médicaux).",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731339458-521205392.jpg",
      "color": "refex-blue",
      "order": 14,
      "isActive": true,
      "createdAt": "2025-10-25T06:27:52.000Z",
      "updatedAt": "2025-11-20T07:04:42.000Z",
      "achievements": []
  },
  {
      "id": 19,
      "name": "Danny Cracchiolo",
      "position": "Directeur du Site - Kavis Pharma",
      "category": "Équipe de direction",
      "description": "Danny Cracchiolo est le Directeur Général de l'installation de fabrication de Kavis Pharma à Sugar Land, Texas, où il supervise tous les aspects des opérations du site, y compris la fabrication, la qualité, la conformité réglementaire, la chaîne d'approvisionnement, l'ingénierie et la performance financière. Avec plus de 25 ans d'expérience dans le secteur pharmaceutique, Danny a dirigé des équipes sur des plateformes de produits stériles, non stériles, spécialisés et complexes. </br> </br>\n\nLa carrière de Danny a commencé chez Parkedale (King) Pharmaceuticals, où il a soutenu les opérations de qualité et les processus techniques. Il a ensuite progressé vers des rôles de leadership en fabrication chez JHP Pharmaceuticals et DPT Laboratories, acquérant une vaste expertise en fabrication BPF, en compounding, en transfert technique et en excellence opérationnelle. Après avoir occupé plusieurs postes de direction opérationnelle chez DPT, Danny a été promu Directeur des Opérations sur le site de Sugar Land. Suite à la transition du site vers Kavis Pharma, Danny a été nommé Directeur Général, poursuivant son leadership des opérations du site sous la nouvelle structure d'entreprise. </br> </br>\n\nDanny est titulaire d'un baccalauréat ès sciences en biochimie de l'Université d'Oakland. Il est reconnu pour son expérience étendue dans les exigences réglementaires de la FDA, de l'OSHA et de l'EPA, la fabrication au plus juste (lean manufacturing), la gestion du changement et le développement organisationnel. Son style de leadership est centré sur la construction d'équipes hautement performantes, le renforcement de la responsabilité et la promotion de l'amélioration continue. Danny s'engage à garantir que l'installation de Sugar Land livre constamment des produits pharmaceutiques de haute qualité avec fiabilité, efficacité et une forte culture de conformité.",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731352378-381340691.jpg",
      "color": "refex-blue",
      "order": 15,
      "isActive": true,
      "createdAt": "2025-10-25T06:26:57.000Z",
      "updatedAt": "2025-11-20T07:02:56.000Z",
      "achievements": []
  },
  {
      "id": 21,
      "name": "Krisztián Varga",
      "position": "Directeur du Site – Pharma Pack",
      "category": "Équipe de direction",
      "description": "Krisztián apporte plus de deux décennies d'expérience en leadership dans les industries de l'automobile, de l'électronique, de la chimie et de la fabrication sur mesure. Titulaire de diplômes en génie mécanique, en économie et d'un MBA, il a bâti sa carrière sur la direction de projets complexes, la mise en forme et la restructuration d'organisations, et la promotion de l'excellence opérationnelle basée sur la méthode Lean. Son expérience couvre la gestion d'unités de production, la conduite d'améliorations de processus de bout en bout et la direction de petites équipes opérationnelles et de bureau, ainsi que de grandes divisions de fabrication internationales. </br> </br>\n\nIl a rejoint Pharma Pack Hungary Kft. en 2020 avec un mandat clair de bâtir une organisation pharmaceutique conforme aux BPD/BPF, flexible et durable à long terme. Depuis lors, il a renforcé son expertise pharmaceutique par une participation active aux audits BPD/BPF nationaux et internationaux, aux inspections des autorités et à l'établissement d'un nouveau site de fabrication, qu'il continue d'agrandir et d'optimiser.",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731369944-821221641.jpg",
      "color": "refex-blue",
      "order": 15,
      "isActive": true,
      "createdAt": "2025-10-25T07:39:03.000Z",
      "updatedAt": "2025-11-20T07:03:28.000Z",
      "achievements": []
  },
  {
      "id": 18,
      "name": "Amit Tiwari",
      "position": "Directeur Commercial (CMO) – Extrovis",
      "category": "Équipe de direction",
      "description": "-",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761738744230-894727949.jpg",
      "color": "refex-blue",
      "order": 16,
      "isActive": true,
      "createdAt": "2025-10-25T06:09:20.000Z",
      "updatedAt": "2025-10-29T11:52:28.000Z",
      "achievements": []
  },
  {
      "id": 12,
      "name": "Amit Shrivastava",
      "position": "Directeur Commercial (CMO) – RLFC",
      "category": "Équipe de direction",
      "description": "Amit Shrivastava est un leader chevronné du marketing pharmaceutique avec plus de 25 ans d'expérience dans le développement commercial mondial et le marketing stratégique. Il a occupé des postes de direction dans des organisations telles que Zenfold Sustainable Technologies, Smilax Laboratories, Sun Pharma, et Biocon, où il a dirigé les opérations de marketing à travers le monde. Amit possède une solide expérience en analyse de marché, en planification stratégique, et en vente de produits pharmaceutiques. </br> </br> Il est titulaire d'un MBA et a obtenu un Certificat en Entrepreneurship Essential de la Harvard Business School. Basé à Bangalore, en Inde, Amit continue de stimuler la croissance et l'innovation dans le secteur pharmaceutique.",
      "achievementsJson": "[]",
      "experience": "20+ Ans",
      "education": "Stratégie Marketing & Commerciale",
      "image": "/uploads/images/image-1761115864389-841586860.jpg",
      "color": "refex-orange",
      "order": 17,
      "isActive": true,
      "createdAt": "2025-10-08T16:23:33.000Z",
      "updatedAt": "2025-10-25T08:40:35.000Z",
      "achievements": []
  },
  {
      "id": 15,
      "name": "Rajesh Naik",
      "position": "Directeur Exécutif (ED) – Opérations, RLFC",
      "category": "Équipe de direction",
      "description": "M. Rajesh Naik est un leader expérimenté des opérations pharmaceutiques avec plus de 26 ans d'expérience au sein d'organisations de premier plan, notamment Dr. Reddy's Laboratories, GSK, Daiichi Sankyo (anciennement Daiichi-Ranbaxy), Piramal Enterprises, Teva, Biocon et Zydus Life Sciences. Diplômé en génie chimique du Jawaharlal Nehru Engineering College, Aurangabad, et du programme de gestion d'entreprise exécutive (CXO) de l'Indian Institute of Management Kozhikode. </br> </br>\nIl apporte une expertise approfondie dans les opérations technico-commerciales, englobant la fabrication, la gestion de la chaîne d'approvisionnement, l'ingénierie et les projets, l'EHS, la gestion de projet de développement de nouveaux produits, l'excellence opérationnelle et les services techniques (ingénierie des processus). Rajesh a joué un rôle central dans la promotion de l'efficacité opérationnelle, de la conformité et des pratiques de fabrication durable sur plusieurs sites. Il rend compte au Directeur Général et PDG et dirige une équipe structurée comprenant les fonctions de production, de services techniques, d'entrepôt et de PPIC, assurant l'excellence dans la gestion des livraisons, la conformité réglementaire et la rentabilité.",
      "achievementsJson": "[]",
      "experience": "26+ Ans",
      "education": "",
      "image": "/uploads/images/image-1761310866794-321392940.jpg",
      "color": "refex-blue",
      "order": 18,
      "isActive": true,
      "createdAt": "2025-10-24T13:01:15.000Z",
      "updatedAt": "2025-10-25T07:44:39.000Z",
      "achievements": []
  },
  {
      "id": 24,
      "name": "Dr. Mallikarjuna Rao",
      "position": "Responsable des opérations Inde, Extrovis",
      "category": "Équipe de direction",
      "description": "-",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731302051-50532743.jpg",
      "color": "refex-blue",
      "order": 18,
      "isActive": true,
      "createdAt": "2025-10-25T08:33:30.000Z",
      "updatedAt": "2025-10-29T09:48:25.000Z",
      "achievements": []
  },
  {
      "id": 22,
      "name": "Dr. Suryanarayana Regulagadda",
      "position": "Responsable mondial des sciences analytiques - Extrovis",
      "category": "Équipe de direction",
      "description": "Dr. Suryanarayana Regulagadda a plus de deux décennies d'expérience dans l'industrie pharmaceutique en Recherche et Développement Analytique. Son expertise couvre un large éventail de peptides et de molécules complexes, l'optimisation des opérations de laboratoire, l'assurance du développement et de la validation de méthodes robustes, et la direction de l'adoption de technologies dans le cadre réglementaire, répondant aux développements de l'USFDA, MHRA et ENVISA pour les API et les formulations. Surya est titulaire d'un diplôme de troisième cycle en chimie – il a travaillé avec Eugia Pharma, Alembic, Dr Reddy’s, Concord Laboratories, Qualitest Pharmaceuticals aux États-Unis. Chez Extrovis, Surya dirige le portefeuille de développement analytique et de services pour le groupe.",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731287745-13088173.jpg",
      "color": "refex-blue",
      "order": 19,
      "isActive": true,
      "createdAt": "2025-10-25T07:39:55.000Z",
      "updatedAt": "2025-11-20T07:04:16.000Z",
      "achievements": []
  },
  {
      "id": 16,
      "name": "Dr. Ramasubramanian S",
      "position": "Responsable R&D – RLFC",
      "category": "Équipe de direction",
      "description": "Dr. Ramasubramanian Shanmuganathan est un leader accompli en R&D pharmaceutique avec plus de 29 ans d'expérience dans des organisations de premier plan, notamment AstraZeneca, Syngene, Cadila Pharma, Jubilant Chemsys, Innovassynth Technologies, Recon, Sanmar Speciality Chemicals, Piramal Healthcare et Sai Advantium. </br> </br> Il est titulaire d'un Ph.D. en chimie de l'Université Bharathiar, Coimbatore, et apporte une expertise scientifique approfondie pour stimuler l'innovation, le développement de pipeline et l'excellence de la recherche. Tout au long de sa carrière, le Dr Ramasubramanian a joué un rôle clé dans l'avancement des capacités de R&D, la promotion de l'innovation scientifique, l'excellence opérationnelle et la contribution à la croissance de pipelines de produits robustes dans le secteur pharmaceutique.",
      "achievementsJson": "[]",
      "experience": "29+ Ans",
      "education": "PhD, Sciences Pharmaceutiques",
      "image": "/uploads/images/image-1761310953566-155149712.jpg",
      "color": "refex-blue",
      "order": 20,
      "isActive": true,
      "createdAt": "2025-10-24T13:02:39.000Z",
      "updatedAt": "2025-10-25T07:45:07.000Z",
      "achievements": []
  },
  {
      "id": 23,
      "name": "Maharshi Maitra",
      "position": "Chef de Cabinet (COS) - Refex Group",
      "category": "Équipe de direction",
      "description": "-",
      "achievementsJson": "[]",
      "experience": "",
      "education": "",
      "image": "/uploads/images/image-1761731272675-710723872.jpg",
      "color": "refex-blue",
      "order": 21,
      "isActive": true,
      "createdAt": "2025-10-25T07:40:49.000Z",
      "updatedAt": "2025-10-29T09:47:55.000Z",
      "achievements": []
  }
]





    // 2. Check for the language that requires hardcoded/pre-translated data
    if (currentLang === 'zh') {
        return zhManagementTeam;
    } 
    if (currentLang === 'de') {
      return deManagementTeam;
  } 
  if(currentLang === 'it') {
    return itManagementTeam;
   }
  

   if(currentLang === 'hu') {
    return huManagementTeam;
   }
   if(currentLang === 'fr') {
    return frManagementTeam;
   }
    
    // 3. --- DEFAULT / API FILTERING LOGIC ---
    
    // Determine the category name based on the expected language of the API data.
    // If the API category names are always in English, use 'Management Team'.
    // If the API returns untranslated data and we need to translate it, the filtering is simpler.
    
    // Assuming the API data uses the English category name: 'Management Team'
    const managementCategoryName = 'Management Team'; 

    // Try multiple possible data structures to retrieve the raw data
    const leadershipData = (aboutApi as any)?.leadership || 
                            (aboutApi as any)?.data?.leadership || 
                            (data as any)?.leadership || 
                            (data as any)?.data?.leadership || 
                            [];
                            
    // Filter the leaders based on the English category name and activity status
    const apiLeaders = Array.isArray(leadershipData) ? leadershipData.filter((leader: any) => 
      leader && leader.category === managementCategoryName && leader.isActive !== false
    ) : [];
    
    // 4. Sort and Translate the API data (used for all non-hardcoded languages)
    return apiLeaders
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      // Assuming 'getTranslatedLeader' handles the translation for the current language (e.g., English, French, etc.)
      .map((leader: any) => getTranslatedLeader(leader));

}, [aboutApi, data, getTranslatedLeader, i18n.language]);

  const TechnicalLeaders = useMemo(() => {
    // Try multiple possible data structures
    const leadershipData = (aboutApi as any)?.leadership || 
                          (aboutApi as any)?.data?.leadership || 
                          (data as any)?.leadership || 
                          (data as any)?.data?.leadership || 
                          [];
    const apiLeaders = Array.isArray(leadershipData) ? leadershipData.filter((leader: any) => 
      leader && leader.category === 'Technical Leadership Team' && leader.isActive !== false
    ) : [];
    
    return apiLeaders
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      .map((leader: any) => getTranslatedLeader(leader));
  }, [aboutApi, data, getTranslatedLeader, i18n.language]);

  // Get current selected leader with translations (must be after leadership arrays are defined)
  const selectedLeader = useMemo(() => {
    if (!selectedLeaderId) return null;
    
    // Find leader in any of the leadership arrays
    const allLeaders = [...AdvisoryBoard, ...ManagementTeam, ...TechnicalLeaders];
    const leader = allLeaders.find((l: any) => l.id === selectedLeaderId);
    return leader || null;
  }, [selectedLeaderId, AdvisoryBoard, ManagementTeam, TechnicalLeaders, i18n.language]);

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
          isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <p>{t("loadingContent")}</p>
            </div>
          ) : 
 

          
      
          
          ManagementTeam.length > 0 ? ManagementTeam.map((leader: any, index: number) => {
            const colors = getColorClasses(leader.color);
            return (
              <div
                key={leader.id}
                className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 flex flex-col items-center"
                onClick={() => setSelectedLeaderId(leader.id)}
                data-aos="zoom-in"
                data-aos-duration="800"
                data-aos-delay={index * 100}
              >
                <div
                  className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white ${colors.border} group-hover:shadow-3xl transition-all duration-500`}
                >
                    <img
                      src={getImageUrl(leader.image)}
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
          }) : null
        }
      </div>

   
    </div>
  </section>

      {/* Leadership Section */}
      <section id="management" className="bg-white " >
        {/* Add your full leadership content here, same as before */}
        
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
     

      {/* Advisory Board */}
      {AdvisoryBoard.length > 0 && (
        <div className="mb-16 mt-2">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">
            Advisory Board
          </h3>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {AdvisoryBoard.map((leader: any, index: number) => {
              const colors = getColorClasses(leader.color);
              return (
                <div
                  key={leader.id}
                  className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 flex flex-col items-center"
                  onClick={() => setSelectedLeaderId(leader.id)}
                  data-aos="zoom-in"
                  data-aos-duration="800"
                  data-aos-delay={index * 100}
                >
                  <div
                    className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white ${colors.border} group-hover:shadow-3xl transition-all duration-500`}
                  >
                    <img
                      src={getImageUrl(leader.image)}
                      alt={leader.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
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
      )}

      {/* Technical Leadership Team */}
      {TechnicalLeaders.length > 0 && (
        <div className="mb-16 mt-2">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center font-montserrat">
            Technical Leadership Team
          </h3>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {TechnicalLeaders.map((leader: any, index: number) => {
              const colors = getColorClasses(leader.color);
              return (
                <div
                  key={leader.id}
                  className="group relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-4 flex flex-col items-center"
                  onClick={() => setSelectedLeaderId(leader.id)}
                  data-aos="zoom-in"
                  data-aos-duration="800"
                  data-aos-delay={index * 100}
                >
                  <div
                    className={`w-40 h-40 rounded-full overflow-hidden shadow-2xl border-4 border-white ${colors.border} group-hover:shadow-3xl transition-all duration-500`}
                  >
                    <img
                      src={getImageUrl(leader.image)}
                      alt={leader.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
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
      )}
     
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
                          src={getImageUrl(selectedLeader.image)}
                          alt={selectedLeader.name}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.currentTarget.src = User;
                          }}
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
