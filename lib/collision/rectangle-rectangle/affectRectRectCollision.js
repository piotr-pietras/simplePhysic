Vector = require("../../math/vector")
const collisionImpulse = require("../../physic/collisionImpulse")
const linearImpulseEffect = require("../../physic/linearImpulseEffect")
const angularImpulseEffect = require("../../physic/angularImpulseEffect")

const affectRectRectCollision = function (collide) {
    let element1 = collide.element1;
    let element2 = collide.element2;

    let j = collisionImpulse(element1, element2, collide.collideVector, collide.normalUnit);
    element1.v = linearImpulseEffect(j, element1, collide.normalUnit);
    element1.w = angularImpulseEffect(j, element1, collide.normalUnit, collide.collideVector);
    let normalUnitContrary = Vector.contrary(collide.normalUnit);
    element2.v = linearImpulseEffect(j, element2, normalUnitContrary);
    element2.w = angularImpulseEffect(j, element2, normalUnitContrary, collide.collideVector);
}

module.exports = affectRectRectCollision