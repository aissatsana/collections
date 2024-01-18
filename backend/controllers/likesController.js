const pool = require('../utils/db');
const authService = require('../services/authService');

exports.manageLike = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const itemId = req.params.itemId;
    const { isLiked } = req.body;
    if (isLiked) {
        await pool.query('DELETE FROM likes WHERE item_id = $1 AND user_id = $2', [itemId, userId]);
      } else {
        await pool.query(
          'INSERT INTO likes (item_id, user_id) VALUES ($1, $2)',
          [itemId, userId]
        );
      }
    res.status(200).json({ success: true, message: 'Likes added successfully' });
  } catch (error) {
    console.error('Error adding likes:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
