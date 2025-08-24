const express = require('express');
const app = express();
const themeRouter = require('./routes/theme');

app.use('/api/theme', themeRouter);

// ...existing code...

module.exports = app;