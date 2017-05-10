var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer'); //이메일 인증
var smtpTransport = require('nodemailer-smtp-transport');
var app = express();
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/contact', function(req, res){
  res.render('contact');
});

var rand = parseInt(Math.random() * 12345678910)+"#$#@%^";
console.log(rand);





app.post('/contact', function (req, res) {
  var mailOpts, smtpTrans;
  //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      service: 'Naver',
      auth: {
          user: 'fkam12@naver.com',
          pass: 'zoavn125'
      }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: req.body.name + ' &lt;' + req.body.email + '&gt;', //grab form data from the request body object
    to: 'me@gmail.com',
    subject: 'Website contact form',
    text: req.body.message + rand,
    html: '<a href="localhost:3003/auth/'
  };



  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    //Email not sent
    if (error) {
        res.render('contact', { msg: 'Error occured, message not sent.', err: true});
    }
    //Yay!! Email sent
    else {
        res.render('contact', { msg: 'Message sent! Thank you.', err: false });
    }
  });
});






app.listen('3000', function(){
  console.log("3000 port Server");
});
