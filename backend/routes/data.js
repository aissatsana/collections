const express = require('express');
const router = express.Router();
const pool = require('../utils/db');

router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM categories');
    const categories = result.rows;
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
