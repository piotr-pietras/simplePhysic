Vector = require("../../math/vector")

removeRectRectCollision = function(collide) {
    let element1 = collide.element1;
    let element2 = collide.element2;

    let moveByVector1 = Vector.multiply(collide.distanceVectorCorrected, 0.5);
    let moveByVector2 = Vector.contrary(moveByVector1);

    element1.setPosition(element1.x + moveByVector1.x, element1.y + moveByVector1.y, element1.c);
    element2.setPosition(element2.x + moveByVector2.x, element2.y + moveByVector2.y, element2.c);
}

module.exports = removeRectRectCollision