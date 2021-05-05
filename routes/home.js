const router = require('express').Router();
const path = '../views/common/';
const domain = require('./domain')
const Genre = require('../models/genres');
const href = domain.href;
const fetch = require('node-fetch')
const keys = require('../keys');
const fs = require('fs');
const User = require('../models/user');
const Usermovies=require('../models/user_movies')
// const movies = require('./movies');
const { readlist } = require('../storage/update');

router.get('/', async (req, res) => {
    let movies = await readlist();
    res.render(path + 'home.ejs', { path: href, movies: JSON.stringify(movies) });
})

// router.get('/homemovies',async (req, res) => {
//     res.send(movies);
// })

router.get('/moviedetails', (req, res) => {
    res.render(path + 'moviedetails.ejs', { path: href });
})

router.post('/getmoviedetails', async (req, res) => {
    let movieid = req.body.id;
    console.log(movieid);
    let d1 = await fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=0aa29159f6dd2a6237127a2053adc853&language=en-US&append_to_response=videos,credits`);
    let data1 = await d1.json();
    let fav = 0, rate = 0, review = "";
    if (req.user) {
        
        let email = req.user.email;
        let userdata = await Usermovies.find({ email, movieid });
        // console.log(data1);
        if (userdata.length) {
            if (userdata[0].favourite) {
                fav = userdata[0].favourite;
            }
            if (userdata[0].rating) {
                rate = userdata[0].rating;
            }
            if (userdata[0].review) {
                review = userdata[0].review;
            }
        }
        data1.fav = fav;
        data1.rating = rate;
        data1.review = review;
    }
    console.log(fav,rate,review);
    let reviews = [];
    let temp = await Usermovies.find({ movieid });
    let len = temp.length;
    console.log(len);
    for (let i = 0; i < len; i++) {
        let user = await User.findOne({ email: temp[i].email });
        let obj = {
            name: user.name,
            reviewtitle: temp[i].reviewtitle,
            reviewtext: temp[i].reviewtext,
            rating: temp[i].rating
        };
        reviews.push(obj);
    }
    console.log(reviews);
    data1.reviews = reviews;
    // res.render(path + 'moviedetails', { data: JSON.stringify(data1, null, 2), path: href, fav, rating: rate, review });
    res.send(data1);
})

module.exports = router;