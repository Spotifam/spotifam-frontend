// Code from https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157
// used as base for development of three.js scene

var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var hero;
var sun;
var ground;
var orbitControl;

init();
function init() {
	// set up the scene
	createScene();

	//call animation loop
	update();
}

function createScene(){
    sceneWidth=window.innerWidth;
    sceneHeight=window.innerHeight;
    scene = new THREE.Scene();//the 3d scene
	//scene.fog = new THREE.Fog(0x00ff00, 50, 800);//enable fog
	scene.background = new THREE.Color( 0x000000 );
    camera = new THREE.PerspectiveCamera( 60, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
    renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
    renderer.shadowMap.enabled = true;//enable shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize( sceneWidth, sceneHeight );
	renderer.setClearColor(0xfffafa, 1);
    document.body.appendChild( renderer.domElement );

	camera.position.z = 4;
	// camera.position.x = -0.2;
	camera.position.y = 2.5;
	
	sun = new THREE.DirectionalLight( 0xcdc1c5, 0.4);
	sun.castShadow = true;
	sun.position.set( 0,4,-7 );
	scene.add(sun);
	//Set up shadow properties for the sun light
	sun.shadow.mapSize.width = 256;
	sun.shadow.mapSize.height = 256;
	sun.shadow.camera.near = 0.5;
	sun.shadow.camera.far = 50 ;
	
	// orbitControl = new THREE.OrbitControls( camera, renderer.domElement );//helper to rotate around in scene
	// orbitControl.addEventListener( 'change', render );
	//orbitControl.enableDamping = true;
	//orbitControl.dampingFactor = 0.8;
	// orbitControl.enableZoom = false;
	
	// var helper = new THREE.CameraHelper( sun.shadow.camera );
	// scene.add( helper );// enable to see the light cone
	
	window.addEventListener('resize', onWindowResize, false);//resize callback
	
	scene.fog = new THREE.FogExp2( 0xf0fff0, 0.16 );
	// var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
	// scene.add(hemisphereLight);

	var sides=32;
	var tiers=32;
	var worldRadius = 2;
	var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
	var sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xffffff, shading:THREE.FlatShading} )
	var vertexIndex;
	var vertexVector= new THREE.Vector3();
	var nextVertexVector= new THREE.Vector3();
	var firstVertexVector= new THREE.Vector3();
	var offset= new THREE.Vector3();
	var currentTier=1;
	var lerpValue=0.5;
	var heightValue;
	var maxHeight=0.07;
	for(var j=1;j<tiers-2;j++){
		currentTier=j;
		for(var i=0;i<sides;i++){
			vertexIndex=(currentTier*sides)+1;
			vertexVector=sphereGeometry.vertices[i+vertexIndex].clone();
			if(j%2!==0){
				if(i===0){
					firstVertexVector=vertexVector.clone();
				}
				nextVertexVector=sphereGeometry.vertices[i+vertexIndex+1].clone();
				if(i==sides-1){
					nextVertexVector=firstVertexVector;
				}
				lerpValue=(Math.random()*(0.75-0.25))+0.25;
				vertexVector.lerp(nextVertexVector,lerpValue);
			}
			heightValue=(Math.random()*maxHeight)-(maxHeight/2);
			offset=vertexVector.clone().normalize().multiplyScalar(heightValue);
			sphereGeometry.vertices[i+vertexIndex]=(vertexVector.add(offset));
		}
	}
	rollingGroundSphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
	rollingGroundSphere.scale.set(1,2.5,1);
	rollingGroundSphere.rotation.z += Math.PI / 2;;
	
	scene.add(rollingGroundSphere);
	

	
}

function update(){
    //animate
	rollingGroundSphere.rotation.x += 0.005;
    render();
	requestAnimationFrame(update); //request next update
}

function render(){
    renderer.render(scene, camera); //draw
}

function onWindowResize() {
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}