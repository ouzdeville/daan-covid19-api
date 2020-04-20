# Daan-Covid19-API
Pour tracer ....


## Express Router and Routes

| Route           | HTTP Verb   | Description                          |
| --------------- | ---------  | ------------------------------------ |
| /user/contacts/:idUser  | GET  | Pour recuperer tous les contacts d'un user |
| /user/signaler  | POST  | Pour signaler positif un user  |
| /zone      | POST                    | Ajouter une zone à signaler         |
| /zone      | GET                    | Recupérer toutes les zones         |
| /zone/:id      | GET                   | Recupérer une zone à partir de l'id                  |
| /zone/inside/:latitude/:longitude  | GET   | Verifier si le device est rentré dans une zone dangereuse                |
| /contact  | GET  | Recupérer tous les contacts entre devices |
| /contact/:id | GET  | Recupérer un contact entre deux device à partir de l'id du contact |
| /contact/users/:idUser | GET  | Recupérer tous les users qui ont été en contact avec idUser |
| /prevalence | POST                    | Ajouter les statistiques sur une zone                              |
| /prevalence | GET                     | Récupérer la prévalence                                            |
| /prevalence/:idZone | GET             | Récupérer la prévalence d'une zone                                 |
| /daily-report | POST                    | Ajouter les statistiques d'un jour                              |
| /daily-report | GET                     | Récupérer les statistiques                                            |
| /daily-report/last | GET             | Récupérer les derniers chiffres                                |
| /user/trace/:id/:begin/:end | GET             | Get all GPS coordinates of :id from :begin to :end                                 |



| /users| GET | Récuperer tous les users|


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

### Example **Signaler un utilisateur** `/user/signaler`:

Request Body:
```
phone:776359893
debutincubation:2020-04-01
finincubation:2020-04-15
``` 

Response:
```json
{
    "success": true,
    "message": "Successfully updated."
}
```

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x

### Developing

1. Run `npm install` to install server dependencies.
2. If You use local database:
    2.0 create new file `/config/config.json` from `config/config.sample.json` (for dev instance ask credential to the team)
    2.1 Run `sequelize db:migrate` 
3. Run `npm run start:dev` to start the development server. It should automatically open the client in your browser when ready.

3. Open browser `https://localhost:8000`.




