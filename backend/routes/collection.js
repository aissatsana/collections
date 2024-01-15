const express = require('express');
const collectionService = require('../services/collectionService');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const pool = require('../ utils/db');
const authService = require('../services/authService')


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
      const token = req.headers.authorization;
      const createdCollection = await collectionService.createCollection({
            name: collectionInfo.name,
            description: collectionInfo.description,
            image_url: collectionInfo.image,
            user_id: authService.getUserId(token),
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
    const token = req.headers.authorization;
    const userId = authService.getUserId(token);
    console.log(userId);
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

router.get('/:collectionId', async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const query = `
      SELECT * FROM collections
      WHERE id = $1;
    `;
    const result = await pool.query(query, [collectionId]);
    const collection = result.rows[0];
    if (collection.image_url) {
      const imageUrl = await collectionService.getImageUrl(collection.image_url);
      collection.image_url = imageUrl;
    }
    res.status(200).json({ collection });
  } catch (error) {
    console.error('Error fetching user collections:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:collectionId', async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const query = `DELETE FROM collections WHERE id = $1`;
    const result = await pool.query(query, [collectionId]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.post('/update/:collectionId', async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const { name, description, category_id, image_url, fields } = req.body;
    const updateCollectionQuery = `
    UPDATE collections
    SET name = $1, description = $2, category_id = $3, image_url = $4, fields = $5
    WHERE id = $6
  `;

  const updateCollectionValues = [name, description, category_id, image_url, fields, collectionId];
  await pool.query(updateCollectionQuery, updateCollectionValues);

  res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})


module.exports = router;