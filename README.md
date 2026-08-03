# FashionHub — Website Thương Mại Điện Tử Thời Trang

Một ứng dụng web thương mại điện tử mua sắm thời trang hoàn chỉnh với giao diện đẹp mắt, tối ưu hóa SEO và quản lý đơn hàng chuyên nghiệp.

---

## 🛠️ Công Nghệ Sử Dụng

* **Frontend**: ReactJS 18, React Router v6, Axios, CSS Modules.
* **Backend**: Node.js, Express.js, JWT, bcryptjs.
* **Database Driver**: `mssql` (Kết nối Microsoft SQL Server).
* **Database**: Microsoft SQL Server (MSSQL) 2019 trở lên.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cài Đặt Cơ Sở Dữ Liệu (Microsoft SQL Server)

Dự án này sử dụng **Microsoft SQL Server** (không dùng MySQL). Vui lòng chuẩn bị sẵn một máy chủ SQL Server local (mặc định chạy trên cổng `1433`).

1. Mở công cụ quản lý cơ sở dữ liệu (ví dụ: **SQL Server Management Studio (SSMS)** hoặc extension MSSQL trên VS Code).
2. Kết nối tới SQL Server của bạn và mở/chạy file cấu trúc cơ sở dữ liệu:
   * Đường dẫn file: `database/shema.sql` (chạy script này trước để tạo database và các bảng).
3. Sau khi tạo các bảng thành công, mở và chạy tiếp file dữ liệu mẫu:
   * Đường dẫn file: `database/seed.sql` (chạy script này để nạp dữ liệu mẫu và các tài khoản demo).

---

### 2. Cài Đặt & Chạy Backend

1. Di chuyển vào thư mục backend:
   ```bash
   cd backend
   ```
2. Sao chép cấu hình mẫu sang file cấu hình thực tế:
   ```bash
   cp .env.example .env
   ```
3. Mở file `.env` vừa tạo và cập nhật các thông tin kết nối SQL Server của bạn:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=1433
   DB_USER=tên_user_sql_server (mặc định là sa)
   DB_PASSWORD=mật_khẩu_của_bạn
   DB_NAME=fashionhub
   JWT_SECRET=fashionhub_secret_key_2024
   CLIENT_URL=http://localhost:3000
   ```
4. Cài đặt các package cần thiết:
   ```bash
   npm install
   ```
5. Khởi chạy server ở chế độ phát triển (Development):
   ```bash
   npm run dev
   ```
   * *Server sẽ chạy tại:* `http://localhost:5000`

---

### 3. Cài Đặt & Chạy Frontend

1. Di chuyển vào thư mục frontend:
   ```bash
   cd frontend
   ```
2. Sao chép cấu hình mẫu sang file cấu hình thực tế (mặc định đã kết nối tới Backend tại cổng 5000):
   ```bash
   cp .env.example .env
   ```
3. Cài đặt các thư viện cần thiết:
   ```bash
   npm install
   ```
4. Khởi chạy giao diện React:
   ```bash
   npm start
   ```
   * *Ứng dụng web sẽ chạy tại:* `http://localhost:3000`

---

## 🔑 Tài Khoản Mặc Định (Sau Khi Seed)

| Vai trò | Email | Mật khẩu |
| :--- | :--- | :--- |
| **Admin** | `admin@fashionhub.com` | `Admin@123` |
| **User / Customer** | `an@example.com` | `Admin@123` |

> ⚠️ **Lưu ý**: Hãy nhớ thay đổi mật khẩu và cập nhật lại khóa bảo mật `JWT_SECRET` nếu triển khai dự án lên môi trường thực tế (production).

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
fashionhub/
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/           # Các hàm gọi Axios API
│       ├── components/    # Components dùng chung (Layout, ProductCard, Guard...)
│       ├── context/       # State quản lý AuthContext, CartContext
│       └── pages/         # Giao diện các trang (Home, Product, Cart, Checkout, Admin...)
├── backend/
│   └── src/
│       ├── config/        # File cấu hình kết nối MSSQL (database.js)
│       ├── controllers/   # Logic nghiệp vụ (sản phẩm, đơn hàng, auth...)
│       ├── middlewares/   # Phân quyền, kiểm tra đăng nhập (auth, validation...)
│       └── routes/        # Router định nghĩa các API endpoints
└── database/
    ├── shema.sql          # Tạo database và bảng dữ liệu (cú pháp MSSQL)
    └── seed.sql           # Dữ liệu mẫu ban đầu
```

---

## 🛠️ Khắc Phục Lỗi Thường Gặp (Troubleshooting)

### 🔴 Lỗi "Port 3000 is already in use"
Khi chạy lệnh `npm start` ở frontend, nếu gặp thông báo cổng 3000 đã bị ứng dụng khác sử dụng, bạn có thể:
* **Cách 1**: Nhấn `Y` để ứng dụng React chạy trên cổng phụ khác (ví dụ: `3001`).
* **Cách 2**: Tìm và tắt tiến trình đang chiếm dụng cổng 3000 bằng lệnh trên CMD/Powershell:
  ```powershell
  # Tìm PID đang chạy ở cổng 3000
  netstat -ano | findstr :3000
  # Tắt tiến trình đó (thay PID bằng số thực tế)
  taskkill /F /PID <Số_PID>
  ```

### 🔴 Lỗi Kết Nối Cơ Sở Dữ Liệu "Database Connection Failed"
* Kiểm tra dịch vụ **SQL Server** đã được khởi chạy trong cửa sổ `Services` của Windows chưa.
* Đảm bảo cấu hình cổng (`DB_PORT=1433`) và thông tin tài khoản/mật khẩu trong file `backend/.env` hoàn toàn trùng khớp với SQL Server local của bạn.
* Đảm bảo tính năng **TCP/IP** đã được Enable trong phần cấu hình mạng của SQL Server Configuration Manager.
