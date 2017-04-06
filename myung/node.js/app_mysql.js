var express = require('express');
var bodyParser =require('body-parser');
var multer =require('multer');

var _storage=
multer.diskStorage({
  destination:function(req,
  file,cb){

   cb(null,'uploads/')
},
filename:function(req,file,cb){
  cb(null,file.originalname);
}
})
var upload = multer({storage:_storage})
var fs = require('fs');
var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});
conn.connect();

var app = express();
app.locals.pretty=true;
app.use(bodyParser.urlencoded({extended: false}));
app.use('/user',express.static('uploads'));
app.set('views','./views_mysql');
app.set('view engine', 'jade');
app.get('/upload',function(req,res){
  res.render('upload');
});
app.post('/upload', upload.single('userfile'),
function(req,res){
  res.send('Uploaded:'+req.file.filename);
});
app.get('/topic/add', function(req, res){//글추가하기 get방식
  var sql = 'select id,title from topic'; //id랑 title topic테이블에서 가져오기
  conn.query(sql, function(err, topics, fields){//쿼리문 sql문에 위에서 가져온값 넣기
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('add',{topics:topics});// add.jade 페이지로 이동한다
  });
});
app.post('/topic/add', function(req, res){//글추가하기
  var title = req.body.title;//제목
  var description =req.body.description;//내용
  var author =req.body.author;//작가
  var sql='insert into topic (title,description,author) values(?,?,?)';//value는
  conn.query(sql, [title,description,author], function(err, result, fileds){//배열에다가 담아서 보여준다
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
        res.redirect('/topic/'+result.insertId);// 사용자가 추가한 행의 아이디값
    }
  });
})

app.get(['/topic/:id/edit'], function(req,res){//글수정get방식
  var sql = 'select id,title from topic';
  conn.query(sql, function(err, topics, fields){
  var id = req.params.id;
  if(id){
    var sql = 'select * from topic where id=?';
    conn.query(sql, [id],function(err,topic,fields){//topics의 값은 배열이기때문에
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
           res.render('edit', {topics:topics, topic:topic[0]});
         //하나의값만 가져오기 위해 0을씀
      }
    });

    //아이디값이 있으면 상세보기
  }else{
    console.log('There is no id.');
    res.status(500).send('Internal Server Error');  //없으면 그냥 보기
  }
    });
});
app.post(['/topic/:id/edit'], function(req,res){//편집기능
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id= req.params.id;
  var sql='update topic set title=?,description=?, author=? where id=?';
  conn.query(sql, [title, description, author, id], function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
      res.redirect('/topic/'+id);
    }
  });
});
app.get('/topic/:id/delete',function(req, res){//삭제기능
  var sql ='select id,title from topic';
  var id = req.params.id;
  conn.query(sql, function(err, topics,fields){
    var sql ='select * from topic where id=?';
    conn.query(sql, [id], function(err,topic){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
        if(topic.length === 0){//데이터가 없으면 삭제 x
          console.log('There is no record');
          res.status(500).send('Internal Server Error');
        }else{
           res.render('delete', {topics:topics,topic:topic[0]});
         }
      }
    });
  });
});
app.post('/topic/:id/delete',function(req, res){
  var id = req.params.id;
  var sql ='delete from topic where id=?';
  conn.query(sql, [id], function(err, result){
    res.redirect('/topic/');
  });
});
app.get('/topic/:id',function(req,res){// 누르면 이동
  var id = req.params.id;


  if(id){
    var sql = 'select * from topic where id=?';

    conn.query(sql, [id], function(err, topics,fields){
          var view_cnt=topics[0].VIEW_CNT+1;
      var sql = 'UPDATE topic SET view_cnt=? where id=?';
      conn.query(sql,[view_cnt, id],function(err,row,fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
          res.render('view1',{topic:topics[0]});
      }
})
    })
  }
});

app.get(['/topic'], function(req,res){
  // 글목록보여주는곳
  var sql = 'select * from topic order by id desc';
  conn.query(sql, function(err, topics, fields){
          res.render('view', {topics:topics});
         //하나의값만 가져오기 위해 0을씀
      });
    });

    //아이디값이 있으면 상세보기

app.listen(3000,function(){
  console.log('Connected, 3000 port!')
})
