import { useEffect } from 'react';
import './website.css';

import HeroSection from './components/HeroSection';
import QuienesSomosSection from './components/QuienesSomosSection';
import PhotoCarouselSection from './components/PhotoCarouselSection';
import ServiciosSection from './components/ServiciosSection';
import ComoFuncionaSection from './components/ComoFuncionaSection';
import StatsSection from './components/StatsSection';
import ComingSoonBanner from './components/ComingSoonBanner';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

/* Website público de EnerLogic, portado tal cual desde el proyecto Next.js
   (enerlogic-website). Es la portada del dominio: vive en `/` y no depende de
   nada del sistema de gestión — trae sus propios componentes, imágenes y CSS
   dentro de src/website. Lo único compartido es el router de App.js.

   El contenedor `.enerlogic-site` es el que acota Tailwind y el reset del
   website (ver tailwind.config.js y website.css). */

const TITULO = 'EnerLogic - Energía Solar en Bolivia';
const DESCRIPCION =
  'Diseñamos, instalamos y mantenemos sistemas fotovoltaicos de alto rendimiento en Bolivia';

export default function Website() {
  // Equivalente de `metadata` y `html { scroll-behavior: smooth }` del layout
  // de Next: se aplican al montar y se restauran al salir hacia el sistema.
  useEffect(() => {
    const tituloAnterior = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const descripcionAnterior = meta?.getAttribute('content');

    document.title = TITULO;
    meta?.setAttribute('content', DESCRIPCION);
    document.documentElement.classList.add('enerlogic-site-smooth');

    return () => {
      document.title = tituloAnterior;
      if (meta && descripcionAnterior != null) meta.setAttribute('content', descripcionAnterior);
      document.documentElement.classList.remove('enerlogic-site-smooth');
    };
  }, []);

  return (
    <div className="enerlogic-site">
      <HeroSection />
      <QuienesSomosSection />
      <PhotoCarouselSection />
      <ServiciosSection />
      <ComoFuncionaSection />
      <StatsSection />
      <ComingSoonBanner />
      <ContactSection />
      <Footer />
    </div>
  );
}
