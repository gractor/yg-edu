// mysql dbms연결
var mysql = require('mysql');
var client = mysql.createConnection({
  host : 'localhost',
  port : 3307,
  user : 'root',
  password : '111111',
  database : 'o2'
});
var http = require('http');
var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
