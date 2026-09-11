import { useState } from 'react';
import biovidaDisplay from '../assets/biovida-display.webp';

export default function ComoFuncionaSection() {
  // Local state for this component only
  const [openStepCard, setOpenStepCard] = useState(null);

  return (
    <section id="como-funciona" className="py-20 bg-slate-950/95 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">
            ¿Cómo Funciona? <span className="text-emerald-400">(Interactivo)</span>
          </h2>
          <p className="text-slate-300 text-sm md:text-base mb-2">
            Descubre el proceso paso a paso de cómo instalamos y operamos sistemas fotovoltaicos
            para transformar la energía solar en electricidad limpia y sostenible.
          </p>
          <p className="text-slate-400 text-xs md:text-sm italic">
            👆 Haz clic en los números del diagrama para conocer cada paso del proceso
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-visible shadow-soft border border-white/10 bg-gradient-to-b from-sky-200 via-sky-100 to-blue-50">
            <img
              src={biovidaDisplay}
              alt="Sistema fotovoltaico EnerLogic - Factory con paneles solares"
              width={1200}
              height={800}
              className="w-full h-auto object-cover rounded-3xl"
            />
            
            {/* Step 1 Button - Sun */}
            <button
              onClick={() => setOpenStepCard(openStepCard === 1 ? null : 1)}
              className="absolute top-[8%] left-[42%] w-[1.8vw] h-[1.8vw] min-w-[1.5rem] min-h-[1.5rem] md:w-[2.5vw] md:h-[2.5vw] md:min-w-[2rem] md:min-h-[2rem] max-w-[2.5rem] max-h-[2.5rem] rounded-full bg-emerald-500 text-white font-bold text-[clamp(0.75rem,1vw,1.25rem)] md:text-[clamp(0.875rem,1.2vw,1.25rem)] shadow-lg hover:scale-90 transition-transform duration-200 flex items-center justify-center z-10 border-0.5 border-slate-950"
              aria-label="Ver paso 1"
            >
              1
            </button>

            {/* Step 2 Button - Solar Panels */}
            <button
              onClick={() => setOpenStepCard(openStepCard === 2 ? null : 2)}
              className="absolute top-[20%] right-[35%] w-[1.8vw] h-[1.8vw] min-w-[1.5rem] min-h-[1.5rem] md:w-[2.5vw] md:h-[2.5vw] md:min-w-[2rem] md:min-h-[2rem] max-w-[2.5rem] max-h-[2.5rem] rounded-full bg-emerald-500 text-white font-bold text-[clamp(0.75rem,1vw,1.25rem)] md:text-[clamp(0.875rem,1.2vw,1.25rem)] shadow-lg hover:scale-90 transition-transform duration-200 flex items-center justify-center z-10 border-0.5 border-slate-950"
              aria-label="Ver paso 2"
            >
              2
            </button>

            {/* Step 3 Button - Inverter */}
            <button
              onClick={() => setOpenStepCard(openStepCard === 3 ? null : 3)}
              className="absolute top-[45%] right-[23%] w-[1.8vw] h-[1.8vw] min-w-[1.5rem] min-h-[1.5rem] md:w-[2.5vw] md:h-[2.5vw] md:min-w-[2rem] md:min-h-[2rem] max-w-[2.5rem] max-h-[2.5rem] rounded-full bg-emerald-500 text-white font-bold text-[clamp(0.75rem,1vw,1.25rem)] md:text-[clamp(0.875rem,1.2vw,1.25rem)] shadow-lg hover:scale-90 transition-transform duration-200 flex items-center justify-center z-10 border-0.5 border-slate-950"
              aria-label="Ver paso 3"
            >
              3
            </button>

            {/* Step 4 Button - Grid Connection */}
            <button
              onClick={() => setOpenStepCard(openStepCard === 4 ? null : 4)}
              className="absolute top-[60%] left-[7%] w-[1.8vw] h-[1.8vw] min-w-[1.5rem] min-h-[1.5rem] md:w-[2.5vw] md:h-[2.5vw] md:min-w-[2rem] md:min-h-[2rem] max-w-[2.5rem] max-h-[2.5rem] rounded-full bg-emerald-500 text-white font-bold text-[clamp(0.75rem,1vw,1.25rem)] md:text-[clamp(0.875rem,1.2vw,1.25rem)] shadow-lg hover:scale-90 transition-transform duration-200 flex items-center justify-center z-10 border-0.5 border-slate-950"
              aria-label="Ver paso 4"
            >
              4
            </button>

            {/* Step 5 Button - Building Usage */}
            <button
              onClick={() => setOpenStepCard(openStepCard === 5 ? null : 5)}
              className="absolute top-[52%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-[1.8vw] h-[1.8vw] min-w-[1.5rem] min-h-[1.5rem] md:w-[2.5vw] md:h-[2.5vw] md:min-w-[2rem] md:min-h-[2rem] max-w-[2.5rem] max-h-[2.5rem] rounded-full bg-emerald-500 text-white font-bold text-[clamp(0.75rem,1vw,1.25rem)] md:text-[clamp(0.875rem,1.2vw,1.25rem)] shadow-lg hover:scale-90 transition-transform duration-200 flex items-center justify-center z-10 border-0.5 border-slate-950"
              aria-label="Ver paso 5"
            >
              5
            </button>

            {/* Step 1 Card */}
            {openStepCard === 1 && (
              <div className="absolute top-1 left-1 -translate-x-1/2 -translate-y-1/2 md:top-[8%] md:left-[calc(42%+clamp(2rem,3vw,3rem))] md:translate-x-0 md:translate-y-0 w-[clamp(14rem,90%,20rem)] md:w-[clamp(16rem,20vw,20rem)] bg-white rounded-2xl shadow-xl p-[clamp(1rem,1.5vw,1.5rem)] z-20 border border-slate-200 animate-fadeIn">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[clamp(1rem,1.25vw,1.25rem)] font-bold text-slate-900">Paso 1: Energía Solar</h3>
                  <button
                    onClick={() => setOpenStepCard(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors text-[clamp(1.25rem,1.5vw,1.5rem)] leading-none flex-shrink-0"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
                <p className="text-slate-600 text-[clamp(0.75rem,0.875vw,0.875rem)] leading-relaxed">
                  El sol emite radiación solar que es capturada por los paneles fotovoltaicos,
                  iniciando el proceso de generación de energía limpia y renovable.
                </p>
              </div>
            )}

            {/* Step 2 Card */}
            {openStepCard === 2 && (
              <div className="absolute top-1 left-1 -translate-x-1/2 -translate-y-1/2 md:top-[20%] md:right-[calc(35%+clamp(2rem,3vw,3rem))] md:left-auto md:translate-x-0 md:translate-y-0 w-[clamp(14rem,90%,20rem)] md:w-[clamp(16rem,20vw,20rem)] bg-white rounded-2xl shadow-xl p-[clamp(1rem,1.5vw,1.5rem)] z-20 border border-slate-200 animate-fadeIn">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[clamp(1rem,1.25vw,1.25rem)] font-bold text-slate-900">Paso 2: Paneles Solares</h3>
                  <button
                    onClick={() => setOpenStepCard(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors text-[clamp(1.25rem,1.5vw,1.5rem)] leading-none flex-shrink-0"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
                <p className="text-slate-600 text-[clamp(0.75rem,0.875vw,0.875rem)] leading-relaxed">
                  Los paneles solares capturan la luz solar y la convierten en energía eléctrica en forma de corriente continua (DC).
                </p>
              </div>
            )}

            {/* Step 3 Card */}
            {openStepCard === 3 && (
              <div className="absolute top-1 left-1 -translate-x-1/2 -translate-y-1/2 md:top-[45%] md:right-[calc(23%+clamp(2rem,3vw,3rem))] md:left-auto md:translate-x-0 md:translate-y-0 w-[clamp(14rem,90%,20rem)] md:w-[clamp(16rem,20vw,20rem)] bg-white rounded-2xl shadow-xl p-[clamp(1rem,1.5vw,1.5rem)] z-20 border border-slate-200 animate-fadeIn">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[clamp(1rem,1.25vw,1.25rem)] font-bold text-slate-900">Paso 3: Inversor</h3>
                  <button
                    onClick={() => setOpenStepCard(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors text-[clamp(1.25rem,1.5vw,1.5rem)] leading-none flex-shrink-0"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
                <p className="text-slate-600 text-[clamp(0.75rem,0.875vw,0.875rem)] leading-relaxed">
                  El inversor convierte la corriente continua (DC) en corriente alterna (AC), que es la electricidad que usa el edificio.
                </p>
              </div>
            )}

            {/* Step 4 Card */}
            {openStepCard === 4 && (
              <div className="absolute top-1 left-1 -translate-x-1/2 -translate-y-1/2 md:top-[60%] md:left-[calc(7%+clamp(2rem,3vw,3rem))] md:translate-x-0 md:translate-y-0 w-[clamp(14rem,90%,20rem)] md:w-[clamp(16rem,20vw,20rem)] bg-white rounded-2xl shadow-xl p-[clamp(1rem,1.5vw,1.5rem)] z-20 border border-slate-200 animate-fadeIn">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[clamp(1rem,1.25vw,1.25rem)] font-bold text-slate-900">Paso 4: Conexión a la Red</h3>
                  <button
                    onClick={() => setOpenStepCard(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors text-[clamp(1.25rem,1.5vw,1.5rem)] leading-none flex-shrink-0"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
                <p className="text-slate-600 text-[clamp(0.75rem,0.875vw,0.875rem)] leading-relaxed">
                  El sistema se conecta a la red eléctrica. Si hay exceso de energía, se envía a la red. Si falta energía, la red la provee.
                </p>
              </div>
            )}

            {/* Step 5 Card */}
            {openStepCard === 5 && (
              <div className="absolute top-1 left-1 -translate-x-1/2 -translate-y-1/2 md:top-[calc(52%+clamp(2rem,3vw,3rem))] md:left-[45%] md:-translate-x-1/2 md:translate-y-0 w-[clamp(14rem,90%,20rem)] md:w-[clamp(16rem,20vw,20rem)] bg-white rounded-2xl shadow-xl p-[clamp(1rem,1.5vw,1.5rem)] z-20 border border-slate-200 animate-fadeIn">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[clamp(1rem,1.25vw,1.25rem)] font-bold text-slate-900">Paso 5: Uso de la Energía</h3>
                  <button
                    onClick={() => setOpenStepCard(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors text-[clamp(1.25rem,1.5vw,1.5rem)] leading-none flex-shrink-0"
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
                <p className="text-slate-600 text-[clamp(0.75rem,0.875vw,0.875rem)] leading-relaxed">
                  La energía generada se usa para alimentar la operación del edificio: luces, maquinaria y equipos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

