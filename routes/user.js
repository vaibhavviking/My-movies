const router = require('express').Router();
const path = '../views/user/';
const Usermovies = require('../models/user_movies');
const domain = require('./domain')


const href = domain.href;
router.get('/home',(req,res)=>{
    console.log(req.user);
    res.render(path+'user_home.ejs',{path : href });
})

router.post('/markfav',async (req,res)=>{
    let movieid = req.body.movieid;
    let email = req.user.email;
    let res1= Usermovies.find({email,movieid});
    if(res1){
        Usermovies.updateOne({_id : res1._id},{$set : {"favourite" : 1}},(err,result)=>{
            if(err) throw err;
            res.send(result);
        })
    }else{
        let obj = new Usermovies({
            email,
            movieid,
            favourite: 1
        })
        obj.save().then(result => {
            res.send(result);
        })
    }
})

module.exports = router;