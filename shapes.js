class Point{
    constructor(x,y,z){
        this.loc = [x,y,z];
    }
}

class Face{
    constructor(v1,v2,v3,r,g,b){
        this.verts = [v1, v2, v3];
        this.color = [r/255,g/255,b/255];
        this.normal = [];
        this.computeNormal();
    }

    computeNormal(){
        let a = [
            this.verts[1].loc[0]-this.verts[0].loc[0], 
            this.verts[1].loc[1]-this.verts[0].loc[1], 
            this.verts[1].loc[2]-this.verts[0].loc[2]
        ];
        let b = [
            this.verts[2].loc[0]-this.verts[0].loc[0], 
            this.verts[2].loc[1]-this.verts[0].loc[1], 
            this.verts[2].loc[2]-this.verts[0].loc[2]
        ];
        
        let temp = [
            (a[1]*b[2] - a[2]*b[1]), 
            -(a[2]*b[0] - a[0]*b[2]), 
            (a[0]*b[1] - a[1]*b[0])
        ];
        let mag = (Math.sqrt((temp[0]*temp[0])+(temp[1]*temp[1])+(temp[2]*temp[2])));
        temp[0] = parseFloat((temp[0]/mag).toPrecision(3));
        temp[1] = parseFloat((temp[1]/mag).toPrecision(3));
        temp[2] = parseFloat((temp[2]/mag).toPrecision(3));
    
        this.normal=temp;
    }

    toBuffer(){
        return [
            this.verts[0].loc[0], this.verts[0].loc[1], this.verts[0].loc[2], this.color[0], this.color[1], this.color[2], this.normal[0], this.normal[1], this.normal[2],
            this.verts[1].loc[0], this.verts[1].loc[1], this.verts[1].loc[2], this.color[0], this.color[1], this.color[2], this.normal[0], this.normal[1], this.normal[2],
            this.verts[2].loc[0], this.verts[2].loc[1], this.verts[2].loc[2], this.color[0], this.color[1], this.color[2], this.normal[0], this.normal[1], this.normal[2]
        ];
    }
}

class Mesh{
    constructor(){
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.faces = [
            new Face(
                new Point(-1,  0, -1), 
                new Point( 1,  0, -1), 
                new Point( 0,  0,  1), 
                255, 255, 255
            )
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.facesToBuffer()), gl.STATIC_DRAW);
        this.loc = [0,0,0];
        this.rot = [0,0,0];
        this.scale = [1,1,1];
    }

    facesToBuffer(){
        let tempBuff = [];
        for(let i = 0; i < this.faces.length; i++){
            tempBuff = tempBuff.concat(this.faces[i].toBuffer());
        }

        return tempBuff;
    }

    render(){
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
        var count = 3*this.faces.length;
        gl.drawArrays(primitiveType, offset, count);
    }
}

class Plane extends Mesh{
    constructor(h,s){
        super();
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.faces = [
            new Face(
                new Point(-1,  0, -1), 
                new Point( 1,  0, -1), 
                new Point(-1,  0,  1), 
                40, 20, 10
            ),
            new Face(
                new Point( 1,  0, -1), 
                new Point( 1,  0,  1), 
                new Point(-1,  0,  1), 
                40, 20, 10
            )
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.facesToBuffer()), gl.STATIC_DRAW);
        this.loc = [0,h,0];
        this.rot = [0,0,0];
        this.scale = [s,s,s];
    }
}

class Rock extends Mesh{
    constructor(x,y,z,s){
        super();
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.faces = [
            new Face(
                new Point(-0.5, -0.2,   0.5), 
                new Point( 0.4, -0.5,   0.5), 
                new Point( 0.5,  0.5,   0.7), 
                47, 50, 93
            ),
            new Face(
                new Point(-0.5,  0.5,  0.7), 
                new Point(-0.5, -0.2,  0.5), 
                new Point( 0.5,  0.5,  0.7), 
                57, 69, 109
            ),
            new Face(
                new Point(-0.5, -0.2,  0.5), 
                new Point(-0.2, -0.5, -0.5), 
                new Point(-0.5,  0.5,  0.7), 
                66, 88, 121
            ),
            new Face(
                new Point(-0.5,  0.7, -0.3), 
                new Point(-0.5,  0.5,  0.7), 
                new Point(-0.2, -0.5, -0.5), 
                73, 107, 131
            ),
            new Face(
                new Point( 0.5,  0.5,  0.7), 
                new Point(-0.5,  0.5,  0.7), 
                new Point(-0.5,  0.7, -0.3), 
                81, 125, 145
            ),
            new Face(
                new Point( 0.2,  0.2, -0.5), 
                new Point( 0.5,  0.5,  0.7), 
                new Point(-0.5,  0.7, -0.3), 
                82, 140, 159
            ),
            new Face(
                new Point(-0.2, -0.5, -0.5), 
                new Point( 0.4, -0.1, -0.7), 
                new Point( 0.2,  0.2, -0.5), 
                84, 162, 149
            ),
            new Face(
                new Point(-0.5,  0.7, -0.3), 
                new Point(-0.2, -0.5, -0.5), 
                new Point( 0.2,  0.2, -0.5), 
                112, 188, 147
            ),
            new Face(
                new Point( 0.4, -0.5,  0.5), 
                new Point( 0.4, -0.1, -0.7), 
                new Point( 0.5,  0.5,  0.7), 
                140, 213, 137
            ),
            new Face(
                new Point( 0.5,  0.5,  0.7), 
                new Point( 0.2,  0.2, -0.5), 
                new Point( 0.4, -0.1, -0.7), 
                183, 224, 151
            ),
            new Face(
                new Point( 0.4, -0.5,  0.5), 
                new Point(-0.5, -0.2,  0.5), 
                new Point(-0.2, -0.5, -0.5), 
                218, 239, 171
            ),
            new Face(
                new Point( 0.4, -0.1, -0.7), 
                new Point( 0.4, -0.5,  0.5), 
                new Point(-0.2, -0.5, -0.5), 
                241, 242, 182
            )
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.facesToBuffer()), gl.STATIC_DRAW);
        this.loc = [x,y,z];
        this.rot = [Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2];
        this.scale = [s,s,s];
        this.colliderRad = s;
    }
}

class Tree extends Mesh{
    constructor(x,y,z,s,h){
        super();
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.faces = [
            new Face(
                new Point(-0.5, -0.2,   0.5), 
                new Point( 0.4, -0.5,   0.5), 
                new Point( 0.5,  0.5,   0.7), 
                47, 50, 93
            ),
            new Face(
                new Point(-0.5,  0.5,  0.7), 
                new Point(-0.5, -0.2,  0.5), 
                new Point( 0.5,  0.5,  0.7), 
                57, 69, 109
            ),
            new Face(
                new Point(-0.5, -0.2,  0.5), 
                new Point(-0.2, -0.5, -0.5), 
                new Point(-0.5,  0.5,  0.7), 
                66, 88, 121
            ),
            new Face(
                new Point(-0.5,  0.7, -0.3), 
                new Point(-0.5,  0.5,  0.7), 
                new Point(-0.2, -0.5, -0.5), 
                73, 107, 131
            ),
            new Face(
                new Point( 0.5,  0.5,  0.7), 
                new Point(-0.5,  0.5,  0.7), 
                new Point(-0.5,  0.7, -0.3), 
                81, 125, 145
            ),
            new Face(
                new Point( 0.2,  0.2, -0.5), 
                new Point( 0.5,  0.5,  0.7), 
                new Point(-0.5,  0.7, -0.3), 
                82, 140, 159
            ),
            new Face(
                new Point(-0.2, -0.5, -0.5), 
                new Point( 0.4, -0.1, -0.7), 
                new Point( 0.2,  0.2, -0.5), 
                84, 162, 149
            ),
            new Face(
                new Point(-0.5,  0.7, -0.3), 
                new Point(-0.2, -0.5, -0.5), 
                new Point( 0.2,  0.2, -0.5), 
                112, 188, 147
            ),
            new Face(
                new Point( 0.4, -0.5,  0.5), 
                new Point( 0.4, -0.1, -0.7), 
                new Point( 0.5,  0.5,  0.7), 
                140, 213, 137
            ),
            new Face(
                new Point( 0.5,  0.5,  0.7), 
                new Point( 0.2,  0.2, -0.5), 
                new Point( 0.4, -0.1, -0.7), 
                183, 224, 151
            ),
            new Face(
                new Point( 0.4, -0.5,  0.5), 
                new Point(-0.5, -0.2,  0.5), 
                new Point(-0.2, -0.5, -0.5), 
                218, 239, 171
            ),
            new Face(
                new Point( 0.4, -0.1, -0.7), 
                new Point( 0.4, -0.5,  0.5), 
                new Point(-0.2, -0.5, -0.5), 
                241, 242, 182
            ),


            new Face(
                new Point( 0.3,  0.2,  0.3), 
                new Point(-0.3,  0.2,  0.3), 
                new Point(-0.3, -1.0,  0.3), 
                130, 70, 10
            ),
            new Face(
                new Point( 0.3, -1.0,  0.3), 
                new Point( 0.3,  0.2,  0.3), 
                new Point(-0.3, -1.0,  0.3), 
                130, 70, 10
            ),
            new Face(
                new Point( 0.3,  0.2, -0.3), 
                new Point(-0.3,  0.2, -0.3), 
                new Point(-0.3, -1.0, -0.3), 
                130, 70, 10
            ),
            new Face(
                new Point( 0.3, -1.0, -0.3), 
                new Point( 0.3,  0.2, -0.3), 
                new Point(-0.3, -1.0, -0.3), 
                130, 70, 10
            ),
            new Face(
                new Point( 0.3,  0.2, -0.3), 
                new Point( 0.3,  0.2,  0.3), 
                new Point( 0.3, -1.0, -0.3), 
                130, 70, 10
            ),
            new Face(
                new Point( 0.3,  0.2,  0.3), 
                new Point( 0.3, -1.0,  0.3), 
                new Point( 0.3, -1.0, -0.3), 
                130, 70, 10
            ),
            new Face(
                new Point(-0.3,  0.2, -0.3), 
                new Point(-0.3,  0.2,  0.3), 
                new Point(-0.3, -1.0, -0.3), 
                130, 70, 10
            ),
            new Face(
                new Point(-0.3,  0.2,  0.3), 
                new Point(-0.3, -1.0,  0.3), 
                new Point(-0.3, -1.0, -0.3), 
                130, 70, 10
            ),
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.facesToBuffer()), gl.STATIC_DRAW);
        this.loc = [x,y,z];
        this.rot = [0,Math.random()*Math.PI*2,0];
        this.scale = [s,h,s];
        this.colliderRad = s;
        if(this.colliderRad < 0.11){
            this.colliderRad = 0.11;
        }
    }
}

class Moon extends Mesh{
    constructor(x,y,z,s){
        super();
        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.faces = [
            new Face(
                new Point(-1, -1.4, -1), 
                new Point( 1, -1.4, -1), 
                new Point(-1, -1.4,  1), 
                255, 255, 200
            ),
            new Face(
                new Point( 1, -1.4, -1), 
                new Point( 1, -1.4,  1), 
                new Point(-1, -1.4,  1), 
                255, 255, 200
            ),
            new Face(
                new Point(-1,  1.4, -1), 
                new Point( 1,  1.4, -1), 
                new Point(-1,  1.4,  1), 
                255, 255, 200
            ),
            new Face(
                new Point( 1,  1.4, -1), 
                new Point( 1,  1.4,  1), 
                new Point(-1,  1.4,  1), 
                255, 255, 200
            ),

            new Face(
                new Point(-1, -1.4, -1), 
                new Point( 1, -1.4, -1), 
                new Point(-1,  1.4, -1), 
                255, 255, 200
            ),
            new Face(
                new Point( 1, -1.4, -1), 
                new Point( 1,  1.4, -1), 
                new Point(-1,  1.4, -1), 
                255, 255, 200
            ),
            new Face(
                new Point(-1, -1.4,  1), 
                new Point( 1, -1.4,  1), 
                new Point(-1,  1.4,  1), 
                255, 255, 200
            ),
            new Face(
                new Point( 1, -1.4,  1), 
                new Point( 1,  1.4,  1), 
                new Point(-1,  1.4,  1), 
                255, 255, 200
            ),
            
            new Face(
                new Point(-1, -1.4,  1), 
                new Point(-1, -1.4, -1), 
                new Point(-1,  1.4, -1), 
                255, 255, 200
            ),
            new Face(
                new Point(-1,  1.4,  1), 
                new Point(-1, -1.4,  1), 
                new Point(-1,  1.4, -1), 
                255, 255, 200
            ),
            new Face(
                new Point( 1, -1.4, -1), 
                new Point( 1, -1.4,  1), 
                new Point( 1,  1.4, -1), 
                255, 255, 200
            ),
            new Face(
                new Point( 1, -1.4,  1), 
                new Point( 1,  1.4,  1), 
                new Point( 1,  1.4, -1), 
                255, 255, 200
            ),
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.facesToBuffer()), gl.STATIC_DRAW);
        this.scale = [s,s,s];
        this.loc = [x,y,z];
    }
}