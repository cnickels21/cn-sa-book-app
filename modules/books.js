'use strict';

const superagent = require('superagent');

function bookHandler(request, response) {
    console.log(request.body);
    let url = 'https://www.googleapis.com/books/v1/volumes';
    superagent.get(url)
        .query({
            key: process.env.BOOK_KEY,
            q: `${request.body.query}+in${request.body.search}`,
        })
        .then(bookResponse => {
            let bookData = JSON.parse(bookResponse.text);
            let bookReturn = bookData.items.map(book => {
                return new Book(book);
            })
            response.send(bookReturn);
            // response.render('./views/pages/searches/show');
        })
        .catch(error => {
            console.error(error);
        })
}

function Book(googleData) {
    this.title = googleData.volumeInfo.title;
    this.authors = googleData.volumeInfo.authors;
    this.description = googleData.volumeInfo.description;
}

module.exports = bookHandler;