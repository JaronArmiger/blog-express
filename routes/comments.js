const router = require('express').Router();

router.get('/', (req, res, next) => {
  
});

router.get('/:commentId', (req, res, next) => {
  res.send({ 
  	postId: req.postId,
  	commentId: req.params.commentId,
  })
});

module.exports = router;