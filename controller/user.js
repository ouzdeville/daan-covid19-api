const { User } = require('./../models');

module.exports = {
  create(req, res) {
    User.create({
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