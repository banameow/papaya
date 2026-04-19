-- =========================
-- FULL SETUP (DDL + DML)
-- =========================

DROP DATABASE IF EXISTS papaya;
CREATE DATABASE papaya;
USE papaya;

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
(1,1,'user1','pass',NOW()),
(2,2,'user2','pass',NOW()),
(3,3,'user3','pass',NOW()),
(4,4,'user4','pass',NOW()),
(5,5,'user5','pass',NOW()),
(6,6,'user6','pass',NOW()),
(7,7,'user7','pass',NOW()),
(8,8,'user8','pass',NOW()),
(9,9,'user9','pass',NOW()),
(10,10,'user10','pass',NOW());

-- PRODUCT (20)
INSERT INTO product VALUES
(1,'iPhone 14','Apple','Phone',999,50,'{"storage":"128GB"}','1.jpg'),
(2,'iPhone 13','Apple','Phone',799,40,'{"storage":"128GB"}','1.jpg'),
(3,'Galaxy S23','Samsung','Phone',899,60,'{"storage":"256GB"}','1.jpg'),
(4,'Galaxy A54','Samsung','Phone',499,80,'{"battery":"5000"}','1.jpg'),
(5,'Xiaomi 13','Xiaomi','Phone',699,70,'{"color":"green"}','1.jpg'),
(6,'Pixel 7','Google','Phone',599,55,'{"camera":"50MP"}','1.jpg'),
(7,'OnePlus 11','OnePlus','Phone',649,45,'{"ram":"16GB"}','1.jpg'),
(8,'Oppo Find X5','Oppo','Phone',729,35,'{"fast_charge":true}','1.jpg'),
(9,'Huawei P50','Huawei','Phone',679,30,'{"camera":"Leica"}','1.jpg'),
(10,'Realme GT','Realme','Phone',499,75,'{"gaming":true}','1.jpg'),

(11,'MacBook Air','Apple','Laptop',1199,25,'{"chip":"M2"}','1.jpg'),
(12,'Dell XPS','Dell','Laptop',1099,20,'{"ram":"16GB"}','1.jpg'),
(13,'HP Spectre','HP','Laptop',1249,15,'{"touch":true}','1.jpg'),
(14,'Lenovo ThinkPad','Lenovo','Laptop',999,18,'{"business":true}','1.jpg'),
(15,'Asus ROG','Asus','Laptop',1399,12,'{"gaming":true}','1.jpg'),

(16,'iPad Pro','Apple','Tablet',999,30,'{"screen":"12.9"}','1.jpg'),
(17,'Galaxy Tab','Samsung','Tablet',849,35,'{"pen":true}','1.jpg'),
(18,'Sony XM5','Sony','Headphones',349,100,'{"noise_cancel":true}','1.jpg'),
(19,'AirPods Pro','Apple','Earbuds',249,150,'{"anc":true}','1.jpg'),
(20,'JBL Flip','JBL','Speaker',129,90,'{"waterproof":true}','1.jpg');

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

-- Grant schema privileges on papaya database
GRANT SELECT, INSERT, UPDATE, DELETE
ON papaya.*
TO 'PapayaUser'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;