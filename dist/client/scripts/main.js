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
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50); // Adjust camera position closer to the scene
camera.lookAt(0, 0, 0); // Look at the center of the scene

// Adjust camera FOV to zoom in further if needed
camera.fov = 60; // Set a narrower field of view (in degrees) for a closer view
camera.updateProjectionMatrix(); // Update the camera's projection matrix

// Set up ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Set up directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = true;
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    RIGHT: THREE.MOUSE.PAN,
    MIDDLE: THREE.MOUSE.DOLLY
};

const textureLoader = new THREE.TextureLoader();

const textures = {
    poster: textureLoader.load('../assets/material.png'),
    pic1: textureLoader.load('../assets/pic-1_baseColor.png'),
    phonetik: textureLoader.load('../assets/phonetik_baseColor.jpeg'),
    material8: textureLoader.load('../assets/material_8_baseColor.jpeg')
};

const loader = new GLTFLoader();
loader.load(
    '../assets/scene.gltf',
    (gltf) => {
        // Once loaded, add the model to the scene
        const model = gltf.scene;
        scene.add(model);

        // Apply textures to materials
        model.traverse((child) => {
            if (child.isMesh) {
                switch (child.name) {
                    case 'poster':
                        child.material.map = textures.poster;
                        break;
                    case 'pic-1':
                        child.material.map = textures.pic1;
                        break;
                    case 'phonetik':
                        child.material.map = textures.phonetik;
                        break;
                    case 'material_8':
                        child.material.map = textures.material8;
                        break;
                    // Add more cases as needed for other materials
                }
            }
        });

        // Calculate the bounding box of the model
        const boundingBox = new THREE.Box3().setFromObject(model);
        const center = boundingBox.getCenter(new THREE.Vector3());

        // Set camera position and target based on bounding box
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let distance = maxDim / (2 * Math.tan(fov / 2));

        camera.position.copy(center);
        camera.position.z += distance;

        // Update controls target
        controls.target.copy(center);
        controls.update();
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