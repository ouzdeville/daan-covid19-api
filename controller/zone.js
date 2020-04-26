const {Zone} = require('./../models');
const {insidePolygon} = require('geolocation-utils');

module.exports = {
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

  getZones(req, res) {
    Zone.findAll()
      .then((zones) => {
        res.status(200).send({
          zones,
        });
      })
      .catch((error) => res.status(400).send(error));
  },

  getZone(req, res) {
    const {id} = req.params;
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

  isInAZone(req, res) {
    var area = {};
    const {latitude, longitude} = req.params;
    const location = [parseFloat(latitude), parseFloat(longitude)];
    //console.log(location);
    Zone.findAll().then((zones) => {
      zones.forEach(zone => {
        var poly = (zone.polygon);
        //poly=JSON.parse(poly);

        console.log(poly);
        const rst = insidePolygon(location, poly);
        if (rst) {
          area = zone;
        }
      });
      res.status(200).send({area,});

    }).catch((error) => console.log(error));
  },
};