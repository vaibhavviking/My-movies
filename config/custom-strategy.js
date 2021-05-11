const passport = require('passport');
const passportCustom = require('passport-custom');
const CustomStrategy = passportCustom.Strategy;
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const User = require('../models/user');
passport.serializeUser((user, done) => {
    done(null, user._id);
});



const compare = async (pass, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(pass, hash, (err, result) => {
            resolve(result);
        })
    })
}

passport.deserializeUser(async (id, done) => {
    let result = await User.findById(id);
    if(result){
        done(null,result);
    }
});


passport.use('local', new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    async (req, username, password, done) => {
        // console.log(req);
        console.log(username, password);
        let result = await User.find({"email" : username});
        if(result.length){

            bcrypt.compare(password, result[0].password, (err, result2) => {
                console.log(result2);
                if (result2 == true) {
                    if(result[0].active!=true){
                        done(null,false,req.flash("error", 'Please complete verification for '+username));
                    }else{
                        done(null,result[0]);
                    }
                } else {
                    console.log('boom1');
                    done(null, false, req.flash("error", 'Wrong email or password'));
                }
            })


            // let check = await bcrypt.compare(password, result[0].password);
            // console.log(check);
            // if(check){
            // }else{
            //     console.log('boom1');
            //     done(null, false, req.flash("error", 'Wrong email or password'));
            // }
        }else{
            console.log('boom2');
            done(null, false, req.flash("error", 'Wrong email or password'));
        }
    }
    ))
    