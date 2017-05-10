var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');


var app = require('./config/mysql/express')();
var passport = require('./config/mysql/passport')(app);


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));






var login = require('./routes/login')(passport);
app.use('/', login);
module.exports = app;
