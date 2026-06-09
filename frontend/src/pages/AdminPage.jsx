import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import toast from 'react-hot-toast';
import {
  FiUsers, FiPackage, FiShoppingBag, FiDollarSign,
  FiPlus, FiEdit3, FiTrash2, FiSave, FiX,
  FiUpload, FiRefreshCw, FiChevronDown
} from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';
const CATEGORIES = ['Drills','Grinders','Saws','Wrenches','Sanders','Accessories'];
const BRANDS = ['Bosch','DeWalt','Makita','Stanley','Hitachi','Milwaukee','Other'];
const STATUS_COLORS = { Pending:'#ffa500', Processing:'#2196f3', Shipped:'#9c27b0', Delivered:'#4caf50', Cancelled:'#f44336' };

const EMPTY_PRODUCT = { name:'', description:'', price:'', originalPrice:'', category:'Drills', brand:'Bosch', stock:'', warranty:'2 Years', isFeatured:false, features:[], images:[], tags:[] };

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [featureInput, setFeatureInput] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);
  useEffect(() => {
    if (tab === 'products') fetchProducts();
    else if (tab === 'users') fetchUsers();
    else if (tab === 'orders') fetchOrders();
  }, [tab]);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/stats`);
      setStats(data);
    } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/products?limit=100`);
      setProducts(data.products);
    } catch {} finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/admin/users`);
      setUsers(data.users);
    } catch {} finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/orders`);
      setOrders(data.orders);
    } catch {} finally { setLoading(false); }
  };

  const openProductForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({ ...product, price: product.price?.toString(), originalPrice: product.originalPrice?.toString() || '', stock: product.stock?.toString() });
      setImageUrls(product.images?.join('\n') || '');
    } else {
      setEditingProduct(null);
      setProductForm(EMPTY_PRODUCT);
      setImageUrls('');
    }
    setShowProductForm(true);
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.stock) return toast.error('Fill required fields');
    setSaving(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        stock: Number(productForm.stock),
        images: imageUrls.split('\n').map(u => u.trim()).filter(Boolean)
      };
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await axios.post(`${API}/products`, payload);
        toast.success('Product created!');
      }
      setShowProductForm(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API}/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await axios.delete(`${API}/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`${API}/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch { toast.error('Update failed'); }
  };

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: FiDollarSign },
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'users', label: 'Users', icon: FiUsers },
  ];

  const StatCard = ({ icon: Icon, label, value, color = 'var(--orange)' }) => (
    <div className="card-dark" style={{ padding: 24 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon color={color} size={18} />
        </div>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color, letterSpacing: 1 }}>{value}</div>
    </div>
  );

  return (
    <div style={{ background: 'var(--bg-black)', minHeight: '100vh' }}>
      {/* Header with Viola shader */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden', marginTop: '-70px' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <ShaderGradientCanvas style={{ width: '100%', height: '100%' }}>
            <ShaderGradient
              animate="on"
              brightness={1.1}
              cAzimuthAngle={0}
              cDistance={7.1}
              cPolarAngle={140}
              cameraZoom={17.3}
              color1="#ffffff"
              color2="#ffbb00"
              color3="#0700ff"
              destination="onCanvas"
              envPreset="city"
              grain="off"
              lightType="3d"
              type="sphere"
              uAmplitude={1.4}
              uDensity={1.1}
              uFrequency={5.5}
              uSpeed={0.1}
              uStrength={1}
            />
          </ShaderGradientCanvas>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} />
        <div className="container h-100 d-flex align-items-end pb-4" style={{ position: 'relative', zIndex: 1, paddingTop: '100px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: 2, margin: 0 }}>
              ⚙ ADMIN <span style={{ color: 'var(--orange)' }}>PANEL</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-heading)' }}>Rohit Power Tools Control Center</p>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-2">
            <div className="card-dark" style={{ padding: 8 }}>
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: tab === id ? 'rgba(255,85,0,0.12)' : 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    color: tab === id ? 'var(--orange)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 14,
                    cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderLeft: `3px solid ${tab === id ? 'var(--orange)' : 'transparent'}`,
                    marginBottom: 2, transition: 'all 0.2s'
                  }}>
                  <Icon size={15} />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-10">

            {/* Dashboard */}
            {tab === 'dashboard' && (
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 24 }}>Dashboard Overview</h4>
                {stats ? (
                  <>
                    <div className="row g-4 mb-4">
                      <div className="col-6 col-md-3"><StatCard icon={FiUsers} label="Total Users" value={stats.stats.totalUsers} /></div>
                      <div className="col-6 col-md-3"><StatCard icon={FiPackage} label="Products" value={stats.stats.totalProducts} color="#2196f3" /></div>
                      <div className="col-6 col-md-3"><StatCard icon={FiShoppingBag} label="Orders" value={stats.stats.totalOrders} color="#9c27b0" /></div>
                      <div className="col-6 col-md-3"><StatCard icon={FiDollarSign} label="Revenue" value={`₹${(stats.stats.totalRevenue/1000).toFixed(1)}K`} color="#4caf50" /></div>
                    </div>

                    {/* Category breakdown */}
                    <div className="row g-4">
                      <div className="col-md-5">
                        <div className="card-dark" style={{ padding: 24 }}>
                          <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 16 }}>Products by Category</h6>
                          {stats.categoryStats?.map(c => (
                            <div key={c._id} className="d-flex justify-content-between align-items-center mb-3">
                              <span style={{ color: 'var(--text-light)', fontSize: 14 }}>{c._id}</span>
                              <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 80, height: 6, background: 'var(--bg-dark)', borderRadius: 3, overflow: 'hidden' }}>
                                  <div style={{ height: '100%', background: 'var(--orange)', width: `${Math.min(100, (c.count / 50) * 100)}%` }} />
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: 12, minWidth: 20, textAlign: 'right' }}>{c.count}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="col-md-7">
                        <div className="card-dark" style={{ padding: 24 }}>
                          <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 16 }}>Recent Orders</h6>
                          {stats.recentOrders?.slice(0, 6).map(o => (
                            <div key={o._id} className="d-flex justify-content-between align-items-center mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                              <div>
                                <p style={{ margin: 0, fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'white' }}>
                                  #{o._id.slice(-6).toUpperCase()}
                                </p>
                                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{o.user?.name}</p>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <span style={{ fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 700 }}>₹{o.totalPrice?.toLocaleString('en-IN')}</span>
                                <span style={{
                                  padding: '2px 8px', borderRadius: 12, fontSize: 11,
                                  background: `${STATUS_COLORS[o.status]}20`, color: STATUS_COLORS[o.status],
                                  fontFamily: 'var(--font-heading)', fontWeight: 700
                                }}>{o.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : <div className="text-center py-5"><div className="loader mx-auto" /></div>}
              </div>
            )}

            {/* Products */}
            {tab === 'products' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, margin: 0 }}>
                    Products ({products.length})
                  </h4>
                  <button onClick={() => openProductForm()} className="btn-orange">
                    <FiPlus size={14} /> Add Product
                  </button>
                </div>

                {/* Product Form Modal */}
                {showProductForm && (
                  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <div style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-orange)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 32,
                      width: '100%', maxWidth: 640,
                      maxHeight: '90vh', overflowY: 'auto'
                    }}>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, margin: 0 }}>
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h5>
                        <button onClick={() => setShowProductForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                          <FiX size={20} />
                        </button>
                      </div>

                      <div className="row g-3">
                        <div className="col-12">
                          <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Product Name *</label>
                          <input className="input-dark" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Bosch GSB 550 Drill" />
                        </div>
                        <div className="col-12">
                          <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Description *</label>
                          <textarea className="input-dark" rows={3} value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} placeholder="Product description..." style={{ resize: 'vertical' }} />
                        </div>
                        <div className="col-md-4">
                          <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Price (₹) *</label>
                          <input className="input-dark" type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="2999" />
                        </div>
                        <div className="col-md-4">
                          <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Original Price (₹)</label>
                          <input className="input-dark" type="number" value={productForm.originalPrice} onChange={e => setProductForm(f => ({ ...f, originalPrice: e.target.value }))} placeholder="3999" />
                        </div>
                        <div className="col-md-4">
                          <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Stock *</label>
                          <input className="input-dark" type="number" value={productForm.stock} onChange={e => setProductForm(f => ({ ...f, stock: e.target.value }))} placeholder="50" />
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Category</label>
                          <select className="input-dark" value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Brand</label>
                          <select className="input-dark" value={productForm.brand} onChange={e => setProductForm(f => ({ ...f, brand: e.target.value }))}>
                            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </div>
                        <div className="col-12">
                          <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                            Image URLs (one per line — paste Cloudinary/external URLs)
                          </label>
                          <textarea className="input-dark" rows={3} value={imageUrls} onChange={e => setImageUrls(e.target.value)} placeholder="https://res.cloudinary.com/..." style={{ resize: 'vertical', fontFamily: 'monospace', fontSize: 12 }} />
                        </div>
                        <div className="col-12">
                          <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Features (press Enter to add)</label>
                          <div className="d-flex gap-2 mb-2">
                            <input className="input-dark" value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && featureInput.trim()) {
                                  setProductForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
                                  setFeatureInput('');
                                }
                              }}
                              placeholder="e.g. Variable speed control" />
                          </div>
                          <div className="d-flex flex-wrap gap-2">
                            {productForm.features.map((feat, i) => (
                              <span key={i} style={{ background: 'rgba(255,85,0,0.12)', border: '1px solid var(--border-orange)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: 'var(--orange)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                {feat}
                                <button onClick={() => setProductForm(f => ({ ...f, features: f.features.filter((_, j) => j !== i) }))}
                                  style={{ background: 'none', border: 'none', color: 'var(--orange)', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="col-12">
                          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                            <input type="checkbox" checked={productForm.isFeatured} onChange={e => setProductForm(f => ({ ...f, isFeatured: e.target.checked }))}
                              style={{ width: 16, height: 16, accentColor: 'var(--orange)' }} />
                            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14 }}>Mark as Featured Product</span>
                          </label>
                        </div>
                      </div>

                      <div className="d-flex gap-3 mt-4">
                        <button onClick={() => setShowProductForm(false)} className="btn-outline">Cancel</button>
                        <button onClick={saveProduct} disabled={saving} className="btn-orange flex-grow-1 justify-content-center">
                          <FiSave size={14} /> {saving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {loading ? <div className="text-center py-5"><div className="loader mx-auto" /></div> : (
                  <div className="row g-3">
                    {products.map(p => (
                      <div key={p._id} className="col-12">
                        <div className="card-dark d-flex align-items-center gap-3" style={{ padding: '16px 20px' }}>
                          <img src={p.images?.[0] || `https://placehold.co/60x60/1a1a1a/ff5500?text=T`} alt={p.name}
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 2px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'white' }}>{p.name}</p>
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{p.brand} · {p.category} · Stock: {p.stock}</p>
                          </div>
                          <div className="d-flex align-items-center gap-3">
                            {p.isFeatured && <span className="badge-orange">Featured</span>}
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--orange)' }}>₹{p.price?.toLocaleString('en-IN')}</span>
                            <button onClick={() => openProductForm(p)} style={{ background: 'rgba(33,150,243,0.12)', border: '1px solid rgba(33,150,243,0.3)', color: '#2196f3', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                              <FiEdit3 size={12} /> Edit
                            </button>
                            <button onClick={() => deleteProduct(p._id)} style={{ background: 'rgba(244,67,54,0.12)', border: '1px solid rgba(244,67,54,0.3)', color: '#f44336', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                              <FiTrash2 size={12} /> Del
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 24 }}>All Orders ({orders.length})</h4>
                {loading ? <div className="text-center py-5"><div className="loader mx-auto" /></div> : (
                  <div className="d-flex flex-column gap-3">
                    {orders.map(o => (
                      <div key={o._id} className="card-dark" style={{ padding: '18px 22px' }}>
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                          <div>
                            <p style={{ margin: '0 0 2px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'white' }}>
                              #{o._id.slice(-8).toUpperCase()}
                            </p>
                            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                              {o.user?.name} · {new Date(o.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                          <div className="d-flex align-items-center gap-3 flex-wrap">
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--orange)' }}>₹{o.totalPrice?.toLocaleString('en-IN')}</span>
                            <span style={{
                              padding: '4px 10px', borderRadius: 12, fontSize: 12,
                              background: `${STATUS_COLORS[o.status]}18`, color: STATUS_COLORS[o.status],
                              fontFamily: 'var(--font-heading)', fontWeight: 700
                            }}>{o.status}</span>
                            <select
                              value={o.status}
                              onChange={e => updateOrderStatus(o._id, e.target.value)}
                              style={{
                                background: 'var(--bg-dark)', border: '1px solid var(--border)',
                                color: 'var(--text-light)', borderRadius: 6, padding: '6px 10px',
                                fontFamily: 'var(--font-heading)', fontSize: 13, cursor: 'pointer'
                              }}
                            >
                              {['Pending','Processing','Shipped','Delivered','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users */}
            {tab === 'users' && (
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 24 }}>All Users ({users.length})</h4>
                {loading ? <div className="text-center py-5"><div className="loader mx-auto" /></div> : (
                  <div className="d-flex flex-column gap-3">
                    {users.map(u => (
                      <div key={u._id} className="card-dark d-flex align-items-center gap-3" style={{ padding: '16px 22px' }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          background: u.role === 'admin' ? 'linear-gradient(135deg, var(--orange), var(--gold))' : 'rgba(255,255,255,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-display)', fontSize: 20, color: 'white', flexShrink: 0
                        }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 2px', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 15, color: 'white' }}>{u.name}</p>
                          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{u.email} · Joined {new Date(u.createdAt).toLocaleDateString('en-IN')}</p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{
                            padding: '4px 10px', borderRadius: 12, fontSize: 12,
                            background: u.role === 'admin' ? 'rgba(255,85,0,0.15)' : 'rgba(255,255,255,0.06)',
                            color: u.role === 'admin' ? 'var(--orange)' : 'var(--text-muted)',
                            fontFamily: 'var(--font-heading)', fontWeight: 700, textTransform: 'uppercase'
                          }}>{u.role}</span>
                          <button onClick={() => deleteUser(u._id)}
                            style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', color: '#f44336', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                            <FiTrash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
