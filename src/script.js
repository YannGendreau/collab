import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry(.7, .2, 16, 100);

// Materials

// const material = new THREE.MeshBasicMaterial()
// material.color = new THREE.Color(0xff0000)

// // Mesh
// const sphere = new THREE.Mesh(geometry, material)
// scene.add(sphere)

new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath('./textures/equirectangular/')
    .load('Tokyo_BigSight_3k.hdr', function (texture) {

        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        render();

        // model

        // use of RoughnessMipmapper is optional
        const roughnessMipmapper = new RoughnessMipmapper(renderer);

        const loader = new GLTFLoader().setPath('./models/gltf/');
        loader.load('smartphone.glb', function (gltf) {

            gltf.scene.traverse(function (child) {

                if (child.isMesh) {

                    roughnessMipmapper.generateMipmaps(child.material);

                }

            });

            scene.add(gltf.scene);

            roughnessMipmapper.dispose();

            render();

        });

    });



// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

// const clock = new THREE.Clock()

// const tick = () => {

//     const elapsedTime = clock.getElapsedTime()

//     // Update objects
//     sphere.rotation.y = .5 * elapsedTime

//     // Update Orbital Controls
//     // controls.update()

//     // Render
//     renderer.render(scene, camera)

//     // Call tick again on the next frame
//     window.requestAnimationFrame(tick)
// }

// tick()