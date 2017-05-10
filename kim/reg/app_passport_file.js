var express = require('express');
var session = require('express-session');
var LokiStore = require('connect-loki')(session);
var bodyParser = require('body-parser');
var app = express();
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var passport = require('passport'), FacebookStrategy = require('passport-facebook').Strategy;

var LocalStrategy = require('passport-local').Strategy;

app.use(session({
    secret: 'asdfc34$##22',
    resave : false,
    saveUninitialized: true,
    store: new LokiStore()
}));

app.use(bodyParser.urlencoded({ extended: false}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/logout', function(req, res){
    req.logout();
    return req.session.save(function(){
      res.redirect('/welcome');
  });
});


var users = [
  {
    authId: 'local:egoing',
    username : 'egoing',
    password : 'eZCmLBl36bRYZNdLp8EyUrmIRs+G+ZIV9oc3IYS0q/wBLEnyf58fWikYfsQR1/r9/1ldrP9YLowOAy9IOvBsdy81Udn8Gtw9U0Lhh0LArEou2IsR8uuNynlU3HndA1BD21Yk+YKBzoq0R7c5uGMVM7MZ0z9N0CiVepGdD+qpM+A=',
    salt : 'R4LWGC7ndFLMRmtTgTQzZCkRjuQNL3MuZ+rK+uxCKjaXSec4R9sGdK31dy3GqIvMAdItRSi6VkjhNLI0iAKXOg==',
    displayName : 'Egoing'
  }
];

app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      authId : 'local:' + req.body.username,
      username : req.body.username,
      password : hash,
      salt: salt,
      displayName : req.body.displayName
    };
    users.push(user);
    req.login(user, function(err){
       req.session.save(function(){
        res.redirect('/welcome');
      });
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

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.authId); //각 사용자의 식별자로 done함수의 authId를 줌
}); //username을 세션에 저장

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  for(var i=0; i< users.length; i++){
    var user = users[i];
    if(user.authId === id){
      console.log('------------' ,user);
       done(null, user);
    }
  }
  done('There is no user');
});
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username; //post에서의 username
    var pwd = password; //post 에서의 password
    for(var i=0; i< users.length; i++){
      var user = users[i];
      if(uname === user.username){
      return  hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user); //done() 로그인 절차가 끝났을 때
            // req.session.displayName = user.displayName;
            // req.session.save(function(){
            //   res.redirect('/welcome');
            // });
          } else{
            done(null, false);
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
    done(null, false); //for문의 맞는 사용자가 없을 때
  }
));
passport.use(new FacebookStrategy({
    clientID: '1840733199510901',
    clientSecret: 'ad245cb56ba5a1e2f7f8e07af2538235',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id','emails','gender','link','locale',
    'name','timezone','updated_time','verified','displayName']
    // 사용자 중에 email이 없다면 해당 SNS사이트에가서 이메일을 인증받아야함
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'facebook:'+profile.id;
    for(var i=0; i<users.length;i++){
      var user = users[i];
      if(user.authId === authId){
        return done(null, user);
      }
    }
    var newuser = {
      'authId':authId,
      'displayName':profile.displayName,
      'email': profile.emails[0].value
    };
    users.push(newuser);
    done(null, newuser);
  }
));




app.post(
  '/auth/login',
  passport.authenticate( //패스포트의 미들웨어로 받음
    'local',
    {
      successRedirect: '/welcome', //해당 코드를 주석처리하면 아래의 함수 호출
      failureRedirect: '/auth/login',
      failureFlash: false
    }
  ));
  app.get(
    '/auth/facebook',
    passport.authenticate(
      'facebook',
      {scope : 'email'}
    )
  );
  app.get(
    '/auth/facebook/callback',
  passport.authenticate(
    'facebook',
    {
       successRedirect: '/welcome',
       failureRedirect: '/auth/login'
     }
   )
 );
// app.post('/auth/login', function(req, res){
//
//   var uname = req.body.username; //post에서의 username
//   var pwd = req.body.password; //post 에서의 password
//   for(var i=0; i< users.length; i++){
//     var user = users[i];
//     if(uname == user.username){
//     return  hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
//         if(hash === user.password){
//           req.session.displayName = user.displayName;
//           req.session.save(function(){
//             res.redirect('/welcome');
//           });
//         } else{
//           res.send('who are you? <a href="/auth/login">Login</a>');
//         }
//       });
//     }
//
//     // if(uname === user.username && md5(pwd+salt) === user.password){ //입력한 값이 맞다면
//     //   req.session.displayName = user.displayName; //user 객체의 닉네임을 세션에 저장
//     //   return req.session.save(function(){
//     //     res.redirect('/welcome');
//     //   });
//     // }
//   }
//   res.send('Who are you?? <a href="/auth/login">login</a>');
//
// });


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
    <a href="/auth/facebook">facebook</a>
    <a href="/auth/twitter">twitter</a>
    <a href="/auth/google">google</a>
  `;

  res.send(output);
});


app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName){ //세션의 닉네임이 있다면
      res.send(`
        <h1>Hello, ${req.user.displayName}</h1>
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

app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
});
