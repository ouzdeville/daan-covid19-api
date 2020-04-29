const admin = require('firebase-admin');

const serviceAccount = require("../config/firebase_admin_sdk_key.json");

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
  sendMessage(req, res) {
    const message = {
      notification: {
        title: 'Hello',
        body: 'World'
      },
      topic: 'daily-stats'
    }

    sendPushNotification(message);
    res.status(200).send(':-)');
  }
}