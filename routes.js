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
//TODO : update device name
router.post('/get_device_events', [authMiddleware.require_auth, authMiddleware.check_device_ownership], devicessController.get_device_events);
router.post('/get_user_devices', authMiddleware.require_auth, devicessController.get_user_devices);
router.post('/add_device_owner', [authMiddleware.require_auth, authMiddleware.check_device_ownership], devicessController.add_device_owner);
router.post('/check_pending_event', [authMiddleware.require_auth, authMiddleware.check_device_ownership], devicessController.check_pending_event);
router.post('/get_device_by_mac', devicessController.get_device_by_mac);

router.post('/create_event', [authMiddleware.require_auth, authMiddleware.check_device_ownership], eventsController.create_event);
router.post('/update_event', [authMiddleware.require_auth, authMiddleware.save_event_device ,authMiddleware.check_device_ownership], eventsController.update_event);
router.post('/delete_event', [authMiddleware.require_auth, authMiddleware.save_event_device ,authMiddleware.check_device_ownership], eventsController.delete_event);
router.post('/confirm_event_done', [authMiddleware.require_auth, authMiddleware.save_event_device ,authMiddleware.check_device_ownership], eventsController.confirm_event_done);

module.exports = router;