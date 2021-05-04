const router = require('express').Router();
const path = '../views/common/';
const domain = require('./domain')
const Genre = require('../models/genres');
const href = domain.href;
const fetch = require('node-fetch')
const keys = require('../keys');
const fs = require('fs');
const movies = require('./movies');

router.get('/', async (req, res) => {
    res.render(path + 'home.ejs', { path: href });
})

router.get('/homemovies', (req, res) => {
    res.send(movies.movies);
})


module.exports = router;