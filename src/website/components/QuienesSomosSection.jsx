import { useEffect, useRef, useState } from 'react';
import {
  DollarSign,
  Sunrise,
  Shield,
} from 'react-feather';
import FloatingLines from './FloatingLines';

export default function QuienesSomosSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = 
        window.innerWidth < 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (!!navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
      setIsMobile(!!isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // IntersectionObserver for WebGL component - only render when visible
  useEffect(() => {
    if (isMobile) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === sectionRef.current) {
          setIsVisible(entry.isIntersecting);
        }
      });
    }, observerOptions);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [isMobile]);

  return (
    <section 
      id="quienes-somos" 
      ref={sectionRef}
      className="py-20 bg-slate-950/95 border-t border-white/5 relative overflow-hidden"
    >
      {/* FloatingLines Background - Only render on desktop when visible */}
      {!isMobile && isVisible && (
        <div className="absolute inset-0 w-full h-full">
          <FloatingLines
            enabledWaves={['middle']}
            lineCount={[2]}
            lineDistance={[6]}
            bendRadius={4.0}
            bendStrength={-0.5}
            interactive={false}
            parallax={false}
          />
        </div>
      )}
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-50">
            ¿Qué hacemos en EnerLogic?
          </h2>
          <p className="text-slate-300 text-sm md:text-base mb-10 leading-relaxed">
            En <span className="text-solar">EnerLogic</span> acompañamos a nuestros clientes en
            todo el ciclo de su proyecto solar: desde el primer estudio de factibilidad hasta la
            puesta en marcha y el mantenimiento a largo plazo. Integramos tecnología fotovoltaica
            de última generación con ingeniería especializada para garantizar
            seguridad, ahorro y sostenibilidad.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-slate-900/80 border border-white/5 p-6 rounded-2xl shadow-soft cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:bg-slate-900/90 group">
              <DollarSign className="w-9 h-9 mx-auto text-emerald-300 mb-4 transition-transform duration-500 group-hover:scale-110" />
              <h3 className="text-lg font-semibold mb-2 text-slate-50 transition-colors duration-500 group-hover:text-emerald-300">Ahorro y retorno</h3>
              <p className="text-slate-300 text-sm">
                Diseñamos sistemas con tiempos de retorno claros, logrando reducciones de hasta un
                80% en la factura eléctrica según el caso.
              </p>
            </div>
            <div className="bg-slate-900/80 border border-white/5 p-6 rounded-2xl shadow-soft cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-solar/60 hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:bg-slate-900/90 group">
              <Sunrise className="w-9 h-9 mx-auto text-solar mb-4 transition-transform duration-500 group-hover:scale-110" />
              <h3 className="text-lg font-semibold mb-2 text-slate-50 transition-colors duration-500 group-hover:text-solar">Energía limpia</h3>
              <p className="text-slate-300 text-sm">
                Aprovechamos la radiación solar de Bolivia para reducir tu huella de carbono y tu
                dependencia de combustibles fósiles.
              </p>
            </div>
            <div className="bg-slate-900/80 border border-white/5 p-6 rounded-2xl shadow-soft cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:bg-slate-900/90 group">
              <Shield className="w-9 h-9 mx-auto text-emerald-300 mb-4 transition-transform duration-500 group-hover:scale-110" />
              <h3 className="text-lg font-semibold mb-2 text-slate-50 transition-colors duration-500 group-hover:text-emerald-300">Calidad certificada</h3>
              <p className="text-slate-300 text-sm">
                Trabajamos con marcas reconocidas y estándares internacionales para asegurar
                durabilidad, respaldo y soporte técnico local.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

