const multer = require('multer');

const {
  UserController, LocationController,
  ZoneController,
  BarrierGestureController, SelfReportingController,
  GreenNumberController, SymptomController,
  PrevalenceController, DailyReportController,
  ElasticCallController, RiskFactorController,
  PushNotificationOsController,
  GeofenceController,
  GeocodingController,
  BluetoothController,
} = require('./../controller');

const { auth } = require('./../middlewares');
const { auth_non_active } = require('./../middlewares');

DIR='./files/prevalence';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, DIR);
  },
  filename: (req, file, cb) => {
      const fileName = Date.now() + '-'+file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName);
  }
});

const uploadExecel = multer({storage: storage});

module.exports = (app) => {
  // End Users
  app.post('/user', UserController.create);
  app.get('/user', auth, UserController.get);
  app.get('/user/refresh_token', auth, UserController.refreshToken);
  app.post('/user/verify_code', auth_non_active, UserController.verifyCode);
  app.post('/location', auth, LocationController.registerLocation);
  app.get('/user/decrypt/:id', auth, UserController.decryptNumber);

  //app.post('/location', ElasticCallController.registerLocation);
  // app.post('/user/signaler', auth, UserController.signaler);
  app.get('/zones', ZoneController.getZones);
  app.get('/zones/:type', ZoneController.getZonesbyType);
  app.get('/zone/:id', auth, ZoneController.getZone);
  app.get('/user/inside/:latitude/:longitude', auth, ZoneController.isInAZone);
  //app.get('/contact/users/:idUser', auth, ContactController.getIncubContact);

  // Route Prevalence
  app.get('/prevalences', auth, PrevalenceController.getAll);
  app.get('/prevalence', PrevalenceController.getprevalenceNow);
  app.get('/prevalence/district/load', PrevalenceController.runPrevalence);// Load distict data from ministere website
  app.get('/prevalence/district/loadcenter', PrevalenceController.updateGpsCenterOfDistrict);//compute the center of district
  app.get('/prevalence/district/loadPolygone', PrevalenceController.runPolygonDistrict);
  app.get('/prevalence/commune/runPolygone', PrevalenceController.runPolygonCommune);
  app.get('/prevalence/departement/runPolygone', PrevalenceController.runPolygonDepartement);
  app.get('/prevalence/region/runPolygone', PrevalenceController.runPolygonRegion);
  app.post('/prevalence/excel', uploadExecel.single('filename'), PrevalenceController.storeExcelPrevalence);
  app.get('/prevalences/:type', PrevalenceController.getprevalenceByTypeNow);
  app.get('/prevalence/:idZone', auth, PrevalenceController.getByZone);

  // Route Daily Report
  app.get('/daily-report', auth, DailyReportController.getAll);
  app.get('/pdf/:filename', auth, DailyReportController.getPDf);
  app.get('/daily-report/last', auth, DailyReportController.getLast);
  app.get('/daily-report/last-with-diff', auth, DailyReportController.getLastWithDiff);
  app.get('/daily-report/:id', auth, DailyReportController.get);
  app.get('/daily-report/by-date/:date', auth, DailyReportController.getByDate);

  // Route Barrier Gesture
  app.get('/barrier-gesture/:id', auth, BarrierGestureController.get);
  app.get('/barrier-gestures', auth, BarrierGestureController.getAllBarrierGesture);

  // Route Green Number
  app.get('/green-number/:id', auth, GreenNumberController.get);
  app.get('/green-numbers', auth, GreenNumberController.getAllGreenNumber);

  // Route Symptom
  app.get('/symptom/:id', auth, SymptomController.get);
  app.get('/symptoms', auth, SymptomController.getAllSymptom);
  app.get('/symptoms/major', auth, SymptomController.getAllMajorSymptom);

  //elastic search
  app.get('/user/contact/:id/:begin/:end/:distance/:time', auth, ElasticCallController.getUserContacts);
  app.get('/user/scrollcontact/:id/:begin/:end/:distance/:time/:last_created_date', auth, ElasticCallController.ScrollUserContacts);
  app.get('/user/trace/all', ElasticCallController.getAllTrace);
  app.get('/user/trace/:id/:begin/:end', auth, ElasticCallController.getUserTrace);
  app.post('/user/contact/position', auth, ElasticCallController.getContactsAtPositionAndDate);
  //app.get('/user/inside/:latitude/:longitude', auth, ElasticCallController.isInAZoneElastic);
  app.get('/user/incub/:idUser/:begin/:end/:distance/:time', auth, ElasticCallController.getIncubContact);
  //app.post('/zone', auth, ElasticCallController.createZone);
  //app.get('/zones', auth, ElasticCallController.getZones);
  //app.get('/zone/:id', auth, ZoneController.getZone);
  app.get('/user/risk-level/:id', ElasticCallController.getRiskLevel);
  app.get('/gentoken', ElasticCallController.gentoken);
  app.get('/user/encrypt', UserController.encryptAllNumber);
  app.get('/user/decrypt', UserController.decryptAllUsers);
  app.get('/testsms', ElasticCallController.sendsms);

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
  app.get('/risk-factor/:id', auth, RiskFactorController.get);
  app.get('/risk-factors', auth, RiskFactorController.getAllRiskFactor);
  app.get('/self-report/risk-factors/:idreport', SelfReportingController.getAllRiskByReport);
  app.get('/self-report/:idreport/symptoms', SelfReportingController.getAllSymptomByReport);

  app.post('/push-notification/add-player-id', auth, PushNotificationOsController.addPlayerId);

  //Route Geofencing
  app.post('/geofence', auth, GeofenceController.createGeofence);
  app.get('/geofences', auth, GeofenceController.getGeofences);
  app.get('/geofence/user/:id', GeofenceController.getGeofenceUser);
  app.get('/geofence/notif', GeofenceController.getNotif);
  app.get('/geofence/updatenotif/:idGeofence', GeofenceController.updateExitZone);
  app.get('/geofence/:id', auth, GeofenceController.getGeofence);

  app.get('/geocoding/:q', GeocodingController.geosearch);

  //Route Bluetooth
  app.post('/encounter', auth, BluetoothController.createEncounter);
  app.post('/encounters/bulk', auth, BluetoothController.createEncounterBulk);
  app.get('/encounters/:timestamp', auth, BluetoothController.getEncountersAfter);
};
