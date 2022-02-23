const Asignacion = require("../models/asignacion.model");
const bcrypt = require("bcrypt-nodejs");

function asignarCurso(req, res) {
    const parametros = req.bodyM;
    const usuarioLogeado = req.user.sub;
  
    if (parametros.nombreCurso) {
      Asignaciones.find({ idAlumno: usuarioLogeado })
        .populate("idCurso")
        .exec((err, asignacionesEncontradas) => {
          if (asignacionesEncontradas.length >= 3)
            return res
              .status(400)
              .send({ message: "NO SE PUEDE ASIGNAR MAS DE 3 CURSOS" });
  
          for (let i = 0; i < asignacionesEncontradas.length; i++) {
            if (
              asignacionesEncontradas[i].idCurso.nombreCurso ===
              parametros.nombreCurso
            )
              return res
                .status(400)
                .send({ message: "NO SE PUEDE ASIGNAR EL MISMO CURSO 2 VECES" });
          }
  
          Curso.findOne(
            { nombreCurso: parametros.nombreCurso },
            (err, cursoEncontrado) => {
              if (err)
                return res
                  .status(400)
                  .send({ message: "ALGO OCURRIO MAL, INTENTELO DE NUEVO" });
              if (!cursoEncontrado)
                return res.status(400).send({ message: "ESTE CURSO NO EXISTE" });
  
              const modeloAsignacion = new Asignaciones();
              modeloAsignacion.idCurso = cursoEncontrado._id;
              modeloAsignacion.idAlumno = usuarioLogeado;
  
              modeloAsignacion.save((err, asignacionGuardada) => {
                if (err)
                  return res
                    .status(400)
                    .send({ message: "ALGO OCURRIO MAL, INTENTELO DE NUEVO" });
                if (!asignacionGuardada)
                  return res
                    .status(400)
                    .send({ message: "NO SE PUEDE GUARDAR LA ASIGNACION" });
  
                return res.status(200).send({ asignacion: asignacionGuardada });
              });
            }
          );
        });
    } else {
      return res
        .status(500)
        .send({ message: "SE DEBEN ENVIAR LOS PARAMETROS OBLIGATORIOS" });
    }
  }

  module.exports = {
    asignarCurso
  };