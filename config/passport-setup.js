const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../keys2');
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    if (id == -1) {
        done(null, { _id: -1 });
    } else {
        User.findById(id).then(result => {
            console.log('not here', result);
            if (result) {
                done(null, result);
            } else {
                done(null, null);
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
    }, (req, accessToken, refreshToken, profile, email, done) => {
        User.find({ email: email.emails[0].value }).then(result => {
            if (result.length) {
                done(null, result[0]);

            } else {
                let obj=new User({
                    email: email.emails[0].value,
                    name: email.name.givenName+" "+email.name.familyName,
                    active: true
                })
                obj.save().then(response => {
                    done(null, { _id: response._id });
                });
            }
        })
    })
)