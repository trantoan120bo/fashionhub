USE fashionhub;

-- Danh mục
INSERT INTO
    categories (name, description)
VALUES (
        'Áo Nam',
        N'Áo thun, sơ mi, polo dành cho nam'
    ),
    (
        N'Quần Nam',
        N'Quần jeans, kaki, shorts dành cho nam'
    ),
    (
        N'Áo Nữ',
        N'Áo thun, sơ mi, crop top dành cho nữ'
    ),
    (
        N'Quần Nữ',
        N'Quần jeans, legging, shorts dành cho nữ'
    ),
    (
        N'Phụ Kiện',
        N'Nón, túi, thắt lưng, tất'
    );

-- Tài khoản Admin (password: Admin@123)
INSERT INTO
    users (name, email, password, role)
VALUES (
        N'FashionHub Admin',
        'admin@fashionhub.com',
        '$2a$10$yKI8noh4icaqsCTRAWGsHOrjOeURSRY.XeIvPcyAAS25gLOkedy.2',
        'admin'
    ),
    (
        N'Nguyễn Văn An',
        'an@example.com',
        '$2a$10$yKI8noh4icaqsCTRAWGsHOrjOeURSRY.XeIvPcyAAS25gLOkedy.2',
        'customer'
    );

-- Sản phẩm
INSERT INTO
    products (
        name,
        category_id,
        price,
        original_price,
        description,
        stock
    )
VALUES (
        N'Áo Thun Nam Basic Trắng',
        1,
        199000,
        279000,
        N'Áo thun cotton 100%, form regular fit, thoáng mát',
        150
    ),
    (
        N'Sơ Mi Nam Kẻ Caro Slim',
        1,
        349000,
        450000,
        N'Sơ mi cotton pha polyester, form slim fit, dễ mặc',
        80
    ),
    (
        N'Polo Nam Cổ Bẻ Xanh Navy',
        1,
        289000,
        380000,
        N'Áo polo piqué cao cấp, thoáng khí, bền màu',
        60
    ),
    (
        N'Áo Hoodie Oversize Đen',
        1,
        459000,
        590000,
        N'Hoodie cotton nỉ dày, form oversize, giữ ấm tốt',
        45
    ),
    (
        N'Quần Jeans Nam Slim Xanh',
        2,
        399000,
        520000,
        N'Quần jeans co giãn 4 chiều, bền chắc',
        70
    ),
    (
        N'Quần Kaki Ống Suôn Be',
        2,
        329000,
        420000,
        N'Quần kaki cotton, form ống suôn, lịch sự',
        90
    ),
    (
        N'Áo Thun Nữ Crop Top Hồng',
        3,
        179000,
        250000,
        N'Áo crop top cotton mềm mại, thiết kế trẻ trung',
        120
    ),
    (
        N'Áo Sơ Mi Nữ Oversize Trắng',
        3,
        279000,
        360000,
        N'Sơ mi oversize phong cách Hàn Quốc, dễ mix đồ',
        95
    ),
    (
        N'Quần Jeans Nữ Ống Rộng Đen',
        4,
        379000,
        490000,
        N'Quần jeans ống rộng cạp cao, tôn dáng',
        75
    ),
    (
        N'Quần Legging Thể Thao Đen',
        4,
        219000,
        290000,
        N'Legging co giãn cao, phù hợp tập gym, yoga',
        110
    ),
    (
        N'Nón Bucket Tai Bèo Kem',
        5,
        149000,
        200000,
        N'Nón bucket cotton, chống nắng, thời trang',
        60
    ),
    (
        N'Túi Tote Canvas Đen',
        5,
        199000,
        260000,
        N'Túi tote canvas dày, in logo, nhiều ngăn nhỏ',
        50
    ),
    (
        N'Áo Khoác Jean Nam Denim',
        1,
        590000,
        750000,
        N'Áo khoác denim chất lừ, form đứng, phong cách bụi bặm',
        30
    ),
    (
        N'Áo thun nữ cổ bẻ phối dây kéo SAMSAM BRAND',
        3,
        250000,
        350000,
        N'Áo thun nữ cổ bẻ thiết kế khóa kéo độc đáo, phong cách Hàn Quốc',
        40
    ),
    (
        N'Áo Babydoll Nữ Vải Thô Linen Kiểu Tay Phồng Phối Nơ Ngực',
        3,
        220000,
        320000,
        N'Áo babydoll linen phong cách tiểu thư, tay bồng, thắt nơ ngực duyên dáng',
        25
    ),
    (
        N'Áo Cardigan Nữ Lưới Tay Dài Phối Hoa Nổi',
        3,
        185000,
        265000,
        N'Áo cardigan lưới tay dài họa tiết hoa nổi 3D, vải co dãn mỏng nhẹ thời trang',
        35
    ),
    (
        N'Quần Short Nam Cotton Da Cá',
        2,
        155000,
        225000,
        N'Quần short nam chất cotton da cá mềm mịn, thoáng mát, thấm hút mồ hôi tốt',
        60
    ),
    (
        N'Quần jean nam ống suông rộng TR01',
        2,
        159000,
        250000,
        N'Quần jean nam ống suông rộng mã TR01 phong cách Baggy Hàn Quốc, chất denim cao cấp, form suông rộng thoải mái, phong cách trẻ trung.',
        50
    ),
    (
        N'Quần Nỉ Ống Suông Nam',
        2,
        189000,
        290000,
        N'Quần nỉ ống suông nam chất liệu vải nỉ mềm mại, dày dặn, giữ ấm tốt. Form dáng suông rộng thời trang, có cạp chun dây rút tiện lợi.',
        40
    ),
    (
        N'Quần Đùi Bí (Puffed Shorts)',
        4,
        125000,
        190000,
        N'Quần đùi bí nữ với thiết kế ống phồng trẻ trung, giúp tôn dáng và che khuyết điểm đùi hiệu quả. Chất liệu vải mềm mại, dễ phối đồ.',
        60
    ),
    (
        N'Quần Đùi Nữ Cạp Cao',
        4,
        149000,
        220000,
        N'Quần đùi nữ cạp cao thiết kế tôn dáng, tôn eo hiệu quả. Chất liệu vải kaki bền đẹp, đường may tinh tế, phù hợp dạo phố, đi chơi.',
        55
    ),
    (
        N'Váy Thiết Kế Cao Cấp Chéo Tà Đính Tag',
        3,
        450000,
        680000,
        N'Váy thiết kế cao cấp với chi tiết chéo tà tinh tế, đính tag cài sang trọng. Chất liệu cao cấp đứng form, mang lại vẻ ngoài thanh lịch và quý phái.',
        30
    ),
    (
        N'Quần Jean Nữ Dáng Suông Cạp Chun',
        4,
        199000,
        280000,
        N'Quần jean nữ dáng suông ống rộng với thiết kế cạp chun thoải mái. Chất liệu bò mềm dày dặn, form suông rộng thời trang, phù hợp mặc đi chơi, dạo phố.',
        45
    ),
    (
        N'Son Kem Bóng Hai Đầu Mistine Tipsy-Lock Lip Duo',
        5,
        185000,
        260000,
        N'Son kem bóng hai đầu Mistine Tipsy-Lock Lip Duo tích hợp một đầu son màu chuẩn sắc và một đầu gel bóng khóa màu, giúp môi căng mọng bền màu suốt ngày dài.',
        50
    ),
    (
        N'Phấn Phủ Dạng Nén Kakashow',
        5,
        65000,
        95000,
        N'Phấn phủ dạng nén Kakashow kiềm dầu cực tốt, kết cấu mỏng mịn giúp làm sáng da và giữ lớp nền tươi tắn suốt cả ngày.',
        100
    ),
    (
        N'Balo Nam Cao Cấp LUCCAS - Cổng Sạc USB',
        5,
        299000,
        450000,
        N'Balo nam/nữ cao cấp thương hiệu LUCCAS SHOP tích hợp cổng sạc USB, thiết kế Hàn Quốc trẻ trung. Vải Oxford chống nước, nhiều ngăn chứa tiện lợi.',
        30
    ),
    (
        N'Túi Xách Tay Đeo Chéo DK208 - Tặng Kèm Móc',
        5,
        259000,
        380000,
        N'Túi xách tay nữ đa năng DK208, thiết kế sang trọng với chất liệu da sần gạo lịch sự. Có thể đeo chéo hoặc đeo vai linh hoạt, tặng kèm móc treo trang trí cao cấp.',
        25
    );

-- Ảnh sản phẩm (dùng placeholder)
INSERT INTO
    product_images (
        product_id,
        image_url,
        is_primary
    )
VALUES (
        1,
        'https://th.bing.com/th/id/OIP.jHf5LUMYeBxoq8MPhS8AggHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
        1
    ),
    (
        2,
        'https://file.hstatic.net/200000053174/file/phoi-do-cung-ao-so-mi-caro-nam_cho-nhung-outfit-thoi-thuong_cb30125f40b64c8b9bb2a8c0e01e3d95.jpeg',
        1
    ),
    (
        3,
        'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mg7tedk9zf2g67',
        1
    ),
    (
        4,
        'https://down-vn.img.susercontent.com/file/eb4e177e59718536227b6c75a316c253',
        1
    ),
    (
        5,
        'https://jeanthuanhai.com/wp-content/uploads/2023/07/z4450182316466-d5ba23a0926f883115ddd2acdf3909d6.jpg',
        1
    ),
    (
        6,
        'https://tse3.mm.bing.net/th/id/OIP.Ev2TYhhsP4mQczF90AFcdgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        1
    ),
    (
        7,
        'https://down-vn.img.susercontent.com/file/sg-11134201-7rcdd-m6dpzgob8eyyd7',
        1
    ),
    (
        8,
        'https://ae01.alicdn.com/kf/S0955455d53ba4addb6f032695d7861f7R.jpg',
        1
    ),
    (
        9,
        'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lma2fdfqye3j0e',
        1
    ),
    (
        10,
        'https://n7media.coolmate.me/uploads/September2025/quan-legging-the-thao-co-gian-seamless-7-den_9.jpg?aio=w-700',
        1
    ),
    (
        11,
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m12mj5l6ko7z1e',
        1
    ),
    (
        12,
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-may9ourmpbyw19',
        1
    ),
    (
        13,
        'https://aokhoacnam.vn/upload/product/akn-123/ao-khoac-jean-denim-nam-tinh-4.jpg',
        1
    ),
    (
        14,
        'https://tse4.mm.bing.net/th/id/OIP.z_GiBl-BZuHvR9tlyM1HwAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
        1
    ),
    (
        15,
        'https://down-vn.img.susercontent.com/file/vn-11134208-820l4-mfhxe0yiae4vb3',
        1
    ),
    (
        16,
        'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvdebhqpaz655e',
        1
    ),
    (
        17,
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m70t0vtafsf5da.webp',
        1
    ),
    (
        18,
        'https://down-vn.img.susercontent.com/file/sg-11134201-22120-n0jg9danzjkvb1.webp',
        1
    ),
    (
        19,
        '/images/products/quan_ni_ong_suong_nam.png',
        1
    ),
    (
        20,
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-masbv9t9zsuv3c@resize_w450_nl.webp',
        1
    ),
    (
        21,
        'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mnm55ki6y13864.webp',
        1
    ),
    (
        22,
        'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mpaofbq5rswf49@resize_w450_nl.webp',
        1
    ),
    (
        23,
        '/images/products/quan_jean_nu_cap_chun.png',
        1
    ),
    (
        24,
        'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mmzob0y0n6dh93.webp',
        1
    ),
    (
        25,
        'https://down-vn.img.susercontent.com/file/cn-11134207-7qukw-lhhdgytm4vkzab.webp',
        1
    ),
    (
        26,
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m8c2f5nvkodq66.webp',
        1
    ),
    (
        27,
        'https://down-vn.img.susercontent.com/file/vn-11134201-820l4-mgnmazstcvm412.webp',
        1
    );

-- Đơn hàng mẫu
INSERT INTO
    orders (
        user_id,
        fullname,
        phone,
        address,
        total_amount,
        status
    )
VALUES (
        2,
        N'Nguyễn Văn An',
        '0912345678',
        N'123 Nguyễn Trãi, Q.1, TP.HCM',
        598000,
        'delivered'
    ),
    (
        2,
        N'Nguyễn Văn An',
        '0912345678',
        N'123 Nguyễn Trãi, Q.1, TP.HCM',
        289000,
        'confirmed'
    );

INSERT INTO
    order_items (
        order_id,
        product_id,
        quantity,
        price,
        size,
        color
    )
VALUES (
        1,
        1,
        2,
        199000,
        'L',
        N'Trắng'
    ),
    (
        1,
        5,
        1,
        399000,
        '32',
        N'Xanh'
    ),
    (
        2,
        3,
        1,
        289000,
        'M',
        N'Xanh navy'
    );