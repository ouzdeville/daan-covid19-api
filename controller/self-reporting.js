const {SelfReporting, Symptom, RiskFactor, User}=require('./../models')


module.exports={
    /**
 * Renvoie la liste de tous les autosignalements
 * @param {*} req 
 * @param {*} res 
 */
getAllSelfReports(req, res) {
    //res.send({ message: 'hi :)' });
    SelfReporting.findAll({
      attributes: ['reportingDate','firstname','lastname','email','adresse','department','region'],
      include: [{
        model: User,attributes: ['id','phone','active']
      },{
        model: Symptom, attributes: ['id','title','content','major'],
        as: 'Symptom'
    },{
        model: RiskFactor, attributes: ['id','name','description','type'],
        as: 'RiskFactor'
    }],
    })
    .then(data=>{
      res.send(data);
    })
    .catch(err=>{
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving self-reports."
      });
    });
  },






};