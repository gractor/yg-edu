module.exports = function(express,app,io) {

  var router = express.Router();

  var mysql = require('mysql');
  var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: '111111'
  });


  router.post('/', function(req, res, next) {

    global.sendName=req.session.displayName;
    global.takeName=req.body.takeName;

    pool.getConnection(function(err, connection) {
      if (err) console.error("커넥션 객체 얻어오기 에러 : ", err);

      var datas = [sendName, takeName, takeName, sendName];

      var sql = "select * from chat where send_id=? and take_id =? or send_id=? and take_id =?";
      connection.query(sql, datas, function(err, rows) {
        if (err) console.error(err);

        res.render('chat', {rows: rows, takeName : takeName, sendName : sendName});
        connection.release();
      });
    });
  });

  io.on('connection', function(socket) {



    console.log('user connected: ', socket.id);
    io.to(socket.id).emit('change name', sendName);

    socket.on('disconnect', function() {
      console.log('user disconnected: ', sendName);
    });

    socket.on('send message', function(name, text, takeName) {
      var msg = text;
      var name = name;
      var takeName = takeName;
      var datas = [name, msg, takeName];
      pool.getConnection(function(err, connection) {
        var sqlForInsertBoard = "insert into chat(send_id, content, take_id) values(?,?,?)";
        connection.query(sqlForInsertBoard, datas, function(err, rows) {
          if (err) console.error("err : " + err);
          connection.release();
        });
      });
      io.emit('receive message', msg ,name);
    });
  });
  return router;
};
