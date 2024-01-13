const { Storage } = require('@google-cloud/storage');
const pool = require('../ utils/db');

const storage = new Storage({
  projectId: 'my-collection-410422',
  keyFilename: 'keyfile.json',
});

const bucketName = 'my-collection-app';
const bucket = storage.bucket(bucketName);
const createCollection = async (collectionData) => {
  try {
      const {
          name,
          description,
          image_url,
          user_id,
          category_id,
          ...customFields
      } = collectionData;
      const query = `
          INSERT INTO collections (name, description, image_url, user_id, category_id, ${Object.keys(customFields).join(', ')})
          VALUES ($1, $2, $3, $4, $5, ${Object.values(customFields).map((_, index) => `$${index + 6}`).join(', ')})
          RETURNING *;
      `;
      const values = [name, description, image_url, user_id, category_id, ...Object.values(customFields)];
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


module.exports = {
    createCollection,
    uploadImage,
    getImageUrl,
};