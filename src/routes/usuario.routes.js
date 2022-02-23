const express = require("express");
const usuarioController = require("../controller/usuario.controller");
const md_autenticacion = require("../middlewares/authentication");

const api = express.Router();

api.post('/registrarMaestro', md_autenticacion, usuarioController.registrarMaestro);
api.post('/registrarAlumno', md_autenticacion, usuarioController.registrarAlumno);
api.put(
  '/editarUsuario/:idUser',
  md_autenticacion.Auth,
  usuarioController.editarUsuario
);
api.delete(
  '/eliminarUsuario/:idUser',
  md_autenticacion.Auth,
  usuarioController.eliminarUsuario
);
api.post('/login', md_autenticacion.Auth, usuarioController.login);

module.exports = api;
