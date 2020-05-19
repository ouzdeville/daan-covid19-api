const {BackOfficeUser} = require('./../models');
const {jwt} = require('./../providers');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    create(req, res) {
        const cryptedPassword = bcrypt.hashSync(req.body.password, saltRounds);

        const data = {
            userName: req.body.userName,
            email: req.body.email,
            password: cryptedPassword,
            role: req.body.role,
            createdById: req.boUserID
        };

        BackOfficeUser.create(data)
            .then((user) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.'
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    auth(req, res) {
        const {userName, password} = req.body;

        BackOfficeUser.findOne({
            where: {
                userName: userName
            }
        }).then((user) => {
            bcrypt.compare(password, user.password).then(function(result) {
                if (result) {
                    const token = jwt.sign({userName: user.userName});
                    res.status(200).send({
                        error: false,
                        token: token
                    });
                } else {
                    res.status(401).send({
                        error: true,
                        message: "Nom d'utilisateur ou mot de passe invalide"
                    });
                }
            }).catch(err => {
                res.status(401).send({
                    error: true,
                    message: "Nom d'utilisateur ou mot de passe invalide"
                });
            })
        }).catch(err => {
            res.status(401).send({
                error: true,
                message: "Nom d'utilisateur ou mot de passe invalide"
            });
        });
    },

    getAll(req, res) {
        BackOfficeUser.findAll({
            attributes: ['id', 'userName', 'email', 'role', 'actif', 'createdAt'],
            include: [{
                model: BackOfficeUser,
                as: 'CreatedBy',
                attributes: ['id', 'userName', 'email'],
            }],
        })
            .then((users) => {
                res.status(200).send({
                    users,
                });
            })
            .catch((error) => res.status(400).send(error));
    },
}