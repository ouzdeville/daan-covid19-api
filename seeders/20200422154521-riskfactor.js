'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('RiskFactors', [{
      id:1,
      name: "Fumeur",
      description: "",
      type:"1",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:2,
      name: "Consommation d'alcool",
      description: "",
      type:"1",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:3,
      name: "Diabétique",
      description: "",
      type:"2",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:4,
      name: "Hypertension artérielle",
      description: "",
      type:"2",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:5,
      name: "Asthmatique",
      description: "",
      type:"2",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:6,
      name: "",
      description: "Maladie Cardiaque",
      type:"2",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:7,
      name: "Obésité",
      description: "",
      type:"2",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:8,
      name: "Contact avec un malade",
      description: "",
      type:"3",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:9,
      name: "Retour de voyage",
      description: "",
      type:"3",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('RiskFactors', null, {});
  }
};
