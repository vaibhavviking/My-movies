const router = require('express').Router();
const path = '../views/common/';
const domain = require('./domain')
const passport = require('passport');
const href = domain.href;
const bcrypt = require('bcrypt');
const keys = require('../keys');
const saltRounds = keys.salt;
const User = require('../models/user');
const hash = async (pass) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(pass, saltRounds, (err, hash) => {
            resolve(hash);
        })
    })
}

const compare = async (pass, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pass, hash, (err, result) => {
            resolve(result);
        })
    })
}

router.get('/login', async (req, res) => {
    let temp = await hash('abc');
    // console.log(temp);
    if (req.user) {
        res.redirect('/user/home');

    } else {
        let error = req.flash('error');
        let message = req.flash('message');
        console.log(message);
        res.render(path + 'login', { path: href, error, message });
    }
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login', failureFlash: true, passReqToCallback: true }), async (req, res) => {
    let id = req.user._id;
    // console.log('here', req.user);
    res.redirect('/user/home');
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/signup', (req, res) => {
    let name = req.query.name;
    let email = req.query.email;
    let error = req.flash('error');
    res.render(path + 'signup', { name, email, path: href, error });
})

router.post('/signup', async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.password;
    let repass = req.body.repassword;
    console.log(req.body);
    if (pass != repass) {
        req.flash('error', 'passwords do not match');
        res.redirect(`/auth/signup/?name=${name}&email=${email}`);
    } else {
        // let flag = await cquery(`select * from account where email = '${email}';`, req, res);
        let flag = await User.find({ email });
        if (flag.length) {
            req.flash('error', 'email is already registered');
            res.redirect(`/auth/signup/?name=${name}&email=${email}`);
        } else {
            pass = await hash(pass);
            let user = new User({
                name,
                password: pass,
                email
            })
            let result = await user.save();
            req.flash('message', 'You are signed up now. Please login.');
            res.redirect('/auth/login');
        }
    }
})

router.get('/google/redirect', passport.authenticate('google'), async (req, res) => {
    // console.log(err,'here');
    // console.log(req.added);
    if (req.added == false) {
        req.logout();
        res.redirect('/auth/signup?' + 'name=' + req.name + "+" + req.fname + '&email=' + req.email);
        // req.logout();
    } else {
        let id = req.user._id;
        console.log('here', req.user);
        res.redirect('/user/home');
        
    }
})

module.exports = router;