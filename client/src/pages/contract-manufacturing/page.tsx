
import { useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

const ContractManufacturing = () => {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const services = [
    {
      id: 1,
      title: 'API Manufacturing',
      icon: 'ri-flask-line',
      description: 'Complete API manufacturing from grams to tons with regulatory compliance',
      features: ['Scale-up capabilities', 'GMP facilities', 'Regulatory support', 'Quality assurance']
    },
    {
      id: 2,
      title: 'Formulation Development',
      icon: 'ri-test-tube-line',
      description: 'Advanced formulation development for complex drug delivery systems',
      features: ['Complex generics', 'Novel formulations', 'Bioequivalence studies', 'Stability testing']
    },
    {
      id: 3,
      title: 'Commercial Manufacturing',
      icon: 'ri-factory-line',
      description: 'Large-scale commercial manufacturing with consistent quality',
      features: ['High-volume production', 'Supply chain management', 'Global distribution', 'Cost optimization']
    },
    {
      id: 4,
      title: 'Analytical Services',
      icon: 'ri-microscope-line',
      description: 'Comprehensive analytical testing and method development',
      features: ['Method development', 'Impurity profiling', 'Stability studies', 'Regulatory filing support']
    }
  ];

  const facilities = [
    {
      location: 'Karnataka, India',
      size: '150,000 sq ft',
      capacity: '500 MT/year',
      certifications: ['FDA', 'EMA', 'WHO-GMP'],
      specialties: ['CNS APIs', 'Psychotropic substances', 'Complex synthesis']
    },
    {
      location: 'Andhra Pradesh, India',
      size: '200,000 sq ft',
      capacity: '750 MT/year',
      certifications: ['FDA', 'EMA', 'MHRA'],
      specialties: ['Generic APIs', 'Intermediates', 'Custom synthesis']
    },
    {
      location: 'Switzerland',
      size: '80,000 sq ft',
      capacity: '200 MT/year',
      certifications: ['EMA', 'Swissmedic', 'FDA'],
      specialties: ['High-potency APIs', 'Oncology', 'Specialty chemicals']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Contract%20pharmaceutical%20manufacturing%20facility%20with%20automated%20production%20lines%2C%20quality%20control%20systems%2C%20green%20and%20emerald%20lighting%2C%20modern%20industrial%20equipment%2C%20CDMO%20services%2C%20professional%20manufacturing%20environment%2C%20advanced%20pharmaceutical%20technology%2C%20clean%20room%20production&width=1920&height=800&seq=contract-manufacturing-hero&orientation=landscape')`
        }}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg mb-6 border border-white/30">
              <i className="ri-factory-line text-white mr-2"></i>
              <span className="text-white font-medium font-montserrat">CDMO Excellence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-montserrat">
              <span className="block">Contract</span>
              <span className="block mt-1">Manufacturing</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-montserrat mb-8">
              Comprehensive <span className="text-green-300 font-semibold">CDMO services</span> offering end-to-end pharmaceutical manufacturing solutions
            </p>
            <p className="text-base text-white/80 max-w-4xl mx-auto font-montserrat">
              From development to commercial scale production with regulatory excellence and global reach
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              Manufacturing Services
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              Complete pharmaceutical manufacturing solutions from concept to commercial scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer border border-gray-100 p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 flex-shrink-0">
                    <i className={`${service.icon} text-2xl text-white`}></i>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors duration-300 font-montserrat">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4 font-montserrat">
                      {service.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600 font-montserrat">
                          <i className="ri-check-line text-green-500 mr-2"></i>
                          {feature}
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

      {/* Manufacturing Facilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              Manufacturing Facilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              State-of-the-art facilities across multiple locations ensuring global supply chain reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100 overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={`https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20manufacturing%20facility%20in%20$%7Bfacility.location%7D%2C%20advanced%20production%20equipment%2C%20clean%20room%20environment%2C%20professional%20industrial%20architecture%2C%20$%7Bfacility.specialties%5B0%5D%7D%20manufacturing%2C%20contemporary%20pharmaceutical%20technology&width=400&height=192&seq=facility-${index}&orientation=landscape`}
                    alt={`${facility.location} Facility`}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-lg font-bold text-white font-montserrat">{facility.location}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-montserrat">Facility Size:</span>
                      <span className="text-sm font-semibold text-gray-800 font-montserrat">{facility.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-montserrat">Annual Capacity:</span>
                      <span className="text-sm font-semibold text-gray-800 font-montserrat">{facility.capacity}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2 font-montserrat">Certifications:</p>
                    <div className="flex flex-wrap gap-2">
                      {facility.certifications.map((cert) => (
                        <span key={cert} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold font-montserrat">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-montserrat">Specialties:</p>
                    <div className="space-y-1">
                      {facility.specialties.map((specialty, specIndex) => (
                        <div key={specIndex} className="flex items-center text-sm text-gray-700 font-montserrat">
                          <i className="ri-check-line text-green-500 mr-2"></i>
                          {specialty}
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

      {/* Process Flow */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              Manufacturing Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              Streamlined process from initial consultation to commercial manufacturing
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            
            <div className="space-y-16">
              {[
                {
                  step: '01',
                  title: 'Project Assessment',
                  description: 'Comprehensive evaluation of project requirements, timelines, and regulatory needs',
                  icon: 'ri-search-line'
                },
                {
                  step: '02',
                  title: 'Process Development',
                  description: 'Route scouting, process optimization, and scale-up from lab to pilot scale',
                  icon: 'ri-flask-line'
                },
                {
                  step: '03',
                  title: 'Technology Transfer',
                  description: 'Seamless transfer from development to manufacturing with complete documentation',
                  icon: 'ri-share-line'
                },
                {
                  step: '04',
                  title: 'Commercial Production',
                  description: 'Full-scale manufacturing with continuous quality monitoring and supply chain management',
                  icon: 'ri-factory-line'
                }
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${index % 2 === 0 ? 'order-2' : 'order-1'}`}>
                          <div className="text-3xl font-bold text-green-600 mb-2 font-montserrat">{item.step}</div>
                          <h3 className="text-xl font-bold text-gray-800 font-montserrat">{item.title}</h3>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg ${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
                          <i className={`${item.icon} text-xl text-white`}></i>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed font-montserrat">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                      <i className={`${item.icon} text-2xl text-white`}></i>
                    </div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              Manufacturing Capabilities
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              Advanced capabilities across the pharmaceutical manufacturing value chain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Synthesis Expertise', value: '500+', unit: 'Reactions', icon: 'ri-test-tube-line' },
              { title: 'Production Capacity', value: '1500', unit: 'MT/Year', icon: 'ri-factory-line' },
              { title: 'Quality Control', value: '24/7', unit: 'Monitoring', icon: 'ri-shield-check-line' },
              { title: 'Lead Time', value: '30-45', unit: 'Days', icon: 'ri-time-line' }
            ].map((capability, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <i className={`${capability.icon} text-2xl text-white`}></i>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2 font-montserrat">{capability.value}</div>
                <div className="text-sm text-gray-500 mb-2 font-montserrat">{capability.unit}</div>
                <h3 className="text-lg font-semibold text-gray-800 font-montserrat">{capability.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Contract%20pharmaceutical%20manufacturing%20partnership%20with%20handshake%2C%20modern%20facility%20background%2C%20green%20and%20blue%20gradient%20lighting%2C%20professional%20business%20collaboration%2C%20CDMO%20services%20excellence%2C%20pharmaceutical%20industry%20partnership&width=1920&height=600&seq=manufacturing-cta&orientation=landscape')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-montserrat">
            Partner with Manufacturing Excellence
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 font-montserrat">
            Transform your pharmaceutical development with our comprehensive contract manufacturing solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 font-montserrat"
            >
              <i className="ri-phone-line mr-2"></i>
              Discuss Your Project
            </a>
            <a 
              href="/capabilities" 
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer border border-white/30 font-montserrat"
            >
              <i className="ri-download-line mr-2"></i>
              Download Brochure
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContractManufacturing;
