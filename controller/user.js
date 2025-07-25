const {User, Incubation, SelfReporting,} = require('./../models');
const {otpProvider, jwt} = require('./../providers');
const {cryptoUtil} = require('../utils');
const {Client} = require('@elastic/elasticsearch')
const {elasticClient} = require('./../utils');
const OneSignal = require('onesignal-node');

const client = new OneSignal.Client('3552b3b3-6e98-417e-a5a3-e73b723a6eb6',
    'OWM1OTNjMzEtYjhiYi00ZmIzLWI0N2UtMjcyMTVkZjYwN2My');
// const client = new Client({node: 'https://search-test-r7znlu2wprxosxw75c5veftgki.us-east-1.es.amazonaws.com'})

/**
 * User.
 * @module User management
 */

module.exports = {
    /** Creating user by genrating first an otp and jwt token
     * @param  {} req
     * @param  {} res
     */

    /**
     * @api {post} /user Add user and get a token
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiHeader {String} issuer application issuer
     *
     * @apiParam {String} phone Phone number
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {String} message Response message
     * @apiSuccess (Success 201) {UUID} idUser the user's ID
     * @apiSuccess (Success 201) {Object} token
     * @apiSuccess (Success 201) {String} token.token the token
     * @apiSuccess (Success 201) {Number} token.expiresIn number of second before expiration
     * @apiSuccess (Success 201) {Date} token.createdAt date of creation of the token
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created.",
     *       "idUser": "6cfb320a-bc39-48a6-b49f-3277646ad1d5",
     *       "token": {
     *         "token": "xxx",
     *         "expiresIn": 86400,
     *         "createdAt": "2020-04-28T17:57:22.114Z"
     *       }
     *     }
     */
    async create(req, res) {
        try {
            if (req.headers.issuer !== process.env.OAUTH_SECRET) {
                res.status(401).send({
                    message: 'invalid issuer.',
                });
                return;
            }
            const otp = await otpProvider.generateOTP(req.body.phone);
            sphone = cryptoUtil.getSID(req.body.phone, process.env.JWT_SECRET);
            const token = jwt.sign({phone: sphone});
            const exist = await User.findAll({
                where: {
                    phone: sphone,
                },
            });
            if (exist && !exist.length) {
                User.create({
                    active: 'pending',
                    phone: sphone,
                })
                    .then((user) => {
                        res.status(201).send({
                            success: true,
                            message: 'Successfully created.',
                            idUser: user.id,
                            token,
                        });
                    })
                    .catch((error) => res.status(400).send(error));
                return;
            } else {
                User.update(
                    {active: 'pending'},
                    {
                        where: {
                            phone: sphone,
                        },
                    },
                );
            }
            res.status(201).send({
                success: true,
                message: 'Successfully created.',
                idUser: exist[0].id,
                token,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);

        }
    },

    /**
     * @api {get} /user/verify_code Verify the user's OTP
     * @apiName verifyCode
     * @apiGroup User
     *
     * @apiHeader Authorization Bearer token
     *
     * @apiParam {String} code code to verify
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {String} message Response message
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 Success
     *     {
     *       "success": true,
     *       "message": "Successfully verified."
     *     }
     */
    async verifyCode(req, res) {
        try {
            const verification = await otpProvider.verifyOtp({
                code: req.body.code,
                phone: req.phone,
            });
            if (verification) {
                res.send({success: true, message: 'Successfully verified.'});
            }
            res.status(401).send({message: 'verification error'});
        } catch (error) {
            res.status(500).send(error)
        }
    },

    /**
     * @api {get} /user/refresh_token Refresh the user token
     * @apiName refreshToken
     * @apiGroup User
     *
     * @apiHeader Authorization Bearer token
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {String} message Response message
     * @apiSuccess (Success 201) {Object} token
     * @apiSuccess (Success 201) {String} token.token the token
     * @apiSuccess (Success 201) {Number} token.expiresIn number of second before expiration
     * @apiSuccess (Success 201) {Date} token.createdAt date of creation of the token
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created.",
     *       "token": {
     *         "token": "xxx",
     *         "expiresIn": 86400,
     *         "createdAt": "2020-04-28T17:57:22.114Z"
     *       }
     *     }
     */
    async refreshToken(req, res) {
        sphone = cryptoUtil.getSID(req.phone, process.env.JWT_SECRET);
        const token = jwt.sign({phone: sphone});
        res.status(201).send({
            success: true,
            message: 'Successfully created.',
            token,
        });
    },

    get(req, res) {
        res.status(200).send({
            message: 'Stop covid19 :( :)',
        });
    },
    /**
     * Renvoie la liste de tous les users qui ont été en contact avec id.
     * Les Contacts se trouvent sur deux listes: Contact1 et Contact2
     * @param  {int} req
     * @param  {} res
     */
    getContact(req, res) {
        const {idUser} = req.params;
        User.findOne({
            where: {
                id: idUser
            }, include: [{
                model: User,
                as: 'Contact1'
            }, {
                model: User,
                as: 'Contact2'
            }]
        }).then((user) => {
            res.status(200).send({
                user,
            });
        });
    },

    /**
     * @api {get} /users get all users
     * @apiName getAllUsers
     * @apiGroup User
     *
     *
     * @apiSuccess (Success 200) {Object} result users list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "id":1,
     *       "message":
     *
     *
     *     }
     */
    getAllUsers(req, res) {
        //res.send({message: 'hi :)'});
        User.findAll({
            include: [{
                model: SelfReporting
            }]
        }).then(data => {
            res.send(data);
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving users."
                });
            });
    },

    /**
     * @api {post} /user/signaler Report a positive case
     * @apiName signaler
     * @apiGroup User
     *
     * @apiHeader Authorization Token <<token>>
     *
     * @apiParam {Date} debutincubation Date début incubation
     * @apiParam {Date} finincubation Date fin incubation
     * @apiParam {UUID} idUser idUser
     * @apiParam {String} sendNotification '1' if you want to send notification to contacts
     *
     * @apiSuccess (Success 201) {Object} result
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": 'Successfully updated.'
     *     }
     */
    async signaler(req, res) {
        let {debutincubation, finincubation, idUser, sendNotification} = req.body;
        debutincubation = new Date(debutincubation).getTime();
        finincubation = new Date(finincubation).getTime();

        sphone = cryptoUtil.getSID(idUser, process.env.JWT_SECRET);
        if (sphone !== "") {
            await User.findAll({
                where: {
                    phone: sphone,
                },
            }).then((users) => {
                if (users && users.length) {
                    idUser = users[0].id;
                }
            });
        }

        await Incubation.create({
            id: 0,
            incubationStartedAt: debutincubation,
            incubationEndedAt: finincubation,
            idUser: idUser
        })
            .then(() => {
                if (sendNotification === '1') {
                    try {
                        elasticClient.getUserContactsNew(idUser, debutincubation, finincubation, 5, 5, function (result, buckets) {
                            const userIds = buckets.users.buckets.map(function (bucket) {
                                return bucket.key
                            })

                            console.log(userIds);

                            User.findAll({
                                where: {
                                    id: userIds
                                },
                                attributes: ['OneSignalPlayerId']
                            })
                                .then((users) => {
                                    const playerIds = users.map(function (playerId) {
                                        return playerId.OneSignalPlayerId
                                    })
                                    console.log(playerIds);

                                    const title = 'Alerte contact';
                                    const content = 'Une personne avec qui vous êtiez en contact récemment a été testé positif ...';
                                    const notification = {
                                        headings: {
                                            'en': title,
                                            'fr': title
                                        },
                                        contents: {
                                            'en': content,
                                            'fr': content
                                        },
                                        include_player_ids: playerIds,
                                        small_icon: 'ic_stat_onesignal_default',
                                        large_icon: 'https://www.zupimages.net/up/20/22/unph.png',
                                        android_accent_color: '04baba'
                                    };

                                    client.createNotification(notification)
                                        .then(response => {
                                            console.log(response)
                                        })
                                        .catch(error => {
                                            console.log(error)
                                        });
                                })
                                .catch((error) => res.status(400).send(error));
                        })
                    } catch (error) {
                        console.log(error);
                        res.status(500).send(error);
                    }
                }

                res.status(201).send({
                    success: true,
                    message: 'Successfully updated.'
                });
            })
            .catch((error) => {
                console.log(error);
                res.status(400).send(error)
            });
    },

    async encryptAllNumber(req, res) {
        const exist = await User.findAll().then((users) => {
            for (var user of users) {
                console.log(user.phone)
                if (user.phone.includes("221")) {

                    User.update(
                        {phone: cryptoUtil.getSID(user.phone, process.env.JWT_SECRET)},
                        {
                            where: {
                                id: user.id,
                            },
                        },
                    );
                }
            }
            res.status(200).send({
                success: true,
                message: 'Successfully updated.'
            });
        })
            .catch((error) => {
                console.log(error);
                res.status(400).send(error)
            });
    },

    decryptAllUsers(req, res) {
        //res.send({message: 'hi :)'});
        User.findAll({
            include: [{
                model: SelfReporting
            }]
        }).then(users => {
            results = [];
            for (var user of users) {
                user.phone = cryptoUtil.getIdFromSID(user.phone, process.env.JWT_SECRET);
                results.push(user);
            }
            res.send(results);
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving users."
                });
            });
    },


    /**
     * @api {get} /user/decrypt/:id Get User Phone
     * @apiName decryptNumber
     * @apiGroup User
     *
     *
     * @apiSuccess (Success 200) {Object} result User
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "success": true,
     *           "code": 99,
     *           "users": {
     *               "phone": "+22177",
     *               "active": "active",
     *               "id": "181fcc26-666e-4775-b9b4-5ac188db9cb9",
     *               "OneSignalPlayerId": null,
     *               "createdAt": "2020-06-02T14:28:23.802Z",
     *               "updatedAt": "2020-06-02T14:28:46.555Z"
     *           }
     *       }
     */
    async decryptNumber(req, res) {
        let id = req.params.id;
        await User.findOne({
            where: {
                id: id,
            },
        }).then((user) => {
            if (user) {
                user.phone = cryptoUtil.getIdFromSID(user.phone, process.env.JWT_SECRET);

            }
            res.status(200).send({
                success: true,
                code: 99,
                user: user
            });

        });
    },
};