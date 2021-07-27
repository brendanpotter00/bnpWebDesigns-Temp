import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

/**
 * Base
 */



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



/* 
TEXTURES 
*/

const textureLoader = new THREE.TextureLoader()

const colorTexture = textureLoader.load('/textures/door/color.jpg')
const metalTexture = textureLoader.load('/textures/door/metalness.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const ambientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const gradient = textureLoader.load('/textures/gradients/3.jpg')
gradient.magFilter = THREE.NearestFilter
gradient.minFilter = THREE.NearestFilter

const matcap1 = textureLoader.load('/textures/matcaps/1.png')
const matcap5 = textureLoader.load('/textures/matcaps/5.png')
const matcap8 = textureLoader.load('/textures/matcaps/8.png')

//DEBUG
const gui = new dat.GUI( { closed: false, autoPlace:false })
var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);



const parameters = {
    color: 0x71ff00,
    matcap: [matcap8, matcap5, matcap1],
    
    //function inside an object
    spin: () => {  
        gsap.to(torusKnot.rotation, { duration: 3.5, y: torusKnot.rotation.y + 10 })
    }
}

/*
OBJECTS (materials and geometry)
*/

/* const material = new THREE.MeshBasicMaterial({
})

material.map = colorTexture
material.transparent = true
material.alphaMap = alphaTexture
*/
/* material.side = THREE.DoubleSide */ 

//NORMAL
/* const material = new THREE.MeshNormalMaterial()
material.side = THREE.DoubleSide
material.flatShading = true */
/* material.wireframe = true */

//MATCAPS COOL
    const material = new THREE.MeshMatcapMaterial()

    material.matcap = matcap8
    material.wireframe = true 
//https://github.com/nidorx/matcaps

//MESH DEPTH MATERIALS (for background)
const materialDepth = new THREE.MeshDepthMaterial()

//MESH LAMBERT MATERIAL
/* const material = new THREE.MeshLambertMaterial() */

//MESH PHONG MATERIAL better looking but less performance 
/* const material = new THREE.MeshPhongMaterial()
material.shininess = 100
material.specular = new THREE.Color() */

//MESH TOON MATERIAL 
/* const material = new THREE.MeshToonMaterial()
material.gradientMap = gradient */


material.side = THREE.DoubleSide

//Setting color ways
/* material.color = new THREE.Color('pink')
material.color.set('red') */

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(.5,16,16),
    material
)
sphere.position.x = 1

console.log(sphere.geometry.attributes)

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry( 10, 3, 100, 16 ),
    material
)
/* const torusKnotClose = new THREE.Mesh(
    new THREE.TorusKnotGeometry( .1,.1,1,8 ),
    material
) */

/* torusKnotClose.position.z = 2.2 */

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    materialDepth,
)
plane.position.z = 2



console.log(plane.position.z)


const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(.3,.2,16,32),
    material
)
torus.position.x = -1

scene.add(plane, sphere, torus, torusKnot)

//debug cube

gui.add(sphere.position, 'z').min(-3).max(3).step(.01).name('sphereZ')
gui.add(torus.position, 'z').min(-3).max(3).step(.01).name('torusZ')

gui 
    .add(plane, 'visible').name('plane visability')

gui.add(material, 'wireframe').name('wireframe')

gui
    .add(parameters, 'spin') 
    



//LIGHTS

const ambientLight = new THREE.AmbientLight(0xffffff, .5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, .5)
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

window.addEventListener('resize', () =>
{
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
camera.position.z =2.4639455621048544



scene.add(camera)

console.log(camera.position.z)

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
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //update objs
    sphere.rotation.y = elapsedTime * .5
    torus.rotation.y = elapsedTime * .5 
    plane.rotation.y = elapsedTime * .5
    sphere.rotation.x = elapsedTime * .5
    torus.rotation.x = elapsedTime * .5 
    plane.rotation.x = elapsedTime * .5


    console.log(sizes.width, sizes.height)

    // RESIZING SHAPES
    if (sizes.width <= 375 && sizes.height <= 812) {
        sphere.position.x = .5
        torus.position.x = -.5
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()