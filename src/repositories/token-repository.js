require('dotenv-safe').config();
const jwt = require('jsonwebtoken');

exports.create = async (id, role) => {
  const token = jwt.sign({ id, role}, process.env.SECRET, {
        expiresIn: 18000
      });
      const res = { auth: true, token: token };
      return res;
};

exports.verify = async (token) => {
    var res;
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if(err) return { auth: false, token: null };
      if(decoded) res = { auth: true, id: decoded.id, role: decoded.role};
    });
    if(!res) return { auth: false, token: null };
    return res;
};
