const express = require("express");
const passport = require('passport');

const cors = require("cors");
const ejs = require("ejs");
const mysql = require('mysql');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');

const Mail = require("nodemailer/lib/mailer");
require("dotenv").config();

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: "iamthereckoning"
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});
app.use(express.json());
app.set('view engine', 'ejs');

app.use(express.static('views'));
app.set('views', __dirname + '/views');

var db_config;
// Local Host
if (1) {
    db_config = {
        multipleStatements: true,
        host: 'localhost',
        user: 'vaibhav',
        password: 'password',
        database: 'mydb',
        port: 3306
    };
} else {

    // ClearDB
    // var db_config = {
    //     multipleStatements: true,
    //     host: keys.db_host,
    //     user: keys.db_user,
    //     password: keys.db_password,
    //     database: keys.db_name,
    //     port: 3306
    // };
}


function handleDisconnect() {
    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function (err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

const cquery = async (sql, req, res) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) throw err;
            resolve(result);
        })
    }
    )
}

// const auth = (req, res, next) => {
//     if (req.user) {
//         next();
//     } else {
//         res.redirect('/auth/login');
//     }
// }

app.get('/',(req,res)=>{
    res.render('Home/Home.ejs',{data : "Well Hello There!!"});
})

app.listen(port, () => {
    console.log("Server is running at port : ", port);
});
