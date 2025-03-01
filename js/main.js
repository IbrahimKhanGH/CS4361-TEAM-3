/**
 * Main application code for the Computer Graphics Learning Studio
 */

// Global variables
let scene, camera, renderer, controls;
let animationActive = true;

// Set up the loading screen
window.addEventListener('load', () => {
    // Hide loading screen after everything is loaded
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 1500);
    
    init();
    animate();
});

/**
 * Initialize the 3D scene and application
 */
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2c3e50);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75, 
        (window.innerWidth - 300) / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth - 300, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Create basic geometry
    createGeometry();
    
    // Add lights
    createLights();
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Animation loop
 */
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Animate geometry
    animateGeometry();
    
    // Animate lights
    animateLights();
    
    // Render the scene
    renderer.render(scene, camera);
} 