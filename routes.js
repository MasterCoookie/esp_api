const { Router } = require('express');
const eventsController = require('./controllers/eventsController');
const devicessController = require('./controllers/devicesController');
const authMiddleware = require('./middleware/authMiddleware');


const router = Router();

router.get('/', eventsController.index_get);

router.post('/user_create', eventsController.signup_post)
router.post('/user_check', eventsController.user_check);

router.post('/random_test', authMiddleware.requireAuth, eventsController.random_test);

router.post('/register_device', authMiddleware.requireAuth, devicessController.regiser_device);
router.post('/get_device_events', authMiddleware.requireAuth, devicessController.get_device_events);
router.post('/add_device_owner', authMiddleware.requireAuth, devicessController.add_device_owner);

router.post('/create_event', authMiddleware.requireAuth, eventsController.create_event);
router.post('/update_event', authMiddleware.requireAuth, eventsController.update_event);
router.post('/delete_event', authMiddleware.requireAuth, eventsController.delete_event);
router.post('/check_pending_event', authMiddleware.requireAuth, eventsController.check_pending_event);
router.post('/confirm_event_done', authMiddleware.requireAuth, eventsController.confirm_event_done);

module.exports = router;