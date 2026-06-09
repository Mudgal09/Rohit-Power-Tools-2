import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiMapPin, FiCreditCard, FiZap, FiTag } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';

export default function PaymentPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=cart, 2=address, 3=review
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paying, setPaying] = useState(false);

  const [address, setAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || ''
  });

  const shipping = cartTotal >= 2000 ? 0 : 99;
  const tax = Math.round(cartTotal * 0.18);
  const discountAmt = Math.round(cartTotal * discount);
  const total = cartTotal + shipping + tax - discountAmt;

  const applyCoupon = () => {
    if (couponApplied) return toast.error('Coupon already applied');
    if (coupon.toUpperCase() === 'ROHIT10') {
      setDiscount(0.10);
      setCouponApplied(true);
      toast.success('Coupon applied! Extra 10% off 🎉');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleRazorpay = async () => {
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      return toast.error('Please fill all address fields');
    }
    setPaying(true);
    try {
      const orderData = {
        orderItems: cart.map(i => ({ product: i._id, name: i.name, image: i.images?.[0] || '', price: i.price, quantity: i.quantity })),
        shippingAddress: address,
        itemsPrice: cartTotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total
      };

      const { data } = await axios.post(`${API}/payment/create-order`, { amount: total, orderData });

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Rohit Power Tools',
        description: `Order #${data.orderId}`,
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            const verify = await axios.post(`${API}/payment/verify`, {
              ...response,
              orderId: data.orderId
            });
            if (verify.data.success) {
              clearCart();
              toast.success('🎉 Payment successful! Order confirmed.');
              navigate('/profile');
            }
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: address.name, contact: address.phone, email: user?.email },
        theme: { color: '#ff5500' },
        modal: { ondismiss: () => { setPaying(false); toast.error('Payment cancelled'); } }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initiation failed');
      setPaying(false);
    }
  };

  if (cart.length === 0 && step === 1) {
    return (
      <div style={{ background: 'var(--bg-black)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 42, letterSpacing: 2, marginBottom: 12 }}>YOUR CART IS EMPTY</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Add some professional tools to get started!</p>
          <button className="btn-orange" style={{ fontSize: 16 }} onClick={() => navigate('/products')}>
            <FiShoppingCart size={16} /> Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-black)', minHeight: '100vh', position: 'relative' }}>
      {/* Universe shader header */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden', marginTop: '-70px' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <ShaderGradientCanvas style={{ width: '100%', height: '100%' }}>
            <ShaderGradient
              animate="on"
              brightness={1.1}
              cAzimuthAngle={180}
              cDistance={3.9}
              cPolarAngle={115}
              cameraZoom={1}
              color1="#5606ff"
              color2="#fe8989"
              color3="#000000"
              destination="onCanvas"
              envPreset="city"
              grain="off"
              lightType="3d"
              type="waterPlane"
              uAmplitude={0}
              uDensity={1.1}
              uFrequency={5.5}
              uSpeed={0.1}
              uStrength={2.4}
              positionX={-0.5}
              positionY={0.1}
              rotationZ={235}
            />
          </ShaderGradientCanvas>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
        <div className="container h-100 d-flex flex-column justify-content-end pb-4" style={{ position: 'relative', zIndex: 1, paddingTop: '100px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: 2, marginBottom: 8 }}>
            <FiShoppingCart style={{ marginRight: 12 }} />
            CHECKOUT
          </h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-heading)' }}>{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ background: 'var(--bg-dark)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-2">
            {[['1', 'Cart'], ['2', 'Address'], ['3', 'Payment']].map(([s, label], i) => (
              <div key={s} className="d-flex align-items-center gap-2">
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step >= Number(s) ? 'var(--orange)' : 'var(--bg-card)',
                  border: `1px solid ${step >= Number(s) ? 'var(--orange)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 13, color: 'white',
                  cursor: step > Number(s) ? 'pointer' : 'default',
                  transition: 'all 0.3s'
                }} onClick={() => step > Number(s) && setStep(Number(s))}>
                  {s}
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14, color: step >= Number(s) ? 'var(--orange)' : 'var(--text-muted)' }}>{label}</span>
                {i < 2 && <div style={{ width: 40, height: 1, background: 'var(--border)', margin: '0 4px' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {/* Left: Cart / Address */}
          <div className="col-lg-8">

            {/* STEP 1: Cart */}
            {step === 1 && (
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 20 }}>Your Cart</h4>
                <div className="d-flex flex-column gap-3">
                  {cart.map(item => (
                    <div key={item._id} className="card-dark d-flex align-items-center gap-4" style={{ padding: 20 }}>
                      <img
                        src={item.images?.[0] || `https://placehold.co/80x80/1a1a1a/ff5500?text=T`}
                        alt={item.name}
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                      />
                      <div style={{ flex: 1 }}>
                        <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, margin: '0 0 4px', color: 'white' }}>{item.name}</h6>
                        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '0 0 8px' }}>{item.brand} · {item.category}</p>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--orange)' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          style={{ width: 30, height: 30, border: '1px solid var(--border)', background: 'transparent', color: 'white', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiMinus size={12} />
                        </button>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          style={{ width: 30, height: 30, border: '1px solid var(--border)', background: 'transparent', color: 'white', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FiPlus size={12} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)}
                        style={{ background: 'none', border: 'none', color: '#f44336', cursor: 'pointer', padding: 8 }}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="card-dark mt-4" style={{ padding: 20 }}>
                  <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FiTag color="var(--orange)" /> Apply Coupon
                  </h6>
                  <div className="d-flex gap-2">
                    <input
                      className="input-dark"
                      placeholder="Enter coupon code (try ROHIT10)"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value.toUpperCase())}
                      disabled={couponApplied}
                      style={{ flex: 1 }}
                    />
                    <button onClick={applyCoupon} disabled={couponApplied} className="btn-orange" style={{ whiteSpace: 'nowrap' }}>
                      {couponApplied ? '✓ Applied' : 'Apply'}
                    </button>
                  </div>
                </div>

                <button onClick={() => setStep(2)} className="btn-orange mt-4 w-100 justify-content-center" style={{ fontSize: 16, padding: 14 }}>
                  Proceed to Address →
                </button>
              </div>
            )}

            {/* STEP 2: Address */}
            {step === 2 && (
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 20 }}>
                  <FiMapPin color="var(--orange)" style={{ marginRight: 8 }} />
                  Delivery Address
                </h4>
                <div className="card-dark" style={{ padding: 28 }}>
                  <div className="row g-3">
                    {[
                      { label: 'Full Name', field: 'name', col: 'col-md-6' },
                      { label: 'Phone Number', field: 'phone', col: 'col-md-6' },
                      { label: 'Street Address', field: 'street', col: 'col-12' },
                      { label: 'City', field: 'city', col: 'col-md-4' },
                      { label: 'State', field: 'state', col: 'col-md-4' },
                      { label: 'Pincode', field: 'pincode', col: 'col-md-4' },
                    ].map(({ label, field, col }) => (
                      <div key={field} className={col}>
                        <label style={{ fontFamily: 'var(--font-heading)', fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 6 }}>{label} *</label>
                        <input
                          className="input-dark"
                          placeholder={label}
                          value={address[field]}
                          onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="d-flex gap-3 mt-4">
                    <button onClick={() => setStep(1)} className="btn-outline">← Back</button>
                    <button onClick={() => {
                      if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
                        return toast.error('Please fill all required fields');
                      }
                      setStep(3);
                    }} className="btn-orange flex-grow-1 justify-content-center">
                      Review Order →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Pay */}
            {step === 3 && (
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 20 }}>
                  <FiCreditCard color="var(--orange)" style={{ marginRight: 8 }} />
                  Review & Pay
                </h4>

                {/* Address summary */}
                <div className="card-dark mb-3" style={{ padding: 20 }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 6, color: 'var(--orange)' }}>Delivery To</h6>
                      <p style={{ color: 'var(--text-light)', fontSize: 14, margin: 0, lineHeight: 1.8 }}>
                        {address.name} · {address.phone}<br />
                        {address.street}, {address.city}, {address.state} – {address.pincode}
                      </p>
                    </div>
                    <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--orange)', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 13 }}>Change</button>
                  </div>
                </div>

                {/* Items summary */}
                <div className="card-dark mb-4" style={{ padding: 20 }}>
                  <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 14, color: 'var(--text-light)' }}>Order Items ({cartCount})</h6>
                  {cart.map(item => (
                    <div key={item._id} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 14, color: 'var(--text-light)' }}>{item.name} ×{item.quantity}</span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'white' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="d-flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline">← Back</button>
                  <button onClick={handleRazorpay} disabled={paying} className="btn-orange flex-grow-1 justify-content-center" style={{ fontSize: 16, padding: 14 }}>
                    <FiZap size={16} />
                    {paying ? 'Opening Payment...' : `Pay ₹${total.toLocaleString('en-IN')} via Razorpay`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="col-lg-4">
            <div className="card-dark" style={{ padding: 24, position: 'sticky', top: 90 }}>
              <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                Order Summary
              </h5>
              {[
                ['Subtotal', `₹${cartTotal.toLocaleString('en-IN')}`],
                ['Shipping', shipping === 0 ? <span style={{ color: '#4caf50' }}>FREE</span> : `₹${shipping}`],
                ['GST (18%)', `₹${tax.toLocaleString('en-IN')}`],
                ...(couponApplied ? [['Discount (ROHIT10)', <span style={{ color: '#4caf50' }}>-₹{discountAmt.toLocaleString('en-IN')}</span>]] : [])
              ].map(([label, value]) => (
                <div key={label} className="d-flex justify-content-between mb-3">
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 14 }}>{value}</span>
                </div>
              ))}
              <div className="d-flex justify-content-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--orange)' }}>
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {shipping === 0 ? (
                <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 8, padding: '10px 12px', marginTop: 16, fontSize: 13, color: '#4caf50', fontFamily: 'var(--font-heading)' }}>
                  ✓ You qualify for FREE shipping!
                </div>
              ) : (
                <div style={{ background: 'rgba(255,165,0,0.08)', border: '1px solid rgba(255,165,0,0.2)', borderRadius: 8, padding: '10px 12px', marginTop: 16, fontSize: 13, color: '#ffa500', fontFamily: 'var(--font-heading)' }}>
                  Add ₹{(2000 - cartTotal).toLocaleString('en-IN')} more for free shipping
                </div>
              )}

              <div style={{ marginTop: 20, padding: '14px', background: 'rgba(255,85,0,0.06)', border: '1px solid var(--border-orange)', borderRadius: 8 }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                  🔒 Secured by Razorpay · 256-bit SSL<br />
                  💳 UPI, Cards, Net Banking accepted<br />
                  🔄 30-day hassle-free returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
