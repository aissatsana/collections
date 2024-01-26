const { Storage } = require('@google-cloud/storage');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid')



const storage = new Storage({
    projectId: 'my-collection-410422',
    keyFilename: 'keyfile.json',
  });

const bucketName = 'my-collection-app';
const bucket = storage.bucket(bucketName);

function convertToWebP(imageBuffer) {
    return sharp(imageBuffer)
      .webp()
      .toBuffer();
  }

async function getImageUrl(fileName) {
    try {
      const options = {
        action: 'read',
        expires: Date.now() + 30 * 24 * 60 * 60 * 1000, 
      };
      const [signedUrl] = await bucket.file(`${fileName}`).getSignedUrl(options);
      return signedUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      throw error;
    }
}

async function getFileNameFromDB(collectionId) {
    try {
      const collection = await prisma.collections.findUnique({
        where: {
          id: collectionId,
        },
        select: {
          image_url: true,
        },
      });
      return collection ? collection.image_url : null;
    } catch (error) {
      console.error('Error getting file name from database:', error);
      throw error;
    }
  }
  
  async function areFileNamesEqual(fileNameFromClient, collectionId) {
    try {
      fileNameFromClient = fileNameFromClient.split('/').pop().split('?')[0];
      let fileNameFromDB = await getFileNameFromDB(collectionId);
      fileNameFromDB = fileNameFromDB.split('/').pop();
      if (!fileNameFromDB) {
        return false;
      }
      return fileNameFromClient === fileNameFromDB;
    } catch (error) {
      console.error('Error comparing file names:', error);
      throw error;
    }
  }
  function uploadImage(fileBuffer, fileName) {
    return new Promise((resolve, reject) => {
      const file = bucket.file(`images/${fileName}`);
      const stream = file.createWriteStream({ metadata: { contentType: 'image/webp' } });
  
      stream.on('error', (err) => reject({ error: 'Error uploading image', details: err }));
      stream.on('finish', () => resolve(file.name));
  
      stream.end(fileBuffer);
    });
  }

  const createWebPImage = async (originalImage) => {
    try {
      const fileName = `${uuidv4()}.${originalImage.originalname.split('.').pop().toLowerCase()}`;
      const webpBuffer = await convertToWebP(originalImage.buffer);
      const imageUrl = await uploadImage(webpBuffer, fileName);
      return imageUrl;
    } catch (error) {
      console.error('Error creating WebP image:', error);
      throw error;
    }
  };
  

  
  module.exports = {
    areFileNamesEqual,
    getFileNameFromDB,
    getImageUrl,
    uploadImage,
    convertToWebP,
    createWebPImage
  }