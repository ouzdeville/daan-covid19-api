const { UserController, LocationController } = require('./../controller');

module.exports = (app) => {
  app.post('/user', UserController.create);
  app.get('/user', UserController.get);
  app.post('/location', LocationController.registerLocation);
  app.get('/location/:idUser', LocationController.getUserLocations);
};