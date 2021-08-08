Rectangle = require("../geometry/rectangle")
const detectRectFrameCollision = require("./rectangle-frame/detectRectFrameCollision")
const affectRectFrameCollision = require("./rectangle-frame/affectRectFrameCollision")
const removeRectFrameCollision = require("./rectangle-frame/removeRectFrameCollision")
const detectRectRectCollision = require("./rectangle-rectangle/detectRectRectCollision")
const affectRectRectCollision = require("./rectangle-rectangle/affectRectRectCollision")
const removeRectRectCollision = require("./rectangle-rectangle/removeRectRectCollision")

const pipeCollision = function(element1, element2) {
    //Rectangle-Frame collision 
    if(element1 instanceof Rectangle && element2.id == "simplePhysic-scene") {
        let collide = detectRectFrameCollision(element1, element2);
        if(collide.length > 0) {
            affectRectFrameCollision(element1, collide)
            removeRectFrameCollision(element1, collide); // <-- couse shaking object!!!
        }
    }
    
    //Rectangle-Rectangle collision
    else if(element1 instanceof Rectangle && element2 instanceof Rectangle) {
        let collide = detectRectRectCollision(element1,element2);
        if(collide) {
            affectRectRectCollision(collide)
            removeRectRectCollision(collide)
        }
    }    
}

module.exports = pipeCollision