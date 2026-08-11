// Helper kiểm tra địa chỉ thông minh & khắt khe
function isSmartValidAddress(address) {
  if (!address || typeof address !== 'string') return { valid: false, reason: 'Địa chỉ giao hàng không được để trống' };
  
  const trimmed = address.trim();
  if (trimmed.length < 6) {
    return { valid: false, reason: 'Địa chỉ quá ngắn. Vui lòng nhập chi tiết số nhà, tên đường, quận/huyện.' };
  }

  // Kiểm tra lỗi gõ sai như "10,3 Nguyễn Tri Phương" (dấu phẩy sai vị trí trong số nhà)
  if (/^\d+,\d+/.test(trimmed)) {
    return {
      valid: false,
      reason: `Định dạng số nhà "${trimmed.split(' ')[0]}" không đúng chuẩn thực tế. Nếu là hẻm/ngách vui lòng dùng dấu gạch chéo "/" (Ví dụ: 10/3 Nguyễn Tri Phương).`
    };
  }

  // Kiểm tra số nhà đi kèm dấu phẩy sai cú pháp như "10, Nguyễn Tri Phương"
  if (/^\d+,\s*[^\d]/.test(trimmed)) {
    return {
      valid: false,
      reason: 'Định dạng số nhà chứa dấu phẩy không hợp lệ. Vui lòng ghi dạng: "10 Nguyễn Tri Phương" hoặc "10/3 Nguyễn Tri Phương".'
    };
  }

  // Kiểm tra chuỗi ký tự rác trùng lặp (ví dụ: asdfghjk, 11111111, aaaaaaaa)
  if (/(.)\1{5,}/i.test(trimmed)) {
    return { valid: false, reason: 'Địa chỉ chứa chuỗi ký tự không hợp lệ hoặc lặp lại vô nghĩa.' };
  }

  // Kiểm tra số nhà phi thực tế (ví dụ: 100000 Nguyễn Thị Định)
  const numberMatch = trimmed.match(/^(\d+)/);
  if (numberMatch) {
    const houseNumber = parseInt(numberMatch[1], 10);
    if (houseNumber > 5000) {
      return {
        valid: false,
        reason: `Số nhà "${houseNumber}" không hợp lệ hoặc vượt quá quy chuẩn thực tế (tối đa 5000). Vui lòng kiểm tra lại số nhà.`
      };
    }
  }

  return { valid: true };
}

// 1. Validator cho API Đặt Hàng (POST /api/orders)
exports.validateOrderInput = (req, res, next) => {
  const { fullname, phone, address, items } = req.body;

  // Kiểm tra Họ và Tên
  if (!fullname || typeof fullname !== 'string' || fullname.trim().length < 2) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Họ và tên không hợp lệ',
      details: 'Họ và tên người nhận không được để trống và phải có ít nhất 2 ký tự.'
    });
  }

  // Kiểm tra Số Điện Thoại (10 số, bắt đầu bằng số 0)
  const phoneRegex = /^0\d{9}$/;
  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Số điện thoại không hợp lệ',
      details: 'Số điện thoại phải bao gồm đúng 10 chữ số và bắt đầu bằng số 0 (Ví dụ: 0912345678).'
    });
  }

  // Kiểm tra Địa chỉ thông minh
  const addressCheck = isSmartValidAddress(address);
  if (!addressCheck.valid) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Địa chỉ giao hàng không hợp lệ',
      details: addressCheck.reason
    });
  }

  // Kiểm tra Giỏ hàng / Danh sách sản phẩm
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Giỏ hàng không hợp lệ',
      details: 'Đơn hàng phải chứa ít nhất 1 sản phẩm hợp lệ.'
    });
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.product_id || !item.quantity || item.quantity <= 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Sản phẩm trong giỏ hàng không hợp lệ',
        details: `Sản phẩm ở vị trí thứ ${i + 1} thiếu ID sản phẩm hoặc có số lượng không hợp lệ.`
      });
    }
  }

  next();
};

// 2. Validator thông minh cho Định Vị & Phí Giao Hàng (POST /api/orders/calculate-shipping)
exports.validateShippingInput = (req, res, next) => {
  const { address } = req.body;

  const addressCheck = isSmartValidAddress(address);
  if (!addressCheck.valid) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Địa chỉ giao hàng không hợp lệ',
      details: addressCheck.reason
    });
  }

  next();
};
