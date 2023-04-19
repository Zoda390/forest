var gl;
var program;
var m;

function setupMain(){
    m = new Main();

    document.onkeydown = (e) => {
        let key = String.fromCharCode(e.keyCode);
        m.cam.keys[key] = true;
    };

    document.onkeyup = (e) => {
        let key = String.fromCharCode(e.keyCode);
        m.cam.keys[key] = false;
    };
}

class Main{
    constructor(){
        this.canvas = document.getElementById("myCanvas");
        gl = this.canvas.getContext("webgl");

        this.glInit = new InitWebGLProgram();
        let vertSource = document.getElementById("2dVertexShader").text;
        let fragSource = document.getElementById("2dFragmentShader").text;

        let vertShader = this.glInit.createShader(gl.VERTEX_SHADER, vertSource);
        let fragShader = this.glInit.createShader(gl.FRAGMENT_SHADER, fragSource);

        if(vertShader == undefined){
            console.error("vert is non-gay");
            return;
        }

        if(fragShader == undefined){
            console.error("frag is non-gay");
            return;
        }
        program = this.glInit.createProgram(vertShader, fragShader);


        this.cam = new Camera(this.canvas.width, this.canvas.height);

        this.floor = new Plane(-0.9,20);
        this.decorations = []; //rocks and trees
        for(let i = 0; i < 100; i++){
            if(Math.random()>0.5){
                let x = (Math.random()*40)-20;
                let z = (Math.random()*40)-20;
                let h = (Math.random()*2)+0.5;
                while(!this.safePositionCheck([x,z]) || (Math.abs(x-this.cam.loc[0]) < h*1.1 && Math.abs(x-this.cam.loc[2]) < h*1.1)){
                    x = (Math.random()*40)-20;
                    z = (Math.random()*40)-20;
                    h = (Math.random()*2)+0.5;
                }
                this.decorations.push(new Tree(x, h-0.9, z, Math.random()+0.1, h))
            }
            else{
                let x = (Math.random()*40)-20;
                let z = (Math.random()*40)-20;
                let s = (Math.random()*1)+0.1;
                while(!this.safePositionCheck([x,z]) || (Math.abs(x-this.cam.loc[0]) < s*1.1 && Math.abs(x-this.cam.loc[2]) < s*1.1)){
                    x = (Math.random()*40)-20;
                    z = (Math.random()*40)-20;
                    s = (Math.random()*2)+0.5;
                }
                this.decorations.push(new Rock(x, -0.9+(s/3), z, s));
            }
        }
        this.decorations.push(new Moon(20*5,5*5,20*5,5))

        this.pointLights = [];
        this.pointLights.push(
            new PointLight(
                new Point(this.cam.loc[0], 0.0, this.cam.loc[2]),
                0, 255, 255,
                0.5, 50
            )
        )
        for(let i = 0; i < 5; i++){
            this.pointLights.push(
                new PointLight(
                    new Point((Math.random()*40)-20, 0.0, (Math.random()*40)-20),
                    255, 255, 0,
                    0.7, 50
                )
            )
        }
        this.spotLights = [];
        for(let i = 0; i < 1; i++){
            this.spotLights.push(
                new SpotLight(
                    new Point(0.0,  1.0, 10.0),
                    new Point(0.0, -1.0, 0.0),
                    255, 0, 0, 16
                )
            )
        }

        this.prevTime = 0;
        requestAnimationFrame(this.main);
    }

    updateAll(deltaTime){
        for(var i in this.pointLights){
            this.pointLights[i].update(deltaTime);
        }
        for(var i in this.spotLights){
            this.spotLights[i].update(deltaTime);
        }

        this.cam.update(deltaTime);
        this.pointLights[0].p.loc[0] = m.cam.loc[0];
        this.pointLights[0].p.loc[1] = m.cam.loc[1];
        this.pointLights[0].p.loc[2] = m.cam.loc[2];
        this.pointLights[0].loc = this.pointLights[0].p.loc;

        if(Math.abs(this.cam.loc[0] - this.spotLights[0].loc[0]) < (1) && Math.abs(this.cam.loc[2] - this.spotLights[0].loc[2]) < (1)){
            this.cam.loc = [0,-0.5,0];
        }
    }

    renderAll(){
        gl.useProgram(program);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.floor.render(2);
        for(var i in this.decorations){
            this.decorations[i].render();
        }
        let location;
        for(var i in this.pointLights){
            location = gl.getUniformLocation(program, "pointLightsXYZI["+i+"]");
            gl.uniform4fv(location, new Float32Array(this.pointLights[i].toBuffer()[0]));
            location = gl.getUniformLocation(program, "pointLightsRGBF["+i+"]");
            gl.uniform4fv(location, new Float32Array(this.pointLights[i].toBuffer()[1]));
            this.pointLights[i].render();
        }
        for(var i in this.spotLights){
            location = gl.getUniformLocation(program, "spotLightsXYZ["+i+"]");
            gl.uniform3fv(location, new Float32Array(this.spotLights[i].toBuffer()[0]));
            location = gl.getUniformLocation(program, "spotLightsRGB["+i+"]");
            gl.uniform3fv(location, new Float32Array(this.spotLights[i].toBuffer()[1]));
            location = gl.getUniformLocation(program, "spotLightsDirA["+i+"]");
            gl.uniform4fv(location, new Float32Array(this.spotLights[i].toBuffer()[2]));
            this.spotLights[i].render();
        }
        
        this.cam.render();
    }

    main(time){
        var deltaTime = (time-m.prevTime)/1000;

        m.prevTime=time;

        m.updateAll(deltaTime);
        m.renderAll();

        requestAnimationFrame(m.main);
    }

    safePositionCheck(tempLoc){
        for(var i in this.decorations){
            if(Math.abs(tempLoc[0]-this.decorations[i].loc[0]) < this.decorations[i].colliderRad && Math.abs(tempLoc[1]-this.decorations[i].loc[2]) < this.decorations[i].colliderRad){
                return false;
            }
        }
        return true;
    }
}

class Camera{
    constructor(w,h){
        this.loc = [0,-0.5,0];
        this.rot = [0,0,0];
        this.forward = [0,1];
        this.near = 0.09;
        this.far = 500;
        this.aspect = h/w;
        this.fov = Math.PI/2;

        this.rotSpeed = Math.PI/2;
        this.locSpeed = 2;

        this.keys = {};
    }

    rotateForward(angle){
        let cs = Math.cos(angle);
        let sn = Math.sin(angle);

        let tempForward = [this.forward[0] * cs - this.forward[1] * sn, this.forward[0] * sn + this.forward[1] * cs];
        this.forward = tempForward;
    }

    update(deltaTime){
        if(this.keys["%"]){ //rotate left
            this.rot[1] -= this.rotSpeed*deltaTime;
            if(this.rot[1]<-Math.PI){
                this.rot[1]=Math.PI;
            }
            this.rotateForward(this.rotSpeed*deltaTime);
        }
        if(this.keys["'"]){ //rotate right
            this.rot[1] += this.rotSpeed*deltaTime;
            if(this.rot[1]>Math.PI){
                this.rot[1]=-Math.PI;
            }
            this.rotateForward(-this.rotSpeed*deltaTime);
        }

        if(this.keys["W"]){ //move forward
            let tempLoc = [0,0];
            tempLoc[0] = this.loc[0] + this.forward[0]*this.locSpeed*deltaTime;
            tempLoc[1] = this.loc[2] + this.forward[1]*this.locSpeed*deltaTime;
            if(!m.safePositionCheck(tempLoc)){
                return;
            }
            this.loc[0] = tempLoc[0];
            this.loc[2] = tempLoc[1];
        }
        if(this.keys["S"]){ //move back
            let tempLoc = [0,0];
            tempLoc[0] = this.loc[0] - this.forward[0]*this.locSpeed*deltaTime;
            tempLoc[1] = this.loc[2] - this.forward[1]*this.locSpeed*deltaTime;
            if(!m.safePositionCheck(tempLoc)){
                return;
            }
            this.loc[0] = tempLoc[0];
            this.loc[2] = tempLoc[1];
        }
        if(this.keys["A"]){ //move left
            let tempLoc = [0,0];
            tempLoc[0] = this.loc[0] + -this.forward[1]*this.locSpeed*deltaTime;
            tempLoc[1] = this.loc[2] + this.forward[0]*this.locSpeed*deltaTime;
            if(!m.safePositionCheck(tempLoc)){
                return;
            }
            this.loc[0] = tempLoc[0];
            this.loc[2] = tempLoc[1];
        }
        if(this.keys["D"]){ //move right
            let tempLoc = [0,0];
            tempLoc[0] = this.loc[0] - -this.forward[1]*this.locSpeed*deltaTime;
            tempLoc[1] = this.loc[2] - this.forward[0]*this.locSpeed*deltaTime;
            if(!m.safePositionCheck(tempLoc)){
                return;
            }
            this.loc[0] = tempLoc[0];
            this.loc[2] = tempLoc[1];
        }
    }

    render(){
        let locPosition = gl.getUniformLocation(program, "cameraLoc");
        gl.uniform3fv(locPosition,new Float32Array(this.loc));
        let rotPosition = gl.getUniformLocation(program, "cameraRotation");
        gl.uniform3fv(rotPosition,new Float32Array(this.rot));
        let nearPosition = gl.getUniformLocation(program, "near");
        gl.uniform1f(nearPosition, this.near);
        let farPosition = gl.getUniformLocation(program, "far");
        gl.uniform1f(farPosition, this.far);
        let aspectPosition = gl.getUniformLocation(program, "aspect");
        gl.uniform1f(aspectPosition, this.aspect);
        let fovPosition = gl.getUniformLocation(program, "fov");
        gl.uniform1f(fovPosition, this.fov);
    }
}