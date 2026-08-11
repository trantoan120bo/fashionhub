// Script thêm cột phone vào bảng users (chạy 1 lần)
const sql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });

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

    // Kiểm tra cột phone đã tồn tại chưa
    const check = await pool.request().query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'phone'
    `);

    if (check.recordset.length > 0) {
      console.log('Cột "phone" đã tồn tại trong bảng users. Không cần thêm.');
    } else {
      await pool.request().query(`ALTER TABLE users ADD phone VARCHAR(15) NULL`);
      console.log('✅ Đã thêm cột "phone" vào bảng users thành công!');
    }

    await pool.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi migration:', err.message);
    process.exit(1);
  }
}

migrate();
