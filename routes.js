const { Router } = require('express');
const controller = require('./controller');
const authMiddleware = require('./middleware/authMiddleware');


const router = Router();

router.get('/', controller.index_get);

router.post('/user_create', controller.signup_post)
router.post('/user_check', controller.user_check);

router.post('/random_test', authMiddleware.requireAuth, controller.random_test);

router.post('/register_device', authMiddleware.requireAuth, controller.regiser_device);
router.post('/get_device_events', authMiddleware.requireAuth, controller.get_device_events);

router.post('/create_event', authMiddleware.requireAuth, controller.create_event);
router.post('/update_event', authMiddleware.requireAuth, controller.update_event);
router.post('/delete_event', authMiddleware.requireAuth, controller.delete_event);
router.post('/check_pending_event', authMiddleware.requireAuth, controller.check_pending_event);
router.post('/confirm_event_done', authMiddleware.requireAuth, controller.confirm_event_done);

module.exports = router;