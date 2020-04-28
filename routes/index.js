const {

  UserController, LocationController,
  ZoneController, ContactController,
  BarrierGestureController, SelfReportingController,
  GreenNumberController, SymptomController,
  PrevalenceController, DailyReportController,
  ElasticCallController, RiskFactorController
} = require('./../controller');
const { auth } = require('./../middlewares');

module.exports = (app) => {
  app.post('/user', UserController.create);
  app.get('/user', auth, UserController.get);
  app.get('/users', auth, UserController.getAllUsers);
  app.get('/user/refresh_token', auth, UserController.refreshToken);
  app.post('/user/verify_code', auth, UserController.verifyCode);
  app.post('/location', auth, LocationController.registerLocation);
  app.get('/location/:idUser', auth, LocationController.getUserLocations);
  app.get('/user/contacts/:idUser', auth, UserController.getContact);
  app.post('/user/signaler', auth, UserController.signaler);
  //app.post('/zone', auth, ZoneController.createZone);
  //app.get('/zones', auth, ZoneController.getZones);
  //app.get('/zone/:id', auth, ZoneController.getZone);
  app.get('/contact', auth, ContactController.getContacts);
  app.get('/contact/:id', auth, ContactController.getContact);
  //app.get('/contact/users/:idUser', auth, ContactController.getIncubContact);

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
  app.post('/symptom', auth, SymptomController.create);
  app.get('/symptom/:id', auth, SymptomController.get);
  app.get('/symptoms', SymptomController.getAllSymptom);
  app.get('/symptoms/major', SymptomController.getAllMajorSymptom);
  app.put('/symptom', SymptomController.update);
  app.delete('/symptom/:id', SymptomController.delete);


  //elastic search
  app.get('/user/contact/:id/:begin/:end', ElasticCallController.getUserContacts);
  app.get('/user/trace/:id/:begin/:end', ElasticCallController.getUserTrace);
  app.post('/user/contact/position', ElasticCallController.getContactsAtPositionAndDate);
  app.get('/user/inside/:latitude/:longitude', ElasticCallController.isInAZoneElastic);
  app.get('/user/incub/:idUser/:begin/:end', ElasticCallController.getIncubContact);
  app.post('/zone', ElasticCallController.createZone);
  app.get('/zones', ElasticCallController.getZones);
  app.get('/zone/:id', ZoneController.getZone);
  app.get('/gentoken', auth, ElasticCallController.gentoken);

  //reporting symptom and risk factor
  //deprecated
  app.get('/self-reports', SelfReportingController.getAllSelfReports);
  app.get('/reporting/self-reports', SelfReportingController.getAllSelfReports);
  app.get('/reporting/riskfactors', SelfReportingController.getAllRiskFactors);
  app.post('/reporting/self-report', SelfReportingController.createSelfReporting);
  app.post('/reporting/selfreport-symptom', SelfReportingController.createSelfReportSymptom);
  app.post('/reporting/selfreport-risk', SelfReportingController.createSelfReportRisk);

  //Route RiskFactor
  app.post('/risk-factor', auth, RiskFactorController.create);
  app.get('/risk-factor/:id', auth,  RiskFactorController.get);
  app.get('/risk-factors', auth, RiskFactorController.getAllRiskFactor);
  app.put('/risk-factor', auth, RiskFactorController.update);
  app.delete('/risk-factor/:id', auth, RiskFactorController.delete);
};