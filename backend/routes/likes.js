const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');

router.post('/:itemId', likesController.manageLike);


module.exports = router;
