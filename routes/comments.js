const router = require('express').Router();
const commentController = require('../controllers/commentController');

router.get('/', commentController.comment_list);
router.post('/create', commentController.comment_create);
router.post('/:commentId/update', commentController.comment_update);
router.get('/:commentId', commentController.comment_detail);

module.exports = router;