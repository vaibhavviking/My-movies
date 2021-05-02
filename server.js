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
// const customStrategy = require('./config/custom-strategy');
const passportSetup = require('./config/passport-setup');
require("dotenv").config();
// const keys2 = require('./config/keys');
const keys = require('./keys')
const app = express();
const Genre = require('./models/genres');
app.use(cors());
const port = process.env.PORT || 5000;

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.sessionKey]
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

mongoose.connect(keys.mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });

const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB database linked successfully!");
});

// var options = {
//     method: 'GET',
//     url: 'https://movie-database-imdb-alternative.p.rapidapi.com/',
//     params: { s: 'Avengers Endgame', page: '1', r: 'json' },
//     headers: {
//         'x-rapidapi-key': '995509b1bcmsh464a63f549f320ap1f00a1jsnbe4725223c26',
//         'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com'
//     }
// };

// app.get('/', (req, res) => {
    // fetch('https://api.themoviedb.org/3/discover/movie?api_key=0aa29159f6dd2a6237127a2053adc853&language=en-US&sort_by=popularity.desc&page=1&with_cast=true').then(response => response.json()).then(data => {
    //     // console.log(data); 
    //     res.render('Home/Home.ejs', { data: JSON.stringify(data, null, 2) })

    // })
// })


const auth = (req, res, next) => {
    console.log(req.user);
    if (req.user) {
        next();
    } else {
        console.log('boom');
        res.redirect('/auth/login');
    }
}

app.use("/", homeRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
// app.use('/profile', auth, profileRouter);
// app.use('/librarian', auth, librarianRouter);

app.listen(port, () => {
    console.log("Server is running at port : ", port);
});

// image https://image.tmdb.org/t/p/w500

// let genres = {"genres":[{"id":28,"name":"Action"},{"id":12,"name":"Adventure"},{"id":16,"name":"Animation"},{"id":35,"name":"Comedy"},{"id":80,"name":"Crime"},{"id":99,"name":"Documentary"},{"id":18,"name":"Drama"},{"id":10751,"name":"Family"},{"id":14,"name":"Fantasy"},{"id":36,"name":"History"},{"id":27,"name":"Horror"},{"id":10402,"name":"Music"},{"id":9648,"name":"Mystery"},{"id":10749,"name":"Romance"},{"id":878,"name":"SciFi"},{"id":53,"name":"Thriller"},{"id":10752,"name":"War"},{"id":37,"name":"Western"}]};

// let arr =genres["genres"];
// let temp = {};
// arr.forEach(item => {
//     temp[item.name] = item.id;
// })
// console.log(temp);