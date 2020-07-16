const { Prevalence, Zone } = require('./../models');
const { prevalenceCron } = require('./../utils');
const moment = require('moment');
const fs = require('fs');
const turf = require('@turf/turf');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    /**
     * @api {post} /prevalence Add Prevalence
     * @apiName CreatePrevalence
     * @apiGroup Prevalence
     *
     * @apiParam {Number} idZone Zone id
     * @apiParam {Date} date date
     * @apiParam {Number} numberOfConfirmedCases number of confirmed cases
     * @apiParam {Number} numberOfSupectedCases number of supected cases
     * @apiParam {Number} numberOfContactsCases number of contacts cases
     * @apiParam {Number} numberOfRecoveredCases number of recovered cases
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {String} message Response message
     * @apiSuccess (Success 201) {Object} prevalence Prevalence object
     * @apiSuccess (Success 201) {Number} prevalence.id Prevalence id
     * @apiSuccess (Success 201) {Number} prevalence.idZone Zone id
     * @apiSuccess (Success 201) {Date} prevalence.date date
     * @apiSuccess (Success 201) {Number} prevalence.numberOfConfirmedCases number of confirmed cases
     * @apiSuccess (Success 201) {Number} prevalence.numberOfSupectedCases number of supected cases
     * @apiSuccess (Success 201) {Number} prevalence.numberOfContactsCases number of contacts cases
     * @apiSuccess (Success 201) {Number} prevalence.numberOfRecoveredCases number of recovered cases
     * @apiSuccess (Success 201) {Date} prevalence.updatedAt Creation date
     * @apiSuccess (Success 201) {Date} prevalence.createdAt Modification date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created.",
     *       "prevalence": {
     *         "id": 6,
     *         "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *         "date": "2020-04-19",
     *         "numberOfConfirmedCases": 10,
     *         "numberOfSupectedCases": 47,
     *         "numberOfContactsCases": 8,
     *         "numberOfRecoveredCases": 12,
     *         "updatedAt": "2020-04-20T22:55:41.419Z",
     *         "createdAt": "2020-04-20T22:55:41.419Z"
     *       }
     *     }
     */
    create(req, res) {
        const data = {
            idZone: req.body.idZone,
            date: req.body.date,
            numberOfConfirmedCases: req.body.numberOfConfirmedCases,
            numberOfSupectedCases: req.body.numberOfSupectedCases,
            numberOfContactsCases: req.body.numberOfContactsCases,
            numberOfRecoveredCases: req.body.numberOfRecoveredCases
        };

        Prevalence.create(data)
            .then((prevalence) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    prevalence,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /prevalences Get all prevalence
     * @apiName GetPrevalence
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {Object[]} prevalences List of prevalences
     * @apiSuccess (Success 200) {Number} prevalences.id Prevalence id
     * @apiSuccess (Success 200) {Number} prevalences.idZone Zone id
     * @apiSuccess (Success 200) {Date} prevalences.date date
     * @apiSuccess (Success 200) {Number} prevalences.numberOfConfirmedCases number of confirmed cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfSupectedCases number of supected cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfContactsCases number of contacts cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfRecoveredCases number of recovered cases
     * @apiSuccess (Success 200) {Date} prevalences.updatedAt Creation date
     * @apiSuccess (Success 200) {Date} prevalences.createdAt Modification date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "prevalences": [
     *         {
     *           "id": 5,
     *           "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-19T15:54:16.521Z",
     *           "updatedAt": "2020-04-19T15:54:16.521Z"
     *         },
     *         {
     *           "id": 6,
     *           "idZone": "b967a828-7dp4-459b-906a-f3ffdf8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-20T22:55:41.419Z",
     *           "updatedAt": "2020-04-20T22:55:41.419Z"
     *         }
     *       ]
     *     }
     */
    getAll(req, res) {
        Prevalence.findAll({
            include: [{
                model: Zone,
            }],
            order: [['createdAt', 'DESC']]
        })
            .then((prevalences) => {
                res.status(200).send({
                    prevalences,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /prevalence Get all actual prevalences for districts
     * @apiName GetPrevalence
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {Object[]} prevalences List of prevalences
     * @apiSuccess (Success 200) {Number} prevalences.id Prevalence id
     * @apiSuccess (Success 200) {Number} prevalences.idZone Zone id
     * @apiSuccess (Success 200) {Date} prevalences.date date
     * @apiSuccess (Success 200) {Number} prevalences.numberOfConfirmedCases number of confirmed cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfSupectedCases number of supected cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfContactsCases number of contacts cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfRecoveredCases number of recovered cases
     * @apiSuccess (Success 200) {Date} prevalences.updatedAt Creation date
     * @apiSuccess (Success 200) {Date} prevalences.createdAt Modification date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "prevalences": [
     *         {
     *           "id": 5,
     *           "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-19T15:54:16.521Z",
     *           "updatedAt": "2020-04-19T15:54:16.521Z"
     *         },
     *         {
     *           "id": 6,
     *           "idZone": "b967a828-7dp4-459b-906a-f3ffdf8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-20T22:55:41.419Z",
     *           "updatedAt": "2020-04-20T22:55:41.419Z"
     *         }
     *       ]
     *     }
     */
    async getprevalenceNow(req, res) {
        let now = await moment().format("YYYY-MM-DD")
        const { count } = await Zone.findAndCountAll({
            where: {
                type: "DISTRICT"
            }
        });
        Prevalence.findAll({
            limit: count,
            where: {
                date: now,
            },
            include: [{
                model: Zone,
                where: {
                    type: "DISTRICT"
                }
            }],
            order: [['createdAt', 'DESC']]
        })
            .then((prevalences) => {
                res.status(200).send({
                    prevalences,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /prevalence/:type Get all actual prevalences by type of zone
     * @apiName GetPrevalence
     * @apiGroup Prevalence
     * @apiParam {String} type "REGION", "DEPARTEMENT","ARRONDISSEMENT","COMMUNE" or "DISTRICT"
     * @apiSuccess (Success 200) {Object[]} prevalences List of prevalences
     * @apiSuccess (Success 200) {Number} prevalences.id Prevalence id
     * @apiSuccess (Success 200) {Number} prevalences.idZone Zone id
     * @apiSuccess (Success 200) {Date} prevalences.date date
     * @apiSuccess (Success 200) {Number} prevalences.numberOfConfirmedCases number of confirmed cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfSupectedCases number of supected cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfContactsCases number of contacts cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfRecoveredCases number of recovered cases
     * @apiSuccess (Success 200) {Date} prevalences.updatedAt Creation date
     * @apiSuccess (Success 200) {Date} prevalences.createdAt Modification date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "prevalences": [
     *         {
     *           "id": 5,
     *           "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-19T15:54:16.521Z",
     *           "updatedAt": "2020-04-19T15:54:16.521Z"
     *         },
     *         {
     *           "id": 6,
     *           "idZone": "b967a828-7dp4-459b-906a-f3ffdf8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-20T22:55:41.419Z",
     *           "updatedAt": "2020-04-20T22:55:41.419Z"
     *         }
     *       ]
     *     }
     */
    async getprevalenceByTypeNow(req, res) {
        var { type } = req.params;
        type = type.toUpperCase();
        let now = await moment().format("YYYY-MM-DD")
        const { count } = await Zone.findAndCountAll({
            where: {
                type: type
            }
        });
        Prevalence.findAll({
            limit: count,
            where: {
                date: now,
            },
            include: [{
                model: Zone,
                where: {
                    type: type
                }
            }],
            order: [['createdAt', 'DESC']]
        })
            .then((prevalences) => {
                res.status(200).send({
                    prevalences,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /prevalence/:idZone Get all prevalence by Zone
     * @apiName GetPrevalenceByZone
     * @apiGroup Prevalence
     *
     * @apiParam {UUID} idZone id of the zone
     *
     * @apiSuccess (Success 200) {Object[]} prevalences List of prevalences
     * @apiSuccess (Success 200) {Number} prevalences.id Prevalence id
     * @apiSuccess (Success 200) {Number} prevalences.idZone Zone id
     * @apiSuccess (Success 200) {Date} prevalences.date date
     * @apiSuccess (Success 200) {Number} prevalences.numberOfConfirmedCases number of confirmed cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfSupectedCases number of supected cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfContactsCases number of contacts cases
     * @apiSuccess (Success 200) {Number} prevalences.numberOfRecoveredCases number of recovered cases
     * @apiSuccess (Success 200) {Date} prevalences.updatedAt Creation date
     * @apiSuccess (Success 200) {Date} prevalences.createdAt Modification date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "prevalences": [
     *         {
     *           "id": 5,
     *           "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *           "date": "2020-04-20",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-19T15:54:16.521Z",
     *           "updatedAt": "2020-04-19T15:54:16.521Z"
     *         },
     *         {
     *           "id": 6,
     *           "idZone": "b967a828-7df4-459b-906d-f3ff4f8a05be",
     *           "date": "2020-04-19",
     *           "numberOfConfirmedCases": 10,
     *           "numberOfSupectedCases": 47,
     *           "numberOfContactsCases": 8,
     *           "numberOfRecoveredCases": 12,
     *           "createdAt": "2020-04-20T22:55:41.419Z",
     *           "updatedAt": "2020-04-20T22:55:41.419Z"
     *         }
     *       ]
     *     }
     */

    getByZone(req, res) {
        const { idZone } = req.params;
        Prevalence.findAll({
            where: {
                idZone: idZone
            }
        })
            .then((prevalences) => {
                res.status(200).send({
                    prevalences,
                });
            })
            .catch((error) => res.status(400).send(error));
    },
    /**
     * @api {get} /prevalence/run Refresh prevalence from COUS
     * @apiName runPrevalence
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {String} message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message":
     *     }
     */

    async runPrevalence(req, res) {
        try {
            await prevalenceCron.prevalenceComputeV2();


            res.status(200).send({
                success: true,
                code: 99,
                message: "Refresh done",
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code: -1,
            });
        }
    },
    /**
     * @api {get} /prevalence/rungps Get Update district GPS
     * @apiName runGPS
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {String} message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message":
     *     }
     */

    async updateGpsCenterOfDistrict(req, res) {
        try {
            var districtsgps = await require('./../init_data/districts-sn.json');
            for (var district of districtsgps) {
                //console.log(district);
                await Zone.update(
                    {
                        longitude: district.geometry.x,
                        latitude: district.geometry.y
                    },
                    {
                        where: {
                            name: district.attributes.NAME,
                            type: "DISTRICT"
                        }
                    });

            }
        } catch (error) {
            console.error(error);
            res.status(400).send(error)
        }

        res.status(200).send({
            success: true,
            code: 99,
            message: "Refresh done",
        });
    },



    /**
     * @api {get} /prevalence/runPolygonCommune  Update district polygone GPS
     * @apiName runPolygone
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {String} message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message":
     *     }
     */
    async runPolygonCommune(req, res) {
        try {
            let districtsgps = JSON.parse(fs.readFileSync('./init_data/Communes.geojson', 'utf8'));
            console.log('districtsgps.features.length');
            var region = { type: "REGION", name: "" };
            var departement = { type: "DEPARTEMENT", name: "" };
            var arondissement = { type: "ARRONDISSEMENT", name: "" };
            var commune = { type: "COMMUNE", name: "" };
            res.status(200).send({
                success: true,
                code: 99,
                message: "Refresh done",
            });
            //supprimer tous les élment de type concerné
            await Zone.destroy({
                where: {
                    type: {
                        [Op.or]: ["REGION", "DEPARTEMENT", "ARRONDISSEMENT", "COMMUNE"]
                    }
                }
            });
            for (var district of districtsgps.features) {
                let polygon = district.geometry.coordinates[0];
                commune.polygon = polygon;

                commune.name = module.exports.removeAccents(district.properties.ogr_CCRCA);

                if (region.name != module.exports.removeAccents(district.properties.ogr_REG)) {
                    region.name = module.exports.removeAccents(district.properties.ogr_REG);
                    await Zone.create(region).then((c_region) => {

                        region.name = c_region.dataValues.name;

                        departement.idParent = c_region.dataValues.id;
                    });
                }
                if (departement.name != module.exports.removeAccents(district.properties.ogr_DEPT)) {
                    departement.name = module.exports.removeAccents(district.properties.ogr_DEPT);

                    await Zone.create(departement).then((c_departement) => {
                        departement.name = c_departement.dataValues.name;

                        arondissement.idParent = c_departement.dataValues.id;
                    });
                }
                if (arondissement.name != module.exports.removeAccents(district.properties.ogr_CAV)) {
                    arondissement.name = module.exports.removeAccents(district.properties.ogr_CAV);

                    await Zone.create(arondissement).then((c_arondissement) => {
                        arondissement.name = c_arondissement.dataValues.name;

                        commune.idParent = c_arondissement.dataValues.id;
                    });
                }

                //var tpolygon = turf.polygon([polygon]);
                //var area = turf.area(tpolygon);
                //commune.area=area;
                await Zone.create(commune);
                console.log(region.name + "/" + departement.name + "/" + arondissement.name + "/" + commune.name);

            }

            
            module.exports.runPolygonDepartement(req,res);
            module.exports.runPolygonRegion(req,res);
        } catch (error) {
            console.error(error);
            res.status(400).send(error)
        }

        
    },

    /**
     * @api {get} /prevalence/runPolygone  Update district polygone GPS
     * @apiName runPolygone
     * @apiGroup Prevalence
     *
     * @apiSuccess (Success 200) {String} message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "message":
     *     }
     */
    async runPolygonDistrict(req, res) {
        try {
            let districtsgps = JSON.parse(fs.readFileSync('./init_data/Districts.geojson', 'utf8'));
            console.log('districtsgps.features.length');

            for (var district of districtsgps.features) {
                let polygon = district.geometry.coordinates[0][0];
                var tpolygon = turf.polygon([polygon]);
                var area = turf.area(tpolygon);
                if ("Dakar" == district.properties.NomDS) {
                    await Zone.update(
                        {
                            polygon: polygon,
                            area: area,
                        },
                        {
                            where: {
                                name: "DAKAR-CENTRE"
                            }
                        });
                } else if ("Dakar Ouest" == district.properties.NomDS) {

                    await Zone.update(
                        {
                            polygon: district.geometry.coordinates[1][0],
                            area: area,
                        },
                        {
                            where: {
                                name: district.properties.NomDS.toUpperCase().split(' ').join('-')
                            }
                        });
                } else if ("Ndiass" == district.properties.NomDS) {

                    await Zone.update(
                        {
                            polygon: polygon,
                            area: area,
                        },
                        {
                            where: {
                                name: "POPENGUINE"
                            }
                        });
                } else if ("Ngueniene" == district.properties.NomDS) {

                    await Zone.update(
                        {
                            polygon: polygon,
                            area: area,
                        },
                        {
                            where: {
                                name: "JOAL"
                            }
                        });
                } else if ("Nioro" == district.properties.NomDS) {

                    await Zone.update(
                        {
                            polygon: polygon,
                            area: area,
                        },
                        {
                            where: {
                                name: "NIORO DU RIP"
                            }
                        });
                } else if ("Koki" == district.properties.NomDS) {

                    await Zone.update(
                        {
                            polygon: polygon,
                            area: area,
                        },
                        {
                            where: {
                                name: "COKI"
                            }
                        });
                } else {
                    await Zone.update(
                        {
                            polygon: polygon,
                            area: area,
                        },
                        {
                            where: {
                                name: district.properties.NomDS.toUpperCase().split(' ').join('-')
                            }
                        });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(400).send(error)
        }

        res.status(200).send({
            success: true,
            code: 99,
            message: "Refresh done",
        });
    },
    removeAccents(str) {
        //console.log(str);
        let accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
        let accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
        str = str.split('');
        str.forEach((letter, index) => {
            let i = accents.indexOf(letter);
            if (i != -1) {
                str[index] = accentsOut[i];
            }
        })
        return str.join('').toUpperCase().split(' ').join('-');
    },

    async runPolygonDepartement(req, res) {
        try {
            let departements = JSON.parse(fs.readFileSync('./init_data/departements.geojson', 'utf8'));
            console.log('departements.features.length');
            
            res.status(200).send({
                success: true,
                code: 99,
                message: "Refresh done",
            });
            
            for (var departement of departements.features) {
                let polygon = departement.geometry.coordinates[0][0];
                await Zone.update(
                    {
                        men: departement.properties.POP_HOM,
                        women: departement.properties.POP_FEM,
                        area: departement.properties.Surface,
                        polygon : polygon
                    },
                    {
                        where: {
                            name: module.exports.removeAccents(departement.properties.NOM),
                            type: "DEPARTEMENT"
                        }
                    });
            }
            module.exports.updateCommunePopulation();
        } catch (error) {
            console.error(error);
            //res.status(400).send(error)
        }

        
    },

    async runPolygonRegion(req, res) {
        try {
            let regions = JSON.parse(fs.readFileSync('./init_data/regions.geojson', 'utf8'));
            console.log('regions.features.length');
            
            res.status(200).send({
                success: true,
                code: 99,
                message: "Refresh done",
            });
            
            for (var region of regions.features) {
                let polygon = region.geometry.coordinates[0][0];
                await Zone.update(
                    {
                        men: region.properties.POP_HOM,
                        women: region.properties.POP_FEM,
                        area: region.properties.AREA,
                        polygon : polygon
                    },
                    {
                        where: {
                            name: module.exports.removeAccents(region.properties.NOM),
                            type: "REGION"
                        }
                    });
            }
        } catch (error) {
            console.error(error);
            //res.status(400).send(error)
        }

        
    },


    async updateCommunePopulation(){
        let communes = JSON.parse(fs.readFileSync('./init_data/commune_pop.geojson', 'utf8'));
            for (var commune of communes.communes) {
                await Zone.update(
                    {
                        men: commune.TOTAL,
                        women: 0,
                        area: commune.SUP_HA,
                    },
                    {
                        where: {
                            name: module.exports.removeAccents(commune.CCRCA),
                            type: "COMMUNE"
                        }
                    });

            }
    },


    /**
     * @api {post} /prevalence/excel upload Excel Prevalence
     * @apiName storeExcelPrevalence
     * @apiGroup Prevalence
     *
     * @apiParam {File} filename
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created."
     *     }
     */
    storeExcelPrevalence(req, res) {
        try {
            return res.status(201).json({
                message: 'File uploded successfully'
            });
        } catch (error) {
            console.error(error);
        }
        let data = fs.readFileSync('./files/prevalence' + req.body.filename);
        
    }

};
