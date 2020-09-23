const router = require('express').Router();
const passport = require('passport');

const postController = require('../controllers/postController');
const commentsRouter = require('./comments');

router.get('/protected', passport.authenticate('jwt', { session: false }),
	(req, res, next) => {
	  res.status(200).json({ success: true, msg: 'you are successfully authenticated ayy (posts)' });
});

router.get('/', postController.post_list);
router.post('/create', postController.post_create);
router.post('/:postId/update', postController.post_update);
router.post('/:postId/delete', postController.post_delete);
router.post('/:postId/publish', postController.post_publish);
router.post('/:postId/unpublish', postController.post_unpublish);
router.get('/:postId', postController.post_detail);

router.use('/:postId/comments', 
	(req, res, next) => {
	  req.postId = req.params.postId;
	  next();
	},
	commentsRouter);

module.exports = router;