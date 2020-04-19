'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      id:"dc76809c-23b2-4e0d-91ce-14aa46aeb5b4",
      phone: "+221776359893",
      active: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:"1ca8f3b7-905a-4b60-9a31-eed78142e5e4",
      phone: "+221776359894",
      active: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:"1ca8f3b7-905a-4b60-9a31-eed78142e5e5",
      phone: "+221776359894",
      active: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:"1ca8f3b7-905a-4b60-9a31-eed78142e5e6",
      phone: "+221776359894",
      active: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:"1ca8f3b7-905a-4b60-9a31-eed78142e5e7",
      phone: "+221776359894",
      active: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:"1ca8f3b7-905a-4b60-9a31-eed78142e5e8",
      phone: "+221776359894",
      active: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      id:"1ca8f3b7-905a-4b60-9a31-eed78142e5e9",
      phone: "+221776359894",
      active: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
