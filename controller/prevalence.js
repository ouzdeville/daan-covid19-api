const {Prevalence} = require('./../models');

module.exports = {
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
