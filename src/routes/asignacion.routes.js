const express = require("express");
const cursoController = require("../controller/curso.controller");
const md_autenticacion = require("../middlewares/authentication");
const md_rol = require("../middlewares/roles");

const api = express.Router();

api.post('/asignarCurso', [md_autenticacion, md_rol.verAlumno], cursoController.asignarCurso);

module.exports = api;