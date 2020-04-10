const { awsClients } = require('./../utils');
var axios = require('axios');
var qs = require('qs');
const uuid = require('uuid/v4');


module.exports = {
  async sendSms(receiver, message, subject = 'Daan Covid19') {
    // return await awsClients.sns().publish({
    //   Message: message,
    //   Subject: subject,
    //   PhoneNumber: receiver,
    // }).promise();
    return await axios({
      method: 'post',
      url: process.env.SMS_GATEWAY,
      data: qs.stringify({
        id: uuid(),
        text: message,
        to: receiver,
        from: 'DaanCovid19',
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
  },
};