
'use strict'; 

// App requirements
require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', error => {throw error});

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('./public'))

const PORT = process.env.PORT || 3000;

// Modules
const searchHandler = require('./modules/books')

// Server Paths
app.get('/', (request, response) => {
    response.render('pages/index', getBooks(request, response));
})

app.get('/search', (request, response) => {
    response.render('pages/searches/new');
})

app.post('/show', searchHandler)

// app.get('/hello', (request, response) => {
//     response.render('pages/index');
// });

// app.get('/hello', bookHandler);

// Listen

function getBooks(request, response) {
  const SQL = 'SELECT * FROM books';

  client.query(SQL)
  .then(results => {
    const { rowCount, rows } = results;
    // console.log('/ db result', rows);

    response.render('index', {
      books: rows
    });
  });
};




client.connect()
    .then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  })
  .catch(error => {
    throw `Something went wrong: ${error}`;
  });
