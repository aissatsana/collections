const { Storage } = require('@google-cloud/storage');
const pool = require('../ utils/db');


const storage = new Storage({
  projectId: 'my-collection-410422',
  keyFilename: 'keyfile.json',
});

const bucketName = 'my-collection-app';
const bucket = storage.bucket(bucketName);

function createCollection(collectionInfo) {
    return; 
}

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
        resolve(`gs://${bucketName}/${file.name}`);
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


module.exports = {
    createCollection,
    uploadImage,
};