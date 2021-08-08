Vector = require("../math/vector")

//Converts angular velocity to linear one relatively to given point
const angularVelocityToLinear = function(element, relativeVector) {
    let r = Vector.substract(relativeVector, element.getCenterVector())
    return Vector.cross(element.w, r)
}

module.exports = angularVelocityToLinear