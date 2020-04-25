const {Incubation} = require('./../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { Client } = require('@elastic/elasticsearch')
const { elasticClient } = require('./../utils');
const {jwt} = require('./../providers');
//node: 'https://search-test-r7znlu2wprxosxw75c5veftgki.us-east-1.es.amazonaws.com' bamtu
//my host https://76fd57a0a1dd461ba279ef6aa16662b5.eu-west-2.aws.cloud.es.io:9243
const client = new Client({ 
    node: 'https://76fd57a0a1dd461ba279ef6aa16662b5.eu-west-2.aws.cloud.es.io:9243' ,
auth: {
    username: 'elastic',
    password: 'A6JlhI1Yqt1Y2l0rtFE7ANSZ'
  }});

/**
 * User.
 * @module Geolocation Endpoints
 */

module.exports = {
     /**
     * @api {get} /user/contact/:id/:begin/:end Get user traces
     * @apiHeader {String} authorization User unique token
     * @apiName getUserTrace
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} begin date
     * @apiParam {Date} end date
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "resust":[
     *              {
     *                  "_index": "dc19",
     *                  "_type": "_doc",
     *                   "_id": "uYT5mXEB0m4T_0Lwe8LZ",
     *                   "_score": null,
     *                   "_source": {
     *                       "imei": "",
     *                       "position": {
     *                           "lat": 14.750403052963359,
     *                           "lon": -17.37935504970754
     *                       },
     *                       "status": "unknown",
     *                       "id": "dc0fc6c9-425d-4a23-89e1-ff238542a02e",
     *                       "created_date": 1586782662538
     *                   },
     *                   "sort": [
     *                       1586782662538
     *                   ]
     *               }
     *           ]
     *          
     *       
     *     }
     */

    async getUserTrace(req, res){
        console.log("getUserTrace");
        id = req.params.id;
        begin = req.params.begin;
        end = req.params.end;
        // Let's search!
        try {
            await elasticClient.getUserTrace(id,begin,end,function(result) {
                console.log(result);
                res.status(200).send({
                    success: true,
                    code:99,
                    resust:result,
                });
            });
        } catch(error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code:-1,
            });

    }  
        
        
    
        

    },



    /** 
     * @api {get} /user/contact/:id/:begin/:end Get all contacts
     * @apiHeader {String} authorization User unique token 
     * @apiName getUserContacts
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} begin date in format "yyyy-mm-dd"
     * @apiParam {Date} end date in format "yyyy-mm-dd"
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "resust":[
     *              {
     *                  "_index": "dc19",
     *                  "_type": "_doc",
     *                   "_id": "uYT5mXEB0m4T_0Lwe8LZ",
     *                   "_score": null,
     *                   "_source": {
     *                       "imei": "",
     *                       "position": {
     *                           "lat": 14.750403052963359,
     *                           "lon": -17.37935504970754
     *                       },
     *                       "status": "unknown",
     *                       "id": "dc0fc6c9-425d-4a23-89e1-ff238542a02e",
     *                       "created_date": 1586782662538
     *                   },
     *                   "sort": [
     *                       1586782662538
     *                   ]
     *               }
     *           ]
     *          
     *       
     *     }
     */
    async getUserContacts(req, res){
        try {
            id = req.params.id;
            begin = req.params.begin;
            end = req.params.end;
            // Let's search!
            //console.log("ok");
            await elasticClient.getUserContacts(id,begin,end,function(result,buckets) {
                console.log(buckets);
                res.status(200).send({
                    success: true,
                    code:99,
                    resust:result,
                    buckets:buckets,
                });
              });
            
            
            
            
        } catch(error) {
                console.log(error);
                res.status(500).send({
                    success: false,
                    code:-1,
                });
    
        }   
    },
    /** 
     * @api {post} /user/contact/position Get contacts at one Position
     * @apiHeader {String} authorization User unique token
     * @apiName getContactsAtPosition
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} created_date date
     * @apiParam {Number} latitude GPS latitude
     * @apiParam {Number} longitude GPS longitude
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} result Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *              {
     *                  "_index": "dc19",
     *                  "_type": "_doc",
     *                   "_id": "uYT5mXEB0m4T_0Lwe8LZ",
     *                   "_score": null,
     *                   "_source": {
     *                       "imei": "",
     *                       "position": {
     *                           "lat": 14.750403052963359,
     *                           "lon": -17.37935504970754
     *                       },
     *                       "status": "unknown",
     *                       "id": "dc0fc6c9-425d-4a23-89e1-ff238542a02e",
     *                       "created_date": 1586782662538
     *                   },
     *                   "sort": [
     *                       1586782662538
     *                   ]
     *               }
     *           ]
     *          
     *       
     *     }
     */
    async getContactsAtPositionAndDate(req, res){
        
        const {latitude, longitude,created_date,id} = req.body;
        try {
            await elasticClient.getContactsAtPositionAndDate(id,created_date,latitude,longitude,function(result) {
                console.log(result);
                res.status(200).send({
                    success: true,
                    code:99,
                    resust:result,
                });
              });
        } catch(error) {
                console.log(error);
                res.status(500).send({
                    success: false,
                    code:-1,
                });
    
        }  
        

    },


    /** 
     * @api {get} /user/zone/inside/:latitude/:longitude Inside zone
     * @apiHeader {String} authorization User unique token
     * @apiName isInAZoneElastic
     * @apiGroup Zone
     *
     * @apiParam {Number} latitude GPS latitude
     * @apiParam {Number} longitude GPS longitude
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} result Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":{
     *          "zone": {
     *               "polygon": {
     *                   "type": "polygon",
     *                   "coordinates": [
     *                       [
     *                           [
     *                               -17.4962,
     *                               14.7007
     *                           ],
     *                           [
     *                               -17.4274,
     *                               14.7007
     *                           ],
     *                           [
     *                               -17.4274,
     *                               14.7535
     *                           ],
     *                           [
     *                               -17.4962,
     *                               14.7535
     *                           ],
     *                           [
     *                               -17.4962,
     *                               14.7007
     *                           ]
     *                       ]
     *                   ]
     *               },
     *               "name": "Dakar",
     *               "observation": "épicentre du pays"
     *           }
     * 
     *       }
     *          
     *       
     *     }
     */
    async isInAZoneElastic(req, res) {
        var area = {};
        const {latitude, longitude} = req.params;
        try {
            await elasticClient.isInAZoneElastic(latitude,longitude,function(result) {
                console.log(result);
                res.status(200).send({
                    success: true,
                    code:99,
                    resust:result,
                });
              });
        } catch(error) {
                console.log(error);
                res.status(500).send({
                    success: false,
                    code:-1,
                });
    
        } 
       
    },

    /** 
     * @api {get} /user/incub/:idUser/:begin/:end Infected Contacts
     * @apiHeader {String} authorization User unique token
     * @apiName getIncubContact
     * @apiGroup Contact
     *
     * @apiParam {Number} latitude GPS latitude
     * @apiParam {Number} longitude GPS longitude
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *              {
     *                  "_index": "dc19",
     *                  "_type": "_doc",
     *                   "_id": "uYT5mXEB0m4T_0Lwe8LZ",
     *                   "_score": null,
     *                   "_source": {
     *                       "imei": "",
     *                       "position": {
     *                           "lat": 14.750403052963359,
     *                           "lon": -17.37935504970754
     *                       },
     *                       "status": "unknown",
     *                       "id": "dc0fc6c9-425d-4a23-89e1-ff238542a02e",
     *                       "created_date": 1586782662538
     *                   },
     *                   "sort": [
     *                       1586782662538
     *                   ]
     *               }
     *           ]
     *          
     *       
     *     }
     */
      async getIncubContact(req, res) {
        const { idUser , begin, end} = req.params;
        try{
            //get all contacts first
            await elasticClient.getUserContacts(idUser,begin,end,async function(result) {
                var resultpositive=[];
                var counter = result.length;
                if(counter){
                    await result.forEach(element => {
                        source=element._source;
                        source.created_date
                        source.id
                        Incubation.findAll({
                            where: {
                                idUser: source.id,
                                incubationStartedAt: {
                                    [Op.lte]: source.created_date
                                },
                                incubationEndedAt: {
                                    [Op.gte]: source.created_date
                                }
                            },
                        }).then((exist) => {
                            if (exist && !exist.length) {
                                resultpositive.push(element);
                            }
                            
                        
                        });
                        counter -= 1;
                        if ( counter === 0){
                            console.log(resultpositive);
                            res.status(200).send({
                                success: true,
                                code:99,
                                resust:resultpositive,
                            });
                            return;
                        }
                        

                    });
                }else {
                    res.status(200).send({
                        success: true,
                        code:99,
                        resust:resultpositive,
                    });
                }
                
                
              });



        } catch(error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code:-1,
            });

        }


      },
    


    /**
     * @api {post} /zone Add Zone
     * @apiHeader {String} authorization User unique token
     * @apiName CreateZone
     * @apiGroup Zone
     * @apiParam {Number} name name of the zone
     * @apiParam {JSON} obersvation static information about this zone
     * @apiParam {String} polygon in the format lat,lon;lat,lon;lat,lon;lat,lon 
     * 
     * 
     * @apiSuccess (Success 201) {Boolean} success If it works ot not
     * @apiSuccess (Success 201) {Object} Zone a Zone object
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 201 Created
     *     {
     *       "success": true,
     *       "message": "Successfully created.",
     *       "zone":{ 
     *              _index: 'dc19zone',
     *              _type: '_doc',
     *               _id: '1',
     *               _version: 1,
     *               created: true 
     *            }
     *     }
     */  
    async createZone(req, res) {
        const zone = req.body;
        //lat,lon;lat,lon;lat,lon;lat,lon
        console.log(zone);
        var polygon = [];
        const spolygone = zone.polygon + '';
        latlons = spolygone.split(";");
        latlons.forEach(latlon => {
            position = latlon.split(",");
            const location = [parseFloat(position[1]), parseFloat(position[0])];
            if (location.length == 2)
                polygon.push(location);
        });
        const payload = {
            "zone": {
                "name":zone.name,
                "observation":zone.observation,
                "polygon": {
                    "type" : "polygon",
                    "coordinates": [polygon]
                }
        
            }
          };
        zone.polygon = polygon;
        console.log(zone);
        try{
            //get all contacts first
            await elasticClient.createZone(payload,async function(resp) {
                res.status(200).send({
                    success: true,
                    code:99,
                    resust:resp,
                });
            });
        } catch(error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code:-1,
            });

        }
        
        
    },


    /** 
     * @api {get} /zones zones list
     * @apiHeader {String} authorization User unique token
     * @apiName getZones
     * @apiGroup Zone
     *
     *
     * @apiSuccess (Success 200) {Boolean} success If it works ot not
     * @apiSuccess (Success 200) {Object} resust Location objects
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "result":[
     *              {
     *                   "_index": "dc19zone",
     *                   "_type": "_doc",
     *                   "_id": "McmhnXEBunV4c_XiukIA",
     *                   "_score": 1,
     *                   "_source": {
     *                       "zone": {
     *                           "polygon": {
     *                               "type": "polygon",
     *                               "coordinates": [
     *                                   [
     *                                       [
     *                                           -17.4962,
     *                                           14.7007
     *                                       ],
     *                                       [
     *                                           -17.4274,
     *                                           14.7007
     *                                       ],
     *                                       [
     *                                           -17.4274,
     *                                           14.7535
     *                                       ],
     *                                       [
     *                                           -17.4962,
     *                                           14.7535
     *                                       ],
     *                                       [
     *                                           -17.4962,
     *                                           14.7007
     *                                       ]
     *                                   ]
     *                               ]
     *                           },
     *                           "name": "Dakar",
     *                           "observation": "épicentre du pays"
     *                       }
     *                   }
     *               }
     *           ]
     *          
     *       
     *     }
     */
    async getZones(req, res) {
       try{

        await elasticClient.getZones(async function(resp) {
            res.status(200).send({
                success: true,
                code:99,
                resust:resp,
            });
        }); 

        } catch(error) {
            console.log(error);
            res.status(500).send({
                success: false,
                code:-1,
            });

        }
    },

    

      gentoken(req, res) {
        lists = ["+221776359893", "+221776359894"];
        list = [];
        ite = 0;
        console.log(req.headers.authorization);
        lists.forEach((elem) => {
            ite++;
            const token = jwt.sign({phone: elem});
            console.log(token);
            list.push(token);
            if (ite === lists.length)
                res.status(200).send({
                    list,
                });
        });


    },


}