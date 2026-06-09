import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ShaderGradient, ShaderGradientCanvas } from '@shadergradient/react';
import ProductCard from '../components/ProductCard.jsx';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const API = import.meta.env.VITE_API_URL || '/api';
const CATEGORIES = ['Drills','Grinders','Saws','Wrenches','Sanders','Accessories'];
const BRANDS = ['Bosch','DeWalt','Makita','Stanley','Hitachi','Milwaukee'];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    sort: 'newest',
    minPrice: '',
    maxPrice: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const { data } = await axios.get(`${API}/products`, { params });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [filters, page]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value === prev[key] ? '' : value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', brand: '', sort: 'newest', minPrice: '', maxPrice: '' });
    setPage(1);
  };

  return (
    <div style={{ background: 'var(--bg-black)', minHeight: '100vh' }}>
      {/* Header with Universe gradient - stretched to top */}
      <div style={{ position: 'relative', height: 260, overflow: 'hidden', marginTop: '-70px' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <ShaderGradientCanvas style={{ width: '100%', height: '100%' }}>
            <ShaderGradient
              animate="on" brightness={1.1} cAzimuthAngle={180} cDistance={3.9}
              cPolarAngle={115} cameraZoom={1} color1="#5606ff" color2="#fe8989"
              color3="#000000" destination="onCanvas" envPreset="city" grain="off"
              lightType="3d" type="waterPlane" uAmplitude={0} uDensity={1.1}
              uFrequency={5.5} uSpeed={0.1} uStrength={2.4}
              positionX={-0.5} positionY={0.1} rotationZ={235}
            />
          </ShaderGradientCanvas>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
        <div className="container h-100 d-flex flex-column justify-content-end pb-4" style={{ position: 'relative', zIndex: 1, paddingTop: '100px' }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: 'clamp(36px, 6vw, 68px)', letterSpacing: -1, marginBottom: 8 }}>
            ALL <span style={{ color: 'var(--orange)' }}>PRODUCTS</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Poppins', sans-serif", fontSize: 14, margin: 0 }}>
            {total} products found{filters.category && ` in ${filters.category}`}{filters.brand && ` · ${filters.brand}`}
          </p>
        </div>
      </div>

      <div className="container py-5">
        {/* Search + sort bar */}
        <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              className="input-dark"
              style={{ paddingLeft: 42 }}
              placeholder="Search tools..."
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
            />
          </div>

          <select
            className="input-dark"
            style={{ width: 'auto', minWidth: 160 }}
            value={filters.sort}
            onChange={e => updateFilter('sort', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          <button className="btn-outline d-flex align-items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
            <FiFilter /> Filters
          </button>

          {(filters.category || filters.brand || filters.minPrice || filters.maxPrice) && (
            <button className="btn-orange" onClick={clearFilters}>
              <FiX size={14} /> Clear
            </button>
          )}
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            marginBottom: 24
          }}>
            <div className="row g-4">
              <div className="col-md-4">
                <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-light)', marginBottom: 12, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Category</h6>
                <div className="d-flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => updateFilter('category', cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        border: `1px solid ${filters.category === cat ? 'var(--orange)' : 'var(--border)'}`,
                        background: filters.category === cat ? 'rgba(255,85,0,0.15)' : 'transparent',
                        color: filters.category === cat ? 'var(--orange)' : 'var(--text-muted)',
                        fontSize: 13,
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >{cat}</button>
                  ))}
                </div>
              </div>

              <div className="col-md-4">
                <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-light)', marginBottom: 12, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Brand</h6>
                <div className="d-flex flex-wrap gap-2">
                  {BRANDS.map(b => (
                    <button key={b} onClick={() => updateFilter('brand', b)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 6,
                        border: `1px solid ${filters.brand === b ? 'var(--orange)' : 'var(--border)'}`,
                        background: filters.brand === b ? 'rgba(255,85,0,0.15)' : 'transparent',
                        color: filters.brand === b ? 'var(--orange)' : 'var(--text-muted)',
                        fontSize: 13,
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >{b}</button>
                  ))}
                </div>
              </div>

              <div className="col-md-4">
                <h6 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-light)', marginBottom: 12, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Price Range (₹)</h6>
                <div className="d-flex gap-2">
                  <input
                    className="input-dark"
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                  />
                  <input
                    className="input-dark"
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="text-center py-5"><div className="loader mx-auto" /></div>
        ) : products.length > 0 ? (
          <>
            <div className="row g-4">
              {products.map(p => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-5">
                {[...Array(pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    style={{
                      width: 40, height: 40, borderRadius: 8,
                      border: `1px solid ${page === i + 1 ? 'var(--orange)' : 'var(--border)'}`,
                      background: page === i + 1 ? 'var(--orange)' : 'transparent',
                      color: 'white',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >{i + 1}</button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5">
            <div style={{ fontSize: 60, marginBottom: 16 }}>🔧</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-light)' }}>No products found</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters</p>
            <button className="btn-orange mt-3" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
