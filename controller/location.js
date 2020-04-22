const { Location, User } = require('./../models');
const { awsClients } = require('./../utils');
module.exports = {
  /**
     * @api {post} /location Add Location
     * @apiName RegisterLocation
     * @apiGroup Location
     *
     * @apiParam {Number} userID id of Location
     * @apiParam {String} imei imei of User located
     * @apiParam {Date} created_date date of Location
     * @apiParam {String} position position of Location
     * @apiParam {String} status status of Location
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {String} message Response message
     *
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *         "success": true,
     *          "message": "Successfully created."
     *     }
     */
  async registerLocation(req, res) {
    try {
      const { userID } = req;
      const payload = {
        id: userID,
        imei: req.query.imei,
        created_date: req.query.timestamp,
        position: req.query.position,
        status: req.query.status || 'unknown'
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
  /**
     * @api {get} /location/:idUser Get user Locations by user id
     * @apiName GetUserLocations
     * @apiGroup Location
     *
     * @apiParam {Number} idUser id of the User
     *
     * @apiSuccess (Success 200) {Object[]} locations List of Location
     * @apiSuccess (Success 200) {Number} locations.id id of User Location
     * @apiSuccess (Success 200) {String} locations.imei imei's user Location
     * @apiSuccess (Success 200) {Date} locations.created_date creation date of Location
     * @apiSuccess (Success 200) {String} locations.position position of Location
     * @apiSuccess (Success 200) {String} locations.status status of Location
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "locations": [
     *              {
     *                "id": "",
     *                "imei": "",
     *                "created_date": "",
     *                "position": "",
     *                "status": "",
     *              },
     *              {
     *                "id": "",
     *                "imei": "",
     *                "created_date": "",
     *                "position": "",
     *                "status": "",
     *              },
     *          ]
     *     }
     */
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