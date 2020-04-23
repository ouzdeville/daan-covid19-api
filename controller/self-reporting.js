const {SelfReporting, Symptom, RiskFactor, User,
  SelfReporting_Symptom,SelfReporting_RiskFactor}=require('./../models')


module.exports={
/** 
     * @api {get} /reporting/self-reports get all self-reports
     * @apiName getAllSelfReports
     * @apiGroup Reporting
     *
     *
     * @apiSuccess (Success 200) {Object} result self-reports list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "id":1,
     *       "message":
     *          
     *       
     *     }
     */
getAllSelfReports(req, res) {
    //res.send({ message: 'hi :)' });
    SelfReporting.findAll({
      attributes: ['reportingDate','firstname','lastname','email','adresse','department','region'],
      include: [{
        model: User,attributes: ['id','phone','active']
      },{
        model: Symptom, attributes: ['id','name','description','major'],
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
     * @api {post} /user/selfreport Create seflReport
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
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} message 
     * @apiSuccess (Success 201) {Number} id of the created object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 OK
     *     {
     *       "success": true,
     *       "id":1
     *          
     *       
     *     }
     */
createSelfReporting(req, res) {

  const {firstname, lastname, gender, dateOfBirth, age,
     email, adresse, department, region, lat,lng,idUser}=req.body;
    try {
      if(idUser==null){
        res.status(400).send({
          success: false,
          message: 'idUser is wrong',
          idUser:idUser,
      });
      return;
      } 
      SelfReporting.create({
          idUser,  
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
          lng
      }).then((report) => {
            res.status(201).send({
                success: true,
                message: 'Successfully created.',
                id:report.id,
            });
      });
      


    } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          code:-1,
          message:
          err.message || "Some error occurred while creating self-reports."
      });

    }

},
/** 
     * @api {post} /selfreport-symptom/create create self-report-symptom
     * @apiName CreateSelfReportingSymptom
     * @apiGroup Reporting
     *
     * @apiParam {String} idreport 
     * @apiParam {String} idsymptom 
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} message 
     * @apiSuccess (Success 201) {Number} id of the created object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 OK
     *     {
     *       "success": true,
     *       "id":1,
     *       "message":
     *          
     *       
     *     }
     */
    createSelfReportSymptom(req, res) {

      const {idreport, idsymptom}=req.body;
        try {
          SelfReporting_Symptom.create({
            idSelfReporting:idreport,
            idSymptom:idsymptom
          }).then((report) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    id:report.id
                });
            })
    
    
        } catch (error) {
          console.log(error);
          res.status(500).send({
              success: false,
              code:-1,
              message:
              err.message || "Some error occurred while creating self-reports-symptom."
          });
    
        }
    
    },

    /** 
     * @api {post} /selfreport-risk/create create self-report-risk
     * @apiName createSelfReportRisk
     * @apiGroup Reporting
     *
     * @apiParam {String} idreport 
     * @apiParam {String} idrisque 
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} message 
     * @apiSuccess (Success 201) {Number} id of the created object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 OK
     *     {
     *       "success": true,
     *       "id":1,
     *       "message":
     *          
     *       
     *     }
     */
    createSelfReportRisk(req, res) {

      const {idreport, idrisk}=req.body;
        try {
          SelfReporting_RiskFactor.create({
            idSelfReporting:idreport,
            idRiskFactor:idrisk
          }).then((report) => {
                res.status(201).send({
                    success: true,
                    message: 'Successfully created.',
                    id:report.id
                });
            })
    
    
        } catch (error) {
          console.log(error);
          res.status(500).send({
              success: false,
              code:-1,
              message:
              err.message || "Some error occurred while creating self-reports-riskfactor."
          });
    
        }
    
    },

    /** 
     * @api {get} /reporting/riskfactors get all risk-factor
     * @apiName getAllRiskFactor
     * @apiGroup Reporting
     *
     *
     * @apiSuccess (Success 200) {Object} result risk-factors list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *          {
     *             "id": 2,
     *             "reportingDate": ,
     *             "idUser": ,
     *             "lat": "",
     *             "lng": ,
     *             "firstname": "",
     *             "lastname": "",
     *             "gender": "",
     *             "dateOfBirth": "",
     *             "age": ,
     *             "email": "",
     *             "adresse": "Ouakem",
     *             "department": "Dakar",
     *             "region": "Dakar",
     *             "createdAt": "2020-04-21T11:49:21.687Z",
     *             "updatedAt": "2020-04-21T11:49:21.687Z"
     *         }
     *              
     *           ]
     *          
     *       
     *     }
     */
    getAllRiskFactors(req, res) {
      SelfReporting.findAll()
      .then(data=>{
        res.send({
          success: true,
          code:0,
          resust:data,
      });
      })
      .catch(err=>{
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving RiskFactor."
        });
      });
    },
    





};