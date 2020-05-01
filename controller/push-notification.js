const admin = require('firebase-admin');

const serviceAccount = require("../config/firebase_admin_sdk_key.json");

const TOPIC = 'daily-stats';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://daan-covid19-d67c8.firebaseio.com"
});

function sendPushNotification(message) {
  // Send a message to devices subscribed to the provided topic.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

module.exports = {
  /**
   * @api {post} /push-notification/add-token Add the client Firebase token to receive message
   * @apiName AddToken
   * @apiGroup PushNotification
   *
   * @apiParam {String} fbToken the client Firebase token
   *
   * @apiSuccess (Success 201) {Boolean} success If it works ot not (true)
   * @apiSuccess (Success 201) {Object} message Response message
   *
   * @apiError (Error 422) {Boolean} success If it works ot not (false)
   * @apiError (Error 422) {Object} message Response message
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "success": true,
   *       "message": {
   *         "successCount": 1,
   *         "failureCount": 0,
   *         "errors": []
   *       }
   *     }
   */
  addToken(req, res) {
    let fbToken = req.body.fbToken;

    admin.messaging().subscribeToTopic(fbToken, TOPIC)
      .then(function(response) {
        res.status(201).send({
          success: true,
          message: response
        });
      })
      .catch(function(error) {
        res.status(422).send({
          success: false,
          message: error
        });
      });
  },

  /**
   * @api {post} /push-notification Send push notification
   * @apiName SendPushNotification
   * @apiGroup PushNotification
   *
   * @apiParam {String} title title of the message to send
   * @apiParam {String} body content of the message to send
   *
   * @apiSuccess (Success 200) {Boolean} success If it works ot not (true)
   * @apiSuccess (Success 200) {Object} message Response message
   *
   * @apiError (Error 422) {Boolean} success If it works ot not (false)
   * @apiError (Error 422) {Object} message Response message
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 201 Created
   *     {
   *       "success": true,
   *       "message": "projects/daan-covid19-d67c8/messages/4761779955531163224"
   *     }
   */
  sendMessage(req, res) {
    let title = req.body.title;
    let body = req.body.body;

    const message = {
      notification: {
        title: title,
        body: body
      },
      topic: TOPIC,
    }

    admin.messaging().send(message)
      .then((response) => {
        res.status(200).send({
          success: true,
          message: response
        });
      })
      .catch((error) => {
        res.status(422).send({
          success: false,
          message: error
        });
      });
  }
}

/*
admin.messaging().unsubscribeFromTopic(registrationTokens, topic)
  .then(function(response) {
    console.log('Successfully unsubscribed from topic:', response);
  })
  .catch(function(error) {
    console.log('Error unsubscribing from topic:', error);
  });*/
