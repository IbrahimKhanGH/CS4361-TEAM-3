/**
 * first person controls for graphics learning studio
 * handles player movement and camera controls
 */

// movement flags
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let pointerLocked = false;

// physics values
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let controls;

/**
 * setup first person controls
 */
function initFirstPersonControls(camera, domElement) {
    try {
        if (!camera) {
            console.error('no camera provided');
            return;
        }
        
        // save initial position
        const initialPosition = camera.position.clone();
        
        // make sure pointer lock controls exist
        if (!THREE.PointerLockControls) {
            console.error('pointer lock controls missing');
            return;
        }
        
        // create controls
        controls = new THREE.PointerLockControls(camera, domElement);
        
        // fix camera position
        camera.position.copy(initialPosition);
        
        // handle clicks for locking mouse
        document.addEventListener('click', function(event) {
            // only react to canvas or instructions clicks
            const target = event.target;
            const isCanvas = target.closest('#canvas-container');
            const isInstructions = target.closest('#instructions');
            
            if (isCanvas || isInstructions) {
                try {
                    if (!controls.isLocked) {
                        controls.lock();
                    }
                } catch (error) {
                    console.error('pointer lock error:', error);
                }
            }
        });
        
        // handle lock event
        controls.addEventListener('lock', function() {
            pointerLocked = true;
            
            // hide instructions
            const instructions = document.getElementById('instructions');
            if (instructions) {
                instructions.style.display = 'none';
            }
        });
        
        // handle unlock event
        controls.addEventListener('unlock', function() {
            pointerLocked = false;
        });
        
        // setup keyboard controls
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        
        // add crosshair
        createCrosshair();
        
        return controls;
    } catch (error) {
        console.error('controls init error:', error);
    }
}

/**
 * create simple crosshair
 */
function createCrosshair() {
    try {
        // check if already exists
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
        console.error('crosshair error:', error);
    }
}

/**
 * handle key presses
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
            if (canJump === true) velocity.y += 65.0;
            canJump = false;
            break;
            
        case 'Tab':
        case 'KeyI':
            // toggle info panel
            const uiPanel = document.getElementById('ui-panel');
            if (uiPanel) {
                uiPanel.classList.toggle('visible');
            }
            break;
    }
}

/**
 * handle key releases
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
 * update player position and physics
 */
function updateFirstPersonControls(delta) {
    if (!controls || !pointerLocked) {
        return;
    }
    
    // apply gravity/damping with smoother values
    velocity.y -= 9.8 * 40.0 * delta; // Reduced gravity
    velocity.x *= Math.pow(0.8, delta * 60); // Smoother horizontal damping
    velocity.z *= Math.pow(0.8, delta * 60); // Smoother horizontal damping
    
    // calculate movement direction
    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();
    
    // apply movement forces with smoother acceleration
    const speedMultiplier = 150.0; // Reduced speed for better control
    if (moveForward || moveBackward) velocity.z -= direction.z * speedMultiplier * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speedMultiplier * delta;
    
    // move the camera with position interpolation
    const moveX = -velocity.x * delta;
    const moveZ = -velocity.z * delta;
    
    // Apply movement with smoothing
    controls.moveRight(moveX);
    controls.moveForward(moveZ);
    
    // apply gravity
    camera.position.y += (velocity.y * delta);

    // world boundaries with smoother clamping
    const boundary = 45.0;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -boundary, boundary);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -boundary, boundary);
    
    // ground collision with smoother handling
    const groundLevel = 1.6;
    if (camera.position.y < groundLevel) { 
        velocity.y = Math.max(0, velocity.y); // Prevent negative velocity when hitting ground
        camera.position.y = groundLevel; 
        canJump = true;
    }
    
    // check for learning stations
    if (typeof checkStationProximity === 'function') {
        checkStationProximity();
    }
}

// expose functions globally
window.initFirstPersonControls = initFirstPersonControls;
window.updateFirstPersonControls = updateFirstPersonControls; 