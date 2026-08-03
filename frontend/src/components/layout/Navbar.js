import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Navbar.module.css';

function Navbar() {
  const { totalItems } = useCart();
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>FashionHub</Link>

      <div className={styles.links}>
        <Link to="/products?category=nam">Nam</Link>
        <Link to="/products?category=nu">Nữ</Link>
        <Link to="/products?category=tre-em">Trẻ em</Link>
        <Link to="/products?sort=discount">Sale</Link>
      </div>

      <div className={styles.searchBar}>
        <form onSubmit={(e) => {
          e.preventDefault();
          const term = e.target.search.value;
          if (term.trim()) navigate(`/products?search=${term}`);
        }}>
          <input
            type="text"
            name="search"
            placeholder="Tìm kiếm sản phẩm..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchBtn}>🔍</button>
        </form>
      </div>

      <div className={styles.actions}>
        {user ? (
          <>
            <span>Xin chào, {user.name}</span>
            {user.role === 'admin' && (
              <div className={styles.adminLinks}>
                <Link to="/admin/products">Sản phẩm</Link>
                <Link to="/admin/categories">Danh mục</Link>
                <Link to="/admin/orders">Đơn hàng</Link>
                <Link to="/admin/users-manage">👥 Người dùng</Link>
                <Link to="/admin/users">🚫 Bom hàng</Link>
              </div>
            )}
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Đăng xuất
            </button>
          </>
        ) : (
          <Link to="/login">Đăng nhập</Link>
        )}
        <Link to="/cart" className={styles.cartLink}>
          🛒
          {totalItems > 0 && (
            <span className={styles.badge}>{totalItems}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
