const express = require('express');
const router = express.Router();
const db = require('../models/db');
// Router get to find the dogs that correspond to the logged in ID
router.get('/:ownerId/dogs', async (req, res)=>{
  // Extracts ownerID
  const ownerId = req.params.ownerId;
  try{
    // Database query to find the dogs
    const[rows] = await db.query(`SELECT dog_id, name FROM Dogs WHERE owner_id=?`, [ownerId]);
    // Send with json
    res.json(rows);
  }
  // Catch errors
  catch(err){
    res.status(500).json({error: 'failed'});
  }
})
// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// POST login (dummy version)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
// Changed from input receiving email to it recieving a username instead
  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});
// Router to get dog information
router.get('/dogs', async(req, res)=>{
  // Query database for all dog information
  try{
    const[rows] = await db.query('SELECT * FROM Dogs');
    res.json(rows);
  }
  // Catches errors
  catch(err){
    res.status(500).json({error: 'Failed'});
  }
});
module.exports = router;