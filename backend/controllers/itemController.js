const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authService = require('../services/authService');

exports.getItems = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    // const items = await prisma.items.findMany({
    //   where: {
    //     collection_id: parseInt(collectionId,10),
    //   },
    //   include: {
    //     _count: {
    //       select: { likes: true },
    //     },
    //     comments: {
    //       select: { id: true },
    //     },
    //   },
    // });
    const items = await prisma.items.findMany({
      where: {
        collection_id: parseInt(collectionId, 10),
      },
      include: {
        _count: {
          select: { likes: true },
        },
        comments: {
          select: { id: true },
        },
        items_custom_fields: {
          where: {
            field_type: {
              in: ['string', 'int'],
            },
          },
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
   
    const tagsData = await prisma.itemtags.findMany({
      where: {
        item_id: itemId,
      },
      include: {
        tag: true,
      },
    });
    
    const tags = tagsData.map((tagData) => tagData.tag.name);
    
    const item = await prisma.items.findUnique({
      where: {
        id: itemId,
      },
    });
    
    const updatedItem = { ...item, tags };
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
    return res.status(200).json({item: updatedItem, fields, likes, comments: formatedComments});
  }
  res.status(200).json({item: updatedItem, fields});
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

    await prisma.itemtags.deleteMany({
      where: {
        item_id: itemId,
      },
    });

    
    const tagPromises = tags.map(async (tagName) => {
      const existingTag = await prisma.tags.findUnique({
        where: { name: tagName },
      });

      if (!existingTag) {
        return prisma.tags.create({
          data: {
            name: tagName,
          },
        });
      }

      return existingTag;
    });

    const createdTags = await Promise.all(tagPromises);
    const itemTagsPromises = createdTags.map(async (tag) => {
      return prisma.itemtags.upsert({
        where: {
          item_id_tag_id: {
            item_id: itemId,
            tag_id: tag.id,
          },
        },
        update: {},
        create: {
          item_id: itemId,
          tag_id: tag.id,
        },
      });
    });

    await Promise.all([...customFieldsPromises, ...itemTagsPromises]);
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
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const collectionId = parseInt(req.params.collectionId, 10);
    const {name, fieldValues, tags} = req.body;
    const createdItem = await prisma.items.create({
      data: {
        name,    
        collection_id: collectionId,
        user_id: userId,
      },
    });
    const itemId = createdItem.id;
    const tagPromises = tags.map(async (tagName) => {
      const existingTag = await prisma.tags.findUnique({
        where: { name: tagName },
      });

      if (!existingTag) {
        return prisma.tags.create({
          data: {
            name: tagName,
          },
        });
      }

      return existingTag;
    });
    const createdTags = await Promise.all(tagPromises);
    const itemTagsPromises = createdTags.map(async (tag) => {
      return prisma.itemtags.create({
        data: {
          item_id: itemId,
          tag_id: tag.id,
        },
      });
    });

    await Promise.all(itemTagsPromises);
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

exports.getLastAdded = async (req, res) => {
  try {
    const latestItems = await prisma.items.findMany({
      take: 5, 
      orderBy: {
        created_at: 'desc', 
      },
      select: {
        id: true,
        name: true,
        created_at: true,
        collections: {
          select: {
            name: true,
            id: true,
          },
        },
        users: {
          select: {
            username: true,
          },
        },
      },
    });
    res.status(200).json({ latestItems });
    
  } catch (error) {
    console.error('Error fetching items: ', error)
  }
}