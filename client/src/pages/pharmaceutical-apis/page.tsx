
import { useState, useEffect } from 'react';
import Header from '../../components/feature/Header';
import Footer from '../../components/feature/Footer';

const PharmaceuticalAPIs = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    'All Categories',
    'CNS & Psychotropics',
    'Anti-Histaminic',
    'Anti-Convulsant',
    'Anti-Depressants',
    'ADHD Medications',
    'Complex Generics'
  ];

  const apiProducts = [
    {
      id: 1,
      name: 'Lorazepam',
      category: 'CNS & Psychotropics',
      cas: '846-49-1',
      therapeutic: 'Anxiolytic',
      purity: '99.5%',
      regulatory: ['FDA', 'EMA', 'MHRA'],
      description: 'High-quality benzodiazepine API for anxiety and sleep disorders'
    },
    {
      id: 2,
      name: 'Sertraline HCl',
      category: 'Anti-Depressants',
      cas: '79559-97-0',
      therapeutic: 'SSRI Antidepressant',
      purity: '99.8%',
      regulatory: ['FDA', 'EMA', 'TGA'],
      description: 'Premium selective serotonin reuptake inhibitor for depression treatment'
    },
    {
      id: 3,
      name: 'Methylphenidate HCl',
      category: 'ADHD Medications',
      cas: '298-59-9',
      therapeutic: 'CNS Stimulant',
      purity: '99.7%',
      regulatory: ['FDA', 'EMA'],
      description: 'Controlled substance API for ADHD and narcolepsy treatment'
    },
    {
      id: 4,
      name: 'Cetirizine HCl',
      category: 'Anti-Histaminic',
      cas: '83881-51-0',
      therapeutic: 'H1 Antihistamine',
      purity: '99.9%',
      regulatory: ['FDA', 'EMA', 'MHRA', 'TGA'],
      description: 'Second-generation antihistamine for allergy treatment'
    },
    {
      id: 5,
      name: 'Carbamazepine',
      category: 'Anti-Convulsant',
      cas: '298-46-4',
      therapeutic: 'Anticonvulsant',
      purity: '99.6%',
      regulatory: ['FDA', 'EMA', 'MHRA'],
      description: 'Tricyclic compound for epilepsy and bipolar disorder'
    },
    {
      id: 6,
      name: 'Escitalopram Oxalate',
      category: 'Anti-Depressants',
      cas: '219861-08-2',
      therapeutic: 'SSRI Antidepressant',
      purity: '99.8%',
      regulatory: ['FDA', 'EMA', 'TGA'],
      description: 'Advanced SSRI for major depressive disorder and anxiety'
    }
  ];

  const filteredProducts = apiProducts.filter(product => 
    selectedCategory === 'All Categories' || product.category === selectedCategory
  );

  const getRegulatorColor = (regulator: string) => {
    const colors = {
      'FDA': 'bg-blue-100 text-blue-800',
      'EMA': 'bg-green-100 text-green-800',
      'MHRA': 'bg-purple-100 text-purple-800',
      'TGA': 'bg-orange-100 text-orange-800'
    };
    return colors[regulator as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20API%20manufacturing%20facility%20with%20advanced%20equipment%2C%20clean%20sterile%20production%20environment%2C%20molecular%20structures%2C%20blue%20and%20white%20color%20scheme%2C%20professional%20pharmaceutical%20laboratory%2C%20API%20development%20technology%2C%20contemporary%20scientific%20design%2C%20high-tech%20pharmaceutical%20production&width=1920&height=800&seq=api-hero&orientation=landscape')`
        }}
      >
        <div className="w-full px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg mb-6 border border-white/30">
              <i className="ri-medicine-bottle-line text-white mr-2"></i>
              <span className="text-white font-medium font-montserrat">API Excellence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-montserrat">
              <span className="block">Pharmaceutical</span>
              <span className="block mt-1">APIs</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-montserrat mb-8">
              Leading manufacturer of <span className="text-blue-300 font-semibold">high-quality APIs</span> with 40+ years of expertise in psychotropic substances and complex generics
            </p>
            <p className="text-base text-white/80 max-w-4xl mx-auto font-montserrat">
              Comprehensive portfolio of Active Pharmaceutical Ingredients serving global pharmaceutical companies
            </p>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="ri-medicine-bottle-line text-2xl text-white"></i>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2 font-montserrat">150+</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-montserrat">API Products</h3>
              <p className="text-sm text-gray-600 font-montserrat">Diverse therapeutic portfolio</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="ri-global-line text-2xl text-white"></i>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2 font-montserrat">80+</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-montserrat">Countries</h3>
              <p className="text-sm text-gray-600 font-montserrat">Global market presence</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="ri-shield-check-line text-2xl text-white"></i>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2 font-montserrat">40+</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-montserrat">Years Experience</h3>
              <p className="text-sm text-gray-600 font-montserrat">Proven track record</p>
            </div>
            
            <div className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="ri-award-line text-2xl text-white"></i>
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2 font-montserrat">100%</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-montserrat">Regulatory Compliance</h3>
              <p className="text-sm text-gray-600 font-montserrat">FDA, EMA approved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Portfolio */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              API Product Portfolio
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              Comprehensive range of high-quality Active Pharmaceutical Ingredients across diverse therapeutic areas
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 whitespace-nowrap cursor-pointer font-montserrat ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer border border-gray-100 overflow-hidden">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300 font-montserrat">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-montserrat">{product.category}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <i className="ri-flask-line text-xl text-white"></i>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-montserrat">CAS Number:</span>
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded font-montserrat">{product.cas}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-montserrat">Purity:</span>
                      <span className="text-sm font-semibold text-green-600 font-montserrat">{product.purity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-montserrat">Therapeutic:</span>
                      <span className="text-sm font-semibold text-gray-800 font-montserrat">{product.therapeutic}</span>
                    </div>
                  </div>

                  {/* Regulatory Approvals */}
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2 font-montserrat">Regulatory Approvals:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.regulatory.map((regulator) => (
                        <span
                          key={regulator}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRegulatorColor(regulator)} font-montserrat`}
                        >
                          {regulator}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 font-montserrat">
                    {product.description}
                  </p>

                  {/* Action Button */}
                  <button className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 cursor-pointer whitespace-nowrap font-montserrat">
                    <i className="ri-information-line mr-2"></i>
                    Request Information
                  </button>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-30"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality & Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 font-montserrat">
              Quality & Compliance
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto font-montserrat">
              Uncompromising commitment to quality and regulatory excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="ri-shield-check-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center font-montserrat">
                Regulatory Excellence
              </h3>
              <p className="text-gray-600 text-center leading-relaxed font-montserrat">
                FDA, EMA, MHRA, and TGA approved facilities with comprehensive regulatory documentation and support
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="ri-microscope-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center font-montserrat">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 text-center leading-relaxed font-montserrat">
                State-of-the-art analytical laboratories with cutting-edge instrumentation for comprehensive quality testing
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="ri-award-line text-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center font-montserrat">
                Quality Certifications
              </h3>
              <p className="text-gray-600 text-center leading-relaxed font-montserrat">
                ISO 9001, ISO 14001, OHSAS 18001 certified with continuous improvement processes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('https://readdy.ai/api/search-image?query=Pharmaceutical%20API%20production%20facility%20with%20quality%20control%20processes%2C%20advanced%20manufacturing%20equipment%2C%20blue%20and%20orange%20gradient%20lighting%2C%20professional%20industrial%20environment%2C%20API%20manufacturing%20excellence%2C%20clean%20room%20technology%2C%20contemporary%20pharmaceutical%20setup&width=1920&height=600&seq=api-cta&orientation=landscape')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-montserrat">
            Partner with API Excellence
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 font-montserrat">
            Discover how our pharmaceutical API expertise can accelerate your product development and ensure market success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md hover:shadow-xl transform hover:scale-105 font-montserrat"
            >
              <i className="ri-phone-line mr-2"></i>
              Request Quote
            </a>
            <a 
              href="/products" 
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer border border-white/30 font-montserrat"
            >
              <i className="ri-file-list-line mr-2"></i>
              Download Catalog
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PharmaceuticalAPIs;
