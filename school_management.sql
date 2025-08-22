CREATE DATABASE school_management;
USE school_management;

CREATE TABLE schools (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
)
SELECT * FROM schools;

