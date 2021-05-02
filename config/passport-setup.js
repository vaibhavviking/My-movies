const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../keys');
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    if(id==-1){
        done(null,{_id:-1});
    }else{
        User.findById(id).then(result =>{
            console.log('not here',result);
            if(result){
                done(null,result);
            }else{
                done(null,null);
            }
        })
    }
});


passport.use(
    new GoogleStrategy({
        clientID: keys.clientID,
        clientSecret: keys.clientSecret,
        callbackURL: '/auth/google/redirect',
        passReqToCallback: true
    }, (req,accessToken, refreshToken, profile,email, done) => {
        let sql = 'select * from account where email = ?';
        User.find({email : email.emails[0].value}).then(result => {
            // console.log(result);
            req.email=email.emails[0].value;
            req.name=email.name.givenName;
            req.fname=email.name.familyName;
            if(result.length){
                done(null,result[0]);
                
            }else{
                req.added=false;
                // console.log(req.added);
                done(null,{_id : -1});
            }
        })
    })
)