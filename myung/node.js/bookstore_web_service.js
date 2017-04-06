var express =require('express')
var bodyparser = require('body-parser')
var fs = require('fs')
var app =express();
app.locals.pretty =true;
app.set('view engine','jade');
app.set('view','./user_views');
app.use(bodyparser.urlencoded({extended:false}));

const port =3000;
app.listen(port, function(){
  console.log(`Server Running at http://127.0.0.1:${port}/`);
})

var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'goods'
});

conn.connect();

app.get(['/','/goods'], function(req,res){
  var sql ="select id, title, description from books order by title"
  conn.query(sql, function(error,results,fields){
    if(error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }else{
      res.render('list.jade',{goods:results});
    }
  })
})
app.get('/goods/add', function(req, res){
  res.render('add.jade');
})
app.post('/goods/add', function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  var good ={
    title:title,
    description:description
  };
  var sql = 'insert into books set ?';
  conn.query(sql, good,function(error,results,fields){
    if(error){
      console.log(error);
          res.status(500).send('Internal Server Error');
        }else{
          res.redirect('/goods');

    }
  })
})
app.get('/goods/:id/edit',function(req, res){
  var id = req.params.id;
  var sql ="select id, title, description from books where id =?";
  conn.query(sql,[id], function(err,results,fields){
    if(error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }else{
      res.render('edit.jade',{good:results[0]});
    }
  })
})
app.post('/goods/:id/edit', function(req, res){
  var id = req.params.id;
  var title = req.body.title;
  var description = req.body.description;
  var sql ="updata books set title=?, description=? where id=?";
  var params = [title, description, id];
  conn.query(sql, params, function(error, results, fields){
    if(error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }else{
      res.redirect('/goods/'+id);
    }
  })
})
app.post('/goods/:id/delete', function(req, res){
  var id = req.params.id;
  var sql ='delete from books where id =?';
  conn.query(sql, [id],function(error, results, fields){
    if(error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }else{
      res.redirect('/goods');
    }
  })
})

app.get('/goods/:id',function(req,res){
  var id = req.params.id;
  var sql ="select id, title, description from books where id=?";
  conn.query(sql, [id], function(error, resultes, fields){
    if(error){
      console.log(error);
      res.status(500).send('Internal Server Error');
    }else{
      res.render('view.jade', {good:results[0]});
    }
  })
})
