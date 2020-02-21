var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var cors        = require('cors');
var mysql       = require('mysql');
var path        = require('path');
var fileUpload  = require('express-fileupload') ;
const fs        = require('fs');
const multer = require('multer');
app.use(cors());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '"Origin, X-Requested-With, Authorization, Content-Type, Accept');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Authorization, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'myApp'
});
connection.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected with mysql database...')
});
var server = app.listen(3000, "localhost", function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)

});

const DIR = 'public/images/';
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({ storage: storage });





// use body parser so we can get info from POST and/or URL parameters
app.use(express.json());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
// use morgan to log requests to the console
app.use(morgan('dev'));
app.use(express.static(__dirname+"/dist"));
app.use(express.static('dist'));
    //rest api to post a single data
    app.post( '/create' , function ( req , res ) {
        const params = {
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            Email: req.body.Email,
            PhoneNumber : req.body.PhoneNumber
        }
        connection.query ( 'INSERT INTO tbl_contacts SET ?' , params , function ( error , results , fields ) {
            if ( error ) throw error;
            res.end ( JSON.stringify ( results ) );
        } );
    });
    //rest api to get a All data
    app.get('/getList', function (req, res) {
        // console
        connection.query('select * from tbl_contacts where status=0', function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
    });
    //rest api to get a single data
    app.get('/getUser/:id' , (req, res) => {
        connection.query('SELECT * FROM tbl_contacts WHERE id = ?',[req.params.id], (err, rows, fields) => {
            if (!err) {
                res.send ( rows );
            }else {
                console.log ( err );
            }
        });
    });

    //rest api to update record into mysql database
    app.put('/updateUser/', function (req, res) {
        connection.query('UPDATE `tbl_contacts` SET `FirstName`=?,`LastName`=?,`Email`=?,`PhoneNumber`=? where `id`=?', [req.body.FirstName, req.body.LastName, req.body.Email, req.body.PhoneNumber, req.body.id], function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
    });

    //rest api to delete record from mysql database
    app.post('/delete/', function (req, res) {
        connection.query('UPDATE `tbl_contacts` SET `Status`=? where `id`=?', [req.body.Status, req.body.id], function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
    });

    // development only
    app.post('/upload', function(req, res, next) {
        if ( !req.files ) {
            return res.status ( 400 ).send ( 'No files were uploaded.' );
        } else {
            var val = Math.floor(1000 + Math.random() * 9000);
            var file = req.files.uploaded_image;
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif" ) {
                    file.mv ( 'public/images/' + val+file.name , function ( error , results  ) {
                        if ( error ) throw error;
                        res.end ( JSON.stringify ( results ) );
                    });
            } else {
                console.log( "This format is not allowed , please upload file with '.png','.gif','.jpg'");
            }
        }
    });



// kick off the server
app.listen();
console.log('Backend is running on port');
