const express = require('express');
const router = express.Router();

const {
    UserController, LocationController,
    ZoneController, ContactController,
    BarrierGestureController, SelfReportingController,
    GreenNumberController, SymptomController,
    PrevalenceController, DailyReportController,
    RiskFactorController, ElasticCallController,
    PushNotificationController, ScreeningController,
    PushNotificationOsController, BackOfficeUserController,
    GeofenceController
} = require('./../controller');

const { boAuth } = require('./../middlewares');

// Back Office Users
router.post('/bo-user/auth', BackOfficeUserController.auth);
router.post('/bo-user', boAuth, BackOfficeUserController.create);
router.get('/bo-user', boAuth, BackOfficeUserController.getAll);
router.put('/bo-user/updatePassword', boAuth, BackOfficeUserController.updatePassword);
router.get('/bo-user/:id', boAuth, BackOfficeUserController.get);
router.put('/bo-user/:id', boAuth, BackOfficeUserController.update);
router.get('/bo-user/:id/change-statut', boAuth, BackOfficeUserController.changeStatut);

// End Users
router.get('/user', boAuth, UserController.get);
router.get('/users', boAuth, UserController.getAllUsers);
router.get('/user/decrypt/:id', boAuth, UserController.decryptNumber);

//router.post('/location', ElasticCallController.registerLocation);
router.get('/location/:idUser', boAuth, LocationController.getUserLocations);
router.get('/user/contacts/:idUser', boAuth, UserController.getContact);
router.post('/zone', boAuth, ZoneController.createZone);
router.get('/zones', boAuth, ZoneController.getZones);
router.get('/zone/:id', boAuth, ZoneController.getZone);
router.get('/user/inside/:latitude/:longitude', boAuth, ZoneController.isInAZone);
router.get('/contacts', boAuth, ContactController.getContacts);
router.get('/contact/:id', boAuth, ContactController.getContact);
router.post('/user/signaler', boAuth, UserController.signaler);

// Route Prevalence
router.post('/prevalence', boAuth, PrevalenceController.create);
router.get('/prevalences', boAuth, PrevalenceController.getAll);
router.get('/prevalence', boAuth, PrevalenceController.getprevalenceNow);
router.get('/prevalence/:idZone', boAuth, PrevalenceController.getByZone);

// Route Daily Report
router.post('/daily-report', boAuth, DailyReportController.create);
router.get('/daily-report', boAuth, DailyReportController.getAll);
router.get('/pdf/:filename', boAuth, DailyReportController.getPDf);
router.get('/daily-report/last', boAuth, DailyReportController.getLast);
router.get('/daily-report/last-with-diff', boAuth, DailyReportController.getLastWithDiff);
router.get('/daily-report/:id', boAuth, DailyReportController.get);
router.get('/daily-report/by-date/:date', boAuth, DailyReportController.getByDate);

// Route Barrier Gesture
router.post('/barrier-gesture', boAuth, BarrierGestureController.create);
router.get('/barrier-gesture/:id', boAuth, BarrierGestureController.get);
router.get('/barrier-gestures', boAuth, BarrierGestureController.getAllBarrierGesture);

// Route Green Number
router.post('/green-number', boAuth, GreenNumberController.create);
router.get('/green-number/:id', boAuth, GreenNumberController.get);
router.get('/green-numbers', boAuth, GreenNumberController.getAllGreenNumber);

// Route Symptom
router.post('/symptom', boAuth, SymptomController.create);
router.get('/symptom/:id', boAuth, SymptomController.get);
router.get('/symptoms', boAuth, SymptomController.getAllSymptom);
router.get('/symptoms/major', boAuth, SymptomController.getAllMajorSymptom);
router.put('/symptom', boAuth, SymptomController.update);
router.delete('/symptom/:id', boAuth, SymptomController.delete);

//elastic search
router.get('/user/contact/:id/:begin/:end/:distance/:time', boAuth, ElasticCallController.getUserContacts);
router.get('/user/trace/all', boAuth, ElasticCallController.getAllTrace);
router.get('/user/trace/:id/:begin/:end', boAuth, ElasticCallController.getUserTrace);
router.get('/user/trace/v2/:id/:begin/:end', boAuth, ElasticCallController.getUserTraceV2);
router.post('/user/contact/position', boAuth, ElasticCallController.getContactsAtPositionAndDate);
router.get('/user/incub/:idUser/:begin/:end', boAuth, ElasticCallController.getIncubContact);
router.get('/user/risk-level/:id', boAuth, ElasticCallController.getRiskLevel);

// self reporting
router.get('/reporting/self-reports', boAuth, SelfReportingController.getAllSelfReports);
router.get('/reporting/self-reports/:id', boAuth, SelfReportingController.getById);
router.get('/reporting/self-reports/by-user/:id', boAuth, SelfReportingController.getAllSelfReportsByUserId);
router.get('/reporting/self-reports/by-date/:date', boAuth, SelfReportingController.getAllSelfReportsByDate);
router.get('/reporting/riskfactors', boAuth, SelfReportingController.getAllRiskFactors);

//Route RiskFactor
router.post('/risk-factor', boAuth, RiskFactorController.create);
router.get('/risk-factor/:id', boAuth, RiskFactorController.get);
router.get('/risk-factors', boAuth, RiskFactorController.getAllRiskFactor);
router.put('/risk-factor', boAuth, RiskFactorController.update);
router.get('/self-report/risk-factors/:idreport', SelfReportingController.getAllRiskByReport);
router.get('/self-report/:idreport/symptoms', SelfReportingController.getAllSymptomByReport);
router.delete('/risk-factor/:id', boAuth, RiskFactorController.delete);

// Push notification
router.post('/fb/push-notification', boAuth, PushNotificationController.sendMessage);
router.post('/fb/push-notification/add-token', boAuth, PushNotificationController.addToken);
router.get('/fb/push-notification/send', boAuth, PushNotificationController.pushBackOffice);

router.post('/push-notification', boAuth, PushNotificationOsController.sendMessage);

// Screening
router.post('/screening', boAuth, ScreeningController.create);
router.get('/screening', boAuth, ScreeningController.getAll);
router.get('/screening/:id', boAuth, ScreeningController.get);
router.get('/screening/by-self-reporting/:idSelfReporting', boAuth, ScreeningController.getAllBySelfReporting);

//Route Geofencing
router.post('/geofence', boAuth, GeofenceController.createGeofence);
router.get('/geofences', boAuth, GeofenceController.getGeofences);
router.get('/geofence/user/:id',boAuth, GeofenceController.getGeofenceUser);
router.get('/geofence/:id', boAuth, GeofenceController.getGeofence);

module.exports = router;
