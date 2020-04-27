const multer = require('multer');

const {
  UserController, LocationController,
  ZoneController, ContactController,
  BarrierGestureController, SelfReportingController,
  GreenNumberController, SymptomController,
  PrevalenceController, DailyReportController,
  ElasticCallController
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
  app.get('/location/:idUser', auth, LocationController.getUserLocations);
  app.get('/user/contacts/:idUser', auth, UserController.getContact);
  app.post('/user/signaler', auth, UserController.signaler);
  app.post('/zone', auth, ZoneController.createZone);
  app.get('/zones', auth, ZoneController.getZones);
  app.get('/zone/:id', auth, ZoneController.getZone);
  app.get('/user/inside/:latitude/:longitude', ZoneController.isInAZone);
  app.get('/contact', auth, ContactController.getContacts);
  app.get('/contact/:id', auth, ContactController.getContact);
  //app.get('/contact/users/:idUser', auth, ContactController.getIncubContact);

  // Route Prevalence
  app.post('/prevalence', auth, PrevalenceController.create);
  app.get('/prevalence', auth, PrevalenceController.getAll);
  app.get('/prevalence/run', auth, PrevalenceController.runPrevalence);
  app.get('/prevalence/:idZone', auth, PrevalenceController.getByZone);

  // Route Daily Report
  app.post('/daily-report', auth, DailyReportController.create);
  app.get('/daily-report', auth, DailyReportController.getAll);
  app.get('/pdf/:filename', auth, DailyReportController.getPDf);
  app.get('/daily-report/last', auth, DailyReportController.getLast);
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
  app.get('/symptoms', SymptomController.getAllSymptom);

  //elastic search
  app.get('/user/contact/:id/:begin/:end', auth, ElasticCallController.getUserContacts);
  app.get('/user/trace/:id/:begin/:end', auth, ElasticCallController.getUserTrace);
  app.post('/user/contact/position', auth, ElasticCallController.getContactsAtPositionAndDate);
  //app.get('/user/inside/:latitude/:longitude', auth, ElasticCallController.isInAZoneElastic);
  app.get('/user/incub/:idUser/:begin/:end', auth, ElasticCallController.getIncubContact);
  // app.post('/zone', auth, ElasticCallController.createZone);
  // app.get('/zones', auth, ElasticCallController.getZones);
  // app.get('/zone/:id', auth, ZoneController.getZone);
  app.get('/gentoken', auth, ElasticCallController.gentoken);

  //reporting symptom and risk factor
  //deprecated
  app.get('/self-reports', auth, SelfReportingController.getAllSelfReports);
  app.get('/reporting/self-reports', auth, SelfReportingController.getAllSelfReports);
  app.get('/reporting/riskfactors', auth, SelfReportingController.getAllRiskFactors);
  app.post('/reporting/self-report', auth, SelfReportingController.createSelfReporting);
  app.post('/reporting/selfreport-symptom', auth, SelfReportingController.createSelfReportSymptom);
  app.post('/reporting/selfreport-risk', auth, SelfReportingController.createSelfReportRisk);
};