CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userType ENUM('admin','user','moderator') DEFAULT "user",
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isVerified int(1) DEFAULT 0,
    verfication_id int(8) DEFAULT -1,
    profilePics varchar(200) DEFAULT "/uploads/soikat.jpg",
    balance int(7) DEFAULT 500;
    isRef int(1) DEFAULT 0;
    refBy int DEFAULT null,
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

--insert data into packages
INSERT INTO `packages`(`id`, `package_name`, `price`, `package_comission`, `total_subscriber`, `createdAt`) VALUES (null,'silver',1000,2,0,null);
INSERT INTO `packages`(`id`, `package_name`, `price`, `package_comission`, `total_subscriber`, `createdAt`) VALUES (null,'gold',5000,3,0,null);
INSERT INTO `packages`(`id`, `package_name`, `price`, `package_comission`, `total_subscriber`, `createdAt`) VALUES (null,'platinum',30000,5,0,null);


CREATE TABLE IF NOT EXISTS task (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id int, FOREIGN KEY(user_id) REFERENCES users(id),
    pkg_id int, FOREIGN KEY(pkg_id) REFERENCES packages(id),
    remain_task int(2) DEFAULT 10,
    todays_comission int(3) DEFAULT 0,
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