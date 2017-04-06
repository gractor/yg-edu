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
    // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
    res.redirect('/board/list/1');
});

router.get('/list/:page', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var sql = "select idx, creator_id, title, date_format(modidage, '%Y-%m-%d %H:%i:%s') modidage, hit from board";

        connection.query(sql, function(err, rows) {
            if (err) {
                console.error('err :' + err);
            }
            console.log('rows: ' + JSON.stringify(rows));

            res.render('list', {
                title: '게사판 전체글 조회',
                rows: rows
            });
            connection.release();
        })
    });
});

router.get('/write', function(req, res, next) {
    res.render('write', {
        title: '게시판 글쓰기'
    });
});

router.post('/write', function(req, res, next) {
    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [creator_id, title, content, passwd];

    pool.getConnection(function(err, connection) {
        var sql = 'insert into board (creator_id, title, content, passwd) values(?,?,?,?)';
        connection.query(sql, datas, function(err, rows) {
            if (err) {
                console.error('err : ' + err);
            }
            console.log('rows : ' + JSON.stringify(rows));

            res.redirect('/board');
            connection.release();
        });
    });
});

router.get('/read/:idx', function(req, res, next) {
    var idx = req.params.idx;

    pool.getConnection(function(err, connection) {
        var sql = 'select idx, creator_id, title, content, date_format(modidage,"%Y-%m-%d %H:%i:%s") modidage, hit from board where idx = ?';

        connection.query(sql, [idx], function(err, row) {
            if (err) {
                console.error(err);
            }
            console.log('1개 글 조회 결과 확인 : ', row);

            res.render('read', {
                title: '글 조회',
                row: row[0]
            });
            connection.release();
        });
    });
});

router.get('/update', function(req, res, next) {
    var idx = req.query.idx;

    pool.getConnection(function(err, connection) {
        var sql = 'select idx, creator_id, title, content,date_format(modidage,"%Y-%m-%d %H:%i:%s") modidage, hit, passwd from board where idx = ?';

        connection.query(sql, [idx], function(err, rows) {
            if (err) {
                console.error(err);
            }
            console.log('update에서 1개 글 조회 결과 확인: ', rows);

            res.render('update', {
                title: '글 수정',
                row: rows[0]
            });
            connection.release();
        });
    });
});

router.post('/update', function(req,res,next){
  var idx         = req.body.idx;
  var creator_id  = req.body.creator_id;
  var title       = req.body.title;
  var content     = req.body.content;
  var modidage    = req.body.modidage;
  var hit         = req.body.hit;
  var passwd      = req.body.passwd;

  var datas       = [creator_id, title, content, hit, idx, passwd];

  pool.getConnection(function(err, connection){
    var sql = 'update board set creator_id = ?, title = ?, content = ?, modidage = now(), hit = ? where idx = ? and passwd = ?';

    connection.query(sql, datas, function(err, result){
      console.log(result);
      if(err) console.error('글 수정 에러:'+err);
      if(result.affectedRows == 0){
        res.send('<script>alert("패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다."); history.back();</script>');
      }else{
        res.redirect('/board/read/'+idx);
      }

      connection.release();
    });
  });
});

module.exports = router;
