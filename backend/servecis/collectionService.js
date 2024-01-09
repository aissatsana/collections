const { Storage } = require('@google-cloud/storage');
const pool = require('../ utils/db');

const storage = new Storage({
  projectId: 'my-collection-410422',
  keyFilename: 'keyfile.json',
});

const bucketName = 'collection-bucket';
const bucket = storage.bucket(bucketName);

function createCollection(collectionInfo) {
    // Логика для создания коллекции в базе данных
    // ...
  
    // Возвращает информацию о созданной коллекции
    return {
      collectionId: 'идентификатор-коллекции',
      // Другие свойства коллекции
    };
  }

function uploadImage(file, fileName) {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        destination: `images/${fileName}`,
      };
      bucket.upload(file.path, uploadOptions, (err, uploadedFile) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(uploadedFile.publicUrl());
      });
    });
}

module.exports = {
    createCollection,
    uploadImage,
};