// const {cquery} = require('../user');
const { app } = require('../server');
const request = require('supertest');
const User = require('../models/user');
const { readlist } = require('../storage/update');
const Usermovies = require('../models/user_movies');

test('database should be working (Create/Read)', async () => {
    await User.deleteMany({});
    let obj = new User({
        name: 'abc',
        email: 'abc@d.com',
        password: 'pass'
    })
    await obj.save();
    let result = await User.findOne({ email: 'abc@d.com' });
    expect(result.email).toBe('abc@d.com');
})

test('database should be working (Update)', async () => {
    await User.updateOne({ email: 'abc@d.com' }, { $set: { "email": 'ab@d.com' } });
    let result = await User.findOne({ email: 'ab@d.com' });
    expect(result.email).toBe('ab@d.com');
})

test('database should be working (Delete)', async () => {
    await User.deleteOne({ email: 'ab@d.com' });
    let result = await User.findOne({ email: 'ab@d.com' });
    expect(result).toBe(null);
})

test('Homepage renders', async () => {
    let res = await request(app).get('/');
    expect(res.status).toBe(200);
})

test('Homepage movies received', async () => {
    let res = await readlist();
    expect(res).not.toBe({});
})

test('favourite working', async () => {
    await Usermovies.deleteOne({movie:-1,email: 'test'});
    let data = {
        id: -1,
    }
    let output = await request(app).post('/user/markfav').send(data);
    let result = await Usermovies.findOne({"email":'test', movieid: -1});
    // console.log(result);
    expect(result).not.toBe({});
    expect(result.favourite).toBe(1);
})

test('umark favourite working', async () => {
    let data = {
        id: -1,
    }
    let output = await request(app).post('/user/unmarkfav').send(data);
    let result = await Usermovies.findOne({"email":'test', movieid:-1});
    // console.log(result);
    expect(result).not.toBe({});
    expect(result.favourite).toBe(0);
})

test('rate/review movie working', async ()=>{
    await Usermovies.deleteOne({movie:-1,email: 'test'});
    let data = {
        rating: 7,
        title: 'TITLE',
        text: 'TEXT'
    };
    data = new URLSearchParams(data).toString();
    // console.log(data);
    let output = await request(app).post('/user/submitreview').send({id:-1,data:data});
    let result = await Usermovies.findOne({email:"test", movieid: -1});
    expect(result).not.toBe({});
    expect(result.rating).toBe(7);
    expect(result.reviewtext).toBe("TEXT");
    expect(result.reviewtitle).toBe("TITLE");
})
