const { jwt } = require('./../providers');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token);
    next();
  } catch {
    res.status(401).send({error: 'token invalid'});
  }
};
