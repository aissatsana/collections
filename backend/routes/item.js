const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/:collectionId/items', itemController.getItems);
router.get('/:itemId', itemController.getItemById);
router.post('/:collectionId/item/:itemId/update', itemController.editItem);
router.delete('/:collectionId/items/:itemId', itemController.deleteItem);
router.post('/:collectionId/items', itemController.createItem);


module.exports = router;
