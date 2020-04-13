const { Location, User } = require('./../models');
const { awsClients } = require('./../utils');

module.exports = {
  async registerLocation(req, res) {
    try {
      const { userID } = req;
      const payload = {
        id: userID,
        imei: req.body.imei,
        created_date: req.body.timestamp,
        position: req.body.position,
        status: req.body.status || 'unknown'
      };
      // logs requests
      console.log(payload);
      await awsClients.writeToKinesis(payload);
      res.status(201).send({
        success: true,
        message: 'Successfully registered.',
      });
    } catch (error) {
      res.status(401).send({ error });
    }
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