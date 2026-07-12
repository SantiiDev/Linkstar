import { useEffect, useRef } from 'react';
import './LinkstarApp.css';

const features = [
  {
    icon: '👥',
    title: 'Ranking de empleados',
    badge: 'Ideal con Tarjetas NFC',
    description: 'Asigna un nombre a cada tarjeta o dispositivo y descubre qué miembro del equipo consigue más reseñas. Motiva a tu equipo con datos reales.',
    points: [
      'Asigna nombres a cada dispositivo',
      'Ranking automático por escaneos',
      'Ideal para gamificar y motivar'
    ]
  },
  {
    icon: '📍',
    title: 'Vista por ubicaciones',
    badge: 'Para múltiples locales',
    description: 'Perfecto para negocios con varios locales o agencias de marketing. Ve el rendimiento de cada ubicación a un vistazo.',
    points: [
      'Conecta múltiples fichas a una cuenta',
      'Compara rendimiento entre ubicaciones',
      'Cambia la conexión si necesitas moverlo'
    ]
  },
  {
    icon: '⚙️',
    title: 'Gestión de dispositivos',
    badge: 'Control total',
    description: 'Controla todos tus dispositivos Linkstar desde un único panel. Configura el enlace y monitoriza el rendimiento individual.',
    points: [
      'Configura el enlace de cada dispositivo',
      'Ve los escaneos en tiempo real',
      'Reasigna un dispositivo fácilmente'
    ]
  }
];

const useCases = [
  {
    icon: '🍽️',
    title: 'Restaurantes y Hostelería',
    subtitle: 'Ranking de empleados — Motiva a tu equipo',
    example: 'Ejemplo: "La Parrilla del Parque"',
    description: 'Compraron tarjetas Linkstar (una por empleado). Desde el panel, el dueño ve quién consigue más reseñas cada mes.',
    highlights: [
      { icon: '🏆', text: 'Competición sana entre el equipo' },
      { icon: '📈', text: '+300% reseñas en el primer mes' },
      { icon: '⭐', text: 'Premio al mejor empleado' }
    ]
  },
  {
    icon: '🏢',
    title: 'Cadenas y Franquicias',
    subtitle: 'Vista por ubicaciones — Compara rendimiento',
    example: 'Ejemplo: "Gimnasios FitLife — 12 locales"',
    description: 'Distribuyeron 30 expositores en sus locales. Pueden comparar el rendimiento al instante y detectar qué sucursal necesita atención.',
    highlights: [
      { icon: '🔍', text: 'Detectar locales con bajo rendimiento' },
      { icon: '🔄', text: 'Reasignar dispositivos sin coste extra' },
      { icon: '📊', text: 'Decisiones basadas en datos' }
    ]
  },
  {
    icon: '📈',
    title: 'Departamentos de Marketing',
    subtitle: 'Gestión multi-cliente — Reporta con datos',
    example: 'Ejemplo: "Agencia GrowTech"',
    description: 'Gestionan la reputación online de 15 negocios distintos. Monitorizan todos los dispositivos de sus clientes desde una sola cuenta.',
    highlights: [
      { icon: '📋', text: 'Informes de rendimiento instantáneos' },
      { icon: '💰', text: 'Control centralizado de clientes' },
      { icon: '🔗', text: 'Cambio de fichas sin complicaciones' }
    ]
  }
];

export default function LinkstarApp({ onShop }) {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('lapp-animate--visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="lapp" id="linkstarapp">
      
      {/* 1. HERO SECTION */}
      <section className="lapp__hero lapp-animate" ref={addToRefs}>
        <div className="lapp__hero-bg">
          <div className="lapp__hero-glow"></div>
        </div>
        <div className="container lapp__hero-inner">
          <div className="lapp__hero-content-wrapper">
            <div className="lapp__badge">Incluido gratis con tus dispositivos</div>
            <h2 className="lapp__title">
              El panel de control de tus <span className="lapp__highlight">reseñas en Google</span>
            </h2>
            <p className="lapp__subtitle">
              Controla, mide y optimiza el rendimiento de todos tus carteles Linkstar desde un único lugar. 
              <strong> Sin suscripciones. Sin costes ocultos.</strong>
            </p>
            <div className="lapp__ctas">
              <a href="#tienda" className="lapp__btn lapp__btn--primary" onClick={(e) => { e.preventDefault(); onShop(); }}>
                Comprar Dispositivos
              </a>
              <a href="#login" className="lapp__btn lapp__btn--secondary" onClick={(e) => e.preventDefault()}>
                Acceder a LinkstarApp
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
            
            <div className="lapp__stats">
              <div className="lapp__stat">
                <span className="lapp__stat-num">500+</span>
                <span className="lapp__stat-text">Negocios conectados</span>
              </div>
              <div className="lapp__stat-div"></div>
              <div className="lapp__stat">
                <span className="lapp__stat-num">12K+</span>
                <span className="lapp__stat-text">Reseñas conseguidas</span>
              </div>
              <div className="lapp__stat-div"></div>
              <div className="lapp__stat">
                <span className="lapp__stat-num">0€</span>
                <span className="lapp__stat-text">Coste de plataforma</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 DASHBOARD MOCKUP SECTION */}
      <section className="lapp__dashboard-section container lapp-animate" ref={addToRefs}>
        <div className="lapp__dashboard-mock">
            <div className="lapp__mock-header">
              <div className="lapp__mock-logo">linkstar<span style={{color: 'var(--color-orange)'}}>.</span></div>
              <div className="lapp__mock-nav">
                <span>Dashboard</span>
                <span>Dispositivos</span>
                <span>Configuración</span>
              </div>
            </div>
            <div className="lapp__mock-body">
              <div className="lapp__mock-sidebar">
                <div className="lapp__mock-item active">General</div>
                <div className="lapp__mock-item">Empleados</div>
                <div className="lapp__mock-item">Ubicaciones</div>
              </div>
              <div className="lapp__mock-content">
                <div className="lapp__mock-cards">
                  <div className="lapp__mock-card">
                    <span className="lapp__mock-card-title">Total Escaneos</span>
                    <span className="lapp__mock-card-value">1,482</span>
                    <span className="lapp__mock-card-trend positive">↑ 12% este mes</span>
                  </div>
                  <div className="lapp__mock-card">
                    <span className="lapp__mock-card-title">Reseñas Estimadas</span>
                    <span className="lapp__mock-card-value">345</span>
                    <span className="lapp__mock-card-trend positive">↑ 8% este mes</span>
                  </div>
                </div>
                <div className="lapp__mock-chart">
                  <div className="lapp__mock-bar" style={{height: '40%'}}></div>
                  <div className="lapp__mock-bar" style={{height: '60%'}}></div>
                  <div className="lapp__mock-bar" style={{height: '35%'}}></div>
                  <div className="lapp__mock-bar" style={{height: '80%'}}></div>
                  <div className="lapp__mock-bar" style={{height: '50%'}}></div>
                  <div className="lapp__mock-bar" style={{height: '90%', background: 'var(--color-orange)'}}></div>
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* 2. FEATURES SECTION */}
      <section className="lapp__features container lapp-animate" ref={addToRefs}>
        <div className="lapp__section-header">
          <h3 className="lapp__section-title">Todo lo que necesitas para gestionar tus reseñas</h3>
        </div>
        
        <div className="lapp__features-grid">
          {features.map((feat, i) => (
            <div className="lapp__feature-card" key={i}>
              <div className="lapp__feature-top">
                <span className="lapp__feature-icon">{feat.icon}</span>
                <span className="lapp__feature-badge">{feat.badge}</span>
              </div>
              <h4 className="lapp__feature-title">{feat.title}</h4>
              <p className="lapp__feature-desc">{feat.description}</p>
              <ul className="lapp__feature-points">
                {feat.points.map((point, j) => (
                  <li key={j}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 3. USE CASES SECTION */}
      <section className="lapp__cases container lapp-animate" ref={addToRefs}>
        <div className="lapp__section-header">
          <h3 className="lapp__section-title">Diseñado para cada tipo de negocio</h3>
          <p className="lapp__section-subtitle">Desde el restaurante de barrio hasta la agencia de marketing con múltiples clientes.</p>
        </div>

        <div className="lapp__cases-list">
          {useCases.map((uc, i) => (
            <div className="lapp__case-row" key={i}>
              <div className="lapp__case-content">
                <div className="lapp__case-icon">{uc.icon}</div>
                <h4 className="lapp__case-title">{uc.title}</h4>
                <p className="lapp__case-subtitle">{uc.subtitle}</p>
                <div className="lapp__case-example">{uc.example}</div>
                <p className="lapp__case-desc">{uc.description}</p>
                <ul className="lapp__case-highlights">
                  {uc.highlights.map((hl, j) => (
                    <li key={j}>
                      <span className="hl-icon">{hl.icon}</span>
                      <span>{hl.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lapp__case-visual">
                <div className="lapp__case-mock">
                   <div className="lapp__case-mock-header">
                     {uc.title}
                   </div>
                   <div className="lapp__case-mock-body">
                      <div className="lapp__mock-line" style={{width: '80%'}}></div>
                      <div className="lapp__mock-line" style={{width: '60%'}}></div>
                      <div className="lapp__mock-line" style={{width: '90%'}}></div>
                      <div className="lapp__mock-line" style={{width: '40%'}}></div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PRICING CTA SECTION */}
      <section className="lapp__pricing container lapp-animate" ref={addToRefs}>
        <div className="lapp__pricing-box">
          <div className="lapp__pricing-glow"></div>
          <div className="lapp__pricing-content">
            <span className="lapp__pricing-overline">Sin sorpresas</span>
            <h3 className="lapp__pricing-title">¿Cuánto cuesta la plataforma?</h3>
            <div className="lapp__pricing-amount">0€ <span className="lapp__pricing-period">/ siempre</span></div>
            <p className="lapp__pricing-desc">Incluida gratis con la compra de cualquier dispositivo Linkstar. Sin suscripciones ni costes ocultos.</p>
            
            <ul className="lapp__pricing-features">
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Panel de control completo</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Estadísticas en tiempo real</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Dispositivos ilimitados</li>
              <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Ubicaciones ilimitadas</li>
            </ul>

            <button className="lapp__btn lapp__btn--primary lapp__pricing-btn" onClick={(e) => { e.preventDefault(); onShop(); }}>
              Comprar tu Linkstar
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
