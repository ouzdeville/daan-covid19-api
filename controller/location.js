const { Location, Zone, Prevalence } = require('./../models');
const { awsClients } = require('./../utils');
const { insidePolygon } = require('geolocation-utils');

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
     *           {
     *           "success": true,
     *           "message": "Successfully registered.",
     *           "zoneslist": [
     *               {
     *                   "id": 2690822,
     *                   "idZone": "77baa645-1143-48ca-b899-85c3230372e6",
     *                   "date": "2020-06-03",
     *                   "numberOfConfirmedCases": 269,
     *                   "numberOfSupectedCases": 0,
     *                   "numberOfContactsCases": 0,
     *                   "numberOfRecoveredCases": 0,
     *                   "createdAt": "2020-06-03T01:00:59.521Z",
     *                   "updatedAt": "2020-06-03T01:00:59.521Z",
     *                   "Zone": {
     *                       "id": "77baa645-1143-48ca-b899-85c3230372e6",
     *                       "name": "DAKAR-OUEST",
     *                       "description": null,
     *                       "idParent": null,
     *                       "type": "DISTRICT",
     *                       "longitude": null,
     *                       "latitude": null,
     *                       "men": 122039,
     *                       "women": 129360,
     *                       "area": 36410.1003234787,
     *                       "createdAt": "2020-05-07T18:00:00.326Z",
     *                       "updatedAt": "2020-05-21T20:35:16.007Z"
     *                   }
     *               }
     *           ]
     *       }
     */
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
            var i, j;
            zoneslist = [];
            Zone.findAll().then(async (zones) => {
                for (j = 0; j < zones.length; j++) {
                    var poly = (zones[j].polygon);
                    rst = false;
                    if (poly != null)
                        rst = insidePolygon(req.body.position, poly);
                    if (rst) {
                        await Prevalence.findOne({
                            where: {
                                idZone: zones[j].id
                            },
                            include: [{
                                model: Zone,
                            }],
                            order: [['createdAt', 'DESC']]
                        }).then(prevalence => {
                            if (prevalence) {
                                prevalence.Zone.polygon = null;
                                zoneslist.push(prevalence);
                            }
                        });
                    }
                    if (j == zones.length - 1) {
                        console.log("zoneslist");
                        console.log(JSON.stringify({
                            success: true,
                            message: 'Successfully registered.',
                            zoneslist: zoneslist,
                        }));
                        res.status(201).send({
                            success: true,
                            message: 'Successfully registered.',
                            zoneslist: zoneslist,
                        });
                    }
                }
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
                res.status(200).send({
                    locations,
                });
            })
            .catch((error) => res.status(400).send(error));
    }
}