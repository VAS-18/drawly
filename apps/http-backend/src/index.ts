import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';
import { middleware } from './middleware.js';

const app = express(); 

app.use(express.json());

app.post('/signup', (req, res)=>{
    res.json({
        message: "succ",
        userId : "123"
    })
});

app.post('/signin', (req, res)=>{
    const userId = 1;

    const token = jwt.sign({
        userId,
    }, JWT_SECRET);


    res.json({
        token
    })
});

app.post('/room',middleware, (req, res)=>{
    //db call

    res.json({
        roomId: 123
    })
})





app.listen(3001);