-- Tạo database
IF DB_ID ('fashionhub') IS NULL CREATE DATABASE fashionhub;
GO

USE fashionhub;
GO

-- Bảng người dùng
CREATE TABLE users (
    id INT IDENTITY (1, 1) PRIMARY KEY,
    name NVARCHAR (100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'admin')) DEFAULT 'customer',
    cancel_count INT NOT NULL DEFAULT 0, -- Số lần bom hàng
    is_banned BIT NOT NULL DEFAULT 0, -- 1 = bị cấm vĩnh viễn
    created_at DATETIME2 DEFAULT GETDATE (),
    updated_at DATETIME2 DEFAULT GETDATE ()
);
GO

-- Bảng danh mục
CREATE TABLE categories (
    id INT IDENTITY (1, 1) PRIMARY KEY,
    name NVARCHAR (100) NOT NULL,
    description NVARCHAR (MAX),
    created_at DATETIME2 DEFAULT GETDATE ()
);
GO

-- Bảng sản phẩm
CREATE TABLE products (
    id INT IDENTITY (1, 1) PRIMARY KEY,
    name NVARCHAR (200) NOT NULL,
    category_id INT NULL,
    price DECIMAL(12, 2) NOT NULL,
    original_price DECIMAL(12, 2),
    description NVARCHAR (MAX),
    stock INT NOT NULL DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE (),
    updated_at DATETIME2 DEFAULT GETDATE (),
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
);
GO

-- Bảng ảnh sản phẩm
CREATE TABLE product_images (
    id INT IDENTITY (1, 1) PRIMARY KEY,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE (),
    CONSTRAINT fk_img_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);
GO

-- Bảng đơn hàng
CREATE TABLE orders (
    id INT IDENTITY (1, 1) PRIMARY KEY,
    user_id INT NOT NULL,
    fullname NVARCHAR (100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address NVARCHAR (MAX) NOT NULL,
    note NVARCHAR (MAX),
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (
        status IN (
            'pending',
            'confirmed',
            'shipping',
            'delivered',
            'cancelled'
        )
    ) DEFAULT 'pending',
    cancel_reason NVARCHAR (MAX) NULL,
    refund_status VARCHAR(20) DEFAULT 'none',
    created_at DATETIME2 DEFAULT GETDATE (),
    updated_at DATETIME2 DEFAULT GETDATE (),
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users (id)
);
GO

-- Bảng chi tiết đơn hàng
CREATE TABLE order_items (
    id INT IDENTITY (1, 1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    size VARCHAR(10) DEFAULT '',
    color VARCHAR(50) DEFAULT '',
    CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_item_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL
);
GO

-- Index tăng tốc truy vấn
CREATE INDEX idx_products_category ON products (category_id);

CREATE INDEX idx_products_price ON products (price);

CREATE INDEX idx_orders_user ON orders (user_id);

CREATE INDEX idx_orders_status ON orders (status);

CREATE INDEX idx_order_items_order ON order_items (order_id);
GO