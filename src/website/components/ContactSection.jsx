import contactBg from '../assets/biovida-background-last.webp';
import {
  Mail,
  Instagram,
} from 'react-feather';

export default function ContactSection() {
  return (
    <section id="contacto" className="py-20 border-t border-white/5 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <img
            src={contactBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-emerald-900/80" />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-3">
            Contáctanos
          </h2>
          <p className="text-slate-300 text-sm md:text-base mb-6">
          Contáctanos para obtener un análisis inicial y descubrir cuánto puedes <strong>ahorrar</strong> en tu hogar, negocio, planta o campo con energía solar.
          </p>
          {/* Instagram Link */}
          <div className="flex justify-center">
            <a
              href="https://www.instagram.com/enerlogic.bo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-3 text-slate-300 hover:text-solar transition-colors duration-200 px-4 py-2 rounded-lg border border-white/20 hover:border-solar/50"
            >
              <Instagram className="w-6 h-6" />
              <span className="text-sm font-medium">@enerlogic.bo</span>
            </a>
          </div>
        </div>

        {/* Two Cards Container */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Email Card */}
          <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-8 md:p-10 shadow-soft shadow-lg flex flex-col">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-solar/20 mb-4">
                <Mail className="w-6 h-6 text-solar" />
              </div>
              <h3 className="text-2xl font-bold text-slate-50 mb-2">
                Envíanos un correo
              </h3>
              <p className="text-slate-400 text-sm">
                Completa el formulario y te responderemos por email
              </p>
            </div>

            <form className="space-y-5 flex-1 flex flex-col" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('name');
              const email = formData.get('email');
              const phone = formData.get('phone');
              
              const subject = encodeURIComponent('Consulta desde EnerLogic');
              const body = encodeURIComponent(
                `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\n\nMensaje:`
              );
              
              window.location.href = `mailto:comercial@enerlogic.com.bo?subject=${subject}&body=${body}`;
            }}>
              <div>
                <label htmlFor="name-email" className="block text-sm font-medium text-slate-200 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name-email"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-solar focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email-email" className="block text-sm font-medium text-slate-200 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email-email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-solar focus:border-transparent transition-all duration-200"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone-email" className="block text-sm font-medium text-slate-200 mb-2">
                  Número de teléfono
                </label>
                <input
                  type="tel"
                  id="phone-email"
                  name="phone"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-solar focus:border-transparent transition-all duration-200"
                  placeholder="+591 70000000"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-auto inline-flex items-center justify-center bg-solar text-slate-950 px-8 py-3.5 rounded-lg font-semibold text-sm md:text-base shadow-soft hover:bg-solar-dark hover:translate-y-0.5 transition-all duration-200"
              >
                Enviar correo
                <Mail className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>

          {/* WhatsApp Card */}
          <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-8 md:p-10 shadow-soft shadow-lg flex flex-col">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.173-.149.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.08c0 1.752.413 3.4 1.141 4.865L.06 24l9.218-2.41a11.87 11.87 0 002.771.332c5.555 0 10.09-4.534 10.09-10.09 0-2.688-1.045-5.216-2.943-7.113"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-50 mb-2">
                Escríbenos por WhatsApp
              </h3>
              <p className="text-slate-400 text-sm">
                Chatea con nosotros directamente por WhatsApp
              </p>
            </div>

            <form className="space-y-5 flex-1 flex flex-col" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get('name');
              const email = formData.get('email');
              const phone = formData.get('phone');
              
              const text = encodeURIComponent(
                `Hola, soy ${name}. Mi email es ${email} y mi número es ${phone}. Me gustaría recibir más información sobre EnerLogic.`
              );
              
              window.open(`https://wa.me/59178111078?text=${text}`, '_blank');
            }}>
              <div>
                <label htmlFor="name-whatsapp" className="block text-sm font-medium text-slate-200 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name-whatsapp"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div>
                <label htmlFor="email-whatsapp" className="block text-sm font-medium text-slate-200 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email-whatsapp"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone-whatsapp" className="block text-sm font-medium text-slate-200 mb-2">
                  Número de teléfono
                </label>
                <input
                  type="tel"
                  id="phone-whatsapp"
                  name="phone"
                  required
                  className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  placeholder="+591 70000000"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-auto inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-lg font-semibold text-sm md:text-base shadow-soft hover:translate-y-0.5 transition-all duration-200"
              >
                Abrir WhatsApp
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.173-.149.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.08c0 1.752.413 3.4 1.141 4.865L.06 24l9.218-2.41a11.87 11.87 0 002.771.332c5.555 0 10.09-4.534 10.09-10.09 0-2.688-1.045-5.216-2.943-7.113"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

