import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { FiShoppingCart, FiStar, FiZap } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="card-dark"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow: 'hidden', cursor: 'pointer' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#1a1a1a' }}>
        <img
          src={product.images?.[0] || `https://placehold.co/400x400/1a1a1a/ff5500?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="product-img"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s ease' }}
        />
        {discount > 0 && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: 'var(--orange)',
            color: 'white',
            padding: '3px 10px',
            borderRadius: 4,
            fontSize: 12,
            fontFamily: 'var(--font-heading)',
            fontWeight: 700
          }}>-{discount}%</span>
        )}
        {product.isFeatured && (
          <span style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,165,0,0.9)',
            color: '#000',
            padding: '3px 10px',
            borderRadius: 4,
            fontSize: 11,
            fontFamily: 'var(--font-heading)',
            fontWeight: 700
          }}>⭐ FEATURED</span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <span style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-heading)', letterSpacing: 0.5 }}>
            {product.brand}
          </span>
          <span style={{ color: 'var(--border)', fontSize: 12 }}>·</span>
          <span style={{ color: 'var(--orange)', fontSize: 12, fontFamily: 'var(--font-heading)' }}>
            {product.category}
          </span>
        </div>

        <h6 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3, color: 'white' }}>
          {product.name}
        </h6>

        {/* Rating */}
        <div className="d-flex align-items-center gap-1 mb-12">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              size={13}
              fill={i < Math.round(product.rating || 0) ? '#ffa500' : 'none'}
              color={i < Math.round(product.rating || 0) ? '#ffa500' : 'var(--border)'}
            />
          ))}
          <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 4 }}>
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Price */}
        <div className="d-flex align-items-center gap-2 mb-3 mt-2">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--orange)', letterSpacing: 0.5 }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span style={{ color: 'var(--text-muted)', fontSize: 13, textDecoration: 'line-through' }}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="d-flex align-items-center justify-content-between">
          <span style={{
            fontSize: 12,
            color: product.stock > 0 ? '#4caf50' : '#f44336',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600
          }}>
            {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="btn-orange w-100 mt-3 justify-content-center"
          style={{ fontSize: 14 }}
        >
          <FiShoppingCart size={14} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
