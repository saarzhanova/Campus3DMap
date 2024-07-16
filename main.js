import * as THREE from 'three';
import {Color} from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls";
import {OBJLoader} from "three/addons";


const scene = new THREE.Scene();
scene.background = new Color("#3f3f3f");

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
camera.position.set(0, 300, 200)

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
objLoader.load(url, (object) => {
    console.log(object)
    const color1 = new THREE.Color(56 / 255, 56 / 255, 56 / 255);
    const color2 = new THREE.Color(40 / 255, 40 / 255, 40 / 255);
    const edgeColor = new THREE.Color(0, 0, 0);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 4});

    // const scaleFactor = 1/8;
    // object.scale.set(scaleFactor, scaleFactor, scaleFactor);

    object.traverse(function (child) {
        if (child.isMesh) {
            if (child.material) {
                child.material.color = color1;
                child.material.needsUpdate = true;
            }
            const edges = new THREE.EdgesGeometry(child.geometry);
            const lineSegments = new THREE.LineSegments(edges, edgeMaterial);
            child.add(lineSegments);

        }
    });
    object.traverse(function (child) {
        if (child.name.includes("Building")) {
            console.log(child)
            child.material[1].color = color2
        }
    });
    scene.add(object);
}, undefined, (error) => {
    console.error(error);
});

/////////////////////////////////////////////////
const IPPBuilsings = [
    {
        name: "Télécom Paris",
        architect: "Yvonne Farrell et Shelley McNamara - Grafton Architects",
        yearConstruction: "2019",
        energy: ""
    },{
        name: "ENSEA",
        architect: "Cab architecte",
        yearConstruction: "2018",
        energy: ""
    },{
        name: "ENSTA",
        architect: "Patriarche",
        yearConstruction: "2012",
        energy: ""
    },{
        name: "Polytechnique",
        architect: "Henri Pottier",
        yearConstruction: "1970",
        energy: ""
    },
]

const raycaster = new THREE.Raycaster()
const clickMouse = new THREE.Vector2()

const originalMaterials = new Map();

let previousObject = null;

let isIPP = false

function goByClick() {
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(clickMouse, camera)
    const found = raycaster.intersectObjects(scene.children, true) // all intersection points within the 3d scene
    if (found.length > 0) {
        let foundObject = found[0].object
        let foundObjectName = foundObject.name
        console.log('intersection object name: ', foundObjectName)

        if (foundObject.name.includes("Building")) {
            console.log('object.name', foundObject)

            label.style.display = "block"
            additInfo.style.display = "none"

            isIPP = false
            let building

            switch (foundObjectName ) {
                case "Building T?l?com Paris":
                    isIPP = true
                    building = IPPBuilsings[0]
                    break
                case "Building ENSAE - Institut Polytechnique de Paris":
                    isIPP = true
                    building = IPPBuilsings[1]
                    break
                case "Building8022":
                    isIPP = true
                    building = IPPBuilsings[2]
                    break
                case "Building Grand Hall":
                    isIPP = true
                    building = IPPBuilsings[3]
                    break
            }

            if (isIPP) {
                additInfo.style.display = "block"
                name.innerText = building.name
                architect.innerText = building.architect
                year.innerText = building.yearConstruction
                school.innerText = "Institut Polytechnique de Paris"
                energy.innerText = "..."
            } else {
                name.innerText = foundObjectName
            }


            if (previousObject && originalMaterials.has(previousObject)) {
                previousObject.material = originalMaterials.get(previousObject);
            }
            if (!originalMaterials.has(foundObject)) {
                originalMaterials.set(foundObject, foundObject.material);
            }
            const materialPainted = new THREE.MeshBasicMaterial({ color: new THREE.Color(243 / 255, 40 / 241, 21 / 255)});
            foundObject.material = materialPainted;
            previousObject = foundObject;
        }
    }
}

function closeLabel() {
    label.style.display = "none"
    additInfo.style.display = "none"
    isIPP = false
    if (previousObject && originalMaterials.has(previousObject)) {
        previousObject.material = originalMaterials.get(previousObject);
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

animate();
const label = document.getElementById("buildingInfo")
const additInfo = document.getElementById("additionalBuildingInfo")
const name = document.getElementById("buildingName")
const architect = document.getElementById("buildingArchitect")
const year = document.getElementById("buildingYear")
const school = document.getElementById("buildingSchool")
const energy = document.getElementById("buildingEnergy")
window.addEventListener('click', goByClick)
const closeButton = document.getElementById("close")
closeButton.addEventListener('click', closeLabel)
