const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const https = require('https');

const STORE_LOCATION = {
  lat: 10.7721,
  lng: 106.6983,
  address: 'Chợ Bến Thành, Quận 1, TP. Hồ Chí Minh'
};

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

function calculateShippingFee(distanceKm, subtotal = 0) {
  // 1. Miễn phí vận chuyển nếu Đơn hàng >= 1.000.000 VNĐ VÀ Khoảng cách <= 10 km
  if (subtotal >= 1000000 && distanceKm <= 10) {
    return 0;
  }
  // 2. Khoảng cách dưới hoặc bằng 6km -> Cước cố định 20.000 VNĐ
  if (distanceKm <= 6) {
    return 20000;
  }
  // 3. Khoảng cách trên 6km -> Tính tổng km x 3.000 VNĐ/km
  const totalKm = Math.ceil(distanceKm);
  const calculatedFee = totalKm * 3000;
  return Math.max(20000, calculatedFee);
}

exports.calculateShipping = async (req, res) => {
  try {
    const { address, subtotal } = req.body;
    const orderSubtotal = parseFloat(subtotal || 0);

    if (!address) {
      return res.status(400).json({ message: 'Vui lòng cung cấp địa chỉ giao hàng' });
    }

    let fetchResult = [];
    let lat = null;
    let lng = null;
    let displayName = address;

    const fetchOsm = (query) => new Promise((resolve) => {
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Việt Nam')}&limit=1&countrycodes=vn`;
      const request = https.get(geocodeUrl, {
        headers: { 'User-Agent': 'FashionHub-Ecommerce-App/1.0' }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch { resolve([]); }
        });
      });
      request.on('error', () => resolve([]));
      request.setTimeout(4000, () => {
        request.destroy();
        resolve([]);
      });
    });

    try {
      fetchResult = await fetchOsm(address);
      if (!fetchResult || fetchResult.length === 0) {
        const addressWithoutNumber = address.replace(/^(\d+[\/\d\w]*\s*,?\s*)/i, '').trim();
        if (addressWithoutNumber && addressWithoutNumber.length > 4) {
          fetchResult = await fetchOsm(addressWithoutNumber);
        }
      }

      if (fetchResult && fetchResult.length > 0) {
        lat = parseFloat(fetchResult[0].lat);
        lng = parseFloat(fetchResult[0].lon);
        displayName = fetchResult[0].display_name;
      }
    } catch (e) {
      console.error('Geocoding API error:', e);
    }

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Địa chỉ không tồn tại hoặc không thể định vị trên bản đồ',
        details: `Hệ thống không thể định vị tọa độ cho địa chỉ "${address}". Vui lòng ghi chi tiết tên đường, phường/xã, quận/huyện chính xác.`
      });
    }

    const distanceKm = calculateHaversineDistance(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng);
    const shippingFee = calculateShippingFee(distanceKm, orderSubtotal);

    let feeBreakdown = '';
    if (orderSubtotal >= 1000000 && distanceKm <= 10) {
      feeBreakdown = '🎉 MIỄN PHÍ VẬN CHUYỂN (0đ) - Áp dụng đơn từ 1.000.000 VNĐ trong bán kính 10km!';
    } else if (distanceKm <= 6) {
      feeBreakdown = '20.000 VNĐ (Gói cước cố định dưới 6km)';
    } else {
      const totalKm = Math.ceil(distanceKm);
      feeBreakdown = `${totalKm} km x 3.000đ/km (${(totalKm * 3000).toLocaleString('vi-VN')}đ)`;
      if (orderSubtotal >= 1000000 && distanceKm > 10) {
        feeBreakdown += ' (Vượt quá 10km nên tính 3.000đ/km theo khoảng cách thực tế)';
      }
    }

    return res.json({
      success: true,
      address,
      formatted_address: displayName,
      lat,
      lng,
      store_location: STORE_LOCATION,
      distance_km: distanceKm,
      shipping_fee: shippingFee,
      fee_breakdown: feeBreakdown
    });
  } catch (err) {
    console.error('Lỗi tính phí giao hàng:', err);
    return res.status(500).json({ message: 'Lỗi khi định vị địa chỉ và tính phí giao hàng' });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { fullname, phone, address, note, total_amount, payment_method, items, shipping_fee, lat, lng, distance_km } = req.body;
    if (!fullname || !phone || !address || !items?.length) {
      return res.status(400).json({ message: 'Thiếu thông tin đơn hàng' });
    }

    const user = await User.findOne({ id: userId });
    if (user && user.is_banned) {
      return res.status(403).json({
        message: '⛔ Tài khoản của bạn đã bị khóa do hủy đơn hàng quá nhiều lần. Vui lòng liên hệ shop để được hỗ trợ.',
        banned: true
      });
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0' });
    }

    const method = payment_method || 'cod';
    const initialStatus = method === 'bank' ? 'paid' : 'pending';

    const maxOrder = await Order.findOne().sort('-id');
    const orderId = maxOrder && maxOrder.id ? maxOrder.id + 1 : 1;

    const orderItems = [];
    let itemCounter = 1;

    for (const item of items) {
      const product = await Product.findOne({ id: Number(item.product_id) });
      if (!product) {
        return res.status(400).json({ message: 'Sản phẩm không tồn tại' });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm "${product.name}" đã hết hàng hoặc không đủ số lượng` });
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        id: itemCounter++,
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size || '',
        color: item.color || ''
      });
    }

    await Order.create({
      id: orderId,
      user_id: userId,
      fullname,
      phone,
      address,
      note: note || '',
      total_amount: Number(total_amount),
      shipping_fee: shipping_fee ? Number(shipping_fee) : 0,
      lat: lat ? Number(lat) : null,
      lng: lng ? Number(lng) : null,
      distance_km: distance_km ? Number(distance_km) : null,
      status: initialStatus,
      items: orderItems
    });

    res.status(201).json({
      message: 'Đặt hàng thành công',
      order_id: orderId,
      status: initialStatus,
      payment_method: method
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || 'Lỗi server' });
  }
};

async function populateOrderItemsImages(orders) {
  const productIds = [];
  orders.forEach(o => {
    (o.items || []).forEach(item => {
      if (item.product_id) productIds.push(item.product_id);
    });
  });

  const products = await Product.find({ id: { $in: productIds } }).lean();
  const productMap = {};
  products.forEach(p => {
    const primaryImg = p.images && p.images.length > 0 ? (p.images.find(img => img.is_primary) || p.images[0]).image_url : null;
    productMap[p.id] = { name: p.name, image_url: primaryImg };
  });

  return orders.map(o => {
    const items = (o.items || []).map(item => {
      const pInfo = productMap[item.product_id] || {};
      return {
        ...item,
        product_name: item.product_name || pInfo.name || '',
        image_url: pInfo.image_url || null
      };
    });
    return { ...o, items };
  });
}

exports.getMyOrders = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const rawOrders = await Order.find({ user_id: userId }).sort({ created_at: -1 }).lean();
    const orders = await populateOrderItemsImages(rawOrders);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const rawOrder = await Order.findOne({ id: orderId }).lean();
    if (!rawOrder) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    if (req.user.role !== 'admin' && Number(rawOrder.user_id) !== Number(req.user.id)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    const [order] = await populateOrderItemsImages([rawOrder]);
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const rawOrders = await Order.find().sort({ created_at: -1 }).lean();
    const orders = await populateOrderItemsImages(rawOrders);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status, cancel_reason } = req.body;
    const allowed = ['pending', 'paid', 'confirmed', 'shipping', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Trạng thái không hợp lệ' });

    const order = await Order.findOne({ id: orderId });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        if (item.product_id) {
          const product = await Product.findOne({ id: item.product_id });
          if (product) {
            product.stock += item.quantity;
            await product.save();
          }
        }
      }
      order.status = 'cancelled';
      order.cancel_reason = cancel_reason || 'Admin từ chối đơn hàng';
      order.refund_status = 'pending_refund';
      await order.save();
      return res.json({ message: 'Đã từ chối / hủy đơn hàng thành công' });
    }

    order.status = status;
    await order.save();
    res.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const deliveredOrders = await Order.find({ status: { $in: ['delivered', 'paid'] } }).lean();
    const revenue = deliveredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const allOrders = await Order.find().lean();
    const totalOrders = allOrders.length;

    const counts = {};
    allOrders.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });

    const recentOrders = await Order.find()
      .select('id fullname total_amount status created_at')
      .sort({ created_at: -1 })
      .limit(5)
      .lean();

    res.json({
      revenue,
      totalOrders,
      statusCounts: counts,
      recentOrders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const userId = Number(req.user.id);

    const order = await Order.findOne({ id: orderId });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    if (Number(order.user_id) !== userId) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }

    if (order.status === 'shipping' || order.status === 'delivered') {
      return res.status(400).json({ message: 'Không thể hủy đơn hàng lúc này vì đơn hàng đang được giao hoặc đã giao' });
    }

    const createdDate = new Date(order.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - createdDate) / (1000 * 60 * 60);

    if (diffHours > 48) {
      return res.status(400).json({ message: 'Đã qua 2 ngày, không thể hủy đơn hàng' });
    }

    const { reason } = req.body;

    for (const item of order.items) {
      if (item.product_id) {
        const product = await Product.findOne({ id: item.product_id });
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = 'cancelled';
    order.cancel_reason = reason || 'Người dùng hủy đơn';
    order.refund_status = 'pending_refund';
    await order.save();

    const user = await User.findOne({ id: userId });
    let cancelCount = 0;
    let banned = false;
    let warningMessage = '';

    if (user) {
      user.cancel_count += 1;
      cancelCount = user.cancel_count;

      if (cancelCount >= 3) {
        user.is_banned = true;
        banned = true;
        warningMessage = '⛔ Tài khoản của bạn đã bị khóa vĩnh viễn do hủy đơn hàng quá 2 lần. Vui lòng liên hệ shop để được hỗ trợ.';
      } else if (cancelCount === 2) {
        warningMessage = `⚠️ Cảnh báo: Bạn đã hủy đơn ${cancelCount} lần. Nếu hủy thêm 1 lần nữa, tài khoản sẽ bị khóa vĩnh viễn.`;
      } else if (cancelCount === 1) {
        warningMessage = `⚠️ Lưu ý: Bạn đã hủy đơn ${cancelCount} lần. Hủy quá 2 lần sẽ bị khóa tài khoản.`;
      }

      await user.save();
    }

    res.json({
      message: 'Đã hủy đơn hàng thành công. Phí kiện hàng / Số tiền sẽ được hoàn trả từ 3-5 ngày làm việc.',
      cancel_count: cancelCount,
      banned,
      warning: warningMessage,
      refund_note: 'Phí kiện hàng / Số tiền sẽ được hoàn trả từ 3-5 ngày làm việc.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.refundOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const order = await Order.findOne({ id: orderId });
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    order.refund_status = 'refunded';
    await order.save();

    res.json({ message: 'Đã xác nhận hoàn tiền' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
