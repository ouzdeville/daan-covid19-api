const Chance = require('chance');
const { OTP, User } = require('./../models');
const { sendSms } = require('./smsProvider');
const {cryptoUtil} = require('../utils');
const chance = new Chance();

module.exports = {
  async generateOTP(phoneNumber) {
     code = chance.string({
      length: 4,
      pool: '0123456789',
    });
    if (!phoneNumber.includes("+221")){
      code="2147";
    }
    const sphone=cryptoUtil.getSID(phoneNumber,process.env.JWT_SECRET);
    await OTP.destroy({
      where: {
        associatedPhoneNumber: sphone,
      },
    });
    const otp = await OTP.create({
      code,
      associatedPhoneNumber: sphone,
    });
    await sendSms(phoneNumber, `Bienvenue sur Daan Covid19 votre code est: ${code}`);
    return otp;
  },

  async verifyOtp({ code, phone}) {
    const exist = await OTP.findAll({
      where: {
        associatedPhoneNumber: phone,
        code
      },
    });
    if (exist && exist.length) {
      await OTP.destroy({
        where: {
          associatedPhoneNumber: phone,
        },
      });
      User.update(
        { active: 'active' },
        {
          where: {
            phone:phone,
          },
        },
      );
      return true;
    }
    return false;
  }
}

