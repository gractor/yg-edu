var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');

var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var nodemailer = require('nodemailer'); //이메일 인증


var app = express();
var bkfd2Password = require('pbkdf2-password');
var hasher = bkfd2Password();
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 5,
  host:'localhost',
  user :'root',
  password : '111111',
  port : 3307,
  database : 'test'
});
app.set('views', './views');
app.set('view engine', 'ejs');
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

app.use(bodyParser.urlencoded({ extended: false}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/logout', function(req, res){
    req.logout();
    return req.session.save(function(){
      res.redirect('/welcome');
  });
});






//-----------------------------------------------로컬, SNS 인증 부분 -------------
var users = [
  {
    authId: 'local:root',
    username : 'root',
    password : '68PoK0vclgAUTpcOw+FsmYlZjmYpp6oqoBjBx/17ZrDp+mkdMmQkSjp9TnWKReRXYTu08Kicm0FrbxW40jArx35rO9PLWS8jmb+uDPws7YdLle9VXuBxTa3ATH9PQLXqVDMBNxFOeGF2nbTDos2xZY//mD8j9g47vDnMcvtHqy0=',
    salt : 'LubaqcRUbnQBVHI+z01vlU3F3kj79Zlv0XYaT1g/6wmTr6sEzU34mWYA7io8vb4B5HUyLVQ4XoiCQT+GUqcmcA==',
    displayName : 'admin'
  }
];

app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      authId : 'local:' + req.body.username,
      username : req.body.username,
      password : hash,
      salt: salt,
      displayName : req.body.displayName,
      email : req.body.email
    };
    pool.getConnection(function(err, connection){
      var sql = 'insert into users set ?';
      connection.query(sql, user, function(err, results){
        if(err){
          console.log(err);
          res.status(500);
        } else{
          connection.release();
          req.login(user, function(err){
             req.session.save(function(){
              res.redirect('/welcome');
            });
          });
        }
      });
    });


  });

  var mailOpts, smtpTrans;
  //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'qordi124@gmail.com',
        pass: 'wmfdkf'
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: req.body.username + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
    to:  req.body.email,
    subject: 'Email_Authentication',
    // text: req.body.message,
    html : "<a href='http://localhost:3003/auth/"+ req.body.username + "/"+ rand + "'>인증</a>"
// '<a href="localhost:3003/auth/'+ req.body.name +'/'+ rand + '">인증</a>'
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    //Email not sent
    if (error) {
        res.send({ msg: 'Error occured, message not sent.', err: true});
    }
    //Yay!! Email sent
    else {
        res.send({ msg: 'Message sent! Thank you.', err: false });
    }
  });
});
app.get('/auth/register', function(req, res){
  res.render('register');
});

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.authId); //각 사용자의 식별자로 done함수의 authId를 줌
}); //username을 세션에 저장

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  pool.getConnection(function(err, connection){
    var sql = 'select * from users where authId=?';
    connection.query(sql, [id], function(err, results){
      if(err){
        console.log(err);
        connection.release();
        done('There is no user.');
      } else {
        connection.release();
        done(null, results[0]);
      }
    });
  });
  // for(var i=0; i< users.length; i++){
  //   var user = users[i];
  //   if(user.authId === id){
  //      done(null, user);
  //   }
  // }
  // done('There is no user');
});
passport.use(new LocalStrategy(
  function(username, password, done){
    var uname = username; //post에서의 username
    var pwd = password; //post 에서의 password
    pool.getConnection(function(err, connection){
      var sql = 'select * from users where authId=?';
      connection.query(sql, ['local:'+uname], function(err, results){
        console.log(results);
        if(err){
          connection.release();
          return done('There is no user.');
        } else {
          var user = results[0];
          return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
              if(hash === user.password){
                console.log('LocalStrategy', user);
                connection.release();
                done(null, user);
                //done() 로그인 절차가 끝났을 때
                // req.session.displayName = user.displayName;
                // req.session.save(function(){
                //   res.redirect('/welcome');
                // });
              } else{
                connection.release();
                done(null, false);
              }


          }); // end of hasher
        } //end of else
      }); //end of connection
    }); //end of pool`


    // for(var i=0; i< users.length; i++){
    //   var user = users[i];
    //   if(uname === user.username){
    //   return  hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
    //       if(hash === user.password){
    //         console.log('LocalStrategy', user);
    //         done(null, user); //done() 로그인 절차가 끝났을 때
    //         // req.session.displayName = user.displayName;
    //         // req.session.save(function(){
    //         //   res.redirect('/welcome');
    //         // });
    //       } else{
    //         done(null, false);
    //       }
    //     });
    //   }
    //   // if(uname === user.username && md5(pwd+salt) === user.password){ //입력한 값이 맞다면
    //   //   req.session.displayName = user.displayName; //user 객체의 닉네임을 세션에 저장
    //   //   return req.session.save(function(){
    //   //     res.redirect('/welcome');
    //   //   });
    //   // }
    // }
    // done(null, false); //for문의 맞는 사용자가 없을 때
  }// end of LocalStrategy function
)); // end of LocalStrategy
passport.use(new FacebookStrategy({
    clientID: '1840733199510901',
    clientSecret: 'ad245cb56ba5a1e2f7f8e07af2538235',
    callbackURL: "/auth/facebook/callback",
    profileFields:['id','email','displayName','gender','link','locale',
    'name','timezone','updated_time','verified']
    // 사용자 중에 email이 없다면 해당 SNS사이트에가서 이메일을 인증받아야함
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'facebook:'+profile.id;
    pool.getConnection(function(err, connection){
      var sql = 'select * from users where authId=?';
      connection.query(sql, [authId], function(err, results){
        if(results.length > 0){ //사용자가 존재한다면
          connection.release();
          done(null, results[0]);
        } else {
          var newuser = {
            'authId':authId,
            'displayName':profile.displayName,
            'email': profile.emails[0].value
          };
        pool.getConnection(function(err, connection){
          var sql = 'insert into users set ?';
          connection.query(sql, newuser, function(err, resutls){
            if(err){
              console.log(err);
              done('Error');
              connection.release();
            } else {
              done(null, newuser);
              connection.release();
            }
          });
        });
      }
      });
    });
  }
));

  passport.use(new TwitterStrategy({
      consumerKey: '3B7AG1uxos0XHOuEgtVDcOBsL',
      consumerSecret: '21GZRLpisDFGT6EZqWWapEzcg2aynAL0XvmDnMIw2yV8gLmVsp',
      callbackURL: "/auth/twitter/callback",
      userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"//트위터에서 이메일 받는 법 와씌바 존나어렵네
  },
  function(token, tokenSecret, profile, done) {
    console.log(profile);
    var authId = 'twitter:'+profile.id;
    pool.getConnection(function(err, connection){
      var sql = 'select * from users where authId=?';
      connection.query(sql, [authId], function(err, results){
        if(results.length > 0){ //사용자가 존재한다면
          connection.release();
          done(null, results[0]);
        } else {
          var newuser = {
            'authId':authId,
            'displayName':profile.displayName,
            'email':profile.emails[0].value
          };
        pool.getConnection(function(err, connection){
          var sql = 'insert into users set ?';
          connection.query(sql, newuser, function(err, resutls){
            if(err){
              console.log(err);
              done('Error');
              connection.release();
            } else {
              done(null, newuser);
              connection.release();
            }
          });
        });
      }
      });
    });

  }
));

passport.use(new GoogleStrategy({
    clientID: '777905994972-3a9e6a0j500t5dfurqe17a411i0i34rd.apps.googleusercontent.com',
    clientSecret: 'vIbzliejJPAmlDg9MqXC-aBN',
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId = 'google:'+profile.id;
    pool.getConnection(function(err, connection){
      var sql = 'select * from users where authId=?';
      connection.query(sql, [authId], function(err, results){
        if(results.length > 0){ //사용자가 존재한다면
          connection.release();
          done(null, results[0]);
        } else {
          var newuser = {
            'authId':authId,
            'displayName':profile.displayName,
            'email':profile.emails[0].value
          };
        pool.getConnection(function(err, connection){
          var sql = 'insert into users set ?';
          connection.query(sql, newuser, function(err, resutls){
            if(err){
              console.log(err);
              done('Error');
              connection.release();
            } else {
              done(null, newuser);
              connection.release();
            }
          });
        });
      }
      });
    });

  }
));

    // for(var i=0; i<users.length;i++){
    //   var user = users[i];
    //   if(user.authId === authId){
    //     return done(null, user);
    //   }
    // }
    //
    // users.push(newuser);
    // done(null, newuser);

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

 app.get(
   '/auth/twitter',
   passport.authenticate(
     'twitter'
   )
 );

 app.get(
   '/auth/twitter/callback',
   passport.authenticate(
     'twitter',
     {
       successRedirect: '/welcome',
       failureRedirect: '/auth/login'
     }
   )
 );

 app.get(
   '/auth/google',
  passport.authenticate(
      'google',
      {
        scope: ['profile', 'email']
    }
  )
);
app.get(
    '/auth/google/callback',
  passport.authenticate(
    'google',
    {
      failureRedirect: '/auth/login',
    }
  ),
  function(req, res) {
   // Successful authentication, redirect home.
   res.redirect('/welcome');
 }
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
  res.render('login');
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

// email ------------------------------------------ 인증
// app.get('/auth/email', function(req, res){
//   res.render('register');
// });

var rand = "_"+parseInt(Math.random() * 12345678910)+"_";
console.log(rand);




app.get('/auth/:name/:code' , function(req, res){
  var name = req.params.name;
  var code = req.params.code;
  console.log(rand);
  console.log(code);
  console.log(name);


  if(code === rand){
    pool.getConnection(function(err, connection){
      var e_authentication = 1;
      console.log(e_authentication);
      var sql = "update users set e_authentication=? where username=?";
      connection.query(sql, [e_authentication, name], function(err, result){
        if(err) {
        console.log(err);
         res.redirect('/auth/login');
        connection.release();
      }
        else{
          res.redirect('/welcome');
          connection.release();
        }
      });
    }); // pool of end

  } // end of if

});





app.listen(3003, function(){
  console.log('Connected 3003 port!!!');
});
