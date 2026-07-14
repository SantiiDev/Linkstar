import './Footer.css';

const footerLinks = {
  Producto: [
    { label: 'Carteles NFC', href: '#tienda' },
    { label: 'LinkstarApp', href: '#linkstarapp' },
  ],
  Empresa: [
    { label: 'Sobre nosotros', href: '#' },
  ],
  Soporte: [
    { label: 'Contacto', href: '#contacto' },
    { label: 'Garantía', href: '#' },
  ],
  Legal: [
    { label: 'Aviso legal', href: '#' },
    { label: 'Política de privacidad', href: '#' },
    { label: 'Términos y condiciones', href: '#' },
  ],
};

export default function Footer({ onContact, onShop, onLinkstarApp }) {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        {/* Top section */}
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#inicio" className="footer__logo">
              <span className="footer__logo-text">linkstar</span>
              <span className="footer__logo-dot"></span>
            </a>
            <p className="footer__tagline">
              Conecta tu marca con el mundo digital a través de
              carteles expositores inteligentes con tecnología NFC.
            </p>

            {/* Social */}
            <div className="footer__social">
              {/* Instagram */}
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* Twitter/X */}
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733-16z" />
                  <path d="M4 20l6.768-6.768M20 4l-6.768 6.768" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="footer__social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="footer__social-link" aria-label="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 104 4V4a5 5 0 005 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div className="footer__columns">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div className="footer__column" key={category}>
                <h4 className="footer__column-title">{category}</h4>
                <ul className="footer__column-links">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="footer__link"
                        onClick={(e) => {
                          if (link.href === '#contacto' && onContact) {
                            e.preventDefault();
                            onContact();
                          } else if (link.href === '#tienda' && onShop) {
                            e.preventDefault();
                            onShop();
                          } else if (link.href === '#linkstarapp' && onLinkstarApp) {
                            e.preventDefault();
                            onLinkstarApp();
                          }
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="footer__divider"></div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Linkstar. Todos los derechos reservados.
          </p>
          <p className="footer__made">
            Hecho con <span className="footer__heart">♥</span> en Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
