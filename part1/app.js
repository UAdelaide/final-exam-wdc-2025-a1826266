const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 8080;
const config = {
    host: 'localhost',
    user: 'root',
    database: 'DogWalkService'
};
async function datainsert(connection) {
try{
    await connection.query('')
    INSERT INTO Users (username, email, password_hash, role) VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner'), ('bobwalker', 'bob@example.com', 'hashed456', 'walker'), ('carol123', 'carol@example.com', 'hashed101', 'owner'), ('dogwalk', 'dogwalk@example.com', 'hashed202', 'walker'), ('adam1', 'adam@example.com', 'hashed111', 'walker');
}
}