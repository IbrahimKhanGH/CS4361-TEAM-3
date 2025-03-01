/**
 * Functions for creating and managing 3D geometry in the scene
 */

// Global references to geometry objects
let cube, sphere, plane;

// Tooltips for different objects
const tooltips = {
    'cube': 'This cube demonstrates basic 3D geometry and shows how vertices, edges, and faces combine to create 3D objects.',
    'sphere': 'This sphere demonstrates smooth shading. Notice how light interacts with its curved surface compared to the cube.',
    'plane': 'This plane demonstrates texture mapping, showing how 2D images can be applied to 3D surfaces.'
};

/**
 * Creates basic geometry objects and adds them to the scene
 */
function createGeometry() {
    // Create a cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3498db,
        metalness: 0.3,
        roughness: 0.4
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.x = -2;
    cube.castShadow = true;
    cube.name = 'cube';
    scene.add(cube);
    
    // Create a sphere
    const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe74c3c, 
        metalness: 0.3,
        roughness: 0.4
    });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 2;
    sphere.castShadow = true;
    sphere.name = 'sphere';
    scene.add(sphere);
    
    // Create a plane
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xecf0f1,
        side: THREE.DoubleSide
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -1.5;
    plane.receiveShadow = true;
    plane.name = 'plane';
    scene.add(plane);
}

/**
 * Toggles wireframe mode for all meshes in the scene
 * @param {boolean} enabled - Whether wireframe mode should be enabled
 */
function toggleWireframe(enabled) {
    scene.traverse((object) => {
        if (object.isMesh) {
            object.material.wireframe = enabled;
        }
    });
}

/**
 * Animates the geometry objects
 */
function animateGeometry() {
    if (animationActive) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        
        sphere.rotation.y += 0.01;
    }
} 