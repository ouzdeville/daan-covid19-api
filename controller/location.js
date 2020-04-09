const { Location } = require('./../models');

module.exports = {
  registerLocation(req, res) {
    const location = req.body;
    Location.create(location)
      .then((_location) => {
        res.status(201).send({
          success: true,
          message: 'Successfully created.',
          _location,
        });
      })
      .catch((error) => res.status(400).send(error));;
  },

  getUserLocations(req, res) {
    const { idUser } = req.params;
    Location.findAll({
      idUser,
    })
      .then((locations) => {
        res.status(201).send({
          locations,
        });
      })
      .catch((error) => res.status(400).send(error));;;
  }
}