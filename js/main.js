import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
gsap.registerPlugin(ScrollTrigger);

let lastScrollY = window.scrollY;

// ✅ Handle Nav Animation on Scroll
gsap.ticker.add(() => {
  let currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY) {
    gsap.to("nav", { y: "-100%", duration: 0.5, ease: "power2.out" });
  } else {
    gsap.to("nav", { y: "0%", duration: 0.5, ease: "power2.out" });
  }
  lastScrollY = currentScrollY;
});

// ✅ Separate Scenes & Cameras
const sceneGlobe = new THREE.Scene();
const scenePlane1 = new THREE.Scene();

const cameraGlobe = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraGlobe.position.set(0, 0, 700);

const cameraPlane1 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraPlane1.position.set(0, 100, 600);
cameraPlane1.lookAt(0, 50, 0);

// ✅ Store 3D Objects
let globe, plane3;
const globeModel = "earth_cartoon";
const planeModel = "plaane3";

const loader = new GLTFLoader();

// ✅ Renderers
const rendererGlobe = new THREE.WebGLRenderer({ alpha: true });
rendererGlobe.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container2D").appendChild(rendererGlobe.domElement);

const rendererPlane1 = new THREE.WebGLRenderer({ alpha: true });
rendererPlane1.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(rendererPlane1.domElement);

// ✅ Load Models
loader.load(`./models/${globeModel}/scene.gltf`, function (gltf) {
    globe = gltf.scene;
    globe.scale.set(210, 220, 210);
    globe.position.set(-300, 0, 0);
    sceneGlobe.add(globe);

}, undefined, console.error);

loader.load(`./models/${planeModel}/scene.gltf`, function (gltf) {
    plane3 = gltf.scene;
    plane3.scale.set(150, 150, 150);
    plane3.position.set(-250, -200, 20);
    scenePlane1.add(plane3);
    
    // ✅ Apply GSAP Scroll Animations
   // ✅ Update GSAP Scroll Animation to Include Rotation (Spiral Effect)
gsap.to(plane3.position, {
  x: 600,
  y: "+=50",
  duration: 2,
  ease: "power1.out",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
});

// ✅ Spiral Rotation Effect
gsap.to(plane3.rotation, {
  z: "+=2 * Math.PI", // Full rotations
  x: "+=0.5 * Math.PI",
  duration: 2,
  ease: "power1.out",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
  },
});


// Animate Text Elements on Scroll
// Animate Text Elements on Scroll, Excluding .text4, .text5, .text7
document.querySelectorAll(".one, .two, .three, .four").forEach((section) => {
  let textElements = section.querySelectorAll("h1, h2, h3, p");

  // Filter out the excluded text classes
  let filteredText = [...textElements].filter(
    (el) => !el.classList.contains("text5") && 
            !el.classList.contains("text6") && 
            !el.classList.contains("text7")
  );

  gsap.to(filteredText, {
    scale: 0.5,
    opacity: 0,
    duration: 2.5,
    ease: "power1.out",
    scrollTrigger: {
      trigger: section,
      start: "top 3%",
      end: "top 100%",
      scrub: true,
    },
  });
});
;
// ✅ Update Trail to Follow Plane with Spiral Effect



    // ✅ Scroll-based Landing Animations
    createLandingAnimations();

    // ✅ Add Dotted Trail Effect
    createTrail();

}, undefined, console.error);

// ✅ Function to Create a Dotted Trail
let trail, trailGeometry, trailMaterial;
const maxTrailPoints = 100;
let trailPositions = [];



// ✅ Update Trail to Follow Plane
// ✅ Function to Create a Dotted Trail with White and Blue Colors
function createTrail() {
  trailGeometry = new THREE.BufferGeometry();
  trailPositions = new Float32Array(maxTrailPoints * 3);
  trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

  // ✅ Shader Material for Gradient Effect (White & Blue)
  trailMaterial = new THREE.ShaderMaterial({
      uniforms: {
          color1: { value: new THREE.Color(0xffffff) }, // White
          color2: { value: new THREE.Color(0x0077ff) }, // Blue
      },
      vertexShader: `
          varying float vOpacity;
          void main() {
              vOpacity = position.z / 100.0; // Fades based on position
              gl_PointSize = 10.0; // Bigger dots
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
      `,
      fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          varying float vOpacity;
          void main() {
              vec3 color = mix(color1, color2, vOpacity);
              gl_FragColor = vec4(color, 1.0);
          }
      `,
      transparent: true,
  });

  trail = new THREE.Points(trailGeometry, trailMaterial);
  scenePlane1.add(trail);
}
// ✅ Load Cloud Texture
const cloudTexture = new THREE.TextureLoader().load("./models/clouds.png");

// ✅ Create Cloud Mesh Function
function createCloud(x, y, z, scale, rotation) {
  const cloudGeometry = new THREE.PlaneGeometry(200, 120); // Plane for the cloud
  const cloudMaterial = new THREE.MeshBasicMaterial({
    map: cloudTexture,
    transparent: true,
    depthWrite: false, // Prevents z-fighting
  });

  const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
  cloud.position.set(x, y, z);
  cloud.scale.set(scale, scale, scale);
  cloud.rotation.y = rotation;
  
  sceneGlobe.add(cloud);

  return cloud;
}

// ✅ Create Multiple Clouds with Different Sizes & Angles
// const clouds = [
//   createCloud(-150, -90, -100, 2, Math.PI / 12),
//   createCloud(-150, -90, 50, 2, -Math.PI / 6),
//   createCloud(-150, -90, 80, 2, Math.PI / 20),
//   createCloud(-150, -90, -70, 2, -Math.PI / 60),
// ];

// // ✅ Animate Clouds to Move Out as We Scroll
// clouds.forEach((cloud, index) => {
//   gsap.to(cloud.position, {
//     z: "-=300", // Moves cloud outward
//     duration: 2,
//     ease: "power1.out",
//     scrollTrigger: {
//       trigger: "body",
//       start: "40%",
//       end: "10%",
//       scrub: true,
//     },
//   });
// });

// ✅ Update Trail to Follow Plane

function updateTrail() {
  if (!plane3) return;

  for (let i = maxTrailPoints - 1; i > 0; i--) {
    trailPositions[i * 3] = trailPositions[(i - 1) * 3];
    trailPositions[i * 3 + 1] = trailPositions[(i - 1) * 3 + 1];
    trailPositions[i * 3 + 2] = trailPositions[(i - 1) * 3 + 2];
  }

  // ✅ Apply a Spiral Effect to the Trail
  let angle = (performance.now() * 0.001) % (2 * Math.PI);
  let radius = 10; // Adjust for a bigger spiral

  trailPositions[0] = plane3.position.x + radius * Math.cos(angle);
  trailPositions[1] = plane3.position.y + radius * Math.sin(angle);
  trailPositions[2] = plane3.position.z - radius * 0.5;

  trailGeometry.attributes.position.needsUpdate = true;
}

// ✅ Function for Landing Animations
function createLandingAnimations() {
    gsap.timeline({
        scrollTrigger: {
            trigger: ".two",
            start: "0% 95%",
            end: "50% 50%",
            scrub: true,
        },
    }).to(plane3.position, {
        x: -100,
        y: 20,
        z: 50,
        rotationZ: Math.PI / 6,
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: ".three",
            start: "0% 95%",
            end: "50% 50%",
            scrub: true,
        },
    }).to(plane3.position, {
        x: 50,
        y: -10,
        z: 30,
        rotationZ: Math.PI / 8,
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: ".four",
            start: "0% 95%",
            end: "50% 50%",
            scrub: true,
        },
    }).to(plane3.position, {
        x: 200,
        y: -50,
        z: 0,
        rotationZ: Math.PI / 4,
    });
}

// ✅ Make Plane Follow Mouse
window.addEventListener("mousemove", (event) => {
    if (!plane3) return;
    
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    gsap.to(plane3.position, {
        x: mouseX * 300,
        y: mouseY * 200,
        duration: 0.5,
        ease: "power2.out",
    });
});
document.querySelectorAll(".travel-card img").forEach((img) => {
  gsap.fromTo(
    img,
    { scale: 1 }, // Start at normal size
    {
      border:0,
      scale: 1.5, // Zoom in effect
      x: "50%", // Moves image toward center
      duration: 9,
       margin: "0 auto  6", // Center image
      ease: "power1.out",
      scrollTrigger: {
        trigger: img,
        start: "top 30%", // Start effect when the image reaches 70% of viewport
        end: "top 20%", // End effect when it reaches 30%
        scrub: true, // Smooth animation on scroll
      },
    }
  );
});

// ✅ Orbit Controls
const controlsGlobe = new OrbitControls(cameraGlobe, rendererGlobe.domElement);
controlsGlobe.enableDamping = true;
controlsGlobe.enableZoom = false;
controlsGlobe.rotateSpeed = 0.5;

// ✅ Improved Lighting
const directionalLightGlobe = new THREE.DirectionalLight(0xffffff, 2);
directionalLightGlobe.position.set(1, 1, 1);
sceneGlobe.add(directionalLightGlobe);
sceneGlobe.add(new THREE.AmbientLight(0x555555, 2));

const directionalLightPlane = new THREE.DirectionalLight(0xffffff, 2);
directionalLightPlane.position.set(1, 1, 1);
scenePlane1.add(directionalLightPlane);
scenePlane1.add(new THREE.AmbientLight(0x555555, 4));

// ✅ Animation Loop
function animate() {
    requestAnimationFrame(animate);
    if (globe) globe.rotation.y += 0.005;
    controlsGlobe.update();
    updateTrail();
    rendererGlobe.render(sceneGlobe, cameraGlobe);
    rendererPlane1.render(scenePlane1, cameraPlane1);
}
animate();
