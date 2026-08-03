const pool = require('../config/database');

exports.getCategories = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM categories ORDER BY id DESC');
        res.json({ categories });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ message: 'Tên danh mục không được để trống' });
        await pool.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || '']);
        res.status(201).json({ message: 'Tạo danh mục thành công' });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        await pool.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description || '', req.params.id]);
        res.json({ message: 'Cập nhật danh mục thành công' });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};

exports.deleteCategory = async (req, res) => {
    try {
        await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ message: 'Xóa danh mục thành công' });
    } catch (err) { console.error(err); res.status(500).json({ message: 'Lỗi server' }); }
};
