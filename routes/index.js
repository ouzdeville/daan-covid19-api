const { UserController } = require('./../controller');

module.exports = (app) => {
  app.post('/user', UserController.create);

  app.get('/user', UserController.get)
};