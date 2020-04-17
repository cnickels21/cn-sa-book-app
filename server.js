
'use strict';

// App requirements
require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', error => { throw error });

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('./public'))

const PORT = process.env.PORT || 3000;

// Modules
const searchHandler = require('./modules/books')

// Server Paths
app.get('/', getBooks);


app.get('/search', (request, response) => {
  response.render('pages/searches/new');
})


// app.get('/tasks/:task_id', getOneTask);

app.post('/show', searchHandler);

app.post('/books', addBook);

app.get('/details/:id', getOneBook);

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
      response.render('pages/index', {
        books: rows,
      });

    })
    .catch(err => handleError(err, response));
};




client.connect()
  .then(() => {
    console.log('Database connected.');
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  })
  .catch(error => {
    throw `Something went wrong: ${error}`;
  });

function handleError(err, response) {
  let viewModel = {
    error: err,
  };
  response.render('pages/error', viewModel);
}


function addBook(request, response) {
  // console.log('POST /books', request.body);
  const { title, authors, isbn, image_url, summary } = request.body;
  console.log(image_url, summary);
  const SQL = `
      INSERT INTO books (title, authors, isbn , image_url, summary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
  const values = [title, authors, isbn, image_url, summary];

  // POST - REDIRECT - GET
  client.query(SQL, values)
    .then(results => {
      console.log(results);
      let id = results.rows[0].id;
      response.redirect(`/details/${id}`);
    })
    .catch(err => handleError(err, response))
}


function getOneBook(request, response) {

  const SQL = `
      SELECT *
      FROM books
      WHERE id = $1
      LIMIT 1;
    `;

  client.query(SQL, [request.params.id])
    .then(results => {
      const { rows } = results;

      if (rows.length < 1) {
        handleError('Book Not Found', response)
      } else {
        response.render('pages/searches/details', {
          books: rows[0]
        });
      }
    })
    .catch(err => handleError(err, response))
}