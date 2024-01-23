const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.put('/change-password', userController.changePassword);


module.exports = router;
