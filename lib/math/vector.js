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