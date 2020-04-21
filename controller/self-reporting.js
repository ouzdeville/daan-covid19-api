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
  /** 
     * @api {post} /sefreport/create Get contacts at Position
     * @apiName CreateSelfReporting
     * @apiGroup Reporting
     *
     * @apiParam {String} firstname  
     * @apiParam {String} lastname 
     * @apiParam {String} gender
     * @apiParam {Date} dateOfBirth 
     * @apiParam {Number} age 
     * @apiParam {String} email 
     * @apiParam {String} adresse 
     * @apiParam {String} department 
     * @apiParam {String} region 
     * @apiParam {Number} latitude GPS latitude
     * @apiParam {Number} longitude GPS longitude
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} message 
     * @apiSuccess (Success 200) {Number} id of the created object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "id":1
     *          
     *       
     *     }
     */
create(req, res) {

  const {firstname, lastname, gender, dateOfBirth, age,
     email, adresse, department, region, lat,lon}=req.body;
    try {
      SelfReporting.create({
          firstname,
          lastname,
          gender,
          dateOfBirth,
          age,
          email, 
          adresse, 
          department, 
          region,
          lat,
          lon
      }).then((report) => {
            res.status(201).send({
                success: true,
                message: 'Successfully created.',
                id:report.id,
            });
        })


    } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          code:-1,
      });

    }

}





};