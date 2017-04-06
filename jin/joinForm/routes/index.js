var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: '111111'
});


/* GET home page. */
router.get('/', function (req, res, next) {

    pool.getConnection(function (err, connection) {
        // Use the connection
        connection.query('SELECT * FROM board', function (err, rows) {
            if (err) console.error("err : " + err);

            res.render('index', {title: 'test', rows: rows});
            connection.release();

        });
    });
});
module.exports = router;
