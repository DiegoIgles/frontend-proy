import { useEffect, useRef, useState } from 'react';
import {
  Sun,
  Cpu,
  CheckCircle,
} from 'react-feather';
import LightRays from './LightRays';

export default function ServiciosSection() {
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
      id="servicios" 
      ref={sectionRef}
      className="py-20 bg-slate-950 relative overflow-hidden"
    >
      {/* LightRays Background - Only render on desktop when visible */}
      {!isMobile && isVisible && (
        <div className="absolute inset-0 w-full h-full">
          <LightRays
            raysOrigin="bottom-center"
            raysColor="#f3f3f3"
            raysSpeed={1.0}
            lightSpread={1.8}
            rayLength={2.2}
            followMouse={false}
            mouseInfluence={0}
            noiseAmount={0.05}
            distortion={0.02}
            className="custom-rays"
          />
        </div>
      )}
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            Servicios EnerLogic
          </h2>
          <p className="text-slate-300 text-sm md:text-base">
            Integramos <span className="text-solar">energía renovable</span> y
            <span className="text-emerald-300"> servicios eléctricos</span> para ofrecer
            soluciones completas de sistemas fotovoltaicos en Bolivia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Energía Renovable */}
          <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 shadow-soft hover:-translate-y-1 hover:border-solar/60 transition-all duration-200">
            <div className="flex items-center mb-6">
              <div className="bg-solar/15 p-3 rounded-2xl mr-4">
                <Sun className="w-7 h-7 text-solar" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-50">Energía Renovable</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mt-1">
                  Sistemas fotovoltaicos
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-slate-200 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Instalación de sistemas solares conectados a red (On-Grid) con venta de energía a CRE. (Generación Distribuida).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Diseño de sistemas aislados (Off-Grid) con sistemas de respaldo con baterías de litio y acumuladores de energía.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Sistemas de bombeo solar.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Sistemas híbridos.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Estudios de factibilidad técnica y económica para proyectos solares.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Optimización de consumo energético y reducción de la factura eléctrica.
                </span>
              </li>
            </ul>
          </div>

          {/* Servicios Eléctricos */}
          <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-8 shadow-soft hover:-translate-y-1 hover:border-emerald-400/60 transition-all duration-200">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-500/15 p-3 rounded-2xl mr-4">
                <Cpu className="w-7 h-7 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-slate-50">Servicios Eléctricos</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mt-1">
                  Operación & mantenimiento
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-slate-200 text-sm">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Gestión y aprobación de proyectos eléctricos.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Construcción de líneas eléctricas de Media y Baja Tensión.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Provisión de transformadores certificados.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Provisión de materiales eléctricos.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Mantenimiento de Transformadores.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>
                  Proyectos eléctricos subterráneos.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

