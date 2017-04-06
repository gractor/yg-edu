var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: '111111'
});

router.get('/', function(req, res, next) {
    // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
    res.redirect('/board/list/1');
});
router.get('/write', function(req,res,next){
    res.render('write',{title : "게시판 글 쓰기"});
});
router.post('/write', function(req,res,next){

    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [creator_id,title,content,passwd];

    pool.getConnection(function (err, connection)
    {
        var sqlForInsertBoard = "insert into board(creator_id, title, content, passwd) values(?,?,?,?)";
        connection.query(sqlForInsertBoard,datas, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/board');
            connection.release();
        });
    });
});
router.get('/list/:page', function(req,res,next){

    pool.getConnection(function (err, connection) {
        //data-format 은 날짜를 자기가 원하는 대로 만들수 있징
        var sqlForSelectList = "SELECT idx, creator_id, title, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate,hit FROM board";
        connection.query(sqlForSelectList, function (err, rows) {
            if (err) console.error("err : " + err);

            var page = req.params.page;
            var displayPageNum = 10;
            var recordsPerPage = 10;
            var totalCount = parseInt(Object.keys(rows).length-1);
            var endPage = parseInt(Math.ceil(page/parseFloat(displayPageNum)) * displayPageNum);
            var startPage = endPage - displayPageNum + 1;
            var prev = startPage > 1 ? true : false;
            var next = endPage * recordsPerPage < totalCount ? true : false;
            var realEndPage = parseInt(Math.ceil(totalCount/displayPageNum));

            if(totalCount<endPage*10){
              endPage=Math.ceil(totalCount/10);
            }


            res.render('list', {title: '게시판', rows: rows, page : page, leng : Object.keys(rows).length-1, displayPageNum ,endPage ,realEndPage, startPage, prev, next, pass : true});
            connection.release();

        });
    });
});

router.get('/read/:idx',function(req,res,next){
    var idx = req.params.idx;

    pool.getConnection(function(err,connection){

      var sql2 = "update board set hit=hit+1 where idx=?";
      connection.query(sql2,[idx], function(err,row2){
        if(err) console.error(err);

      var sql = "select idx, creator_id, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, hit from board where idx=?";
      connection.query(sql,[idx], function(err,row){
        if(err) console.error(err);

            res.render('read', {title:"글 조회", row:row[0]});
            connection.release();
          });
        });
    });
});router.get('/update',function(req,res,next)
{
    var idx = req.query.idx;

    pool.getConnection(function(err,connection)
    {
        if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);

        var sql = "select idx, creator_id, title, content, date_format(modidate,'%Y-%m-%d %H:%i:%s') modidate, hit from board where idx=?";
        connection.query(sql, [idx], function(err,rows)
        {
            if(err) console.error(err);

            res.render('update', {title:"글 수정", row:rows[0]});
            connection.release();
        });
    });

});

router.post('/update',function(req,res,next)
{
    var idx = req.body.idx;
    var creator_id = req.body.creator_id;
    var title = req.body.title;
    var content = req.body.content;
    var passwd = req.body.passwd;
    var datas = [creator_id,title,content,passwd];

    pool.getConnection(function(err,connection)
    {
        var sql = "update board set creator_id=? , title=?,content=?, regdate=now() where idx=? and passwd=?";
        connection.query(sql,[creator_id,title,content,idx,passwd],function(err,result)
        {
            console.log(result);
            if(err) console.error("글 수정 중 에러 발생 err : ",err);

            if(result.affectedRows == 0)
            {
                res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else
            {
                res.redirect('/board/read/'+idx);
            }
            connection.release();
        });
    });
});
router.post('/delete',function(req,res,next){
  var idx = req.body.idx;

  pool.getConnection(function(err,connection){
    var sql = "delete from board where idx=?"
    connection.query(sql,[idx], function(err,row){
      if(err) console.error(err);

          res.redirect('/board/list/1');
          connection.release();
      });
  });
});




module.exports = router;
