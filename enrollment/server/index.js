const express = require('express');
const app = express();
const mongoose = require('mongoose');
const games = require('./Routes/route');

app.use('/', games);

const db = 'mongodb://localhost:27017/mongo-games';
mongoose.connect(db, { useNewUrlParser: true }, err => {
    if (err)
        console.log('Error! ' + err);
    else
        console.log('Connected to mongodb.');
});

app.get('/', (req, res) => {
    res.send('Default Route.');
});

const port = 4000;
app.listen(port, () => console.log("Listening on port " + port + "..."));