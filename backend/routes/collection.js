const express = require('express');
const collectionService = require('../services/collectionService');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const router = express.Router();
const upload = multer();

router.post('/create', async (req, res) => {
    try {
      const collectionInfo = req.body; 
      const createdCollection = collectionService.createCollection(collectionInfo);
      res.json({ collection: createdCollection });
    } catch (error) {
      console.error('Error creating collection:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/uploadImage', upload.single('image'), async (req, res) => {
    try {
      const file = req.file;
      const fileName = `${uuidv4()}.${file.originalname.split('.').pop().toLowerCase()}`;
      const imageUrl = await collectionService.uploadImage(file.buffer, fileName);
      res.json({ imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;