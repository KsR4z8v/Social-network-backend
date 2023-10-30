CREATE DATABASE snapwire;

use snapwire;



CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    apellido VARCHAR(200) NOT NULL,
    contrasena VARCHAR(200) NOT NULL,
    avatar VARCHAR(200) DEFAULT NULL,
    fecha_creacion DATE NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    username VARCHAR(200) NOT NULL,
    estado VARCHAR(200) NOT NULL,
    
    PRIMARY KEY (id_usuario)
);