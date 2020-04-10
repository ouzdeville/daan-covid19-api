const { User } = require('./../models');
const { otpProvider, jwt } = require('./../providers');

module.exports = {
  async create(req, res) {
    if (req.headers.issuer !== process.env.OAUTH_SECRET) {
      res.status(401).send({
        message: 'invalid issuer.',
      });
      return;
    }
    await otpProvider.generateOTP(req.body.phone);
    const token = jwt.sign({ phone: req.body.phone });
    const exist = await User.findAll({
      where: {
        phone: req.body.phone,
      },
    });
    if (exist && !exist.length) {
      User.create({
        active: false,
        phone: req.body.phone,
      })
        .then((user) => {
          res.status(201).send({
            success: true,
            message: 'Successfully created.',
            token,
          });
        })
        .catch((error) => res.status(400).send(error));
      return;
    }
    res.status(201).send({
      success: true,
      message: 'Successfully created.',
      token,
    });
  },

  get(req, res) {
    res.send({ message: 'hi :)'});
  }
}