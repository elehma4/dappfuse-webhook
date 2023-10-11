const express = require('express');
const app = express();
require('dotenv').config();


const port = 3017;

app.use(express.static('public'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

// API
app.use(require('./routes/api/events.js'))

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})