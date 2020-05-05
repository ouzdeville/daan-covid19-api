const {RiskFactor} =require('../models');

module.exports = {
    /**
     * @api {post} /risk-factor Add RiskFactor
     * @apiName Create
     * @apiGroup RiskFactor
     *
     * @apiParam {String} name name of RiskFactor
     * @apiParam {Text} description description of RiskFactor
     * @apiParam {String} type type of RiskFactor
     * 
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *         "success" : true,
     *         "code"    : 1,
     *          "message": "Successfully created.",
     *          "RiskFactor": "newriskfactor"
     *     }
     */
    create: function (req, res) {
        var name = req.body.name;
        var type = req.body.type;
        var description = req.body.description;
  
          if (name == null) {
              return res.status(400).send({ message: 'missing parameters' });
          }
  
          var newriskfactor = RiskFactor.create({
            name: name,
            description: description,
            type: type
          })
          .then(function(newriskfactor){
              return res.status(201).send({
                success: true,
                code:1,
                message: 'Successfully created.'
              });
          })
          .catch(function(err){
            return res.status(400).send({
              error: 'Cannot add riskfactor',
              err: err
            });
          });
      },
  
      /**
       * @api {put} /risk-factor Update RiskFactor
       * @apiName Update
       * @apiGroup RiskFactor
       *
       * @apiParam {Number} id    id of RiskFactor
       * @apiParam {String} name name of RiskFactor
       * @apiParam {Text} description description of RiskFactor
       * @apiParam {String} type type of RiskFactor
       * 
       *
       *
       * @apiSuccessExample Success-Response:
       *     HTTP/1.1 200 Updated
       *     {
       *         "success" : true,
       *         "code"    : 1,
       *         "message": 'RiskFactor successfully updated',
       *         "riskfactor": "updaterisk-factor"  
       *     }
       */
  
      update: function(req, res){
        var riskfactorId = req.body.id;
        var name = req.body.name;
        var type = req.body.type;
        var description = req.body.description;
        return RiskFactor.findOne({
          where: {id: riskfactorId}
        })
          .then(function(riskfactor){
            if (!riskfactor) {
              return res.status(404).send({
                success: true,
                code:0,
                message: 'RiskFactor Not Found',
              });
            }
            return riskfactor.update({
              id: riskfactorId || riskfactor.id,
              name: name || riskfactor.name,
              description:description || riskfactor.description,
              type: type || riskfactor.type
            })
            .then(() => res.status(200).send({
              success: true,
              code:1,
              message: 'riskFactor successfully updated',
              riskfactor: "updaterisk-factor"
            }))
            .catch((error) => res.status(400).send(error));
          })
          .catch((error) => res.status(400).send(error));
      },
  
  
      /**
       * @api {delete} /risk-factor/:id Delete RiskFactor
       * @apiName Delete
       * @apiGroup RiskFactor
       *
       * @apiParam {Number} id    id of RiskFactor
       * 
       *
       *
       * @apiSuccessExample Success-Response:
       *     HTTP/1.1 204
       *     {
       *      
       *     }
       */
      delete: function(req, res){
        return RiskFactor
        .findOne({
          where: {id: req.params.id}
        })
        .then(function(riskfactor) {
          if (!riskfactor) {
            return res.status(400).send({
              success: true,
              code:0,
              message: 'riskFactor Not Found',
            });
          }
          return riskfactor
            .destroy()
            .then(() => res.status(204).send())
            .catch((error) => res.status(400).send({
            }));
        })
        .catch((error) => res.status(400).send(error));
      },
  
      /**
       * @api {get} /risk-factor/:id Get RiskFactor by RiskFactor id
       * @apiName Get
       * @apiGroup RiskFactor
       *
       * @apiParam {Number} id id of the RiskFactor
       *
       * 
       * @apiSuccess (Success 200) {Number}  id            id of RiskFactor
       * @apiSuccess (Success 200) {String}  type          type of RiskFactor
       * @apiSuccess (Success 200) {Text}    description   description of RiskFactor
       * @apiSuccess (Success 200) {String}  name          name of RiskFactor
       * 
       *
       * @apiSuccessExample Success-Response:
       *     HTTP/1.1 200 OK
       *     {
       *          "symptom":
       *              {
       *                 {
       *                     "id": 1,
       *                     "name": "Fumeur",
       *                     "description": "",
       *                     "type": "1",
       *                     "createdAt": "2020-04-22T21:18:48.078Z",
       *                     "updatedAt": "2020-04-22T21:18:48.078Z"
       *                 }
       *           }
       *     }
       */
      get: function (req, res) {
          var riskFactorId = req.params.id;
          RiskFactor.findOne({
            where: {id: riskFactorId}
          }).then(function(riskfactor){
            if(riskfactor) {
              return res.status(200).send(riskfactor);
            } 
            else {
              res.status(404).send({
                error: 'riskFactor does not exist'
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
       * @api {get} /risk-factors get all RiskFactor
       * @apiName getAllRiskFactor
       * @apiGroup RiskFactor
       * @apiSuccess {Object[]} riskfactor            List of Symptom.
       * @apiSuccess {Number}   riskfactor.id          id RiskFactor.
       * @apiSuccess {String}   riskfactor.name       name of RiskFactor.
       * @apiSuccess {Text}     riskfactor.description  description of RiskFactor.
       * @apiSuccess {String}   riskfactor.type       type of RiskFactor.
       * 
       * 
       * @apiSuccessExample Success-Response:
       *     HTTP/1.1 200 OK
       *     {
       *        "riskfactors": [
       *          {
       *                 "id": 1,
       *                 "name": "Fumeur",
       *                 "description": "",
       *                 "type": "1",
       *                 "createdAt": "2020-04-22T21:18:48.078Z",
       *                 "updatedAt": "2020-04-22T21:18:48.078Z"
       *             },
       *             {
       *                "id": 2,
       *                 "name": "Consommation d'alcool",
       *                 "description": "",
       *                 "type": "1",
       *                 "createdAt": "2020-04-22T21:18:48.078Z",
       *                 "updatedAt": "2020-04-22T21:18:48.078Z"
       *             },
       *             {
       *                 "id": 3,
       *                 "name": "Diabétique",
       *                 "description": "",
       *                 "type": "2",
       *                 "createdAt": "2020-04-22T21:18:48.078Z",
       *                 "updatedAt": "2020-04-22T21:18:48.078Z"
       *             },
       *             {
       *                "id": 4,
       *                 "name": "Hypertension artérielle",
       *                 "description": "",
       *                 "type": "2",
       *                 "createdAt": "2020-04-22T21:18:48.078Z",
       *                 "updatedAt": "2020-04-22T21:18:48.078Z"
       *             },
       *        ]
       *     }
       */
      getAllRiskFactor: function (req, res) {
        RiskFactor.findAll({
            order: [
                ['id', 'ASC'],
                ['name', 'ASC'],
            ],
        })
            .then((riskfactors) => {
                res.status(200).send({
                    riskfactors,
                });
            })
            .catch((error) => res.status(400).send(error));
      }
}