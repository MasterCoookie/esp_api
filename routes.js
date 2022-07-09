const { Router } = require('express');
const controller = require('./controller');
const authMiddleware = require('./middleware/authMiddleware');


const router = Router();

router.get('/', controller.index_get);

router.post('/user_create', controller.signup_post)
router.post('/user_check', controller.user_check);
router.post('/random_test', authMiddleware.requireAuth, controller.random_test);
router.post('/register_device', authMiddleware.requireAuth, controller.regiser_device);

module.exports = router;