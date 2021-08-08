Vector = require("../math/vector")
const relativeVelocity = require("./relativeVelocity")

//Returns collision impulse
const collisionImpulse = function (element1, element2, collideVector, normalUnit) {
    //-------------------Calculate numerator---------------------------------------------
    let rv1 = relativeVelocity(element1, collideVector)
    let rv2 = new Vector(0,0,0)
    let e = element1.elastic
    if(element2 != "static") {
        rv2 = relativeVelocity(element2, collideVector)
        e = (e + element2.elastic) / 2; // <-- average kinetic absorbtion
    }
    let rv = Vector.substract(rv1, rv2)
    let rv_abs = Vector.multiply(rv, -(1 + e))
    let numerator = Vector.dot(rv_abs, normalUnit) // <-- numerator
    //-------------------Calculate denominator---------------------------------------------
    let r1 = Vector.substract(collideVector, element1.getCenterVector())  
    let r1_norm = Vector.cross(r1, normalUnit)
    let r1_pow = Vector.dot(r1_norm, r1_norm)
    let denominator = (1/ element1.mass) + (r1_pow / element1.inertia) // <-- denominator
    if(element2 != "static") {
        let r2 = Vector.substract(collideVector, element2.getCenterVector())  
        let r2_norm = Vector.cross(r2, normalUnit)
        let r2_pow = Vector.dot(r2_norm, r2_norm)       
        denominator += (1/ element2.mass) + (r2_pow / element2.inertia) // <-- denominator 
    }

    return numerator / denominator
}

module.exports = collisionImpulse