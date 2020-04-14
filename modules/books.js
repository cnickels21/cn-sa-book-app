'use strict';

const superagent = require('superagent');

function bookHandler() {

}

function Book(googleData) {
    this.image = googleData.image_url;
    this.title = googleData.title;
    this.author = googleData.author;
    this.description = googleData.description;
}

module.exports = bookHandler;