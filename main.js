import * as THREE from 'three';
import {Color} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {OBJLoader} from "three/addons";
import {label} from "three/addons/nodes/core/ContextNode";


const scene = new THREE.Scene();
scene.background = new Color('black');

const fov = 75
const aspect = window.innerWidth / window.innerHeight
const near = 1.0
const far = 10000.0

const perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far)

const left = -1000
const right = 1000
const top = 1000
const bottom = -1000

const orthographicCamera = new THREE.OrthographicCamera(left, right, top, bottom)

const camera = perspectiveCamera
camera.position.set(-100, 1000, 1000)

scene.add(camera)
scene.add(orthographicCamera)

scene.add( new THREE.AmbientLight( 0xffffff, 0.6 ) );
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(-3, 1, 5);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width/height
    camera.updateProjectionMatrix();
})

const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = false;
controls.screenSpacePanning = true;
controls.minDistance = 3;
controls.maxDistance = 10000;
controls.maxPolarAngle = Math.PI / 2;
controls.update();
controls.mouseButtons = {
    RIGHT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    LEFT: THREE.MOUSE.PAN
};

const objLoader = new OBJLoader();

const url = 'CampusMap.obj';
objLoader.load(url, (root) => {
    console.log(root)
    scene.add(root);
    root.traverse(function (child) {
        if (child.name.includes("Forest")) {
            if (child.material.color) {
                child.material.color.setRGB(0, 1, 0);
            }
        } else if (child.name.includes("Water")) {
            if (child.material.color) {
                child.material.color.setRGB(0, 0, 1);
            }
        } else if (child.isMesh && child.name.includes("SurfaceArea")) {
            if (child.material.color) {
                child.material.color.setRGB(0, 0, 0);
            }
        }
    })
}, undefined, (error) => {
    console.error(error);
});

/////////////////////////////////////////////////
const raycaster = new THREE.Raycaster()
const clickMouse = new THREE.Vector2()

function goByClick() {
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(clickMouse, camera)
    const found = raycaster.intersectObjects(scene.children) // all intersection points within the 3d scene
    if (found.length > 0) {
        const object = found[0].object
        console.log('intersection points with scene objects are found!')
        console.log('intersection points: ', found)
        console.log('intersection object name: ', object.name)
        const label = document.getElementById("label")
        const name = document.getElementById("name")
        label.style.display = "block";
        name.innerText = found[0].object.name
        if (object.name.includes("Building")) {
            console.log('object.name', object)
            object.material[0].color.setRGB(0, 1, 0);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

animate();
window.addEventListener('click', goByClick)
