const { Zone } = require('./../models');
const { insidePolygon } = require('geolocation-utils');

module.exports = {
    /**
     * @api {post} /zone Add Zone
     * @apiHeader {String} authorization User unique token
     * @apiName CreateZone
     * @apiGroup Zone
     * @apiParam {Number} name name of the zone
     * @apiParam {JSON} obersvation static information about this zone
     * @apiParam {String} polygon in the format lat,lon;lat,lon;lat,lon;lat,lon
     * @apiParam {idParent} Id zone parent
     *
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} Zone a Zone object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created.",
     *       "zone":{ 
     *              id: 'dc19zone',
     *            }
     *     }
     */
    createZone(req, res) {
        const data = {
            name: req.body.name,
            description: req.body.description,
            idParent: req.body.idParent,
            type: req.body.type,
            longitude: req.body.longitude,
            latitude: req.body.latitude
        };

        //lat,lon;lat,lon;lat,lon;lat,lon
        const spolygone = req.body.polygon + '';

        data.polygon = spolygone.split(";").map(function (latlon) {
            return latlon.split(",").map(e => parseFloat(e))
        })

        if (data.idParent === '')
            data.idParent = null;

        Zone.create(data)
            .then((zone) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    zone: zone,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /zones zones list
     * @apiHeader {String} authorization User unique token
     * @apiName getZones
     * @apiGroup Zone
     *
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *              {
     *                   "_index": "dc19zone",
     *                   "_type": "_doc",
     *                   "_id": "McmhnXEBunV4c_XiukIA",
     *                   "_score": 1,
     *                   "_source": {
     *                       "zone": {
     *                           "polygon": {
     *                               "type": "polygon",
     *                               "coordinates": [
     *                                   [
     *                                       [
     *                                           -17.4962,
     *                                           14.7007
     *                                       ],
     *                                       [
     *                                           -17.4274,
     *                                           14.7007
     *                                       ],
     *                                       [
     *                                           -17.4274,
     *                                           14.7535
     *                                       ],
     *                                       [
     *                                           -17.4962,
     *                                           14.7535
     *                                       ],
     *                                       [
     *                                           -17.4962,
     *                                           14.7007
     *                                       ]
     *                                   ]
     *                               ]
     *                           },
     *                           "name": "Dakar",
     *                           "observation": "épicentre du pays"
     *                       }
     *                   }
     *               }
     *           ]
     *          
     *       
     *     }
     */
    getZones(req, res) {
        Zone.findAll()
            .then((zones) => {
                res.status(200).send({
                    zones,
                });
            })
            .catch((error) => res.status(400).send(error));
    },


    /**
     * @api {get} /zone/:id zone list
     * @apiHeader {String} authorization User unique token
     * @apiName getZone
     * @apiGroup Zone
     *
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *              {
     *                   "_index": "dc19zone",
     *                   "_type": "_doc",
     *                   "_id": "McmhnXEBunV4c_XiukIA",
     *                   "_score": 1,
     *                   "_source": {
     *                       "zone": {
     *                           "polygon": {
     *                               "type": "polygon",
     *                               "coordinates": [
     *                                   [
     *                                       [
     *                                           -17.4962,
     *                                           14.7007
     *                                       ],
     *                                       [
     *                                           -17.4274,
     *                                           14.7007
     *                                       ],
     *                                       [
     *                                           -17.4274,
     *                                           14.7535
     *                                       ],
     *                                       [
     *                                           -17.4962,
     *                                           14.7535
     *                                       ],
     *                                       [
     *                                           -17.4962,
     *                                           14.7007
     *                                       ]
     *                                   ]
     *                               ]
     *                           },
     *                           "name": "Dakar",
     *                           "observation": "épicentre du pays"
     *                       }
     *                   }
     *               }
     *           ]
     *          
     *       
     *     }
     */
    getZone(req, res) {
        const { id } = req.params;
        Zone.findAll({
            where: {
                id: id
            }
        })
            .then((zones) => {
                res.status(200).send({
                    zones,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /user/inside/:latitude/:longitude Inside zone
     * @apiHeader {String} authorization User unique token
     * @apiName isInAZoneElastic
     * @apiGroup Zone
     *
     * @apiParam {Number} latitude GPS latitude
     * @apiParam {Number} longitude GPS longitude
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} result Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":{
     *          "zone": {
     *               "polygon": {
     *                   "type": "polygon",
     *                   "coordinates": [
     *                       [
     *                           [
     *                               -17.4962,
     *                               14.7007
     *                           ],
     *                           [
     *                               -17.4274,
     *                               14.7007
     *                           ],
     *                           [
     *                               -17.4274,
     *                               14.7535
     *                           ],
     *                           [
     *                               -17.4962,
     *                               14.7535
     *                           ],
     *                           [
     *                               -17.4962,
     *                               14.7007
     *                           ]
     *                       ]
     *                   ]
     *               },
     *               "name": "Dakar",
     *               "observation": "épicentre du pays"
     *           }
     * 
     *       }
     *          
     *       
     *     }
     */
    isInAZone(req, res) {
        let area =[];
        let { latitude, longitude } = req.params;
       // let location = [parseFloat(longitude),parseFloat(latitude)];
        let location ={
            latitude: parseFloat(latitude),
             longitude: parseFloat(longitude)
            }
        //console.log(location);
        Zone.findAll().then((zones) => {
            zones.forEach(zone => {
                var poly = (zone.polygon);
                //poly=JSON.parse(poly);
                rst = false;
                //console.log(poly);
                if (poly != null)
                    rst = insidePolygon(location, poly);
                if (rst) {
                    area.push(zone);
                }
            });
            res.status(200).send({ area, });

        }).catch((error) => console.log(error));
    },
};