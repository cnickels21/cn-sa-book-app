
'use strict';

// App requirements
require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const pg = require('pg');
const methodOverride = require('method-override');

const client = new pg.Client(process.env.DATABASE_URL);

client.on('error', error => { throw error });

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('./public'))
app.use(methodOverride('_method'));

const PORT = process.env.PORT || 3001;

// Modules
const searchHandler = require('./modules/books')

// Server Paths
app.get('/', getBooks);
app.get('/search', (request, response) => {
  response.render('pages/searches/new');
})

app.post('/show', searchHandler);
app.post('/books', addBook);
app.get('/details/:books_id', getOneBook);
app.delete('/books/:books_id', deleteOneBook);
app.put('/books/:books_id/edit', updateOneBook);
app.get('/details/:books_id/edit', editOneBook);

// Listen

function getBooks(request, response) {
  const SQL = 'SELECT * FROM books';

  client.query(SQL)
    .then(results => {
      const { rowCount, rows } = results;
      // console.log('/ db result', rows);
      response.render('pages/index', {
        books: rows,
        count: rowCount,
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

  const { title, authors, isbn, image_url, summary } = request.body;
  const SQL = `
      INSERT INTO books (title, authors, isbn , image_url, summary)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
  const values = [title, authors, isbn, image_url, summary];

  // POST - REDIRECT - GET
  client.query(SQL, values)
    .then(results => {
      let id = results.rows[0].id;
      response.redirect(`/details/${id}`);
    })
    .catch(err => handleError(err, response))
}


function getOneBook(request, response) {
  const { books_id } = request.params;
  const SQL = `
      SELECT *
      FROM books
      WHERE id = $1
      LIMIT 1;
    `;

  client.query(SQL, [books_id])
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

function deleteOneBook(request, response) {
  console.log('DELETE', request.params.id)
  const SQL = `
    DELETE FROM books
    WHERE Id = $1
  `;
  console.log(request.params.id);
  client.query(SQL, [request.params.id])
    .then(() => {
      response.redirect('/');
    })
    .catch(err => handleError(err, response));
}

function editOneBook(request, response) {
  const SQL = `
    SELECT *
    FROM books
    WHERE Id = $1
  `;
  client.query(SQL, [request.params.books_id])
    .then(results => {
      const books = results.rows[0];
      const viewModel = {
        books
      };
      response.render('pages/searches/edit', viewModel);
    })
}

function updateOneBook(request, response, next) {
  const { title, authors, isbn , image_url, summary,bookshelves } = request.body;

  const SQL = `
    UPDATE books SET
    title=$1
    authors=$2
    isbn=$3
    image_url=$4
    summary=$5
    bookshelves=$6
    WHERE Id = $7
  `;
  const parameters = [title, authors, isbn , image_url, summary,bookshelves,  parseInt(request.params.book_id)];
  client.query(SQL, parameters)
    .then(() => {
      response.redirect(`/details/${request.params.books_id}`);
    })
    .catch(next);
}