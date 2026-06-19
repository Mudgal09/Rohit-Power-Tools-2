import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import ProductCard from '../components/ProductCard.jsx';
import { FiZap, FiShield, FiRefreshCw, FiTruck, FiStar, FiArrowRight, FiMic } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';

const STATS = [
  { value: '500+', label: 'Products' },
  { value: '50K+', label: 'Customers' },
  { value: '15+', label: 'Brands' },
  { value: '4.8★', label: 'Avg Rating' }
];

const FEATURES = [
  { icon: FiTruck, title: 'Free Shipping', desc: 'On orders above ₹2,000' },
  { icon: FiRefreshCw, title: '30-Day Returns', desc: 'Hassle-free policy' },
  { icon: FiShield, title: '2-Year Warranty', desc: 'On premium tools' },
  { icon: FiZap, title: 'AI Support', desc: '24/7 Bolt AI chat' }
];

const CATEGORIES = [
  { name: 'Drills', emoji: '🔩', count: 48 },
  { name: 'Grinders', emoji: '⚙️', count: 32 },
  { name: 'Saws', emoji: '🔪', count: 25 },
  { name: 'Wrenches', emoji: '🔧', count: 40 },
  { name: 'Sanders', emoji: '🛠️', count: 18 },
  { name: 'Accessories', emoji: '🔋', count: 120 }
];

const BRANDS = ['Bosch', 'DeWalt', 'Makita', 'Stanley', 'Hitachi', 'Milwaukee'];

const REVIEWS = [
  { name: 'Rajesh Kumar', product: 'Bosch GSB 550 Drill', rating: 5, comment: 'Excellent quality and very powerful. Delivered in 2 days to Delhi. Highly recommended!' },
  { name: 'Priya Singh', product: 'Makita 9523NB Grinder', rating: 5, comment: 'The AI chatbot helped me choose the right grinder. Got it at 30% off. Amazing service!' },
  { name: 'Amit Sharma', product: 'DeWalt DCS331 Jigsaw', rating: 4, comment: 'Great product range. DeWalt jigsaw is top quality. Fast shipping and solid packaging!' }
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/products/featured`)
      .then(r => setFeatured(r.data.products || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', marginTop: '-70px' }}>
        {/* ShaderGradient - Mandarin */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <ShaderGradientCanvas style={{ width: '100%', height: '100%' }}>
            <ShaderGradient
              animate="on"
              brightness={1.2}
              cAzimuthAngle={180}
              cDistance={2.4}
              cPolarAngle={95}
              cameraZoom={1}
              color1="#ff6a1a"
              color2="#c73c00"
              color3="#FD4912"
              destination="onCanvas"
              envPreset="city"
              fov={45}
              grain="off"
              lightType="3d"
              pixelDensity={1}
              positionX={0}
              positionY={-2.1}
              positionZ={0}
              reflection={0.1}
              rotationX={0}
              rotationY={0}
              rotationZ={225}
              type="waterPlane"
              uAmplitude={0}
              uDensity={1.8}
              uFrequency={5.5}
              uSpeed={0.2}
              uStrength={3}
              uTime={0.2}
              wireframe={false}
            />
          </ShaderGradientCanvas>
        </div>
        {/* Subtle dark overlay — less than before so shader pops */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)', zIndex: 1 }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '110px' }}>
          <div className="row align-items-center" style={{ minHeight: '85vh' }}>
            <div className="col-lg-7">
              <div style={{ animation: 'fadeUp 0.7s ease' }}>
                <p style={{
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: 3,
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 20,
                  textTransform: 'uppercase'
                }}>
                  ⚡ INDIA'S #1 POWER TOOL STORE – EST. 2010
                </p>

                <h1 style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: 'clamp(44px, 6.5vw, 88px)',
                  lineHeight: 1.05,
                  fontWeight: 800,
                  letterSpacing: '-1px',
                  marginBottom: 28,
                  color: 'white'
                }}>
                  Built for <span style={{ color: 'var(--orange)', fontStyle: 'italic' }}>Power.</span><br />
                  Professional-grade tools<br />
                  for every trade.
                </h1>

                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 40, maxWidth: 480, lineHeight: 1.8, fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
                  Drills, grinders, saws and more — from brands professionals trust worldwide.
                </p>

                {/* Pill buttons matching reference */}
                <div className="d-flex flex-wrap gap-3 mb-5">
                  {/* Shop Now — filled orange pill */}
                  <Link to="/products" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: 'var(--orange)',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '14px 24px',
                    borderRadius: '50px',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700, fontSize: 15,
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 20px rgba(255,85,0,0.4)'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,85,0,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,85,0,0.4)'; }}
                  >
                    <span style={{
                      background: 'rgba(255,255,255,0.25)',
                      borderRadius: '50%', width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FiZap size={14} />
                    </span>
                    Shop Now
                    <span style={{
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%', width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12
                    }}>↗</span>
                  </Link>

                  {/* AI Support — dark pill */}
                  <Link to="/chatbot" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: 'rgba(0,0,0,0.45)',
                    backdropFilter: 'blur(12px)',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '14px 24px',
                    borderRadius: '50px',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700, fontSize: 15,
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.65)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.45)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span style={{
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '50%', width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14
                    }}>🤖</span>
                    AI Support
                    <span style={{
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '50%', width: 28, height: 28,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12
                    }}>↗</span>
                  </Link>
                </div>

                {/* Stats */}
                <div className="d-flex flex-wrap gap-4">
                  {STATS.map(s => (
                    <div key={s.label}>
                      <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 30, fontWeight: 800, color: 'var(--orange)' }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: "'Poppins', sans-serif", fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
          <div style={{ width: 1, height: 60, background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)', margin: '0 auto' }} />
        </div>
      </section>

      {/* ===== FEATURES STRIP ===== */}
      <section style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="container">
          <div className="row g-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-3">
                  <div style={{ background: 'rgba(255,85,0,0.1)', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon color="var(--orange)" size={18} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: 'white' }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section style={{ padding: '80px 0', background: 'var(--bg-black)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mx-auto">① Shop by Category</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: 1 }}>
              EVERY TOOL YOU NEED,<br /><span className="text-gradient">ALL IN ONE PLACE.</span>
            </h2>
          </div>
          <div className="row g-3">
            {CATEGORIES.map(cat => (
              <div key={cat.name} className="col-6 col-md-4 col-lg-2">
                <Link to={`/products?category=${cat.name}`} className="text-decoration-none">
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '24px 16px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--orange)';
                      e.currentTarget.style.background = 'rgba(255,85,0,0.08)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg-card)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.emoji}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14, color: 'white', letterSpacing: 1 }}>{cat.name.toUpperCase()}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{cat.count} items</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROMO BANNER ===== */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            padding: '48px',
            background: 'linear-gradient(135deg, #ff5500 0%, #ff8800 50%, #ffa500 100%)'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 8, color: 'rgba(0,0,0,0.7)' }}>LIMITED TIME OFFER</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', color: 'black', letterSpacing: 1, marginBottom: 8 }}>
                MEGA TOOLS SALE<br />UP TO 40% OFF
              </h2>
              <p style={{ color: 'rgba(0,0,0,0.7)', marginBottom: 24, fontFamily: 'var(--font-heading)' }}>
                Use code <strong>ROHIT10</strong> for extra 10% off
              </p>
              <Link to="/products" style={{
                background: 'black',
                color: 'white',
                padding: '12px 28px',
                borderRadius: 8,
                textDecoration: 'none',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: 15,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}>
                <FiZap size={15} /> Shop Deals
              </Link>
            </div>
            {/* Decorative gear */}
            <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 160, opacity: 0.12, userSelect: 'none' }}>⚙</div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section style={{ padding: '20px 0 80px', background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-5">
            <div>
              <div className="section-label">Featured Products</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: 1 }}>
                TOP PICKS FOR <span className="text-gradient">PROFESSIONALS</span>
              </h2>
            </div>
            <Link to="/products" className="btn-outline d-none d-md-flex">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="loader mx-auto" /></div>
          ) : featured.length > 0 ? (
            <div className="row g-4">
              {featured.map(p => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 18 }}>No featured products yet. Add some from the admin panel!</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== BRANDS ===== */}
      <section style={{ padding: '60px 0', background: 'var(--bg-black)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mx-auto">② Top Brands We Carry</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 52px)', letterSpacing: 1 }}>
              BRANDS PROFESSIONALS<br /><span className="text-gradient">TRUST WORLDWIDE.</span>
            </h2>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {BRANDS.map(brand => (
              <Link key={brand} to={`/products?brand=${brand}`}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '12px 28px',
                  color: 'var(--text-light)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: 1.5,
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-light)'; }}
              >{brand.toUpperCase()}</Link>
            ))}
          </div>

          {/* About blurb */}
          <div className="row mt-5 align-items-center g-4">
            <div className="col-md-5">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
                Rohit Power Tools is Haryana's most trusted power tool store
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: 14 }}>
                Serving professionals, contractors, and DIY enthusiasts since 2010. We stock India's top brands with same-day dispatch before 2PM.
              </p>
              <div className="d-flex gap-3 mt-4">
                <Link to="/products" className="btn-orange">Browse Products</Link>
                <Link to="/chatbot" className="btn-outline">Chat with Bolt AI</Link>
              </div>
            </div>
            <div className="col-md-7">
              <div className="row g-3">
                {FEATURES.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="col-6">
                    <div style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding: '20px'
                    }}>
                      <div style={{ color: 'var(--orange)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
                        <Icon size={14} style={{ marginRight: 6 }} />{title}
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-label mx-auto">③ Customer Reviews</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 52px)', letterSpacing: 1 }}>
              WHAT OUR <span className="text-gradient">CUSTOMERS SAY</span>
            </h2>
          </div>
          <div className="row g-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="col-md-4">
                <div className="card-dark" style={{ padding: '28px', height: '100%' }}>
                  <div className="d-flex mb-3">
                    {[...Array(5)].map((_, j) => (
                      <FiStar key={j} size={14} fill={j < r.rating ? '#ffa500' : 'none'} color={j < r.rating ? '#ffa500' : 'var(--border)'} />
                    ))}
                  </div>
                  <p style={{ color: 'var(--text-light)', fontSize: 14, lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>
                    "{r.comment}"
                  </p>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: 'var(--orange)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700, color: 'white', fontSize: 16
                    }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'white' }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.product}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
