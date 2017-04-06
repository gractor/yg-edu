var mysql      = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '111111',
  database : 'o2'
});

conn.connect();


var sql='updata topic (title,description, author) values(?,?,?)';
var params =['Superviser','Watcher','graphittie'];
conn.query(sql,params, function(err, rows, fields){
  if(err){
    console.log(err);
  }
  else{
    console.log(rows.insertId);
  }
})
conn.end();
