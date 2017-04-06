var express = require('express');
var app = express();

app.get('/',function(req,res){
    res.send('Hello home page');;

});

app.get('/route', function(req,res){
  res.send('Hello Router,<img src="route.png">')
})
app.get('/topic',function(req,res){
var topics=[
  'Javascript is....',
  'Nodejs is....',
  'Express is...',
];
var output =`
<a href ="/topic?id=0">javascript</a></br>
<a href ="/topic?id=1">Nodejs</a></br>
<a href ="/topic?id=2">Express</a></br><br>

${topics[req.query.id]}
`
res.send(output);


})
app.get('/login', function(req,res){
  res.send('<h1>Login please</h1>');

});
app.listen(3000,function(){
  console.log('Conneted 3000 port!');
});
