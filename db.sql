CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userType ENUM('admin','user','moderator') DEFAULT "user",
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isVerified int(1) DEFAULT 0,
    verfication_id int(8) DEFAULT -1,
    profilePics varchar(200) DEFAULT "/uploads/avater.jpg",
    balance double(8,2) DEFAULT 0,
    pending_balance double(8,2) DEFAULT 5,
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    package_name  ENUM("silver","gold","platinum") not null,
    price int(6) NOT NULL ,
    package_comission int(6) NOT NULL ,
    total_subscriber int(6) NOT NULL,
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

INSERT INTO `packages`(`id`, `package_name`, `price`, `package_comission`, `total_subscriber`, `createdAt`) VALUES (null,'silver',1000,2,0,null);
INSERT INTO `packages`(`id`, `package_name`, `price`, `package_comission`, `total_subscriber`, `createdAt`) VALUES (null,'gold',5000,3,0,null);
INSERT INTO `packages`(`id`, `package_name`, `price`, `package_comission`, `total_subscriber`, `createdAt`) VALUES (null,'platinum',30000,5,0,null);


CREATE TABLE IF NOT EXISTS task (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id int, FOREIGN KEY(user_id) REFERENCES users(id),
    pkg_id int, FOREIGN KEY(pkg_id) REFERENCES packages(id),
    remain_task int(2) DEFAULT 10,
    todays_comission double(8,2) DEFAULT 0,
    yesterday double(8,2) DEFAULT 0,
    updatedAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS pkg_subscriber (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pkg_id  int, FOREIGN KEY(pkg_id) REFERENCES packages(id),
    user_id int ,FOREIGN KEY(user_id) REFERENCES users(id),
    approval_status int (1) DEFAULT 0,
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS pkg_payment(
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id int ,FOREIGN KEY(user_id) REFERENCES users(id),
    pkg_sub_id  int, FOREIGN KEY(pkg_sub_id) REFERENCES pkg_subscriber(id),
    pkg_id  int, FOREIGN KEY(pkg_id) REFERENCES packages(id),
	payment_method ENUM("Bkash","Nagad","Rocket","Others"),
    payment_number varchar(15) not null,
    transaction_number varchar(50) not null,
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updatedAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS mlm (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id int , FOREIGN key(user_id) REFERENCES users(id),
    isRef int(1) DEFAULT 0,
    refBy varchar(100), FOREIGN KEY(refBy) REFERENCES users(username),
    ref_by_id int, FOREIGN KEY(ref_by_id) REFERENCES users(id),
    updatedAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);


CREATE TABLE IF NOT EXISTS withdraw (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id int , FOREIGN key(user_id) REFERENCES users(id),
    amount int(6) not null,
    method varchar(20) not null,
    number varchar(20) not null,
    statuss enum("paid","pending") DEFAULT "pending",
    updatedAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    createdAt TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

