const express = require('express');
const bodyParser = require('body-parser');
const { createMovie, getMovies, getAMovie } = require('../core');
const db = require('../database');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Welcome');
});

app.get('/movie', async (req, res) => {
  const result = await getAMovie(db.database)(req.query.title);
  if (result) {
    return res.status(200).send(result);
  }
  res.status(302).send('Movie not found');
});

app.get('/movies', async (req, res) => {
  const result = await getMovies(db.database)();
  if (result) {
    return res.status(200).send(result);
  }
  res.status(302).send();
});

app.post('/movie', async (req, res) => {
  const result = await createMovie(db.database)(req.body.title, req.body.description);
  if (result) {
    return res.status(400).send(result);
  }
  res.status(200).send(result);
});

module.exports = app;
