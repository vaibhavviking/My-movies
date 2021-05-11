const router = require('express').Router();
const path = '../views/common/';
const domain = require('./domain')
const passport = require('passport');
const href = domain.href;
const bcrypt = require('bcrypt');
const keys = require('../keys2');
const saltRounds = keys.salt;
const User = require('../models/user');
const Token = require('../models/token');
const cryptoRandomString = require('crypto-random-string');
const nodemailer = require('nodemailer');
const hash = async (pass) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(pass, saltRounds, (err, hash) => {
            resolve(hash);
        })
    })
}

router.get('/login', async (req, res) => {
    let temp = await hash('abc');
    if (req.user) {
        res.redirect('/user/home');

    } else {
        let error = req.flash('error');
        let message = req.flash('message');
        if (String(error).split(' ').length == 5) {
            let email = String(error).split(' ')[4];
            console.log('verify');
            await verifyemail(email);
        }
        res.render(path + 'login', { path: href, error, message });
    }
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login', failureFlash: true, passReqToCallback: true }), async (req, res) => {
    let id = req.user._id;
    if(process.env.NODE_ENV=='test'){
        res.send('authenticated');
    }else{
        res.redirect('/user/home');
    }
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
                email,
                active: false
            })
            let result = await user.save();
            await verifyemail(email);
            req.flash('message', 'Please complete email verification.');
            res.redirect('/auth/login');
        }
    }
})

router.get('/google/redirect', passport.authenticate('google'), async (req, res) => {
    let id = req.user._id;
    console.log('here', req.user);
    res.redirect('/user/home');
})

const verifyemail = async (email) => {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let hash = '';
    for (let i = 20; i > 0; --i) {
        hash += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    let obj = new Token({
        email,
        hash,
        Date: new Date()
    })
    console.log(obj);
    await obj.save();
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: keys.ac_user,
            pass: keys.ac_pass
        },
    });
    let link = href + 'checktoken/?s=' + hash + '&email=' + email;
    var mailOptions = {
        from: 'no-reply@gmail.com',
        to: email,
        subject: 'Email Verification',
        html: "To verify your email, click this <a href='" + href + "auth/checktoken/?hash=" + hash + "&email=" + email + "'><span>link</span></a>.<br>This is a <b>test</b> email."
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) { throw err; }
        else {
            console.log("email sent:" + info.response);
        }
    })
}

router.get('/checktoken', async (req, res) => {
    let email = req.query.email;
    let hash = req.query.hash;
    let mess = await checktoken(email, hash);
    let head;
    if(mess[0]=='Your'){
        head='Success!';
    }else{
        head='Sorry!';
    }
    res.render(path+'token_verify', {head,data : mess});
    // res.send(mess);
})

const checktoken = async (email, hash) => {
    console.log(email, hash);
    await Token.deleteMany({ Date: { "$lt": new Date(Date.now() - 12 * 60 * 60 * 1000) } });
    let result = await Token.findOne({ email, hash });
    if (result) {
        await Token.deleteOne({ email, hash });
        await User.updateOne({ email }, { $set: { "active": true } });
        return 'Your token was verified! You may close this window now.';
    } else {
        return 'Token expired. Please try again.'
    }
}

module.exports = router;