const { Symptom } = require('../models');

module.exports = {


  /**
     * @api {post} /symptom Add Symptom
     * @apiName Create
     * @apiGroup SymptomInfo
     *
     * @apiParam {String} name id of Location
     * @apiParam {Boolean} major is or not a major Symptom
     * @apiParam {Text} description description of Symptom
     * @apiParam {String} img image of SymtomInfo
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
      var name = req.body.name;
      var major = req.body.major;
      var img = req.body.img;
      var description = req.body.description;

        if (name == null) {
            return res.status(400).send({ message: 'missing parameters' });
        }

        var newsymptom = Symptom.create({
          name: name,
          description:description,
          major: major,
          img: img
        })
        .then(function(newsymptom){
            return res.status(201).send({
              success: true,
              code:1,
              message: 'Successfully created.',
              symptom: newsymptom
            });
        })
        .catch(function(err){
          return res.status(400).send({
            error: 'Cannot add symptom'
          });
        });
    },

    /**
     * @api {get} /symptom/:id Get SymptomInfo by symptom id
     * @apiName Get
     * @apiGroup SymptomInfo
     *
     * @apiParam {Number} id id of the SymptomInfo
     *
     * 
     * @apiSuccess (Success 200) {Number}  id            id of SymptomInfo
     * @apiSuccess (Success 200) {String}  title         title of SymptomInfo
     * @apiSuccess (Success 200) {Text}    content       content of SymptomInfo
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
        var symptomId = req.params.id;
        Symptom.findOne({
          where: {id:symptomId}
        }).then(function(symptom){
          if(symptom) {
            return res.status(200).send(symptom);
          } 
          else {
            res.status(404).send({
              error: 'Cannot add symptom'
            });
          }
        }).catch(function(err){
          console.log(err);
          res.status(500).send({
            error: 'Cannot fetch symptom'
          });
        });
    },


    /**
     * @api {get} /symptoms get all SymptomInfo
     * @apiSuccess {Object[]} symptoms            List of SymptomInfo.
     * @apiSuccess {Number}   symptom.id          id SymptomInfo.
     * @apiSuccess {String}   symptom.title       title of SymptomInfo.
     * @apiSuccess {Text}   symptom.content     content of SypmtomInfo.
     * @apiSuccess {Boolean}   symptom.major       major of SymptomInfo.
     * @apiSuccess {String}   symptom.img         image of SymptomInfo.
     * @apiSuccess {Date}   symptom.createdAt   creation's date of SymptomInfo.
     * @apiSuccess {Date}   symptom.updatedAt   last update's date of SymptomInfo.
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
      var fields = req.query.fields;
      var limit = parseInt(req.query.limit);
      var offset = parseInt(req.query.offset);
      var order = req.query.order;

      Symptom.findAll({
        order: [(order !=null) ? order.split(':') : ['id', 'ASC']],
        attributes: (fields !=='*' && fields != null) ? fields.split(','): null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null
      }).then(function(symptoms) { 
        if(symptoms) {
          return res.status(200).send(symptoms);
        }
        else {
          res.status(404).send({
            error: 'no symptoms found'
          });
        }
      }).catch(function(err) {
        console.log(err);
        res.status(500).send({
          error: 'invalid fields'
        });
      })
    }
}