const pool = require('../utils/db');
const authService = require('../services/authService');

exports.manageComments = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const itemId = req.params.itemId;
    const currentDate = new Date();
    const { content } = req.body;
    const result = pool.query('INSERT INTO comments (item_id, user_id, content, created_at) VALUES ($1, $2, $3, $4)', [itemId, userId, content, currentDate]);
    res.status(200).json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding likes:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
