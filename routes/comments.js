const router = require('express').Router();
const commentController = require('../controllers/commentController');

router.get('/', commentController.comment_list);
router.post('/create', commentController.comment_create);
router.get('/:commentId', commentController.comment_detail);

module.exports = router;