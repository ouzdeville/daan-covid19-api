const { Zone, Prevalence } = require('./../models');
const Sequelize = require('sequelize');
require('dotenv').config();
var CronJob = require('cron').CronJob;
const https = require('https');
var moment = require('moment');
const Op = Sequelize.Op;
var uuid = require('uuid');

module.exports = {
    async prevalenceCompute() {
        var url = 'https://services7.arcgis.com/Z6qiqUaS6ImjYL5S/arcgis/rest/services/Situation_Covid19_Mise_a_jour/FeatureServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&maxRecordCountFactor=5&orderByFields=Cas_conf%20DESC&outSR=102100&resultOffset=0&resultRecordCount=5000&cacheHint=true&quantizationParameters=%7B%22mode%22%3A%22view%22%2C%22originPosition%22%3A%22upperLeft%22%2C%22tolerance%22%3A1.0583354500042357%2C%22extent%22%3A%7B%22xmin%22%3A-17.483173135032132%2C%22ymin%22%3A12.474185961912667%2C%22xmax%22%3A-11.82930724143597%2C%22ymax%22%3A16.322471220470504%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%2C%22latestWkid%22%3A4326%7D%7D%7D';

        https.get(url, (res) => {
            let body = "";

            res.on("data", (chunk) => {
                body += chunk;
            });

            res.on("end", async () => {
                try {
                    let json = JSON.parse(body);
                    features = json.features;
                    await Prevalence.destroy({
                        where: {
                            date: moment().format("YYYY-MM-DD")
                        }
                      });
                    for (var district of features) {
                        prevdata = {
                            numberOfConfirmedCases: district.attributes.Cas_conf,
                            numberOfSupectedCases: 0,
                            numberOfContactsCases: 0,
                            numberOfRecoveredCases: 0, 
                            idZone: '',
                            date: await moment().format("YYYY-MM-DD")
                        };
                        const data = {
                            name: district.attributes.NAME,
                            men: district.attributes.Homme,
                            women: district.attributes.Femme,
                            type: "DISTRICT"
                        };



                        await Zone.findAll({
                            where: {
                                name: district.attributes.NAME,
                            },
                        }).then(async (zones) => {

                            if (zones.length <= 0) {
                                //console.log(data); 
                                await Zone.create(data).then((zone) => {
                                    prevdata.idZone = zone.id
                                });
                            }
                            else {
                                prevdata.idZone = await zones[0].id;
                            }

                            await Prevalence.findAll({
                                limit: 1,
                                where: {
                                    idZone: prevdata.idZone,
                                    //date: prevdata.date,
                                },
                                order: [['createdAt', 'DESC']]
                            }).then((prevexist) => {
                                //console.log(prevdata);
                                if (prevexist.length <= 0) {

                                    Prevalence.create(prevdata);
                                } else if (prevexist[0].numberOfConfirmedCases != prevdata.numberOfConfirmedCases) {
                                    
                                    Prevalence.create(prevdata);
                                }

                            });

                        });
                    }//);


                } catch (error) {
                    console.error(error);
                };
            });

        }).on("error", (error) => {
            console.error(error);
        });
    },
    prevalenceCron() {
        var job = new CronJob('* */300 * * * *', async function () {

            await module.exports.prevalenceCompute();

        });
        job.start();
    },

}
