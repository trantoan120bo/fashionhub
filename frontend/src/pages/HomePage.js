import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ limit: 8, sort: 'newest' }),
      getCategories(),
    ]).then(([prodRes, catRes]) => {
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || []);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader">Đang tải trải nghiệm cao cấp...</div>
    </div>
  );

  return (
    <div className="fade-in">
      {/* Dynamic Hero Banner */}
      <div style={{
        position: 'relative',
        height: '85vh',
        width: '100%',
        overflow: 'hidden',
        background: '#000'
      }}>
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
          alt="Fashion Hero"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
        />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%'
        }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, letterSpacing: 5, marginBottom: 20, textTransform: 'uppercase' }}>New Collection 2026</span>
          <h1 style={{ color: '#fff', fontSize: 'clamp(48px, 8vw, 90px)', fontWeight: 800, lineHeight: 1, marginBottom: 30, letterSpacing: -2 }}>
            DEFINITION OF <br /> ELEGANCE
          </h1>
          <Link to="/products" style={{
            width: 'fit-content',
            background: '#fff',
            color: '#000',
            padding: '18px 48px',
            fontWeight: 700,
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: 2
          }}>
            Shop Now
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '100px 40px' }}>
        {/* Categories Section */}
        <div style={{ marginBottom: 120 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>OUR CATEGORIES</h2>
              <p style={{ color: '#666' }}>Discover our curated selection for every occasion</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
            {categories.slice(0, 4).map((cat, i) => (
              <Link key={cat.id} to={`/products?category_id=${cat.id}`} style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
                <img
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=600&q=80`}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, width: '100%', padding: 30,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', color: '#fff'
                }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700 }}>{cat.name}</h3>
                  <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Explore Collection</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>NEW ARRIVALS</h2>
            <div style={{ width: 60, height: 4, background: '#000', margin: '0 auto' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 40 }}>
            {products.length > 0 ? (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 100, border: '1px dashed #ccc' }}>
                <p>Chưa có sản phẩm nào. Hãy chạy Backend và nạp database để thấy sự thay đổi!</p>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: 80 }}>
            <Link to="/products" style={{
              border: '2px solid #000', padding: '16px 40px', fontWeight: 700, textTransform: 'uppercase', fontSize: 13
            }}>
              View All Products
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Footer Section */}
      <footer style={{ background: '#f9f9f9', padding: '100px 80px 40px', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60, marginBottom: 80 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>FASHIONHUB</h2>
            <p style={{ color: '#666', maxWidth: 300 }}>Cửa hàng thời trang uy tín nhất Việt Nam, dẫn đầu xu hướng 2026.</p>
          </div>
          {/* ... Other footer columns ... */}
        </div>
        <div style={{ borderTop: '1px solid #eee', paddingTop: 40, textAlign: 'center', color: '#999', fontSize: 13 }}>
          © 2026 FashionHub. Crafted with Passion.
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
