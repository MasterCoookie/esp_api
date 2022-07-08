const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', controller.index_get);

router.post('/user_create', controller.signup_post)

module.exports = router;