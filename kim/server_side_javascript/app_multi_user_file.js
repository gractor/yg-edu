var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();


var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
  secret:'cdscsfa#@!$dfss@113@5$',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.get('/count', function(req, res){
  if(req.session.count){
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count :' + req.session.count);
});
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
  res.redirect('/welcome');
});
app.get('/welcome', function(req, res){
  if(req.session.displayName){
    res.send(`
    <h1>Hello, ${req.session.displayName}</hi>
    <a href="/auth/logout">logout</a>
      `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
      `);
  }
});

app.post('/auth/login', function(req, res){
  var uname = req.body.username;
  var pwd = req.body.password;
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(uname == user.username){
      return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          req.session.displayName = user.displayName;
          req.session.save(function(){
            res.redirect('/welcome');
          });
        } else {
          res.send('Who are you? <a href="/auth/login">login</a>');
        }
      });
    }
    // if(uname === user.username && sha256(pwd+user.salt) === user.password){
    //   req.session.displayName = user.displayName;
    //   return req.session.save(function(){
    //     res.redirect('/Welcome');
    //     //콜백함수의 리턴으로 즉시 빠져나옴
    //   });
    }
  });

var users = [
  {
    username:'egoing',
    password:'v1lbau7RR/Vnl0ppaX79hAYOJT2ZogbgL+LKI4iHWSt/y1QlJCLV3GmZ2jquk/7A3Ltz9iKWv5rTPiLO1Kf6GIAUO9BIM98Z5lEWlYJCDNuew1WuPQD1uaOieY9y1mO53NpJvjPyQA/xGq/qkSndjgLNkuTZTM0UPKmp242rukk=',
    salt : 'AuUZL90xvy7RXeSyjkfAsg8cRVNroPdN6HaCHrzlP/hHu1wZUUTIED7uak+wlP6Cha+h5vjEi2WEBxjB1hGD5A==',
    displayName:'Egoing'
  }
];
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      username : req.body.username,
      password : hash,
      salt : salt,
      displayName : req.body.displayName
    };
    users.push(user);
    req.session.displayName = req.body.username;
    req.session.save(function(){
      res.redirect('/welcome');
    });
  });

});
app.get('/auth/register', function(req, res){
  var output= `
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username"/>
    </p>
    <p>
      <input type="password" name="password" placeholder="password"/>
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName"/>
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});
app.get('/auth/login', function(req, res){
  var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="username" placeholder="username"/>
      </p>
      <p>
        <input type="password" name="password" placeholder="password"/>
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `;

  res.send(output);
});

app.listen(3003, function(){
  console.log('Connected 3003 port !!!');
});
