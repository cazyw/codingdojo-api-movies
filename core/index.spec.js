const { createMovie, getMovies, getAMovie } = require('./index');

describe('Create Movie', () => {
  it('Should return an error if the title is blank', async () => {
    const mockDatabase = {
      getAllMovies: () => {},
      saveMovie: () => {}
    };
    const title = '';
    const description = 'a long time ago in a galaxy far far away...';
    const spySaveMovie = jest.spyOn(mockDatabase, 'saveMovie');
    expect(await createMovie(mockDatabase)(title, description)).toBe('Input Error: Movie title is required');
    expect(spySaveMovie).not.toHaveBeenCalled();
  });

  it('Should return an error if the description is blank', async () => {
    const mockDatabase = {
      getAllMovies: () => {},
      saveMovie: () => {}
    };
    const title = 'Star Wars';
    const description = '';
    const spySaveMovie = jest.spyOn(mockDatabase, 'saveMovie');
    expect(await createMovie(mockDatabase)(title, description)).toBe('Input Error: Movie description is required');
    expect(spySaveMovie).not.toHaveBeenCalled();
  });

  it('Should return an error if both the title and description is blank', async () => {
    const mockDatabase = {
      getAllMovies: () => {},
      saveMovie: () => {}
    };
    const title = '';
    const description = '';
    const spySaveMovie = jest.spyOn(mockDatabase, 'saveMovie');
    expect(await createMovie(mockDatabase)(title, description)).toBe(
      'Input Error: Movie title and description is required'
    );
    expect(spySaveMovie).not.toHaveBeenCalled();
  });

  it('Should return an error if the movie title already exists in the database', async () => {
    const mockDatabase = {
      getAllMovies: () => {
        return [
          { id: 1, title: 'Avengers', description: 'together we stand, divided we fall' },
          { id: 2, title: 'Star Wars', description: 'a long time ago in a galaxy far far away...' },
          { id: 3, title: 'Jurrasic World', description: 'life finds a way' }
        ];
      },
      saveMovie: () => {}
    };

    const title = 'Star Wars';
    const description = 'a long time ago in a galaxy far far away...';
    const spyGetAllMovies = jest.spyOn(mockDatabase, 'getAllMovies');
    const spySaveMovie = jest.spyOn(mockDatabase, 'saveMovie');
    expect(await createMovie(mockDatabase)(title, description)).toBe('Duplicate Error: Movie already exists');
    expect(spyGetAllMovies).toHaveBeenCalledTimes(1);
    expect(spySaveMovie).not.toHaveBeenCalled();
  });

  it('Should ignore spaces at the beginning and end of the movie title', async () => {
    const mockDatabase = {
      getAllMovies: () => {
        return [
          { id: 1, title: 'Avengers', description: 'together we stand, divided we fall' },
          { id: 2, title: 'Star Wars', description: 'a long time ago in a galaxy far far away...' },
          { id: 3, title: 'Jurrasic World', description: 'life finds a way' }
        ];
      },
      saveMovie: () => {}
    };

    const title = ' Star Wars ';
    const description = 'a long time ago in a galaxy far far away...';
    const spyGetAllMovies = jest.spyOn(mockDatabase, 'getAllMovies');
    const spySaveMovie = jest.spyOn(mockDatabase, 'saveMovie');
    expect(await createMovie(mockDatabase)(title, description)).toBe('Duplicate Error: Movie already exists');
    expect(spyGetAllMovies).toHaveBeenCalledTimes(1);
    expect(spySaveMovie).not.toHaveBeenCalled();
  });

  it('Should save the movie if the input is valid', async () => {
    const mockDatabase = {
      getAllMovies: () => [],
      saveMovie: () => {
        return {
          title: 'Star Wars',
          description: 'a long time ago in a galaxy far far away...'
        };
      }
    };

    const movie = {
      title: 'Star Wars',
      description: 'a long time ago in a galaxy far far away...'
    };

    const spySaveMovie = jest.spyOn(mockDatabase, 'saveMovie');
    expect(await createMovie(mockDatabase)(movie.title, movie.description)).toEqual(movie);
    expect(spySaveMovie).toHaveBeenCalledTimes(1);
    expect(spySaveMovie).toHaveBeenCalledWith(movie.title, movie.description);
  });
});

describe('Get All Movies', () => {
  it('Should get all movies', async () => {
    const mockDatabase = {
      getAllMovies: () => {
        return [
          { id: 1, title: 'Avengers', description: 'together we stand, divided we fall' },
          { id: 2, title: 'Star Wars', description: 'a long time ago in a galaxy far far away...' },
          { id: 3, title: 'Jurrasic World', description: 'life finds a way' }
        ];
      }
    };
    const spyGetAllMovies = jest.spyOn(mockDatabase, 'getAllMovies');
    const movies = await getMovies(mockDatabase)();
    expect(movies.length).toBe(3);
    expect(spyGetAllMovies).toHaveBeenCalledTimes(1);
  });
});

describe('Get A Movie', () => {
  it('Should get a movie given a title', async () => {
    const mockDatabase = {
      getAMovie: title => {
        return { id: 1, title: 'Avengers', description: 'together we stand, divided we fall' };
      }
    };
    const spyGetAMovie = jest.spyOn(mockDatabase, 'getAMovie');
    const movie = await getAMovie(mockDatabase)('Avengers');
    expect(movie.title).toBe('Avengers');
    expect(spyGetAMovie).toHaveBeenCalledTimes(1);
  });
});
