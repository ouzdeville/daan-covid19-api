const {BackOfficeUser} = require('./../models');
const {jwt} = require('./../providers');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    /**
     * @api {post} /bo-user Add back office user
     * @apiName CreateBackOfficeUser
     * @apiGroup BackOfficeUser
     *
     * @apiParam {String} userName user name
     * @apiParam {String} email email
     * @apiParam {String} password password
     * @apiParam {String} role role (superadmin, admin, decideur or daancovid19)
     * @apiParam {String} phone
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not (true)
     * @apiSuccess (Success 201) {String} message Response message
     *
     * @apiError (Success 400) {Object} error error details
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created."
     *     }
     *
     * @apiErrorExample Success-Response:
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "name": "SequelizeValidationError",
     *       "errors": [
     *         {
     *           "message": "Validation len on userName failed",
     *           "type": "Validation error",
     *           "path": "userName",
     *           "value": "cs",
     *           "origin": "FUNCTION",
     *           "instance": {
     *             "actif": true,
     *             "id": null,
     *             "userName": "cs",
     *             "email": "cheikh.camara@.com",
     *             "password": "$2b$10$hAH5oD/JxpqlYK4pEX931e5lx36ZvAPO0.muHyXXMcPw9NTDtXUZ6",
     *             "role": "superadmin",
     *             "phone": "+22177",
     *             "createdById": 5,
     *             "updatedAt": "2020-05-19T20:55:32.697Z",
     *             "createdAt": "2020-05-19T20:55:32.697Z"
     *           },
     *           "validatorKey": "len",
     *           "validatorName": "len",
     *           "validatorArgs": [
     *             3,
     *             20
     *           ],
     *           "original": {
     *             "validatorName": "len",
     *             "validatorArgs": [
     *               3,
     *               20
     *             ]
     *           }
     *         },
     *         {
     *           "message": "Validation isEmail on email failed",
     *           "type": "Validation error",
     *           "path": "email",
     *           "value": "cheikh.camara@.com",
     *           "origin": "FUNCTION",
     *           "instance": {
     *             "actif": true,
     *             "id": null,
     *             "userName": "cs",
     *             "email": "cheikh.camara@.com",
     *             "password": "$2b$10$hAH5oD/JxpqlYK4pEX931e5lx36ZvAPO0.muHyXXMcPw9NTDtXUZ6",
     *             "role": "superadmin",
     *             "phone": "+22177",
     *             "createdById": 5,
     *             "updatedAt": "2020-05-19T20:55:32.697Z",
     *             "createdAt": "2020-05-19T20:55:32.697Z"
     *           },
     *           "validatorKey": "isEmail",
     *           "validatorName": "isEmail",
     *           "validatorArgs": [
     *             {
     *               "allow_display_name": false,
     *               "require_display_name": false,
     *               "allow_utf8_local_part": true,
     *               "require_tld": true
     *             }
     *           ],
     *           "original": {
     *             "validatorName": "isEmail",
     *             "validatorArgs": [
     *               {
     *                 "allow_display_name": false,
     *                 "require_display_name": false,
     *                 "allow_utf8_local_part": true,
     *                 "require_tld": true
     *               }
     *             ]
     *           }
     *         }
     *       ]
     *     }
     */
    create(req, res) {
        const cryptedPassword = bcrypt.hashSync(req.body.password, saltRounds);
        console.log("creation", req.body);
        const data = {
            userName: req.body.userName,
            email: req.body.email,
            password: cryptedPassword,
            role: req.body.role,
            phone: req.body.phone,
            createdById: req.boUserID
        };
        console.log("creation", req.body);
        BackOfficeUser.create(data)
            .then((user) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.'
                });
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {post} /bo-user/auth Authentification
     * @apiName AuthBackOfficeUser
     * @apiGroup BackOfficeUser
     *
     * @apiParam {String} userName user name
     * @apiParam {String} password password
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not (true)
     * @apiSuccess (Success 200) {String} userName
     * @apiSuccess (Success 200) {String} email
     * @apiSuccess (Success 200) {String} role
     * @apiSuccess (Success 200) {Object} token token
     *
     * @apiError (Error 401) {Boolean} success If it works ot not (false)
     * @apiError (Error 401) {String} message Response message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "userName": "sidya",
     *       "email": "cheikh.camara@gsietechnology.com",
     *       "role": "superadmin",
     *       "token": {
     *         "token": "<token>",
     *         "expiresIn": 2592000,
     *         "createdAt": "2020-05-19T20:59:04.788Z"
     *       }
     *     }
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 401 Unauthorized
     *     {
     *       "success": false,
     *       "message": "Nom d'utilisateur ou mot de passe invalide"
     *     }
     */
    auth(req, res) {
        const {userName, password} = req.body;

        BackOfficeUser.findOne({
            where: {
                userName: userName
            }
        }).then((user) => {
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const token = jwt.sign({boUserID: user.id});
                    res.status(200).send({
                        success: true,
                        userName: user.userName,
                        email: user.email,
                        role: user.role,
                        token: token
                    });
                } else {
                    res.status(401).send({
                        success: false,
                        message: "Nom d'utilisateur ou mot de passe invalide"
                    });
                }
            }).catch(err => {
                res.status(401).send({
                    success: false,
                    message: "Nom d'utilisateur ou mot de passe invalide"
                });
            })
        }).catch(err => {
            res.status(401).send({
                success: false,
                message: "Nom d'utilisateur ou mot de passe invalide"
            });
        });
    },

    /**
     * @api {put} /bo-user/updatePassword Update Password
     * @apiName UpdatePasswordBackOfficeUser
     * @apiGroup BackOfficeUser
     *
     * @apiParam {String} oldPassword old password
     * @apiParam {String} newPassword new password
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not (true)
     * @apiSuccess (Success 200) {String} message Response message
     *
     * @apiError (Error 401) {Boolean} success If it works ot not (false)
     * @apiError (Error 401) {String} message Response message
     *
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully updated."
     *     }
     *
     * @apiErrorExample Invalide Password Error
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "succes": false,
     *       "message": "Ancien mot de passe non valide"
     *     }
     *
     * @apiErrorExample Other Error
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "succes": false,
     *       "message": "Une erreur est survenue lors de la modification du mot de passe"
     *     }
     */
    updatePassword(req, res) {
        const {oldPassword, newPassword} = req.body;

        const errorMessage = {
            succes: false,
            message: "Une erreur est survenue lors de la modification du mot de passe"
        }

        BackOfficeUser.findOne({
            where: {
                id: req.boUserID
            }
        }).then((user) => {
            bcrypt.compare(oldPassword, user.password).then(function (result) {
                if (result) {
                    BackOfficeUser.update(
                        {password: bcrypt.hashSync(newPassword, saltRounds)},
                        {where: {id: req.boUserID}}
                    )
                        .then((user) => {
                            res.status(201).send({
                                success: true,
                                message: 'Successfully updated.'
                            });
                        })
                        .catch((error) => res.status(400).send(errorMessage));
                } else {
                    res.status(400).send({
                        succes: false,
                        message: "Ancien mot de passe non valide"
                    });
                }
            }).catch(err => {
                res.status(400).send(errorMessage);
            })
        }).catch(err => {
            res.status(400).send(errorMessage);
        });
    },

    /**
     * @api {get} /bo-user List
     * @apiName GetAllBackOfficeUser
     * @apiGroup BackOfficeUser
     *
     * @apiSuccess (Success 200) {Object[]} users List of users
     * @apiSuccess (Success 200) {Number} users.id ID
     * @apiSuccess (Success 200) {String} users.userName userName
     * @apiSuccess (Success 200) {String} users.email email
     * @apiSuccess (Success 200) {String} users.role role
     * @apiSuccess (Success 200) {Boolean} users.actif actif
     * @apiSuccess (Success 200) {Date} users.createdAt createdAt
     * @apiSuccess (Success 200) {Object} users.CreatedBy CreatedBy
     * @apiSuccess (Success 200) {Number} users.CreatedBy.id ID
     * @apiSuccess (Success 200) {String} users.CreatedBy.userName userName
     * @apiSuccess (Success 200) {String} users.CreatedBy.email email
     *
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *     {
     *       "users": [
     *         {
     *           "id": 5,
     *           "userName": "sidya",
     *           "email": "sidya.camara@gmail.com",
     *           "role": "superadmin",
     *           "actif": true,
     *           "phone": "+22177",
     *           "createdAt": "2020-05-19T13:57:27.417Z",
     *           "CreatedBy": null
     *         },
     *         {
     *           "id": 9,
     *           "userName": "cscamara",
     *           "email": "cheikh.camara@gsietechnology.com",
     *           "role": "superadmin",
     *           "actif": true,
     *           "phone": "+221765760976",
     *           "createdAt": "2020-05-19T20:50:25.023Z",
     *           "CreatedBy": {
     *             "id": 5,
     *             "userName": "sidya",
     *             "email": "sidya.camara@gmail.com"
     *           }
     *         }
     *       ]
     *     }
     */
    getAll(req, res) {
        BackOfficeUser.findAll({
            attributes: ['id', 'userName', 'email', 'role', 'actif', 'phone', 'createdAt'],
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

    /**
     * @api {get} /bo-user/:id Get User by ID
     * @apiName GetBackOfficeUser
     * @apiGroup BackOfficeUser
     *
     * @apiSuccess (Success 200) {Number} id ID
     * @apiSuccess (Success 200) {String} userName userName
     * @apiSuccess (Success 200) {String} email email
     * @apiSuccess (Success 200) {String} role role
     * @apiSuccess (Success 200) {Boolean} actif actif
     * @apiSuccess (Success 200) {Date} createdAt createdAt
     * @apiSuccess (Success 200) {Object} CreatedBy CreatedBy
     * @apiSuccess (Success 200) {Number} CreatedBy.id ID
     * @apiSuccess (Success 200) {String} CreatedBy.userName userName
     * @apiSuccess (Success 200) {String} CreatedBy.email email
     *
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *     {
     *       {
     *         "id": 9,
     *         "userName": "cscamara",
     *         "email": "cheikh.camara@gsietechnology.com",
     *         "role": "superadmin",
     *         "actif": true,
     *         "phone": "+221775760976",
     *         "createdAt": "2020-05-19T20:50:25.023Z",
     *         "CreatedBy": {
     *           "id": 5,
     *           "userName": "sidya",
     *           "email": "sidya.camara@gmail.com"
     *         }
     *       }
     *     }
     */
    get(req, res) {
        const {id} = req.params;

        BackOfficeUser.findOne({
            attributes: ['id', 'userName', 'email', 'role', 'actif', 'phone', 'createdAt'],
            include: [{
                model: BackOfficeUser,
                as: 'CreatedBy',
                attributes: ['id', 'userName', 'email'],
            }],
            where: {
                id: id
            }
        })
            .then((user) => {
                res.status(200).send(user);
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /bo-user/:id/change-statut Change statut of a user
     * @apiName ChangeStatutBackOfficeUser
     * @apiGroup BackOfficeUser
     *
     * @apiSuccess (Created 201) {Number} id ID
     * @apiSuccess (Created 201) {String} userName userName
     * @apiSuccess (Created 201) {String} email email
     * @apiSuccess (Created 201) {String} role role
     * @apiSuccess (Created 201) {Boolean} actif actif
     * @apiSuccess (Created 201) {Date} createdAt createdAt
     * @apiSuccess (Created 201) {Object} CreatedBy CreatedBy
     * @apiSuccess (Created 201) {Number} CreatedBy.id ID
     * @apiSuccess (Created 201) {String} CreatedBy.userName userName
     * @apiSuccess (Created 201) {String} CreatedBy.email email
     *
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 200 OK
     *     {
     *       {
     *         "id": 9,
     *         "userName": "cscamara",
     *         "email": "cheikh.camara@gsietechnology.com",
     *         "role": "superadmin",
     *         "actif": false,
     *         "phone": "+221775760976",
     *         "createdAt": "2020-05-19T20:50:25.023Z",
     *         "CreatedBy": {
     *           "id": 5,
     *           "userName": "sidya",
     *           "email": "sidya.camara@gmail.com"
     *         }
     *       }
     *     }
     */
    changeStatut(req, res) {
        const {id} = req.params;

        BackOfficeUser.findOne({
            attributes: ['id', 'userName', 'email', 'role', 'actif', 'phone', 'createdAt'],
            include: [{
                model: BackOfficeUser,
                as: 'CreatedBy',
                attributes: ['id', 'userName', 'email'],
            }],
            where: {
                id: id
            }
        })
            .then((user) => {
                BackOfficeUser.update(
                    {actif: !user.actif},
                    {where: {id: id}}
                )
                    .then((user2) => {
                        res.status(201).send(user);
                    })
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {put} /bo-user/:id Update user
     * @apiName UpdateBackOfficeUser
     * @apiGroup BackOfficeUser
     *
     * @apiParam {String} userName userName
     * @apiParam {String} email email
     * @apiParam {String} phone phone
     * @apiParam {String} role role (a user can't update his own role)
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not (true)
     * @apiSuccess (Success 200) {String} message Response message
     *
     * @apiError (Error 400) {Boolean} success If it works ot not (false)
     * @apiError (Error 400) {String} message Response message
     *
     * @apiSuccessExample Success-Response
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully updated."
     *     }
     *
     * @apiErrorExample Other Error
     *     HTTP/1.1 400 Bad Request
     *     {
     *       "succes": false,
     *       "message": "An error occured when updating the user"
     *     }
     */
    update(req, res) {
        const id = req.params.id;

        let data;

        if (parseInt(req.boUserID) === parseInt(id)) {
            data = {
                userName: req.body.userName,
                email: req.body.email,
                phone: req.body.phone
            }
        } else {
            data = {
                userName: req.body.userName,
                email: req.body.email,
                role: req.body.role,
                phone: req.body.phone
            }
        }

        BackOfficeUser.update(
            data,
            {where: {id: id}}
        )
            .then((user) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully updated.'
                });
            })
            .catch((error) => res.status(400).send({
                succes: false,
                message: "An error occured when updating the user"
            }));
    },
}