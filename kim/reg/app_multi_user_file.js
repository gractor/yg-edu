var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);
var md5 = require('md5');
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

app.use(session({
    secret: '123431r##$%334',
    resave : false,
    saveUninitialized: true,
    store: new FileStore()

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
    return req.session.save(function(){
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
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});
app.post('/auth/login', function(req, res){

  var uname = req.body.username; //post에서의 username
  var pwd = req.body.password; //post 에서의 password
  for(var i=0; i< users.length; i++){
    var user = users[i];
    if(uname == user.username){
    return  hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
        if(hash === user.password){
          req.session.displayName = user.displayName;
          req.session.save(function(){
            res.redirect('/welcome');
          });
        } else{
          res.send('who are you? <a href="/auth/login">Login</a>');
        }
      });
    }

    // if(uname === user.username && md5(pwd+salt) === user.password){ //입력한 값이 맞다면
    //   req.session.displayName = user.displayName; //user 객체의 닉네임을 세션에 저장
    //   return req.session.save(function(){
    //     res.redirect('/welcome');
    //   });
    // }
  }
  res.send('Who are you?? <a href="/auth/login">login</a>');

});
var salt = "#$#%ADDBCSfe3#$#%@#21^";
var users = [
  {
    username : 'egoing',
    password : 'V9DNEelfH9EzcD/dISKBGDhSIv7+roj4YaqLnzcVRtLuUSh1s0alD0JPqoLrBmEKDS5oiE7QlkBth3AsQ5FlRd9P3YpB1QWl4qFuoRf1KvPMqc6dPgph246iBQ+hZLaUEaaxRp8EdVTB+uD7NA3Ah16k6tv1cQb+69ouLv5USh0=',
    salt : 'YowQdp/V4MGvCmKJDUzzl+wQOPbo8UUkomZfYPR/25x4AfGS6K9QdpPz5b56CWXhiaRGXJVb5Zo/ye9susyHOg==',
    displayName : 'Egoing'
  }
];
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      username : req.body.username,
      password : hash,
      salt: salt,
      displayName : req.body.displayName
    };
    users.push(user);
    req.session.displayName = req.body.displayName;
    req.session.save(function(){
      res.redirect('/welcome');
    });

  });

});
app.get('/auth/register', function(req, res){
  var output=`
    <h1>Register</h1>
    <form action="/auth/register" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="text" name="displayName" placeholder="displayName">
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
