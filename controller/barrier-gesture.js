const {BarrierGesture} = require('./../models');

module.exports = {
    /**
     * @api {post} /barrier-gesture Add BarrierGesture
     * @apiName CreateBarrierGesture
     * @apiGroup BarrierGesture
     *
     * @apiParam {String} title title of barrier gesture
     * @apiParam {Date} img image
     * @apiParam {String} content content of barrier gesture
     *
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {String} message Response message
     * @apiSuccess (Success 201) {Object} barrierGesture BarrierGesture object
     * @apiSuccess (Success 201) {Number} barrierGesture.id BarrierGesture id of barrier-gesture
     * @apiSuccess (Success 201) {String} barrierGesture.title BarrierGesture title of barrier-gesture
     * @apiSuccess (Success 201) {Text} barrierGesture.content content of barrier-gesture
     * @apiSuccess (Success 201) {String} barrierGesture.img image of barrier-gesture
     * @apiSuccess (Success 201) {Date} barrierGesture.updatedAt date of last update of barrier-gesture
     * @apiSuccess (Success 201) {Date} barrierGesture.createdAt date of creation of of barrier-gesture
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *         "success": true,
     *          "message": "Successfully created.",
     *          "barrierGesture": {
     *             "id": 2,
     *             "title": "lavage des mains",
     *             "img": "C:\\Users\\PC\\Pictures\\error.png",
     *             "content": "barriere numero 3",
     *             "updatedAt": "2020-04-22T14:12:03.631Z",
     *             "createdAt": "2020-04-22T14:12:03.631Z"
     *         }
     *     }
     */
    create: function (req, res) {
        let title = req.query.title;
        let img = req.query.img;
        let content = req.query.content;

        if (content == null) {
            return res.status(400).send({message: 'missing parameters'});
        }

        let newBarrierGesture = BarrierGesture.create({
            title: title,
            img: img,
            content: content
        })
            .then(function (newBarrierGesture) {
                return res.status(200).send({
                    success: true,
                    message: 'Successfully created.',
                    barrierGesture: newBarrierGesture
                });
            })
            .catch(function (err) {
                console.log(err);
                return res.status(400).send({
                    error: 'Cannot add barrier gesture'
                });
            });
    },

    /**
     * @api {get} /barrier-gesture/:id Get a barrierGesture by id
     * @apiName GetBarrierGestureById
     * @apiGroup BarrierGesture
     *
     * @apiParam {Number} id id of the barrierGesture
     *
     * @apiSuccess (Success 200) {Number} id BarrierGesture id
     * @apiSuccess (Success 200) {String} title BarrierGesture id
     * @apiSuccess (Success 200) {Date} img image of BarrierGesture
     * @apiSuccess (Success 200) {text} content content of BarrierGesture
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": 2,
     *       "title": "lavage des mains",
     *       "img": "C:\\Users\\PC\\Pictures\\error.png",
     *       "content": "barriere numero 3"
     *     }
     */

    get: function (req, res) {
        let barrierGestureId = req.params.id;
        BarrierGesture.findOne({
            attributes: ['id', 'title', 'img', 'content'],
            where: {id: barrierGestureId}
        }).then(function (barrierGesture) {
            if (barrierGesture) {
                return res.status(200).send(barrierGesture);
            } else {
                res.status(404).send({
                    error: 'Cannot add barrier gesture'
                });
            }
        }).catch(function (err) {
            console.log(err);
            res.status(500).send({
                error: 'Cannot fetch barrier gesture'
            });
        });
    },

    /**
     * @api {get} /barrier-gestures Get all BarrierGesture
     * @apiName getAllBarrierGesture
     * @apiGroup BarrierGesture
     *
     * @apiSuccess (Success 200) {Object[]} barrierGesture List of barrier-gesture
     * @apiSuccess (Success 200) {Number} barrierGesture.id Prevalence id
     * @apiSuccess (Success 200) {String} barrierGesture.title title of BarrierGesture
     * @apiSuccess (Success 200) {String} barrierGesture.img image of BarrierGesture
     * @apiSuccess (Success 200) {Text} barrierGesture.content of BarrierGesture
     * @apiSuccess (Success 200) {Date} barrierGesture.createdAt date of creation of BarrierGesture
     * @apiSuccess (Success 200) {Date} barrierGesture.updateAt date of last update of BarrierGesture
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "barrierGestures": [
     *         {
     *            "id": 1,
     *            "title": null,
     *            "img": "C:\\Users\\PC\\Pictures\\error.png",
     *            "content": "barriere numero 2",
     *            "createdAt": "2020-04-22T13:39:40.467Z",
     *            "updatedAt": "2020-04-22T13:39:40.467Z"
     *         },
     *         {
     *            "id": 2,
     *            "title": "lavage des mains",
     *            "img": "C:\\Users\\PC\\Pictures\\error.png",
     *            "content": "barriere numero 3",
     *            "createdAt": "2020-04-22T14:12:03.631Z",
     *            "updatedAt": "2020-04-22T14:12:03.631Z"
     *         }
     *       ]
     *     }
     */

    getAllBarrierGesture: function (req, res) {
        let fields = req.query.fields;
        let limit = parseInt(req.query.limit);
        let offset = parseInt(req.query.offset);
        let order = req.query.order;

        BarrierGesture.findAll({
            order: [(order != null) ? order.split(':') : ['id', 'ASC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null
        }).then(function (barrierGestures) {
            if (barrierGestures) {
                return res.status(200).send({barrierGestures});
            } else {
                res.status(404).send({
                    error: 'no barriers gesture found'
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