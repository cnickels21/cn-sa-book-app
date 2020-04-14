'use strict'; 

require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('./public'))

const PORT = process.env.PORT || 3000;

app.get('/hello', (request, response) => {
    response.render('sub-folder/index');
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});