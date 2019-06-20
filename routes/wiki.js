const express = require('express');
const wikiRouter = express.Router();
const { addPage } = require('../views');

module.exports = wikiRouter;

wikiRouter.get('/', (req, res, next) => {
  res.send('got to Get /wiki/');
});

wikiRouter.post('/', (req, res, next) => {
  res.send('got to POST /wiki/');
});

wikiRouter.get('/add', (req, res, next) => {
  res.send(addPage());
});
