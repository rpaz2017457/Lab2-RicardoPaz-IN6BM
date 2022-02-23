const express = require("express");
const cursoController = require("../controller/curso.controller");
const md_autenticacion = require("../middlewares/authentication");
const md_rol = require("../middlewares/roles");

const api = express.Router();

api.post('/agregarCurso', [md_autenticacion, md_rol.verMaestro], cursoController.agregarCurso);
api.delete('/eliminarCurso/:idCurso', [md_autenticacion, md_rol.verMaestro], cursoController.eliminarCursoADefault);
api.put('/editarCurso/:idCurso', [md_autenticacion, md_rol.verMaestro], cursoController.editarCurso);
api.delete('/eliminarCurso/:idCurso', [md_autenticacion, md_rol.verMaestro], cursoController.eliminarCurso);

module.exports = api;