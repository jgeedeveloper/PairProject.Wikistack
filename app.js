const path = require('path');
const express = require('express');
const app = express();
const PORT = 8080;
const morgan = require('morgan');
const layout = require('./views/layout');
const models = require('./models');

const init = async () => {
    await models.db.sync()
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    })
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// any remaining requests with an extension send 404

// sends index.html
// app.use('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'public/index.html'))
// })

// error handling endware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});

app.get('/', async (req, res, next) => {
  try {
    db.authenticate().then(() => {
      console.log('connected to the database');
    });
    res.send(layout(''));
    res.json();
    init(); 
  } catch (err) {
    next(err);
  }
});

app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});
