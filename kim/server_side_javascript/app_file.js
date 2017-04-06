var express = require('express');
var bodyParser = require('body-parser');//body-parser 모듈을 사용
var fs = require('fs');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));//패턴으로외울것
app.locals.pretty = true;// jade html줄바꿈 설정
app.set('views', './views_file');//express 설정
app.set('view engine', 'jade');//jade 모듈 설정
app.get('/topic/new', function(req, res){
  fs.readdir('data', function(err, files){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new', {topics:files});
  });
});
app.get(['/topic', '/topic/:id'], function(req, res){
    fs.readdir('data', function(err, files){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      var id = req.params.id;
      if(id){
        //id값이 있을 때
        fs.readFile('data/'+id, 'utf-8',function(err, data){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          }
          res.render('view', {topics:files, title:id, description:data});
        })
      } else {
        //id값이 없을 때
        res.render('view', {topics:files, title:'Welcome', description:'Hello, Javascript for Server.'});
      }
    });
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
app.post('/topic', function(req, res){
  var title = req.body.title;
  var description = req.body.description;
  fs.writeFile('data/'+title,description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+title);
  });

});
app.listen(3000, function(){
  console.log('Connected, 3000 port!');
});
