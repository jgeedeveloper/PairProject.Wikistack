const express = require('express');
const app = express();
const layout = require('./views/layout');
const morgan = require('morgan');
const path = require('path');
const PORT = 3000;
const http = require('http');
const models = require('./models');
const server = http.createServer(app);
const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/user');

app.use('/wiki', wikiRouter);
app.use('/users', userRouter);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// // error handling endware
// app.use((err, req, res, next) => {
//   console.error(err);
//   console.error(err.stack);
//   res.status(err.status || 500).send(err.message || 'Internal server error.');
// });

app.get('/', async (req, res, next) => {
  try {
    res.send(layout(''));
  } catch (err) {
    next(err);
  }
});

// any remaining requests with an extension send 404
// app.use((req, res, next) => {
//   if (path.extname(req.path).length) {
//     const err = new Error('Not found');
//     err.status = 404;
//     next(err);
//   } else {
//     next();
//   }
// });

models.db.authenticate().then(() => {
  console.log('connected to the database');
});
const init = async () => {
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  await models.db.sync();
};
init();

module.exports = app;
