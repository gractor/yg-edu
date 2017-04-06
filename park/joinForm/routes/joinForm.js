var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('joinForm', {title:  '회원가입 폼'});
});

router.post('/', function(req, res, next) {
  res.json(req.body);
});

module.exports = router;
