const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authService = require('../services/authService');

exports.manageComments = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const itemId = parseInt(req.params.itemId,10);
    const { content } = req.body;
    await prisma.comments.create({
      data: {
        item_id: itemId,
        user_id: userId,
        content,
        created_at: new Date(),
      },
    });
    res.status(200).json({ success: true, message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding likes:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
