/**
 * Main application for the Graphics Learning Studio
 * This file handles initialization, rendering, and the main animation loop
 */

// Core Three.js variables
let scene, camera, renderer;
let clock = new THREE.Clock();
let animationId;

// Debug flag
const DEBUG_MAIN = true;

// Track initialization status
window.appInitialized = false;

/**
 * Initialize the 3D environment
 */
function init() {
    if (DEBUG_MAIN) console.log('Initializing 3D environment...');
    
    try {
        // Create the scene
        scene = new THREE.Scene();
        if (DEBUG_MAIN) console.log('Scene created');
        
        // Set scene background color (will be replaced by skybox)
        scene.background = new THREE.Color(0x88ccee);
        
        // Create the camera
        camera = new THREE.PerspectiveCamera(
            75, // Field of view
            window.innerWidth / window.innerHeight, // Aspect ratio
            0.1, // Near clipping plane
            1000 // Far clipping plane
        );
        camera.position.set(0, 5, 20); // Start position
        if (DEBUG_MAIN) console.log('Camera created at position:', camera.position);
        
        // Create the renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        
        // Get the canvas container
        const container = document.getElementById('canvas-container');
        if (!container) {
            console.error('Canvas container not found');
            // Create it if it doesn't exist
            const newContainer = document.createElement('div');
            newContainer.id = 'canvas-container';
            document.body.appendChild(newContainer);
            if (DEBUG_MAIN) console.log('Created missing canvas container');
            container = newContainer;
        }
        
        // Add the renderer to the container
        container.innerHTML = ''; // Clear any existing content
        container.appendChild(renderer.domElement);
        if (DEBUG_MAIN) console.log('Renderer added to container');
        
        // Store the canvas globally for easy access
        window.appCanvas = renderer.domElement;
        if (DEBUG_MAIN) console.log('Canvas stored globally as window.appCanvas');
        
        // Add a simple test object to verify rendering
        addTestObjects();
        
        // Add lights
        addLights();
        
        // Initialize first-person controls
        if (typeof initFirstPersonControls === 'function') {
            if (DEBUG_MAIN) console.log('Calling initFirstPersonControls...');
            window.controls = initFirstPersonControls(camera, renderer.domElement);
            if (DEBUG_MAIN) console.log('Controls initialized:', window.controls);
        } else {
            console.error('initFirstPersonControls function not found');
        }
        
        // Create the 3D world
        if (typeof createWorld === 'function') {
            if (DEBUG_MAIN) console.log('Calling createWorld...');
            createWorld();
            if (DEBUG_MAIN) console.log('World created');
        } else {
            console.error('createWorld function not found');
        }
        
        // Handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // Start the animation loop
        animate();
        
        // Add click handler for instructions
        setupInstructionsClickHandler();
        
        // Mark initialization as complete
        window.appInitialized = true;
        
        if (DEBUG_MAIN) console.log('Initialization complete');
        
        // Dispatch an event to notify that initialization is complete
        const event = new CustomEvent('appInitialized');
        document.dispatchEvent(event);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

/**
 * Add a simple test cube and ground plane to verify rendering
 */
function addTestObjects() {
    // Add a red cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 2, -5);
    scene.add(cube);
    if (DEBUG_MAIN) console.log('Test cube added at position:', cube.position);
    
    // Add a ground plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x999999,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.1;
    scene.add(plane);
    if (DEBUG_MAIN) console.log('Test ground plane added');
}

/**
 * Add lights to the scene
 */
function addLights() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // Add directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    if (DEBUG_MAIN) console.log('Lights added to scene');
}

/**
 * Handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Set up click handler for instructions
 */
function setupInstructionsClickHandler() {
    const instructions = document.getElementById('instructions');
    if (!instructions) {
        console.error('Instructions element not found');
        return;
    }
    
    instructions.addEventListener('click', function() {
        if (DEBUG_MAIN) console.log('Instructions clicked');
        
        // Hide instructions
        instructions.style.display = 'none';
        
        // Request pointer lock
        if (window.controls && window.controls.lock) {
            if (DEBUG_MAIN) console.log('Requesting pointer lock from instructions click');
            try {
                window.controls.lock();
            } catch (error) {
                console.error('Error requesting pointer lock:', error);
            }
        } else {
            console.error('Controls not initialized or lock method not available');
        }
    });
    
    if (DEBUG_MAIN) console.log('Instructions click handler set up');
}

/**
 * Animation loop
 */
function animate() {
    animationId = requestAnimationFrame(animate);
    
    try {
        // Get delta time
        const delta = clock.getDelta();
        
        // Update controls
        if (typeof updateFirstPersonControls === 'function') {
            updateFirstPersonControls(delta);
        }
        
        // Update world animations
        if (typeof updateWorld === 'function') {
            updateWorld(clock.elapsedTime);
        }
        
        // Render the scene
        renderer.render(scene, camera);
    } catch (error) {
        console.error('Error in animation loop:', error);
        cancelAnimationFrame(animationId);
    }
}

/**
 * Skip the loading screen and start the application
 */
function skipLoading() {
    if (DEBUG_MAIN) console.log('Skipping loading screen');
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    // Initialize the 3D environment if not already initialized
    if (!window.appInitialized) {
        init();
    }
}

/**
 * Get the canvas element for pointer lock
 */
function getCanvas() {
    // First try the global reference
    if (window.appCanvas) {
        return window.appCanvas;
    }
    
    // Then try to find it in the DOM
    const canvas = document.querySelector('canvas');
    if (canvas) {
        return canvas;
    }
    
    // Finally try to find it in the canvas container
    const container = document.getElementById('canvas-container');
    if (container) {
        const canvasInContainer = container.querySelector('canvas');
        if (canvasInContainer) {
            return canvasInContainer;
        }
    }
    
    return null;
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (DEBUG_MAIN) console.log('DOM content loaded, setting up application');
    
    // Add emergency start button functionality
    const emergencyStartButton = document.getElementById('emergency-start');
    if (emergencyStartButton) {
        emergencyStartButton.addEventListener('click', function() {
            if (DEBUG_MAIN) console.log('Emergency start button clicked');
            skipLoading();
        });
    }
    
    // Check if loading screen exists
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) {
        console.error('Loading screen element not found');
        skipLoading();
        return;
    }
    
    // Check if instructions exist
    const instructions = document.getElementById('instructions');
    if (!instructions) {
        console.error('Instructions element not found');
    }
    
    // Check if canvas container exists
    const canvasContainer = document.getElementById('canvas-container');
    if (!canvasContainer) {
        console.error('Canvas container element not found');
    }
    
    // Add skip loading button functionality
    const skipLoadingButton = document.getElementById('skip-loading');
    if (skipLoadingButton) {
        skipLoadingButton.addEventListener('click', function() {
            if (DEBUG_MAIN) console.log('Skip loading button clicked');
            skipLoading();
        });
    }
    
    // Add check functions button functionality
    const checkFunctionsButton = document.getElementById('check-functions');
    if (checkFunctionsButton) {
        checkFunctionsButton.addEventListener('click', function() {
            if (DEBUG_MAIN) console.log('Check functions button clicked');
            if (typeof window.checkRequiredFunctions === 'function') {
                window.checkRequiredFunctions();
            }
        });
    }
    
    // Initialize after a short delay to ensure all scripts are loaded
    setTimeout(function() {
        if (DEBUG_MAIN) console.log('Starting initialization after delay');
        init();
    }, 1000);
});

// Ensure functions are properly exposed to the global scope
console.log('Main.js loaded, checking function availability');
if (typeof init !== 'function') {
    console.error('init function is not properly defined in the global scope');
    // Try to explicitly expose it
    window.init = init;
    window.animate = animate;
    window.skipLoading = skipLoading;
    window.getCanvas = getCanvas;
    console.log('Functions explicitly exposed to window object');
} else {
    console.log('init function is properly defined in the global scope');
} 