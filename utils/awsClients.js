const AWS = require('aws-sdk');

module.exports = {
  sns() {
    AWS.config.update({
      accessKeyId: process.env.AWS_SNS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SNS_SECRET,
      region: process.env.AWS_SNS_REGION,
    });
    return new AWS.SNS();
  },

  _kinesis() {
    AWS.config.update({
      accessKeyId: process.env.AWS_KINESIS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_KINESIS_SECRET,
      region: process.env.AWS_KINESIS_REGION,
    });
    return new AWS.Kinesis({ region: process.env.AWS_KINESIS_REGION });
  },

  async writeToKinesis(data) {
    const recordParams = {
      Data: JSON.stringify(data),
      StreamName: process.env.AWS_KINESIS_STREAM_NAME,
      PartitionKey: process.env.AWS_KINESIS_PARTITION_KEY,
    };
    return await this._kinesis().putRecord(recordParams).promise();
  }
}