Vector = require("../../math/vector")

const detectRectFrameCollision = function(element, scene) {
    let collide = [];
    let pointsVector = element.getPointVector();
    for(let i = 0; i < 4; i++) {
        //Left collision
        if(pointsVector[i].x < 0) {
            collide.push({
                collideVector : pointsVector[i], 
                normalUnit : new Vector(1,0,0),
                distance : Math.abs(pointsVector[i].x)});
        }
        //Right collision
        else if(pointsVector[i].x > scene.clientWidth) {
            collide.push({
                collideVector : pointsVector[i], 
                normalUnit : new Vector(-1,0,0),
                distance : Math.abs(pointsVector[i].x - scene.clientWidth)})        
        }
    }
    for(let i = 0; i < 4; i++) {
        //Top collision
        if(pointsVector[i].y < 0) {
            collide.push({
                collideVector : pointsVector[i],
                normalUnit : new Vector(0,1,0),
                distance : Math.abs(pointsVector[i].y)})
        }
        //Bottom collision
        else if(pointsVector[i].y > scene.clientHeight) {
            collide.push({
                collideVector : pointsVector[i],
                normalUnit : new Vector(0,-1,0),
                distance : Math.abs(pointsVector[i].y - scene.clientHeight)})
        }
    }
    return collide;
}

module.exports = detectRectFrameCollision