const Curso = require("../models/curso.model");
const Asignaciones = require("../models/asignacion.model");
const bcrypt = require("bcrypt-nodejs");

function agregarCurso(req, res) {
  const parametros = req.body;
  const modeloCurso = new Curso();

  if (parametros.nombreCurso) {
    modeloCurso.nombreCurso = parametros.nombreCurso;
    modeloCurso.idMaestro = req.user.sub;

    if (req.user.rol == "ROL_MAESTRO") {
      Cursos.find(
        { nombreCurso: parametros.nombreCurso },
        (err, usuarioGuardado) => {
          if (usuarioGuardado.length == 0) {
            modeloCursos.save((err, cursoGuardado) => {
              if (err)
                return res
                  .status(400)
                  .send({ message: "ALGO OCURRIO MAL, INTENTALO DE NUEVO" });
              if (!cursoGuardado)
                return res
                  .status(400)
                  .send({ message: "OCURRIO UN ERROR AL GUARDAR EL CURSO" });

              return res.status(200).send({ curso: cursoGuardado });
            });
          } else {
            return res
              .status(500)
              .send({ message: "SE ESTA CREANDO EL MISMO CURSO" });
          }
        }
      );
    }
  } else {
    return res
      .status(400)
      .send({ message: "SE DEBE DE ENVIAR LOS PARAMETROS OBLIGATORIOS" });
  }
}

function eliminarCursoADefault(req, res) {
  const cursoID = req.params.idCurso;

  Curso.findOne(
    { _id: cursoId, idMaestro: req.user.sub },
    (err, cursoMaestro) => {
      if (err)
        return res
          .status(400)
          .send({ message: "ALGO OCURRIO MAL, INTENTELO DE NUEVO" });
      if (!cursoMaestro)
        return res.status(500).send({
          message: "NO PUEDE EDITAR CURSOS QUE NO FUERON CREADOS POR USTED",
        });

      Curso.find({ nombreCurso: "Por Default" }, (err, cursoEncontrado) => {
        if (err)
          return res.status(400).send({
            message:
              "ALGO OCURRIO MAL CON EL CURSO POR DEFAULT, INTENTELO DE NUEVO",
          });
        if (!cursoEncontrado) {
          const modeloCurso = new Curso();
          modeloCurso.nombreCurso = "Por Default";
          modeloCurso.idMaestro = null;

          modeloCurso.save((err, cursoGuardado) => {
            if (err)
              return res
                .status(400)
                .send({ message: "ALGO OCURRIO MAL, INTENTALO DE NUEVO" });
            if (!cursoGuardado)
              return res
                .status(500)
                .send({ message: "NO SE HA PODIDO AGREGAR EL CURSO" });

            Asignaciones.updateMany(
              { idCurso: cursoId },
              { idCurso: cursoGuardado._id },
              (err, asignacionesActualizadas) => {
                if (err)
                  return res.status(400).send({
                    message:
                      "ALGO OCURRIO MAL AL ACTUALIZAR ASIGNACIONES, INTENTELO DE NUEVO",
                  });

                Curso.findByIdAndDelete(cursoId, (err, cursoEliminado) => {
                  if (err)
                    return res.status(400).send({
                      message:
                        "ALGO OCURRIO MAL AL SOLICITAR ELIMINAR EL CURSO",
                    });
                  if (!cursoEliminado)
                    return res
                      .status(50)
                      .send({ message: "NO SE HA PODIDO ELIMINAR EL CURSO" });

                  return res.status(200).send({
                    editado: asignacionesActualizadas,
                    eliminado: cursoEliminado,
                  });
                });
              }
            );
          });
        } else {
          Asignaciones.updateMany(
            { idCurso: cursoId },
            { idCurso: cursoEncontrado._id },
            (err, asignacionesActualizadas) => {
              if (err)
                return res.status(400).send({
                  message: "ALGO OCURRIO MAL AL ACTUALIZAR LAS ASIGNACIONES",
                });
              Curso.findByIdAndDelete(cursoId, (err, cursoEliminado) => {
                if (err)
                  return res
                    .status(400)
                    .send({ message: "ALGO OCURRIO MAL AL ELIMINAR EL CURSO" });
                return res.status(200).send({
                  editado: asignacionesActualizadas,
                  eliminado: cursoEliminado,
                });
              });
            }
          );
        }
      });
    }
  );
}

function editarCurso(req, res) {
  var idCursos = req.params.idCurso;
  var parameters = req.body;
  if (req.user.rol == "ROL_MAESTRO") {
    Cursos.findOneAndUpdate(
      { _id: idCursos, idMaestro: req.user.sub },
      parameters,
      { new: true },
      (err, cursoEditar) => {
        if (err)
          return res
            .status(500)
            .send({ message: "ALGO OCURRIO MAL AL EDITAR EL CURSO" });
        if (!cursoEditar)
          return res.status(404).send({
            message: "NO TIENE LOS PERMISOS NECESARIOS PARA EDITAR EL CURSO",
          });
        return res.status(200).send({ cursos: cursoEditar });
      }
    );
  } else {
    return res
      .status(500)
      .send({ message: "SU ROL NO LE PERMITE ACCEDER A ESTA FUNCION" });
  }
}

function eliminarCurso(req, res) {
  var idCursos = req.params.idCurso;
  var parameters = req.body;
  if (req.user.rol == "ROL_MAESTRO") {
    Cursos.findOneAndDelete(
      { _id: idCursos, idMaestro: req.user.sub },
      (err, cursoEliminado) => {
        if (err)
          return res
            .status(500)
            .send({
              message: "ALGO OCURRIO MAL AL INTENTAR ELIMINAR EL CURSO",
            });
        if (!cursoEliminado)
          return res
            .status(404)
            .send({
              message: "NO TIENE LOS PERMISOS NECESARIOS PARA EDITAR EL CURSO",
            });
        return res.status(200).send({ cursos: cursoEliminado });
      }
    );
  } else {
    return res
      .status(500)
      .send({ message: "SU ROL NO LE PERMITE ACCEDER A ESTA FUNCION" });
  }
}

module.exports = {
  agregarCurso,
  eliminarCursoADefault,
  editarCurso,
  eliminarCurso,
};
