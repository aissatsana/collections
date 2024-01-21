const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/:collectionId/items', itemController.getItems);
router.get('/tags', itemController.getTags);
router.get('/:itemId', itemController.getItemById);
router.post('/:collectionId/item/:itemId/update', itemController.editItem);
router.delete('/:itemId', itemController.deleteItem);
router.post('/:collectionId/items', itemController.createItem);


module.exports = router;
