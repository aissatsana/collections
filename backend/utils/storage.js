const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'my-collection-410422',
  keyFilename: 'keyfile.json',
});

const bucketName = 'my-collection-app';
const bucket = storage.bucket(bucketName);

module.exports = {
    storage,
    bucket
}