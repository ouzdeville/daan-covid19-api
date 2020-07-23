const { Encounter } = require('./../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    /**
     * @api {post} /encounter Add bluetooth Encounter
     * @apiHeader {String} authorization User unique token
     * @apiName createEncounter
     * @apiGroup Bluetooth
     * @apiParam {String} tell_token tell token of infected person
     * @apiParam {Number} last_seen timestamp of creation
     * @apiParam {String} tag of the whisper version
     * @apiParam {Number} organisation code of implementation
     *
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} Encounter object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created.",
     *       "ecounter":{ 
     *              id: 'id',
     *            }
     *     }
     */
    createEncounter(req, res) {
        const data = {
            tell_token: req.body.tell_token,
            last_seen: req.body.last_seen,
            tag: req.body.tag,
            organisation: req.body.organisation
        };


        Encounter.create(data)
            .then((encounter) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    encounter: encounter,
                });

                //send notification to people 
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {post} /encounter/bulk Add bluetooth Encounter in bulk mode
     * @apiHeader {String} authorization User unique token
     * @apiName createEncounter
     * @apiGroup Bluetooth
     * @apiParam {JSON} bulk list of encounter object (tell_token, last_seen, tag, organisation)
     *
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} Encounter object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created."
     *     }
     */
    createEncounterBulk(req, res) {
        const bulk = req.body.bulk;
        res.status(201).send({
            success: true,
            message: 'Successfully created.'
        });

        bulk.forEach(element => {

            Encounter.create(data)
            .catch((error) => console.log(error));
        });


    },

    /**
     * @api {get} /encounters/:timestamp  get encounters
     * @apiName getEncounters
     * @apiGroup Bluetooth
     *
     * @apiParam {Number} timestamp 
     * @apiSuccess (Success 200) {JSON} encounters
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "encounters":[
     *          {
     *             tell_token:,
     *             last_seen:,
     *             tag:,
     *             organisation:,
     * 
     *          }
     *          {
     *             tell_token:,
     *             last_seen:,
     *             tag:,
     *             organisation:,
     * 
     *          }
     *      
     *       ]
     *     }
     */
    async getEncountersAfter(req, res) {
        try {
            const { timestamp } = req.params;
            Encounter.findAll({
                where: {
                    last_seen: {
                        [Op.gte]: timestamp
                    }
                }
            }).then((encounters) => {
                    res.status(200).send({
                        encounters,
                    });
                })
            
        } catch (error) {

            console.error(error);
            res.status(400).send(error)
        }
    },
}