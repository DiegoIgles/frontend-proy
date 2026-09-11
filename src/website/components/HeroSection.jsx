import { useEffect, useRef } from 'react';
import heroBg from '../assets/biovida-bg-1.webp';
import logoHorizontal from '../assets/EnerLogic Horizontal Logo Color B.png';
import {
  ArrowRight,
  Sun,
  Shield,
  Zap,
  ChevronDown,
} from 'react-feather';
import CountUp from './CountUp';

// Smooth scroll handler for navigation links
const handleSmoothScroll = (e, targetId) => {
  e.preventDefault();
  const element = document.getElementById(targetId);
  if (element) {
    const offset = 0;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default function HeroSection() {
  const parallaxBgRef = useRef(null);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    // Parallax effect for background image - optimized with requestAnimationFrame and passive listener
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!parallaxBgRef.current || !heroSectionRef.current) {
            ticking = false;
            return;
          }

          const scrolled = window.pageYOffset;
          const heroTop = heroSectionRef.current.offsetTop;
          const heroHeight = heroSectionRef.current.offsetHeight;
          const scrollPosition = scrolled - heroTop;

          // Only apply parallax when scrolling within the hero section
          if (scrollPosition >= 0 && scrollPosition <= heroHeight) {
            // Move background at 30% of scroll speed for subtle effect
            const translateY = scrollPosition * 0.3;
            parallaxBgRef.current.style.transform = `translateY(${translateY}px) translateZ(0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Mark listener as passive for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="inicio"
      ref={heroSectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Fondo */}
      <div className="absolute inset-0">
        <div
          ref={parallaxBgRef}
          className="parallax-bg absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url(${heroBg})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-emerald-900/70" />
      </div>

      {/* Contenido */}
      <div className="relative z-20 container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[1.4fr,1fr] gap-10 items-center">
          <div className="text-left animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur shadow-soft mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping" />
              <span className="text-xs md:text-sm text-slate-100 tracking-wide uppercase">
                Energía solar inteligente en Bolivia
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-[1.05]">
              <span className="block drop-shadow">
                <img
                  src={logoHorizontal}
                  alt="EnerLogic"
                  width={280}
                  height={90}
                  className="h-12 md:h-16 lg:h-20 w-auto"
                />
              </span>
              <span className="block text-slate-50 mt-4 md:mt-6 lg:mt-8">
                Energía que Impulsa tu Futuro
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-200/80 mb-8 max-w-2xl">
            Ofrecemos soluciones solares completas para viviendas, comercios, plantas productivas y campos. Realizamos el estudio técnico, el diseño del sistema, la provisión de equipos, la instalación y la puesta en marcha, garantizando un funcionamiento confiable, eficiente y con ahorro real en tus costos de energía.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="#contacto"
                onClick={(e) => handleSmoothScroll(e, 'contacto')}
                className="inline-flex items-center justify-center bg-solar text-slate-950 px-7 py-3.5 rounded-full font-semibold text-sm md:text-base shadow-soft hover:bg-solar-dark hover:translate-y-0.5 transition-all duration-200"
              >
                ¡Cotiza tu proyecto!
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="#servicios"
                onClick={(e) => handleSmoothScroll(e, 'servicios')}
                className="inline-flex items-center justify-center border border-white/30 text-slate-50 px-7 py-3.5 rounded-full font-medium text-sm md:text-base hover:bg-white/10 hover:border-white/60 transition-all duration-200"
              >
                Ver servicios
                <Sun className="w-4 h-4 ml-2" />
              </a>
            </div>

            <div className="flex flex-wrap gap-6 mt-8 text-xs md:text-sm text-slate-200/70">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500/20">
                  <Shield className="w-3.5 h-3.5" />
                </span>
                Garantía extendida en equipos
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-solar/20">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                Sistemas conectados a red y off-grid
              </div>
            </div>
          </div>

          {/* Tarjeta lateral */}
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-soft animate-soft-float">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-solar-light mb-4">
                Impacto EnerLogic
              </p>
              <div className="grid grid-cols-2 gap-4 text-slate-100 text-sm">
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5">
                  <p className="text-[0.7rem] uppercase tracking-widest text-slate-400 mb-1">
                    Potencia instalada
                  </p>
                  <p className="text-2xl font-bold">
                    +<CountUp from={0} to={600} separator="," direction="up" duration={1} className="count-up-text" onStart={undefined} onEnd={undefined} /> kW
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5">
                  <p className="text-[0.7rem] uppercase tracking-widest text-slate-400 mb-1">
                    Proyectos completados
                  </p>
                  <p className="text-2xl font-bold">
                    +<CountUp from={0} to={50} separator="," direction="up" duration={1} className="count-up-text" onStart={undefined} onEnd={undefined} />
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5">
                  <p className="text-[0.7rem] uppercase tracking-widest text-slate-400 mb-1">
                    Toneladas de CO₂ mitigado
                  </p>
                  <p className="text-2xl font-bold">
                    +<CountUp from={0} to={1060} separator="," direction="up" duration={1} className="count-up-text" onStart={undefined} onEnd={undefined} /> Tn
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/40 border border-white/5">
                  <p className="text-[0.7rem] uppercase tracking-widest text-slate-400 mb-1">
                    Personas beneficiadas
                  </p>
                  <p className="text-2xl font-bold">
                    +<CountUp from={0} to={5000} separator="," direction="up" duration={1} className="count-up-text" onStart={undefined} onEnd={undefined} />
                  </p>
                </div>
              </div>
              <div className="mt-5 text-xs text-slate-300">
                Soluciones fotovoltaicas llave en mano, desde el estudio de factibilidad
                hasta la operación y mantenimiento.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex flex-col items-center text-slate-200/80 text-xs">
          <span className="hidden md:inline">Desliza para ver más</span>
          <ChevronDown className="w-6 h-6 mt-0 md:mt-1 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

