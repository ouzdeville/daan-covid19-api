const jwt = require('jsonwebtoken');

module.exports = {
  sign(payload) {
    const createdAt = new Date();
    const token = jwt.sign(
      { ...payload, expiresIn: 86400, createdAt },
      process.env.JWT_SECRET,
      // {
      //   expiresIn: 86400, // expires in 24 hours
      // },
    );
    return {
      token,
      expiresIn: 86400,
      createdAt,
    };
  },

  verify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
};