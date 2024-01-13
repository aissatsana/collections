const express = require('express');
const collectionService = require('../services/collectionService');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const pool = require('../ utils/db');

const router = express.Router();
const upload = multer();



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

router.post('/create', async (req, res) => {
    try {
      const collectionInfo = req.body; 
      const customFieldsObject = createCustomFieldsObject(collectionInfo.fields);

      const createdCollection = await collectionService.createCollection({
            name: collectionInfo.name,
            description: collectionInfo.description,
            image_url: collectionInfo.image,
            user_id: req.session.user.id,
            category_id: collectionInfo.category,
            ...customFieldsObject,
      });
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

router.get('/userCollections', async (req, res) => {
  try {
    const userId = req.session.user.id;
    const query = `
      SELECT * FROM collections
      WHERE user_id = $1;
    `;
    const result = await pool.query(query, [userId]);
    const userCollections = result.rows;
    for (const collection of userCollections) {
      if (collection.image_url) {
        const imageUrl = await collectionService.getImageUrl(collection.image_url);
        collection.image_url = imageUrl;
      }
    }
    res.status(200).json({ userCollections });
  } catch (error) {
    console.error('Error fetching user collections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;