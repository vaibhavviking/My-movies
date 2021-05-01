const router = require('express').Router();
const path = '../views/common/';
const domain = require('./domain')
const Genre = require('../models/genres');
const href = domain.href;
const fetch = require('node-fetch')
const keys = require('../keys');

let movies = {};
router.get('/',async (req,res)=>{
    // let arr = keys.genres;
    // if(JSON.stringify(movies) === JSON.stringify({})){
    //     let len = arr.length;
    //     for(let i=0;i<len;i++){
    //             let id = arr[i].id;
    //             let name = arr[i].name;
    //             // console.log(id,name);
    //             let response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=0aa29159f6dd2a6237127a2053adc853&language=en-US&sort_by=popularity.desc&with_genres=${id}`);
    //             let data = await response.json();
    //             data = data["results"];
    //             // console.log(data);
    //             movies[`${name}`] = data;
            
    //     }
    // }
    // console.log(movies);
    res.render(path+'Home.ejs',{path : href, movies : JSON.stringify(movies,null,2)});
})


module.exports = router;