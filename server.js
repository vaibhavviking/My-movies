const express = require("express");
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require("cors");
const ejs = require("ejs");
const mysql = require('mysql');
const cookieSession = require('cookie-session');
const homeRouter = require('./routes/home');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth-routes');
const flash = require('connect-flash');
const fetch = require('node-fetch')
const axios = require('axios').default;
const Mail = require("nodemailer/lib/mailer");
const LocalStrategy = require('passport-local').Strategy;
const customStrategy = require('./config/custom-strategy');
const passportSetup = require('./config/passport-setup');
const { updatelist,readlist } = require('./storage/update');
var fs = require('fs');
require("dotenv").config();
const keys = require('./keys')
const app = express();
const Genre = require('./models/genres');
const port = process.env.PORT || 5000;

app.use(cookieSession({
    maxAge:  60 * 60 * 1000,
    keys: [keys.sessionKey]
}))

app.use(cors());
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

if(process.env.NODE_ENV != 'test'){
    console.log('not a test');
    mongoose.connect(keys.mongo_uricloud, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
}else{
    console.log('just a test');
    mongoose.connect(keys.mongo_uri2, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
}

const connection = mongoose.connection;
connection.once("open", () => {
    console.log("MongoDB database linked successfully!");
});

// updatelist();

const auth = (req, res, next) => {
    // console.log(req.user);
    if (req.user) {
        next();
    } else {
        console.log('boom');
        res.redirect('/auth/login');
    }
}

app.use("/", homeRouter);
app.use('/auth', authRouter);
app.use('/user', auth, userRouter);

if(process.env.NODE_ENV != 'test'){

    app.listen(port, () => {
        console.log("Server is running at port : ", port);
    });
}

exports.app = app;

// image https://image.tmdb.org/t/p/w500
