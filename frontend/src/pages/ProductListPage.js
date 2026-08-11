import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';

const LIMIT = 12;

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1');
  const category_id = searchParams.get('category_id') || '';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(() => {
    setLoading(true);
    getProducts({ page, limit: LIMIT, category_id, sort, search })
      .then((res) => {
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page, category_id, sort, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.categories || []));
  }, []);

  const totalPages = Math.ceil(total / LIMIT);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, String(value)); else p.delete(key);
    if (key !== 'page') p.set('page', '1'); // reset page khi đổi filter, không reset khi đổi page
    setSearchParams(p);
  };

  return (
    <div style={{ display: 'flex', padding: '32px 40px', gap: 28 }}>
      {/* Sidebar bộ lọc */}
      <div style={{ width: 220, flexShrink: 0 }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #ddd' }}>Bộ lọc</h3>

        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 14 }}>Danh mục</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, cursor: 'pointer' }}>
              <input type="radio" name="cat" checked={!category_id}
                onChange={() => updateParam('category_id', '')} /> Tất cả
            </label>
            {categories.map((c) => (
              <label key={c.id} style={{ fontSize: 13, cursor: 'pointer' }}>
                <input type="radio" name="cat" checked={category_id === String(c.id)}
                  onChange={() => updateParam('category_id', c.id)} /> {c.name}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontWeight: 'bold', marginBottom: 10, fontSize: 14 }}>Sắp xếp</h4>
          {[['newest', 'Mới nhất'], ['price_asc', 'Giá tăng dần'], ['price_desc', 'Giá giảm dần']].map(([v, l]) => (
            <label key={v} style={{ display: 'block', fontSize: 13, marginBottom: 6, cursor: 'pointer' }}>
              <input type="radio" name="sort" checked={sort === v}
                onChange={() => updateParam('sort', v)} /> {l}
            </label>
          ))}
        </div>
      </div>

      {/* Grid sản phẩm */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: 13, color: '#555' }}>
          <span>Hiển thị {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} / {total} sản phẩm</span>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>Đang tải...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        {/* Phân trang */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 32 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => updateParam('page', p)}
              style={{ padding: '6px 14px', border: '1px solid #ddd', background: page === p ? '#000' : '#fff', color: page === p ? '#fff' : '#333', fontSize: 13 }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductListPage;
