/**
 * graphics learning studio main app
 * handles core setup and animation loop
 */

// core variables
let scene, camera, renderer;
let clock = new THREE.Clock();
let animationId;

// initialization status tracker
window.appInitialized = false;

/**
 * init the 3d environment
 */
function init() {
    try {
        // create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x88ccee);
        
        // setup camera
        camera = new THREE.PerspectiveCamera(
            75, // field of view
            window.innerWidth / window.innerHeight,
            0.1, // near clip plane
            1000 // far clip plane
        );
        camera.position.set(0, 5, 20);
        
        // setup renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        
        // get canvas container
        const container = document.getElementById('canvas-container');
        if (!container) {
            const newContainer = document.createElement('div');
            newContainer.id = 'canvas-container';
            document.body.appendChild(newContainer);
            container = newContainer;
        }
        
        // add renderer to container
        container.innerHTML = '';
        container.appendChild(renderer.domElement);
        
        // store canvas for easy access
        window.appCanvas = renderer.domElement;
        
        // add lights
        addLights();
        
        // setup first-person controls
        if (typeof initFirstPersonControls === 'function') {
            window.controls = initFirstPersonControls(camera, renderer.domElement);
        } else {
            console.error('missing controls function');
        }
        
        // create world
        if (typeof createWorld === 'function') {
            createWorld();
        } else {
            console.error('missing world function');
        }
        
        // handle window resize
        window.addEventListener('resize', onWindowResize);
        
        // start animation loop
        animate();
        
        // setup click handler for instructions
        setupInstructionsClickHandler();
        
        // mark as initialized
        window.appInitialized = true;
        
        // notify that init is complete
        const event = new CustomEvent('appInitialized');
        document.dispatchEvent(event);
    } catch (error) {
        console.error('init error:', error);
    }
}

/**
 * add scene lighting
 */
function addLights() {
    // ambient light for general illumination
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    // directional light like sun
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}

/**
 * handle window resize
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * setup click handler for instructions
 */
function setupInstructionsClickHandler() {
    const instructions = document.getElementById('instructions');
    if (!instructions) {
        console.error('instructions element not found');
        return;
    }
    
    instructions.addEventListener('click', function() {
        // hide instructions
        instructions.style.display = 'none';
        
        // request pointer lock
        if (window.controls && window.controls.lock) {
            try {
                window.controls.lock();
            } catch (error) {
                console.error('pointer lock error:', error);
            }
        } else {
            console.error('controls not ready');
        }
    });
}

/**
 * animation loop
 */
function animate() {
    animationId = requestAnimationFrame(animate);
    
    try {
        // get time delta
        const delta = clock.getDelta();
        
        // update controls
        if (typeof updateFirstPersonControls === 'function') {
            updateFirstPersonControls(delta);
        }
        
        // update world animations
        if (typeof updateWorld === 'function') {
            updateWorld(clock.elapsedTime);
        }
        
        // render scene
        renderer.render(scene, camera);
    } catch (error) {
        console.error('animation error:', error);
        cancelAnimationFrame(animationId);
    }
}

/**
 * get canvas for pointer lock
 */
function getCanvas() {
    // try global reference first
    if (window.appCanvas) {
        return window.appCanvas;
    }
    
    // fallback to dom search
    const canvas = document.querySelector('canvas');
    if (canvas) {
        return canvas;
    }
    
    // last attempt
    const container = document.getElementById('canvas-container');
    if (container) {
        return container.querySelector('canvas');
    }
    
    return null;
}

// make sure functions are available globally
window.init = init;
window.animate = animate;
window.getCanvas = getCanvas; 