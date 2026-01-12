
-- Schema for Hair Doc backend
-- Run this on your MySQL server (phpMyAdmin or mysql CLI) to create the required tables.
-- Uses utf8mb4 and InnoDB.

SET FOREIGN_KEY_CHECKS = 0;

-- CREATE DATABASE IF NOT EXISTS `hairdoc_db` DEFAULT CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_unicode_ci';
-- USE `hairdoc_db`;
-- NOTE: The CREATE DATABASE / USE statements are commented out so you can import
-- this file into an existing database created in cPanel/phpMyAdmin. Create the
-- database in cPanel first, then import this file while that database is selected.

-- Users table (admins and clients)
CREATE TABLE IF NOT EXISTS `users` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(191) NOT NULL,
	`email` VARCHAR(191) NOT NULL UNIQUE,
	`username` VARCHAR(100) NOT NULL UNIQUE,
	`password_hash` VARCHAR(255) NOT NULL,
	`role` VARCHAR(50) DEFAULT 'Client',
	`avatar_url` VARCHAR(512) DEFAULT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	`reset_password_token` VARCHAR(255) DEFAULT NULL,
	`reset_password_expires` BIGINT DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products
CREATE TABLE IF NOT EXISTS `products` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`category` VARCHAR(100) DEFAULT NULL,
	`name` VARCHAR(191) NOT NULL,
	`description` TEXT,
	`price` DECIMAL(10,2) DEFAULT 0.00,
	`stock` INT DEFAULT 0,
	`image_url` VARCHAR(512) DEFAULT NULL,
	`alt_text` VARCHAR(255) DEFAULT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Services
CREATE TABLE IF NOT EXISTS `services` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`category` VARCHAR(100) DEFAULT NULL,
	`name` VARCHAR(191) NOT NULL,
	`description` TEXT,
	`duration` VARCHAR(50) DEFAULT NULL,
	`price` DECIMAL(10,2) DEFAULT 0.00,
	`image_url` VARCHAR(512) DEFAULT NULL,
	`alt_text` VARCHAR(255) DEFAULT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Courses
CREATE TABLE IF NOT EXISTS `courses` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`category` VARCHAR(100) DEFAULT NULL,
	`title` VARCHAR(191) NOT NULL,
	`description` TEXT,
	`duration` VARCHAR(50) DEFAULT NULL,
	`price` DECIMAL(10,2) DEFAULT 0.00,
	`prerequisites` TEXT DEFAULT NULL,
	`image_url` VARCHAR(512) DEFAULT NULL,
	`alt_text` VARCHAR(255) DEFAULT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings
CREATE TABLE IF NOT EXISTS `bookings` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`client_name` VARCHAR(191) NOT NULL,
	`client_email` VARCHAR(191) DEFAULT NULL,
	`client_phone` VARCHAR(50) DEFAULT NULL,
	`service_name` VARCHAR(191) DEFAULT NULL,
	`staff_name` VARCHAR(191) DEFAULT NULL,
	`booking_date` DATE DEFAULT NULL,
	`booking_time` VARCHAR(50) DEFAULT NULL,
	`status` VARCHAR(50) DEFAULT 'Pending',
	`price` DECIMAL(10,2) DEFAULT 0.00,
	`duration` VARCHAR(50) DEFAULT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Enrollments
CREATE TABLE IF NOT EXISTS `enrollments` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(191) NOT NULL,
	`email` VARCHAR(191) DEFAULT NULL,
	`phone` VARCHAR(50) DEFAULT NULL,
	`course_title` VARCHAR(191) DEFAULT NULL,
	`submitted_date` DATE DEFAULT NULL,
	`status` VARCHAR(50) DEFAULT 'Pending',
	`avatar_url` VARCHAR(512) DEFAULT NULL,
	`alt_text` VARCHAR(255) DEFAULT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Gallery
CREATE TABLE IF NOT EXISTS `gallery` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`category` VARCHAR(100) DEFAULT NULL,
	`caption` VARCHAR(255) DEFAULT NULL,
	`image_url` VARCHAR(512) DEFAULT NULL,
	`alt_text` VARCHAR(255) DEFAULT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Settings (single-row table stored at id=1)
CREATE TABLE IF NOT EXISTS `settings` (
	`id` TINYINT UNSIGNED NOT NULL DEFAULT 1,
	`salon_name` VARCHAR(191) DEFAULT NULL,
	`logo_url` VARCHAR(512) DEFAULT NULL,
	`favicon_url` VARCHAR(512) DEFAULT NULL,
	`maintenance_mode` TINYINT(1) DEFAULT 0,
	`primary_phone` VARCHAR(50) DEFAULT NULL,
	`booking_email` VARCHAR(191) DEFAULT NULL,
	`address` TEXT DEFAULT NULL,
	`social_instagram` VARCHAR(255) DEFAULT NULL,
	`social_twitter` VARCHAR(255) DEFAULT NULL,
	`social_facebook` VARCHAR(255) DEFAULT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders (order id is a string like #HD-xxxx)
CREATE TABLE IF NOT EXISTS `orders` (
	`id` VARCHAR(50) NOT NULL,
	`client_name` VARCHAR(191) DEFAULT NULL,
	`order_date` DATE DEFAULT NULL,
	`status` VARCHAR(50) DEFAULT 'Pending',
	`total` DECIMAL(12,2) DEFAULT 0.00,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- Optional: insert default settings row if none exists
INSERT INTO `settings` (`id`, `salon_name`) SELECT 1, 'Hair Doc' FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `id` = 1);

-- End of schema
