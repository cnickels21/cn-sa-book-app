'use strict';

const superagent = require('superagent');

function bookHandler(request, response) {
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
            response.send(bookReturn);
            // response.render('pages/searches/show');
        })
        .catch(error => {
            console.error(error);
        })
}

function Book(googleData) {
    this.image = googleData.imageLinks.thumbnail.replace('http://', 'https://')
    this.title = googleData.volumeInfo.title;
    this.authors = googleData.volumeInfo.authors;
    this.description = googleData.volumeInfo.description;
}

module.exports = bookHandler;