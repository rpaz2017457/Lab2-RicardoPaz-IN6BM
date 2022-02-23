//IMPORTACIONES
const express = require("express");
const cors = require("cors");
var app = express();

//IMPORTACIONES RUTAS
const UsuarioRutas = require("./src/routes/usuario.routes");

//MIDDLEWARES - INTERMEDARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//CABECERAS
app.use(cors());

//CARGA DE RUTAS
app.use("/api", UsuarioRutas);

module.exports = app;
