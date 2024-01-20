const pool = require('../utils/db');
const updateUserField = async (userIds, field, value) => {
    try {
      const result = await pool.query(`
        UPDATE users
        SET ${field} = $1
        WHERE id = ANY($2)
      `, [value, userIds]);
      return result;
    } catch (error) {
      console.error(`Error updating ${field} for users:`, error);
      throw error;
    }
  };
  
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    const users = result.rows;
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
  
  exports.blockUsers = async (req, res) => {
    try {
      const userIds = req.body.userIds;
      await updateUserField(userIds, 'status', 'blocked');
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  exports.unblockUsers = async (req, res) => {
    try {
      const userIds = req.body.userIds;
      await updateUserField(userIds, 'status', 'active');
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  exports.makeAdmin = async (req, res) => {
    try {
      const userIds = req.body.userIds;
      await updateUserField(userIds, 'role', 'admin');
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  exports.revokeAdmin = async (req, res) => {
    try {
      const userIds = req.body.userIds;
      await updateUserField(userIds, 'role', 'user');
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  exports.deleteUsers = async (req, res) => {
    try {
        const userIds = req.body.userIds;
        await pool.query(`
        DELETE FROM users
        WHERE id = ANY($1)
      `, [userIds]);
        res.status(200).json({ message: 'Success' });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  }