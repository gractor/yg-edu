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
  res.render('loginForm', { title: 'Login Form' });
});

router.post('/', function(req, res, next) {
  var m_id  = req.body.id;
  var m_pw  = req.body.passwd;

  var datas = [m_id,m_pw];

  pool.getConnection(function(err,connection){
    var sql = 'select * from member where m_id = ? and m_pw = ?';

    connection.query(sql, datas, function(err, result){
      console.log(result);
      if(err) console.error('로그인 에러'+err);
      if(result == ''){
        res.send('<script>alert("아이디 또는 패스워드가 일치하지 않습니다."); history.back();</script>');
      }else{
        var sql2  = 'select b_no, b_writer, b_title, date_format(b_regdate, "%Y-%m-%d %H:%i:%s") b_regdate, b_count from board';
        connection.query(sql2,function(err,rows){
          if(err) console.error("목록 조회 에러"+err);
          console.log(JSON.stringify(rows));
          // res.send('<script>alert("로그인 성공.");location.href="/main"</script>');
          res.render('main', { title: 'main', m_id: m_id, rows: rows });
        });
      }
      connection.release();
    });
  });
});

module.exports = router;
