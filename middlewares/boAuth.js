const { jwt } = require('./../providers');
const { BackOfficeUser } = require('./../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token);
    req.userName = decodedToken.userName;

    const exist = await BackOfficeUser.findAll({
      where: {
        userName: decodedToken.userName,
      },
    });

    if (!exist || !exist.length) {
      res.status(401).send({error: 'invalid token.'});
      return;
    }
    req.boUserID = exist[0].id;
    next();
  } catch(error) {
    console.log(error);
    res.status(401).send({error: 'invalid token'});
  }
};
