const express = require('express');
const collectionService = require('../servecis/collectionService');

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
      const collectionInfo = req.body; // Предполагается, что данные коллекции передаются в теле запроса
      const createdCollection = collectionService.createCollection(collectionInfo);
      res.json({ collection: createdCollection });
    } catch (error) {
      console.error('Error creating collection:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.post('/uploadImage', async (req, res) => {
    try {
      const file = req.file; // Предполагается, что файл изображения передается через форму данных
      const fileName = req.body.fileName; // Предполагается, что имя файла передается в теле запроса
      const imageUrl = await collectionService.uploadImage(file, fileName);
      res.json({ imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });