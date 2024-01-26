const express = require('express');
const multer = require('multer');
const collectionController = require('../controllers/collectionController');

const router = express.Router();
const upload = multer();


router.post('/create', upload.single('image'), collectionController.createCollection);
router.get('/getTop', collectionController.getBiggestCollections);
router.get('/userCollections', collectionController.getUserCollections);
router.get('/:collectionId', collectionController.getCollectionById);
router.delete('/delete/:collectionId', collectionController.deleteCollection);
router.post('/update/:collectionId', upload.single('image'), collectionController.updateCollection);

module.exports = router;
