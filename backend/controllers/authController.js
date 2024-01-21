const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const authService = require('../services/authService');

const prisma = new PrismaClient();

const register =  async (req, res) => {
    const { username, email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.users.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      const token = authService.generateToken(user);
      authService.saveTokenToDatabase(user.id, token);
      res.json({ userId: user.id, token, username: user.username });
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
        const user = await prisma.users.findUnique({
          where: { email },
        });
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

      const token = authService.generateToken(user);
      authService.saveTokenToDatabase(user.id, token);
      res.json({ userId: user.id, token, username: user.username });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const isAuthenticated = (req, res) => {
    const token = req.headers.authorization;
    return authService.isAuthenticated(token);
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = authService.getUserId(token); 
    await prisma.tokens.deleteMany({
      where: { user_id: userId, token },
    });
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