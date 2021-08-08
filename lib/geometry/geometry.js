Vector = require("../math/vector")
const config = require("../config.json")

class Geometry{
    constructor(DOMelement) {
        this.DOMelement = DOMelement;
        let info = DOMelement.getBoundingClientRect();
        this.width = info.width;
        this.height = info.height;
        this.x = info.x;
        this.y = info.y;
        this.c = 0;
        this.v = new Vector(0, 0, 0); 
        this.w = new Vector(0, 0, 0); 
        this.elastic = 0.6;
        this.density = 1;
    }

    setPosition(x, y, c) {
        this.x = x; this.y = y; this.c = c;
        this.DOMelement.style.transform = "translate(" 
        + x + "px," + y + "px)"
        + "rotateZ(" + this.c * 180/Math.PI + "deg)";
    }

    move() {
        let x = this.x + this.v.x * config.REFRESH_PERIOD * 0.001;
        let y = this.y + this.v.y * config.REFRESH_PERIOD * 0.001;
        let c = this.c + this.w.z * config.REFRESH_PERIOD * 0.001;
        this.setPosition(x, y, c);
    }
    
    getPositionVector() {return(new Vector(this.x, this.y, 0));}

    getCenterVector() {
        return(new Vector(
            this.x + this.width/2,
            this.y + this.height/2,
            0
        ))
    }
/*
    setDragging(isDragging) {
        if(isDragging) {
            this.info.dragging = true;
            this.physic.v = new simplePhysic.vector(0, 0, 0);
            this.physic.w = new simplePhysic.vector(0, 0, 0); 
        }
        else this.info.dragging = false;
    }
*/    
};

module.exports = Geometry;
