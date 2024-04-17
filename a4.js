import { Mat4 } from './math.js';
import { Parser } from './parser.js';
import { Scene } from './scene.js';
import { Renderer } from './renderer.js';
import { TriangleMesh } from './trianglemesh.js';
// DO NOT CHANGE ANYTHING ABOVE HERE

////////////////////////////////////////////////////////////////////////////////
// TODO: Implement createCube, createSphere, computeTransformation, and shaders
////////////////////////////////////////////////////////////////////////////////

// Example two triangle quad
const quad = {
  positions: [-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1,  1, -1, -1,  1, -1],
  normals: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  uvCoords: [0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]
}

TriangleMesh.prototype.createCube = function() {
  //   TODO: populate unit cube vertex positions, normals, and uv coordinates
  //   this.positions = quad.positions;
  //   this.normals = quad.normals;
  //   this.uvCoords = quad.uvCoords;
  this.positions = [ // each face has two traingles -> each has three vertices
    // Front face
    -1, -1,  1,   1, -1,  1,   1,  1,  1,/*triangle1*/   -1,  1,  1,   1,  1,  1,  -1, -1,  1,/*triangle2*/ 
    // Back face
    -1, -1, -1,  -1,  1, -1,   1,  1, -1,   1, -1, -1,  -1,  1, -1,  -1, -1, -1,
    // Top face
    -1,  1, -1,  -1,  1,  1,   1,  1,  1,   1,  1, -1,  -1,  1,  1,  -1,  1, -1,
    // Bottom face
    -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1,   1, -1,  1,  -1, -1, -1,
    // Right face
     1, -1, -1,   1,  1, -1,   1,  1,  1,   1, -1,  1,   1,  1,  1,   1, -1, -1,
    // Left face
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1
  ];
  this.normals = [ // vertices on a same face have same normal vectorsf
    // Front face
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
    // Back face
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    // Top face
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
    // Bottom face
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
    // Right face
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
    // Left face
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
  ];
  this.uvCoords = [
    // each face maps UVs from (0,0) to (1,1)
    // 0,0: bottom-left, 1,0: bottom-right, 1,1: top-right, 0,1: top-left
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1,
    0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1
  ];
  // No indices, triangle soup
};


TriangleMesh.prototype.createSphere = function(numStacks, numSectors) {
  // TODO: populate unit sphere vertex positions, normals, uv coordinates, and indices
  // this.positions = quad.positions.slice(0, 9).map(p => p * 0.5);
  // this.normals = quad.normals.slice(0, 9);
  // this.uvCoords = quad.uvCoords.slice(0, 6);
  // this.indices = [0, 1, 2];
  const radius = 1; // Unit sphere
  let vertices = [];
  let normals = [];
  let uvCoords = [];

  const PI = Math.PI;
  const sectorStep = 2 * PI / numSectors;
  const stackStep = PI / numStacks;

  for (let i = 0; i <= numStacks; ++i) {
      const stackAngle = PI / 2 - i * stackStep; // stack angle from PI/2 to -PI/2
      const xy = radius * Math.cos(stackAngle);  // r * cos(u)
      const z = radius * Math.sin(stackAngle);   // r * sin(u)

      for (let j = 0; j <= numSectors; ++j) {
          const sectorAngle = j * sectorStep;   // sector angle from 0 to 2pi

          // Vertex position (x, y, z)
          const x = xy * Math.cos(sectorAngle);  // r * cos(u) * cos(v)
          const y = xy * Math.sin(sectorAngle);  // r * cos(u) * sin(v)
          vertices.push(x);
          vertices.push(y);
          vertices.push(z);

          // Normalized vertex normal (nx, ny, nz)
          const nx = x / radius; // Since x^2 + y^2 + z^2 = r^2, nx = x / r
          const ny = y / radius;
          const nz = z / radius;
          normals.push(nx);
          normals.push(ny);
          normals.push(nz);

          // Vertex tex coord (s, t) range between [0, 1]
          const s = j / numSectors;
          const t = i / numStacks;
          uvCoords.push(s);
          uvCoords.push(t);
      }
  }

  // Populate the mesh's properties
  this.positions = vertices;
  this.normals = normals;
  this.uvCoords = uvCoords;
}

// Scene.prototype.computeTransformation = function(transformSequence) {
//   // TODO: go through transform sequence and compose into overallTransform
//   let overallTransform = Mat4.create();  // identity matrix
//   return overallTransform;
// }
// Assuming 'Mat4' is a part of a matrix library you're using
// The 'Mat4.create()' function initializes a new 4x4 identity matrix

// Let's assume we also have Mat4.translate(), Mat4.rotate() and Mat4.scale() which modifies the matrix

function rad(degrees) {
  return degrees * Math.PI / 180;
}

Scene.prototype.computeTransformation = function(transformSequence) {
  let overallTransform = Mat4.create();  // Initialize with the identity matrix

  transformSequence.forEach(transformation => {
      switch (transformation.type) {
          case 'translate':
              // Assuming translation values are provided as [x, y, z]
              Mat4.translate(overallTransform, overallTransform, transformation.values);
              break;
          case 'rotate':
              // Assuming rotation value is provided as [angle, x, y, z] where angle is in degrees
              // Convert angle from degrees to radians
              transformation.values[0] = rad(transformation.values[0]);
              Mat4.rotate(overallTransform, overallTransform, transformation.values[0], transformation.values.slice(1));
              break;
          case 'scale':
              // Assuming scale values are provided as [x, y, z]
              Mat4.scale(overallTransform, overallTransform, transformation.values);
              break;
          default:
              console.error("Unknown transformation type");
      }
  });

  return overallTransform;
}


Renderer.prototype.VERTEX_SHADER = `
precision mediump float;
attribute vec3 position, normal;
attribute vec2 uvCoord;
uniform vec3 lightPosition;
uniform mat4 projectionMatrix, viewMatrix, modelMatrix;
uniform mat3 normalMatrix;
varying vec2 vTexCoord;

// TODO: implement vertex shader logic below

varying vec3 temp;

void main() {
  temp = vec3(position.x, normal.x, uvCoord.x);
  vTexCoord = uvCoord;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

Renderer.prototype.FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 ka, kd, ks, lightIntensity;
uniform float shininess;
uniform sampler2D uTexture;
uniform bool hasTexture;
varying vec2 vTexCoord;

// TODO: implement fragment shader logic below

varying vec3 temp;

void main() {
  gl_FragColor = vec4(temp, 1.0);
}
`;

////////////////////////////////////////////////////////////////////////////////
// EXTRA CREDIT: change DEF_INPUT to create something interesting!
////////////////////////////////////////////////////////////////////////////////
const DEF_INPUT = [
  "c,myCamera,perspective,5,5,5,0,0,0,0,1,0;",
  "l,myLight,point,0,5,0,2,2,2;",
  "p,unitCube,cube;",
  "p,unitSphere,sphere,20,20;",
  "m,redDiceMat,0.3,0,0,0.7,0,0,1,1,1,15,dice.jpg;",
  "m,grnDiceMat,0,0.3,0,0,0.7,0,1,1,1,15,dice.jpg;",
  "m,bluDiceMat,0,0,0.3,0,0,0.7,1,1,1,15,dice.jpg;",
  "m,globeMat,0.3,0.3,0.3,0.7,0.7,0.7,1,1,1,5,globe.jpg;",
  "o,rd,unitCube,redDiceMat;",
  "o,gd,unitCube,grnDiceMat;",
  "o,bd,unitCube,bluDiceMat;",
  "o,gl,unitSphere,globeMat;",
  "X,rd,Rz,75;X,rd,Rx,90;X,rd,S,0.5,0.5,0.5;X,rd,T,-1,0,2;",
  "X,gd,Ry,45;X,gd,S,0.5,0.5,0.5;X,gd,T,2,0,2;",
  "X,bd,S,0.5,0.5,0.5;X,bd,Rx,90;X,bd,T,2,0,-1;",
  "X,gl,S,1.5,1.5,1.5;X,gl,Rx,90;X,gl,Ry,-150;X,gl,T,0,1.5,0;",
].join("\n");

// DO NOT CHANGE ANYTHING BELOW HERE
export { Parser, Scene, Renderer, DEF_INPUT };
