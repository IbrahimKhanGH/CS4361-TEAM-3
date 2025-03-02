/**
 * First-person controls for the Graphics Learning Studio
 * This file handles camera movement and user interaction in the 3D world
 */

// Control variables
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let pointerLocked = false;

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let controls;

// Debug flag
const DEBUG_CONTROLS = true;

/**
 * Initializes first-person controls for the camera
 */
function initFirstPersonControls(camera, domElement) {
    if (DEBUG_CONTROLS) console.log('Initializing first-person controls...');
    
    try {
        if (!camera) {
            console.error('Camera is undefined in initFirstPersonControls');
            return;
        }
        
        if (DEBUG_CONTROLS) console.log('Camera position before controls:', camera.position);
        
        // Store initial camera position
        const initialPosition = camera.position.clone();
        
        // Check if PointerLockControls is available
        if (!THREE.PointerLockControls) {
            console.error('THREE.PointerLockControls is not defined');
            console.log('THREE object:', THREE);
            return;
        }
        
        // Create pointer lock controls
        controls = new THREE.PointerLockControls(camera, domElement);
        
        if (DEBUG_CONTROLS) console.log('Controls created:', controls);
        
        // Restore camera position (sometimes PointerLockControls changes it)
        camera.position.copy(initialPosition);
        
        if (DEBUG_CONTROLS) console.log('Camera position after controls:', camera.position);
        
        // Add event listeners for pointer lock
        document.addEventListener('click', function(event) {
            if (DEBUG_CONTROLS) console.log('Document clicked, attempting to lock pointer');
            
            // Only lock if we clicked on the canvas or instructions
            const target = event.target;
            const isCanvas = target.closest('#canvas-container');
            const isInstructions = target.closest('#instructions');
            
            if (DEBUG_CONTROLS) console.log('Click target:', target, 'isCanvas:', isCanvas, 'isInstructions:', isInstructions);
            
            if (isCanvas || isInstructions) {
                // Try to request pointer lock
                try {
                    controls.lock();
                    if (DEBUG_CONTROLS) console.log('Requested pointer lock');
                } catch (error) {
                    console.error('Error requesting pointer lock:', error);
                }
            }
        });
        
        controls.addEventListener('lock', function() {
            if (DEBUG_CONTROLS) console.log('Pointer lock acquired');
            pointerLocked = true;
            
            // Hide instructions when locked
            const instructions = document.getElementById('instructions');
            if (instructions) {
                instructions.style.display = 'none';
            }
        });
        
        controls.addEventListener('unlock', function() {
            if (DEBUG_CONTROLS) console.log('Pointer lock released');
            pointerLocked = false;
            
            // Show instructions when unlocked
            const instructions = document.getElementById('instructions');
            if (instructions) {
                instructions.style.display = 'flex';
            }
        });
        
        // Add keyboard controls
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        
        // Create a crosshair in the center of the screen
        createCrosshair();
        
        if (DEBUG_CONTROLS) console.log('First-person controls initialized successfully');
        
        return controls;
    } catch (error) {
        console.error('Error initializing first-person controls:', error);
    }
}

/**
 * Creates a crosshair in the center of the screen
 */
function createCrosshair() {
    try {
        // Check if crosshair already exists
        if (document.getElementById('crosshair')) {
            return;
        }
        
        const crosshair = document.createElement('div');
        crosshair.id = 'crosshair';
        crosshair.style.position = 'absolute';
        crosshair.style.top = '50%';
        crosshair.style.left = '50%';
        crosshair.style.width = '20px';
        crosshair.style.height = '20px';
        crosshair.style.marginTop = '-10px';
        crosshair.style.marginLeft = '-10px';
        crosshair.style.zIndex = '999';
        crosshair.style.pointerEvents = 'none';
        
        // Create crosshair lines
        const verticalLine = document.createElement('div');
        verticalLine.style.position = 'absolute';
        verticalLine.style.top = '0';
        verticalLine.style.left = '50%';
        verticalLine.style.width = '2px';
        verticalLine.style.height = '100%';
        verticalLine.style.marginLeft = '-1px';
        verticalLine.style.backgroundColor = 'white';
        
        const horizontalLine = document.createElement('div');
        horizontalLine.style.position = 'absolute';
        horizontalLine.style.top = '50%';
        horizontalLine.style.left = '0';
        horizontalLine.style.width = '100%';
        horizontalLine.style.height = '2px';
        horizontalLine.style.marginTop = '-1px';
        horizontalLine.style.backgroundColor = 'white';
        
        crosshair.appendChild(verticalLine);
        crosshair.appendChild(horizontalLine);
        
        document.body.appendChild(crosshair);
        
        if (DEBUG_CONTROLS) console.log('Crosshair created');
    } catch (error) {
        console.error('Error creating crosshair:', error);
    }
}

/**
 * Handles keydown events for movement
 */
function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
            
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
            
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
            
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
            
        case 'Space':
            if (canJump === true) velocity.y += 350;
            canJump = false;
            break;
            
        case 'Tab':
        case 'KeyI':
            // Toggle UI panel
            const uiPanel = document.getElementById('ui-panel');
            if (uiPanel) {
                if (uiPanel.classList.contains('visible')) {
                    uiPanel.classList.remove('visible');
                } else {
                    uiPanel.classList.add('visible');
                }
            }
            break;
    }
}

/**
 * Handles keyup events for movement
 */
function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
            
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
            
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
            
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
}

/**
 * Updates the controls based on user input
 */
function updateFirstPersonControls(delta) {
    if (!controls) {
        if (DEBUG_CONTROLS) console.log('Controls not initialized in updateFirstPersonControls');
        return;
    }
    
    if (!pointerLocked) {
        return;
    }
    
    // Apply gravity and damping
    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    
    // Set direction based on movement keys
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // Ensures consistent movement in all directions
    
    // Calculate movement
    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;
    
    // Apply movement to controls
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    
    // Apply gravity to camera position
    camera.position.y += (velocity.y * delta);
    
    // Check if we're on the ground
    if (camera.position.y < 1.8) {
        velocity.y = 0;
        camera.position.y = 1.8;
        canJump = true;
    }
    
    // Check for station proximity
    if (typeof checkStationProximity === 'function') {
        checkStationProximity();
    }
}

// Ensure functions are properly exposed to the global scope
console.log('FirstPersonControls.js loaded, checking function availability');
if (typeof initFirstPersonControls !== 'function') {
    console.error('initFirstPersonControls function is not properly defined in the global scope');
    // Try to explicitly expose it
    window.initFirstPersonControls = initFirstPersonControls;
    window.updateFirstPersonControls = updateFirstPersonControls;
    console.log('Functions explicitly exposed to window object');
} else {
    console.log('initFirstPersonControls function is properly defined in the global scope');
} 