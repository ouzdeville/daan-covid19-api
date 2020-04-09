const { awsClients } = require('./../utils');
module.exports = {
  async sendSms(receiver, message, subject = 'Daan Covid19') {
    return await awsClients.sns().publish({
      Message: message,
      Subject: subject,
      PhoneNumber: receiver,
    }).promise();
  },
};