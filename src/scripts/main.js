import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const container = document.getElementById('container');

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Set up scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(100, 200, 200); // Move the camera back along the z-axis to zoom out

// Adjust camera FOV to zoom out further if needed
camera.fov = 90; // Set a wider field of view (in degrees)
camera.updateProjectionMatrix(); // Update the camera's projection matrix

// Set up ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Set up directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true; // Abilita lo zoom con la rotellina del mouse
controls.enablePan = true; // Abilita lo spostamento della telecamera
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    RIGHT: THREE.MOUSE.PAN, // Usa il tasto destro per lo spostamento
    MIDDLE: THREE.MOUSE.DOLLY // Usa il tasto centrale per lo zoom
};

const loader = new GLTFLoader();
loader.load(
    'src/scripts/utils/scene.gltf',
    (gltf) => {
        // Once loaded, add the model to the scene
        scene.add(gltf.scene);

        // Load external texture
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            'src/scripts/utils/Material.008_emissive.jpeg',
            (texture) => {
                // Apply texture to the material in the model
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.material.map = texture;
                    }
                });
            },
            undefined,
            (error) => {
                console.error('Error loading texture', error);
            }
        );
    },
    undefined,
    (error) => {
        console.error('Error loading GLTF model', error);
    }
);

// Set up animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
