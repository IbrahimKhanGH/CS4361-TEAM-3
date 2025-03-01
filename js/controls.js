/**
 * Custom implementation of OrbitControls for the Graphics Learning Studio
 * In a production environment, you would use the official Three.js OrbitControls
 */
THREE.OrbitControls = function(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new THREE.Vector3();
    this.enableDamping = false;
    this.dampingFactor = 0.05;
    
    const scope = this;
    const rotateSpeed = 1.0;
    const zoomSpeed = 1.2;
    const panSpeed = 0.8;
    
    let rotateStart = new THREE.Vector2();
    let rotateEnd = new THREE.Vector2();
    let rotateDelta = new THREE.Vector2();
    
    let panStart = new THREE.Vector2();
    let panEnd = new THREE.Vector2();
    let panDelta = new THREE.Vector2();
    
    let dollyStart = new THREE.Vector2();
    let dollyEnd = new THREE.Vector2();
    let dollyDelta = new THREE.Vector2();
    
    const STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2 };
    let state = STATE.NONE;
    
    this.update = function() {
        return true;
    };
    
    function rotateLeft(angle) {
        const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
        const offset = new THREE.Vector3().subVectors(camera.position, scope.target);
        offset.applyQuaternion(quaternion);
        camera.position.copy(scope.target).add(offset);
        camera.lookAt(scope.target);
    }
    
    function rotateUp(angle) {
        const quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0).normalize(), 
            angle
        );
        const offset = new THREE.Vector3().subVectors(camera.position, scope.target);
        offset.applyQuaternion(quaternion);
        camera.position.copy(scope.target).add(offset);
        camera.lookAt(scope.target);
    }
    
    function handleMouseDownRotate(event) {
        rotateStart.set(event.clientX, event.clientY);
    }
    
    function handleMouseMoveRotate(event) {
        rotateEnd.set(event.clientX, event.clientY);
        rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(rotateSpeed);
        rotateLeft(2 * Math.PI * rotateDelta.x / domElement.clientHeight);
        rotateUp(2 * Math.PI * rotateDelta.y / domElement.clientHeight);
        rotateStart.copy(rotateEnd);
    }
    
    function handleMouseWheel(event) {
        const delta = event.deltaY;
        if (delta > 0) {
            dollyOut(getZoomScale());
        } else if (delta < 0) {
            dollyIn(getZoomScale());
        }
    }
    
    function dollyIn(dollyScale) {
        const offset = new THREE.Vector3().subVectors(camera.position, scope.target);
        const dollyTarget = new THREE.Vector3().copy(scope.target);
        offset.multiplyScalar(dollyScale);
        camera.position.copy(dollyTarget).add(offset);
    }
    
    function dollyOut(dollyScale) {
        const offset = new THREE.Vector3().subVectors(camera.position, scope.target);
        const dollyTarget = new THREE.Vector3().copy(scope.target);
        offset.multiplyScalar(1/dollyScale);
        camera.position.copy(dollyTarget).add(offset);
    }
    
    function getZoomScale() {
        return Math.pow(0.95, zoomSpeed);
    }
    
    function handleMouseDown(event) {
        if (event.button === 0) {  // Left mouse button
            state = STATE.ROTATE;
            handleMouseDownRotate(event);
        } else if (event.button === 2) {  // Right mouse button
            state = STATE.PAN;
        }
    }
    
    function handleMouseMove(event) {
        if (state === STATE.ROTATE) {
            handleMouseMoveRotate(event);
        } else if (state === STATE.PAN) {
            // Pan functionality would be implemented here
        }
    }
    
    function handleMouseUp() {
        state = STATE.NONE;
    }
    
    // Add event listeners
    domElement.addEventListener('contextmenu', (event) => event.preventDefault());
    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleMouseWheel);
}; 