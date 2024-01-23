const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updateUserField = async (userIds, field, value) => {
    try {
      await prisma.users.updateMany({
        where: {
          id: {
            in: userIds,
          },
        },
        data: {
          [field]: value,
        },
      });
      return { success: true, message: 'Success' };
    } catch (error) {
      console.error(`Error updating ${field} for users:`, error);
      throw error;
    }
  };
  
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany();
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
      await updateUserField(userIds, 'isAdmin', true);
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  exports.revokeAdmin = async (req, res) => {
    try {
      const userIds = req.body.userIds;
      await updateUserField(userIds, 'isAdmin', false);
      res.status(200).json({ message: 'Success' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  exports.deleteUsers = async (req, res) => {
    try {
        const userIds = req.body.userIds;
        await prisma.users.deleteMany({
          where: {
            id: {
              in: userIds,
            },
          },
        });
        res.status(200).json({ message: 'Success' });
      } catch (error) {
        console.error('Error deleting users:', error); 
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
  }