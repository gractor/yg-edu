var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
    secret: '123431r##$%334',
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

app.get('/count', function(req, res){
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : '+ req.session.count);
});
app.get('/auth/logout', function(req, res){
  delete req.session.displayName;
    return req.session.save(function(){ //세션을 저장한 뒤 콜백을 부름
      res.redirect('/welcome');
  });
});
app.get('/welcome', function(req, res){
  if(req.session.displayName){ //세션의 닉네임이 있다면
      res.send(`
        <h1>Hello, ${req.session.displayName}</h1>
        <a href="/auth/logout">logout</a>
      `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/auth/login">Login</a>
    `);
  }
});
app.post('/auth/login', function(req, res){
  var user = {
    username : 'egoing',
    password : '111',
    displayName : 'Egoing'
  };
  var uname = req.body.username; //post에서의 username
  var pwd = req.body.password; //post 에서의 password
  if(uname === user.username && pwd === user.password){ //입력한 값이 맞다면
    req.session.displayName = user.displayName; //user 객체의 닉네임을 세션에 저장
    return req.session.save(function(){
      res.redirect('/welcome');
});
  } else {
    res.send('Who are you?? <a href="/auth/login">login</a>');
  }

});
app.get('/auth/login', function(req, res){
  var output = `
    <h1>Login</h1>
    <form action="/auth/login" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
  `;

  res.send(output);
});


app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
});
