module.exports = function(){
  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');


  var app = express();
  app.set('views', './views');
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
      secret: 'asdfc34$##22',
      resave : false,
      saveUninitialized: true,
      store: new MySQLStore({
        host:'localhost',
        port: 3307,

        user: 'root',
        password: '111111',
        database: 'test'
      })
  }));
  return app;
};
