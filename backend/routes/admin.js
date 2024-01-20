const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/users', adminController.getUsers);
router.post('/block', adminController.blockUsers);
router.post('/unblock', adminController.unblockUsers);
router.post('/delete', adminController.deleteUsers);
router.post('/make-admin', adminController.makeAdmin);
router.post('/revoke-admin', adminController.revokeAdmin);

module.exports = router;
