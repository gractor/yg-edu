var OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'root'
});

var db = server.use('o2');
/*
db.record.get('#34:0').then(function(record){
  console.log('Loaded record: ',record.title);
})
*/

//SELECT
/*var sql = 'SELECT FROM topic';
db.query(sql).then(function(results){
  console.log(results);
});
*/

/*var sql = 'SELECT FROM topic WHERE @rid=:rid';
var param={
  params:{
    rid:'#34:0'
  }
};
db.query(sql,param).then(function(results){
  console.log(results);
});
*/
/*

//CREATE
var sql = "INSERT INTO topic(title, description) VALUES(:title, :description)";
var param={
  params:{
    title:'Express',
    description:'Express is framework for web'
  }
}
db.query(sql,param).then(function(results){
  console.log(results);
});
*/

//UPDATE
/*var sql = "UPDATE topic SET title=:title WHERE @rid=:rid";
db.query(sql,{params:{title:'Expressjs', rid:'#33:1'}}).then(function(results){
  console.log(results);
});
*/

//DELETE
var sql="DELETE FROM topic WHERE @rid=:rid";
db.query(sql,{params:{rid:'#33:1'}}).then(function(results){
  console.log(results);
})
