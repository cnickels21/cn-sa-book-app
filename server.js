'use strict'; 

// App requirements
require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('./public'))

const PORT = process.env.PORT || 3000;

// Modules
const bookHandler = require('./modules/books')

// Server Paths
app.get('/', (request, response) => {
    response.render('pages/index');
})

app.get('/search', (request, response) => {
    response.render('pages/searches/new');
})

app.post('/show', bookHandler)

// app.get('/hello', (request, response) => {
//     response.render('pages/index');
// });

// app.get('/hello', bookHandler);

// Listen
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});