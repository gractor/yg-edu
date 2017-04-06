var mysql = require('mysql');
var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '941021',
  database: 'o2'
});

con.connect();

//select문
// var sql = 'select * from topic';

// con.query(sql, function(err, rows, fields){
//   if(err){
//     console.log(err);
//   }else{
//     for(var i = 0; i < rows.length; i++){
//       console.log(rows[i].title);
//     }
//   }
// });

//isnert문
// var sql = "insert into topic (title, description, author) values (?,?,?)";
// var params = ['Supervisor','Watcher','graphittie'];

// con.query(sql, params , function(err, rows, fields){
//   if(err){
//     console.log(err);
//   }else{
//     console.log(rows.insertId);
//   }
// });

//update문
// var sql = "update topic set title = ?, description = ? where id = ?";
// var params = ['test','test','4'];

// con.query(sql, params , function(err, rows, fields){
//   if(err){
//     console.log(err);
//   }else{
//     console.log(rows);
//   }
// });

//delete문
// var sql = "delete from topic where id = ?";
// var params = [4];

// con.query(sql, params , function(err, rows, fields){
//   if(err){
//     console.log(err);
//   }else{
//     console.log(rows);
//   }
// });

con.end();