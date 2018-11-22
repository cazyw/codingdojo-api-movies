const isDuplicate = (movieCollection, movieTitle) => movieCollection.some(movie => movie.title === movieTitle.trim());

const createMovie = database => async (title, description) => {
  if (!title && !description) {
    return 'Input Error: Movie title and description is required';
  } else if (!title) {
    return 'Input Error: Movie title is required';
  } else if (!description) {
    return 'Input Error: Movie description is required';
  }

  const allMovies = await database.getAllMovies();

  if (isDuplicate(allMovies, title)) {
    return 'Duplicate Error: Movie already exists';
  }

  return await database.saveMovie(title, description);
};

const getMovies = database => async () => {
  return await database.getAllMovies();
};

const getAMovie = database => async title => {
  return await database.getAMovie(title);
};

module.exports = {
  createMovie,
  getMovies,
  getAMovie
};
