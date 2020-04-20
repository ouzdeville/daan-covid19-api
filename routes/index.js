const {
    UserController, LocationController,
    ZoneController, ContactController,
    BarrierGestureController, SelfReportingController,
    GreenNumberController, SymptomInfoController,
    PrevalenceController, DailyReportController
} = require('./../controller');
const {auth} = require('./../middlewares');

module.exports = (app) => {
    app.post('/user', UserController.create);
    app.get('/user', auth, UserController.get);
    app.get('/users',  UserController.getAllUsers);
    app.get('/self-reports', SelfReportingController.getAllSelfReports);
    app.get('/user/refresh_token', auth, UserController.refreshToken);
    app.post('/user/verify_code', auth, UserController.verifyCode);
    app.post('/location', auth, LocationController.registerLocation);
    app.get('/location/:idUser', auth, LocationController.getUserLocations);
    app.get('/user/contacts/:idUser',auth, UserController.getContact);
    app.post('/user/signaler',auth,UserController.signaler);
    app.post('/zone',auth, ZoneController.createZone);
    app.get('/zone',auth, ZoneController.getZones);
    app.get('/zone/:id',auth, ZoneController.getZone);
    app.get('/zone/inside/:latitude/:longitude',auth, ZoneController.isInAZone);
    app.get('/contact',auth, ContactController.getContacts);
    app.get('/contact/:id',auth, ContactController.getContact);
    app.get('/contact/users/:idUser',auth, ContactController.getIncubContact);

    // Route Prevalence
    app.post('/prevalence', PrevalenceController.create);
    app.get('/prevalence', PrevalenceController.getAll);
    app.get('/prevalence/:idZone', PrevalenceController.getByZone);

    // Route Daily Report
    app.post('/daily-report', DailyReportController.create);
    app.get('/daily-report', DailyReportController.getAll);
    app.get('/daily-report/last', DailyReportController.getLast);

    // Route Barrier Gesture
  app.post('/barrier-gesture', auth, BarrierGestureController.create);
  app.get('/barrier-gesture/:id', auth, BarrierGestureController.get);
  app.get('/barrier-gestures', auth, BarrierGestureController.getAllBarrierGesture);

  // Route Green Number
  app.post('/green-number', auth, GreenNumberController.create);
  app.get('/green-number/:id', auth, GreenNumberController.get);
  app.get('/green-numbers', auth, GreenNumberController.getAllGreenNumber);

  // Route Symptom
  app.post('/symptom', auth, SymptomInfoController.create);
  app.get('/symptom/:id', auth, SymptomInfoController.get);
  app.get('/symptoms', auth, SymptomInfoController.getAllSymptom);
};