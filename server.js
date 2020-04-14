'use strict'; 

// App requirements
require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('./public'))

const PORT = process.env.PORT || 3000;

// Modules
const bookHandler = require('./modules/book')

// Server Paths
app.get('/', (request, response) => {
    response.render('pages/searches/new');
})

app.get('/hello', (request, response) => {
    response.render('pages/index');
});

// Listen
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});