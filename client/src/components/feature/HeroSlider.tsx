
import { useState, useEffect } from 'react';
import imag1 from "../../images/2151111131.jpg"
import imag4 from "../../images/image-4.jpg"
import imag3 from "../../images/image -3.jpg"

interface HeroSliderProps {
  slides?: Array<{
    id?: string;
    title: string;
    subtitle?: string;
    image: string;
    order?: number;
    isActive?: boolean;
  }>;
}

const HeroSlider = ({ slides: propSlides }: HeroSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Default slides as fallback
  const defaultSlides = [
    {
      title: "Accelerating Healthcare from Lab to Life",
      subtitle: "Leading pharmaceutical innovation with 40+ years of expertise in psychotropic APIs and complex generics",
      image:
      "https://t4.ftcdn.net/jpg/08/83/70/29/360_F_883702967_ADnz4xZ6cugBxb4zKxyJ3gKRApXXyFEH.jpg" 
      // "https://media.istockphoto.com/id/1274407122/photo/medicine-doctor-holding-hologram-virtual-interface-electronic-medical-record-dna-analysis.jpg?s=612x612&w=0&k=20&c=xscgo-YU1Xli-Vjvs68dkTdfe-JlPG-9RkLVXxdL7EY="
      // imag1
      // "https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20laboratory%20with%20scientists%20in%20white%20coats%20working%20with%20advanced%20equipment%2C%20clean%20sterile%20environment%2C%20blue%20and%20white%20color%20scheme%2C%20professional%20lighting%2C%20high-tech%20research%20facility%2C%20medicine%20development%2C%20scientific%20innovation%2C%20contemporary%20design&width=1920&height=800&seq=hero1&orientation=landscape"
    },
    {
      title: "Global Reach – Customers in 80+ Countries",
      subtitle: "Building strong relationships with top pharma innovators and generics companies worldwide",
      image:
      // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUCZdh7Lmw8xY2o5a6e78HfkrNXtIIIRYdDA&s"
      // "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr3IpcKjaOAm8lzZvyLAvZhqjacEmce-_7PA&s"
      // "https://static.vecteezy.com/system/resources/thumbnails/070/416/522/small/digital-world-map-with-connected-nodes-representing-global-network-and-technology-photo.jpg"
       "https://media.istockphoto.com/id/1169660398/photo/global-network-concept-map-of-japan-and-group-of-people.jpg?s=612x612&w=0&k=20&c=JBxjOX1yHQbxUYlYkdrLwh8Gz8LdRFnmhlnSpHhYnGM="
      // imag2
      //  "https://readdy.ai/api/search-image?query=Global%20pharmaceutical%20network%20visualization%2C%20world%20map%20with%20connected%20nodes%2C%20international%20business%20concept%2C%20blue%20and%20green%20color%20scheme%2C%20modern%20digital%20interface%2C%20global%20connectivity%2C%20pharmaceutical%20distribution%2C%20worldwide%20reach%2C%20professional%20corporate%20design&width=1920&height=800&seq=hero2&orientation=landscape"
    },
    {
      title: "From Building Blocks to Formulations: One Partner. Total Reliability",
      subtitle: "End-to-end pharmaceutical solutions with integrated value chain across KSM, APIs, and FDFs",
      image:  imag3
      // "https://readdy.ai/api/search-image?query=Pharmaceutical%20manufacturing%20facility%20with%20production%20lines%2C%20modern%20industrial%20equipment%2C%20quality%20control%20processes%2C%20clean%20room%20environment%2C%20blue%20and%20orange%20color%20scheme%2C%20advanced%20technology%2C%20medicine%20production%2C%20professional%20manufacturing%20setup&width=1920&height=800&seq=hero3&orientation=landscape"
    },
    {
      title: "4 Global Facilities | 3 R&D Centres | 1 Integrated Pharma Platform",
      subtitle: "World-class manufacturing and research infrastructure driving innovation and quality excellence",
      image: imag4
      // "https://readdy.ai/api/search-image?query=Modern%20pharmaceutical%20research%20and%20development%20center%2C%20state-of-the-art%20building%20architecture%2C%20multiple%20facilities%20connected%2C%20blue%20and%20green%20color%20scheme%2C%20contemporary%20corporate%20campus%2C%20scientific%20innovation%20hub%2C%20professional%20pharmaceutical%20complex&width=1920&height=800&seq=hero4&orientation=landscape"
    }
  ];

  // Use prop slides if available, otherwise use default slides
  const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;
  
  // Debug slides
  console.log('🎠 HeroSlider received slides:', {
    propSlides: propSlides,
    slides: slides,
    slidesLength: slides.length
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelectorAll('.parallax-bg');
      // Intentionally do NOT move content on scroll to avoid title shifting
      // const content = document.querySelectorAll('.parallax-content');
      
      parallax.forEach((element) => {
        const speed = 0.10;
        (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
      });

      // content.forEach((element) => {
      //   const speed = 0.3;
      //   (element as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
      // });
   };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]  overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          }`}
        >
          {/* Background Image with Parallax and Zoom Animation */}
          <div
            className={`parallax-bg absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[6000ms] ease-out ${
              index === currentSlide ? 'scale-110' : 'scale-100'
            }`}
            style={{ 
              backgroundImage: `url(${slide.image})`,
              animation: index === currentSlide ? 'zoomIn 6s ease-out' : 'none'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content - vertically centered, stable on scroll */}
          <div className="parallax-content relative z-10 h-full flex items-center justify-center lg:justify-start">
            <div className="w-full px-6 lg:px-8 lg:ml-24 " style={{
               marginTop:"300px"
            }}>
              <div className={`max-w-4xl text-center lg:mt-20 lg:text-left transition-all duration-600 ease-out ${
                index === currentSlide 
                  ? 'transform translate-y-0 opacity-100 scale-100' 
                  : 'transform translate-y-8 opacity-0 scale-90'
              }`}>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight font-montserrat transition-all duration-800 ease-out ${
                  index === currentSlide ? 'transform scale-100 opacity-100' : 'transform scale-90 opacity-0'
                }`}
                style={{ transitionDelay: index === currentSlide ? '200ms' : '0ms' }}>
                  {slide.title}
                </h1>
                {slide.subtitle && (
                  <p className={`mt-3 sm:mt-4 text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-montserrat transition-all duration-800 ease-out ${
                    index === currentSlide ? 'transform scale-100 opacity-100' : 'transform scale-90 opacity-0'
                  }`}
                  style={{ transitionDelay: index === currentSlide ? '400ms' : '0ms' }}>
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm z-20"
      >
        <i className="ri-arrow-left-line text-white text-xl"></i>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm z-20"
      >
        <i className="ri-arrow-right-line text-white text-xl"></i>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Icon */}
      {/* <div className="absolute bottom-8 right-8 z-20">
        <div 
          className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 animate-bounce"
          onClick={() => {
            const nextSection = document.querySelector('section');
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <i className="ri-arrow-down-line text-white text-xl"></i>
        </div>
      </div> */}

      <style jsx>{`
        @keyframes zoomIn {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
