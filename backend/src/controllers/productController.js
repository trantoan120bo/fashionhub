const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, category_id, sort = 'newest', search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const query = {};

    if (category_id && category_id !== '' && !isNaN(Number(category_id))) {
      query.category_id = Number(category_id);
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let sortOptions = { id: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    if (sort === 'price_desc') sortOptions = { price: -1 };

    const total = await Product.countDocuments(query);
    const rawProducts = await Product.find(query)
      .sort(sortOptions)
      .skip(offset)
      .limit(Number(limit))
      .lean();

    const categoryIds = [...new Set(rawProducts.map(p => p.category_id).filter(Boolean))];
    const categories = await Category.find({ id: { $in: categoryIds } }).lean();
    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.id] = c.name; });

    const products = rawProducts.map(p => {
      const primaryImg = p.images && p.images.length > 0 ? (p.images.find(img => img.is_primary) || p.images[0]).image_url : null;
      return {
        ...p,
        category_name: categoryMap[p.category_id] || '',
        main_image: primaryImg,
        images: primaryImg ? [{ image_url: primaryImg }] : (p.images || [])
      };
    });

    res.json({ products, total, page: Number(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) }).lean();
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    let category_name = '';
    if (product.category_id) {
      const cat = await Category.findOne({ id: product.category_id });
      if (cat) category_name = cat.name;
    }

    res.json({
      product: {
        ...product,
        category_name,
        images: product.images || []
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category_id, price, original_price, description, stock, image_url } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Thiếu tên hoặc giá sản phẩm' });

    const maxProduct = await Product.findOne().sort('-id');
    const productId = maxProduct && maxProduct.id ? maxProduct.id + 1 : 1;

    const images = image_url ? [{ id: 1, image_url, is_primary: true }] : [];

    await Product.create({
      id: productId,
      name,
      category_id: category_id ? Number(category_id) : null,
      price: Number(price),
      original_price: original_price ? Number(original_price) : null,
      description: description || '',
      stock: stock ? Number(stock) : 0,
      images
    });

    res.status(201).json({ message: 'Tạo sản phẩm thành công', product_id: productId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, category_id, price, original_price, description, stock, image_url } = req.body;
    const productId = Number(req.params.id);

    const product = await Product.findOne({ id: productId });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    product.name = name;
    product.category_id = category_id ? Number(category_id) : null;
    product.price = Number(price);
    product.original_price = original_price ? Number(original_price) : null;
    product.description = description || '';
    product.stock = stock ? Number(stock) : 0;
    product.updated_at = new Date();

    if (image_url) {
      if (product.images && product.images.length > 0) {
        product.images[0].image_url = image_url;
        product.images[0].is_primary = true;
      } else {
        product.images = [{ id: 1, image_url, is_primary: true }];
      }
    }

    await product.save();
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ id: Number(req.params.id) });
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
