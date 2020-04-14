'use strict';

const superagent = require('superagent');

function bookHandler(request,response) {
    const book=request.query.Book
    let url = ''
    superagent.get(url);
    .query({
     KEY: process.env.BOOKS_KEY,
     q:books,
     Format:jason
    })
    .then(bookResponse => {
        let bookData = bookResponse.body;
        const book = new BOOK(book, bookData);
        setLocationInCache(city, location);
        response.send(location);
      })
}

function Book(googleData) {
    this.image = googleData.image_url;
    this.title = googleData.title;
    this.author = googleData.author;
    this.description = googleData.description;
}

module.exports = bookHandler;