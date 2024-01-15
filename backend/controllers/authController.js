const bcrypt = require('bcrypt');
const pool = require('../ utils/db');
const authService = require('../services/authService');

const register =  async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const client = await pool.connect();
      const result = await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
      client.end();
      const user = result.rows[0];
      const token = authService.generateToken(user);
      authService.saveTokenToDatabase(user.id, token);
      res.json({ token });
    } catch (error) {
      if (error.code === '23505' && error.constraint === 'unique_email') {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

const login =  async (req, res) => {
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

      const token = authService.generateToken(user);
      authService.saveTokenToDatabase(user.id, token);
      res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const isAuthenticated = (req, res) => {
    return authService.isAuthenticated();
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization;
    console.log(token);
    const userId = authService.getUserId(token); 
    const deleteQuery = 'DELETE FROM tokens WHERE user_id = $1 AND token = $2';
    await pool.query(deleteQuery, [userId, token]);
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Error logout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports = {
    register,
    login,
    isAuthenticated,
    logout
};