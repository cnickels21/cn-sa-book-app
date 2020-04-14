'use strict'; 

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});