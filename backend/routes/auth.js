const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
//const jwt = require('jsonwebtoken');

const router = express.Router();
const pool = new Pool({
    user: 'collections_postgre_user',
    host: 'dpg-cma4n2un7f5s73b4gbt0-a.frankfurt-postgres.render.com',
    database: 'collections_postgre',
    password: 'pyCOxAXEBcZG4grneK1ogn5tZqo9oQD9',
    port: 5432,
    ssl: true,
});

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const client = await pool.connect();
      const result = await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
      client.end();
      res.json(result.rows[0]);
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'unique_email') {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        //const token = jwt.sign({ userId: user.id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
        //res.json({ token });
        res.json({ message: 'Успешный вход' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  

module.exports = router;
