import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Đen', 'Trắng', 'Xanh navy', 'Be'];

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getProductById(id).then((res) => {
      setProduct(res.data.product);
    }).catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!user) {
      return navigate('/login', { state: { from: location } });
    }
    if (!selectedSize) return setMsg('Vui lòng chọn size');
    if (!selectedColor) return setMsg('Vui lòng chọn màu');
    if (product.stock <= 0) return setMsg('Sản phẩm đã hết hàng');
    addToCart(product, qty, selectedSize, selectedColor);
    setMsg('✓ Đã thêm vào giỏ hàng');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleBuyNow = () => {
    if (!user) {
      return navigate('/login', { state: { from: location } });
    }
    if (!selectedSize) return setMsg('Vui lòng chọn size');
    if (!selectedColor) return setMsg('Vui lòng chọn màu');
    if (product.stock <= 0) return setMsg('Sản phẩm đã hết hàng');
    addToCart(product, qty, selectedSize, selectedColor);
    navigate('/checkout');
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Đang tải...</div>;
  if (!product) return null;

  const images = product.images?.length ? product.images : [{ image_url: 'https://via.placeholder.com/480x560?text=No+Image' }];
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={{ padding: '40px', display: 'flex', gap: 48 }}>
      {/* Ảnh */}
      <div style={{ width: 480, flexShrink: 0 }}>
        <img src={images[activeImg]?.image_url} alt={product.name}
          style={{ width: '100%', height: 560, objectFit: 'cover', background: '#f5f5f5' }}
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/480x560/f5f5f5/333?text=No+Image'; }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {images.map((img, i) => (
            <img key={i} src={img.image_url} alt="" onClick={() => setActiveImg(i)}
              style={{ width: 70, height: 80, objectFit: 'cover', cursor: 'pointer', border: i === activeImg ? '2px solid #000' : '1px solid #ddd' }}
              onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://placehold.co/70x80/f5f5f5/333?text=X'; }}
            />
          ))}
        </div>
      </div>

      {/* Thông tin */}
      <div style={{ flex: 1 }}>
        <p style={{ color: '#888', fontSize: 13 }}>{product.category_name}</p>
        <h1 style={{ fontSize: 26, fontWeight: 'bold', margin: '6px 0 16px' }}>{product.name}</h1>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 24, fontWeight: 'bold', color: '#c0392b' }}>
            {Number(product.price).toLocaleString('vi-VN')}₫
          </span>
          {product.original_price && (
            <span style={{ fontSize: 15, color: '#aaa', textDecoration: 'line-through' }}>
              {Number(product.original_price).toLocaleString('vi-VN')}₫
            </span>
          )}
          {discount > 0 && (
            <span style={{ background: '#c0392b', color: '#fff', fontSize: 11, padding: '2px 7px' }}>-{discount}%</span>
          )}
        </div>

        {isOutOfStock && (
          <div style={{ padding: '8px 12px', background: '#ffebee', color: '#c0392b', fontWeight: 'bold', display: 'inline-block', marginBottom: 16, borderRadius: 4 }}>
            Sản phẩm này hiện đang hết hàng.
          </div>
        )}

        <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>


        {/* Size */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>Kích thước: {selectedSize}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {SIZES.map((s) => (
              <button key={s} onClick={() => setSelectedSize(s)}
                style={{ width: 44, height: 44, border: selectedSize === s ? '2px solid #000' : '1px solid #ccc', background: '#fff', fontWeight: selectedSize === s ? 'bold' : 'normal', cursor: 'pointer', fontSize: 13 }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Màu */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 8 }}>Màu sắc: {selectedColor}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {COLORS.map((c) => (
              <button key={c} onClick={() => setSelectedColor(c)}
                style={{ padding: '6px 14px', border: selectedColor === c ? '2px solid #000' : '1px solid #ccc', background: '#fff', fontSize: 12, cursor: 'pointer' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Số lượng */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button disabled={isOutOfStock} onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 36, height: 36, border: '1px solid #ccc', background: '#fff', fontSize: 18, cursor: isOutOfStock ? 'not-allowed' : 'pointer', opacity: isOutOfStock ? 0.5 : 1 }}>−</button>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            disabled={isOutOfStock}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (isNaN(val) || val < 1) {
                setQty(1);
              } else if (val > product.stock) {
                setQty(product.stock);
              } else {
                setQty(val);
              }
            }}
            onBlur={() => {
              if (qty < 1) setQty(1);
              if (qty > product.stock) setQty(product.stock);
            }}
            style={{
              width: 60, textAlign: 'center', fontWeight: 'bold', fontSize: 15,
              padding: '6px 4px', border: '1px solid #ccc', borderRadius: 4,
              MozAppearance: 'textfield', boxSizing: 'border-box'
            }}
          />
          <button disabled={isOutOfStock || qty >= product.stock} onClick={() => setQty(qty + 1)} style={{ width: 36, height: 36, border: '1px solid #ccc', background: '#fff', fontSize: 18, cursor: (isOutOfStock || qty >= product.stock) ? 'not-allowed' : 'pointer', opacity: (isOutOfStock || qty >= product.stock) ? 0.5 : 1 }}>+</button>
          {!isOutOfStock && <span style={{ fontSize: 12, color: '#666' }}>({product.stock} sản phẩm có sẵn)</span>}
        </div>


        {msg && <p style={{ color: msg.startsWith('✓') ? '#27ae60' : '#c0392b', marginBottom: 12, fontSize: 13 }}>{msg}</p>}

        <div style={{ display: 'flex', gap: 12, maxWidth: 360 }}>
          <button disabled={isOutOfStock} onClick={handleAddToCart}
            style={{ flex: 1, padding: '14px', background: isOutOfStock ? '#f5f5f5' : '#fff', color: isOutOfStock ? '#999' : '#000', border: isOutOfStock ? '1px solid #ccc' : '1px solid #000', fontWeight: 'bold', fontSize: 13, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}>
            {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
          <button disabled={isOutOfStock} onClick={handleBuyNow}
            style={{ flex: 1, padding: '14px', background: isOutOfStock ? '#ccc' : '#000', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 13, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}>
            {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
