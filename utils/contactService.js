const {Location, Contact, Zone, User} = require('./../models');
const Sequelize = require('sequelize');
const {headingDistanceTo, insidePolygon} = require('geolocation-utils');
require('dotenv').config();
var CronJob = require('cron').CronJob;
const Op = Sequelize.Op;

var methods = {};
methods.runCronContact = function () {
    var job = new CronJob('*/10 * * * * *', function () {
        var idLocations = [];
        Location.findAll({
            where: {
                computed: 0
            }
        }).then((locations1) => {

            locations1.forEach(async (location1) => {


                idLocations.push(location1.id);
                //const startPoint = new GeoPoint(parseFloat(location1.lat), parseFloat(location1.lng));
                const startPoint = {lat: parseFloat(location1.lat), lon: parseFloat(location1.lng)}
                Location.findAll({
                    where: {
                        computed: 0,
                        id: {
                            [Op.notIn]: idLocations,
                        },
                    }
                }).then((locations2) => {

                    locations2.forEach(location2 => {
                        //const endPoint = new GeoPoint(parseFloat(location2.lat), parseFloat(location2.lng));
                        const endPoint = {lat: parseFloat(location2.lat), lon: parseFloat(location2.lng)}
                        //distance = startPoint.calculateDistance(endPoint);
                        distance = headingDistanceTo(startPoint, endPoint).distance;

                        duree = Math.abs(location1.timestamp - location2.timestamp) / 60000;
                        if (distance <= 1 //process.env.DISTANCE
                            && duree <= 5 //process.env.DUREE
                        ) {
                            Contact.create({
                                id: 0,
                                idUser1: location1.idUser,
                                idUser2: location2.idUser,
                                debut: location1.timestamp,
                                duree: duree,
                                distance: distance,
                                lat: location1.lat,
                                lng: location1.lng
                            });


                        } else {
                            console.log("distance:" + distance);
                            console.log("duree:" + duree);
                        }

                    });//Fin location2

                });

                await Location.update({computed: 1}, {
                    where: {
                        id: location1.id
                    }
                });

            });//Fin location1
        }).catch((error) => res.status(400).send(error));

    });
    job.start();
};
methods.locationInZone = function (location, zone) {
    const polygon = Array.of(zone.paths);
    return insidePolygon(location, polygon);
};

exports.data = methods;
