import { Link } from 'react-router-dom';
import { FiZap, FiPhone, FiMail, FiMapPin, FiInstagram, FiTwitter, FiYoutube, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ background: '#0d0d0d', borderTop: '1px solid var(--border)', paddingTop: 60, paddingBottom: 30 }}>
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{ background: 'var(--orange)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiZap color="white" size={16} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'white', letterSpacing: 1 }}>
                ROHIT <span style={{ color: 'var(--orange)' }}>POWER TOOLS</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8, maxWidth: 280 }}>
              India's most trusted online power tool store. Serving professionals and DIY enthusiasts since 2010.
            </p>
            <div className="d-flex gap-3 mt-3">
              {[FiInstagram, FiTwitter, FiYoutube, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', transition: 'var(--transition)', textDecoration: 'none'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-light)', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>Shop</h6>
            {['All Products','Drills','Grinders','Saws','Accessories'].map(item => (
              <Link key={item} to={`/products${item !== 'All Products' ? `?category=${item}` : ''}`}
                style={{ display: 'block', color: 'var(--text-muted)', fontSize: 14, marginBottom: 10, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--orange)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{item}</Link>
            ))}
          </div>

          {/* Account */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-light)', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>Account</h6>
            {[['Login','/login'],['Register','/register'],['Profile','/profile'],['My Orders','/profile'],['AI Support','/chatbot']].map(([label, path]) => (
              <Link key={label} to={path}
                style={{ display: 'block', color: 'var(--text-muted)', fontSize: 14, marginBottom: 10, textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--orange)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-light)', fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 16 }}>Contact Us</h6>
            {[
              [FiPhone, '1800-ROHIT-TOOLS'],
              [FiMail, 'support@rohitpowertools.in'],
              [FiMapPin, 'Bahadurgarh, Haryana, India']
            ].map(([Icon, text], i) => (
              <div key={i} className="d-flex align-items-center gap-2 mb-3">
                <Icon color="var(--orange)" size={15} />
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{text}</span>
              </div>
            ))}
            <div style={{
              background: 'rgba(255,85,0,0.1)',
              border: '1px solid var(--border-orange)',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: 'var(--text-light)'
            }}>
              🕐 Mon–Sat, 9am–6pm IST
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--border)', margin: '30px 0 20px' }} />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
            © 2026 Rohit Power Tools. All rights reserved. 🇮🇳
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
            GST: 06ROHIT1234A1Z5 · <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a> · <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
