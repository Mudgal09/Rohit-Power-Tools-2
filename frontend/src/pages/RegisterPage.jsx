import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

const FilledLightning = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" fill="white" strokeLinejoin="round"/>
  </svg>
);

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.12)', color: 'white',
  borderRadius: 10, padding: '12px 14px 12px 42px',
  fontFamily: "'Poppins', sans-serif", fontSize: 14,
  outline: 'none', transition: 'all 0.2s', boxSizing: 'border-box'
};
const labelStyle = {
  fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 12,
  letterSpacing: 0.5, color: 'rgba(255,255,255,0.6)', display: 'block',
  marginBottom: 8, textTransform: 'uppercase'
};
const iconStyle = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none', zIndex: 1 };

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleFocus = e => { e.target.style.borderColor = 'rgba(255,85,0,0.6)'; e.target.style.background = 'rgba(255,85,0,0.06)'; };
  const handleBlur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created! ⚡');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden', marginTop: '-70px' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        <ShaderGradientCanvas style={{ width: '100%', height: '100%' }}>
          <ShaderGradient
            animate="on" brightness={1.2} cAzimuthAngle={170} cDistance={4.4}
            cPolarAngle={70} cameraZoom={1} color1="#94ffd1" color2="#6bf5ff"
            color3="#ffffff" destination="onCanvas" envPreset="city" grain="off"
            lightType="3d" type="waterPlane" uAmplitude={0} uDensity={1.2}
            uFrequency={0} uSpeed={0.2} uStrength={3.4} positionY={0.9} positionZ={-0.3} rotationX={45}
          />
        </ShaderGradientCanvas>
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 16px 40px', minHeight: '100vh' }}>
        <div style={{
          background: 'rgba(10,10,10,0.45)',
          backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: '44px 40px',
          width: '100%', maxWidth: 440
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--orange)', borderRadius: '14px', width: 56, height: 56, marginBottom: 14, boxShadow: '0 0 24px rgba(255,85,0,0.5)' }}>
              <FilledLightning />
            </div>
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: 1, color: 'white', marginBottom: 6 }}>CREATE ACCOUNT</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: "'Poppins', sans-serif" }}>Join thousands of professionals</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full Name *</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={iconStyle} size={15} />
                <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={iconStyle} size={15} />
                <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>
            {/* Phone */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <FiPhone style={iconStyle} size={15} />
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>
            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Password *</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={iconStyle} size={15} />
                <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ ...inputStyle, paddingRight: 44 }} onFocus={handleFocus} onBlur={handleBlur} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>
            {/* Confirm */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={iconStyle} size={15} />
                <input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: 'var(--orange)', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,85,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              ⚡ {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.5)', fontSize: 14, fontFamily: "'Poppins', sans-serif" }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
