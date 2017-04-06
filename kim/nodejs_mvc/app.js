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
// 계정 생성
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var async = require('async');
// view engine setting
app.set("view engine", 'ejs');

// folder directory
app.use(express.static(path.join(__dirname + '/public')));
// set middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// user set middleware
app.use(flash());

app.use(session({secret:'MySecret'}));
app.use(passport.initialize());
app.use(passport.session());

passpot.seriallizeUser(function(user, done){
  done(null, user.id);
});
passport.deseriallizeUser(function(id, done){
  pool.getConnection(function(err, connection){
    var sql = "select * from user";
    connection.query(sql, function(err, user){
      done(err, user);
    });
  });

});

var LocalStrategy = require('passport-local').Strategy;

// set routes
// login
app.get('/', function(req, res){
  res.redirect('/home');
});
app.get('/login', function(req, res){
  res.render('login/login', {email:req.flash("email")[0], loginError:req.flash('loginError')});
});
app.post('/login', function(req, res, next){
  req.flash("email");
  if(req.body.email.length === 0 || req.body.password.length === 0){
    req.flash("email", req.body.email);
    req.flash("loginError", "Please enter both email and password");
    res.redirect('/login');
  } else {
    next();
  }
}, passport.authenticate('local-login', {
  successRedirect : '/home',
  failureRedirect : '/login',
  failureFlash : true
  })
);
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
//set user routes
app.get('/users/new', function(req, res){
  res.render('users/new', {
    formData: req.flash('formData')[0],
    emailError: req.flash('emailError')[0],
    nicknameError: req.flash('nicknameError')[0],
    passwordError: req.flash('passwordError')[0]
  });
}); //new
app.post('/users', checkUserRegVaildation, function(req, res, next){
  pool.getConnection(function(err, connection){
    var sql = "insert into user(email,nickname,password) values(?,?,?)";
    connection.query(sql, [email, nickname, password], function(err, result){
      if(err) return res.json({success:false, message:err});
      res.redirect('/login');
      connection.release();
    });
  });
});
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
