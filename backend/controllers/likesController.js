const authService = require('../services/authService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.manageLike = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const itemId = parseInt(req.params.itemId, 10);
    const { isLiked } = req.body;
    if (isLiked) {
      await prisma.likes.deleteMany({
        where: {
          item_id: itemId,
          user_id: userId,
        },
      });
    } else {
      await prisma.likes.create({
        data: {
          item_id: itemId,
          user_id: userId,
        },
      });
    }
    res.status(200).json({ success: true, message: 'Likes added successfully' });
  } catch (error) {
    console.error('Error adding likes:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
