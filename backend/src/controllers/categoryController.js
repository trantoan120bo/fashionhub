const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ id: -1 });
    res.json({ categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Tên danh mục không được để trống' });
    
    const maxCategory = await Category.findOne().sort('-id');
    const newId = maxCategory && maxCategory.id ? maxCategory.id + 1 : 1;

    await Category.create({
      id: newId,
      name,
      description: description || ''
    });

    res.status(201).json({ message: 'Tạo danh mục thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    await Category.findOneAndUpdate(
      { id: Number(req.params.id) },
      { name, description: description || '' }
    );
    res.json({ message: 'Cập nhật danh mục thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.deleteOne({ id: Number(req.params.id) });
    res.json({ message: 'Xóa danh mục thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
