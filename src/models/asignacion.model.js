const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var asignacionesSchema = Schema({
  idAlumno: { type: Schema.Types.ObjectId, ref: "usuarios" },
  idCurso: { type: Schema.Types.ObjectId, ref: "cursos" },
});

module.exports = mongoose.model("asignaciones", asignacionesSchema);