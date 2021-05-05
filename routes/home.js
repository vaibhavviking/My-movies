const router = require('express').Router();
const path = '../views/common/';
const domain = require('./domain')
const Genre = require('../models/genres');
const href = domain.href;
const fetch = require('node-fetch')
const keys = require('../keys');
const fs = require('fs');
// const movies = require('./movies');
const {readlist} = require('../storage/update');

router.get('/', async (req, res) => {
    let movies = await readlist();
    res.render(path + 'home.ejs', { path: href, movies : JSON.stringify(movies) });
})

// router.get('/homemovies',async (req, res) => {
//     res.send(movies);
// })


module.exports = router;