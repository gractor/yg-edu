var express = require('express');
var bodyParser = require('body-parser');//body-parser 모듈을 사용
var fs = require('fs');
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  port     :  3307,
  user     : 'root',
  password : '111111',
  database : 'o2'
});

conn.connect();
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));//패턴으로외울것
app.locals.pretty = true;// jade html줄바꿈 설정
app.set('views', './views_mysql');//express 설정
app.set('view engine', 'jade');//jade 모듈 설정
app.get('/topic/add', function(req, res){
  var sql = 'select id, title from topic';
  conn.query(sql, function(err, topics, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('add', {topics:topics});
  });
});
app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var sql = 'insert into topic (title, description, author) values(?,?,?)';
  conn.query(sql, [title, description, author], function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/topic/'+result.insertId);
    }
  });
});
app.get(['/topic/:id/edit'], function(req, res){
  var sql = 'select id, title from topic';
  conn.query(sql, function(err, topics, fields){ //바깥쪽
    console.log(topics);
    var id = req.params.id;
    if(id){
      var sql = 'select * from topic where id=?';
      conn.query(sql, [id], function(err, topic, fields){//배열이므로 0을 줌
        if(err){                                         //안쪽
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('edit',{topics:topics, topic:topic[0]})//배열이므로 0을리턴
        }
      });
    } else {
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }

  });
});
app.post(['/topic/:id/edit'], function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'update topic set title=?, description=?, author=? where id=?';
  conn.query(sql, [title, description, author, id], function(err, result, fields){
    if(err){                                         //안쪽
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/topic/'+id);
    }
  });
});
//삭제, 수정와 같은 작업을 하는 경우에는 POST방식을 사용해야함
app.get('/topic/:id/delete', function(req,res){
  var sql = 'select id, title from topic';
  var id = req.params.id;
  conn.query(sql, function(err, topics, fields){
    var sql = 'select * from topic where id=?';
    conn.query(sql, [id], function(err, topic){
      if(err){                                         //안쪽
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        if(topic.length === 0){
          console.log('There is no record.');
          res.status(500).send('Internal Server Error');
        } else {
          res.render('delete',{topics:topics, topic:topic[0]});//배열이므로 0을리턴
        }
      }
    });
  });
});
app.post('/topic/:id/delete', function(req,res){
  var id = req.params.id;
  var sql = 'delete from topic where id=?';
  conn.query(sql, [id], function(err, result){
    res.redirect('/topic/');
  });
});
app.get(['/topic', '/topic/:id'], function(req, res){
  var sql = 'select id, title from topic';
  conn.query(sql, function(err, topics, fields){ //바깥쪽
    console.log(topics);
    var id = req.params.id;
    if(id){
      var sql = 'select * from topic where id=?';
      conn.query(sql, [id], function(err, topic, fields){//배열이므로 0을 줌
        console.log('----------');
        console.log(topic);
        if(err){                                         //안쪽
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.render('view',{topics:topics, topic:topic[0]})//배열이므로 0을리턴
        }
      });
    } else {
      res.render('view',{topics:topics});
    }

  });
    // FS.READDIR('DATA', FUNCTION(ERR, FILES){
    //   IF(ERR){
    //     CONSOLE.LOG(ERR);
    //     RES.STATUS(500).SEND('INTERNAL SERVER ERROR');
    //   }
    //   VAR ID = REQ.PARAMS.ID;
    //   IF(ID){
    //     //ID값이 있을 때
    //     FS.READFILE('DATA/'+ID, 'UTF-8',FUNCTION(ERR, DATA){
    //       IF(ERR){
    //         CONSOLE.LOG(ERR);
    //         RES.STATUS(500).SEND('INTERNAL SERVER ERROR');
    //       }
    //       RES.RENDER('VIEW', {TOPICS:FILES, TITLE:ID, DESCRIPTION:DATA});
    //     })
    //   } ELSE {
    //     //ID값이 없을 때
    //     RES.RENDER('VIEW', {TOPICS:FILES, TITLE:'WELCOME', DESCRIPTION:'HELLO, JAVASCRIPT FOR SERVER.'});
    //   }
    // });
});
// app.get('/topic/:id', function(req, res){
//   var id = req.params.id;
//   fs.readdir('data', function(err, files){
//     if(err){
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//     fs.readFile('data/'+id, 'utf-8',function(err, data){
//       if(err){
//         console.log(err);
//         res.status(500).send('Internal Server Error');
//       }
//       res.render('view', {topics:files, title:id, description:data});
//     })
//   })
// })
// app.post('/topic', function(req, res){
//   var title = req.body.title;
//   var description = req.body.descriptio n;
//   fs.writeFile('data/'+title,description, function(err){
//     if(err){
//       console.log(err);
//       res.status(500).send('Internal Server Error');
//     }
//     res.redirect('/topic/'+title);
//   });
// });
app.listen(3000, function(){
  console.log('Connected, 3000 port!');
});
