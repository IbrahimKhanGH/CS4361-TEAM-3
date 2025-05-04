/**
 * Functions for creating and managing lights in the scene
 */

// Global references to lights
let ambientLight, directionalLight, pointLight;

/**
 * Creates and adds lights to the scene
 */
function createLights() {
    // Ambient light - provides base illumination for all objects
    ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Directional light (sun-like) - casts shadows
    directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Point light for additional highlights - moves in a circle
    pointLight = new THREE.PointLight(0xffa500, 0.5, 10);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);
}

/**
 * Animates the lights in the scene
 */
function animateLights() {
    if (animationActive) {
        // Make point light move in a circle
        const time = Date.now() * 0.001;
        pointLight.position.x = Math.sin(time) * 3;
        pointLight.position.z = Math.cos(time) * 3;
    }
} 