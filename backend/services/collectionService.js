//const pool = require('../utils/db');
//const { storage, bucket } = require('../utils/storage');  
const { Storage } = require('@google-cloud/storage');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const storage = new Storage({
  projectId: 'my-collection-410422',
  keyFilename: 'keyfile.json',
});

const bucketName = 'my-collection-app';
const bucket = storage.bucket(bucketName);

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

const createCollection = async (collectionInfo, userId) => {
  console.log(collectionInfo);
  try {
    const customFieldsObject = createCustomFieldsObject(collectionInfo.fields);
    const createdCollection = await prisma.collections.create({
      data: {
        name: collectionInfo.name,
        description: collectionInfo.description,
        image_url: collectionInfo.image_url,        
        category_id: collectionInfo.category_id,
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



function uploadImage(fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    const file = bucket.file(`images/${fileName}`);
    const stream = file.createWriteStream({
      metadata: {
        contentType: getContentType(fileName),
      },
    });

    stream.on('error', (err) => {
      console.error('Error uploading image:', err);
      reject({ error: 'Error uploading image', details: err });
    });

    stream.on('finish', () => {
      resolve(`${file.name}`);
    });

    stream.end(fileBuffer);
  });
}

function getContentType(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream'; 
  }
}

const getUserCollections = async (userId) => {
  try {
    const userCollections = await prisma.collections.findMany({
      where: {
        user_id: userId,
      },
    });
    for (const collection of userCollections) {
      if (collection.image_url) {
        const imageUrl =  await getImageUrl(collection.image_url);
        collection.image_url = imageUrl;
      }
    }
    return userCollections;
  } catch (error) {
    throw error;
  }
};

async function getImageUrl(fileName) {
  try {
    const options = {
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, 
    };
    const [signedUrl] = await bucket.file(`${fileName}`).getSignedUrl(options);
    return signedUrl;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
}

const getCollectionById = async (collectionId) => {
  try {
    const collection = prisma.collections.findUnique({
      where: {
        id: parseInt(collectionId,10)
      }
    })
    if (collection.image_url) {
      const imageUrl = await getImageUrl(collection.image_url);
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

const updateCollection = async (collectionId, name, description, category_id, image_url, fields) => {
  try {
    const customFieldsObject = createCustomFieldsObject(fields);
    await prisma.collections.update({
      where: {
        id: collectionId,
      },
      data: {
        name,
        description,
        category_id,
        image_url,
        updated_at: new Date(),
        ...customFieldsObject,
      },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCollection,
  uploadImage,
  getUserCollections,
  getCollectionById,
  deleteCollection,
  updateCollection,
};
