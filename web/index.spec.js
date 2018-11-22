const request = require('supertest');
const db = require('../database');
const app = require('./index');

describe('web layer', () => {
  beforeAll(async () => {
    await db.connectMovieDatabase();
  });

  afterAll(async () => {
    await db.disconnectMovieDatabase();
  });

  describe('POST /movie', () => {
    beforeAll(async () => {
      await db.Movie.deleteMany({});
    });

    it('Saves a movie to the database when input is valid', async () => {
      const response = await request(app)
        .post('/movie')
        .send({ title: 'Lion King', description: 'The circle of life' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
    });

    it('Returns 400 when input is invalid', async () => {
      const response = await request(app)
        .post('/movie')
        .send({ title: 'Lion King', description: 'The circle of life' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
    });
  });

  describe('GET /movies', () => {
    beforeAll(async () => {
      await db.Movie.deleteMany({});
    });

    it('Gets all movies in the database', async () => {
      await request(app)
        .post('/movie')
        .send({ title: 'Lion King', description: 'The circle of life' })
        .set('Accept', 'application/json');

      await request(app)
        .post('/movie')
        .send({ title: 'Aladdin', description: 'A whole new world' })
        .set('Accept', 'application/json');

      const response = await request(app).get('/movies');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Lion King');
      expect(response.body[1].title).toBe('Aladdin');
    });
  });

  describe('Get /movie', () => {
    beforeAll(async () => {
      await db.Movie.deleteMany({});
    });

    it('Gets the movie given a title', async () => {
      await request(app)
        .post('/movie')
        .send({ title: 'Lion King', description: 'The circle of life' })
        .set('Accept', 'application/json');

      const response = await request(app)
        .get('/movie')
        .query({ title: 'Lion King' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Lion King');
    });

    it('Returns 302 if a movie is not found', async () => {
      const response = await request(app)
        .get('/movie')
        .query({ title: 'Aladdin' });

      expect(response.status).toBe(302);
    });
  });
});
