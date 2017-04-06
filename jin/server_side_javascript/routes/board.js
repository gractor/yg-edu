var express = require('express');
var router = express.Router();

//   MySQL 로드
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 3,
    host : 'localhost',
    user : 'root',
    password : '111111',
    database : 'o2'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
    res.redirect('/board/list/1');
});

router.get('/list/:page', function(req,res,next){

    pool.getConnection(function (err, connection) {
        // Use the connection
        var sqlForSelectList = "SELECT id,title FROM topic";
        connection.query(sqlForSelectList, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('list', {title: ' 게시판 전체 글 조회', rows: rows});
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });
});

module.exports = router;
