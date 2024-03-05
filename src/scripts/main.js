import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import GLTFLoader from the correct path

const scene = new THREE.Scene();

// Add an ambient light for overall scene illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
scene.add(ambientLight);

// Add a directional light to provide directional illumination and cast shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1); // Position the light from the top
scene.add(directionalLight);

const loader = new GLTFLoader();
loader.load(
    'src/assets/scene.gltf',
    function (gltf) {
        scene.add(gltf.scene);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
