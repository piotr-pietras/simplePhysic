(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
Rectangle = require("./lib/geometry/rectangle")
const simulate = require("./lib/simulate/simulate")

simplePhysic = {}
simplePhysic.scene = null
simplePhysic.elements = []
/*
simplePhysic.addCircle = function(diameter, x , y, color) {
   this.elements.push(new Circle(diameter, x, y, color));
}
*/
/*
simplePhysic.addRectangle = function(width, height, x , y, color) {
   this.elements.push(new Rectangle(width, height, x, y, color));
}
*/
simplePhysic.parseDOM = function(document) {
    simplePhysic.elements = []
    simplePhysic.scene = document.querySelector("#simplePhysic-scene")

    if(simplePhysic.scene){
        let rectangles = document.querySelectorAll(".simplePhysic-rectangle")
        for(let i=0; i < rectangles.length; i++) { 
            simplePhysic.elements.push(new Rectangle(rectangles[i]))
        }
    }
    else console.log("ERR! #scene-simplePhysic has not been found")
}

simplePhysic.start = function() {
    simulate(simplePhysic.elements, simplePhysic.scene)
}

module.exports = simplePhysic

/*
simplePhysic.clearAll = function () {  
   clearInterval(this.simulateInterval);
   for(i in this.elements) {
      this.elements[i].removeCSS();
   }
   this.elements = [];
   this.activeEffects = []
   console.log("-> simplePhysic cleared all")
}

//DOES NOT WORK PROPERLY !!!!
simplePhysic.addDragToAllElements = function(elements) {
   let drag = undefined;
   for(let i of elements) {
        i.elementHTML.addEventListener("mouseover", (e) => {
            i.elementHTML.style.cursor = "grab";
        })

        i.elementHTML.addEventListener("mousedown", (e) => {
            i.setDragging(true);
            drag = i.elementHTML; 
        })
       
        i.elementHTML.addEventListener("mouseup", (e) => {
            i.setDragging(false);
            drag = undefined;
        })

        this.scene.addEventListener("mouseup", (e) => {
            i.setDragging(false);
            drag = undefined;
        })  

        this.scene.addEventListener("mousemove", (e) => {
            if(drag == i.elementHTML) {
                i.setPosition(
                    e.clientX - i.info.width/2, 
                    e.clientY - i.info.height/2, i.info.c);
            }
        })
   }
}

simplePhysic.addRandom = function(clickEvent) {
    let colors = ["red", "yellow", "green", "blue", "purple"];

    if(Math.random() > 0.5) {
        let width = 20 + 80 * Math.random();
        this.addCircle(
            width, 
            clickEvent.clientX - width/2, clickEvent.clientY - width/2, 
            colors[Math.floor(Math.random() * colors.length)]);
    }

    else {
        let width = 20 + 130 * Math.random();
        let height = 20 + 130 * Math.random();
        this.addRectangle(
            width, height, 
            clickEvent.clientX - width/2, clickEvent.clientY - height/2,  
            colors[Math.floor(Math.random() * colors.length)]);
    }
}
*/
},{"./lib/geometry/rectangle":12,"./lib/simulate/simulate":20}],2:[function(require,module,exports){
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
},{"../geometry/rectangle":12,"./rectangle-frame/affectRectFrameCollision":3,"./rectangle-frame/detectRectFrameCollision":4,"./rectangle-frame/removeRectFrameCollision":5,"./rectangle-rectangle/affectRectRectCollision":6,"./rectangle-rectangle/detectRectRectCollision":7,"./rectangle-rectangle/removeRectRectCollision":8}],3:[function(require,module,exports){
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
},{"../../physic/angularImpulseEffect":15,"../../physic/collisionImpulse":17,"../../physic/linearImpulseEffect":18}],4:[function(require,module,exports){
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
},{"../../math/vector":14}],5:[function(require,module,exports){
Vector = require("../../math/vector")

const removeRectFrameCollision = function(element, collide) {
    for(let pick of collide){
        let moveByVector = Vector.multiply(pick.normalUnit, pick.distance);
        element.setPosition(element.x + moveByVector.x, element.y + moveByVector.y, element.c);
    }
}

module.exports = removeRectFrameCollision;
},{"../../math/vector":14}],6:[function(require,module,exports){
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
},{"../../math/vector":14,"../../physic/angularImpulseEffect":15,"../../physic/collisionImpulse":17,"../../physic/linearImpulseEffect":18}],7:[function(require,module,exports){
Vector = require("../../math/vector")
Line = require("../../math/line")

//Functions seems highly inneffective and complicated!!!
const detectRectRectCollision = function (element1, element2) {
    let collide;
    let map = [];
    let pointsVector1 = element1.getPointVector(); let pointsVector2 = element2.getPointVector();

    //Searching for intersacting lines of rectangle and push it do map
    for(let i = 0; i < 4; i++) {
        let line1 = new Line(pointsVector1[i], pointsVector1[(i+1)%4]);
        for(let j = 0; j < 4; j++) {
            let line2 = new Line(pointsVector2[j], pointsVector2[(j+1)%4]);
                
            if(Line.intersect2D(line1, line2)){
                let collideVector = Line.intersectPoint2D(line1, line2);
                let d; //Distance vector 
                let n; //Normal unit

                d = Line.distanceToPoint2D(line2, line1.p1); 
                n = Vector.unit(Vector.rotate(line2.v, new Vector(0,0,0), 90)); 
                map.push({e : element1, eStatic : element2, n : n, d : d, c : collideVector});
                    
                d = Line.distanceToPoint2D(line2, line1.p2)
                map.push({e : element1, eStatic : element2, n : n, d : d, c : collideVector});

                d = Line.distanceToPoint2D(line1, line2.p1)
                n = Vector.unit(Vector.rotate(line1.v, new Vector(0,0,0), 90)); 
                map.push({e : element2, eStatic : element1, n : n, d : d, c : collideVector});     

                d = Line.distanceToPoint2D(line1, line2.p2)
                map.push({e : element2, eStatic : element1, n : n, d : d,  c : collideVector}); 
            }
        }
    }

    //Sorting map by distance between line's point and collide vector
    map.sort((a, b) => {
        if(Vector.magnitude(a.d) < Vector.magnitude(b.d)) return -1;
        else if(Vector.magnitude(a.d) > Vector.magnitude(b.d)) return 1;
        else return 0;
    });

    //Picks lines and translate them by point-to-line distance and if it does not
    //intersect any more picks it
    let mapPick;
    for(let pick of map) {
        let pointsVector1 = pick.e.getPointVector(); let pointsVector2 = pick.eStatic.getPointVector();
        for(let i = 0; i < 4; i++) {
            let intersected = false;
            //Moves line 
            pick.dCorrected = Vector.multiply(Vector.assimilate(pick.d, pick.n), 1.01)
            let line1 = Line.moveBy(new Line(pointsVector1[i], pointsVector1[(i+1)%4]), pick.dCorrected);
            //Checks if intersect
            for(let j = 0; j < 4; j++) {
                let line2 = new Line(pointsVector2[j], pointsVector2[(j+1)%4]);
                if(Line.intersect2D(line2, line1)) {intersected = true; break;}
            }

            if(intersected) break;
            if(!intersected && i == 3) mapPick = pick;
        }
        if(mapPick) break;
    }    

    if(mapPick) {
        collide = {
            normalUnit : mapPick.n, 
            distanceVectorCorrected : mapPick.dCorrected,
            collideVector : mapPick.c,
            element1 : mapPick.e, // normalUnit towards this element
            element2 : mapPick.eStatic // normalUnit outwards this element
        };
    }
    return collide;
}

module.exports = detectRectRectCollision
},{"../../math/line":13,"../../math/vector":14}],8:[function(require,module,exports){
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
},{"../../math/vector":14}],9:[function(require,module,exports){
module.exports={
    "REFRESH_PERIOD": 40,
    "CHECK_OBJECTS_COLLISION": true,
    "CHECK_FRAME_COLLISION": true,
    "REMOVE_COLLISION": true,
    "G_FORCE": 9.80665
}
},{}],10:[function(require,module,exports){
const config = require("../config.json")

const effectOfGravity = function(element) {
    element.v.y += config.G_FORCE * config.REFRESH_PERIOD * 0.001;
}

const activeEffects = [effectOfGravity];

module.exports = activeEffects;
},{"../config.json":9}],11:[function(require,module,exports){
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

},{"../config.json":9,"../math/vector":14}],12:[function(require,module,exports){
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
},{"../math/vector":14,"./geometry.js":11}],13:[function(require,module,exports){
Vector = require("./vector")

class Line {
    constructor(vector1, vector2) {
        this.p1 = vector1;
        this.p2 = vector2;
        this.v = Vector.substract(vector2, vector1);
    }

    static moveBy(line, vector) {
        let p1 = Vector.sum(line.p1, vector);
        let p2 = Vector.sum(line.p2, vector);
        return new Line(p1, p2);
    }

    //Checks lines' intersaction
    static intersect2D(line1, line2) {
        let d = (line1.p1.x - line1.p2.x)*(line2.p1.y - line2.p2.y) - (line1.p1.y - line1.p2.y)*(line2.p1.x - line2.p2.x);
        if(d == 0) return false;

        let t = ((line1.p1.x - line2.p1.x)*(line2.p1.y - line2.p2.y) - (line1.p1.y - line2.p1.y)*(line2.p1.x - line2.p2.x)) / d;
        let u = ((line1.p2.x - line1.p1.x)*(line1.p1.y - line2.p1.y) - (line1.p2.y - line1.p1.y)*(line1.p1.x - line2.p1.x)) / d;
        
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
        return false;
    }

    //Returns intersatinon point
    static intersectPoint2D(line1, line2) {
        let d = (line1.p1.x - line1.p2.x)*(line2.p1.y - line2.p2.y) - (line1.p1.y - line1.p2.y)*(line2.p1.x - line2.p2.x);
        if(d == 0) return false;

        let x = ((line1.p1.x*line1.p2.y - line1.p1.y*line1.p2.x)*(line2.p1.x - line2.p2.x)
        - (line1.p1.x - line1.p2.x)*(line2.p1.x*line2.p2.y - line2.p1.y*line2.p2.x)) / d;
        let y = ((line1.p1.x*line1.p2.y - line1.p1.y*line1.p2.x)*(line2.p1.y - line2.p2.y)
        - (line1.p1.y - line1.p2.y)*(line2.p1.x*line2.p2.y - line2.p1.y*line2.p2.x)) / d;
        
        return new Vector(x, y, 0);
    }

    //Returns perpendicular vector to line from point
    //Vector's arrow pointing line
    static distanceToPoint2D(line, point) {
        let n = Vector.unit(line.v);
        let s = Vector.substract(point, line.p1);
        let dot = Vector.dot(s, n);
        let multiply = Vector.multiply(n, dot);

        return Vector.substract(s, multiply);
    }
}

module.exports = Line;
},{"./vector":14}],14:[function(require,module,exports){
class Vector {
    constructor(x, y, z) {
        this.x = x; this.y = y; this.z = z;
    }

    toString() {return "x: " + this.x + " y: " + this.y + " z: " + this.z;}

    //Method returns substract of vectors
    static substract(vector1, vector2) {
        let x = vector1.x - vector2.x;
        let y = vector1.y - vector2.y;
        let z = vector1.z - vector2.z;
        return(new Vector(x, y, z));
    }

    //Method returns sum of vectors
    static sum(vector1, vector2) {
        let x = vector1.x + vector2.x;
        let y = vector1.y + vector2.y;
        let z = vector1.z + vector2.z;
        return(new Vector(x, y, z));
    }

    //Method returns multiplied vector by scalar
    static multiply(vector, scalar) {
        return(new Vector(vector.x * scalar, vector.y * scalar, vector.z * scalar));
    }

    //Method returns contrary vector
    static contrary(vector) {
        return(new Vector(vector.x * (-1), vector.y * (-1), vector.z * (-1)));
    }

    //Method returns distance between points pointed by vectors
    static distance(vector1, vector2) {
        return(Math.sqrt(
            Math.pow(vector2.x - vector1.x, 2) +
            Math.pow(vector2.y - vector1.y, 2) +
            Math.pow(vector2.z - vector1.z, 2)))
    }

    //Method returns vector's magnitude
    static magnitude(vector) {
        return(Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2) + Math.pow(vector.z, 2)))
    }

    //Method returns unit vector converted from given vector
    static unit(vector) {
        let mag = this.magnitude(vector);
        return new Vector(vector.x / mag, vector.y / mag, vector.z / mag);
    }

    //Method returns cross product
    static cross(vector1, vector2) {
        return new Vector(
            vector1.y * vector2.z - vector1.z * vector2.y,
            vector1.z * vector2.x - vector1.x * vector2.z,
            vector1.x * vector2.y - vector1.y * vector2.x
        )
    }

    //Method returns dot prodcut
    static dot(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
    }

    //Method returns array of vectors [parrarelm to unit , normal to unit]
    static subdivide(vector, normalUnit) {
        let vector1 = this.multiply(normalUnit, this.dot(vector, normalUnit)); 
        let vector2 = this.substract(vector, vector1);
        return [vector1, vector2];
    }

    //Method returns vector rotated in 2D around center point
    static rotate(vector, centerVector, angle) {
        let angleRad = angle * Math.PI/180;
        let x0 = centerVector.x; let y0 = centerVector.y;
        let x = ((vector.x - x0)*Math.cos(angleRad) - (vector.y - y0)*Math.sin(angleRad)) + x0;
        let y = ((vector.x - x0)*Math.sin(angleRad) + (vector.y - y0)*Math.cos(angleRad)) + y0;
        return new Vector(x, y, 0);
    }

    //Method returns angle between vectors in rad
    static angle(vector1, vector2) {
        let dot = this.dot(vector1, vector2);
        let t = this.magnitude(vector1) * this.magnitude(vector2);
        return Math.acos(dot / t);
    }

    //Method returns vector with changed values to absolute
    static absolute(vector) {
        return new Vector(Math.abs(vector.x), Math.abs(vector.y), Math.abs(vector.z));
    }

    //Method returns vector with signs equal to normal unit
    static assimilate(vector, normalUnit) {
        let x = vector.x;
        let y = vector.y;
        let z = vector.z;
        if(Math.sign(x) != Math.sign(normalUnit.x)) x *= -1;
        if(Math.sign(y) != Math.sign(normalUnit.y)) y *= -1;
        if(Math.sign(z) != Math.sign(normalUnit.y)) z *= -1;
        return new Vector(x, y, z);
    }
}

module.exports = Vector;
},{}],15:[function(require,module,exports){
Vector = require("../math/vector")

//Returns angular velocity vector being affected by collision impulse
angularImpulseEffect = function(j, element, normalUnit, collideVector) {
    let normJ = Vector.multiply(normalUnit, j)
    let r = Vector.substract(collideVector, element.getCenterVector())
    let normJ_r = Vector.cross(r, normJ)
    let wJ = Vector.multiply(normJ_r, (1/element.inertia))
    return Vector.sum(element.w, wJ)
}

module.exports = angularImpulseEffect
},{"../math/vector":14}],16:[function(require,module,exports){
Vector = require("../math/vector")

//Converts angular velocity to linear one relatively to given point
const angularVelocityToLinear = function(element, relativeVector) {
    let r = Vector.substract(relativeVector, element.getCenterVector())
    return Vector.cross(element.w, r)
}

module.exports = angularVelocityToLinear
},{"../math/vector":14}],17:[function(require,module,exports){
Vector = require("../math/vector")
const relativeVelocity = require("./relativeVelocity")

//Returns collision impulse
const collisionImpulse = function (element1, element2, collideVector, normalUnit) {
    //-------------------Calculate numerator---------------------------------------------
    let rv1 = relativeVelocity(element1, collideVector)
    let rv2 = new Vector(0,0,0)
    let e = element1.elastic
    if(element2 != "static") {
        rv2 = relativeVelocity(element2, collideVector)
        e = (e + element2.elastic) / 2; // <-- average kinetic absorbtion
    }
    let rv = Vector.substract(rv1, rv2)
    let rv_abs = Vector.multiply(rv, -(1 + e))
    let numerator = Vector.dot(rv_abs, normalUnit) // <-- numerator
    //-------------------Calculate denominator---------------------------------------------
    let r1 = Vector.substract(collideVector, element1.getCenterVector())  
    let r1_norm = Vector.cross(r1, normalUnit)
    let r1_pow = Vector.dot(r1_norm, r1_norm)
    let denominator = (1/ element1.mass) + (r1_pow / element1.inertia) // <-- denominator
    if(element2 != "static") {
        let r2 = Vector.substract(collideVector, element2.getCenterVector())  
        let r2_norm = Vector.cross(r2, normalUnit)
        let r2_pow = Vector.dot(r2_norm, r2_norm)       
        denominator += (1/ element2.mass) + (r2_pow / element2.inertia) // <-- denominator 
    }

    return numerator / denominator
}

module.exports = collisionImpulse
},{"../math/vector":14,"./relativeVelocity":19}],18:[function(require,module,exports){
Vector = require("../math/vector")

//Returns velocity vector being affected by collision impulse
const linearImpulseEffect = function(j, element, normalUnit) {
    let normJ = Vector.multiply(normalUnit, j);
    let vJ = Vector.multiply(normJ, (1/element.mass));
    return Vector.sum(element.v, vJ)
}

module.exports = linearImpulseEffect;
},{"../math/vector":14}],19:[function(require,module,exports){
Vector = require("../math/vector")
const angularVelocityToLinear = require("./angularVelocityToLinear")

//Returns sum of linear velocity vector and angular velocity relatively to given point
const relativeVelocity = function(element, relativeVector){
    return Vector.sum(element.v, angularVelocityToLinear(element, relativeVector));
}

module.exports = relativeVelocity;
},{"../math/vector":14,"./angularVelocityToLinear":16}],20:[function(require,module,exports){
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
},{"../collision/pipeCollision":2,"../config.json":9,"../effects/effects":10}]},{},[1]);
