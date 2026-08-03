const pool = require('../config/database');

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category_id, sort = 'newest' } = req.query;
    const offset = (page - 1) * limit;

    let orderBy = 'p.id DESC';
    if (sort === 'price_asc') orderBy = 'p.price ASC';
    if (sort === 'price_desc') orderBy = 'p.price DESC';

    let where = 'WHERE 1=1';
    const params = [];
    if (category_id) { where += ' AND p.category_id = ?'; params.push(category_id); }
    if (req.query.search) {
      where += " AND p.name LIKE ?";
      params.push(`%${req.query.search}%`);
    }

    const [products] = await pool.query(`
      SELECT p.*, c.name AS category_name, img.image_url AS main_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      OUTER APPLY (
        SELECT TOP 1 image_url FROM product_images
        WHERE product_id = p.id ORDER BY is_primary DESC
      ) img
      ${where} ORDER BY ${orderBy} OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
    `, [...params, Number(offset), Number(limit)]);

    const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM products p ${where}`, params);
    const total = countRows[0]?.total || 0;

    res.json({ products: products.map(p => ({ ...p, images: p.main_image ? [{ image_url: p.main_image }] : [] })), total, page: Number(page) });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    const product = rows[0];
    const [images] = await pool.query('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC', [product.id]);
    res.json({ product: { ...product, images } });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, price, original_price, description, stock, image_url } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Thiếu tên hoặc giá sản phẩm' });
    const [rows, extra] = await pool.query(
      'INSERT INTO products (name, category_id, price, original_price, description, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category_id || null, price, original_price || null, description || '', stock || 0]
    );
    const productId = extra.insertId;

    if (image_url && productId) {
      await pool.query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)', [productId, image_url]);
    }
    res.status(201).json({ message: 'Tạo sản phẩm thành công', product_id: productId });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, category_id, price, original_price, description, stock, image_url } = req.body;
    const { id } = req.params;
    await pool.query(
      'UPDATE products SET name=?, category_id=?, price=?, original_price=?, description=?, stock=? WHERE id=?',
      [name, category_id || null, price, original_price || null, description || '', stock || 0, id]
    );
    if (image_url) {
      const [imgs] = await pool.query('SELECT id FROM product_images WHERE product_id=? AND is_primary=1', [id]);
      if (imgs.length) await pool.query('UPDATE product_images SET image_url=? WHERE id=?', [image_url, imgs[0].id]);
      else await pool.query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?,?,1)', [id, image_url]);
    }
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    await pool.query('DELETE FROM product_images WHERE product_id=?', [req.params.id]);
    await pool.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Xóa thành công' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};
