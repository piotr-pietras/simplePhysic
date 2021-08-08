Vector = require("../math/vector")

//Returns velocity vector being affected by collision impulse
const linearImpulseEffect = function(j, element, normalUnit) {
    let normJ = Vector.multiply(normalUnit, j);
    let vJ = Vector.multiply(normJ, (1/element.mass));
    return Vector.sum(element.v, vJ)
}

module.exports = linearImpulseEffect;