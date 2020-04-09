const { User } = require('./../models');
const { otpProvider } = require('./../providers');

module.exports = {
  async create(req, res) {
    await otpProvider.generateOTP(req.body.phone);
    User.create({
      active: false,
      phone: req.body.phone,
    }).then(user => {
      res.status(201).send({
            success: true,
            message: "Successfully created.",
            user
          });
    })
    .catch(error => res.status(400).send(error));;
  },

  get(req, res) {
    res.send({ message: 'hi :)'});
  }
}