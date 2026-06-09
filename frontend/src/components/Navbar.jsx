import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { FiShoppingCart, FiMenu, FiX, FiLogOut, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import toast from 'react-hot-toast';

const FilledLightning = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" fill="white" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="pgr4" cx="50%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fb923c"/>
        <stop offset="50%" stopColor="#F97316"/>
        <stop offset="100%" stopColor="#ea6c0a"/>
      </radialGradient>
    </defs>
    <circle cx="256" cy="256" r="256" fill="url(#pgr4)"/>
    <circle cx="256" cy="190" r="85" fill="white" stroke="black" strokeWidth="14"/>
    <path d="M80 430 C80 320 432 320 432 430" fill="white" stroke="black" strokeWidth="14" strokeLinejoin="round"/>
  </svg>
);

// Sun/Moon toggle switch
const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(234,108,10,0.1)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(234,108,10,0.25)'}`,
      borderRadius: 50,
      padding: '5px 10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      flexShrink: 0
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(234,108,10,0.25)'; }}
  >
    {/* Track */}
    <div style={{
      width: 36, height: 20,
      background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(234,108,10,0.2)',
      borderRadius: 20,
      position: 'relative',
      transition: 'background 0.3s'
    }}>
      {/* Knob */}
      <div style={{
        position: 'absolute',
        top: 2,
        left: isDark ? 2 : 18,
        width: 16, height: 16,
        borderRadius: '50%',
        background: 'var(--orange)',
        transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
      }}>
        {isDark
          ? <FiMoon size={9} color="white" />
          : <FiSun size={9} color="white" />
        }
      </div>
    </div>
    <span style={{
      fontSize: 11, fontWeight: 700,
      color: 'var(--text-light)',
      fontFamily: "'Poppins',sans-serif",
      letterSpacing: 0.3
    }}>
      {isDark ? 'Dark' : 'Light'}
    </span>
  </button>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const categories = ['Drills','Grinders','Saws','Wrenches','Sanders','Accessories'];

  const navBg = scrolled ? 'var(--nav-bg-scrolled)' : 'var(--nav-bg-top)';
  const navBorder = scrolled ? 'var(--nav-border-scrolled)' : 'var(--nav-border)';

  return (
    <nav style={{
      position: 'fixed',
      top: 10, left: 10, right: 10,
      zIndex: 1000,
      background: navBg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: `1px solid ${navBorder}`,
      padding: '8px 16px',
      transition: 'all 0.4s ease',
      boxShadow: scrolled ? 'var(--shadow-card)' : 'none'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            background: 'var(--orange)', borderRadius: '10px',
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px var(--orange-glow)', flexShrink: 0
          }}>
            <FilledLightning />
          </div>
          <span style={{
            fontFamily: "'Poppins',sans-serif",
            fontSize: 'clamp(11px, 2.2vw, 17px)',
            fontWeight: 800, color: 'var(--text-white)', whiteSpace: 'nowrap'
          }}>
            ROHIT <span style={{ color: 'var(--orange)' }}>POWER TOOLS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="d-none d-lg-flex" style={{ alignItems: 'center', gap: 22 }}>
          <Link to="/" className={`nav-link-rpt ${isActive('/') ? 'active' : ''}`}>Home</Link>

          <div style={{ position: 'relative' }}
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}>
            <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: 3 }}
              className={`nav-link-rpt ${isActive('/products') ? 'active' : ''}`}>
              Products <FiChevronDown size={12} style={{ transform: dropOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.2s' }} />
            </Link>
            {dropOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', left: 0,
                background: 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: 12, padding: 8, minWidth: 170, zIndex: 100,
                boxShadow: 'var(--shadow-card)'
              }}>
                {categories.map(cat => (
                  <Link key={cat} to={`/products?category=${cat}`}
                    style={{ display: 'block', color: 'var(--text-muted)', padding: '8px 14px', borderRadius: 6, fontSize: 13, fontFamily: "'Poppins',sans-serif", fontWeight: 500, transition: 'all 0.2s', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--orange)'; e.currentTarget.style.background = 'rgba(249,115,22,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                  >{cat}</Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/chatbot" className={`nav-link-rpt ${isActive('/chatbot') ? 'active' : ''}`}>⚡ AI Support</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className={`nav-link-rpt ${isActive('/admin') ? 'active' : ''}`}>Admin</Link>
          )}
        </div>

        {/* Desktop Right */}
        <div className="d-none d-lg-flex" style={{ alignItems: 'center', gap: 10 }}>
          {/* Theme toggle */}
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

          {/* Cart */}
          <Link to="/payment" style={{ position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <FiShoppingCart color="var(--text-light)" size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -7, right: -7,
                background: 'var(--orange)', color: 'white', borderRadius: '50%',
                width: 17, height: 17, fontSize: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
              }}>{cartCount}</span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none',
                background: 'var(--input-bg)',
                border: '1px solid var(--border)',
                borderRadius: 24, padding: '4px 12px 4px 4px', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.1)'; e.currentTarget.style.borderColor = 'var(--border-orange)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--input-bg)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <ProfileIcon size={26} />
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--text-white)' }}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button onClick={handleLogout}
                style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 9px', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                <FiLogOut size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" style={{
                color: 'var(--text-white)', textDecoration: 'none',
                fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                padding: '7px 16px', borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--input-bg)', transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--orange)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >Login</Link>
              <Link to="/register" className="btn-orange" style={{ padding: '7px 16px', fontSize: 13 }}>Register</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="d-lg-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '7px 9px', color: 'var(--text-white)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          marginTop: 10, padding: '16px',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(20px)',
          borderRadius: 14,
          border: '1px solid var(--border)'
        }}>
          {/* Theme toggle in mobile */}
          <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>

          {[['/', 'Home'], ['/products', 'Products'], ['/chatbot', '⚡ AI Support']].map(([path, label]) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', color: isActive(path) ? 'var(--orange)' : 'var(--text-light)', padding: '11px 0', fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
              {label}
            </Link>
          ))}

          <div style={{ padding: '10px 0 6px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 11, fontFamily: "'Poppins',sans-serif", fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Categories</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {categories.map(cat => (
                <Link key={cat} to={`/products?category=${cat}`} onClick={() => setMenuOpen(false)}
                  style={{ padding: '5px 12px', borderRadius: 20, background: 'var(--input-bg)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 500, textDecoration: 'none' }}>
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
            {user ? (
              <>
                <Link to="/payment" onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0', textDecoration: 'none', color: 'var(--text-light)', fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 600, borderBottom: '1px solid var(--border)' }}>
                  <span><FiShoppingCart size={15} style={{ marginRight: 8 }} />Cart</span>
                  {cartCount > 0 && <span style={{ background: 'var(--orange)', color: 'white', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 800 }}>{cartCount}</span>}
                </Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', textDecoration: 'none', color: 'var(--text-light)', fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 600, borderBottom: '1px solid var(--border)' }}>
                  <ProfileIcon size={22} />{user.name.split(' ')[0]}
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}
                    style={{ display: 'block', color: 'var(--orange)', padding: '11px 0', fontFamily: "'Poppins',sans-serif", fontSize: 15, fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
                    ⚙ Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout}
                  style={{ width: '100%', marginTop: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '11px', color: '#ef4444', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <FiLogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <Link to="/login" onClick={() => setMenuOpen(false)}
                  style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text-white)', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}
                  style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: 10, background: 'var(--orange)', color: 'white', fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .nav-link-rpt { color: var(--text-light); text-decoration: none; font-family: 'Poppins',sans-serif; font-size: 14px; font-weight: 600; transition: color 0.2s; }
        .nav-link-rpt:hover, .nav-link-rpt.active { color: var(--orange); }
        @media (max-width: 991px) { .d-lg-none { display: flex !important; } .d-none.d-lg-flex { display: none !important; } }
        @media (min-width: 992px) { .d-lg-none { display: none !important; } .d-none.d-lg-flex { display: flex !important; } }
      `}</style>
    </nav>
  );
}
