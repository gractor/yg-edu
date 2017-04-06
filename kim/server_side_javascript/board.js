var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
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
app.set('views', './Board');
app.set('view engine', 'jade');

app.get('/board', function(req, res){
  var sql = "select * from boarding order by id desc";
  conn.query(sql, function(err, boardings){
    if(err) {
      console.log(err);
      res.status(500).send('Intenal Error Page!');
    } else {
      res.render('list', {boardings:boardings});
    }
  });
});
app.get('/board/write', function(req, res){
      var sql = "select * from boarding";
      conn.query(sql, function(err, boarding){
        if(err){
          console.log(err);
          res.status(500).send('Internal Error Page');
        } else {
          res.render('view_write', {boarding:boarding});
        }
      });
});
app.post('/board/write', function(req, res){
    var id = req.body.id;
    var title = req.body.title;
    var text = req.body.text;
    var writer = req.body.writer;
    console.log(title);
    var sql = "insert into boarding(title, text, writer) values(?,?,?)";
    conn.query(sql, [title, text, writer], function(err, boarding){
      if(err){
        console.log(err);
        res.status(500).send('Internal Error Page');
      } else {
        res.redirect('/board');
      }
  });
});
app.get('/board/:id', function(req, res){
  var sql = "select * from boarding";
  conn.query(sql, function(err, result){
    var id = req.params.id;
    var sql = "select * from boarding where id = ?";
    conn.query(sql, [id], function(err, boarding){
      if(err){
        console.log(err);
        res.status(500).send('Internal Error Page');
      } else {
        res.render('view_id', {boarding:boarding[0]});
      }
    });
  });
});



app.post('/board/:id/delete', function(res, req){
  var id = req.params.id;
  res.send(id);
});

app.listen('3000', function(req, res){
  console.log('Server Connected!!');
});
