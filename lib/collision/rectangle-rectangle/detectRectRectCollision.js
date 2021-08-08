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