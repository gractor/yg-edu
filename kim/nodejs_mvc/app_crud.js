var express = require('express');
var path = require('path');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var pool = mysql.createPool({
  connectionLimit:3,
  host:'localhost',
  user:'root',
  database:'o2',
  password:'111111',
  port:3307
});
// view engine setting
app.set("view engine", 'ejs');

// folder directory
app.use(express.static(path.join(__dirname + '/public')));
// set middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


// set routes
//create
app.get('/home/create', function(req, res){
  res.render("new");
});
// read
app.get('/home', function(req, res){

  pool.getConnection(function(err, connection){
    var sql = "select * from boarding order by idx desc";
    connection.query(sql, function(err, result){
      if(err) return res.json({success:false, message:err});
      res.render("home", {result:result});
      connection.release();
    });
  });
});
app.post('/home', function(req, res){
  console.log(req.body);
  var title = req.body.result.title;
  var content = req.body.result.content;
  var creator_id = req.body.result.creator_id;
  pool.getConnection(function(err, connection){
      var sql = "insert into boarding(title, content, creator_id) values(?,?,?)";

    connection.query(sql, [title, content, creator_id], function(err, result){
      console.log(result);
      if(err) return res.json({success:false, message:err});
      res.redirect('/home');
      connection.release();
    });
  });
});
// read/:id
app.get('/home/:idx', function(req, res){
  pool.getConnection(function(err, connection){
    var idx = req.params.idx;
    var sql = "select * from boarding where idx = ?";
    connection.query(sql, [idx], function(err, result){
      if(err) return res.json({success:false, message:err});
      res.render("show", {result:result[0]});
      connection.release();
    });
  });
});
//edit
app.get('/home/:idx/edit', function(req, res){
  var modidate = req.body.modidate;
  modidate = Date.now();
  pool.getConnection(function(err, connection){
    var idx = req.params.idx;
    var sql = "select * from boarding where idx = ?";
    connection.query(sql, [idx], function(err, result){
      if(err) return res.json({success:false, message:err});
      res.render("edit", {result:result[0]});
      connection.release();
    });
  });
});
app.put('/home/:idx', function(req, res){

  pool.getConnection(function(err, connection){
    var idx = req.params.idx;
    var title = req.body.result.title;
    var content = req.body.result.content;
    var creator_id = req.body.result.creator_id;
    var sql = "update boarding set title=?, content=?, creator_id=? where idx=?";
    connection.query(sql, [title, content, creator_id, idx], function(err, result){
      if(err) return res.json({success:false, message:err});
      res.redirect("/home/"+idx);
      connection.release();
    });
  });
});
//delete
app.delete('/home/:idx', function(req, res){
  pool.getConnection(function(err, connection){
    var idx = req.params.idx;
    var sql = "delete from boarding where idx = ?";
    connection.query(sql, [idx], function(err, result){
      if(err) return res.json({success:false, message:err});
      res.redirect('/home');
      connection.release();
    });
  });
});



app.listen(8000, function(){
  console.log('Server Open');
});
