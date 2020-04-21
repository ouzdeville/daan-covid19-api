const { Client } = require('@elastic/elasticsearch')
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
     * @api {get} /user/contact/:id/:begin/:end Get user trace
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
        id = req.params.id;
        begin = req.params.begin;
        end = req.params.end;
        // Let's search!
        const { body } = await client.search({
            index: 'dc19',
            // type: '_doc', // uncomment this line if you are using {es} ≤ 6
            body: {
                "query" : {
                  "bool" : {
                    "must" : [
                      {
                        "term" : {
                          "id" : {
                            "value" :id,
                            "boost" : 1.0
                          }
                        }
                      },
                      {
                        "range" : {
                          "created_date":{  
                                  "gte":begin,
                                  "lte":end,
                                  "format":"yyyy-mm-dd"
                               }
                        }
                      }
                    ],
                    "adjust_pure_negative" : true,
                    "boost" : 1.0
                  }
                },
                "sort" : [
                  {
                    "created_date" : {
                      "order" : "asc"
                    }
                  }
                ]
              }
        });
        
        console.log(body.hits.hits)
            res.status(200).send({
                success: true,
                resust:body.hits.hits,
            });
    
        

    },



    /** 
     * @api {get} /user/contact/:id/:begin/:end Get all contacts
     * @apiName getUserContacts
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
    async getUserContacts(req, res){
        try {
            id = req.params.id;
            begin = req.params.begin;
            end = req.params.end;
            // Let's search!
            const { body }=await client.search({
                index: 'dc19',
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "query" : {
                    "bool" : {
                        "must" : [
                        {
                            "term" : {
                            "id" : {
                                "value" :id,
                                "boost" : 1.0
                            }
                            }
                        },
                        {
                            "range" : {
                            "created_date":{  
                                    "gte":begin,
                                    "lte":end,
                                    "format":"yyyy-mm-dd"
                                }
                            }
                        }
                        ],
                        "adjust_pure_negative" : true,
                        "boost" : 1.0
                    }
                    },
                    "sort" : [
                    {
                        "created_date" : {
                        "order" : "asc"
                        }
                    }
                    ]
                }
            });


            hits=body.hits.hits;
            var resust=[];
            var itemsProcessed = 0;
            await hits.forEach(async (hit) => {
                console.log("My new Position:"+id);
                source=hit._source;
                console.log("Source");
                //console.log(source);
                
                begin1=hit._source.created_date-1300;
                end1=hit._source.created_date+1300;
                console.log("5 min before"+begin1);
                console.log("5 min after"+end1);
                const { body }=await client.search({
                    index: 'dc19',
                    // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                    body: {
                        "query": {
                            "bool" : {
                            
                                "must" : [
                                    {
                                    "match_all" : {}
                                    },
                                    {
                                    "range" : {
                                        "created_date":{  
                                                "gte":begin1,
                                                "lte":end1,
                                                "format":"epoch_millis"
                                            }
                                    }
                                    }
                                ],

                                "must_not": {
                                        
                                        "term" : {
                                            "id":{
                                                "value" : source.id,
                                                "boost" : 1.0
                                            }
                                        }
                                },
                                "filter" : {
                                    "geo_distance" : {
                                        "distance" : "2m",
                                        "position" : {
                                                "lat" : source.position.lat,
                                                "lon" : source.position.lon
                                            }
                                    }
                                }
                                
                            }
                        },
                        "sort" : [
                        {
                            "created_date" : {
                            "order" : "asc"
                            }
                        }
                        ]
                    }

                    
                });
                //deuxieme body
                console.log("Results:");
                if(body.hits.hits[0]!=null)
                    resust.push(body.hits.hits[0]);
                console.log(resust);
                

                itemsProcessed++;
                if(itemsProcessed === hits.length) {
                    res.status(200).send({
                        success: true,
                        resust:resust,
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
     * @api {post} /user/contact/position Get contacts at Position
     * @apiName getContactsAtPosition
     * @apiGroup Contact
     *
     * @apiParam {Number} id User id
     * @apiParam {Date} created_date date
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
    async getContactsAtPositionAndDate(req, res){
        
        const {latitude, longitude,created_date,id} = req.body;
        const location = {
            "lat":parseFloat(latitude), 
            "lon":parseFloat(longitude)
        }
        begin1=created_date-1300;
        end1=created_date+1300;
        const { body }=await client.search({
            index: 'dc19',
            // type: '_doc', // uncomment this line if you are using {es} ≤ 6
            body: {
                "query": {
                    "bool" : {
                    
                        "must" : [
                            {
                            "match_all" : {}
                            },
                            {
                            "range" : {
                                "created_date":{  
                                        "gte":begin1,
                                        "lte":end1,
                                        "format":"epoch_millis"
                                    }
                            }
                            }
                        ],

                        "must_not": {
                                
                                "term" : {
                                    "id":{
                                        "value" : id,
                                        "boost" : 1.0
                                    }
                                }
                        },
                        "filter" : {
                            "geo_distance" : {
                                "distance" : "2m",
                                "position" : {
                                        "lat" : position.lat,
                                        "lon" : position.lon
                                    }
                            }
                        }
                        
                    }
                }
            },
            "sort" : [
            {
                "created_date" : {
                "order" : "asc"
                }
            }
            ]

            
        });
        res.status(200).send({
            success: true,
            resust:body.hits.hits,
        });

    },


    /** 
     * @api {get} /user/zone/inside/:latitude/:longitude Inside zone
     * @apiName isInAZoneElastic
     * @apiGroup Zone
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
    async isInAZoneElastic(req, res) {
        var area = {};
        const {latitude, longitude} = req.params;
        var location = [parseFloat(longitude),parseFloat(latitude)];
        //location=[[-17.468653,14.711750],[-17.468653,14.711750]];
        //console.log(location);
        const { body }=await client.search({
            index: 'dc19zone',
            // type: '_doc', // uncomment this line if you are using {es} ≤ 6
            body: {
                "query":{
                    "bool": {
                        "must": {
                            "match_all": {}
                        },
                        "filter": {
                            "geo_shape": {
                                "zone.polygon": {
                                    "shape": {
                                        "type": "envelope",
                                        "coordinates" : location
                                    },
                                    "relation": "CONTAINS"
                                }
                            }
                        }
                    }
                }
            }
        });
        res.status(200).send({
            success: true,
            resust:body.hits.hits,
        });
       
    }




}