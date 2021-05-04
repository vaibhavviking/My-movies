// const {cquery} = require('../user');
const {app} = require('../server');
const request = require('supertest');
const User = require('../models/user');


test('database should be working (Create/Read)', async()=>{
    await User.deleteMany({});
    let obj = new User({
        name : 'abc',
        email : 'abc@d.com',
        password : 'pass'
    })
    await obj.save();
    let result = await User.findOne({email : 'abc@d.com'});
    expect(result.email).toBe('abc@d.com');
})

test('database should be working (Update)', async()=>{
    await User.updateOne({email: 'abc@d.com'},{$set : {"email" : 'ab@d.com'}});
    let result = await User.findOne({email : 'ab@d.com'});
    expect(result.email).toBe('ab@d.com');
})

test('database should be working (Delete)', async()=>{
    await User.deleteOne({email: 'ab@d.com'});
    let result = await User.findOne({email : 'ab@d.com'});
    expect(result).toBe(null);
})

test('Homepage renders', async ()=>{
        let res = await request(app).get('/');
        expect(res.status).toBe(200);
})

test('Homepage movies received', async ()=>{
        let res = await request(app).get('/homemovies');
        // expect(res.status).toBe(200);
        console.log(res.body);
        expect(res.body).toBe({});
})



// test('rate route',async()=>{
//     let data = {
//         isbn : 1,
//         rating : 2
//     }
//     let output = await request(app).post('/rate').send(data);
//     // let message = output.message;
//     // const { message } = JSON.parse(output._getData());
//     console.log(output.json);
//     expect(output.status).toBe(200);
// })