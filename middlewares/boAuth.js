const { jwt } = require('./../providers');
const { BackOfficeUser } = require('./../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token);
    req.boUserID = decodedToken.boUserID;

    const user = await BackOfficeUser.findOne({
      where: {
        id: decodedToken.boUserID,
        actif: true
      },
    });

    req.userName = user.userName;

    if (!user) {
      res.status(401).send({error: 'utilisateur introuvable.'});
      return;
    }
    next();
  } catch(error) {
    console.log(error);
    res.status(401).send({error: 'invalid token'});
  }
};
