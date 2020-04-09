const { UserController, LocationController } = require('./../controller');
const { auth } = require('./../middlewares');

module.exports = (app) => {
  app.post('/user', UserController.create);
  app.get('/user', auth, UserController.get);
  app.post('/location', auth, LocationController.registerLocation);
  app.get('/location/:idUser', auth, LocationController.getUserLocations);
};