-- =========================
-- FULL SETUP (DDL + DML)
-- =========================

DROP DATABASE IF EXISTS sec1_gr14_database;
CREATE DATABASE sec1_gr14_database;
USE sec1_gr14_database;

-- =========================
-- TABLES
-- =========================

CREATE TABLE admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  dob DATETIME,
  created_at DATETIME NOT NULL
);

CREATE TABLE login_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  last_login DATETIME NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admin(id)
);

CREATE TABLE product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  brand VARCHAR(50),
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  description JSON NOT NULL,
  image_url VARCHAR(255)
);

CREATE TABLE customer (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone CHAR(10) NOT NULL,
  shipping_address TEXT NOT NULL
);

CREATE TABLE `order` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  order_date DATETIME NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('Completed','Processing','Shipped') NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customer(id)
);

CREATE TABLE order_item (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES `order`(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE admin_product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  product_id INT NOT NULL,
  status ENUM('Add','Edit','Delete') NOT NULL,
  time DATETIME NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admin(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
);

-- =========================
-- DATA
-- =========================

-- ADMIN (10)
INSERT INTO admin VALUES
(1,'John','Doe','john1@mail.com','1985-01-01',NOW()),
(2,'Alice','Smith','alice2@mail.com','1990-02-02',NOW()),
(3,'Bob','Lee','bob3@mail.com','1988-03-03',NOW()),
(4,'Eva','Brown','eva4@mail.com','1992-04-04',NOW()),
(5,'Tom','White','tom5@mail.com','1987-05-05',NOW()),
(6,'Lily','Green','lily6@mail.com','1995-06-06',NOW()),
(7,'Mark','Black','mark7@mail.com','1983-07-07',NOW()),
(8,'Nina','Gray','nina8@mail.com','1991-08-08',NOW()),
(9,'Paul','Adams','paul9@mail.com','1989-09-09',NOW()),
(10,'Sara','Clark','sara10@mail.com','1993-10-10',NOW());

-- LOGIN INFO (10)
INSERT INTO login_info VALUES
(1,1,'admin0','admin0pass',NOW()),
(2,2,'admin1','admin1pass',NOW()),
(3,3,'admin2','admin2pass',NOW()),
(4,4,'admin3','admin3pass',NOW()),
(5,5,'admin4','admin4pass',NOW()),
(6,6,'admin5','admin5pass',NOW()),
(7,7,'admin6','admin6pass',NOW()),
(8,8,'admin7','admin7pass',NOW()),
(9,9,'admin8','admin8pass',NOW()),
(10,10,'admin9','admin9pass',NOW());

-- PRODUCT (20)
INSERT INTO product VALUES
(1,'iPhone 14','Apple','Phone',999,50,'{"storage":"128GB", "color":"Midnight", "display":"6.1-inch Super Retina", "chip":"A15 Bionic"}','iPhone_14_Blue_PDP_Image_Position-1A_Blue_Color_TH_550x_ljepgj.webp'),
(2,'iPhone 13','Apple','Phone',799,40,'{"storage":"128GB", "color":"Blue", "display":"6.1-inch Super Retina", "chip":"A15 Bionic"}','iPhone_13_Midnight_PDP_Position-1A_Midnight_Color__TH_550x_cxee8p.webp'),
(3,'Galaxy S23','Samsung','Phone',899,60,'{"storage":"256GB", "ram":"8GB", "display":"6.1-inch Dynamic AMOLED", "refresh_rate":"120Hz"}','galaxy-s23-revibe_gru7jo.webp'),
(4,'Galaxy A54','Samsung','Phone',499,80,'{"storage":"128GB", "battery":"5000mAh", "display":"6.4-inch Super AMOLED", "water_resistance":"IP67"}','galaxy-a54-revibe_dy6t1x.webp'),
(5,'Xiaomi 13','Xiaomi','Phone',699,70,'{"storage":"256GB", "ram":"12GB", "camera":"50MP Leica", "fast_charging":"67W"}','xiaomi13-compasia_zodymh.webp'),
(6,'Pixel 7','Google','Phone',599,55,'{"storage":"128GB", "chip":"Google Tensor G2", "camera":"50MP Octa PD", "os":"Android 13"}','pixel7-android_police_tysnis.avif'),
(7,'OnePlus 11','OnePlus','Phone',649,45,'{"storage":"256GB", "ram":"16GB", "chip":"Snapdragon 8 Gen 2", "charging":"80W SUPERVOOC"}','OnePlus11-OnePlus_jrj3zz.png'),
(8,'Oppo Find X5','Oppo','Phone',729,35,'{"storage":"256GB", "camera":"50MP Dual", "fast_charge":true, "npu":"MariSilicon X"}','OppoFindX5-Siamphone_msepgj.jpg'),
(9,'Huawei P50','Huawei','Phone',679,30,'{"storage":"256GB", "camera":"True-Chroma 50MP", "zoom":"100x Digital", "display":"6.5-inch"}','HuaweiP50-HuaweiGlobal_xdnzpz.png'),
(10,'Realme GT','Realme','Phone',499,75,'{"storage":"128GB", "gaming_mode":true, "cooling":"Stainless Steel Vapour", "refresh_rate":"120Hz"}','RealMeGT-Siamphone_o8z8fz.jpg'),
(11,'MacBook Air','Apple','Laptop',1199,25,'{"chip":"M2", "ram":"8GB", "storage":"256GB SSD", "display":"13.6-inch Liquid Retina"}','macbook-air-apple_gai2ky.jpg'),
(12,'Dell XPS','Dell','Laptop',1099,20,'{"cpu":"Intel Core i7", "ram":"16GB", "storage":"512GB SSD", "display":"13.4-inch FHD+"}','DellXPS-amazon_spxieb.jpg'),
(13,'HP Spectre','HP','Laptop',1249,15,'{"cpu":"Intel Core i7", "ram":"16GB", "touch":true, "convertible":true, "display":"4K OLED"}','HPSpectre-HP_xl3xim.jpg'),
(14,'Lenovo ThinkPad','Lenovo','Laptop',999,18,'{"cpu":"AMD Ryzen 7", "ram":"16GB", "keyboard":"Backlit", "security":"Fingerprint Reader"}','LenovoThinkPad-Lenovo_itwyyj.avif'),
(15,'Asus ROG','Asus','Laptop',1399,12,'{"gpu":"RTX 4060", "ram":"16GB", "refresh_rate":"165Hz", "storage":"1TB SSD", "gaming":true}','AsusROG-Asus_qstk7j.png'),
(16,'iPad Pro','Apple','Tablet',999,30,'{"screen":"12.9-inch", "display":"Liquid Retina XDR", "chip":"M2", "cellular":false}','IpadPro-Apple_uefzrc.jpg'),
(17,'Galaxy Tab','Samsung','Tablet',849,35,'{"screen":"11-inch", "pen_included":true, "storage":"128GB", "display":"TFT LCD"}','GalaxyTab-Samsung_qsvc9z.png'),
(18,'Sony XM5','Sony','Headphones',349,100,'{"noise_cancel":true, "battery_life":"30h", "connection":"Bluetooth 5.2", "case_included":true}','SonyXM5-Sony_ltteif.avif'),
(19,'AirPods Pro','Apple','Earbuds',249,150,'{"anc":true, "spatial_audio":true, "chip":"H2", "water_resistance":"IPX4"}','AirpodsPro-AppleSupport_fhnoxy.png'),
(20,'JBL Flip','JBL','Speaker',129,90,'{"waterproof":true, "ip_rating":"IPX7", "play_time":"12h", "output_power":"20W"}','JBLFlip6-JBLStoreThailand_fxjehs.webp');

-- CUSTOMER (10)
INSERT INTO customer VALUES
(1,'A','A','a1@mail.com','0811111111','BKK'),
(2,'B','B','b2@mail.com','0822222222','BKK'),
(3,'C','C','c3@mail.com','0833333333','BKK'),
(4,'D','D','d4@mail.com','0844444444','BKK'),
(5,'E','E','e5@mail.com','0855555555','BKK'),
(6,'F','F','f6@mail.com','0866666666','BKK'),
(7,'G','G','g7@mail.com','0877777777','BKK'),
(8,'H','H','h8@mail.com','0888888888','BKK'),
(9,'I','I','i9@mail.com','0899999999','BKK'),
(10,'J','J','j10@mail.com','0800000000','BKK');

-- ORDER (10)
INSERT INTO `order` VALUES
(1,1,NOW(),1000,'Completed'),
(2,2,NOW(),800,'Processing'),
(3,3,NOW(),600,'Shipped'),
(4,4,NOW(),900,'Completed'),
(5,5,NOW(),700,'Processing'),
(6,6,NOW(),500,'Shipped'),
(7,7,NOW(),1200,'Completed'),
(8,8,NOW(),300,'Processing'),
(9,9,NOW(),450,'Shipped'),
(10,10,NOW(),650,'Completed');

-- ORDER ITEM (10)
INSERT INTO order_item VALUES
(1,1,1,1),
(2,2,2,1),
(3,3,3,1),
(4,4,4,1),
(5,5,5,1),
(6,6,6,1),
(7,7,7,1),
(8,8,8,1),
(9,9,9,1),
(10,10,10,1);

-- ADMIN PRODUCT (10)
INSERT INTO admin_product VALUES
(1,1,1,'Add',NOW()),
(2,2,2,'Add',NOW()),
(3,3,3,'Add',NOW()),
(4,4,4,'Add',NOW()),
(5,5,5,'Add',NOW()),
(6,6,6,'Edit',NOW()),
(7,7,7,'Edit',NOW()),
(8,8,8,'Delete',NOW()),
(9,9,9,'Delete',NOW()),
(10,10,10,'Edit',NOW());

-- Create user
CREATE USER IF NOT EXISTS 'PapayaUser'@'localhost'
IDENTIFIED BY 'PapayaUser_123';

-- Set account limits (1000 queries per hour, updates, connections, etc.)
ALTER USER 'PapayaUser'@'localhost'
WITH
  MAX_QUERIES_PER_HOUR 1000
  MAX_UPDATES_PER_HOUR 1000
  MAX_CONNECTIONS_PER_HOUR 1000
  MAX_USER_CONNECTIONS 1000;

-- Grant schema privileges on sec1_gr14_database database
GRANT SELECT, INSERT, UPDATE, DELETE
ON sec1_gr14_database.*
TO 'PapayaUser'@'localhost';
 
-- Apply changes
FLUSH PRIVILEGES;