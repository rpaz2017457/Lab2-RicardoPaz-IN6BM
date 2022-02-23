exports.verMaestro = function(req, res, next){
    if(req.user.rol !== "ROL_MAESTRO") return res.status(403).send({message: "SOLO PUEDE ACCEDER EL MAESTRO"})
    next();
}

exports.verAlumno = function(req,res, next){
    if(req.user.rol != "ROL_ALUMNO") return res.status(403).send({ message: "SOLO PUEDE ACCEDER EL ALUMNO"})
    next();
}