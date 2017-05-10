var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MySQLStore = require('express-mysql-session')(session);
var nodemailer = require('nodemailer'); //이메일 인증
var SMTPServer = require('smtp-server').SMTPServer;
var SMTPConnection = require('nodemailer/lib/smtp-connection');
var sinon = require('sinon');
var HttpConnectProxy = require('proxy-test-server');
var chai = require('chai');
var net = require('net');
var app = express();
app.use(bodyParser.urlencoded({ extended: false}));
















app.listen("3003", function(){
  console.log("--------------server open");
});;
