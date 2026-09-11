import biologicLogo from '../assets/biologic-logo.webp';

export default function ComingSoonBanner() {
  return (
    <section className="py-16 md:py-20 border-t border-white/5 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
          {/* Circle Card with Logo */}
          <div className="flex-shrink-0">
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-white flex items-center justify-center p-8 shadow-lg">
              <div className="relative w-full h-full">
                <img
                  src={biologicLogo}
                  alt="Biologic Logo"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left md:pt-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-50 mb-4">
              Conoce BioLogic
            </h3>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-4">
              Estamos lanzando una nueva marca llamada <span className="font-semibold text-solar">BioLogic</span>.
              ¿Quieres saber más sobre nuestros próximos productos y servicios?
            </p>
            <p className="text-slate-400 text-sm md:text-base">
              Pregúntanos sobre BioLogic en el formulario de contacto a continuación.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
