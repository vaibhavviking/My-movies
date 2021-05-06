const router = require('express').Router();
const path = '../views/common/';
const domain = require('./domain')
const Genre = require('../models/genres');
const href = domain.href;
const fetch = require('node-fetch')
const keys = require('../keys');
const fs = require('fs');
const User = require('../models/user');
const Usermovies = require('../models/user_movies')
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
    let id=req.query.id;
    if(req.user){
        res.redirect('/user/moviedetails?id='+id);
    }else{
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
    res.render(path + 'search_movies.ejs', { path: href });
})

router.post('/searchmovie', async (req, res) => {
    let query = req.body.query;
    let d1= await fetch(`https://api.themoviedb.org/3/search/movie?api_key=0aa29159f6dd2a6237127a2053adc853&query=${query}`);
    let data = await d1.json();
    // let temp = [
    //     {
    //         "adult": false,
    //         "backdrop_path": "/aEIj4P4JYk5uY25HfnfEl9wHthF.jpg",
    //         "genre_ids": [
    //             18,
    //             53,
    //             9648,
    //             28
    //         ],
    //         "id": 87516,
    //         "original_language": "en",
    //         "original_title": "Oldboy",
    //         "overview": "An everyday man has only three and a half days and limited resources to discover why he was imprisoned in a nondescript room for 20 years without any explanation.",
    //         "popularity": 15.086,
    //         "poster_path": "/iX93YdBrZA1EpGbphmjf4ARj1Za.jpg",
    //         "release_date": "2013-11-14",
    //         "title": "Oldboy",
    //         "video": false,
    //         "vote_average": 5.9,
    //         "vote_count": 1439
    //     },
    //     {
    //         "adult": false,
    //         "backdrop_path": null,
    //         "genre_ids": [],
    //         "id": 707112,
    //         "original_language": "en",
    //         "original_title": "Autobiography of Oldboy",
    //         "overview": "A three and- a-half-hour video diary of the making of Oldboy. This was included as a special feature in the DVD and Blu Ray releases of Oldboy and was a special feature in Arrow Video's release of the film.",
    //         "popularity": 1.767,
    //         "poster_path": null,
    //         "release_date": "2005-02-28",
    //         "title": "Autobiography of Oldboy",
    //         "video": false,
    //         "vote_average": 0,
    //         "vote_count": 0
    //     },
    //     {
    //         "adult": false,
    //         "backdrop_path": "/hKNGaQFzg4RxyMWIGGnYGW5b2Xh.jpg",
    //         "genre_ids": [
    //             18,
    //             53,
    //             9648,
    //             28
    //         ],
    //         "id": 670,
    //         "original_language": "ko",
    //         "original_title": "올드보이",
    //         "overview": "With no clue how he came to be imprisoned, drugged and tortured for 15 years, a desperate businessman seeks revenge on his captors.",
    //         "popularity": 19.632,
    //         "poster_path": "/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg",
    //         "release_date": "2003-11-21",
    //         "title": "Oldboy",
    //         "video": false,
    //         "vote_average": 8.3,
    //         "vote_count": 5752
    //     },
    //     {
    //         "adult": false,
    //         "backdrop_path": null,
    //         "genre_ids": [],
    //         "id": 667251,
    //         "original_language": "pt",
    //         "original_title": "Super Oldboy",
    //         "overview": "Bil is an elderly man who works as an office boy for a firm in São Paulo, as he does not pay for a bus ticket and takes a preferential line at the bank. One day he gets involved in an unusual bank robbery.",
    //         "popularity": 0.6,
    //         "poster_path": "/slTEyNSLNN1tTaL5PUpzeCG60wA.jpg",
    //         "release_date": "2016-01-01",
    //         "title": "Super Oldboy",
    //         "video": false,
    //         "vote_average": 0,
    //         "vote_count": 0
    //     },
    //     {
    //         "adult": false,
    //         "backdrop_path": "/xJkhQrJPXMFjkCMW5HXNQGgQxzG.jpg",
    //         "genre_ids": [
    //             35,
    //             18
    //         ],
    //         "id": 41454,
    //         "original_language": "da",
    //         "original_title": "Oldboys",
    //         "overview": "Now in his fifties, Vagn leads a solitary life and plays football with a group of similarly aged men, some even older. After being left behind at a petrol station by his teammates on their way to a match in Sweden, he encounters a young habitual offender and together they set off in hot pursuit of Vagn's buddies. A Nordic road movie taking in a whole series of comic, serious and, above all, well-written scenarios.",
    //         "popularity": 2.883,
    //         "poster_path": "/jaChFl4VzBe3QsKSoxB5BbNTX94.jpg",
    //         "release_date": "2009-12-25",
    //         "title": "Oldboys",
    //         "video": false,
    //         "vote_average": 5.7,
    //         "vote_count": 11
    //     }
    // ]
    res.send(data.results);
})

module.exports = router;