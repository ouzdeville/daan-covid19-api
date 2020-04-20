const {Prevalence} = require('./../models');

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
     * @apiSuccess {Number} idZone Zone id
     * @apiSuccess {Date} date date
     * @apiSuccess {Number} numberOfConfirmedCases number of confirmed cases
     * @apiSuccess {Number} numberOfSupectedCases number of supected cases
     * @apiSuccess {Number} numberOfContactsCases number of contacts cases
     * @apiSuccess {Number} numberOfRecoveredCases number of recovered cases
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "firstname": "John",
     *       "lastname": "Doe"
     *     }
     *
     * @apiError UserNotFound The id of the User was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "UserNotFound"
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

    getAll(req, res) {
        Prevalence.findAll()
            .then((prevalences) => {
                res.status(200).send({
                    prevalences,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    getByZone(req, res) {
        const {idZone} = req.params;
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
    }
};
