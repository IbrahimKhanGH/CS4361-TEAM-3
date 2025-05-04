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
const DEBUG_CONTROLS = false;

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
            if (DEBUG_CONTROLS) console.log('Document clicked, checking lock state');
            
            // Only react if we clicked on the canvas or instructions
            const target = event.target;
            const isCanvas = target.closest('#canvas-container');
            const isInstructions = target.closest('#instructions');
            
            if (DEBUG_CONTROLS) console.log('Click target:', target, 'isCanvas:', isCanvas, 'isInstructions:', isInstructions);
            
            if (isCanvas || isInstructions) {
                // Try to toggle pointer lock
                try {
                    if (controls.isLocked) {
                        if (DEBUG_CONTROLS) console.log('Already locked, requesting unlock');
                        // controls.unlock(); // Let ESC handle unlocking for now to avoid accidental unlocks?
                        // Let's stick to the original behavior: click locks, ESC unlocks.
                        // If you *really* want click-to-unlock, uncomment the line above.
                        // For now, we just ensure click only attempts lock when unlocked.
                        console.log('Click ignored: Already locked. Use ESC to unlock.');
                    } else {
                        if (DEBUG_CONTROLS) console.log('Not locked, requesting lock');
                        controls.lock();
                    }
                } catch (error) {
                    console.error('Error toggling pointer lock:', error);
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
            
            // Show instructions when unlocked - REMOVED THIS BEHAVIOR
            /*
            const instructions = document.getElementById('instructions');
            if (instructions) {
                instructions.style.display = 'flex';
            }
            */
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
        crosshair.style.width = '10px';
        crosshair.style.height = '10px';
        crosshair.style.marginTop = '-5px';
        crosshair.style.marginLeft = '-5px';
        crosshair.style.zIndex = '999';
        crosshair.style.pointerEvents = 'none';
        crosshair.style.borderRadius = '50%';
        crosshair.style.border = '1px solid white';
        
        document.body.appendChild(crosshair);
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
            
        case 32: // space
            if (canJump === true) velocity.y += 100.0;
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
    velocity.y -= 9.8 * 80.0 * delta;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;
    
    // Set direction based on movement keys
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // Ensure consistent movement speed in all directions
    
    // Update velocity based on movement direction and speed multiplier
    const speedMultiplier = 250.0; // Further reduced speed multiplier
    if (moveForward || moveBackward) velocity.z -= direction.z * speedMultiplier * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speedMultiplier * delta;
    
    // Apply movement to controls
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    
    // Apply gravity to camera position
    camera.position.y += (velocity.y * delta);

    // Add world boundary limits
    const boundary = 45.0;
    camera.position.x = Math.max(-boundary, Math.min(boundary, camera.position.x));
    camera.position.z = Math.max(-boundary, Math.min(boundary, camera.position.z));
    
    // Check if we're on the ground
    const groundLevelY = 1.6; // Raised camera height 
    if (camera.position.y < groundLevelY) { 
        velocity.y = 0;
        camera.position.y = groundLevelY; 
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