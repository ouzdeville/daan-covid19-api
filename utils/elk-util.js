const { Client } = require('@elastic/elasticsearch')
//node: 'https://search-test-r7znlu2wprxosxw75c5veftgki.us-east-1.es.amazonaws.com' bamtu
//my host https://76fd57a0a1dd461ba279ef6aa16662b5.eu-west-2.aws.cloud.es.io:9243
const client = new Client({
    node: 'https://search-test-r7znlu2wprxosxw75c5veftgki.us-east-1.es.amazonaws.com',
    //auth: {
    //    username: 'elastic',
    //    password: 'A6JlhI1Yqt1Y2l0rtFE7ANSZ'
    //}
});
const indexlocation = "dc19_"
const indexzone = "dc19zone"
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
    async getUserContacts(id, begin, end, distance, time, callback) {
        console.log("getUserContacts");
        try {
            const { body } = await client.search({
                index: indexlocation,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "id": {
                                            "value": id,
                                            "boost": 1.0
                                        }
                                    }
                                },
                                {
                                    "range": {
                                        "created_date": {
                                            "gte": begin,
                                            "lte": end,
                                            "format": "epoch_millis"
                                        }
                                    }
                                }
                            ],
                            "adjust_pure_negative": true,
                            "boost": 1.0
                        }
                    },
                    "sort": [
                        {
                            "created_date": {
                                "order": "asc"
                            }
                        }
                    ]
                }
            });


            hits = body.hits.hits;
            var result = [];
            var itemsProcessed = 0;
            deltatime = time * 60000
            for (var hit of hits) {
                //hits.forEach(async (hit) => {
                console.log("My new Position:" + id);
                source = hit._source;
                console.log("Source");
                console.log(source);

                begin1 = hit._source.created_date - deltatime;
                end1 = hit._source.created_date + deltatime;
                console.log("5 min before" + begin1);
                console.log("5 min after" + end1);
                const { body } = await client.search({
                    index: indexlocation,
                    // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                    body: {
                        "size": 10000,
                        "query": {
                            "bool": {

                                "must": [
                                    {
                                        "match_all": {}
                                    }
                                ],

                                "must_not": {

                                    "term": {
                                        "id": {
                                            "value": source.id,
                                            "boost": 1.0
                                        }
                                    }
                                },
                                "filter": [
                                    {
                                        "geo_distance": {
                                            "distance": distance + "m",
                                            "position": {
                                                "lat": source.position.lat,
                                                "lon": source.position.lon
                                            }
                                        }
                                    },
                                    {
                                        "range": {
                                            "created_date": {
                                                "gte": begin1,
                                                "lte": end1,
                                                "format": "epoch_millis"
                                            }
                                        }
                                    }
                                ]

                            }
                        },
                        "aggs": {
                            "contacts": {
                                "terms": { "field": "id" }
                            }
                        },
                        "sort": [
                            {
                                "created_date": {
                                    "order": "asc"
                                }
                            }
                        ]
                    }


                });
                //deuxieme body

                if (body.hits.hits[0] != null)
                    result.push(body.hits.hits[0]);


                itemsProcessed++;
                if (itemsProcessed === hits.length) {
                    //console.log("Results1:");
                    //console.log(result);
                    callback(result, body.aggregations);
                }
            }
            //});


        } catch (error) {
            throw (error);
        }


    },

    /**
     * Get the contacts of all users
     * @param  {uuid} id the user id
     * @param  {integer} begin unix time
     * @param  {integer} end unix time
     * @param  {integer} distance (in meter)
     * @param  {integer} time (in minute)
     * @param  {function} callback
     */
    async getUserContactsNew(id, begin, end, distance, time, callback) {
        try {
            const { body } = await client.search({
                index: indexlocation,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "size": 5000,
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "id": {
                                            "value": id,
                                            "boost": 1.0
                                        }
                                    }
                                },
                                {
                                    "range": {
                                        "created_date": {
                                            "gte": begin,
                                            "lte": end,
                                            "format": "yyyy-MM-dd",
                                            "time_zone": "+00:00"
                                        }
                                    }
                                }
                            ],
                            "adjust_pure_negative": true,
                            "boost": 1.0
                        }
                    },
                    "sort": [
                        {
                            "created_date": {
                                "order": "asc"
                            }
                        }
                    ]
                }
            });

            let hits = body.hits.hits;
            let itemsProcessed = 0;
            let requete = {
                "size": 10000,
                "query": {
                    "bool": {
                        "must_not": {
                            "term": {
                                "id": {
                                    "value": id,
                                    "boost": 1.0
                                }
                            }
                        },
                        "must": {
                            "dis_max": {
                                "queries": [],
                                "tie_breaker": 1.0
                            }
                        }
                    }
                },
                "aggs": {
                    "users": {
                        "terms": {
                            "field": "id"
                        }
                    }
                }
            };

            let deltatime = time * 60000;

            if (hits.length === 0) {
                callback([], []);
            } else {
                for (var hit of hits) {
                    source = hit._source;
                    begin1 = (hit._source.created_date - deltatime) > 0 ? (hit._source.created_date - deltatime) : 0;
                    end1 = (hit._source.created_date + deltatime) > 0 ? (hit._source.created_date + deltatime) : hit._source.created_date;
                    //console.log("hit._source.created_date:"+hit._source.created_date);
                    elem = {
                        "bool": {
                            "filter": [
                                {
                                    "geo_distance": {
                                        "distance": distance + "m",
                                        "position": {
                                            "lat": source.position.lat,
                                            "lon": source.position.lon
                                        }
                                    }
                                },
                                {
                                    "range": {
                                        "created_date": {
                                            "gte": begin1,
                                            "lte": end1,
                                            "format": "epoch_millis",
                                            "time_zone": "+00:00"
                                        }
                                    }
                                }
                            ]
                        }
                    };
                    requete.query.bool.must.dis_max.queries.push(elem);

                    itemsProcessed++;
                    if (itemsProcessed === hits.length) {
                        //console.log("Results1:");
                        //console.log(result);
                        const { body } = await client.search({
                            index: indexlocation,
                            // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                            body: requete
                        });
                        //var myJSON = JSON.stringify(body);
                        hits = body.hits.hits;
                        //console.log("Result of request");
                        //console.log(myJSON);
                        callback(hits, body.aggregations);
                    }
                }
            }
        } catch (error) {
            throw (JSON.stringify(error));
        }
    },
    /**
     * Get All GPS position of a user from begin to end
     * @param  {UUID} id of the user
     * @param  {date} begin the begin date
     * @param  {date} end the end date
     * @param  {function} callback th callback funtion to call on data after
     */
    async getUserTrace(id, begin, end, callback) {
        try {
            // Let's search!
            const { body } = await client.search({
                index: indexlocation,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "size": 10000,
                    "query": {
                        "bool": {
                            "must": [
                                {
                                    "term": {
                                        "id": {
                                            "value": id,
                                            "boost": 1.0
                                        }
                                    }
                                },
                                {
                                    "range": {
                                        "created_date": {
                                            "gte": begin,
                                            "lte": end,
                                            "format": "yyyy-MM-dd"
                                        }
                                    }
                                }
                            ],
                            "adjust_pure_negative": true,
                            "boost": 1.0
                        }
                    },
                    "sort": [
                        {
                            "created_date": {
                                "order": "asc"
                            }
                        }
                    ]
                }
            });
            console.log()
            callback(body.hits.hits);
        } catch (error) {
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
    async getContactsAtPositionAndDate(id, timestamp, latitude, longitude, callback) {
        try {
            const location = {
                "lat": parseFloat(latitude),
                "lon": parseFloat(longitude)
            }
            begin1 = timestamp - 1300;
            end1 = timestamp + 1300;
            const { body } = await client.search({
                index: indexlocation,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "size": 10000,
                    "query": {
                        "bool": {

                            "must": [
                                {
                                    "match_all": {}
                                },
                                {
                                    "range": {
                                        "created_date": {
                                            "gte": begin1,
                                            "lte": end1,
                                            "format": "epoch_millis"
                                        }
                                    }
                                }
                            ],

                            "must_not": {

                                "term": {
                                    "id": {
                                        "value": id,
                                        "boost": 1.0
                                    }
                                }
                            },
                            "filter": {
                                "geo_distance": {
                                    "distance": "2m",
                                    "position": {
                                        "lat": position.lat,
                                        "lon": position.lon
                                    }
                                }
                            }

                        }
                    }
                },

                "sort": [
                    {
                        "created_date": {
                            "order": "asc"
                        }
                    }
                ]


            });
            callback(body.hits.hits);
        } catch (error) {
            throw (error);
        }

    },
    /**
     * @param  {number} latitude
     * @param  {number} longitude
     * @param  {function} callback
     */
    async isInAZoneElastic(latitude, longitude, callback) {
        try {
            var location = [parseFloat(longitude), parseFloat(latitude)];
            location = [location, location];
            //console.log(location);
            const { body } = await client.search({
                index: indexzone,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "size": 1,
                    "query": {
                        "bool": {
                            "must": {
                                "match_all": {}
                            },
                            "filter": {
                                "geo_shape": {
                                    "zone.polygon": {
                                        "shape": {
                                            "type": "envelope",
                                            "coordinates": location
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
        } catch (error) {
            throw (error);
        }


    },
    /**
     * @param  {Zone} zone
     * @param  {function} callback
     */
    async createZone(payload, callback) {
        try {
            client.create({
                id: uuid.v4(),
                index: indexzone,
                type: "_doc",
                refresh: 'true',
                body: payload
            }, function (error, response, status) {
                if (error) {
                    throw (error);
                } else {
                    callback(response.body);
                }
            });

        } catch (error) {
            throw (error);
        }
    },
    /**
     * @param  {function} callback
     */
    async getZones(callback) {
        try {
            const { body } = await client.search({
                index: indexzone,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "query": {
                        "match_all": {}
                    }
                }
            });
            callback(body.hits.hits);
        } catch (error) {
            throw (error);
        }
    },
    /**
     * @param  {function} callback
     */
    async createLocation(payload, callback) {
        try {
            client.create({
                id: uuid.v4(),
                index: indexlocation,
                type: "_doc",
                refresh: 'true',
                body: payload
            }, function (error, response, status) {
                if (error) {
                    throw (error);
                } else {
                    callback(response.body);
                }
            });

        } catch (error) {
            throw (error);
        }
    },

    /**
     * Get All GPS position
     * @param  {function} callback th callback funtion to call on data after
     */
    async getAllTrace(callback) {
        try {
            // Let's search!
            const { body } = await client.search({
                index: indexlocation,
                // type: '_doc', // uncomment this line if you are using {es} ≤ 6
                body: {
                    "size": 10000,
                    "query": {

                        "match_all": {}

                    },
                    "sort": [
                        {
                            "created_date": {
                                "order": "desc"
                            }
                        }
                    ]
                }
            });
            console.log()
            callback(body.hits.hits);
        } catch (error) {
            throw (error);
        }


    },
}