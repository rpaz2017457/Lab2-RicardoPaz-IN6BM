const jwt_simple = require("jwt-simple");

const moment = require("moment");
const secret = "secretcode-IN6BM";

exports.Auth = function (req, res, next) {
  if (!req.headers.authorization) {
    return res
      .status(404)
      .send({ message: "LA SOLICITUD NO TIENE UNA CABECERA DE AUTENTICACION" });
  }
  var token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt_simple.decode(token, secret);
    if (payload.exp <= moment().unix()) {
      return res.status(404).send({ message: "EL TOKEN EXPIRÓ" });
    }
  } catch (error) {
    return res.status(500).send({ message: "EL TOKEN INGRESADO NO ES VÁLIDO" });
  }
  req.user = payload;
  next();
};
