const { UserController, LocationController } = require('./../controller');
const { auth } = require('./../middlewares');

module.exports = (app) => {
  app.post('/user', UserController.create);
  app.get('/user', UserController.get);
  app.get('/users',  UserController.getAllUsers);
  app.get('/user/refresh_token', auth, UserController.refreshToken);
  app.post('/user/verify_code', auth, UserController.verifyCode);
  app.post('/location', auth, LocationController.registerLocation);
  app.get('/location/:idUser', auth, LocationController.getUserLocations);
};