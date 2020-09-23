const router = require('express').Router();
const passport = require('passport');

const postController = require('../controllers/postController');

router.get('/protected', passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
	  res.status(200).json({ success: true, msg: 'you are successfully authenticated ayy (posts)' });
});

router.get('/', postController.post_list);
router.post('/create', postController.post_create);
router.post('/:id/update', postController.post_update);
router.post('/:id/delete', postController.post_delete);
router.post('/:id/publish', postController.post_publish);
router.post('/:id/unpublish', postController.post_unpublish);
router.get('/:id', postController.post_detail);

module.exports = router;