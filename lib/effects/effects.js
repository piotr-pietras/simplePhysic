const config = require("../config.json")

const effectOfGravity = function(element) {
    element.v.y += config.G_FORCE * config.REFRESH_PERIOD * 0.001;
}

const activeEffects = [effectOfGravity];

module.exports = activeEffects;