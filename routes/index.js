const { UserController, LocationController, BarrierGestureController, GreenNumberController, SymptomController } = require('./../controller');
const { auth } = require('./../middlewares');

module.exports = (app) => {
  app.post('/user', UserController.create);
  app.get('/user', UserController.get);
  app.get('/users',  UserController.getAllUsers);
  app.get('/user/refresh_token', auth, UserController.refreshToken);
  app.post('/user/verify_code', auth, UserController.verifyCode);
  app.post('/location', auth, LocationController.registerLocation);
  app.get('/location/:idUser', auth, LocationController.getUserLocations);

  // Route Barrier Gesture
  app.post('/barrier-gesture', auth, BarrierGestureController.create);
  app.get('/barrier-gesture/:id', auth, BarrierGestureController.get);
  app.get('/barrier-gestures', auth, BarrierGestureController.getAllBarrierGesture);

  // Route Green Number
  app.post('/green-number', auth, GreenNumberController.create);
  app.get('/green-number/:id', auth, GreenNumberController.get);
  app.get('/green-numbers', auth, GreenNumberController.getAllGreenNumber);

  // Route Symptom
  app.post('/symptom', auth, SymptomController.create);
  app.get('/symptom/:id', auth, SymptomController.get);
  app.get('/symptoms', auth, SymptomController.getAllSymptom);
};