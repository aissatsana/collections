const jwt = require('jsonwebtoken');
const pool = require('../utils/db')

const secretKey = 'key';
const getUserId = (token) => {
    try {
      if (!token) {
        return null; 
      }
      const decodedToken = jwt.verify(token, secretKey);
      return decodedToken.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
};

const generateToken = (user) => {
    const payload = { id: user.id};
    const options = { expiresIn: '7d' };
    return jwt.sign(payload, secretKey, options);
};

const isAuthenticated = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return false;
    }
    try {
        const decodedToken = jwt.verify(token, secretKey);
        const isValidToken = await isValidTokenInDatabase(decodedToken.id, token);
        return isValidToken;
    } catch (err) {
        return false;
    }
};

const saveTokenToDatabase = async (userId, token) => {
    try {
      const client = await pool.connect();
      await client.query('INSERT INTO tokens (user_id, token) VALUES ($1, $2)', [userId, token]);
      client.release();
    } catch (error) {
      console.error('Error saving token to database:', error);
      throw error;
    }
};

const isValidTokenInDatabase = async (userId, token) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM tokens WHERE user_id = $1 AND token = $2', [userId, token]);
      client.release();
      if (result.rows.length > 0) return true;
    } catch (error) {
      console.error('Error checking token in database:', error);
      throw error;
    }
};


module.exports = {
    getUserId,
    generateToken,
    isAuthenticated,
    saveTokenToDatabase,
    isValidTokenInDatabase, 
};