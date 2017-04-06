var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'jade');
app.set('views', './views');
app.locals.pretty = true;


app.get('/form', function(req, res){
    res.render('form');
});

app.get('/form_receiver', function(req, res){
    var title = req.query.title;
    var description = req.query.description;

    res.send(title+','+description);
});

app.post('/form_receiver', function(req, res){
    var title = req.body.title;
    var description = req.body.description;

     res.send(title+','+description);
});

app.get('/topic/:id', function(req, res){
    var topics = [
        'Java Script is...',
        'Nodejs is...',
        'Express is ...'
    ];
    var output = `
        <a href="/topic/0">JavaSciprt</a><br>
        <a href="/topic/1">Nodejs</a><br>
        <a href="/topic/2">Express</a><br>
        ${topics[req.params.id]}
    `
    res.send(output);
});

app.get('/topic/:id/:name', function(req, res){
    res.send(req.params.id+','+req.params.name);
});

app.get('/template', function(req, res){
    res.render('temp', {time:Date(), _title:'Jade Ex'});
});

app.get('/test/', function (req, res) {
    res.send('Hello Router, <img src="/test.jpg">');
});

app.get('/dynamic', function (req, res) {
    var lis = '';
    for(var i = 0 ; i < 5; i++){
        lis += '<li>conding</li>';
    }
    var time = Date();
    var output = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Document</title>
                </head>
                <body>
                    Hello, Dynamic!
                    <ul>      
                        ${lis}
                    </ul>
                    ${time}
                </body>
                </html>`
    res.send(output);
});

app.get('/', function (req, res) {
    res.send('Hello home page');
});

app.get('/login', function (req, res) {
    res.send('<h1>Login Please</h1>');
});

app.listen(3000, function () {
    console.log('Conneted 3000 port!');
});