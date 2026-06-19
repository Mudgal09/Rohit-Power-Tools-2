import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiPackage, FiEdit3, FiSave, FiX } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';
const STATUS_COLORS = { Pending:'#F97316', Processing:'#3b82f6', Shipped:'#8b5cf6', Delivered:'#22c55e', Cancelled:'#ef4444' };

/* FIX: use CSS variables instead of hardcoded white so light mode works */
const inputBase = {
  width: '100%',
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  color: 'var(--text-white)',
  borderRadius: 8,
  padding: '11px 14px 11px 40px',
  fontFamily: "'Poppins', sans-serif",
  fontSize: 14,
  outline: 'none',
  transition: 'all 0.2s',
  boxSizing: 'border-box'
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { isDark } = useTheme();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || { street:'', city:'', state:'', pincode:'' }
  });
  const [passForm, setPassForm] = useState({ currentPassword:'', newPassword:'', confirm:'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (tab === 'orders') fetchOrders(); }, [tab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get(`${API}/orders/my-orders`);
      setOrders(data.orders);
    } catch { setOrders([]); }
    finally { setOrdersLoading(false); }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`${API}/auth/me`, form);
      updateUser(data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirm) return toast.error('Passwords do not match');
    if (passForm.newPassword.length < 6) return toast.error('Min 6 characters');
    setSaving(true);
    try {
      await axios.put(`${API}/auth/change-password`, { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      toast.success('Password changed!');
      setPassForm({ currentPassword:'', newPassword:'', confirm:'' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const tabs = [
    { id:'profile', label:'My Profile', icon:FiUser },
    { id:'orders',  label:'My Orders',  icon:FiPackage },
    { id:'security',label:'Security',   icon:FiLock }
  ];

  /* FIX: shader overlay adapts to dark/light theme */
  const shaderOverlay = isDark
    ? 'linear-gradient(to bottom, rgba(17,24,39,0.45) 0%, rgba(17,24,39,1) 100%)'
    : 'linear-gradient(to bottom, rgba(253,246,236,0.45) 0%, rgba(253,246,236,1) 100%)';

  /* FIX: input focus styles use CSS variables */
  const onFocus = e => {
    e.target.style.borderColor = 'rgba(249,115,22,0.6)';
    e.target.style.background = 'var(--input-focus-bg)';
  };
  const onBlur = e => {
    e.target.style.borderColor = 'var(--input-border)';
    e.target.style.background = 'var(--input-bg)';
  };

  return (
    <div style={{ background: 'var(--bg-black)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* Shader — position:absolute so it stays inside this page only */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '420px', zIndex: 0, pointerEvents: 'none' }}>
        <ShaderGradientCanvas style={{ width:'100%', height:'100%' }}>
          <ShaderGradient
            animate="on" brightness={1.1} cAzimuthAngle={0} cDistance={7.1}
            cPolarAngle={140} cameraZoom={17.3} color1="#ffffff" color2="#ffbb00"
            color3="#0700ff" destination="onCanvas" envPreset="city" grain="off"
            lightType="3d" type="sphere" uAmplitude={1.4} uDensity={1.1}
            uFrequency={5.5} uSpeed={0.1} uStrength={1}
          />
        </ShaderGradientCanvas>
        {/* FIX: fade shader into page bg — adapts to dark/light theme */}
        <div style={{ position:'absolute', inset:0, background: shaderOverlay }} />
      </div>

      {/* Content */}
      <div style={{ position:'relative', zIndex:1, paddingTop:100, paddingBottom:80 }}>
        <div className="container">

          {/* Profile header */}
          <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:40, flexWrap:'wrap' }}>
            <div style={{
              width:68, height:68, borderRadius:'50%',
              background:'linear-gradient(135deg, #F97316, #fbbf24)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Poppins',sans-serif", fontSize:28, fontWeight:800, color:'white', flexShrink:0,
              boxShadow:'0 0 24px rgba(249,115,22,0.45)'
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              {/* FIX: use var(--text-white) so it shows in light mode */}
              <h1 style={{ fontFamily:"'Poppins',sans-serif", fontSize:'clamp(20px,4vw,34px)', fontWeight:800, marginBottom:4, color:'var(--text-white)' }}>{user?.name}</h1>
              <p style={{ color:'var(--text-muted)', margin:0, fontSize:14, fontFamily:"'Poppins',sans-serif" }}>
                {user?.email} · <span style={{ color:'#F97316', fontWeight:700 }}>{user?.role?.toUpperCase()}</span>
              </p>
            </div>
          </div>

          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3 col-md-4 col-12">
              {/* FIX: use CSS variables for sidebar bg/border */}
              <div style={{ background:'var(--card-bg)', backdropFilter:'blur(20px)', border:'1px solid var(--card-border)', borderRadius:16, padding:8 }}>
                {tabs.map(({ id, label, icon:Icon }) => (
                  <button key={id} onClick={() => setTab(id)} style={{
                    width:'100%', padding:'12px 16px',
                    background: tab===id ? 'rgba(249,115,22,0.12)' : 'transparent',
                    border:'none', borderRadius:10,
                    /* FIX: use CSS vars for tab text color */
                    color: tab===id ? '#F97316' : 'var(--text-muted)',
                    fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:14,
                    cursor:'pointer', textAlign:'left',
                    display:'flex', alignItems:'center', gap:10,
                    borderLeft:`3px solid ${tab===id ? '#F97316' : 'transparent'}`,
                    marginBottom:2, transition:'all 0.2s'
                  }}>
                    <Icon size={15}/>{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="col-lg-9 col-md-8 col-12">
              {/* FIX: use CSS variables for main panel bg/border */}
              <div style={{ background:'var(--card-bg)', backdropFilter:'blur(20px)', border:'1px solid var(--card-border)', borderRadius:16, padding:'clamp(18px,4vw,32px)' }}>

                {/* ── Profile tab ── */}
                {tab==='profile' && (
                  <>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:26, flexWrap:'wrap', gap:10 }}>
                      {/* FIX: heading uses CSS var */}
                      <h4 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, margin:0, fontSize:'clamp(16px,3vw,20px)', color:'var(--text-white)' }}>Personal Information</h4>
                      <button onClick={() => editing ? saveProfile() : setEditing(true)} disabled={saving}
                        style={{ background:'#F97316', border:'none', borderRadius:10, padding:'9px 20px', color:'white', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                        {editing ? <><FiSave size={13}/>{saving?'Saving...':'Save'}</> : <><FiEdit3 size={13}/>Edit</>}
                      </button>
                    </div>

                    <div className="row g-3">
                      {[{label:'Full Name',field:'name',Icon:FiUser,type:'text'},{label:'Phone',field:'phone',Icon:FiPhone,type:'tel'}].map(({label,field,Icon,type})=>(
                        <div key={field} className="col-md-6 col-12">
                          {/* FIX: label uses CSS var */}
                          <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:6, letterSpacing:0.5 }}>{label}</label>
                          <div style={{ position:'relative' }}>
                            <Icon style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} size={14}/>
                            <input type={type} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} disabled={!editing}
                              style={{ ...inputBase, opacity:editing?1:0.6 }}
                              onFocus={onFocus} onBlur={onBlur}
                            />
                          </div>
                        </div>
                      ))}

                      <div className="col-12">
                        <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:6, letterSpacing:0.5 }}>
                          <FiMapPin size={11} style={{ marginRight:4 }}/>Address
                        </label>
                        <div className="row g-2">
                          {['street','city','state','pincode'].map(f=>(
                            <div key={f} className={f==='street'?'col-12':'col-sm-4 col-6'}>
                              <input placeholder={f.charAt(0).toUpperCase()+f.slice(1)} value={form.address[f]||''} disabled={!editing}
                                onChange={e=>setForm(p=>({...p,address:{...p.address,[f]:e.target.value}}))}
                                style={{ ...inputBase, paddingLeft:14, opacity:editing?1:0.6 }}
                                onFocus={onFocus} onBlur={onBlur}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-6 col-12">
                        <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:6, letterSpacing:0.5 }}>Email</label>
                        <div style={{ position:'relative' }}>
                          <FiMail style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} size={14}/>
                          <input value={user?.email} disabled style={{ ...inputBase, opacity:0.4 }}/>
                        </div>
                        <p style={{ fontSize:11, color:'var(--text-muted)', marginTop:4, fontFamily:"'Poppins',sans-serif" }}>Email cannot be changed</p>
                      </div>
                    </div>

                    {editing && (
                      <button onClick={()=>setEditing(false)} style={{ marginTop:16, background:'transparent', border:'1px solid var(--border)', borderRadius:10, padding:'9px 20px', color:'var(--text-muted)', fontFamily:"'Poppins',sans-serif", fontWeight:600, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                        <FiX size={13}/> Cancel
                      </button>
                    )}
                  </>
                )}

                {/* ── Orders tab ── */}
                {tab==='orders' && (
                  <>
                    <h4 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, marginBottom:24, fontSize:'clamp(16px,3vw,20px)', color:'var(--text-white)' }}>My Orders</h4>
                    {ordersLoading
                      ? <div className="text-center py-5"><div className="loader mx-auto"/></div>
                      : orders.length===0
                        ? <div style={{ textAlign:'center', padding:'48px 20px' }}>
                            <div style={{ fontSize:52, marginBottom:16 }}>📦</div>
                            <h5 style={{ fontFamily:"'Poppins',sans-serif", color:'var(--text-muted)', marginBottom:8 }}>No orders yet</h5>
                            <p style={{ color:'var(--text-muted)', fontSize:14 }}>Your order history will appear here</p>
                          </div>
                        : <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                            {orders.map(order=>(
                              /* FIX: order card uses CSS vars */
                              <div key={order._id} style={{ background:'var(--input-bg)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 20px' }}>
                                <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:10 }}>
                                  <div>
                                    <p style={{ margin:'0 0 4px', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, color:'var(--text-white)' }}>Order #{order._id.slice(-8).toUpperCase()}</p>
                                    <p style={{ margin:0, color:'var(--text-muted)', fontSize:12 }}>{new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
                                  </div>
                                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                    <span style={{ padding:'4px 12px', borderRadius:20, fontSize:12, background:`${STATUS_COLORS[order.status]}20`, color:STATUS_COLORS[order.status], fontWeight:700 }}>{order.status}</span>
                                    <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:800, color:'#F97316' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                    }
                  </>
                )}

                {/* ── Security tab ── */}
                {tab==='security' && (
                  <>
                    <h4 style={{ fontFamily:"'Poppins',sans-serif", fontWeight:700, marginBottom:24, fontSize:'clamp(16px,3vw,20px)', color:'var(--text-white)' }}>Change Password</h4>
                    <form onSubmit={changePassword} style={{ maxWidth:420 }}>
                      {[{label:'Current Password',field:'currentPassword'},{label:'New Password',field:'newPassword'},{label:'Confirm New Password',field:'confirm'}].map(({label,field})=>(
                        <div key={field} style={{ marginBottom:16 }}>
                          <label style={{ fontFamily:"'Poppins',sans-serif", fontSize:11, color:'var(--text-muted)', textTransform:'uppercase', display:'block', marginBottom:6, letterSpacing:0.5 }}>{label}</label>
                          <div style={{ position:'relative' }}>
                            <FiLock style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }} size={14}/>
                            <input type="password" placeholder="••••••••" value={passForm[field]} onChange={e=>setPassForm(f=>({...f,[field]:e.target.value}))}
                              style={inputBase}
                              onFocus={onFocus} onBlur={onBlur}
                            />
                          </div>
                        </div>
                      ))}
                      <button type="submit" disabled={saving}
                        style={{ background:'#F97316', border:'none', borderRadius:10, padding:'12px 24px', color:'white', fontFamily:"'Poppins',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', marginTop:8 }}>
                        {saving?'Updating...':'🔒 Update Password'}
                      </button>
                    </form>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
