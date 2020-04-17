'use strict';

const superagent = require('superagent');

function searchHandler(request, response) {
    let url = 'https://www.googleapis.com/books/v1/volumes';
    superagent.get(url)
        .query({
            key: process.env.BOOK_KEY,
            q: `+in${request.body.search}:${request.body.query}`,
        })
        .then(bookResponse => {
            let bookData = JSON.parse(bookResponse.text);
            let bookReturn = bookData.items.map(book => {
                return new Book(book);
            })
            let viewModel = {
                books: bookReturn
            }
            // response.send(bookReturn);
            response.render('pages/searches/show', viewModel);
        })
        .catch(err => handleError(err, response));
}

function handleError(err, response) {
    let viewModel = {
      error: err,
    };
    response.render('pages/error', viewModel);
  }

function Book(googleData) {
    this.image = parseBookImage(googleData.volumeInfo.imageLinks);
    this.title = googleData.volumeInfo.title;
    this.authors = googleData.volumeInfo.authors;
    this.description = googleData.volumeInfo.description;
    this.isbn = googleData.volumeInfo.industryIdentifiers[0].type;
}

module.exports = searchHandler;
const placeholder='http://via.placeholder.com/300';


function parseBookImage(imageLinks){
    if (!imageLinks){
        return placeholder;
    }
    return imageLinks.thumbnail;
}

// googleData.imageLinks.thumbnail.replace('http://', 'https://') ? googleData.imageLinks.thumbnail : 