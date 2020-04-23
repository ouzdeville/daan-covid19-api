const { GreenNumber } = require('./../models');


module.exports = {

  /**
 * @api {post} /green-number            Add GreenNumber
 * @apiName Create
 * @apiGroup GreenNumber
 * 
 * @apiParam {String} title                 title of GreenNumber.
 * @apiParam {String} number                number of GreenNumber.
 * 
 * @apiSuccess (Success 201) {Object}       greenNumber GreenNumber object
 * @apiSuccess (Success 201) {Boolean}      success If it works ot not
 * @apiSuccess (Success 201) {String}       message Response message
 * 
 *  
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 201 Created
 *      {
 *           "success": true,
 *           "message": "Successfully created.",
 *           "greenNumber": {
 *               "id": 2,
 *               "title": "SAMU",
 *               "number": "1515",
 *               "updatedAt": "2020-04-23T22:54:38.587Z",
 *               "createdAt": "2020-04-23T22:54:38.587Z"
 *            }
 *      }
 * 
 */
    create: function (req, res) {
        var title = req.query.title;
        var number = req.query.number;

        /* if (content == null) {
            return res.status(400).send({ message: 'missing parameters' });
        } */

        var newGreenNumber = GreenNumber.create({
            title: title,
            number: number,
            
        })
        .then(function(newGreenNumber){
            return res.status(200).send({
              success: true,
              message: 'Successfully created.',
              greenNumber: newGreenNumber
            });
        })
        .catch(function(err){
          console.log(err);
          return res.status(400).send({
            error: 'Cannot add green number'
          });
        });
    },

    /**
     * @api {get} /green-number/:id Get a green-number by id
     * @apiName Get
     * @apiGroup GreenNumber
     *
     * @apiParam {Number} id id of greenNumber
     *
     * @apiSuccess (Success 200) {Object}       greenNumber           GreenNumber object
     * @apiSuccess (Success 200) {String}       greenNumber.id        id of GreenNumber
     * @apiSuccess (Success 200) {String}       greenNumber.number    number of GreenNumber
     * @apiSuccess (Success 200) {Date}         greenNumber.createdAt creation's date of GreenNumber
     * @apiSuccess (Success 200) {Date}         greenNumber.updatedAt last update date of GreenNumber
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        "greenNumber": {
     *            "id": 2,
     *            "title": "SAMU",
     *            "number": "1515",
     *            "updatedAt": "2020-04-23T22:54:38.587Z",
     *            "createdAt": "2020-04-23T22:54:38.587Z"
     *         }
     *     }
     */
    get: function (req, res) {
        var greenNumberId = req.body.id;
        GreenNumber.findOne({
          attributes: ['title','number'],
          where: {id:greenNumberId}
        }).then(function(greenNumber){
          if(greenNumber) {
            return res.status(200).send(greenNumber);
          } 
          else {
            res.status(404).send({
              error: 'Cannot add green number'
            });
          }
        }).catch(function(err){
          console.log(err);
          res.status(500).send({
            error: 'Cannot fetch green number'
          });
        });
    },

    /**
     * @api {get} /green-numbers Get all GreenNumber
     * @apiName GetAllGreenNumber
     * @apiGroup GreenNumber
     *
     * @apiSuccess (Success 200) {Object[]}   greenNumbers          List of GreenNumber
     * @apiSuccess (Success 200) {Number}     greenNumber.id        GreenNumber id
     * @apiSuccess (Success 200) {String}     greenNumber.title     GreenNumber title
     * @apiSuccess (Success 200) {String}     greenNumber.number    GreenNumber number
     * @apiSuccess (Success 200) {Date}       greenNumber.createdAt creation's date of GreenNumber
     * @apiSuccess (Success 200) {Date}       greenNumber.updatedAt last update date of GreenNumber
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        'greenNumbers': [
     *            {
     *                 "id": 1,
     *                 "title": "Minestère de la santé",
     *                 "number": "80080077",
     *                 "createdAt": "2020-04-23T22:50:26.960Z",
     *                 "updatedAt": "2020-04-23T22:50:26.960Z"
     *             },
     *             {
     *                 "id": 2,
     *                 "title": "SAMU",
     *                 "number": "1515",
     *                 "createdAt": "2020-04-23T22:54:38.587Z",
     *                 "updatedAt": "2020-04-23T22:54:38.587Z"
     *             }
     *        ]
     *        
     *     }
     */
    getAllGreenNumber: function (req, res) {
        var fields = req.query.fields;
      var limit = parseInt(req.query.limit);
      var offset = parseInt(req.query.offset);
      var order = req.query.order;

      GreenNumber.findAll({
        order: [(order !=null) ? order.split(':') : ['id', 'ASC']],
        attributes: (fields !=='*' && fields != null) ? fields.split(','): null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null
      }).then(function(greenNumbers) {
        if(greenNumbers) {
          return res.status(201).send(greenNumbers);
        }
        else {
          res.status(404).send({
            error: 'no green number found'
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