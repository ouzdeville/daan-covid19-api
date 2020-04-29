const { Client } = require('@elastic/elasticsearch')
//node: 'https://search-test-r7znlu2wprxosxw75c5veftgki.us-east-1.es.amazonaws.com' bamtu
//my host https://76fd57a0a1dd461ba279ef6aa16662b5.eu-west-2.aws.cloud.es.io:9243
const client = new Client({ 
    node: 'https://76fd57a0a1dd461ba279ef6aa16662b5.eu-west-2.aws.cloud.es.io:9243' ,
auth: {
    username: 'elastic',
    password: 'A6JlhI1Yqt1Y2l0rtFE7ANSZ'
  }});
const indexlocation="dc19"
const indexzone="dc19zone"
var uuid = require('uuid');
/** 
 * 
 * Daancovid ELK Client
 * 
 */ 
module.exports = {
  
    /**
     * Get the contacts of all users
     * @param  {uuid} id the user id
     * @param  {date} begin in format "yyyy-mm-dd"
     * @param  {date} end   in format "yyyy-mm-dd"
     * @param  {function} callback
     */
    async getUserContacts(id,begin,end,callback){
        try {
            const { body }=await client.search({
                index: indexlocation,
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
            var result=[];
            var itemsProcessed = 0;
            hits.forEach(async (hit) => {
                console.log("My new Position:"+id);
                source=hit._source;
                console.log("Source");
                console.log(source);
                
                begin1=hit._source.created_date-1300;
                end1=hit._source.created_date+1300;
                //console.log("5 min before"+begin1);
                //console.log("5 min after"+end1);
                const { body }=await client.search({
                    index: indexlocation,
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
                        "aggs" : {
                            "contacts" : {
                                "terms" : { "field" : "id" } 
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
                
                if(body.hits.hits[0]!=null)
                    result.push(body.hits.hits[0]);
                
                

                itemsProcessed++;
                if(itemsProcessed === hits.length) {
                    //console.log("Results1:");
                    //console.log(result);
                    callback(result,body.aggregations);
                }
                
            });
            
            
        } catch(error) {
                throw (error);
        }   
        
        
            
    
        

    },
    
    /**
     * Get All GPS position of a user from begin to end
     * @param  {UUID} id of the user
     * @param  {date} begin the begin date
     * @param  {date} end the end date
     * @param  {function} callback th callback funtion to call on data after
     */
    async getUserTrace(id,begin,end,callback){
        try{
            // Let's search!
            const { body } = await client.search({
                index: indexlocation,
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
            console.log()
            callback(body.hits.hits);
        } catch(error) {
            throw (error);
        } 
        

    },

    /**
     * Find the all contacts at a spescific time
     * @param  {} id of the user
     * @param  {} timestamp of the contacts 
     * @param  {} latitude the GPS latitude
     * @param  {} longitude the GPS longitude
     * @param  {function} callback th callback funtion to call on data after
     */
    async getContactsAtPositionAndDate(id,timestamp,latitude, longitude,callback){
        try{
            const location = {
                "lat":parseFloat(latitude), 
                "lon":parseFloat(longitude)
            }
            begin1=timestamp-1300;
            end1=timestamp+1300;
            const { body }=await client.search({
                index: indexlocation,
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
            callback(body.hits.hits);
        } catch(error) {
            throw (error);
        } 

    },
    /**
     * @param  {number} latitude
     * @param  {number} longitude
     * @param  {function} callback
     */
    async isInAZoneElastic(latitude, longitude,callback) {
        try {
        var location = [parseFloat(longitude),parseFloat(latitude)];
        location=[location,location];
        //console.log(location);
            const { body }=await client.search({
                index: indexzone,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "size":1,
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
        callback(body.hits.hits);
        } catch(error) {
            throw (error);
        } 
        
       
    },
    /**
     * @param  {Zone} zone
     * @param  {function} callback
     */
    async createZone(payload,callback) {
        try {
            client.create({
                id: uuid.v4(),
                index: indexzone,
                type: "_doc",
                refresh: 'true',
                body: payload
            }, function(error, response, status) {
                if (error) {
                    throw(error);
                } else {
                    callback(response.body);
                }
            });

        } catch(error) {
            throw (error);
        }
    },
    /**
     * @param  {function} callback
     */
    async getZones(callback) {
        try{
            const { body }=await client.search({
                index: indexzone,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "query": {
                        "match_all" : {}
                    }
                }  
            });
            callback(body.hits.hits);
        } catch(error) {
            throw (error);
        }
    },
    /**
     * @param  {function} callback
     */
    async createLocation(payload,callback) {
        try {
            client.create({
                id: uuid.v4(),
                index: indexlocation,
                type: "_doc",
                refresh: 'true',
                body: payload
            }, function(error, response, status) {
                if (error) {
                    throw(error);
                } else {
                    callback(response.body);
                }
            });

        } catch(error) {
            throw (error);
        }
    },
}