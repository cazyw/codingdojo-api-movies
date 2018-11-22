const { Movie, database, connectMovieDatabase, disconnectMovieDatabase } = require('./index');

const seedDatabase = async () => {
  const movies = [
    { title: 'Aladdin', description: 'A whole new world!' },
    { title: 'Star Wars', description: 'A galaxy far far away.' },
    { title: 'Captain Marvel', description: 'Higher. Faster. Stronger' },
  ];

  for (const movie of movies) {
    var newMovie = new Movie({ title: movie.title, description: movie.description});
    await newMovie.save();
  }
};

describe('Movie Database', () => {

  beforeAll(() => {
    connectMovieDatabase();
  });

  afterAll(() => {
    disconnectMovieDatabase();
  });

  beforeEach(async () => {
    await Movie.deleteMany({});
  });

  it('Should save a movie', async () => {
    const movie = {
      title: 'Aladdin',
      description: 'A whole new world!'
    };

    await database.saveMovie(movie.title, movie.description);
    const allMovies = await database.getAllMovies();
    expect(allMovies[0].title).toBe(movie.title);
    expect(allMovies[0].description).toBe(movie.description);
  });

  it('Should return all movies ', async () => {
    await seedDatabase();
    const allMovies = await database.getAllMovies();
    const allTitles = allMovies.map(movie => movie.title);
    expect(allMovies.length).toBe(3);
    expect(allTitles).toContain('Aladdin');
    expect(allTitles).toContain('Star Wars');
    expect(allTitles).toContain('Captain Marvel');
  });

  it('Should find a movie by its title', async () => {
    await seedDatabase();
    const title = 'Aladdin';
    const movieFound = await database.getAMovie(title);
    expect(movieFound.title).toBe('Aladdin');
    expect(movieFound.description).toBe('A whole new world!');
  });

  it('Should delete a movie', async () => {
    await seedDatabase();

    await database.deleteAMovie('Star Wars');
    let allMovies = await database.getAllMovies();
    let allTitles = allMovies.map(movie => movie.title);
    expect(allMovies.length).toBe(2);
    expect(allTitles[0]).toBe('Aladdin');
    expect(allTitles[1]).toBe('Captain Marvel');

    await database.deleteAMovie('Aladdin');
    allMovies = await database.getAllMovies();
    allTitles = allMovies.map(movie => movie.title);
    expect(allMovies.length).toBe(1);
    expect(allTitles[0]).toBe('Captain Marvel');
  });

  it('Should return a message if the movie to be deleted is not found', async () => {
    await seedDatabase();

    const message = await database.deleteAMovie('Jurassic Park');
    let allMovies = await database.getAllMovies();
    expect(allMovies.length).toBe(3);
    expect(message).toBe('Deletion error: Movie not found');
  });

});