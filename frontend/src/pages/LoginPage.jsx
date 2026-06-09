import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const FilledLightning = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" fill="white" strokeLinejoin="round"/>
  </svg>
);

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! ⚡`);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', marginTop: '-70px' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <ShaderGradientCanvas style={{ width: '100%', height: '100%' }}>
          <ShaderGradient
            animate="on" brightness={1} cAzimuthAngle={180} cDistance={2.8}
            cPolarAngle={80} cameraZoom={9.1} color1="#606080" color2="#8d7dca"
            color3="#212121" destination="onCanvas" envPreset="city" grain="on"
            lightType="3d" type="waterPlane" uAmplitude={0} uDensity={1.5}
            uFrequency={0} uSpeed={0.3} uStrength={1.5} uTime={8}
          />
        </ShaderGradientCanvas>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 16px 40px', minHeight: '100vh' }}>
        <div style={{
          background: 'rgba(10,10,10,0.45)',
          backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: '44px 40px',
          width: '100%', maxWidth: 420
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--orange)', borderRadius: '14px', width: 56, height: 56, marginBottom: 16, boxShadow: '0 0 24px rgba(255,85,0,0.5)' }}>
              <FilledLightning />
            </div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: 1, color: 'white', marginBottom: 6 }}>WELCOME BACK</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: "'Poppins', sans-serif" }}>Sign in to your Rohit Power Tools account</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: 0.5, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none', zIndex: 1 }} size={15} />
                <input
                  type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)', color: 'white',
                    borderRadius: 10, padding: '12px 14px 12px 42px',
                    fontFamily: "'Poppins', sans-serif", fontSize: 14,
                    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,85,0,0.6)'; e.target.style.background = 'rgba(255,85,0,0.06)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: 0.5, color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none', zIndex: 1 }} size={15} />
                <input
                  type={showPass ? 'text' : 'password'} placeholder="Your password"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{
                    width: '100%', background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)', color: 'white',
                    borderRadius: 10, padding: '12px 44px 12px 42px',
                    fontFamily: "'Poppins', sans-serif", fontSize: 14,
                    outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,85,0,0.6)'; e.target.style.background = 'rgba(255,85,0,0.06)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: 'var(--orange)', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(255,85,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              ⚡ {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: "'Poppins', sans-serif" }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>Register Now</Link>
          </p>

          <div style={{ background: 'rgba(255,85,0,0.08)', border: '1px solid rgba(255,85,0,0.2)', borderRadius: 10, padding: '12px 16px', marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: "'Poppins', sans-serif" }}>
            💡 Admin: Set role to "admin" in MongoDB for your user
          </div>
        </div>
      </div>
    </div>
  );
}
