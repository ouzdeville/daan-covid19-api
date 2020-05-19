const {Contact, User} = require('./../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    
    getContacts(req, res) {
        Contact.findAll({
            include: [{
                model: User,
                as: 'Contact1'
            }, {
                model: User,
                as: 'Contact2'
            }]
        })
            .then((contacts) => {
                res.status(200).send({
                    contacts,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    
    getContact(req, res) {
        const {id} = req.params;
        Contact.findOne({
            where: {
                id: id
            }, include: [{
                model: User,
                as: 'Contact1'
            }, {
                model: User,
                as: 'Contact2'
            }]
        })
            .then(async (contact) => {

                res.status(200).send({
                    contact,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    
    getIncubContact(req, res) {
        const {idUser} = req.params;
        Contact.findAll({
            where: {
                [Op.or]: [
                    {
                        idUser1: idUser,
                        debut: {
                            [Op.between]: [
                                Sequelize.col('Contact2.debutincubation'),
                                Sequelize.col('Contact2.finincubation')
                            ]
                        }
                    },
                    {
                        idUser2: idUser,
                        debut: {
                            [Op.between]: [
                                Sequelize.col('Contact1.debutincubation'),
                                Sequelize.col('Contact1.finincubation')
                            ]
                        }
                    }
                ]
            },
            include: [{
                model: User,
                as: 'Contact1'
            }, {
                model: User,
                as: 'Contact2'
            }]
        })
            .then((contacts) => {
                res.status(200).send({
                    contacts,
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    get(req, res) {
        res.send({message: 'hi :)'});
    },
}