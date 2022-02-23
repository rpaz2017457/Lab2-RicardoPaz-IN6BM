const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");

function registrarAlumno(req, res) {
  const parametros = req.body;
  const usuarioModel = new Usuario();

  if (parametros.nombre && parametros.email && parametros.password) {
    usuarioModel.nombre = parametros.nombre;
    usuarioModel.email = parametros.email;
    usuarioModel.rol = "ROL_ALUMNO";

    Usuarios.find({ email: parametros.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(
          parametros.password,
          null,
          null,
          (err, passwordEncriptada) => {
            usuarioModel.password = passwordEncriptada;

            usuarioModel.save((err, usuarioGuardado) => {
              if (err)
                return res
                  .status(500)
                  .send({ message: "ALGO OCURRIO MAL, INTENTALO DE NUEVO" });
              if (!usuarioGuardado)
                return res.status(404).send({
                  message: "ALGO OCURRIO MAL AL INTENTAR AGREGAR UN USUARIO",
                });

              return res.status(200).send({ usuario: usuarioGuardado });
            });
          }
        );
      } else {
        return res
          .status(500)
          .send({ message: "SE ESTA USANDO LA MISMA DIRECCION DE CORREO" });
      }
    });
  }
}

function registrarMaestro(req, res) {
  const parametros = req.body;
  const usuarioModelo = new Usuarios();

  if (parametros.email) {
    usuarioModelo.nombre = "MAESTRO";
    usuarioModelo.email = parametros.email;
    usuarioModelo.rol = "ROL_MAESTRO";
  }

  Usuarios.find({ email: parametros.email }, (err, usuarioGuardado) => {
    if (usuarioGuardado.length == 0) {
      brycpt.hash("123456", null, null, (err, passswordEncriptada) => {
        usuarioModelo.password = passswordEncriptada;

        usuarioModelo.save((err, usuarioGuardado) => {
          if (err)
            return res
              .status(500)
              .send({ message: "ALGO OCURRIO MAL, INTENTALO DE NUEVO" });
          if (!usuarioGuardado)
            return res.status(404).send({
              message: "ALGO OCURRIO MAL AL INTENTAR AGREGAR UN USUARIO",
            });

          return res.status(200).send({ usuario: usuarioGuardado });
        });
      });
    } else {
      return res
        .status(500)
        .send({ message: "SE ESTA USANDO LA MISMA DIRECCION DE CORREO" });
    }
  });
}

function login(req, res) {
  var parametros = req.body;
  Usuarios.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
    if (err)
      return res
        .status(500)
        .send({ message: "ALGO OCURRIO MAL, INTENTALO DE NUEVO" });
    if (usuarioEncontrado) {
      brycpt.compare(
        parametros.password,
        usuarioEncontrado.password,
        (err, verificiacionPassword) => {
          if (verificiacionPassword) {
            if (parametros.obtenerToken === "true") {
              return res
                .status(200)
                .send({ token: jwt.crearToken(usuarioEncontrado) });
            } else {
              usuarioEncontrado.password = undefined;
              return res.status(200).send({ usuario: usuarioEncontrado });
            }
          } else {
            return res
              .status(500)
              .send({ message: "LA CONTRASENA NO COINCIDE" });
          }
        }
      );
    } else {
      return res
        .status(500)
        .send({ message: "EL CORREO NO SE ENCUENTRA REGISTRADO" });
    }
  });
}

function editarUsuario(req, res) {
  var idUser = req.params.idUsuario;
  var parametros = req.body;

  if (idUser !== req.user.sub)
    return res.status(500).send({ message: "NO PUEDE EDITAR OTROS USUARIOS" });

  Usuario.findByIdAndUpdate(
    req.user.sub,
    parametros,
    { new: true },
    (err, usuarioActualizado) => {
      if (err)
        return res
          .status(500)
          .send({ message: "ALGO OCURRIO MAL, INTENTALO DE NUEVO" });
      if (!usuarioActualizado)
        return res
          .status(500)
          .send({ message: "OCURRIO UN ERROR AL EDITAR EL USUARIO" });

      return res.status(200).send({ usuario: usuarioActualizado });
    }
  );
}

function eliminarUsuario(req, res) {
  var idUsuario = req.params.idUser;
  var parameters = req.body;
  if (idUsuario == req.user.sub) {
    Usuarios.findByIdAndDelete(
      req.user.sub,
      parameters,
      (err, usuarioEliminar) => {
        if (err)
          return res
            .status(500)
            .send({ message: "ALGO OCURRIO MAL, INTENTALO DE NUEVO" });
        if (!usuarioEliminar)
          return res
            .status(404)
            .send({ message: "OCURRIO UN ERROR AL ELIMINAR EL USUARIO" });
        return res.status(200).send({ usuario: usuarioEliminar });
      }
    );
  } else {
    return res
      .status(500)
      .send({ message: "NO SE PUEDE ELIMINAR OTROS USUARIOS, ID NO VALIDO" });
  }
}

module.exports = {
  registrarAlumno,
  registrarMaestro,
  editarUsuario,
  eliminarUsuario,
  login,
};
