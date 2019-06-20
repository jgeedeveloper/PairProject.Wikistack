const http = require('http');
const models = require('./models');
const app = require('./app');
const server = http.createServer(app);
const PORT = 3000;

// models.db.authenticate().then(() => {
//   console.log('connected to the database');
// });
const init = async () => {
  server.listen(PORT, () => console.log(`listening on port ${PORT}`));
  await models.db.sync();
};
init();
