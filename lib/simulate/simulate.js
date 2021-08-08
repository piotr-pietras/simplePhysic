const config = require("../config.json")
const activeEffects = require("../effects/effects")
const pipeCollision = require("../collision/pipeCollision")

let simulateInterval = null;

const simulate = function(elements, scene) {
    clearInterval(simulateInterval);
    simulateInterval = setInterval(() => {
        for(let i = 0; i < elements.length; i++) {
            //Apply effect
            for(let affect of activeEffects) {
                affect(elements[i]);
            }

            //Check for frame collision
            if(config.CHECK_FRAME_COLLISION) {
                pipeCollision(elements[i], scene);
            }

            //Check for object collision
            if(config.CHECK_OBJECTS_COLLISION) {
                for(let j = i + 1; j < elements.length ; j++) {
                    if(elements[i] == elements[j]) continue;
                    pipeCollision(elements[i], elements[j]);
                }
            }

            elements[i].move();
        }
    }, config.refreshPeriod);
};

module.exports = simulate