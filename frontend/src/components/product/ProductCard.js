import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;
  const isOutOfStock = product.stock <= 0;


  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`}>
        <div className={styles.imgWrap}>
          <img
            src={(product.images && product.images.length > 0 && product.images[0].image_url) || product.image_url || 'https://via.placeholder.com/400x500?text=FashionHub'}
            alt={product.name}
            className={styles.img}
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
          onClick={() => addToCart(product, 1)}
          style={{ opacity: isOutOfStock ? 0.5 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer', flex: 1, padding: '10px 0', border: '1px solid #ccc', background: '#fff' }}
        >
          Giỏ hàng
        </button>
        <button
          className={styles.buyBtn}
          disabled={isOutOfStock}
          onClick={() => {
            addToCart(product, 1);
            window.location.href = '/checkout';
          }}
          style={{ opacity: isOutOfStock ? 0.5 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer', flex: 1, padding: '10px 0', border: 'none', background: isOutOfStock ? '#ccc' : '#000', color: '#fff' }}
        >
          {isOutOfStock ? 'Hết hàng' : 'Mua ngay'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
