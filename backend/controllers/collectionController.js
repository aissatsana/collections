const collectionService = require('../services/collectionService');
const authService = require('../services/authService');
const imageService = require('../services/imageService');
const { v4: uuidv4 } = require('uuid')



exports.createCollection = async (req, res) => {
  try {
    const collectionInfo = req.body;
    const image = req.file;
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const createdCollection = await collectionService.createCollection(collectionInfo, image, userId);
    res.status(200).json({ collection: createdCollection });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const fileName = `${uuidv4()}.${file.originalname.split('.').pop().toLowerCase()}`;
    const webpBuffer = await imageService.convertToWebP(file.buffer);
    const imageUrl = await imageService.uploadImage(webpBuffer, fileName);
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


exports.getUserCollections = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const collections = await collectionService.getUserCollections(userId);
    res.status(200).json({ collections });
  } catch (error) {
    console.error('Error fetching user collections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCollectionById = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const collection = await collectionService.getCollectionById(collectionId);
    res.status(200).json({ collection });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    await collectionService.deleteCollection(collectionId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateCollection =  async (req, res) => {
  try {
    const collectionId = parseInt(req.params.collectionId, 10);
    const { name, description, category_id, fields } = req.body;
    const image = req.file;
    const updatedCollection = await collectionService.updateCollection(collectionId, name, description, category_id, image, fields);
    res.status(200).json({ collection: updatedCollection });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getBiggestCollections = async (req, res) => {
  try {
    const topCollections = await collectionService.getBiggestCollections();
    res.status(200).json({collections: topCollections});
  } catch (error) {
    console.error('Error getting collections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
