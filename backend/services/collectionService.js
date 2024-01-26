const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const imageService = require('./imageService');

const mapFieldsToCustomObjects = (type, fieldArray) => {
  return fieldArray.map((field, index) => ({
    [`custom_${type}${index + 1}_state`]: field.trim() !== '',
    [`custom_${type}${index + 1}_name`]: field,
  }));
};

const createCustomFieldsObject = (fields) => {
  let customFieldsObject = {};

  const fieldTypes = Object.keys(fields);
  fieldTypes.forEach((type) => {
    const customObjects = mapFieldsToCustomObjects(type, fields[type]);
    customObjects.forEach((customObject) => {
      customFieldsObject = { ...customFieldsObject, ...customObject };
    });
  });

  return customFieldsObject;
};

const createCollection = async (collectionInfo, image, userId) => {
  try {
    const image_url = await imageService.createWebPImage(image);
    const customFieldsObject = createCustomFieldsObject(collectionInfo.fields);
    const createdCollection = await prisma.collections.create({
      data: {
        name: collectionInfo.name,
        description: collectionInfo.description,
        image_url,        
        category_id: parseInt(collectionInfo.category_id, 10),
        user_id: parseInt(userId, 10),
        created_at: new Date(),
        updated_at: new Date(),
        ...customFieldsObject,
      },
    });

    return createdCollection;
  } catch (error) {
    throw error;
  }
};


const getUserCollections = async (userId) => {
  try {
    const userCollections = await prisma.collections.findMany({
      where: {
        user_id: userId,
      },
      include: {
        items: true,
      }
    });
    for (const collection of userCollections) {
      if (collection.image_url) {
        collection.image_url = await imageService.getImageUrl(collection.image_url);
      }
    }
    return userCollections;
  } catch (error) {
    throw error;
  }
};


const getCollectionById = async (collectionId) => {
  try {
    const collection = await prisma.collections.findUnique({
      where: {
        id: parseInt(collectionId,10)
      }
    });
    if (collection.image_url) {
      const imageUrl = await imageService.getImageUrl(collection.image_url);
      collection.image_url = imageUrl;
    }
    return collection;
  } catch (error) {
    throw error;
  }
};

const deleteCollection = async (collectionId) => {
  try {
    prisma.collections.delete({
      where: {id: collectionId}
    })
  } catch (error) {
    throw error;
  }
};


const updateCollection = async (collectionId, name, description, category_id, image, fields) => {
  try {
    const customFieldsObject = createCustomFieldsObject(fields);
    let image_url
    const areFileNamesEqual = await imageService.areFileNamesEqual(image.originalname, collectionId);
    if (!areFileNamesEqual) {
      image_url = await imageService.createWebPImage(image);
    }

    const updateData = {
      name,
      description,
      category_id: parseInt(category_id, 10),
      updated_at: new Date(),
      ...customFieldsObject,
    };
    await prisma.collections.update({
      where: {
        id: collectionId,
      },
      data: image_url ? { ...updateData, image_url } : updateData,
    });
  } catch (error) {
    throw error;
  }
};

const getBiggestCollections = async () => {
  try {
    const topCollections = await prisma.collections.findMany({
      orderBy: {
        items: {
          _count: 'desc',
        },
      },
      take: 5, 
      select: {
        id: true,
        name: true,
        image_url: true,
        users: {
          select: {
            username: true,
          },
        },
        items: {
          select: {
            id: true,
          },
        },
      },
    });
    for (const collection of topCollections) {
      if (collection.image_url) {
        const imageUrl =  await imageService.getImageUrl(collection.image_url);
        collection.image_url = imageUrl;
      }
    }
    const formattedTopCollections = topCollections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      username: collection.users.username,
      itemCount: collection.items.length,
      image_url: collection.image_url
    }));
    return formattedTopCollections;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createCollection,
  getUserCollections,
  getCollectionById,
  deleteCollection,
  updateCollection,
  getBiggestCollections,
};
