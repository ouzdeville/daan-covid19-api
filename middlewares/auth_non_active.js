const { jwt } = require('./../providers');
const { User } = require('./../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token);
    req.phone = decodedToken.phone;
    const exist = await User.findAll({
      where: {
        phone: decodedToken.phone
      },
    });
    if (!exist || !exist.length) {
      res.status(401).send({error: 'token invalid.'});
      return;
    }
    req.userID = exist[0].id;
    next();
  } catch(error) {
    console.log(error);
    res.status(401).send({error: 'token invalid'});
  }
};
