Geometry = require("./geometry.js")
Vector = require("../math/vector")

class Rectangle extends Geometry {
    constructor(DOMelement) {
        super(DOMelement);
        let w = this.width; let h = this.height;
        this.mass = w * h * this.density;
        this.inertia = (4/3) * w * h * (Math.pow(w,2) + Math.pow(h,2)) * this.density;
    }

    getPointVector() {
        let points = [];
        points.push(Vector.rotate(
            this.getPositionVector(), this.getCenterVector(), this.c * 180/Math.PI));
        points.push(Vector.rotate(
            Vector.sum(this.getPositionVector(), new Vector(0, this.height, 0)), 
            this.getCenterVector(), this.c * 180/Math.PI));        
        points.push(Vector.rotate(
            this.getPositionVector(), this.getCenterVector(), (this.c * 180/Math.PI) + 180));  
        points.push(Vector.rotate(
            Vector.sum(this.getPositionVector(), new Vector(this.width, 0, 0)), 
            this.getCenterVector(), this.c * 180/Math.PI)); 

        return points;
    }
}

module.exports = Rectangle;