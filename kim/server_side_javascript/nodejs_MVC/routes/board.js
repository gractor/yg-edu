var express = require('express');
var router = express.Router();

// MySQL 로드
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit:3,
  host:'localhost',
  user:'root',
  database:'o2',
  password:'111111',
  port:3307
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  // 전체목록으로 리다이렉트
  res.redirect('/board/list/1');
});

//목록
router.get('/list/:page', function(req, res, next){

  pool.getConnection(function(err, connection){
    //Use the connection
    var sql = "select idx, creator_id, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate,hit from boarding order by idx desc";
    connection.query(sql, function(err, result){
      if(err){
        console.log(err);
      } else {
        console.log("rows : " + JSON.stringify(result));
        res.render('list', {result:result});
        connection.release();
      }
    });
  });
});

//글 쓰기
router.get('/write', function(req, res, next){
  res.render('write');
});

router.post('/write', function(req, res, next){
  var creator_id = req.body.creator_id;
  var title = req.body.title;
  var content = req.body.content;
  var passwd = req.body.passwd;
  var datas = [creator_id, title, content, passwd];

  pool.getConnection(function(err, connection){
    var sql = "insert into boarding(creator_id, title, content, passwd) values(?,?,?,?)";
    connection.query(sql, datas, function(err, result){
      if(err){
        console.log(err);
      } else{
        res.redirect('/board');
        connection.release();
      }
    });
  });
});

//상세 조회
router.get('/read/:idx', function(req, res, next){
  var idx = req.params.idx;

  pool.getConnection(function(err, connection){
    var sql = "select * from boarding where idx=?";
    connection.query(sql, [idx], function(err, result){
      if(err){
        console.log(err);
      } else {
        res.render('read', {result:result[0]});
        connection.release();
      }
    });
  });
});

//수정
router.get('/update', function(req, res, next){
  var idx = req.query.idx;

  pool.getConnection(function(err, connection){
    var sql = "select * from boarding where idx=?";

    connection.query(sql, [idx], function(err, result){
      if(err){
        console.log(err);
      } else {
        res.render('edit', {result:result[0]});
        connection.release();
      }
    });
  });
});
router.post('/update', function(req, res, next){
  var idx = req.body.idx;
  var creator_id = req.body.creator_id;
  var title = req.body.title;
  var content = req.body.content;
  var passwd = req.body.passwd;
  pool.getConnection(function(err, connection){
    var sql = "update boarding set creator_id=?, title=?, content=?, passwd=? where idx=?";
    connection.query(sql, [creator_id, title, content, passwd, idx], function(err, result){
      if(err){
        console.log(err);
      } else{
        res.redirect('/board');
        connection.release();
      }
    });
  });
});

router.post('/delete', function(req, res, next){
  var idx = req.body.idx;

  pool.getConnection(function(err, connection){
    var sql = "delete from boarding where idx = ?";
    connection.query(sql, [idx], function(err, result){
      if(err){
        console.log(err);
      } else{
        res.redirect('/board');
        connection.release();
      }
    });
  });
});
module.exports = router;
