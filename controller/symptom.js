const { Symptom } = require('./../models');

module.exports = {
    create: function (req, res) {
        var title = req.body.title;
        var img = req.body.img;
        var content = req.body.content;

        if (content == null) {
            return res.status(400).send({ message: 'missing parameters' });
        }

        var newSymtom = Symptom.create({
            title: title,
            img: img,
            content: content
        })
        .then(function(newSymtom){
            return res.status(200).send({
              success: true,
              message: 'Successfully created.',
              symtom: newSymtom
            });
        })
        .catch(function(err){
          return res.status(400).send({
            error: 'Cannot add symtom'
          });
        });
    },
    get: function (req, res) {
        var symptomId = res.body.id;
        Symptom.findOne({
          attributes: ['title','img','content'],
          where: {id:symptomId}
        }).then(function(symtom){
          if(symtom) {
            return res.status(201).send(symtom);
          } 
          else {
            res.status(404).send({
              error: 'Cannot add symtom'
            });
          }
        }).catch(function(err){
          console.log(err);
          res.status(500).send({
            error: 'Cannot fetch symptom'
          });
        });
    },
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
          return res.status(200).send(symtoms);
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