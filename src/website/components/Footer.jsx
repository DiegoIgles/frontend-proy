import logoHorizontal from '../assets/EnerLogic Horizontal Logo Color B.png';
import {
  MapPin,
  Mail,
  Instagram,
} from 'react-feather';

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

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="mb-2">
              <img
                src={logoHorizontal}
                alt="EnerLogic"
                width={200}
                height={70}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Energía solar para un futuro sostenible en Bolivia. Diseñamos, instalamos y mantenemos sistemas fotovoltaicos de alto rendimiento.
            </p>
          </div>

          {/* Quick Links & Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-50 uppercase tracking-wider">Enlaces y Servicios</h4>
            <nav className="flex flex-col space-y-3">
              <a href="#inicio" onClick={(e) => handleSmoothScroll(e, 'inicio')} className="text-slate-400 hover:text-solar transition-colors text-sm">
                Inicio
              </a>
              <a href="#quienes-somos" onClick={(e) => handleSmoothScroll(e, 'quienes-somos')} className="text-slate-400 hover:text-solar transition-colors text-sm">
                ¿Qué hacemos?
              </a>
              <a href="#proyectos" onClick={(e) => handleSmoothScroll(e, 'proyectos')} className="text-slate-400 hover:text-solar transition-colors text-sm">
                Proyectos
              </a>
              <a href="#servicios" onClick={(e) => handleSmoothScroll(e, 'servicios')} className="text-slate-400 hover:text-solar transition-colors text-sm">
                Servicios
              </a>
              <a href="#como-funciona" onClick={(e) => handleSmoothScroll(e, 'como-funciona')} className="text-slate-400 hover:text-solar transition-colors text-sm">
                ¿Cómo Funciona?
              </a>
              <a href="#contacto" onClick={(e) => handleSmoothScroll(e, 'contacto')} className="text-slate-400 hover:text-solar transition-colors text-sm">
                Contacto
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-50 uppercase tracking-wider">Contacto</h4>
            <div className="flex flex-col space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-solar mt-0.5 flex-shrink-0" />
                <div className="text-slate-400">
                  <p>Calle J. Lara #3610 / Casilla N. 1864</p>
                  <p>Santa Cruz - Bolivia</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-4 h-4 text-solar mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="text-slate-400 flex flex-col space-y-1">
                  <a href="tel:+59178111078" className="hover:text-solar transition-colors">
                    Tel: +591 781 110 78
                  </a>
                  <a href="tel:+59179816948" className="hover:text-solar transition-colors">
                    Tel: +591 798 169 48
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-solar flex-shrink-0" />
                <a href="mailto:comercial@enerlogic.com.bo" className="text-slate-400 hover:text-solar transition-colors">
                  comercial@enerlogic.com.bo
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Instagram className="w-4 h-4 text-solar flex-shrink-0" />
                <a
                  href="https://www.instagram.com/enerlogic.bo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-solar transition-colors"
                >
                  @enerlogic.bo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-center items-center">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} EnerLogic. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
