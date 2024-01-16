const collectionService = require('../services/collectionService');
const authService = require('../services/authService');
const { v4: uuidv4 } = require('uuid');


exports.createCollection = async (req, res) => {
  try {
    const collectionInfo = req.body;
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const createdCollection = await collectionService.createCollection(collectionInfo, userId);
    res.json({ collection: createdCollection });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const fileName = `${uuidv4()}.${file.originalname.split('.').pop().toLowerCase()}`;
    const imageUrl = await collectionService.uploadImage(file.buffer, fileName);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getUserCollections = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    const userCollections = await collectionService.getUserCollections(userId);
    res.status(200).json({ userCollections });
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
    const collectionId = req.params.collectionId;
    const { name, description, category_id, image_url, fields } = req.body;
    await collectionService.updateCollection(collectionId, name, description, category_id, image_url);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

