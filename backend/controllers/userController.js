const authService = require('../services/authService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

exports.changePassword = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ success: false, message: 'Old password is incorrect' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error adding likes:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
