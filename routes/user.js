const router = require('express').Router();
const path = '../views/user/';
const Usermovies = require('../models/user_movies');
const domain = require('./domain')
const fetch = require('node-fetch');
const keys = require('../keys');
const movies= require('./movies');
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
        let user = await User.findOne({email : temp[i].email});
        let obj = {
            name : user.name,
            reviewtitle : temp[i].reviewtitle,
            reviewtext : temp[i].reviewtext,
            rating : temp[i].rating
        };
        reviews.push(obj);
    }
    console.log(reviews);
    data1.reviews = reviews;
    // res.render(path + 'moviedetails', { data: JSON.stringify(data1, null, 2), path: href, fav, rating: rate, review });
    res.send(data1);
})


router.post('/markfav', async (req, res) => {
    let movieid = req.body.id;
    console.log(movieid);
    let email = req.user.email;
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
    let email = req.user.email;
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

router.post('/submitreview', async (req,res)=>{
    let data = req.body.data;
    let email = req.user.email;
    let movieid=req.body.id;
    let moviename=req.body.name;
    let obj = (Object.fromEntries([...new URLSearchParams(data)]));
    let title=obj.title;
    let text=obj.text;
    let rating=obj.rating;
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
                moviename,
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

router.get('/userfavourite',async (req,res)=>{
    res.render(path+'user_favourite_movies.ejs',{path : href});
})

router.get('/raterev',(req,res)=>{
    res.render(path + 'user_rate_reviews.ejs',{path : href});
})

module.exports = router;