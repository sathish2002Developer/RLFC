
import { useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

const ResearchDevelopment = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const researchAreas = [
    {
      id: 1,
      title: 'CNS & Neuroscience',
      icon: 'ri-brain-line',
      description: 'Advanced research in central nervous system disorders and neurological therapeutics',
      projects: ['Novel antidepressants', 'ADHD formulations', 'Anxiety disorders', 'Sleep disorders'],
      progress: 85
    },
    {
      id: 2,
      title: 'Complex Generics',
      icon: 'ri-dna-line',
      description: 'Development of complex generic formulations with enhanced bioavailability',
      projects: ['Extended release', 'Combination therapies', 'Targeted delivery', 'Biosimilars'],
      progress: 78
    },
    {
      id: 3,
      title: 'Novel Drug Delivery',
      icon: 'ri-rocket-line',
      description: 'Innovative drug delivery systems for improved patient outcomes',
      projects: ['Nanoparticle systems', 'Transdermal patches', 'Oral thin films', 'Implants'],
      progress: 65
    },
    {
      id: 4,
      title: 'Green Chemistry',
      icon: 'ri-leaf-line',
      description: 'Sustainable pharmaceutical processes with reduced environmental impact',
      projects: ['Solvent-free synthesis', 'Continuous flow', 'Catalyst development', 'Waste reduction'],
      progress: 92
    }
  ];

  const facilities = [
    {
      name: 'DSIR-Approved R&D Center',
      location: 'Bangalore, India',
      area: '25,000 sq ft',
      scientists: '150+',
      equipment: ['NMR Spectroscopy', 'LC-MS/MS', 'HPLC-UV/VIS', 'GC-MS'],
      capabilities: ['Synthetic chemistry', 'Analytical development', 'Formulation research', 'Stability studies']
    },
    {
      name: 'Innovation Hub',
      location: 'Hyderabad, India',
      area: '18,000 sq ft',
      scientists: '80+',
      equipment: ['X-ray diffractometer', 'DSC/TGA', 'Particle size analyzer', 'Dissolution testing'],
      capabilities: ['Process development', 'Scale-up studies', 'Quality research', 'Method validation']
    }
  ];

  const achievements = [
    { title: 'Patents Filed', value: '50+', icon: 'ri-lightbulb-line' },
    { title: 'Research Scientists', value: '200+', icon: 'ri-team-line' },
    { title: 'Active Projects', value: '100+', icon: 'ri-flask-line' },
    { title: 'Publications', value: '150+', icon: 'ri-book-line' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Advanced pharmaceutical research laboratory with scientists working on drug development, molecular analysis equipment, orange and amber lighting, innovation and discovery atmosphere, R&D facility, modern scientific instruments, pharmaceutical innovation center, cutting-edge research technology&width=1920&height=800&seq=research-development-hero&orientation=landscape')`
        }}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg mb-6 border border-white/30">
              <i className="ri-microscope-line text-white mr-2"></i>
              <span className="text-white font-medium font-montserrat">Innovation Excellence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-montserrat">
              <span className="block">Research &</span>
              <span className="block mt-1">Development</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-montserrat mb-8">
              Cutting-edge <span className="text-orange-300 font-semibold">R&D capabilities</span> driving pharmaceutical innovation for next-generation therapies
            </p>
            <p className="text-base text-white/80 max-w-4xl mx-auto font-montserrat">
              DSIR-approved research centers with advanced analytical technologies and expert scientists
            </p>
          </div>
        </div>
      </section>

      {/* Research Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <i className={`${achievement.icon} text-2xl text-white`}></i>
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2 font-montserrat">{achievement.value}</div>
                <h3 className="text-lg font-semibold text-gray-800 font-montserrat">{achievement.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              Research Focus Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              Strategic research initiatives driving innovation across multiple therapeutic domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {researchAreas.map((area) => (
              <div key={area.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer border border-gray-100 p-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 flex-shrink-0">
                    <i className={`${area.icon} text-2xl text-white`}></i>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors duration-300 font-montserrat">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-montserrat">
                      {area.description}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-medium font-montserrat">Research Progress</span>
                    <span className="text-sm font-bold text-gray-900">{area.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-1000 ease-out group-hover:animate-pulse"
                      style={{ width: `${area.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Research Projects */}
                <div>
                  <p className="text-sm text-gray-600 mb-3 font-montserrat">Active Research Projects:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {area.projects.map((project, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700 font-montserrat">
                        <i className="ri-arrow-right-s-line text-orange-500 mr-1"></i>
                        {project}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Facilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              Research Facilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              State-of-the-art research infrastructure with advanced instrumentation and expert teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {facilities.map((facility, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden">
                <div className="relative h-64">
                  <img 
                    src={`https://readdy.ai/api/search-image?query=Modern pharmaceutical research laboratory in ${facility.location}, advanced scientific equipment, orange and amber lighting, innovation research facility, scientists working with ${facility.equipment[0]}, contemporary R&D center&width=500&height=256&seq=facility-${index}&orientation=landscape`}
                    alt={`${facility.name}`}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-1 font-montserrat">{facility.name}</h3>
                    <p className="text-sm text-white/80 font-montserrat">{facility.location}</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-2xl font-bold text-orange-600 font-montserrat">{facility.area}</div>
                      <div className="text-sm text-gray-600 font-montserrat">Research Area</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600 font-montserrat">{facility.scientists}</div>
                      <div className="text-sm text-gray-600 font-montserrat">Scientists</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 font-montserrat">Key Equipment:</h4>
                    <div className="flex flex-wrap gap-2">
                      {facility.equipment.map((equipment, equipIndex) => (
                        <span key={equipIndex} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold font-montserrat">
                          {equipment}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 font-montserrat">Core Capabilities:</h4>
                    <div className="space-y-1">
                      {facility.capabilities.map((capability, capIndex) => (
                        <div key={capIndex} className="flex items-center text-sm text-gray-700 font-montserrat">
                          <i className="ri-check-line text-orange-500 mr-2"></i>
                          {capability}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Pipeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              Innovation Pipeline
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              Strategic pipeline of innovative pharmaceutical solutions from discovery to market
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
            
            <div className="space-y-16">
              {[
                {
                  phase: 'Discovery',
                  title: 'Target Identification',
                  description: 'Novel target identification and validation using advanced computational methods',
                  projects: 25,
                  timeline: '6-12 months',
                  icon: 'ri-search-eye-line'
                },
                {
                  phase: 'Development',
                  title: 'Lead Optimization',
                  description: 'Medicinal chemistry and lead compound optimization for enhanced efficacy',
                  projects: 18,
                  timeline: '12-18 months',
                  icon: 'ri-flask-line'
                },
                {
                  phase: 'Preclinical',
                  title: 'Safety & Efficacy',
                  description: 'Comprehensive preclinical studies and regulatory preparation',
                  projects: 12,
                  timeline: '18-24 months',
                  icon: 'ri-test-tube-line'
                },
                {
                  phase: 'Clinical',
                  title: 'Clinical Trials',
                  description: 'Phase I-III clinical development with regulatory support',
                  projects: 8,
                  timeline: '3-7 years',
                  icon: 'ri-hospital-line'
                }
              ].map((stage, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className={`flex items-center gap-4 mb-6 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${index % 2 === 0 ? 'order-2 text-right' : 'order-1 text-left'}`}>
                          <div className="text-sm text-orange-600 font-semibold mb-1 font-montserrat">{stage.phase}</div>
                          <h3 className="text-xl font-bold text-gray-800 font-montserrat">{stage.title}</h3>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg ${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
                          <i className={`${stage.icon} text-xl text-white`}></i>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 leading-relaxed mb-4 font-montserrat">{stage.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className={`${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                          <div className="text-2xl font-bold text-orange-600 font-montserrat">{stage.projects}</div>
                          <div className="text-sm text-gray-600 font-montserrat">Active Projects</div>
                        </div>
                        <div className={`${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                          <div className="text-lg font-bold text-gray-800 font-montserrat">{stage.timeline}</div>
                          <div className="text-sm text-gray-600 font-montserrat">Timeline</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                      <i className={`${stage.icon} text-2xl text-white`}></i>
                    </div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Platforms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              Technology Platforms
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              Advanced technology platforms enabling breakthrough pharmaceutical innovations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Driven Discovery',
                icon: 'ri-robot-line',
                description: 'Machine learning algorithms for drug discovery and optimization',
                features: ['Molecular modeling', 'QSAR analysis', 'Virtual screening', 'Predictive analytics']
              },
              {
                title: 'Continuous Flow Chemistry',
                icon: 'ri-flow-chart',
                description: 'Advanced continuous manufacturing for improved efficiency',
                features: ['Real-time monitoring', 'Enhanced safety', 'Reduced waste', 'Scalable processes']
              },
              {
                title: 'Nanotechnology',
                icon: 'ri-fingerprint-line',
                description: 'Nanoparticle-based drug delivery systems',
                features: ['Targeted delivery', 'Enhanced bioavailability', 'Controlled release', 'Reduced toxicity']
              }
            ].map((platform, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <i className={`${platform.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center font-montserrat">
                  {platform.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed mb-6 font-montserrat">
                  {platform.description}
                </p>
                <div className="space-y-2">
                  {platform.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-700 font-montserrat">
                      <i className="ri-check-line text-orange-500 mr-2"></i>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Pharmaceutical research and development collaboration with scientists, innovation partnership, orange and amber gradient lighting, professional research collaboration, R&D excellence, pharmaceutical innovation teamwork&width=1920&height=600&seq=research-cta&orientation=landscape')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-montserrat">
            Accelerate Your Innovation
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 font-montserrat">
            Partner with our R&D excellence to transform your pharmaceutical innovation journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 font-montserrat"
            >
              <i className="ri-phone-line mr-2"></i>
              Collaborate with Us
            </a>
            <a 
              href="/research-capabilities" 
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer border border-white/30 font-montserrat"
            >
              <i className="ri-file-text-line mr-2"></i>
              View Research Portfolio
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ResearchDevelopment;
