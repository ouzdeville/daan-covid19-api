const multer = require('multer');

const {
  UserController, LocationController,
  ZoneController, ContactController,
  BarrierGestureController, SelfReportingController,
  GreenNumberController, SymptomController,
  PrevalenceController, DailyReportController,
  ElasticCallController, RiskFactorController,
  PushNotificationController
} = require('./../controller');

const { auth } = require('./../middlewares');

DIR='./pdf/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
      if (file.mimetype === "application/pdf") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Allowed only pdf file'));
      }
  }
});

module.exports = (app) => {
  app.post('/user', UserController.create);
  app.get('/user', auth, UserController.get);
  app.get('/users', auth, UserController.getAllUsers);
  app.get('/user/refresh_token', auth, UserController.refreshToken);
  app.post('/user/verify_code', auth, UserController.verifyCode);
  app.post('/location', auth, LocationController.registerLocation);

  //app.post('/location', ElasticCallController.registerLocation);
  app.get('/location/:idUser', auth, LocationController.getUserLocations);
  app.get('/user/contacts/:idUser', auth, UserController.getContact);
  app.post('/user/signaler', auth, UserController.signaler);
  app.post('/zone', auth, ZoneController.createZone);
  app.get('/zones', auth, ZoneController.getZones);
  app.get('/zone/:id', auth, ZoneController.getZone);
  app.get('/user/inside/:latitude/:longitude', auth, ZoneController.isInAZone);
  app.get('/contacts', auth, ContactController.getContacts);
  app.get('/contact/:id', auth, ContactController.getContact);
  //app.get('/contact/users/:idUser', auth, ContactController.getIncubContact);

  // Route Prevalence
  app.post('/prevalence', auth, PrevalenceController.create);
  app.get('/prevalences', auth, PrevalenceController.getAll);
  app.get('/prevalence', auth, PrevalenceController.getprevalenceNow);
  app.get('/prevalence/run', PrevalenceController.runPrevalence);
  app.get('/prevalence/rungps', PrevalenceController.updateGPS);
  app.get('/prevalence/runPolygone', auth, PrevalenceController.runPolygon);
  app.get('/prevalence/:idZone', auth, PrevalenceController.getByZone);

  // Route Daily Report
  app.post('/daily-report', auth, DailyReportController.create);
  app.get('/daily-report', auth, DailyReportController.getAll);
  app.get('/pdf/:filename', auth, DailyReportController.getPDf);
  app.get('/daily-report/last', auth, DailyReportController.getLast);
  app.get('/daily-report/last-with-diff', auth, DailyReportController.getLastWithDiff);
  app.get('/daily-report/:id', auth, DailyReportController.get);
  app.get('/daily-report/by-date/:date', auth, DailyReportController.getByDate);

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
  app.get('/symptoms/major', auth, SymptomController.getAllMajorSymptom);
  app.put('/symptom', auth, SymptomController.update);
  app.delete('/symptom/:id', auth, SymptomController.delete);

  //elastic search
  app.get('/user/contact/:id/:begin/:end', auth, ElasticCallController.getUserContacts);
  app.get('/user/trace/:id/:begin/:end', auth, ElasticCallController.getUserTrace);
  app.post('/user/contact/position', auth, ElasticCallController.getContactsAtPositionAndDate);
  //app.get('/user/inside/:latitude/:longitude', auth, ElasticCallController.isInAZoneElastic);
  app.get('/user/incub/:idUser/:begin/:end', auth, ElasticCallController.getIncubContact);
  // app.post('/zone', auth, ElasticCallController.createZone);
  // app.get('/zones', auth, ElasticCallController.getZones);
  // app.get('/zone/:id', auth, ZoneController.getZone);
  app.get('/gentoken', ElasticCallController.gentoken);
  app.get('/user/encrypt', UserController.encryptAllNumber);
  

  //reporting symptom and risk factor
  //deprecated
  // app.get('/self-reports', auth, SelfReportingController.getAllSelfReports);
  app.get('/reporting/self-reports', auth, SelfReportingController.getAllSelfReports);
  app.get('/reporting/self-reports/:id', auth, SelfReportingController.getById);
  app.get('/reporting/self-reports/by-user/:id', auth, SelfReportingController.getAllSelfReportsByUserId);
  app.get('/reporting/self-reports/by-date/:date', auth, SelfReportingController.getAllSelfReportsByDate);
  app.get('/reporting/riskfactors', auth, SelfReportingController.getAllRiskFactors);
  app.post('/reporting/self-report', auth, SelfReportingController.createSelfReporting);
  app.put('/reporting/modify-self-report', auth, SelfReportingController.updateUserSelfReport);
  app.post('/reporting/selfreport-symptom', auth, SelfReportingController.createSelfReportSymptom);
  app.post('/reporting/selfreport-risk', auth, SelfReportingController.createSelfReportRisk);

  //Route RiskFactor
  app.post('/risk-factor', auth, RiskFactorController.create);
  app.get('/risk-factor/:id', auth, RiskFactorController.get);
  app.get('/risk-factors', auth, RiskFactorController.getAllRiskFactor);
  app.put('/risk-factor', auth, RiskFactorController.update);
  app.get('/self-report/risk-factors/:idreport', SelfReportingController.getAllRiskByReport);
  app.get('/self-report/:idreport/symptoms', SelfReportingController.getAllSymptomByReport);
  app.delete('/risk-factor/:id', auth, RiskFactorController.delete);

  // Push notification
  app.post('/push-notification', auth, PushNotificationController.sendMessage);
  app.post('/push-notification/add-token', auth, PushNotificationController.addToken);
  app.get('/push-notification/send', auth, PushNotificationController.pushBackOffice);
};
