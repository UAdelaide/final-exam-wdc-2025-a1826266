const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 8080;
const config = {
    host: 'localhost',
    user: 'root',
    database: 'DogWalkService'
};
async function datainsert(connection) {
try{
    await connection.query(`INSERT INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed101', 'owner'),
        ('dogwalk', 'dogwalk@example.com', 'hashed202', 'walker'),
        ('adam1', 'adam@example.com', 'hashed111', 'walker');`);
    await connection.query(`INSERT INTO Dogs (owner_id, name, size) VALUES
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'bobwalker'), 'Ben', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'dogwalk'), 'Chris', 'small'),
        ((SELECT user_id FROM Users WHERE username = 'adam1'), 'Lorry', 'large');`);
    await connection.query(`INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
        ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Ben'), '2025-07-10 10:00:00', 60, 'Wetlands', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Chris'), '2025-08-10 11:30:00', 90, 'Sanctuary', 'accepted'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Lorry'), '2025-08-10 08:15:00', 120, 'Pet Place', 'open');`);

} catch (err){
    console.error('Error data', err);
}
}
async function main() {
    try{
    const connection = await mysql.createConnection(config);
    await datainsert(connection);
    app.get('/api/dogs', async (req, res)=> {
        try{
            const[rows] = await connection.query('SELECT * FROM Dogs;');
            res.json(rows);
        }
        catch(err){
            res.status(500).json('failed dogs');
        }
    });
    app.get('/api/walkrequests/open', async (req, res)=> {
        try{
            const[rows] = await connection.query("SELECT * FROM WalkRequests WHERE status = 'open';");
            res.json(rows);
        }
        catch(err){
            res.status(500).json('failed requests');
        }
    });
    app.get('/api/walkers/summary', async (req, res)=>{
        try{
            const[rows] = await connection.query(`SELECT Users.user_id AS walker_id, Users.username, Users.email,
                COUNT(WalkApplications.request_id) AS total, AVG(WalkRatings.rating) AS averagerate
                FROM Users LEFT JOIN WalkApplications ON Users.user_id = WalkApplications.walker_id
                LEFT JOIN WalkRatings ON Users.user_id = WalkRatings.walker_id
                WHERE Users.role = 'walker' GROUP BY Users.user_id, Users.username, Users.email;`);
                res.json(rows);
        }
        catch(err){
            res.status(500).json('failed summary');
        }
    });
    app.listen(port, () => {
        console.log(`listening on ${port}`);
    });
} catch(err){
    console.error('Error with DB');
}
}
main();