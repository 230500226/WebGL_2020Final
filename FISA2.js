const canvas = document.querySelector(`canvas`);
const webgl = canvas.getContext(`webgl`);
if (!webgl) { throw new Error("WebGL not found or supported"); }
webgl.clearColor(0.0, 1.0, 0.25, 1.0); //r,g,b,a values
webgl.clear(webgl.COLOR_BUFFER_BIT);
webgl.enable(webgl.DEPTH_TEST);



const r = 0.20;
const values = [

    //---First triangle
   -r, r, r,
   -r, -r, r,
    r, -r, r,

    r, r, r,
   -r, r, r,
    r, -r, r,//-------1 FRONT FACE

    //---Second triangle
    r, r, r,
    r, -r, r,
    r, r, -r,

    r, -r, r,
    r, r, -r,
    r, -r, -r,//-------2 RIGHT FACE

    //---third triangle
    -r, r, -r,
    -r, -r, -r,
    r, -r, -r,

    r, r, -r,
    -r, r, -r,
    r, -r, -r,//-------3 BACK FACE


    //---4th triangle
    -r, r, r,
    -r, -r, r,
    -r, r, -r,

    -r, -r, r,
    -r, r, -r,
    -r, -r, -r,//-------4 LEFT FACE

    //---5th triangle
    -r, -r, r,
     r, -r, r,
    -r, -r, -r,

    -r, -r, -r,
     r, -r, -r,
     r, -r,  r,//-------5 BOTTOM FACE

    //---6th triangle
    -r, r, r,
     r, r, r,
    -r, r, -r,

    -r, r, -r,
     r, r, -r,
     r, r, r,//------- 6 TOP FACE






];


const vertices = new Float32Array(values);

var vertColors = [

    //-1TH BOX
    1.0, 0.0, 0.0, 1.0,// red
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    1.0, 0.0, 0.0, 1.0,// red
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    //---------------second box----------------------------

    0.0, 1.0, 0.0, 1.0,// green
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,

    0.0, 1.0, 0.0, 1.0,// green
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    //-----------------3rd box-----------------------------

    0.0, 0.0, 0.5, 1.0,// blue
    0.0, 0.0, 0.5, 1.0,
    0.0, 0.0, 0.5, 1.0,

    0.0, 0.0, 0.5, 1.0,// blue
    0.0, 0.0, 0.5, 1.0,
    0.0, 0.0, 0.5, 1.0,

    //--------------------4th box---------------------------

    1.0, 1.0, 0.0, 1.0,// 
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,

    1.0, 1.0, 0.0, 1.0,// 
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,

    //---------------------5th box-------------------------

    1.0, 0.5, 1.0, 1.0,// 
    1.0, 0.5, 1.0, 1.0,
    1.0, 0.5, 1.0, 1.0,

    1.0, 0.5, 1.0, 1.0,// 
    1.0, 0.5, 1.0, 1.0,
    1.0, 0.5, 1.0, 1.0,

    //-------------------6th box-----------------------------

    0.5, 0.5, 1.0, 0.5,// 
    0.5, 0.5, 1.0, 0.5,
    0.5, 0.5, 1.0, 0.5,

    0.5, 0.5, 1.0, 0.5,// 
    0.5, 0.5, 1.0, 0.5,
    0.5, 0.5, 1.0, 0.5


];


const colors = new Float32Array(vertColors)




const buffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
webgl.bufferData(webgl.ARRAY_BUFFER, vertices, webgl.STATIC_DRAW);

let modelA = createMatrice4();
let view = createMatrice4();
let projection = createMatrice4();


perspective(projection, 75 * Math.PI/180,  canvas.width/canvas.height, 0.1,  10000 );  

const vertexShader = webgl.createShader(webgl.VERTEX_SHADER);
webgl.shaderSource(vertexShader,
    `attribute vec3 pos;
     attribute vec4 colors;
     varying vec4 vcolors;
     uniform mat4 model;
     uniform mat4 proj;
     uniform mat4 view;
   
     void main () {

     gl_Position = proj*view*model*vec4(pos,1);

     vcolors = colors;}`);
webgl.compileShader(vertexShader);

if (!webgl.getShaderParameter(vertexShader, webgl.COMPILE_STATUS)) {
    console.error("Error compiling vertex shader", webgl.getShaderInfoLog(vertexShader));
}//Check for errors in your vertex shader

 //place the camera at a position in x,y and z
 translator(view, view, [0, 0, 1]);
 invert(view, view);


const fragmentShader = webgl.createShader(webgl.FRAGMENT_SHADER);
webgl.shaderSource(fragmentShader,
    `precision mediump float;
     varying vec4 vcolors;
     void main() { gl_FragColor = vcolors;}`);
webgl.compileShader(fragmentShader);

const program = webgl.createProgram();
webgl.attachShader(program, vertexShader);
webgl.attachShader(program, fragmentShader);
webgl.linkProgram(program);
webgl.enable(webgl.DEPTH_TEST);//

const positionLocation = webgl.getAttribLocation(program, `pos`);
console.log(positionLocation);
webgl.enableVertexAttribArray(positionLocation);
webgl.vertexAttribPointer(positionLocation, 3, webgl.FLOAT, false, 0, 0);


//------------At this point,to manipulate the colors you need to alterate the fragment 
//-----------shader but before that you need a new buffer, etc

const colorBuffer = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, colorBuffer);
webgl.bufferData(webgl.ARRAY_BUFFER, colors, webgl.STATIC_DRAW);

const colorsLocation = webgl.getAttribLocation(program, `colors`);
console.log(colorsLocation);
webgl.enableVertexAttribArray(colorsLocation);
webgl.vertexAttribPointer(colorsLocation, 4, webgl.FLOAT, false, 0, 0);


webgl.useProgram(program);

//----Initialization of variables------------
let xs = 0.0;
let ys = 0.0;
let zs = 0.0;
let xs2 = -0.65;
let ys2 =  0.0;
let zs2 =  0.0;
let angleX = 0.0;
let angleY = 0.0;
let angleZ = 0.0;
let go = true;
  

let k = -1;
let chXsFactor = 0.01;
let chYsFactor = 0.004;

draw();

document.onkeydown = function (event) {

    switch (event.key) {
        
        case 's':          

            k *= -1;
            
            console.log("You pressed s key, and your ys position is " + xs);
            break;

        case 'ArrowRight':
            xs += 0.01;
            console.log("You pressed down key, and your ys position is " + xs);
            break;

        case 'ArrowUp':
            ys = ys + 0.01;
            console.log("You pressed arrow up, and your ys position is " + ys);
            break;

        case 'ArrowDown':
            ys = ys - 0.01;
            console.log("You pressed down key, and your ys position is " + ys);
            break;

        case 'ArrowLeft':
            xs = xs - 0.01;
            console.log("You pressed down key, and your ys position is " + xs);
            break;

        case 'x':
            angleX += Math.PI / 8;
            console.log("You pressed x rotation " + xs);
            break;
    
        case 'y':
            angleY += Math.PI / 8;  
            console.log("You pressed y rotation " + xs);
                break;
        case 'z':
            angleZ += Math.PI / 8;  
            console.log("You pressed z rotation " + xs);
            break;


    }
}


function createMatrice4() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);

}




function draw() {
    

    if (k == 1) {
            
        xs += chXsFactor;
        ys += chYsFactor;

        if (xs>=0.74 ||  ys>=0.74  && go)
        {   
           
            chXsFactor = -1*chXsFactor;
            xs += chXsFactor;
            chYsFactor = -1*chYsFactor;
            go = false;
            console.log("Change direction");
        } 
        
        else if (xs<=-0.74 || ys<=-0.74  && go )
        {   
            chXsFactor = -1*chXsFactor;
            xs += chXsFactor;
            
    

            console.log("Change direction");
        }
        
        


        modelA = matrixMultiplication(modelA, modelA, translate(xs, ys, zs));
        
      
    }

    webgl.clear(webgl.COLOR_BUFFER_BIT);
    
   
    
    modelA = matrixMultiplication(createMatrice4(), createMatrice4(), Xrotation(angleX));
    modelA = matrixMultiplication(createMatrice4(), modelA, Yrotation(angleY));
    modelA = matrixMultiplication(createMatrice4(), modelA, Zrotation(angleZ));
    modelA = matrixMultiplication(modelA, modelA, translate(xs, ys, zs));

    webgl.uniformMatrix4fv(webgl.getUniformLocation(program, `model`), false, modelA);
    webgl.uniformMatrix4fv(webgl.getUniformLocation(program, `proj`), false, projection);
    webgl.uniformMatrix4fv(webgl.getUniformLocation(program, `view`), false, view);
    webgl.drawArrays(webgl.TRIANGLES, 0, (vertices.length) / 3);

    
   
    window.requestAnimationFrame(draw);


}

function Yrotation(angleInRadians) {

    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return new Float32Array([
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1


    ]);

}//End of rotation in Y axis

function Xrotation(angleInRadians) {

    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return new Float32Array([
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1

    ]);

}//End of rotation in X axis

function Zrotation(angleInRadians) {

    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);
    return new Float32Array([
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1

    ]);

}//End of rotation in X axis

function translate(tx, ty, tz) {

    return new Float32Array([

        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1

    ]);

}//End of translation matrix

function matrixMultiplication(output, model, transformationMatrix) {


    output[0] = model[0] * transformationMatrix[0] + model[1] * transformationMatrix[4] + model[2] * transformationMatrix[8] + model[3] * transformationMatrix[12];//1000

    output[1] = model[0] * transformationMatrix[1] + model[1] * transformationMatrix[5] + model[2] * transformationMatrix[9] + model[3] * transformationMatrix[13];//0100

    output[2] = model[0] * transformationMatrix[2] + model[1] * transformationMatrix[6] + model[2] * transformationMatrix[10] + model[3] * transformationMatrix[14];//0010

    output[3] = model[0] * transformationMatrix[3] + model[1] * transformationMatrix[7] + model[2] * transformationMatrix[11] + model[3] * transformationMatrix[15];//0001


    output[4] = model[4] * transformationMatrix[0] + model[5] * transformationMatrix[4] + model[6] * transformationMatrix[8] + model[7] * transformationMatrix[12];//1000

    output[5] = model[4] * transformationMatrix[1] + model[5] * transformationMatrix[5] + model[6] * transformationMatrix[9] + model[7] * transformationMatrix[13];//0100

    output[6] = model[6] * transformationMatrix[2] + model[5] * transformationMatrix[6] + model[6] * transformationMatrix[10] + model[7] * transformationMatrix[14];//0010

    output[7] = model[4] * transformationMatrix[3] + model[5] * transformationMatrix[7] + model[6] * transformationMatrix[11] + model[7] * transformationMatrix[15];//0001


    output[8] = model[8] * transformationMatrix[0] + model[9] * transformationMatrix[4] + model[10] * transformationMatrix[8] + model[11] * transformationMatrix[12];//1000

    output[9] = model[8] * transformationMatrix[1] + model[9] * transformationMatrix[5] + model[10] * transformationMatrix[9] + model[11] * transformationMatrix[13];//0100

    output[10] = model[8] * transformationMatrix[2] + model[9] * transformationMatrix[6] + model[10] * transformationMatrix[10] + model[11] * transformationMatrix[14];//0010

    output[11] = model[8] * transformationMatrix[3] + model[9] * transformationMatrix[7] + model[10] * transformationMatrix[11] + model[11] * transformationMatrix[15];//0001

    output[12] = model[12] * transformationMatrix[0] + model[13] * transformationMatrix[4] + model[14] * transformationMatrix[8] + model[15] * transformationMatrix[12];//1000

    output[13] = model[12] * transformationMatrix[1] + model[13] * transformationMatrix[5] + model[14] * transformationMatrix[9] + model[15] * transformationMatrix[13];//0100

    output[14] = model[12] * transformationMatrix[2] + model[13] * transformationMatrix[6] + model[14] * transformationMatrix[10] + model[15] * transformationMatrix[14];//0010

    output[15] = model[12] * transformationMatrix[3] + model[13] * transformationMatrix[7] + model[14] * transformationMatrix[11] + model[15] * transformationMatrix[15];//0001

    return output;

}//End of mult matrix

function rotation(axis, angle) {

    if (axis == 'x') {
        return Xrotation(angle);
    }
    else if (axis == 'y') {
        return Yrotation(angle);
    }
    else if (axis == 'z') {
        return Zrotation(angle);
    }

}


function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }

    return out;
  }//End of perspective
  
  function invert(out, a) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }//End of invert
  
   function translator(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;

    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
  }//End of translator



