const { Router } = require('express');
const eventsController = require('./controllers/eventsController');
const devicessController = require('./controllers/devicesController');
const authMiddleware = require('./middleware/authMiddleware');


const router = Router();

router.get('/', eventsController.index_get);

router.post('/user_create', eventsController.signup_post)
router.post('/user_check', eventsController.user_check);

router.post('/random_test', authMiddleware.require_auth, eventsController.random_test);

router.post('/register_device', authMiddleware.require_auth, devicessController.regiser_device);
router.post('/get_device_events', [authMiddleware.require_auth, authMiddleware.check_device_ownership], devicessController.get_device_events);
router.post('/add_device_owner', authMiddleware.require_auth, devicessController.add_device_owner);

router.post('/create_event', authMiddleware.require_auth, eventsController.create_event);
router.post('/update_event', authMiddleware.require_auth, eventsController.update_event);
router.post('/delete_event', authMiddleware.require_auth, eventsController.delete_event);
router.post('/check_pending_event', authMiddleware.require_auth, eventsController.check_pending_event);
router.post('/confirm_event_done', authMiddleware.require_auth, eventsController.confirm_event_done);

module.exports = router;