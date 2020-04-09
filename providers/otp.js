const Chance = require('chance');
const { OTP } = require('./../models');
const { sendSms } = require('./smsProvider');
const chance = new Chance();

module.exports = {
  async generateOTP(phoneNumber) {
    const code = chance.string({
      length: 4,
      pool: '0123456789',
    });
    await OTP.destroy({
      where: {
        associatedPhoneNumber: phoneNumber,
      },
    });
    const otp = await OTP.create({
      code,
      associatedPhoneNumber: phoneNumber,
    });
    await sendSms(phoneNumber, `Bienvenue sur Daan Covid19 votre code est: ${code}`);
    return otp;
  }
}

