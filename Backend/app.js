const express = require('express');
const dotenv = require('dotenv');
const app =  express();

dotenv.config(
    {path: './.env'}
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Hello World where are u');
})

app.listen(port, () => console.log(`Server is Running on ${port}`))
