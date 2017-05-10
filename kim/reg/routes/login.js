// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('login');
// });
//
// module.exports = router;

module.exports = function(passport){
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var pool = require('../config/mysql/db')();
  var route = require('express').Router();
  var nodemailer = require('nodemailer'); //이메일 인증
  var SMTPServer = require('smtp-server').SMTPServer; //SMTP config


  route.get('/auth/logout', function(req, res){
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

  route.post('/auth/register', function(req, res){
    hasher({password:req.body.password}, function(err, pass, salt, hash){
      var user = {
        authId : 'local:' + req.body.username,
        username : req.body.username,
        password : hash,
        salt: salt,
        displayName : req.body.displayName
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
    //Setup mailer transport, I chose gmail. Create an routelication-specific password to avoid problems.
    // create reusable transporter object using the default SMTP transport


    let transporter = nodemailer.createTransport({
        port : 465,
        host : 'smtp.naver.com',
        service: 'naver',
        auth: {
            user: 'fkam12@naver.com',
            pass: 'zoavn125'
        },
          tls: {
              ciphers: 'SSLv3'
          }
    });

      // setup email data with unicode symbols
      let mailOptions = {
        from: 'fkam12@naver.com', //grab form data from the request body object
        to: req.body.username,
        subject: '[소통박스] 이메일 인증을 클릭하여 회원가입을 완료해주세요!',
        // text: req.body.message,
        html :"<h1>안녕하세요! "+req.body.username+" 님!</h1>"+"<br>"
        +"<a href='http://localhost:3003/auth/"+ req.body.username + "/"+ rand + "'>인증</a>" +
        "을 해주세요!"
    // '<a href="localhost:3003/auth/'+ req.body.name +'/'+ rand + '">인증</a>'
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        //Email not sent
        if (error) {
          console.log(error);
        }
        //Yay!! Email sent
        else {
          console.log(info);
        }
      });

  });

  route.get('/findpass', function(req, res){
    res.render('findpass1');
  });

  route.post('/findpass', function(req, res){
    var uname = req.body.username;

    pool.getConnection(function(err, connection){
      var sql = "select username, password from users where username =? ";
      connection.query(sql, [uname], function(err, result){
        if(err){
          console.log(err);
        } else {
            hasher({password:rand}, function(err, pass, salt, hash){
                var passModify = {
                  password : hash,
                  salt: salt
            };
          pool.getConnection(function(err, connection){
            var sql = "update users set ? where username = ?";
            connection.query(sql, [passModify, uname], function(err, result){
              if(err){
                console.log(err);
              } else {
                res.redirect('/');
              }
            });
          });
        });
          if(result[0].username === req.body.username && uname === result[0].username){
            var mailOpts, smtpTrans;
            //Setup mailer transport, I chose gmail. Create an routelication-specific password to avoid problems.
            // create reusable transporter object using the default SMTP transport


            let transporter = nodemailer.createTransport({
                port : 465,
                host : 'smtp.naver.com',
                service: 'naver',
                auth: {
                    user: 'fkam12@naver.com',
                    pass: 'zoavn125'
                },
                  tls: {
                      ciphers: 'SSLv3'
                  }
            });

              // setup email data with unicode symbols
              let mailOptions = {
                from: 'fkam12@naver.com', //grab form data from the request body object
                to: req.body.username,
                subject: '[소통박스] 임시비밀번호가 발송되었습니다!',
                // text: req.body.message,
                html :"<h1>안녕하세요! "+req.body.username+" 님!</h1>"+"<br>"
                + "임시비밀번호는 : <h1>"+ rand +"</h1> 입니다!"
            // '<a href="localhost:3003/auth/'+ req.body.name +'/'+ rand + '">인증</a>'
              };

              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                //Email not sent
                if (error) {
                  console.log(error);
                }
                //Yay!! Email sent
                else {
                  console.log(info);
                }
              });
              connection.release();
          } // end of if
        }  //end of else
      }); //end of connection
    });
  });

  // route.get('/findpass/:username/confirm', function(req, res){
  //   var uname = req.params.username;
  //
  //   pool.getConnection(function(err, connection){
  //     var sql = "select * from users where username = ?";
  //     connection.query(sql, [uname], function(err, result){
  //       if(err) {
  //         console.log(err);
  //       } else {
  //         res.render("passConfirmForm1", {result:result});
  //       }
  //     }); //end of connection
  //   }); //end of pool
  // });
  //
  // route.post('/findpass/:username/confirm', function(req, res){
  //   var uname = req.params.username;
  //   var pass = req.body.password;
  //   var passConfirm = req.body.passwordConfirm;
  //   hasher({password:pass}, function(err, pass, salt, hash){
  //       var confirmPass = {
  //         password : hash,
  //         salt: salt
  //       };
  //
  //
  //   if(pass === passConfirm){
  //     pool.getConnection(function(err, connection){
  //       var sql = "update users set ? where username=?";
  //       connection.query(sql, [confirmPass, uname], function(err, result){
  //         if(err) {
  //           console.log(err);
  //         } else {
  //           connection.release();
  //           res.redirect('/auth/login');
  //         }
  //       });
  //     });
  //   }
  //
  // });
  //
  // });
  route.get('/auth/reg', function(req, res){
    res.render('reg');
  });

  route.get('/auth/register', function(req, res){
    res.render('register2');
  });











      // for(var i=0; i<users.length;i++){
      //   var user = users[i];
      //   if(user.authId === authId){
      //     return done(null, user);
      //   }
      // }
      //
      // users.push(newuser);
      // done(null, newuser);

  route.post(
    '/auth/login',
    passport.authenticate( //패스포트의 미들웨어로 받음
      'local',
      {
        successRedirect: '/welcome', //해당 코드를 주석처리하면 아래의 함수 호출
        failureRedirect: '/auth/login',
        failureFlash: false
      }
    ));
    route.get(
      '/auth/facebook',
      passport.authenticate(
        'facebook',
        {scope : 'email'}
      )
    );
    route.get(
      '/auth/facebook/callback',
    passport.authenticate(
      'facebook',
      {
         successRedirect: '/welcome',
         failureRedirect: '/auth/login'
       }
     )
   );

   route.get(
     '/auth/twitter',
     passport.authenticate(
       'twitter'
     )
   );

   route.get(
     '/auth/twitter/callback',
     passport.authenticate(
       'twitter',
       {
         successRedirect: '/welcome',
         failureRedirect: '/auth/login'
       }
     )
   );

   route.get(
     '/auth/google',
    passport.authenticate(
        'google',
        {
          scope: ['profile', 'email']
      }
    )
  );
  route.get(
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
  // route.post('/auth/login', function(req, res){
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


  route.get('/auth/login', function(req, res){
    res.render('login1');
  });


  route.get('/welcome', function(req, res){
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
          <li><a href="/auth/reg">Register</a></li>
        </ul>
      `);
    }
  });

  // email ------------------------------------------ 인증
  // route.get('/auth/email', function(req, res){
  //   res.render('register');
  // });

  var rand = "^$@"+parseInt(Math.random() * 12345678910)+"_";
  console.log(rand);




  // route.get('/auth/:name/:code' , function(req, res){
  //   var name = req.params.name;
  //   var code = req.params.code;
  //   console.log(rand);
  //   console.log(code);
  //   console.log(name);
  //
  //
  //   if(code === rand){
  //     pool.getConnection(function(err, connection){
  //       var e_authentication = 1;
  //       console.log(e_authentication);
  //       var sql = "update users set e_authentication=? where username=?";
  //       connection.query(sql, [e_authentication, name], function(err, result){
  //         if(err) {
  //         console.log(err);
  //          res.redirect('/auth/login');
  //         connection.release();
  //       }
  //         else{
  //           res.redirect('/welcome');
  //           connection.release();
  //         }
  //       });
  //     }); // pool of end
  //
  //   } // end of if
  //
  // }); 이거는 나중에 비밀번호 변경할 때 유용할듯ㅋㅋ


  route.get('/', function(req, res){
    res.render('home.ejs');
  });

  route.get('/reg', function(req, res){
    res.render('reg.ejs');
  });

  route.post('/emailConfirm', function(req, res){
    var ajax_email = req.body.email;
    console.log(ajax_email);

    pool.getConnection(function(err, connection){
      var sql = "select count(username) as e_num from users where username=?";
      connection.query(sql, [ajax_email], function(err, result){
        if(err){
          console.log(err);
        } else {
          console.log(result[0].e_num);
          res.json(result[0].e_num);
          connection.release();
        }
        }); //end of connection
      }); //end of pool
  }); //end of route


  route.post('/displayNameConfirm', function(req, res){
    var ajax_displayName = req.body.displayName;
    console.log(ajax_displayName);

    pool.getConnection(function(err, connection){
        var sql = "select count(displayName) as d_num from users where displayName=?";
        connection.query(sql, [ajax_displayName], function(err, result){
          if(err){
            console.log(err);
          } else {
            console.log(result[0].d_num);
            res.json(result[0].d_num);
            connection.release();
          }
        }); // end of connection
    }); //end of pool
  }); //end of route


  return route;
};
