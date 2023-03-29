CREATE DATABASE
    IF NOT EXISTS `restaurantes` DEFAULT CHARACTER SET utf8_general_ci;

USE `restaurantes`;

CREATE TABLE
    clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rut VARCHAR(20) NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        email VARCHAR(50) NOT NULL,
        direccion VARCHAR(100) NOT NULL
    );

CREATE TABLE
    restaurant (
        id INT PRIMARY KEY AUTO_INCREMENT,
        rut VARCHAR(20) NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        email VARCHAR(50) NOT NULL,
        direccion VARCHAR(50) NOT NULL
    );

CREATE TABLE
    platillos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(50) NOT NULL,
        descripcion VARCHAR(100) NOT NULL,
        precio INT NOT NULL
    );

CREATE TABLE
    pedidos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        cliente_id INT NOT NULL,
        restaurant_id INT NOT NULL,
        fecha_pedido DATETIME NOT NULL,
        total INT NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (restaurant_id) REFERENCES restaurant(id)
    );

CREATE TABLE
    detalles_pedidos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        pedido_id INT NOT NULL,
        platillo_id INT NOT NULL,
        cantidad INT NOT NULL,
        precio INT NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
        FOREIGN KEY (platillo_id) REFERENCES platillos(id)
    );