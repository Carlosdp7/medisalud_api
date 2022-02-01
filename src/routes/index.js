const express = require('express');

const app = express();

app.use('/api', require('./test'));
app.use('/api', require('./user'));

module.exports = app
