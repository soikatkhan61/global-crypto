CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userType ENUM('admin','user','moderator') DEFAULT "user",
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isVerified int(1) DEFAULT 0,
    verfication_id int(8) DEFAULT -1,
    profilePics varchar(200) DEFAULT "/uploads/soikat.jpg",
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name varchar(100) not null,
    slug VARCHAR(100) NOT NULL ,
    category VARCHAR(100) NOT NULL ,
    old_price int(6) NOT NULL,
    new_price int(6) NOT NULL,
    product_desc VARCHAR(500),
    product_image VARCHAR(500) not null,
    total_sales int(6) not null DEFAULT 0,
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);


CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name varchar(100) not null,
    address VARCHAR(500) NOT NULL ,
    email VARCHAR(255) NOT NULL ,
    phone VARCHAR(15) NOT NULL,
    message VARCHAR(500),
    product_name VARCHAR(500) not null,
    product_id int(6) not null,
    product_price int (6) not null,
    delivery_charge int(4) not null,
    total_amount int(6) not null,
    statuss enum('success','failed','pending') DEFAULT "pending",
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

create table IF NOT EXISTS categories (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	category VARCHAR(30) NOT NULL,
	products int(6) NOT NULL,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);