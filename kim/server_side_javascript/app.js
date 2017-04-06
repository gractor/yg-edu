//GET 방식 - Server에 있는 정보를 가져오는 것
//사용자에 있는 정보를 서버에 전송
//전송할 때 다른 방식 POST
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.locals.pretty = true;
app.set('view engine', 'jade'); //jade 설정
app.set('views', './views');
app.get('/form', function(req, res){
  res.render('form');
});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.get('/form_receiver', function(req, res){
  var title = req.query.title;
  var description = req.query.description;
  res.send(title+', '+ description);
});
app.post('/form_receiver', function(req, res){
  var title = req.body.title;//post는 req.body.~로 받음
  var description = req.body.description;
  res.send(title+', '+description);
});
app.get('/template', function(req, res){
  res.render('temp', {time:Date(), _title:'Jade'});//temp를 통해 렌더링
});
app.get('/', function(req, res){//매개변수가 약속됨
  //home으로 접속한 사용자에게
  res.send('Hello home page'); //사용설명서에 적혀있음
});
app.get('/dynamic', function(req, res){//다시 실행시켜야 리로드됨
  var lis = '';
  for(var i=0; i<5; i++){
    lis = lis + '<li>coding</li>';
  }
  var time = Date();
  var output =
  `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
      Hello!, Dynamic
      <ul>
      ${lis}
      </ul>
      ${time}
    </body>
  </html>`
  res.send(output);
});
app.get('/topic/:id', function(req, res){
  var topics = [
    'Javascript is...',
    'Nodejs is...',
    'Express is...'
  ];
  var output = `
    <a href='/topic/0'>Javascript</a><br>
    <a href='/topic/1'>NodeJs</a><br>
    <a href='/topic/2'>Express</a><br>
    ${topics[req.params.id]}
  `
  //쿼리스트링의 id값을 응답한다
  //parmas 라우터를 찾음
  //request 객체가 가지고있는 query라는 객체 그안의 id라는 값
  res.send(output);
});
app.get('/topic/:id/:mode', function(req, res){
  res.send(req.params.id+', '+req.params.mode);
})
app.get('/route', function(req, res){
  res.send('Hello Router, <img src="/과제1.jpg">')
});
app.get('/login', function(req, res){// '/'주소로 들어가서 보여줌
  //get 라우트(길을 찾는다)
  res.send('<h1>Login please</h1>');
});
app.listen(3000, function(){
  //3000 port를 리슨하면 콜백함수를 실행
  console.log('Connected 3000 port!');
});
