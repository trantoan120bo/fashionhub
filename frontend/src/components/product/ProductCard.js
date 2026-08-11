import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;
  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (!user) return navigate('/login');
    addToCart(product, 1);
  };

  const handleBuy = () => {
    if (!user) return navigate('/login');
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`}>
        <div className={styles.imgWrap}>
          <img
            src={
              (product.images && product.images.length > 0 && product.images[0].image_url)
                ? product.images[0].image_url
                : (product.image_url || 'https://placehold.co/400x500/f5f5f5/333?text=FashionHub')
            }
            alt={product.name}
            className={styles.img}
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/400x500/f5f5f5/333?text=No+Image';
            }}
          />
          {discount && !isOutOfStock && <span className={styles.badge}>-{discount}%</span>}
          {isOutOfStock && <span className={styles.badge} style={{ background: '#c0392b' }}>Hết hàng</span>}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{product.name}</div>
          <div className={styles.priceRow}>
            <span className={styles.price}>
              {product.price.toLocaleString('vi-VN')}đ
            </span>
            {product.original_price && (
              <span className={styles.originalPrice}>
                {product.original_price.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className={styles.btnRow}>
        <button
          className={styles.addBtn}
          disabled={isOutOfStock}
          onClick={handleAdd}
          style={{ opacity: isOutOfStock ? 0.5 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer', flex: 1, padding: '10px 0', border: '1px solid #ccc', background: '#fff' }}
        >
          Giỏ hàng
        </button>
        <button
          className={styles.buyBtn}
          disabled={isOutOfStock}
          onClick={handleBuy}
          style={{ opacity: isOutOfStock ? 0.5 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer', flex: 1, padding: '10px 0', border: 'none', background: isOutOfStock ? '#ccc' : '#000', color: '#fff' }}
        >
          {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
