import * as THREE from 'three';

class SceneManager {
    constructor(canvas) {
        // class canvas {
        const screenDimensions = {
            width: canvas.width,
            height: canvas.height
        };
        const scene = buildScene();
        const renderer = buildRender(screenDimensions);
        const camera = buildCamera(screenDimensions);
        const ground = createGround();
        scene.add(ground);
        function buildScene() {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x000000);
            return scene;
        }
        function buildRender({ width, height }) {
            let renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); // renderer with transparent backdrop
            renderer.shadowMap.enabled = true; //enable shadow
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setSize(width, height);
            renderer.setClearColor(0xfffafa, 1);
            return renderer;
        }
        function buildCamera({ width, height }) {
            const aspectRatio = width / height;
            const fieldOfView = 60;
            const nearPlane = 0.1;
            const farPlane = 1000;
            const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane); // perspective camera
            camera.position.z = 4;
            // camera.position.x = -0.2;
            camera.position.y = 2.5;
            return camera;
        }
        function createGround() {
            var sides = 32;
            var tiers = 32;
            var worldRadius = 2;
            var sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
            var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, shading: THREE.FlatShading });
            var vertexIndex;
            var vertexVector = new THREE.Vector3();
            var nextVertexVector = new THREE.Vector3();
            var firstVertexVector = new THREE.Vector3();
            var offset = new THREE.Vector3();
            var currentTier = 1;
            var lerpValue = 0.5;
            var heightValue;
            var maxHeight = 0.07;
            for (var j = 1; j < tiers - 2; j++) {
                currentTier = j;
                for (var i = 0; i < sides; i++) {
                    vertexIndex = (currentTier * sides) + 1;
                    vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
                    if (j % 2 !== 0) {
                        if (i === 0) {
                            firstVertexVector = vertexVector.clone();
                        }
                        nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
                        if (i == sides - 1) {
                            nextVertexVector = firstVertexVector;
                        }
                        lerpValue = (Math.random() * (0.75 - 0.25)) + 0.25;
                        vertexVector.lerp(nextVertexVector, lerpValue);
                    }
                    heightValue = (Math.random() * maxHeight) - (maxHeight / 2);
                    offset = vertexVector.clone().normalize().multiplyScalar(heightValue);
                    sphereGeometry.vertices[i + vertexIndex] = (vertexVector.add(offset));
                }
            }
            var rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            rollingGroundSphere.scale.set(1, 2.5, 1);
            rollingGroundSphere.rotation.z += Math.PI / 2;
            ;
            return rollingGroundSphere;
        }
        this.update = function () {
            // animate scene
            ground.rotation.x += 0.005;
            renderer.render(scene, camera);
        };
        this.onWindowResize = function () {
            // resize & align if window size changes
            let sceneHeight = window.innerHeight;
            let sceneWidth = window.innerWidth;
            renderer.setSize(sceneWidth, sceneHeight);
            camera.aspect = sceneWidth / sceneHeight;
            camera.updateProjectionMatrix();
        };
    }
}

