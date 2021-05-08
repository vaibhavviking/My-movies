const router = require('express').Router();
const path = '../views/user/';
const Usermovies = require('../models/user_movies');
const domain = require('./domain')
const fetch = require('node-fetch');
const keys = require('../keys2');
// const movies= require('./movies');
const Movie = require('../models/movies');
const href = domain.href;
// const {data1} = require('./moviedetailsdemo');
const User = require('../models/user');
const {readlist} = require('../storage/update');
// let movies = {};
router.get('/home',async (req, res) => {
    // console.log(req.user);
    let movies = await readlist();
    res.render(path + 'user_home.ejs', { path: href, movies: JSON.stringify(movies) });
})

router.get('/homemovies',async (req,res)=>{
    res.send(movies);
})

router.get('/moviedetails', (req, res) => {
    res.render(path + 'moviedetails.ejs', { path: href });
})

router.get('/favouritelist', (req, res) => {
    res.render(path + 'user_favourite_movies.ejs', { path: href });
})

router.post('/getmoviedetails', async (req, res) => {
    let movieid = req.body.id;
    console.log(movieid);
    let email = req.user.email;
    let d1=await fetch(`https://api.themoviedb.org/3/movie/${movieid}?api_key=0aa29159f6dd2a6237127a2053adc853&language=en-US&append_to_response=videos,credits`);
    let data1 = await d1.json();
    
    let userdata = await Usermovies.find({ email, movieid });
    let fav = 0, rate = 0, review = "";
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
    let reviews=[];
    let temp = await Usermovies.find({movieid});
    let len = temp.length;
    console.log(len);
    for(let i=0;i<len;i++){
        if(temp[i].reviewtitle){
            let user = await User.findOne({email : temp[i].email});
            let obj = {
                name : user.name,
                reviewtitle : temp[i].reviewtitle,
                reviewtext : temp[i].reviewtext,
                rating : temp[i].rating
            };
            reviews.push(obj);
        }
    }
    console.log(reviews);
    data1.reviews = reviews;
    // res.render(path + 'moviedetails', { data: JSON.stringify(data1, null, 2), path: href, fav, rating: rate, review });
    res.send(data1);
})


router.post('/markfav', async (req, res) => {
    let movieid = req.body.id;
    console.log(movieid);
    let email;
    if(!req.user){
        email='test';
    }else{
        email = req.user.email;
    }
    let {name,rating,poster,overview}=req.body;
    await checkmovie(movieid,name,rating,poster,overview);
    // console.log(movieid,name,rating,poster);
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
    let movieid = req.body.id;
    // let email = req.user.email;
    let email;
    if(!req.user){
        email='test';
    }else{
        email = req.user.email;
    }
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

router.post('/submitreview', async (req,res)=>{
    let data = req.body.data;
    let email;
    if(req.user){
        email = req.user.email;
    }else{
        email='test';
    }
    let movieid=req.body.id;
    console.log(movieid);
    let {name,poster,overview}=req.body;
    let obj = (Object.fromEntries([...new URLSearchParams(data)]));
    // console.log(obj);
    let title=obj.title;
    let text=obj.text;
    let rating=obj.rating;
    await checkmovie(movieid,name,rating,poster);
    if(text.length==0 && title.length==0){
        console.log('here');
        res.send({
            message: 'Please Enter the review'
        })
    }else{

        let old=await Usermovies.findOne({movieid,email});
        if(old){
            console.log('found');
            await Usermovies.updateOne({movieid,email},{$set : {"reviewtext":text,"reviewtitle":title,"rating":rating}});
        }else{
            let temp = new Usermovies({
                movieid,
                email,
                reviewtext: text,
                reviewtitle: title,
                rating
            })
            temp.save()
        }
        console.log(obj);
        res.send({
            message: 'Review submitted successfully!'
        })
    }
})

router.get('/favourite',async (req,res)=>{
    let email = req.user.email;
    let result = await Usermovies.find({email, favourite: 1});
    let len=result.length;
    let data = [];
    console.log(result);
    for(let i=0;i<len;i++){
        let id=result[i].movieid;
        let temp = await Movie.findOne({movieid:id});
        let obj = {
            movieid: id,
            name:temp.name,
            rating: temp.rating,
            overview: temp.overview,
            poster: temp.poster
        }
        data.push(obj);
    }
    // console.log(data);
    res.render(path+'user_favourite_movies.ejs',{path : href, data});
})

router.get('/raterev',async (req,res)=>{
    let email = req.user.email;
    let result = await Usermovies.find({email});
    let len=result.length;
    let data = [];
    for(let i=0;i<len;i++){
        if(result[i].rating){
            let temp = {}
            temp = await Movie.findOne({movieid: result[i].movieid});
            temp.userrating = result[i].rating;
            temp.title=result[i].reviewtitle;
            temp.text=result[i].reviewtext;
            // console.log(temp);
            data.push(temp);
        }
    }
    console.log(data);
    res.render(path + 'user_rate_reviews.ejs',{path : href, data});
})

const checkmovie = async (id,name,rating,poster,overview) => {
    let result = await Movie.findOne({movieid: id});
    if(!result){
        let obj = new Movie({
            movieid: id,
            name,
            rating,
            poster,
            overview
        })
        await obj.save();
    }
}

module.exports = router;