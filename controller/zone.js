const {Zone} = require('./../models');
const {insidePolygon} = require('geolocation-utils');


module.exports = {
    createZone(req, res) {
        const zone = req.body;
        //lat,lon;lat,lon;lat,lon;lat,lon
        var polygon = [];
        const spolygone = zone.polygon + '';
        latlons = spolygone.split(";");
        latlons.forEach(latlon => {
            position = latlon.split(",");
            const location = [parseFloat(position[0]), parseFloat(position[1])];
            if (location.length == 2)
                polygon.push(location);
        });

        zone.polygon = polygon;
        Zone.create(zone)
            .then((zone) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    zone:zone,
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