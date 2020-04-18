const { GreenNumber } = require('./../models');

module.exports = {
    create: function (req, res) {
        var title = req.body.title;
        var number = req.body.number;

        if (content == null) {
            return res.status(400).send({ message: 'missing parameters' });
        }

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
    get: function (req, res) {
        var greenNumberId = res.body.id;
        GreenNumber.findOne({
          attributes: ['title','number'],
          where: {id:greenNumberId}
        }).then(function(greenNumber){
          if(greenNumber) {
            return res.status(201).send(greenNumber);
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
      }).then(function(greenNumber) {
        if(greenNumber) {
          return res.status(201).send(greenNumber);
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