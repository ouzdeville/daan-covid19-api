const AWS = require('aws-sdk');

module.exports = {
  sns() {
    AWS.config.update({
      accessKeyId: process.env.AWS_SNS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SNS_SECRET,
      region: 'us-east-1',
    });
    return new AWS.SNS();
  },

  _kinesis() {
    AWS.config.update({
      accessKeyId: process.env.AWS_KINESIS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_KINESIS_SECRET,
      region: 'us-east-1',
    });
    return new AWS.Kinesis({ region: 'us-east-1' });
  },

  async writeToKinesis(data) {
    const recordParams = {
      Data: JSON.stringify(data),
      StreamName: 'danncovid19-data-stream',
      PartitionKey: 'partition-1',
    };
    return await this._kinesis().putRecord(recordParams).promise();
  }
}