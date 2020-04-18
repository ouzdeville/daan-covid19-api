# Daan-Covid19-API
Pour tracer ....


## Express Router and Routes

| Route           | HTTP Verb                |Auth| Description                                                        |
| --------------- | ---------                |--- | -----------------------------------------------------------------  |
| /user/contacts/:idUser  | GET              |yes | Pour recuperer tous les contacts d'un user                         |
| /zone      | POST                          |yes | Ajouter une zone à signaler                                        |
| /zone      | GET                           |yes | Recupérer toutes les zones                                         |
| /zone/:id      | GET                       |yes | Recupérer une zone à partir de l'id                                |
| /zone/inside/:latitude/:longitude  | GET   |yes | Verifier si le device est rentré dans une zone dangereuse          |
| /contact  | GET                            |yes | Recupérer tous les contacts entre devices                          |
| /contact/:id | GET                         |yes | Recupérer un contact entre deux device à partir de l'id du contact |
| /contact/users/:idUser | GET               |yes | Recupérer tous les users qui ont été en contact avec idUser        |
| /prevalence_zone | POST                    |yes | Ajouter les statistiques sur une zone                              |
| /prevalence_zone | GET                     |yes | Récupérer la prévalence                                            |
| /prevalence_zone/:idZone | GET             |yes | Récupérer la prévalence d'une zone                                 |




## Usage

### Example **Ajouter une nouvelle zone** `/zone`:

Request Body:
```
id:0
name:Thies
obersvation:{}
polygon:lat,lon;lat,lon;lat,lon;lat,lon
```

Response:
```json
{
    "success": true,
    "message": "Successfully created.",
    "zone": {
        "name": "Thies",
        "obersvation": "",
        "polygon": "[[50, 10], [40, 40], [30, 20]]",
        "id": "0",
        "updatedAt": "2020-04-12T23:04:06.942Z",
        "createdAt": "2020-04-12T23:04:06.942Z"
    }
}
```


## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x

### Developing

1. Run `npm install` to install server dependencies.
2. Run `npm run start:dev` to start the development server. It should automatically open the client in your browser when ready.

3. Open browser `https://`.




