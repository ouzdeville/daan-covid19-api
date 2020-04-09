const AWS = require('aws-sdk');

module.exports = {
  sns() {
    AWS.config.update({
      accessKeyId: process.env.AWS_SNS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SNS_SECRET,
      region: 'us-east-1',
    });
    return new AWS.SNS();
  }
}