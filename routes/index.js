const multer = require('multer');

const {
  UserController, LocationController,
  ZoneController, ContactController,
  BarrierGestureController, SelfReportingController,
  GreenNumberController, SymptomController,
  PrevalenceController, DailyReportController,
  ElasticCallController, RiskFactorController
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
  app.get('/users', UserController.getAllUsers);
  app.get('/user/refresh_token', auth, UserController.refreshToken);
  app.post('/user/verify_code', auth, UserController.verifyCode);
  app.post('/location', LocationController.registerLocation);
  app.get('/location/:idUser', auth, LocationController.getUserLocations);
  app.get('/user/contacts/:idUser', auth, UserController.getContact);
  app.post('/user/signaler', auth, UserController.signaler);
  app.post('/zone', ZoneController.createZone);
  app.get('/zones', ZoneController.getZones);
  app.get('/zone/:id', ZoneController.getZone);
  app.get('/user/inside/:latitude/:longitude', ZoneController.isInAZone);
  app.get('/contact', ContactController.getContacts);
  app.get('/contact/:id', ContactController.getContact);
  //app.get('/contact/users/:idUser', auth, ContactController.getIncubContact);

  // Route Prevalence
  app.post('/prevalence', PrevalenceController.create);
  app.get('/prevalence', PrevalenceController.getAll);
  app.get('/prevalence/run', PrevalenceController.runPrevalence);
  app.get('/prevalence/:idZone', PrevalenceController.getByZone);

  // Route Daily Report
  app.post('/daily-report', DailyReportController.create);
  app.get('/daily-report', DailyReportController.getAll);
  app.get('/pdf/:filename', DailyReportController.getPDf);
  app.get('/daily-report/last', DailyReportController.getLast);
  app.get('/daily-report/:id', DailyReportController.get);
  app.get('/daily-report/by-date/:date', DailyReportController.getByDate);

  // Route Barrier Gesture
  app.post('/barrier-gesture', BarrierGestureController.create);
  app.get('/barrier-gesture/:id', BarrierGestureController.get);
  app.get('/barrier-gestures', BarrierGestureController.getAllBarrierGesture);

  // Route Green Number
  app.post('/green-number', GreenNumberController.create);
  app.get('/green-number/:id', GreenNumberController.get);
  app.get('/green-numbers', GreenNumberController.getAllGreenNumber);

  // Route Symptom
  app.post('/symptom', SymptomController.create);
  app.get('/symptom/:id', SymptomController.get);
  app.get('/symptoms', SymptomController.getAllSymptom);
  app.get('/symptoms/major', SymptomController.getAllMajorSymptom);
  app.put('/symptom', SymptomController.update);
  app.delete('/symptom/:id', SymptomController.delete);

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

  //reporting symptom and risk factor
  //deprecated
  app.get('/self-reports', SelfReportingController.getAllSelfReports);
  app.get('/reporting/self-reports', SelfReportingController.getAllSelfReports);
  app.get('/reporting/self-reports/:id', SelfReportingController.getAllSelfReportsByUserId);
  app.get('/reporting/self-reports/by-date/:date', SelfReportingController.getAllSelfReportsByDate);
  app.get('/reporting/riskfactors', SelfReportingController.getAllRiskFactors);
  app.post('/reporting/self-report', SelfReportingController.createSelfReporting);
  app.put('/reporting/modify-self-report', SelfReportingController.updateUserSelfReport);
  app.post('/reporting/selfreport-symptom', SelfReportingController.createSelfReportSymptom);
  app.post('/reporting/selfreport-risk', SelfReportingController.createSelfReportRisk);

  //Route RiskFactor
  app.post('/risk-factor', auth, RiskFactorController.create);
  app.get('/risk-factor/:id', auth,  RiskFactorController.get);
  app.get('/risk-factors', auth, RiskFactorController.getAllRiskFactor);
  app.put('/risk-factor', auth, RiskFactorController.update);
  app.delete('/risk-factor/:id', auth, RiskFactorController.delete);
};