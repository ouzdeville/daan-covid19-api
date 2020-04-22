'use strict';
//id, title, img, content
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Symptoms', [{
      id:1,
      name: "Mal de tête",
      img: "",
      description: "",
      major:true,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:2,
      name: "Toux",
      img: "",
      description: "",
      major:true,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:3,
      name: "Gorge irritée",
      img: "",
      description: "",
      major:true,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:4,
      name: "Fièvre",
      img: "",
      description: "",
      major:true,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:5,
      name: "Un sentiment général de malaise",
      img: "",
      description: "",
      major:true,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:6,
      name: "Fatigue",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:7,
      name: "Toux sèche",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:8,
      name: "Difficultés à respirer",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:9,
      name: "Douleurs à la respiration",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:10,
      name: "Douleurs aux muscles",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:11,
      name: "Douleurs aux articulations",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:12,
      name: "Mal de gorge",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:13,
      name: "Nez bouché",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:14,
      name: "Nez qui coule",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:15,
      name: "Vertige",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:16,
      name: "Perte d'appétit",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:17,
      name: "Diarrhée",
      img: "",
      description: "",
      major:false,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
