define({ "api": [
  {
    "type": "post",
    "url": "/user/contact/position",
    "title": "Get contacts at Position",
    "name": "getContactsAtPosition",
    "group": "Contact",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User id</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "created_date",
            "description": "<p>date</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "latitude",
            "description": "<p>GPS latitude</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "longitude",
            "description": "<p>GPS longitude</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>If it works ot not</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "resust",
            "description": "<p>Location objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"resust\":[\n         {\n             \"_index\": \"dc19\",\n             \"_type\": \"_doc\",\n              \"_id\": \"uYT5mXEB0m4T_0Lwe8LZ\",\n              \"_score\": null,\n              \"_source\": {\n                  \"imei\": \"\",\n                  \"position\": {\n                      \"lat\": 14.750403052963359,\n                      \"lon\": -17.37935504970754\n                  },\n                  \"status\": \"unknown\",\n                  \"id\": \"dc0fc6c9-425d-4a23-89e1-ff238542a02e\",\n                  \"created_date\": 1586782662538\n              },\n              \"sort\": [\n                  1586782662538\n              ]\n          }\n      ]\n     \n  \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/elastic-call.js",
    "groupTitle": "Contact"
  },
  {
    "type": "get",
    "url": "/user/contact/:id/:begin/:end",
    "title": "Get all contacts",
    "name": "getUserContacts",
    "group": "Contact",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User id</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "begin",
            "description": "<p>date</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "end",
            "description": "<p>date</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>If it works ot not</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "resust",
            "description": "<p>Location objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"resust\":[\n         {\n             \"_index\": \"dc19\",\n             \"_type\": \"_doc\",\n              \"_id\": \"uYT5mXEB0m4T_0Lwe8LZ\",\n              \"_score\": null,\n              \"_source\": {\n                  \"imei\": \"\",\n                  \"position\": {\n                      \"lat\": 14.750403052963359,\n                      \"lon\": -17.37935504970754\n                  },\n                  \"status\": \"unknown\",\n                  \"id\": \"dc0fc6c9-425d-4a23-89e1-ff238542a02e\",\n                  \"created_date\": 1586782662538\n              },\n              \"sort\": [\n                  1586782662538\n              ]\n          }\n      ]\n     \n  \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/elastic-call.js",
    "groupTitle": "Contact"
  },
  {
    "type": "get",
    "url": "/user/contact/:id/:begin/:end",
    "title": "Get user trace",
    "name": "getUserTrace",
    "group": "Contact",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>User id</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "begin",
            "description": "<p>date</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "end",
            "description": "<p>date</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>If it works ot not</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "resust",
            "description": "<p>Location objects</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"resust\":[\n         {\n             \"_index\": \"dc19\",\n             \"_type\": \"_doc\",\n              \"_id\": \"uYT5mXEB0m4T_0Lwe8LZ\",\n              \"_score\": null,\n              \"_source\": {\n                  \"imei\": \"\",\n                  \"position\": {\n                      \"lat\": 14.750403052963359,\n                      \"lon\": -17.37935504970754\n                  },\n                  \"status\": \"unknown\",\n                  \"id\": \"dc0fc6c9-425d-4a23-89e1-ff238542a02e\",\n                  \"created_date\": 1586782662538\n              },\n              \"sort\": [\n                  1586782662538\n              ]\n          }\n      ]\n     \n  \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/elastic-call.js",
    "groupTitle": "Contact"
  },
  {
    "type": "post",
    "url": "/prevalence",
    "title": "Add Prevalence",
    "name": "CreatePrevalence",
    "group": "Prevalence",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "idZone",
            "description": "<p>Zone id</p>"
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "date",
            "description": "<p>date</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "numberOfConfirmedCases",
            "description": "<p>number of confirmed cases</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "numberOfSupectedCases",
            "description": "<p>number of supected cases</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "numberOfContactsCases",
            "description": "<p>number of contacts cases</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "numberOfRecoveredCases",
            "description": "<p>number of recovered cases</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 201": [
          {
            "group": "Success 201",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>If it works ot not</p>"
          },
          {
            "group": "Success 201",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Response message</p>"
          },
          {
            "group": "Success 201",
            "type": "Object",
            "optional": false,
            "field": "prevalence",
            "description": "<p>Prevalence object</p>"
          },
          {
            "group": "Success 201",
            "type": "Number",
            "optional": false,
            "field": "prevalence.id",
            "description": "<p>Prevalence id</p>"
          },
          {
            "group": "Success 201",
            "type": "Number",
            "optional": false,
            "field": "prevalence.idZone",
            "description": "<p>Zone id</p>"
          },
          {
            "group": "Success 201",
            "type": "Date",
            "optional": false,
            "field": "prevalence.date",
            "description": "<p>date</p>"
          },
          {
            "group": "Success 201",
            "type": "Number",
            "optional": false,
            "field": "prevalence.numberOfConfirmedCases",
            "description": "<p>number of confirmed cases</p>"
          },
          {
            "group": "Success 201",
            "type": "Number",
            "optional": false,
            "field": "prevalence.numberOfSupectedCases",
            "description": "<p>number of supected cases</p>"
          },
          {
            "group": "Success 201",
            "type": "Number",
            "optional": false,
            "field": "prevalence.numberOfContactsCases",
            "description": "<p>number of contacts cases</p>"
          },
          {
            "group": "Success 201",
            "type": "Number",
            "optional": false,
            "field": "prevalence.numberOfRecoveredCases",
            "description": "<p>number of recovered cases</p>"
          },
          {
            "group": "Success 201",
            "type": "Date",
            "optional": false,
            "field": "prevalence.updatedAt",
            "description": "<p>Creation date</p>"
          },
          {
            "group": "Success 201",
            "type": "Date",
            "optional": false,
            "field": "prevalence.createdAt",
            "description": "<p>Modification date</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 201 Created\n{\n  \"success\": true,\n  \"message\": \"Successfully created.\",\n  \"prevalence\": {\n    \"id\": 6,\n    \"idZone\": \"b967a828-7df4-459b-906d-f3ff4f8a05be\",\n    \"date\": \"2020-04-19\",\n    \"numberOfConfirmedCases\": 10,\n    \"numberOfSupectedCases\": 47,\n    \"numberOfContactsCases\": 8,\n    \"numberOfRecoveredCases\": 12,\n    \"updatedAt\": \"2020-04-20T22:55:41.419Z\",\n    \"createdAt\": \"2020-04-20T22:55:41.419Z\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/prevalence.js",
    "groupTitle": "Prevalence"
  },
  {
    "type": "get",
    "url": "/prevalence",
    "title": "Get all prevalence",
    "name": "GetPrevalence",
    "group": "Prevalence",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "prevalences",
            "description": "<p>List of prevalences</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.id",
            "description": "<p>Prevalence id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.idZone",
            "description": "<p>Zone id</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "prevalences.date",
            "description": "<p>date</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.numberOfConfirmedCases",
            "description": "<p>number of confirmed cases</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.numberOfSupectedCases",
            "description": "<p>number of supected cases</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.numberOfContactsCases",
            "description": "<p>number of contacts cases</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.numberOfRecoveredCases",
            "description": "<p>number of recovered cases</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "prevalences.updatedAt",
            "description": "<p>Creation date</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "prevalences.createdAt",
            "description": "<p>Modification date</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"prevalences\": [\n    {\n      \"id\": 5,\n      \"idZone\": \"b967a828-7df4-459b-906d-f3ff4f8a05be\",\n      \"date\": \"2020-04-19\",\n      \"numberOfConfirmedCases\": 10,\n      \"numberOfSupectedCases\": 47,\n      \"numberOfContactsCases\": 8,\n      \"numberOfRecoveredCases\": 12,\n      \"createdAt\": \"2020-04-19T15:54:16.521Z\",\n      \"updatedAt\": \"2020-04-19T15:54:16.521Z\"\n    },\n    {\n      \"id\": 6,\n      \"idZone\": \"b967a828-7dp4-459b-906a-f3ffdf8a05be\",\n      \"date\": \"2020-04-19\",\n      \"numberOfConfirmedCases\": 10,\n      \"numberOfSupectedCases\": 47,\n      \"numberOfContactsCases\": 8,\n      \"numberOfRecoveredCases\": 12,\n      \"createdAt\": \"2020-04-20T22:55:41.419Z\",\n      \"updatedAt\": \"2020-04-20T22:55:41.419Z\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/prevalence.js",
    "groupTitle": "Prevalence"
  },
  {
    "type": "get",
    "url": "/prevalence/:idZone",
    "title": "Get all prevalence by Zone",
    "name": "GetPrevalenceByZone",
    "group": "Prevalence",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "UUID",
            "optional": false,
            "field": "idZone",
            "description": "<p>id of the zone</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "prevalences",
            "description": "<p>List of prevalences</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.id",
            "description": "<p>Prevalence id</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.idZone",
            "description": "<p>Zone id</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "prevalences.date",
            "description": "<p>date</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.numberOfConfirmedCases",
            "description": "<p>number of confirmed cases</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.numberOfSupectedCases",
            "description": "<p>number of supected cases</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.numberOfContactsCases",
            "description": "<p>number of contacts cases</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "prevalences.numberOfRecoveredCases",
            "description": "<p>number of recovered cases</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "prevalences.updatedAt",
            "description": "<p>Creation date</p>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "prevalences.createdAt",
            "description": "<p>Modification date</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"prevalences\": [\n    {\n      \"id\": 5,\n      \"idZone\": \"b967a828-7df4-459b-906d-f3ff4f8a05be\",\n      \"date\": \"2020-04-20\",\n      \"numberOfConfirmedCases\": 10,\n      \"numberOfSupectedCases\": 47,\n      \"numberOfContactsCases\": 8,\n      \"numberOfRecoveredCases\": 12,\n      \"createdAt\": \"2020-04-19T15:54:16.521Z\",\n      \"updatedAt\": \"2020-04-19T15:54:16.521Z\"\n    },\n    {\n      \"id\": 6,\n      \"idZone\": \"b967a828-7df4-459b-906d-f3ff4f8a05be\",\n      \"date\": \"2020-04-19\",\n      \"numberOfConfirmedCases\": 10,\n      \"numberOfSupectedCases\": 47,\n      \"numberOfContactsCases\": 8,\n      \"numberOfRecoveredCases\": 12,\n      \"createdAt\": \"2020-04-20T22:55:41.419Z\",\n      \"updatedAt\": \"2020-04-20T22:55:41.419Z\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/prevalence.js",
    "groupTitle": "Prevalence"
  },
  {
    "type": "post",
    "url": "/sefreport/create",
    "title": "Get contacts at Position",
    "name": "CreateSelfReporting",
    "group": "Reporting",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "firstname",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "lastname",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gender",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Date",
            "optional": false,
            "field": "dateOfBirth",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "age",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "adresse",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "department",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "region",
            "description": ""
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "latitude",
            "description": "<p>GPS latitude</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "longitude",
            "description": "<p>GPS longitude</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>If it works ot not</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "message",
            "description": ""
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>of the created object</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"id\":1\n     \n  \n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "controller/self-reporting.js",
    "groupTitle": "Reporting"
  }
] });
