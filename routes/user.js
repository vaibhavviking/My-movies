const router = require('express').Router();
const path = '../views/user/';
const Usermovies = require('../models/user_movies');
const domain = require('./domain')
const fetch = require('node-fetch');

const href = domain.href;
router.get('/home', (req, res) => {
    console.log(req.user);
    res.render(path + 'user_home.ejs', { path: href });
})


router.get('/moviedetails', async (req, res) => {
    let movieid = req.query.id;
    let email = 'chandravaibhav65@gmail.com';
    // let d1=await fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=0aa29159f6dd2a6237127a2053adc853&language=en-US`);
    // let data1 = await d1.json();
    let data1 = {
        adult: false,
        backdrop_path: '/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg',
        belongs_to_collection: null,
        budget: 63000000,
        genres: [{ id: 18, name: 'Drama' }],
        homepage: 'http://www.foxmovies.com/movies/fight-club',
        id: 550,
        imdb_id: 'tt0137523',
        original_language: 'en',
        original_title: 'Fight Club',
        overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.',
        popularity: 40.901,
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        production_companies: [
            {
                id: 508,
                logo_path: '/7PzJdsLGlR7oW4J0J5Xcd0pHGRg.png',
                name: 'Regency Enterprises',
                origin_country: 'US'
            },
            {
                id: 711,
                logo_path: '/tEiIH5QesdheJmDAqQwvtN60727.png',
                name: 'Fox 2000 Pictures',
                origin_country: 'US'
            },
            {
                id: 20555,
                logo_path: '/hD8yEGUBlHOcfHYbujp71vD8gZp.png',
                name: 'Taurus Film',
                origin_country: 'DE'
            },
            {
                id: 54051,
                logo_path: null,
                name: 'Atman Entertainment',
                origin_country: ''
            },
            {
                id: 54052,
                logo_path: null,
                name: 'Knickerbocker Films',
                origin_country: 'US'
            },
            {
                id: 25,
                logo_path: '/qZCc1lty5FzX30aOCVRBLzaVmcp.png',
                name: '20th Century Fox',
                origin_country: 'US'
            },
            {
                id: 4700,
                logo_path: '/A32wmjrs9Psf4zw0uaixF0GXfxq.png',
                name: 'The Linson Company',
                origin_country: 'US'
            }
        ],
        production_countries: [
            { iso_3166_1: 'DE', name: 'Germany' },
            { iso_3166_1: 'US', name: 'United States of America' }
        ],
        release_date: '1999-10-15',
        revenue: 100853753,
        runtime: 139,
        spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }],
        status: 'Released',
        tagline: 'Mischief. Mayhem. Soap.',
        title: 'Fight Club',
        video: false,
        vote_average: 8.4,
        vote_count: 21626
    };
    let userdata = await Usermovies.find({ email, movieid });
    let fav=0, rate=0, review="";
    console.log(data1);
    if (userdata.length) {
        if(userdata[0].favourite){
            fav = userdata[0].favourite;
        }
        if(userdata[0].rating){
            rate = userdata[0].rating;
        }
        if(userdata[0].review){
            review = userdata[0].review;
        }
    }
    res.render(path + 'moviedetails', { data: JSON.stringify(data1, null, 2), path: href, fav, rating: rate, review });
})


router.post('/markfav', async (req, res) => {
    let movieid = req.body.movieid;
    // let email = req.user.email;
    let email = req.body.email;
    let res1 = await Usermovies.find({ email, movieid });
    console.log(res1);
    if (res1.length) {
        Usermovies.updateOne({ _id: res1[0]._id }, { $set: { "favourite": 1 } }, (err, result) => {
            if (err) throw err;
            res.send(result);
        })
    } else {
        let obj = new Usermovies({
            email,
            movieid,
            favourite: 1
        })
        console.log('here');
        obj.save().then(result => {
            res.send(result);
        })
    }
})

router.post('/unmarkfav', async (req, res) => {
    let movieid = req.body.movieid;
    // let email = req.user.email;
    let email = req.body.email;
    let res1 = await Usermovies.find({ email, movieid });
    console.log(res1);
    if (res1.length) {
        Usermovies.updateOne({ _id: res1[0]._id }, { $set: { "favourite": 0 } }, (err, result) => {
            if (err) throw err;
            res.send(result);
        })
    } else {
        let obj = new Usermovies({
            email,
            movieid,
            favourite: 0
        })
        console.log('here');
        obj.save().then(result => {
            res.send(result);
        })
    }
})

router.post('/rate', async (req, res) => {
    let movieid = req.body.movieid;
    let rating = req.body.rating;
    let email = req.body.email;
    console.log(email, rating);
    let res1 = await Usermovies.find({ email, movieid });
    console.log(res1);
    if (res1.length) {
        Usermovies.updateOne({ _id: res1[0]._id }, { $set: { "rating": rating } }, (err, result) => {
            if (err) throw err;
            res.send(result);
        })
    } else {
        let obj = new Usermovies({
            email,
            movieid,
            rating
        })
        console.log('here');
        obj.save().then(result => {
            res.send(result);
        })
    }
})

router.post('/review', async (req, res) => {
    let movieid = req.body.movieid;
    let review = req.body.review;
    let email = req.body.email;
    console.log(email, review);
    let res1 = await Usermovies.find({ email, movieid });
    console.log(res1);
    if (res1.length) {
        Usermovies.updateOne({ _id: res1[0]._id }, { $set: { "review": review } }, (err, result) => {
            if (err) throw err;
            res.send(result);
        })
    } else {
        let obj = new Usermovies({
            email,
            movieid,
            review
        })
        console.log('here');
        obj.save().then(result => {
            res.send(result);
        })
    }
})


module.exports = router;