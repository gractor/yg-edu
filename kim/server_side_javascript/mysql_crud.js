var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var conn = mysql.createConnection({
  host : 'localhost',
  port : 3307,
  user : 'root',
  password : '111111',
  database : 'o2'
});

conn.connect();
var app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.locals.pretty = true;
app.set('views', './db_board');
app.set('view engine', 'jade');
//수정
app.get(['/:id/edit'], function(req, res){
  var id = req.params.id;
  var title = req.params.title;
  var text = req.params.text;
  var writer = req.params.writer;
  var sql = "select id,title,text,writer from board";
  conn.query(sql, [id,title,text, writer], function(err, result){
      var sql = "select * from board where id =?";
      conn.query(sql, [id], function(err, result){
        if(err){
          console.log(err);
          res.status(500).send('Internal Page Error');
        } else {
          res.render('html_edit', {result:result[0]});
        }
      });
  });
});
app.post(['/:id/edit'], function(req, res){
  var sql = "select * from board";
  conn.query(sql, function(err, result){
    var title = req.body.title;
    var text = req.body.text;
    var writer = req.body.writer;
    var id = req.body.id;
    var sql = "update board set title=?, text=?, writer=? where id = ?";
    conn.query(sql, [title, text, writer, id], function(err, result){
      if(err){
        console.log(err);
        res.status(500).send('Intenal Page Error');
      } else {
        res.redirect('/');
      }
    });
  });
});
//메인목록
app.get('/', function(req, res){
  var sql = "select id,title,writer,date from board";
  conn.query(sql, function(err, result){
    var id = req.params.id;
    var title = req.params.title;
    var writer = req.params.writer;
    var date = req.params.date;
    var sql = "select id, title, writer, DATE_FORMAT(date,'%b %d %Y %h:%i %p') as date from board order by id desc";
    conn.query(sql, [id, title, writer, date], function(err, boards){
        if(err){
          res.status(500).send('Internal page Error');
        } else {
          res.render('html', {boards:boards});
        }
    });
  });
});
//글쓰기
app.get('/add', function(req, res){
  var id = req.params.id;
  var title = req.params.title;
  var writer = req.params.writer;
  var text = req.params.text;
  var date = req.params.date;
  var sql = "select * from board order by id desc";
  conn.query(sql, [id, title, writer, text, date], function(err, boards){
    if(err){
      res.status(500).send('Internal Page Error');
    } else {
      res.render('html_add', {boards:boards});
      // console.log(boards);
      // console.log(id);
    }
    });
});

app.post('/add', function(req, res){
  var id = req.body.id;
  var title = req.body.title;
  var writer = req.body.writer;
  var text = req.body.text;
  var sql = "insert into board(title, text, writer) values(?,?,?)";
    conn.query(sql, [title, text, writer], function(err, result){
      var sql = "select * from board order by id desc";
      conn.query(sql, function(err, result){
      if(err){
        console.log(err);
        res.status(500).send('Internal Error Page');
      } else {
        res.redirect('/');
      }
    });
  });
});
//상세보기
app.get('/:id', function(req, res){
    var sql = "select * from board";
    conn.query(sql, function(err, result){
      var id = req.params.id;
      console.log(id);
      var sql = "select * from board where id=?";
      conn.query(sql, [id], function(err, result){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log(result[0]);
          res.render('html_view', {result:result[0]});
        }
      });
    });
  });
//삭제
app.post('/:id/delete', function(req, res){
  var id = req.body.id;
  var sql = "delete from board where id=?";
  conn.query(sql, [id], function(err, result){
    if(err){
      console.log(err);
      res.send('Internal Error Page');
    } else {
      res.redirect('/');
    }
  });
});
app.get('/:id/delete', function(req, res){
    var id = req.params.id;
    var sql = "select * from board where id=?";
      conn.query(sql, [id], function(err, result){
        // console.log(sql);
        if(err){
          res.status(500).send('Internal Error Page!');
        } else {
          if( result.length === 0){
            res.status(500).send('Internal Error Page!');
          } else {
            res.render('html_view', {result:result[0]});
          }
      }
  });
});
app.listen('3000', function(req, res){
  console.log('Connected Server !! 3000 port !!');
});
