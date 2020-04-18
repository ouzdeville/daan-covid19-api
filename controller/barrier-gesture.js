const { BarrierGesture } = require('./../models');

module.exports = {
  create: function (req, res) {
    var title = req.body.title;
    var img = req.body.img;
    var content = req.body.content;

    if (content == null) {
        return res.status(400).send({ message: 'missing parameters' });
    }

    var newBarrierGesture = BarrierGesture.create({
        title: title,
        img: img,
        content: content
    })
    .then(function(newBarrierGesture){
        return res.status(200).send({
          success: true,
          message: 'Successfully created.',
          barrierGesture: newBarrierGesture
        });
    })
    .catch(function(err){
      console.log(err);
      return res.status(400).send({
        error: 'Cannot add barrier gesture'
      });
    });
  },
  get: function (req, res) {
    var barrierGestureId = res.body.id;
    BarrierGesture.findOne({
      attributes: ['title','img','content'],
      where: {id:barrierGestureId}
    }).then(function(barrierGesture){
      if(barrierGesture) {
        return res.status(201).send(barrierGesture);
      } 
      else {
        res.status(404).send({
          error: 'Cannot add barrier gesture'
        });
      }
    }).catch(function(err){
      console.log(err);
      res.status(500).send({
        error: 'Cannot fetch barrier gesture'
      });
    });
  },
  getAllBarrierGesture: function (req, res) {
    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;

    BarrierGesture.findAll({
      order: [(order !=null) ? order.split(':') : ['id', 'ASC']],
      attributes: (fields !=='*' && fields != null) ? fields.split(','): null,
      limit: (!isNaN(limit)) ? limit : null,
      offset: (!isNaN(offset)) ? offset : null
    }).then(function(barrierGestures) {
      if(barrierGestures) {
        return res.status(200).send(barrierGestures);
      }
      else {
        res.status(404).send({
          error: 'no barriers gesture found'
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