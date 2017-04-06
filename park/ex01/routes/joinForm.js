var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: '941021'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('joinForm', { title: '회원가입 창' });
});

router.post('/',function(req, res, next){
  var m_id    = req.body.id;
  var m_pw    = req.body.passwd;
  var m_name  = req.body.name;
  var m_age   = req.body.age;

  var datas   = [m_id, m_pw, m_name, m_age];
  console.log(datas);
  pool.getConnection(function(err,connection){
    var sql = 'insert into member (m_id, m_pw, m_name, m_age) values(?,?,?,?)';

    connection.query(sql, datas, function(err, result){
      console.log(result);
      if(err) console.error('회원가입 에러'+err);
      if(result.affectedRows == 0){
        res.send('<script>alert("회원정보 입력과정에서 문제가 생겼습니다."); history.back();</script>');
      }else{
        res.send('<script>alert("회원가입이 완료됬습니다.");location.href="/loginForm"</script>');
      }
    });
  });
});

module.exports = router;
