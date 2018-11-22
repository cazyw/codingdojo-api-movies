/* eslint-disable no-console */
const app = require('./web');
const db = require('./database');

db.connectMovieDatabase();

const port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
