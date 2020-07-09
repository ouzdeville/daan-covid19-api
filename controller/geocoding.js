const { Location, Zone, Prevalence, Geofence, ExitZone, User, BackOfficeUser } = require('./../models');
const { insidePolygon } = require('geolocation-utils');
const fetch = require('node-fetch');
module.exports = {
    async geosearch(req, res) {
        let { q } = req.params;

        const params = new URLSearchParams({
            q,
            limit: 1,
            format: "json"
        });

        const ENDPOINT = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
        const payload = await fetch(ENDPOINT).then(res => res.json());

        if (!payload || !payload.length) {
            res.status(200).send(payload);
            throw new Error(`No response for Address: ${q}`);
        }
        var i, j;
        zoneslist = [];
        let location = {
            latitude: parseFloat(payload[0].lat),
            longitude: parseFloat(payload[0].lon)
        }
        result = {
            "lat": payload[0].lat,
            "lon": payload[0].lon,
            "display_name": payload[0].display_name,
            "class": payload[0].class,
            "type": payload[0].type,
        };

        console.log(location);
        await Zone.findAll({
            where: {
                type: "COMMUNE",
            },
        }).then(async (zones) => {
            for (j = 0; j < zones.length; j++) {
                var poly = zones[j].polygon;
                rst = false;
                if (poly != null)
                    rst = insidePolygon(location, poly);
                if (rst) {
                    zoneslist.push(zones[j]);
                    //recuper la prévalence de cette zone si ça existe sinon le créer
                    //mettre à jour le nombre de cas
                }
                if (j == zones.length - 1) {

                    res.status(201).send({
                        success: true,
                        "lat": payload[0].lat,
                        "lon": payload[0].lon,
                        "display_name": payload[0].display_name,
                        "class": payload[0].class,
                        "type": payload[0].type,
                        zoneslist: zoneslist,
                    });
                }
            }
        });

        // console.log(payload);
        return payload;
    },

};