const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

router.get('/:collectionId/items', itemController.getItems);
router.get('/:collectionId/items/:itemId', itemController.getItemById);
router.put('/:collectionId/items/:itemId', itemController.editItem);
router.delete('/:collectionId/items/:itemId', itemController.deleteItem);
router.post('/:collectionId/items', itemController.createItem);


module.exports = router;
