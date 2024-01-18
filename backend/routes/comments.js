const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

router.post('/:itemId', commentsController.manageComments);


module.exports = router;
