const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', controller.index_get);

router.post('/user_create', controller.signup_post)
router.post('/user_check', controller.user_check);

module.exports = router;