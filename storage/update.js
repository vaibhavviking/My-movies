const fs = require('fs');
const keys = require('../keys2');
const fetch = require('node-fetch');

const updatelist = () => {
    let movies = {};
    let arr = keys.genres;
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let id = arr[i].id;
        let name = arr[i].name;
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=0aa29159f6dd2a6237127a2053adc853&language=en-US&sort_by=popularity.desc&with_genres=${id}`).then(response => response.json()).then(data => {
            data = data["results"];
            
            // console.log(data);
            movies[`${name}`] = data;
            fs.writeFile('./storage/movieslist.json', JSON.stringify(movies, null, 4), (err) => {
                if (err) throw err;
                // console.log('saved');
            });
        });
        // let data = await response.json();
    }
    // console.log(JSON.stringify(movies,null,4));
}

const readlist = async  ()=>{
    return new Promise((resolve,reject)=>{
        fs.readFile('./storage/movieslist.json', (err, data) => {
            if (err) throw err;
            let obj = JSON.parse(data.toString());
            // console.log(obj);
            resolve(obj);
        })
    }
    )
}


exports.readlist = readlist;
exports.updatelist = updatelist;