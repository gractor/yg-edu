var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mysql = require('mysql');
var paginate = require('express-paginate');
var conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '111111',
  database : 'o2'
});
conn.connect();

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.locals.pretty=true;
app.set('views','./views_mysql');
app.set('view engine','jade');

app.get('/topic/add',function(req,res){
  var currentPage = req.query.page;
  var sel = req.query.sel;
  var find = req.query.find;
  var sql = 'SELECT * FROM topic';
  conn.query(sql, function(err,topics,fields){
    res.render('add',{topics:topics, currentPage:currentPage, sel:sel, find:find});
  });
});

app.post('/topic/add',function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  var author = req.body.author;
  var currentPage = req.query.page;
  var sql = 'INSERT INTO topic(title, description,author) VALUES(?,?,?)';
  conn.query(sql, [title, description, author], function(err, result, fields){
  //fs.writeFile('data/'+title, description, function(err){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }else{
    res.redirect('/topic/'+result.insertId+'?page='+currentPage);
    }
  });
});

app.get(['/topic/:id/edit'], function(req,res){
  var sql='SELECT id,title FROM topic';
  conn.query(sql, function(err,topics, fields){
    var id=req.params.id;
    var sel = req.query.sel;
    var find = req.query.find;
    var currentPage = req.query.page;
    if(id){
      var sql='SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err,topic,fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
          res.render('edit',{topics:topics,topic:topic[0], currentPage:currentPage, sel:sel, find:find});
        }
      });
    } else{
      console.log('There is no id.');
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post(['/topic/:id/edit'],function(req,res){
    var id=req.params.id;
    var title = req.body.title;
    var description=req.body.description;
    var author=req.body.author;
    var currentPage = req.query.page;
      var sql='UPDATE topic SET title=?,description=?,author=? WHERE id=?';
      conn.query(sql,[title,description,author,id], function(err,result,fields){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }else{
          res.redirect('/topic/'+id+'?page='+currentPage);
        }
      });
});

app.get(['/topic/:id/delete'],function(req,res){
  var sql='SELECT id,title FROM topic';
  var id = req.params.id;
  var sel = req.query.sel;
  var find = req.query.find;
  var currentPage = req.query.page;
  conn.query(sql,function(err, topics, fields){
    var sql = 'SELECT * FROM topic WHERE id=?';
    conn.query(sql, [id], function(err,topic){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }else{
        if(topic.length==0){
        console.log('There is no record.');
        res.status(500).send('Internal Server Error');
      }else{
        res.render('delete',{topics:topics, topic:topic[0], currentPage:currentPage, sel:sel, find:find});
      }
    }
    });
  });
});
app.post('/topic/:id/delete', function(req,res){
  var id = req.params.id;
  var currentPage = req.query.page;
  var sel = req.query.sel;
  var find = req.query.find;
  var sql='DELETE FROM topic WHERE id=?';
  conn.query(sql, [id], function(err, result){
    res.redirect('/topic?page='+currentPage+'&sel='+sel+'&find='+find);
  })
})


app.get(['/topic'],function(req,res){
  var sel = req.query.sel;
  var find = req.query.find;
   if(find==''){
       res.send('<script type="text/javascript">alert("검색어를 입력해주세요!!!"); location.replace("/topic")</script>');

   }
   if(sel=='title'){
    var sql ="SELECT count(*) id from topic where title like CONCAT('%','"+find+"','%')";
   }
   else if(sel=='description'){
     var sql ="SELECT count(*) id from topic where description like CONCAT('%','"+find+"','%')";
   }
   else if(sel=='author'){
     var sql ="SELECT count(*) id from topic where author like CONCAT('%','"+find+"','%')";
   }
   else if(sel=='tnd'){
     var sql ="SELECT count(*) id from topic where title like CONCAT('%','"+find+"','%') or description like CONCAT('%','"+find+"','%')";
   }else{
     var sql= "SELECT count(*) id from topic";}

   conn.query(sql, function(err,row,fields){
     var totalRows = row[0].id,
        pageCount = Math.ceil(totalRows/20),
        currentPage = 1,
        page = 0;

     if(sel=='title'){
       var sql ="SELECT * from topic where title like CONCAT('%','"+find+"','%') order by id desc limit ?,20";
     }
     else if(sel=='description'){
       var sql ="SELECT * from topic where description like CONCAT('%','"+find+"','%') order by id desc limit ?,20";
     }
     else if(sel=='author'){
       var sql ="SELECT * from topic where author like CONCAT('%','"+find+"','%') order by id desc limit ?,20";
     }
     else if(sel=='tnd'){
       var sql = "SELECT * from topic where title like CONCAT('%','"+find+"','%') or description like CONCAT('%','"+find+"','%') order by id desc limit ?,20";
     }else{
       var sql = "SELECT * from topic order by id desc limit ?,20";}

     if (typeof req.query.page !== 'undefined') {
       currentPage = +req.query.page;
       page = (currentPage-1)*20;
     }

      conn.query(sql,[page],function(err,topics,fields){
         res.render('view',{topics:topics, pageCount:pageCount, pageSize:10, totalRows:totalRows, currentPage:currentPage, moment:require('moment'), sel:sel, find:find});
      });
    });
  });
app.get(['/topic/:id'],function(req,res){
  var sql = 'SELECT * FROM topic';
  conn.query(sql, function(err,topics,fields){
    var id = req.params.id;
    var sel = req.query.sel;
    var find = req.query.find;
    if(id){
      var sql ='SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err,topic,fields){
        var currentPage = req.query.page;
        var view_cnt = topic[0].view_cnt;
        var sql = 'UPDATE topic SET view_cnt=? where id=?';
        conn.query(sql,[view_cnt+1, id],function(err,row,fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else{
            res.render('detail',{topics:topics, topic:topic[0],moment:require('moment'), currentPage:currentPage, sel:sel, find:find});
          }
        });
      });
    } else{
      res.render('detail',{topics:topics, page:page, sel:sel, find:find});
      }
  });
});

app.listen(3000,function(){
  console.log('Connected 3000');
})
