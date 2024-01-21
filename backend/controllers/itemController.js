const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authService = require('../services/authService');

exports.getItems = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const items = await prisma.items.findMany({
      where: {
        collection_id: parseInt(collectionId,10),
      },
      include: {
        _count: {
          select: { likes: true },
        },
        comments: {
          select: { id: true },
        },
      },
    });
    res.status(200).json({ items });
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



exports.getItemById = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const itemId = parseInt(req.params.itemId, 10);
    const item = await prisma.items.findUnique({
      where: {
        id: itemId,
      },
    });
    const fields = await prisma.items_custom_fields.findMany({
      where: {
        item_id: itemId,
      },
    });
    if (userId) {
    const likesCount = await prisma.likes.count({
      where: {
        item_id: itemId,
      },
    });
    const isUserLiked = await prisma.likes.findFirst({
      where: {
        item_id: itemId,
        user_id: userId,
      },
    });
    const likes = {
      count: likesCount,
      isUserLiked: !!isUserLiked
    }
    const comments = await prisma.comments.findMany({
      where: {
        item_id: itemId,
      },
      include: {
        users: {
          select: {
            username: true,
          },
        },
      },
    });
    const formatedComments = comments.map(comment => {
      const { users, ...rest } = comment;  
      return {
        ...rest, 
        username: comment.users.username,
      };
    });
    res.status(200).json({item, fields, likes, comments: formatedComments});
  }
  res.status(200).json({item, fields});
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.editItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    const { name, fieldValues, tags } = req.body;
    await prisma.items.update({
      where: {
        id: itemId,
      },
      data: {
        name,
        updated_at: new Date(),
      },
    });

    const customFieldsPromises = Object.entries(fieldValues).map(([fieldName, fieldInfo]) => {
      const { type, name, value } = fieldInfo;
      return prisma.items_custom_fields.upsert({
        where: {
          item_id_field_name: {
            item_id: itemId,
            field_name: fieldName,
          },
        },
        update: {
          field_type: type,
          field_value: value,
        },
        create: {
          item_id: itemId,
          field_type: type,
          field_name: fieldName,
          field_value: value,
        },
      });
    });
    await Promise.all(customFieldsPromises);

    res.status(200).json({ success: true, message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId, 10);
    await prisma.items.delete({
      where: {
        id: itemId,
      },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const collectionId = parseInt(req.params.collectionId, 10);
    const {name, fieldValues, tags} = req.body;
    console.log(name, collectionId);
    const createdItem = await prisma.items.create({
      data: {
        name,    
        collection_id: collectionId 
      },
    });
    const itemId = createdItem.id;
    const customFieldsPromises = Object.entries(fieldValues).map(([fieldName, fieldInfo]) => {
      const { type, name, value } = fieldInfo;
      const fieldValue = value !== undefined ? value.toString() : null;
      return prisma.items_custom_fields.create({
        data: {
          item_id: itemId,
          field_type: type,
          field_name: name,
          field_value: fieldValue,
        },
      });
    });
    await Promise.all(customFieldsPromises);
    res.status(200).json({ success: true, message: 'Item created successfully' });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await prisma.tags.findMany();
    res.status(200).json({ tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
