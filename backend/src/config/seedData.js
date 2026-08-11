const Category = require('../models/Category');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const initialCategories = [
  { id: 1, name: 'Áo Nam', description: 'Áo thun, sơ mi, polo dành cho nam' },
  { id: 2, name: 'Quần Nam', description: 'Quần jeans, kaki, shorts dành cho nam' },
  { id: 3, name: 'Áo Nữ', description: 'Áo thun, sơ mi, crop top dành cho nữ' },
  { id: 4, name: 'Quần Nữ', description: 'Quần jeans, legging, shorts dành cho nữ' },
  { id: 5, name: 'Phụ Kiện', description: 'Nón, túi, thắt lưng, tất' }
];

const initialUsers = [
  {
    id: 1,
    name: 'FashionHub Admin',
    email: 'admin@fashionhub.com',
    password: '$2a$10$yKI8noh4icaqsCTRAWGsHOrjOeURSRY.XeIvPcyAAS25gLOkedy.2',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Nguyễn Văn An',
    email: 'an@example.com',
    password: '$2a$10$yKI8noh4icaqsCTRAWGsHOrjOeURSRY.XeIvPcyAAS25gLOkedy.2',
    role: 'customer',
    phone: '0912345678'
  }
];

const initialProducts = [
  { id: 1, name: 'Áo Thun Nam Basic Trắng', category_id: 1, price: 199000, original_price: 279000, description: 'Áo thun cotton 100%, form regular fit, thoáng mát', stock: 150, images: [{ id: 1, image_url: 'https://th.bing.com/th/id/OIP.jHf5LUMYeBxoq8MPhS8AggHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', is_primary: true }] },
  { id: 2, name: 'Sơ Mi Nam Kẻ Caro Slim', category_id: 1, price: 349000, original_price: 450000, description: 'Sơ mi cotton pha polyester, form slim fit, dễ mặc', stock: 80, images: [{ id: 2, image_url: 'https://file.hstatic.net/200000053174/file/phoi-do-cung-ao-so-mi-caro-nam_cho-nhung-outfit-thoi-thuong_cb30125f40b64c8b9bb2a8c0e01e3d95.jpeg', is_primary: true }] },
  { id: 3, name: 'Polo Nam Cổ Bẻ Xanh Navy', category_id: 1, price: 289000, original_price: 380000, description: 'Áo polo piqué cao cấp, thoáng khí, bền màu', stock: 60, images: [{ id: 3, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mg7tedk9zf2g67', is_primary: true }] },
  { id: 4, name: 'Áo Hoodie Oversize Đen', category_id: 1, price: 459000, original_price: 590000, description: 'Hoodie cotton nỉ dày, form oversize, giữ ấm tốt', stock: 45, images: [{ id: 4, image_url: 'https://down-vn.img.susercontent.com/file/eb4e177e59718536227b6c75a316c253', is_primary: true }] },
  { id: 5, name: 'Quần Jeans Nam Slim Xanh', category_id: 2, price: 399000, original_price: 520000, description: 'Quần jeans co giãn 4 chiều, bền chắc', stock: 70, images: [{ id: 5, image_url: 'https://jeanthuanhai.com/wp-content/uploads/2023/07/z4450182316466-d5ba23a0926f883115ddd2acdf3909d6.jpg', is_primary: true }] },
  { id: 6, name: 'Quần Kaki Ống Suôn Be', category_id: 2, price: 329000, original_price: 420000, description: 'Quần kaki cotton, form ống suôn, lịch sự', stock: 90, images: [{ id: 6, image_url: 'https://tse3.mm.bing.net/th/id/OIP.Ev2TYhhsP4mQczF90AFcdgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', is_primary: true }] },
  { id: 7, name: 'Áo Thun Nữ Crop Top Hồng', category_id: 3, price: 179000, original_price: 250000, description: 'Áo crop top cotton mềm mại, thiết kế trẻ trung', stock: 120, images: [{ id: 7, image_url: 'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdd-m6dpzgob8eyyd7', is_primary: true }] },
  { id: 8, name: 'Áo Sơ Mi Nữ Oversize Trắng', category_id: 3, price: 279000, original_price: 360000, description: 'Sơ mi oversize phong cách Hàn Quốc, dễ mix đồ', stock: 95, images: [{ id: 8, image_url: 'https://ae01.alicdn.com/kf/S0955455d53ba4addb6f032695d7861f7R.jpg', is_primary: true }] },
  { id: 9, name: 'Quần Jeans Nữ Ống Rộng Đen', category_id: 4, price: 379000, original_price: 490000, description: 'Quần jeans ống rộng cạp cao, tôn dáng', stock: 75, images: [{ id: 9, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lma2fdfqye3j0e', is_primary: true }] },
  { id: 10, name: 'Quần Legging Thể Thao Đen', category_id: 4, price: 219000, original_price: 290000, description: 'Legging co giãn cao, phù hợp tập gym, yoga', stock: 110, images: [{ id: 10, image_url: 'https://n7media.coolmate.me/uploads/September2025/quan-legging-the-thao-co-gian-seamless-7-den_9.jpg?aio=w-700', is_primary: true }] },
  { id: 11, name: 'Nón Bucket Tai Bèo Kem', category_id: 5, price: 149000, original_price: 200000, description: 'Nón bucket cotton, chống nắng, thời trang', stock: 60, images: [{ id: 11, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m12mj5l6ko7z1e', is_primary: true }] },
  { id: 12, name: 'Túi Tote Canvas Đen', category_id: 5, price: 199000, original_price: 260000, description: 'Túi tote canvas dày, in logo, nhiều ngăn nhỏ', stock: 50, images: [{ id: 12, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-may9ourmpbyw19', is_primary: true }] },
  { id: 13, name: 'Áo Khoác Jean Nam Denim', category_id: 1, price: 590000, original_price: 750000, description: 'Áo khoác denim chất lừ, form đứng, phong cách bụi bặm', stock: 30, images: [{ id: 13, image_url: 'https://aokhoacnam.vn/upload/product/akn-123/ao-khoac-jean-denim-nam-tinh-4.jpg', is_primary: true }] },
  { id: 14, name: 'Áo thun nữ cổ bẻ phối dây kéo SAMSAM BRAND', category_id: 3, price: 250000, original_price: 350000, description: 'Áo thun nữ cổ bẻ thiết kế khóa kéo độc đáo, phong cách Hàn Quốc', stock: 40, images: [{ id: 14, image_url: 'https://tse4.mm.bing.net/th/id/OIP.z_GiBl-BZuHvR9tlyM1HwAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3', is_primary: true }] },
  { id: 15, name: 'Áo Babydoll Nữ Vải Thô Linen Kiểu Tay Phồng Phối Nơ Ngực', category_id: 3, price: 220000, original_price: 320000, description: 'Áo babydoll linen phong cách tiểu thư, tay bồng, thắt nơ ngực duyên dáng', stock: 25, images: [{ id: 15, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134208-820l4-mfhxe0yiae4vb3', is_primary: true }] },
  { id: 16, name: 'Áo Cardigan Nữ Lưới Tay Dài Phối Hoa Nổi', category_id: 3, price: 185000, original_price: 265000, description: 'Áo cardigan lưới tay dài họa tiết hoa nổi 3D, vải co dãn mỏng nhẹ thời trang', stock: 35, images: [{ id: 16, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvdebhqpaz655e', is_primary: true }] },
  { id: 17, name: 'Quần Short Nam Cotton Da Cá', category_id: 2, price: 155000, original_price: 225000, description: 'Quần short nam chất cotton da cá mềm mịn, thoáng mát, thấm hút mồ hôi tốt', stock: 60, images: [{ id: 17, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m70t0vtafsf5da.webp', is_primary: true }] },
  { id: 18, name: 'Quần jean nam ống suông rộng TR01', category_id: 2, price: 159000, original_price: 250000, description: 'Quần jean nam ống suông rộng mã TR01 phong cách Baggy Hàn Quốc, chất denim cao cấp, form suông rộng thoải mái, phong cách trẻ trung.', stock: 50, images: [{ id: 18, image_url: 'https://down-vn.img.susercontent.com/file/sg-11134201-22120-n0jg9danzjkvb1.webp', is_primary: true }] },
  { id: 19, name: 'Quần Nỉ Ống Suông Nam', category_id: 2, price: 189000, original_price: 290000, description: 'Quần nỉ ống suông nam chất liệu vải nỉ mềm mại, dày dặn, giữ ấm tốt. Form dáng suông rộng thời trang, có cạp chun dây rút tiện lợi.', stock: 40, images: [{ id: 19, image_url: '/images/products/quan_ni_ong_suong_nam.png', is_primary: true }] },
  { id: 20, name: 'Quần Đùi Bí (Puffed Shorts)', category_id: 4, price: 125000, original_price: 190000, description: 'Quần đùi bí nữ với thiết kế ống phồng trẻ trung, giúp tôn dáng và che khuyết điểm đùi hiệu quả. Chất liệu vải mềm mại, dễ phối đồ.', stock: 60, images: [{ id: 20, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-masbv9t9zsuv3c@resize_w450_nl.webp', is_primary: true }] },
  { id: 21, name: 'Quần Đùi Nữ Cạp Cao', category_id: 4, price: 149000, original_price: 220000, description: 'Quần đùi nữ cạp cao thiết kế tôn dáng, tôn eo hiệu quả. Chất liệu vải kaki bền đẹp, đường may tinh tế, phù hợp dạo phố, đi chơi.', stock: 55, images: [{ id: 21, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mnm55ki6y13864.webp', is_primary: true }] },
  { id: 22, name: 'Váy Thiết Kế Cao Cấp Chéo Tà Đính Tag', category_id: 3, price: 450000, original_price: 680000, description: 'Váy thiết kế cao cấp với chi tiết chéo tà tinh tế, đính tag cài sang trọng. Chất liệu cao cấp đứng form, mang lại vẻ ngoài thanh lịch và quý phái.', stock: 30, images: [{ id: 22, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mpaofbq5rswf49@resize_w450_nl.webp', is_primary: true }] },
  { id: 23, name: 'Quần Jean Nữ Dáng Suông Cạp Chun', category_id: 4, price: 199000, original_price: 280000, description: 'Quần jean nữ dáng suông ống rộng với thiết kế cạp chun thoải mái. Chất liệu bò mềm dày dặn, form suông rộng thời trang, phù hợp mặc đi chơi, dạo phố.', stock: 45, images: [{ id: 23, image_url: '/images/products/quan_jean_nu_cap_chun.png', is_primary: true }] },
  { id: 24, name: 'Son Kem Bóng Hai Đầu Mistine Tipsy-Lock Lip Duo', category_id: 5, price: 185000, original_price: 260000, description: 'Son kem bóng hai đầu Mistine Tipsy-Lock Lip Duo tích hợp một đầu son màu chuẩn sắc và một đầu gel bóng khóa màu, giúp môi căng mọng bền màu suốt ngày dài.', stock: 50, images: [{ id: 24, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mmzob0y0n6dh93.webp', is_primary: true }] },
  { id: 25, name: 'Phấn Phủ Dạng Nén Kakashow', category_id: 5, price: 65000, original_price: 95000, description: 'Phấn phủ dạng nén Kakashow kiềm dầu cực tốt, kết cấu mỏng mịn giúp làm sáng da và giữ lớp nền tươi tắn suốt cả ngày.', stock: 100, images: [{ id: 25, image_url: 'https://down-vn.img.susercontent.com/file/cn-11134207-7qukw-lhhdgytm4vkzab.webp', is_primary: true }] },
  { id: 26, name: 'Balo Nam Cao Cấp LUCCAS - Cổng Sạc USB', category_id: 5, price: 299000, original_price: 450000, description: 'Balo nam/nữ cao cấp thương hiệu LUCCAS SHOP tích hợp cổng sạc USB, thiết kế Hàn Quốc trẻ trung. Vải Oxford chống nước, nhiều ngăn chứa tiện lợi.', stock: 30, images: [{ id: 26, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8c2f5nvkodq66.webp', is_primary: true }] },
  { id: 27, name: 'Túi Xách Tay Đeo Chéo DK208 - Tặng Kèm Móc', category_id: 5, price: 259000, original_price: 380000, description: 'Túi xách tay nữ đa năng DK208, thiết kế sang trọng với chất liệu da sần gạo lịch sự. Có thể đeo chéo hoặc đeo vai linh hoạt, tặng kèm móc treo trang trí cao cấp.', stock: 25, images: [{ id: 27, image_url: 'https://down-vn.img.susercontent.com/file/vn-11134201-820l4-mgnmazstcvm412.webp', is_primary: true }] }
];

const initialOrders = [
  {
    id: 1,
    user_id: 2,
    fullname: 'Nguyễn Văn An',
    phone: '0912345678',
    address: '123 Nguyễn Trãi, Q.1, TP.HCM',
    total_amount: 598000,
    status: 'delivered',
    items: [
      { id: 1, product_id: 1, product_name: 'Áo Thun Nam Basic Trắng', quantity: 2, price: 199000, size: 'L', color: 'Trắng' },
      { id: 2, product_id: 5, product_name: 'Quần Jeans Nam Slim Xanh', quantity: 1, price: 399000, size: '32', color: 'Xanh' }
    ]
  },
  {
    id: 2,
    user_id: 2,
    fullname: 'Nguyễn Văn An',
    phone: '0912345678',
    address: '123 Nguyễn Trãi, Q.1, TP.HCM',
    total_amount: 289000,
    status: 'confirmed',
    items: [
      { id: 3, product_id: 3, product_name: 'Polo Nam Cổ Bẻ Xanh Navy', quantity: 1, price: 289000, size: 'M', color: 'Xanh navy' }
    ]
  }
];

async function seedDatabase() {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(initialCategories);
      console.log('Seeded Categories successfully');
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(initialUsers);
      console.log('Seeded Users successfully');
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.insertMany(initialProducts);
      console.log('Seeded Products successfully');
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.insertMany(initialOrders);
      console.log('Seeded Orders successfully');
    }
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

module.exports = seedDatabase;
