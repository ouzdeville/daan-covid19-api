const {Symptom} = require('../models');

module.exports = {
    /**
     * @api {post} /symptom Add Symptom
     * @apiName Create
     * @apiGroup Symptom
     *
     * @apiParam {String} name name of Symptom
     * @apiParam {Boolean} major is or not a major Symptom
     * @apiParam {Text} description description of Symptom
     * @apiParam {String} img image of Symptom
     *
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *         "success" : true,
     *         "code"    : 1,
     *          "message": "Successfully created.",
     *          "symptom": "newsymptom"
     *     }
     */
    create: function (req, res) {
        let name = req.body.name;
        let major = req.body.major;
        let img = req.body.img;
        let description = req.body.description;

        if (name == null) {
            return res.status(400).send({message: 'missing parameters'});
        }

        let newsymptom = Symptom.create({
            name: name,
            description: description,
            major: major,
            img: img
        })
            .then(function (newsymptom) {
                return res.status(201).send({
                    success: true,
                    code: 1,
                    message: 'Successfully created.',
                    symptom: newsymptom
                });
            })
            .catch(function (err) {
                return res.status(400).send({
                    error: 'Cannot add symptom'
                });
            });
    },

    /**
     * @api {put} /symptom Update Symptom
     * @apiName Update
     * @apiGroup Symptom
     *
     * @apiParam {Number} id    id of Symptom
     * @apiParam {String} name name of Symptom
     * @apiParam {Boolean} major is or not a major Symptom
     * @apiParam {Text} description description of Symptom
     * @apiParam {String} img image of Symptom
     *
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 Updated
     *     {
     *         "success" : true,
     *         "code"    : 1,
     *         "message": 'Symptom successfully updated',
     *         "symptom": "updatesymptom"  
     *     }
     */
    update: function (req, res) {
        let symptomId = req.query.id;
        let name = req.query.name;
        let major = req.query.major;
        let img = req.query.img;
        let description = req.query.description;
        return Symptom.findOne({
            where: {id: symptomId}
        })
            .then(function (symptom) {
                if (!symptom) {
                    return res.status(404).send({
                        success: true,
                        code: 0,
                        message: 'Symptom Not Found',
                    });
                }
                return symptom.update({
                    id: symptomId || symptom.id,
                    name: name || symptom.name,
                    description: description || symptom.description,
                    major: major || symptom.major,
                    img: img || symptom.img
                })
                    .then(() => res.status(200).send({
                        success: true,
                        code: 1,
                        message: 'Symptom successfully updated',
                        symptom: "updatesymptom"
                    }))
                    .catch((error) => res.status(400).send(error));
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {delete} /symptom/:id Update Symptom
     * @apiName Delete
     * @apiGroup Symptom
     *
     * @apiParam {Number} id    id of Symptom
     *
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 204
     */
    delete: function (req, res) {
        return Symptom
            .findOne({
                where: {id: req.params.id}
            })
            .then(function (symptom) {
                if (!symptom) {
                    return res.status(400).send({
                        success: true,
                        code: 0,
                        message: 'Symptom Not Found',
                    });
                }
                return symptom
                    .destroy()
                    .then(() => res.status(204).send())
                    .catch((error) => res.status(400).send({}));
            })
            .catch((error) => res.status(400).send(error));
    },

    /**
     * @api {get} /symptom/:id Get Symptom by symptom id
     * @apiName Get
     * @apiGroup Symptom
     *
     * @apiParam {Number} id id of the Symptom
     *
     *
     * @apiSuccess (Success 200) {Number}  id            id of Symptom
     * @apiSuccess (Success 200) {String}  title         title of Symptom
     * @apiSuccess (Success 200) {Text}    content       content of Symptom
     * @apiSuccess (Success 200) {Boolean} major         is or not major Symptom
     * @apiSuccess (Success 200) {Date}    createdAt     creation's date of Symptom
     * @apiSuccess (Success 200) {DATE}    updatedAt     date of last update of Symptom
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "symptom":
     *              {
     *                 "id": 1,
     *                 "title": "Mal de tête",
     *                 "content": "",
     *                 "major": true,
     *                 "img": "",
     *                 "createdAt": "2020-04-22T21:18:48.066Z",
     *                 "updatedAt": "2020-04-22T21:18:48.066Z"
     *           }
     *     }
     */
    get: function (req, res) {
        let symptomId = req.params.id;
        Symptom.findOne({
            where: {id: symptomId}
        }).then(function (symptom) {
            if (symptom) {
                return res.status(200).send(symptom);
            } else {
                res.status(404).send({
                    error: 'Cannot add symptom'
                });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).send({
                error: 'Cannot fetch symptom'
            });
        });
    },

    /**
     * @api {get} /symptoms get all Symptom
     * @apiName getAllSymptom
     * @apiGroup Symptom
     * @apiSuccess {Object[]} symptoms            List of Symptom.
     * @apiSuccess {Number}   symptom.id          id Symptom.
     * @apiSuccess {String}   symptom.title       title of Symptom.
     * @apiSuccess {Text}   symptom.content     content of Symptom.
     * @apiSuccess {Boolean}   symptom.major       major of Symptom.
     * @apiSuccess {String}   symptom.img         image of Symptom.
     * @apiSuccess {Date}   symptom.createdAt   creation's date of Symptom.
     * @apiSuccess {Date}   symptom.updatedAt   last update's date of Symptom.
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "somptoms": [
     *          {
     *             "id": 1,
     *             "title": "Mal de tête",
     *             "content": "",
     *             "major": true,
     *             "img": "",
     *             "createdAt": "2020-04-22T21:18:48.066Z",
     *             "updatedAt": "2020-04-22T21:18:48.066Z"
     *           },
     *           {
     *               "id": 2,
     *               "title": "Toux",
     *               "content": "",
     *               "major": true,
     *               "img": "",
     *               "createdAt": "2020-04-22T21:18:48.066Z",
     *               "updatedAt": "2020-04-22T21:18:48.066Z"
     *          },
     *        ]
     *     }
     */
    getAllSymptom: function (req, res) {
        let fields = req.body.fields;
        let limit = parseInt(req.body.limit);
        let offset = parseInt(req.body.offset);
        let order = req.body.order;

        Symptom.findAll({
            order: [(order != null) ? order.split(':') : ['id', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null
        }).then(function (symptoms) {
            if (symptoms) {
                return res.status(200).send(symptoms);
            } else {
                res.status(404).send({
                    error: 'no symptoms found'
                });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).send({
                error: 'invalid fields'
            });
        })
    },

    /**
     * @api {get} /symptoms/major get all major Symptom
     * @apiName getAllMajorSymptom
     * @apiGroup Symptom
     * @apiSuccess {Object[]} symptoms            List of Symptom.
     * @apiSuccess {Number}   symptom.id          id Symptom.
     * @apiSuccess {String}   symptom.title       title of Symptom.
     * @apiSuccess {Text}   symptom.content     content of Symptom.
     * @apiSuccess {Boolean}   symptom.major       major of Symptom.
     * @apiSuccess {String}   symptom.img         image of Symptom.
     * @apiSuccess {Date}   symptom.createdAt   creation's date of Symptom.
     * @apiSuccess {Date}   symptom.updatedAt   last update's date of Symptom.
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "somptoms": [
     *          {
     *             "id": 1,
     *             "title": "Mal de tête",
     *             "content": "",
     *             "major": true,
     *             "img": "",
     *             "createdAt": "2020-04-22T21:18:48.066Z",
     *             "updatedAt": "2020-04-22T21:18:48.066Z"
     *           },
     *           {
     *               "id": 2,
     *               "title": "Toux",
     *               "content": "",
     *               "major": true,
     *               "img": "",
     *               "createdAt": "2020-04-22T21:18:48.066Z",
     *               "updatedAt": "2020-04-22T21:18:48.066Z"
     *          },
     *        ]
     *     }
     */
    getAllMajorSymptom: function (req, res) {
        let fields = req.body.fields;
        let limit = parseInt(req.body.limit);
        let offset = parseInt(req.body.offset);
        let order = req.body.order;

        Symptom.findAll({
            where: {major: true},
            order: [(order != null) ? order.split(':') : ['id', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null
        }).then(function (symptoms) {
            if (symptoms) {
                return res.status(200).send(symptoms);
            } else {
                res.status(404).send({
                    error: 'no symptoms found'
                });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).send({
                error: 'invalid fields'
            });
        })
    }
}