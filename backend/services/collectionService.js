const pool = require('../utils/db');
//const { storage, bucket } = require('../utils/storage');  
const { Storage } = require('@google-cloud/storage');

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
  try {
    const customFieldsObject = createCustomFieldsObject(collectionInfo.fields);
    const currentDate = new Date();
    const query = `
      INSERT INTO collections (name, description, image_url, user_id, category_id, created_at, updated_at, ${Object.keys(customFieldsObject).join(', ')})
      VALUES ($1, $2, $3, $4, $5, $6, $7, ${Object.values(customFieldsObject).map((_, i) => `$${i + 8}`).join(', ')})
      RETURNING *;
    `;

    const values = [
      collectionInfo.name,
      collectionInfo.description,
      collectionInfo.image_url,
      userId,
      collectionInfo.category_id,
      currentDate,
      currentDate,
      ...Object.values(customFieldsObject),
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
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
    const query = `
      SELECT * FROM collections
      WHERE user_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    const userCollections = result.rows;
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
    const query = `
      SELECT * FROM collections
      WHERE id = $1;
    `;
    const result = await pool.query(query, [collectionId]);
    const collection = result.rows[0];
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
    const query = `DELETE FROM collections WHERE id = $1`;
    await pool.query(query, [collectionId]);
  } catch (error) {
    throw error;
  }
};

const updateCollection = async (collectionId, name, description, category_id, image_url, fields) => {
  try {
    const customFieldsObject = createCustomFieldsObject(fields);
    const currentDate = new Date();
    const updateCollectionQuery = `
      UPDATE collections
      SET name = $1, description = $2, category_id = $3, image_url = $4, updated_at = $5, ${Object.keys(customFieldsObject).map((field, i) => `${field} = $${i + 5}`).join(', ')}
      WHERE id = $7;
    `;

    const values = [
      name,
      description,
      category_id,
      image_url,
      currentDate,
      ...Object.values(customFieldsObject),
      collectionId,
    ];

    await pool.query(updateCollectionQuery, values);
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
