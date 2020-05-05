const {Contact, User} = require('./../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  
  /**
     * @api {get} /contacts Get all Contacts
     * @apiName getContacts
     * @apiGroup Contact
     *
     * @apiSuccess (Success 200) {Object[]} contacts List of Contact
     * @apiSuccess (Success 200) {Number} contact.id Contact id
     * @apiSuccess (Success 200) {Date} contact.contactStartingAt date of contact
     * @apiSuccess (Success 200) {Number} contact.contactDuration duration of contact
     * @apiSuccess (Success 200) {Number} contact.contactDistance distance of contact
     * @apiSuccess (Success 200) {String} contact.lat latitude of contact
     * @apiSuccess (Success 200) {Date} contact.lng longitude of contact
     * @apiSuccess (Success 200) {UUID} contact.idUser1 id user 1
     * @apiSuccess (Success 200) {UUID} contact.idUser2 id user 2
     * @apiSuccess (Success 200) {Date} contact.createdAt date of creation of contact
     * @apiSuccess (Success 200) {Date} contact.updateAt date of last update of Barri
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "": [
     *         {
     *            
     *         },
     *         {
     *            
     *         }
     *       ]
     *     }
     */
  getContacts(req, res) {
    Contact.findAll({
      include: [{
        model: User,
        as: 'Contact1'
      }, {
        model: User,
        as: 'Contact2'
      }]
    })
      .then((contacts) => {
        res.status(200).send({
          contacts,
        });
      })
      .catch((error) => res.status(400).send(error));
    ;
    ;
  },

  /**
     * @api {get} /contact Get all Contacts
     * @apiName getContacts
     * @apiGroup Contact
     * 
     * @apiParam {Number} id id of the contact
     *
     * @apiSuccess (Success 200) {Object[]} contacts List of Contact
     * @apiSuccess (Success 200) {Number} contact.id Contact id
     * @apiSuccess (Success 200) {Date} contact.contactStartingAt date of contact
     * @apiSuccess (Success 200) {Number} contact.contactDuration duration of contact
     * @apiSuccess (Success 200) {Number} contact.contactDistance distance of contact
     * @apiSuccess (Success 200) {String} contact.lat latitude of contact
     * @apiSuccess (Success 200) {Date} contact.lng longitude of contact
     * @apiSuccess (Success 200) {UUID} contact.idUser1 id user 1
     * @apiSuccess (Success 200) {UUID} contact.idUser2 id user 2
     * @apiSuccess (Success 200) {Date} contact.createdAt date of creation of contact
     * @apiSuccess (Success 200) {Date} contact.updateAt date of last update of Barri
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         {
     *            
     *         }
     *     }
     */
  getContact(req, res) {
    const {id} = req.params;
    Contact.findOne({
      where: {
        id: id
      }, include: [{
        model: User,
        as: 'Contact1'
      }, {
        model: User,
        as: 'Contact2'
      }]
    })
      .then(async (contact) => {

        res.status(200).send({
          contact,
        });


      })
      .catch((error) => res.status(400).send(error));
    ;
    ;
  },
  
  /**
     * @api {get} /contact/users/:idUser Get all Contacts for a user by UserId
     * @apiName getIncubContact
     * @apiGroup Contact
     *
     * 
     * @apiParam {UUID} idUser id of the user
     * 
     * 
     * @apiSuccess (Success 200) {Object[]} contacts List of Contact
     * @apiSuccess (Success 200) {Number} contact.id Contact id
     * @apiSuccess (Success 200) {Date} contact.contactStartingAt date of contact
     * @apiSuccess (Success 200) {Number} contact.contactDuration duration of contact
     * @apiSuccess (Success 200) {Number} contact.contactDistance distance of contact
     * @apiSuccess (Success 200) {String} contact.lat latitude of contact
     * @apiSuccess (Success 200) {Date} contact.lng longitude of contact
     * @apiSuccess (Success 200) {UUID} contact.idUser1 id user 1
     * @apiSuccess (Success 200) {UUID} contact.idUser2 id user 2
     * @apiSuccess (Success 200) {Date} contact.createdAt date of creation of contact
     * @apiSuccess (Success 200) {Date} contact.updateAt date of last update of Barri
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "": [
     *         {
     *            
     *         },
     *         {
     *            
     *         }
     *       ]
     *     }
     */
  getIncubContact(req, res) {
    const {idUser} = req.params;
    Contact.findAll({
      where: {
        [Op.or]: [
          {
            idUser1: idUser,
            debut: {
              [Op.between]: [
                Sequelize.col('Contact2.debutincubation'),
                Sequelize.col('Contact2.finincubation')
              ]
            }
          },
          {
            idUser2: idUser,
            debut: {
              [Op.between]: [
                Sequelize.col('Contact1.debutincubation'),
                Sequelize.col('Contact1.finincubation')
              ]
            }
          }
        ]
      },
      include: [{
        model: User,
        as: 'Contact1'
      }, {
        model: User,
        as: 'Contact2'
      }]
    })
      .then((contacts) => {
        res.status(200).send({
          contacts,
        });
      })
      .catch((error) => res.status(400).send(error));
    ;
    ;


  },

  get(req, res) {
    res.send({message: 'hi :)'});
  },


}