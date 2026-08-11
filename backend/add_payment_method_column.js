// Script thêm cột payment_method và cập nhật constraint status nếu cần
const sql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const config = {
  user: process.env.DB_USER || 'fashion_admin',
  password: process.env.DB_PASSWORD || '123456',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'fashionhub',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

async function migrate() {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to database');

    // 1. Kiểm tra cột payment_method
    const checkPayment = await pool.request().query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'orders' AND COLUMN_NAME = 'payment_method'
    `);

    if (checkPayment.recordset.length > 0) {
      console.log('Cột "payment_method" đã tồn tại trong bảng orders.');
    } else {
      await pool.request().query(`ALTER TABLE orders ADD payment_method VARCHAR(20) NULL`);
      console.log('✅ Đã thêm cột "payment_method" vào bảng orders thành công!');
    }

    // 2. Drop constraint status cũ nếu có để hỗ trợ trạng thái 'paid'
    try {
      const constraints = await pool.request().query(`
        SELECT name FROM sys.check_constraints WHERE parent_object_id = OBJECT_ID('orders')
      `);
      for (const c of constraints.recordset) {
        await pool.request().query(`ALTER TABLE orders DROP CONSTRAINT ${c.name}`);
        console.log(`Đã gỡ bỏ constraint: ${c.name}`);
      }
    } catch (e) {
      console.log('Không cần gỡ constraint hoặc không tìm thấy:', e.message);
    }

    await pool.close();
    console.log('✅ Migration thành công!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi migration:', err.message);
    process.exit(1);
  }
}

migrate();
