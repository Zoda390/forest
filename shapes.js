class Plane{
    constructor(h,s){
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        //Now we want to add color to our vertices information.
        this.vertices =
        [    
        -1,0,-1,	60/255, 30/255, 0/255,      0,1,0,
        1,0,-1,		60/255, 30/255, 0/255,      0,1,0,
        -1,0,1,		60/255, 30/255, 0/255,      0,1,0,

        1,0,-1,		60/255, 30/255, 0/255,      0,1,0,
        -1,0,1,		60/255, 30/255, 0/255,      0,1,0,
        1,0,1,		60/255, 30/255, 0/255,      0,1,0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.loc = [0,h,0];
        this.rot = [0,0,0];
        this.scale = [s,s,s];
    }

    update(deltaTime){

    }

    render(faces){
        //Position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        var size = 3;          
        var type = gl.FLOAT;   
        var normalize = false; 
        var stride = 9*Float32Array.BYTES_PER_ELEMENT;    
        var offset = 0;        // start at the beginning of the buffer
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        //Color
        var colorAttributeLocation = gl.getAttribLocation(program,"a_color");
        size = 3;
        type = gl.FLOAT;
        normalize = false;
        stride = 9*Float32Array.BYTES_PER_ELEMENT;    
        offset = 3*Float32Array.BYTES_PER_ELEMENT;    
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, offset);

        //Normals
        var normalAttributeLocation = gl.getAttribLocation(program,"a_normals");
        size = 3;
        type = gl.FLOAT;
        normalize = false;
        stride = 9*Float32Array.BYTES_PER_ELEMENT;    
        offset = 6*Float32Array.BYTES_PER_ELEMENT;    
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.vertexAttribPointer(normalAttributeLocation, size, type, normalize, stride, offset);
                
        var tranLoc  = gl.getUniformLocation(program,'u_translation');
        gl.uniform3fv(tranLoc,new Float32Array(this.loc));
        var thetaLoc = gl.getUniformLocation(program,'u_rotation');
        gl.uniform3fv(thetaLoc,new Float32Array(this.rot));
        var scaleLoc = gl.getUniformLocation(program,'u_scale');
        gl.uniform3fv(scaleLoc,new Float32Array(this.scale));

        var primitiveType = gl.TRIANGLES;
        offset = 0;
        var count = 3*faces;
        gl.drawArrays(primitiveType, offset, count);
    }

    computeNormals(){
        this.vertexNormals = [];
        for(let i = 0; i < this.vertices.length; i++){
            vertexNormals.push(0,0,0);
        }
    }
}

//newX = aY*bZ - aZ*bY;
//newY = aX*bZ - aZ*bX;
//newZ = aX*bY - aY*bX;
function calcNormals(x1,y1,z1,x2,y2,z2,x3,y3,z3){
    let bSuba = [x2-x1, y2-y1, z2-z1];
    let cSuba = [x3-x1, y3-y1, z3-z1];
    return cross(bSuba, cSuba).toString();
}

function cross(a,b){
    let temp = [
        (a[1]*b[2] - a[2]*b[1]), 
        (a[2]*b[0] - a[0]*b[2]), 
        (a[0]*b[1] - a[1]*b[0])
    ];
    let mag = (Math.sqrt((temp[0]*temp[0])+(temp[1]*temp[1])+(temp[2]*temp[2])));
    temp[0] = parseFloat((temp[0]/mag).toPrecision(3));
    temp[1] = parseFloat((temp[1]/mag).toPrecision(3));
    temp[2] = parseFloat((temp[2]/mag).toPrecision(3));

    return temp;
}
class Rock extends Plane{
    constructor(x,y,z,s){
        super(0,s);
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        //Now we want to add color to our vertices information.
        this.vertices = [    
        -0.5,-0.2,0.5,		47/255, 50/255, 93/255,        -0.0632,-0.19,0.98,
        0.4,-0.5,0.5,		47/255, 50/255, 93/255,        -0.0632,-0.19,0.98,
        0.5,0.5,0.7,		47/255, 50/255, 93/255,        -0.0632,-0.19,0.98,

        -0.5,-0.2,0.5,		57/255, 69/255, 109/255,        0,0.275,-0.962,
        -0.5,0.5,0.7,		57/255, 69/255, 109/255,        0,0.275,-0.962,
        0.5,0.5,0.7,		57/255, 69/255, 109/255,        0,0.275,-0.962,
        

        -0.5,-0.2,0.5,		66/255, 88/255, 121/255,        0.946,-0.0887,0.311,
        -0.2,-0.5,-0.5,	    66/255, 88/255, 121/255,        0.946,-0.0887,0.311,
        -0.5,0.5,0.7,		66/255, 88/255, 121/255,        0.946,-0.0887,0.311,

        -0.5,0.5,0.7,		73/255, 107/255, 131/255,       -0.971,-0.235,-0.047,
        -0.5,0.7,-0.3,		73/255, 107/255, 131/255,       -0.971,-0.235,-0.047,
        -0.2,-0.5,-0.5,	    73/255, 107/255, 131/255,       -0.971,-0.235,-0.047,
 
 
        0.5,0.5,0.7,		81/255, 125/255, 145/255,       0,-0.981,-0.196,
        -0.5,0.5,0.7,		81/255, 125/255, 145/255,       0,-0.981,-0.196,
        -0.5,0.7,-0.3,		81/255, 125/255, 145/255,       0,-0.981,-0.196,
 
        0.5,0.5,0.7,		82/255, 140/255, 159/255,       0.487,0.811,-0.324,
        0.2,0.2,-0.5,		82/255, 140/255, 159/255,       0.487,0.811,-0.324,
        -0.5,0.7,-0.3,		82/255, 140/255, 159/255,       0.487,0.811,-0.324,

        

        -0.2,-0.5,-0.5,	    84/255, 162/255, 149/255,       0.458,-0.261,0.85,
        0.4,-0.1,-0.7,		84/255, 162/255, 149/255,       0.458,-0.261,0.85,
        0.2,0.2,-0.5,		84/255, 162/255, 149/255,       0.458,-0.261,0.85,

        -0.2,-0.5,-0.5,	    112/255, 188/255, 147/255,      -0.198,0.113,-0.974,
        -0.5,0.7,-0.3,		112/255, 188/255, 147/255,      -0.198,0.113,-0.974,
        0.2,0.2,-0.5,		112/255, 188/255, 147/255,      -0.198,0.113,-0.974,
        

        0.4,-0.5,0.5,		140/255, 213/255, 137/255,      0.995,-0.0933,-0.0311,
        0.4,-0.1,-0.7,		140/255, 213/255, 137/255,      0.995,-0.0933,-0.0311,
        0.5,0.5,0.7,		140/255, 213/255, 137/255,      0.995,-0.0933,-0.0311,

        0.5,0.5,0.7,		183/255, 224/255, 151/255,      -0.667,-0.667,0.333,
        0.2,0.2,-0.5,		183/255, 224/255, 151/255,      -0.667,-0.667,0.333,
        0.4,-0.1,-0.7,		183/255, 224/255, 151/255,      -0.667,-0.667,0.333,


        0.4,-0.5,0.5,		218/255, 239/255, 171/255,      -0.311,-0.932,0.186,
        -0.5,-0.2,0.5,		218/255, 239/255, 171/255,      -0.311,-0.932,0.186,
        -0.2,-0.5,-0.5,	    218/255, 239/255, 171/255,      -0.311,-0.932,0.186,

        0.4,-0.5,0.5,		241/255, 242/255, 182/255,      -0.466,0.839,0.28,
        0.4,-0.1,-0.7,		241/255, 242/255, 182/255,      -0.466,0.839,0.28,
        -0.2,-0.5,-0.5,	    241/255, 242/255, 182/255,      -0.466,0.839,0.28,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.loc = [x,y,z];
        this.rot = [Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2];
        this.colliderRad = s;
    }

    update(deltaTime){

    }
     
    render(){
        super.render(12);
    }
}

class Tree extends Plane{
    constructor(x,y,z,s,h){
        super(0,s);
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        //Now we want to add color to our vertices information.
        this.vertices = [    
        -0.5,   0.3,   0.5,		    47/255, 50/255, 93/255,           -0.0632,-0.19,0.98,
        0.4,    0,   0.5,		    47/255, 50/255, 93/255,           -0.0632,-0.19,0.98,
        0.5,    1,    0.7,		    47/255, 50/255, 93/255,           -0.0632,-0.19,0.98,

        -0.5,   0.3,   0.5,		    57/255, 69/255, 109/255,           0,0.275,-0.962,
        -0.5,   1,    0.7,		    57/255, 69/255, 109/255,           0,0.275,-0.962,
        0.5,    1,    0.7,		    57/255, 69/255, 109/255,           0,0.275,-0.962,
        

        -0.5,   0.3,   0.5,		    66/255, 88/255, 121/255,           0.946,-0.0887,0.311,
        -0.2,   0,   -0.5,	        66/255, 88/255, 121/255,           0.946,-0.0887,0.311,
        -0.5,   1,    0.7,		    66/255, 88/255, 121/255,           0.946,-0.0887,0.311,

        -0.5,   1,    0.7,		    73/255, 107/255, 131/255,          -0.971,-0.235,-0.047,
        -0.5,   1,    -0.3,		    73/255, 107/255, 131/255,          -0.971,-0.235,-0.047,
        -0.2,   0,   -0.5,	        73/255, 107/255, 131/255,          -0.971,-0.235,-0.047,


        0.5,    1,    0.7,		    81/255, 125/255, 145/255,          0,-0.981,-0.196,
        -0.5,   1,    0.7,		    81/255, 125/255, 145/255,          0,-0.981,-0.196,
        -0.5,   1,    -0.3,		    81/255, 125/255, 145/255,          0,-0.981,-0.196,
   
        0.5,    1,    0.7,		    82/255, 140/255, 159/255,          0.487,0.811,-0.324,
        0.2,    0.7,    -0.5,		82/255, 140/255, 159/255,          0.487,0.811,-0.324,
        -0.5,   1,    -0.3,		    82/255, 140/255, 159/255,          0.487,0.811,-0.324,

        

        -0.2,   0,   -0.5,	        84/255, 162/255, 149/255,          0.458,-0.261,0.85,
        0.4,    0.4,   -0.7,		84/255, 162/255, 149/255,          0.458,-0.261,0.85,
        0.2,    0.7,    -0.5,		84/255, 162/255, 149/255,          0.458,-0.261,0.85,

        -0.2,   0,   -0.5,	        112/255, 188/255, 147/255,         -0.198,0.113,-0.974,
        -0.5,   1,    -0.3,		    112/255, 188/255, 147/255,         -0.198,0.113,-0.974,
        0.2,    0.7,    -0.5,		112/255, 188/255, 147/255,         -0.198,0.113,-0.974,
        

        0.4,    0,   0.5,		    140/255, 213/255, 137/255,         0.995,-0.0933,-0.0311,
        0.4,    0.4,   -0.7,		140/255, 213/255, 137/255,         0.995,-0.0933,-0.0311,
        0.5,    1,    0.7,		    140/255, 213/255, 137/255,         0.995,-0.0933,-0.0311,
  
        0.5,    1,    0.7,		    183/255, 224/255, 151/255,         -0.667,-0.667,0.333,
        0.2,    0.7,    -0.5,		183/255, 224/255, 151/255,         -0.667,-0.667,0.333,
        0.4,    0.4,   -0.7,		183/255, 224/255, 151/255,         -0.667,-0.667,0.333,


        0.4,    0,   0.5,		    218/255, 239/255, 171/255,         -0.311,-0.932,0.186,
        -0.5,   0.3,   0.5,		    218/255, 239/255, 171/255,         -0.311,-0.932,0.186,
        -0.2,   0,   -0.5,   	    218/255, 239/255, 171/255,         -0.311,-0.932,0.186,
 
        0.4,    0,   0.5,		    241/255, 242/255, 182/255,         -0.466,0.839,0.28,
        0.4,    0.4,   -0.7,		241/255, 242/255, 182/255,         -0.466,0.839,0.28,
        -0.2,   0,   -0.5,	        241/255, 242/255, 182/255,         -0.466,0.839,0.28,


        -0.3,    0.5,      0.3,		    130/255, 70/255, 10/255,      0,0,-1,
        0.3,     0.5,      0.3,		    130/255, 70/255, 10/255,      0,0,-1,
        -0.3,    -1.0,      0.3,	    130/255, 70/255, 10/255,      0,0,-1,

        0.3,    0.5,      0.3,		    100/255, 60/255, 40/255,      0,0,-1,
        -0.3,    -1.0,      0.3,		100/255, 60/255, 40/255,      0,0,-1,
        0.3,    -1.0,      0.3,	        100/255, 60/255, 40/255,      0,0,-1,

        -0.3,    0.5,      -0.3,		110/255, 80/255, 10/255,      0,0,1,
        0.3,     0.5,      -0.3,		110/255, 80/255, 10/255,      0,0,1,
        -0.3,    -1.0,      -0.3,	    110/255, 80/255, 10/255,      0,0,1,

        0.3,    0.5,      -0.3,			100/255, 70/255, 0/255,       0,0,1,
        -0.3,    -1.0,      -0.3,		100/255, 70/255, 0/255,       0,0,1,
        0.3,    -1.0,      -0.3,		100/255, 70/255, 0/255,       0,0,1,

        0.3,     0.5,      -0.3,		100/255, 70/255, 60/255,      1,0,0,
        0.3,     0.5,      0.3, 		100/255, 70/255, 60/255,      1,0,0,
        0.3,     -1.0,     -0.3,	    100/255, 70/255, 60/255,      1,0,0,

        0.3,    0.5,       0.3, 		150/255, 70/255, 0/255,       1,0,0,
        0.3,     -1.0,     -0.3,		150/255, 70/255, 0/255,       1,0,0,
        0.3,    -1.0,      0.3, 	    150/255, 70/255, 0/255,       1,0,0,

        -0.3,    0.5,       -0.3,		110/255, 50/255, 10/255,      -1,0,0,
        -0.3,    0.5,       0.3, 		110/255, 50/255, 10/255,      -1,0,0,
        -0.3,    -1.0,      -0.3,	    110/255, 50/255, 10/255,      -1,0,0,

        -0.3,   0.5,        0.3, 		120/255, 90/255, 0/255,       -1,0,0,
        -0.3,    -1.0,      -0.3,		120/255, 90/255, 0/255,       -1,0,0,
        -0.3,   -1.0,       0.3, 	    120/255, 90/255, 0/255,       -1,0,0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.loc = [x,y,z];
        this.rot = [0,Math.random()*Math.PI*2,0];
        this.scale = [s,h,s];
        this.colliderRad = s;
        if(this.colliderRad < 0.11){
            this.colliderRad = 0.11;
        }
    }

    update(deltaTime){
        this.rot[1]+=1*deltaTime;
    }
     
    render(){
        super.render(12+8);
    }
}