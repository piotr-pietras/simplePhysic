const collisionImpulse = require("../../physic/collisionImpulse")
const linearImpulseEffect = require("../../physic/linearImpulseEffect")
const angularImpulseEffect = require("../../physic/angularImpulseEffect")

const affectRectFrameCollision = function(element, collide) {
    for(let pick of collide) {
        let j = collisionImpulse(element, "static", pick.collideVector, pick.normalUnit);
        element.v = linearImpulseEffect(j, element, pick.normalUnit);
        element.w = angularImpulseEffect(j, element, pick.normalUnit, pick.collideVector);
    }
}

module.exports = affectRectFrameCollision