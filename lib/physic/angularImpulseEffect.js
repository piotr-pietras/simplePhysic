Vector = require("../math/vector")

//Returns angular velocity vector being affected by collision impulse
angularImpulseEffect = function(j, element, normalUnit, collideVector) {
    let normJ = Vector.multiply(normalUnit, j)
    let r = Vector.substract(collideVector, element.getCenterVector())
    let normJ_r = Vector.cross(r, normJ)
    let wJ = Vector.multiply(normJ_r, (1/element.inertia))
    return Vector.sum(element.w, wJ)
}

module.exports = angularImpulseEffect