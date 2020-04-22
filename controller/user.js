const {User,Incubation, SelfReporting,} = require('./../models');
const {otpProvider, jwt} = require('./../providers');
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'https://search-test-r7znlu2wprxosxw75c5veftgki.us-east-1.es.amazonaws.com' })

/**
 * User.
 * @module User management
 */

module.exports = {
    
    /** Creating user by genrating first an otp and jwt token
     * @param  {} req
     * @param  {} res
     */
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
        lists=["221776359893","221776359894"];
        list=[];
        ite=0;
        lists.forEach( (elem) => {
            //const otp = await otpProvider.generateOTP(elem);
            ite++;
            const token = jwt.sign({elem});
            console.log(token);
            list.push(token);
            if(ite===lists.length)
                res.status(200).send({
                    list,
                });
        });
        

    },
    /**
     * Renvoie la liste de tous les users qui ont été en contact avec id.
     * Les Contacts se trouvent sur deux listes: Contact1 et Contact2
     * @param  {int} req
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
        });

  },

  /** 
     * @api {get} /users get all users
     * @apiName getAllUsers
     * @apiGroup User
     *
     *
     * @apiSuccess (Success 200) {Object} result users list
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": true,
     *       "id":1,
     *       "message":
     *          
     *       
     *     }
     */
  getAllUsers(req, res) {
    //res.send({message: 'hi :)'});
    User.findAll({include: [{
        model: SelfReporting
    }]
    }).then(data=>{
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
},

    /**
     * @param  {} req
     * @param  {} res
     */
    async signaler(req, res) {
        debutincubation = req.body.debutincubation;
        finincubation = req.body.finincubation;
        idUser = req.body.idUser;
        await Incubation.create({
            id:0,
                incubationStartedAt: debutincubation,
                incubationEndedAt: finincubation,
                idUser:idUser}, {})
        .then(() => {
            res.status(201).send({
                success: true,
                message: 'Successfully updated.'
            });
        })
            .catch((error) =>{ 
                console.log(error);
                res.status(400).send(error)});
        return;
    },
};