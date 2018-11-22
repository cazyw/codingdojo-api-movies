const mongoose = require('mongoose');

const db = process.env.ENV || 'PROD';
const hostName = process.env.ENV === 'DOCKER' ? 'mongo' : 'localhost';
const databaseUrl = `mongodb://${hostName}:27017/movieDatabase-${db}`;

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${databaseUrl}`); // eslint-disable-line no-console
});
mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err}`); // eslint-disable-line no-console
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected'); // eslint-disable-line no-console
});

const connectMovieDatabase = () => mongoose.connect(databaseUrl, { useNewUrlParser: true });

const disconnectMovieDatabase = () => mongoose.connection.close();

const movieSchema = new mongoose.Schema({
  title: String,
  description: String
});

const Movie = mongoose.model('Movie', movieSchema);

const database = {
  getAllMovies: async () => await Movie.find(),
  saveMovie: async (title, description) => {
    const movie = new Movie({ title, description });
    await movie.save();
  },
  getAMovie: async (title) => await Movie.findOne({ 'title': title }),
  deleteAMovie: async (title) => {
    const movie = await Movie.findOne({ 'title': title });
    if (!movie) return 'Deletion error: Movie not found';
    await Movie.remove( { '_id': movie._id } );
  }
};

module.exports = {
  Movie,
  database,
  connectMovieDatabase,
  disconnectMovieDatabase
};