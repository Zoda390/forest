class PointLight extends Mesh{
    constructor(p, r, g, b, intensity, falloff){
        super();
        this.p = p;
        this.color = [r/255,g/255,b/255];
        this.intensity = intensity;
        this.falloff = falloff;

        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.faces = [
            new Face(
                new Point( 0.0,  0.05, 0.0), 
                new Point(-0.05,  0.0, 0.0), 
                new Point( 0.05,  0.0, 0.0), 
                255, 255, 0
            ),
            new Face(
                new Point( 0.0, -0.05, 0.0), 
                new Point( 0.05,  0.0, 0.0), 
                new Point(-0.05,  0.0, 0.0), 
                255, 255, 0
            ),
            new Face(
                new Point( 0.0,  0.0,  -0.05), 
                new Point( 0.0,  0.05,  0.00), 
                new Point( 0.0,  0.0,   0.05), 
                255, 255, 0
            ),
            new Face(
                new Point( 0.0,  0.0,   0.05), 
                new Point( 0.0, -0.05,  0.00), 
                new Point( 0.0,  0.0,  -0.05), 
                255, 255, 0
            ),
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.facesToBuffer()), gl.STATIC_DRAW);
        this.speed = 3;
    }

    update(deltaTime){
        this.p.loc[0] += this.speed*deltaTime*((Math.random()*2)-1);
        this.p.loc[1] += Math.sin(Date.now()/1000)/100;
        if(this.p.loc[1] < -0.8){
            this.p.loc[1] = -0.8;
        }
        if(this.p.loc[1] > 2){
            this.p.loc[1] = 2;
        }
        this.p.loc[2] += this.speed*deltaTime*((Math.random()*2)-1);
        this.loc = this.p.loc;
    }

    toBuffer(){
        return [[this.p.loc[0], this.p.loc[1], this.p.loc[2], this.intensity], [this.color[0], this.color[1], this.color[2], this.falloff]];
    }
}

class SpotLight extends Mesh{
    constructor(p, dir, r, g, b, angle){
        super();
        this.p = p;
        this.dir = dir;
        this.color = [r/255,g/255,b/255];
        this.angle = -1*(((angle/180)*2)-1);
        if(this.angle < -1){
            this.angle = -1;
        }
        if(this.angle > 1){
            this.angle = 1;
        }
        this.speed = 5;

        this.buffer=gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.faces = [
            //eye
            new Face(
                new Point(-0.25,  0, -0.25), 
                new Point( 0.25,  0, -0.25), 
                new Point(-0.25,  0,  0.25), 
                255, 0, 0
            ),
            new Face(
                new Point( 0.25,  0, -0.25), 
                new Point( 0.25,  0,  0.25), 
                new Point(-0.25,  0,  0.25), 
                255, 0, 0
            ),
            new Face(
                new Point( 0.00,  -0.01, 0.25), 
                new Point(-0.15,  -0.01, 0.00), 
                new Point( 0.15,  -0.01, 0.00), 
                255, 255, 255
            ),
            new Face(
                new Point(-0.15,  -0.01, 0.00), 
                new Point( 0.00,  -0.01, -0.25), 
                new Point( 0.15,  -0.01, 0.00), 
                255, 255, 255
            ),
            new Face(
                new Point( 0.00,  -0.02, 0.15), 
                new Point(-0.05,  -0.02, 0.00), 
                new Point( 0.05,  -0.02, 0.00), 
                50, 0, 50
            ),
            new Face(
                new Point(-0.05,  -0.02, 0.00), 
                new Point( 0.00,  -0.02, -0.15), 
                new Point( 0.05,  -0.02, 0.00), 
                50, 0, 50
            ),

            //body
            new Face(
                new Point(-0.55,  0.01, -0.55), 
                new Point( 0.55,  0.01, -0.55), 
                new Point(-0.55,  0.01,  0.55), 
                0, 0, 0
            ),
            new Face(
                new Point( 0.55,  0.01, -0.55), 
                new Point( 0.55,  0.01,  0.55), 
                new Point(-0.55,  0.01,  0.55), 
                0, 0, 0
            ),
            new Face(
                new Point(-0.55,  0.05, -0.55), 
                new Point( 0.55,  0.05, -0.55), 
                new Point(-0.55,  0.05,  0.55), 
                0, 0, 0
            ),
            new Face(
                new Point( 0.55,  0.05, -0.55), 
                new Point( 0.55,  0.05,  0.55), 
                new Point(-0.55,  0.05,  0.55), 
                0, 0, 0
            ),

            //wing1
            new Face(
                new Point(-0.75,  0.07, -0.275), 
                new Point(-0.50,  0.05, -0.275), 
                new Point(-0.75,  0.07,  0.275), 
                20, 20, 20
            ),
            new Face(
                new Point(-0.50,  0.05, -0.275), 
                new Point(-0.50,  0.05,  0.275), 
                new Point(-0.75,  0.07,  0.275), 
                20, 20, 20
            ),
            new Face(
                new Point(-1.00,  0.05, -0.21), 
                new Point(-0.75,  0.07, -0.21), 
                new Point(-1.00,  0.05,  0.21), 
                20, 20, 20
            ),
            new Face(
                new Point(-0.75,  0.07, -0.21), 
                new Point(-0.75,  0.07,  0.21), 
                new Point(-1.00,  0.05,  0.21), 
                20, 20, 20
            ),

            //wing2
            new Face(
                new Point( 0.50,  0.05, -0.275), 
                new Point( 0.75,  0.07, -0.275), 
                new Point( 0.75,  0.07,  0.275), 
                20, 20, 20
            ),
            new Face(
                new Point( 0.50,  0.05,  0.275), 
                new Point( 0.50,  0.05, -0.275), 
                new Point( 0.75,  0.07,  0.275), 
                20, 20, 20
            ),
            new Face(
                new Point(0.75,  0.07, -0.21), 
                new Point(1.00,  0.05, -0.21), 
                new Point(1.00,  0.05,  0.21), 
                20, 20, 20
            ),
            new Face(
                new Point(0.75,  0.07,  0.21), 
                new Point(0.75,  0.07, -0.21), 
                new Point(1.00,  0.05,  0.21), 
                20, 20, 20
            )
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.facesToBuffer()), gl.STATIC_DRAW);
    }

    update(deltaTime){
        this.p.loc[0] += this.speed*deltaTime*((Math.random()*2)-1);
        this.p.loc[2] += this.speed*deltaTime*((Math.random()*2)-1);
        this.loc = this.p.loc;
        /*
        this.p.loc = m.cam.loc;
        this.dir.loc[0] = m.cam.forward[0];
        this.dir.loc[2] = m.cam.forward[1];
        */
    }

    toBuffer(){
        return [[this.p.loc[0], this.p.loc[1], this.p.loc[2]], [this.color[0], this.color[1], this.color[2]], [this.dir.loc[0], this.dir.loc[1], this.dir.loc[2], this.angle]];
    }
}