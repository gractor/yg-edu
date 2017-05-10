var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer'); //이메일 인증
var smtpTransport = require('nodemailer-smtp-transport');
var SMTPServer = require('smtp-server').SMTPServer; //SMTP config
var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/mail', function(req, res){
  let poolConfig = 'smtps://user%40gmail.com:pass@smtp.gmail.com/?pool=true';
  server = new SMTPServer({
      onAuth(auth, session, callback){
        auth = {
          username : 'user',
          password : '123'
        };
          if(auth.username !== 'user' || auth.password !== '123'){
              return callback(new Error('Invalid username or password'));
              res.send(error);
          }
          callback(null, {user: 'Admin'}); // where 123 is the user id or similar property
          res.send(user);
      }


  });

  let smtpConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
          user: 'user@gmail.com',
          pass: 'pass'
      }
  };




  server.listen(587,function(){
    console.log("Mail Server Open");
  });
  console.log(server);
});










app.listen('3003', function(){
  console.log("3003 port Server");
});
