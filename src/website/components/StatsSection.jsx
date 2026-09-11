import { useState } from 'react';
import {
  Zap,
  MapPin,
  Cloud,
  Users,
} from 'react-feather';

export default function StatsSection() {
  // Local state for hover effects - isolated to this component
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-16 bg-slate-950/95 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          {/* Card 1: Potencia instalada */}
          <div className="h-full">
            <div
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-slate-900/80 border p-6 rounded-2xl shadow-soft cursor-pointer transition-all duration-500 h-full relative ${
                hoveredCard === 0
                  ? 'border-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.3)] bg-slate-900/90 z-50'
                  : 'border-white/5 z-0'
              }`}
              style={{
                transform: hoveredCard === 0 ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: 'center center',
                transition: 'transform 500ms ease-in-out',
              }}
            >
              <Zap
                className={`w-10 h-10 mx-auto text-solar mb-4 transition-transform duration-500 ${
                  hoveredCard === 0 ? 'scale-110' : ''
                }`}
              />
              <h3
                className={`text-3xl font-bold text-slate-50 transition-colors duration-500 ${
                  hoveredCard === 0 ? 'text-emerald-300' : ''
                }`}
              >
                +600 kW
              </h3>
              <p className="text-slate-300 text-sm mt-1">Potencia instalada</p>
              <div
                className={`mt-4 overflow-hidden transition-all duration-500 ${
                  hoveredCard !== null
                    ? 'max-h-32 opacity-100 mt-4'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-xs text-slate-400 leading-relaxed">
                  Capacidad total de energía solar instalada en proyectos activos, generando
                  electricidad limpia y sostenible.
                </p>
              </div>
            </div>
          </div>
          {/* Card 2: Proyectos */}
          <div className="h-full">
            <div
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-slate-900/80 border p-6 rounded-2xl shadow-soft cursor-pointer transition-all duration-500 h-full relative ${
                hoveredCard === 1
                  ? 'border-solar/60 shadow-[0_0_30px_rgba(251,191,36,0.3)] bg-slate-900/90 z-50'
                  : 'border-white/5 z-0'
              }`}
              style={{
                transform: hoveredCard === 1 ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: 'center center',
                transition: 'transform 500ms ease-in-out',
              }}
            >
              <MapPin
                className={`w-10 h-10 mx-auto text-solar mb-4 transition-transform duration-500 ${
                  hoveredCard === 1 ? 'scale-110' : ''
                }`}
              />
              <h3
                className={`text-3xl font-bold text-slate-50 transition-colors duration-500 ${
                  hoveredCard === 1 ? 'text-solar-light' : ''
                }`}
              >
                +50
              </h3>
              <p className="text-slate-300 text-sm mt-1">Proyectos a nivel nacional</p>
              <div
                className={`mt-4 overflow-hidden transition-all duration-500 ${
                  hoveredCard !== null
                    ? 'max-h-32 opacity-100 mt-4'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-xs text-slate-400 leading-relaxed">
                  Proyectos completados exitosamente en diferentes regiones de Bolivia, desde
                  sistemas residenciales hasta instalaciones industriales.
                </p>
              </div>
            </div>
          </div>
          {/* Card 3: CO₂ mitigados */}
          <div className="h-full">
            <div
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-slate-900/80 border p-6 rounded-2xl shadow-soft cursor-pointer transition-all duration-500 h-full relative ${
                hoveredCard === 2
                  ? 'border-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.3)] bg-slate-900/90 z-50'
                  : 'border-white/5 z-0'
              }`}
              style={{
                transform: hoveredCard === 2 ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: 'center center',
                transition: 'transform 500ms ease-in-out',
              }}
            >
              <Cloud
                className={`w-10 h-10 mx-auto text-solar mb-4 transition-transform duration-500 ${
                  hoveredCard === 2 ? 'scale-110' : ''
                }`}
              />
              <h3
                className={`text-3xl font-bold text-slate-50 transition-colors duration-500 ${
                  hoveredCard === 2 ? 'text-emerald-300' : ''
                }`}
              >
                +1060 Tn
              </h3>
              <p className="text-slate-300 text-sm mt-1">CO₂ mitigados</p>
              <div
                className={`mt-4 overflow-hidden transition-all duration-500 ${
                  hoveredCard !== null
                    ? 'max-h-32 opacity-100 mt-4'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-xs text-slate-400 leading-relaxed">
                  Toneladas de dióxido de carbono evitadas gracias a la energía solar, contribuyendo
                  significativamente a la lucha contra el cambio climático.
                </p>
              </div>
            </div>
          </div>
          {/* Card 4: Personas beneficiadas */}
          <div className="h-full">
            <div
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-slate-900/80 border p-6 rounded-2xl shadow-soft cursor-pointer transition-all duration-500 h-full relative ${
                hoveredCard === 3
                  ? 'border-solar/60 shadow-[0_0_30px_rgba(251,191,36,0.3)] bg-slate-900/90 z-50'
                  : 'border-white/5 z-0'
              }`}
              style={{
                transform: hoveredCard === 3 ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: 'center center',
                transition: 'transform 500ms ease-in-out',
              }}
            >
              <Users
                className={`w-10 h-10 mx-auto text-solar mb-4 transition-transform duration-500 ${
                  hoveredCard === 3 ? 'scale-110' : ''
                }`}
              />
              <h3
                className={`text-3xl font-bold text-slate-50 transition-colors duration-500 ${
                  hoveredCard === 3 ? 'text-solar-light' : ''
                }`}
              >
                +5000
              </h3>
              <p className="text-slate-300 text-sm mt-1">Personas beneficiadas</p>
              <div
                className={`mt-4 overflow-hidden transition-all duration-500 ${
                  hoveredCard !== null
                    ? 'max-h-32 opacity-100 mt-4'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-xs text-slate-400 leading-relaxed">
                  Familias y empresas que ahora disfrutan de energía renovable, reduciendo costos y
                  mejorando su calidad de vida con tecnología sostenible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

