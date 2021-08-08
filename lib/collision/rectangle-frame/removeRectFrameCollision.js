Vector = require("../../math/vector")

const removeRectFrameCollision = function(element, collide) {
    for(let pick of collide){
        let moveByVector = Vector.multiply(pick.normalUnit, pick.distance);
        element.setPosition(element.x + moveByVector.x, element.y + moveByVector.y, element.c);
    }
}

module.exports = removeRectFrameCollision;