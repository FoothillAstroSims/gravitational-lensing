const G = 6.67408 / Math.pow(10, 11);
const LIGHT_SPEED = 2.99792458 * Math.pow(10, 8);
// const PARSECS = 3.086 * Math.pow(10, 16);
const LIGHT_YRS = 9.461 * Math.pow(10, 15);
const ARCSEC_PER_RADIAN = 2.0626494196924 * Math.pow(10, 5);
const SUN_MASS = 1.989 * Math.pow(10, 30);


// Example 1
// model parameters
// source is far to one side of the source

// these will be the sliders in the model 
// let clusterMass = Math.pow(10, 12);
// let clusterDist = 5 * Math.pow(10, 8);
// let sourceDist = Math.pow(10, 9);
// let offset = 15000;
// // let beta = 30.0;  // angle between cluster and source in arcseconds

// let beta = Math.atan2(offset, sourceDist) * ARCSEC_PER_RADIAN;
// console.log('source offset angle', beta);


// // calculations 
// let angle = beta / ARCSEC_PER_RADIAN;
// let omega = (4 * G * clusterMass * SUN_MASS) / Math.pow(LIGHT_SPEED, 2);

// let rad_term = Math.pow((Math.pow(angle, 2) + 4 * omega * (sourceDist - clusterDist) / (sourceDist * clusterDist * PARSECS)), 0.5);
// let theta1 = (angle + rad_term) / 2;
// let theta2 = (angle - rad_term) / 2;
// console.log('theta1, theta2, check beta', theta1 * ARCSEC_PER_RADIAN, theta2 * ARCSEC_PER_RADIAN, (theta1 + theta2) * ARCSEC_PER_RADIAN, beta);


// let r1 = clusterDist * Math.tan(theta1);
// let r2 = clusterDist * Math.tan(theta2);
// console.log ('r1, r2', r1, r2);


// let phi = omega / (r1 * PARSECS);
// console.log('phi (rad, degrees)', phi, phi * 180 / Math.PI);


// // calculate how far off to the side the observed light would have landed
// let alpha = Math.atan2(offset - r2, sourceDist - clusterDist);
// console.log(alpha, alpha * 180 / Math.PI);

// let y1 = offset - sourceDist * Math.tan(theta1 - phi);
// let y2 = offset - sourceDist * Math.sin(alpha);
// console.log('original ray offset', y1, y2);




// // END
// // not part of original calculations -- testing i did on my own
// let testbeta = 5;
// let testx = sourceDist * Math.tan(testbeta / ARCSEC_PER_RADIAN);
// console.log('test beta', testbeta);
// console.log('test offset', testx);



const mass = 1 * 1000000000000;
const clusterDist = 0.5 * 1000000000;
const sourceDist = 1 * 1000000000;
const offset = 15 * 1000;

let beta = Math.atan2(offset, sourceDist) * ARCSEC_PER_RADIAN;
console.log('source offset angle', beta);

// calculations 
let angle = beta / ARCSEC_PER_RADIAN;
let omega = (4 * G * mass * SUN_MASS) / Math.pow(LIGHT_SPEED, 2);

let rad_term = Math.pow((Math.pow(angle, 2) + 4 * omega * (sourceDist - clusterDist) / (sourceDist * clusterDist * LIGHT_YRS)), 0.5);
let theta1 = (angle + rad_term) / 2;
let theta2 = (angle - rad_term) / 2;
console.log('theta1, theta2, check beta', theta1 * ARCSEC_PER_RADIAN, theta2 * ARCSEC_PER_RADIAN, (theta1 + theta2) * ARCSEC_PER_RADIAN, beta);


let r1 = clusterDist * Math.tan(theta1);
let r2 = clusterDist * Math.tan(theta2);
console.log ('r1, r2', r1, r2);


let phi = omega / (r1 * LIGHT_YRS);
console.log('phi (rad, degrees)', phi, phi * 180 / Math.PI);


// calculate how far off to the side the observed light would have landed
let alpha = Math.atan2(offset - r2, sourceDist - clusterDist);
console.log(alpha, alpha * 180 / Math.PI);

let y1 = offset - sourceDist * Math.tan(theta1 - phi);
let y2 = offset - sourceDist * Math.sin(alpha);
console.log('original ray offset', y1, y2);