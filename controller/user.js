const {User,Incubation} = require('./../models');
const {otpProvider, jwt} = require('./../providers');

module.exports = {
    async create(req, res) {
        try {
            if (req.headers.issuer !== process.env.OAUTH_SECRET) {
                res.status(401).send({
                    message: 'invalid issuer.',
                });
                return;
            }
            const otp = await otpProvider.generateOTP(req.body.phone);
            const token = jwt.sign({phone: req.body.phone});
            const exist = await User.findAll({
                where: {
                    phone: req.body.phone,
                },
            });
            if (exist && !exist.length) {
                User.create({
                    active: 'pending',
                    phone: req.body.phone,
                })
                    .then((user) => {
                        res.status(201).send({
                            success: true,
                            message: 'Successfully created.',
                            token,
                        });
                    })
                    .catch((error) => res.status(400).send(error));
                return;
            }
            res.status(201).send({
                success: true,
                message: 'Successfully created.',
                token,
            });
        } catch (error) {
            console.log(error);
            res.status(500).send(error);

        }
    },

    async verifyCode(req, res) {
        try {
            const verification = await otpProvider.verifyOtp({
                code: req.body.code,
                phone: req.phone,
            });
            if (verification) {
                res.send({success: true, message: 'Successfully verified.'});
            }
            res.status(401).send({message: 'verification error'});
        } catch (error) {
            res.status(500).send(error)
        }
    },

    async refreshToken(req, res) {
        const token = jwt.sign({phone: req.phone});
        res.status(201).send({
            success: true,
            message: 'Successfully created.',
            token,
        });
    },

    get(req, res) {
        res.send({message: 'hi :)'});
    },
    /**
     * Renvoie la liste de tous les users qui ont été en contact avec id.
     * Les Contacts se trouvent sur deux listes: Contact1 et Contact2
     * @param  {idUser} req
     * @param  {} res
     */
    getContact(req, res) {
        const {idUser} = req.params;
        User.findOne({
            where: {
                id: idUser
            }, include: [{
                model: User,
                as: 'Contact1'
            }, {
                model: User,
                as: 'Contact2'
            }]
        }).then((user) => {
            res.status(200).send({
                user,
            });

  get(req, res) {
    res.send({ message: 'hi :)' });
  },

  /**
   * Renvoie la liste de tous les users de l'app.
   * @param {*} req 
   * @param {*} res 
   */
  getAllUsers(req, res) {
    //res.send({message: 'hi :)'});
    User.findAll()
    .then(data=>{
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
},

};