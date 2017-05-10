module.exports = function(app) {

  var express = require('express');
  var router = express.Router();
  var session = require('express-session');

  var mysql = require('mysql');
  var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: '111111'
  });


  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

  router.get('/', function(req, res, next) {
    if (req.session.displayName) {
      var displayName = req.session.displayName;
      res.render('index', {displayName: displayName});
    } else {
      res.render('login');
    }
  });
  router.get('/logout', function(req, res, next) {
    delete req.session.displayName
    res.render('logout');
  });
  router.post('/', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;


    pool.getConnection(function(err, connection) {
      if (err) console.error("커넥션 객체 얻어오기 에러 : ", err);

      var sql = "select id, pw, name from user where id=?";
      connection.query(sql, username, function(err, rows) {
        if (err) console.error(err);
        //else console.log(rows[0].idx+"입니다");
        if (rows[0].id === username && rows[0].pw === password) {
          var displayName = req.session.displayName = rows[0].name;
          res.render('index', {
            displayName: displayName
          });
        } else {
          res.render('loginSuccess', {
            username: username
          });
        }
        connection.release();
      });
    });
  })
  return router;
};
