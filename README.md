# Daan-Covid19-API
Pour tracer ....


## Express Router and Routes

| Route           | HTTP Verb   | Description                          |
| --------------- | ---------  | ------------------------------------ |
| /user/contacts/:idUser  | GET  | Pour recuperer tous les contacts d'un user |
| /zone      | POST                    | Ajouter une zone à signaler         |
| /zone      | GET                    | Recupérer toutes les zones         |
| /zone/:id      | GET                   | Recupérer une zone à partir de l'id                  |
| /zone/inside/:latitude/:longitude  | GET   | Verifier si le device est rentré dans une zone dangereuse                |
| /contact  | GET  | Recupérer tous les contacts entre devices |
| /contact/:id | GET  | Recupérer un contact entre deux device à partir de l'id du contact |
| /contact/users/:idUser | GET  | Recupérer tous les users qui ont été en contact avec idUser |
| /prevalence_zone | POST | Ajouter les statistiques sur une zone (zoneId, date, numberOfConfirmedCases, numberOfSuspectedCases, numberOfContactsCases, numberOfImportedCases, numberOfCommunityCases, numberOfRecoveredCases, numberOfDeathsCases, numberOfEvacueesCases) |
| /prevalence_zone | GET | Récupérer la prévalence |
| /prevalence_zone/:idZone | GET | Récupérer la prévalence d'une zone |




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




