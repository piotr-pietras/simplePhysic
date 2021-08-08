Vector = require("../math/vector")
const angularVelocityToLinear = require("./angularVelocityToLinear")

//Returns sum of linear velocity vector and angular velocity relatively to given point
const relativeVelocity = function(element, relativeVector){
    return Vector.sum(element.v, angularVelocityToLinear(element, relativeVector));
}

module.exports = relativeVelocity;