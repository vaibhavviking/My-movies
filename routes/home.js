const router = require('express').Router();
const path = '../views/common/';
const domain = require('./domain')
const Genre = require('../models/genres');
const href = domain.href;
const fetch = require('node-fetch')
const keys = require('../keys2');
const fs = require('fs');
const User = require('../models/user');
const Usermovies = require('../models/user_movies')
// const movies = require('./movies');
const { readlist } = require('../storage/update');

router.get('/', async (req, res) => {
    let movies = await readlist();
    res.render(path + 'home.ejs', { path: href, movies: JSON.stringify(movies) });
})


router.get('/moviedetails', (req, res) => {
    let id = req.query.id;
    if (req.user) {
        res.redirect('/user/moviedetails?id=' + id);
    } else {
        res.render(path + 'moviedetails.ejs', { path: href });
    }
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
    console.log(fav, rate, review);
    let reviews = [];
    let temp = await Usermovies.find({ movieid });
    let len = temp.length;
    console.log(len);
    for (let i = 0; i < len; i++) {
        if (temp[i].reviewtitle) {

            let user = await User.findOne({ email: temp[i].email });
            let obj = {
                name: user.name,
                reviewtitle: temp[i].reviewtitle,
                reviewtext: temp[i].reviewtext,
                rating: temp[i].rating
            };
            reviews.push(obj);
        }
    }
    console.log(reviews);
    data1.reviews = reviews;
    // res.render(path + 'moviedetails', { data: JSON.stringify(data1, null, 2), path: href, fav, rating: rate, review });
    res.send(data1);
})

router.get('/search', async (req, res) => {
    res.render(path + 'search_movies.ejs', { path: href, user: req.user });
})

router.post('/searchmovie', async (req, res) => {
    let query = req.body.query;
    let criteria = req.body.criteria;
    let d1 = await fetch(`https://api.themoviedb.org/3/search/${criteria}?api_key=0aa29159f6dd2a6237127a2053adc853&query=${query}`);
    let temp = await d1.json();
    let data=[];
    if(criteria=='movie'){
        data=temp.results;
    }else{
        temp=temp.results;
        let len=temp.length;
        for(let i=0;i<len;i++){
            let temp2=temp[i].known_for;
            let len2=temp2.length;
            for(let j=0;j<len2;j++){
                if(temp2[j].media_type=='movie'){
                    data.push(temp2[j]);
                }
            }
        }
    }
    res.send(data);
})

router.get('/page', (req,res)=>{
    res.render(path+'pagination.ejs', { path: href, user: req.user });
})

module.exports = router;