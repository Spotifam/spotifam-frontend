import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./synthViz.css";
import * as THREE from "three";

// rotating cube and tree generation/placement based on 
// https://gamedevelopment.tutsplus.com/tutorials/creating-a-simple-3d-endless-runner-game-using-three-js--cms-29157

export default class SynthViz extends Component {
    constructor(props) {
        super();
        this.bpm = 80;
        // this.refresh_limit = 1;
        // this.state = {
        //     paused_by_user: true,
        //     current_device_id: "",
        //     current_song: 0,
        //     songs: __songs,
        //     debugModeActive: true,
        //     nowPlaying: {
        //       name: '',
        //       artist: '',
        //       albumArt: '',
        //       progress_ms: 0
        //     },
        //     songPlaying: false,
        //     secondsPassed: 0,
        //     visualizerPage: false,
        // };
    }

    // // function gets called every second to update the timer
    // // every time secondsPassed gets to __refreshLimit, we want to grab info from spotify
    // tick() {
    //     if (this.state.secondsPassed > __refreshLimit) {
    //     this.api_getSongDetails();
    //     this.api_setDevice();
    //     this.setState({secondsPassed: 0});
    //     this.api_handleAutoPlay();
    //     var self = this;
    //     this.props.spotifamAPI.getQueue().then(function (result) {
    //         var list = self.state.songs;
    //         if (result) {
    //         list = result['list'];
    //         }
    //         self.setState({songs: list});
    //     });
    //     } else {
    //     this.setState({secondsPassed: this.state.secondsPassed + 1});
    //     }
    // }

    // // gets data about the song that is playing right now
    // // right now, this just creates an alert -> eventually this should set state
    // api_getNowPlaying = () => {
    //     this.props.spotifyAPI.getMyCurrentPlaybackState()
    //     .then((response) => {
    //     let info = {
    //         nowPlaying: {
    //         name: response.item.name,
    //         albumArt: response.item.album.images[0].url,
    //         spotifyURI: response.item.uri,
    //         deviceID: response.device.id
    //         }
    //     };

    //     alert(JSON.stringify(info));
    //     console.log(response);

    //     }).catch(function(err) {
    //     console.log(err);
    //     });
    // }

    // api_getSongBPM = () => {
    //     this.props.spotifyAPI.getAudioAnalysisForTrack()
    // }

    componentDidMount(){
        // === Three.js Code ===

        // scene variables
        var sceneWidth;
        var sceneHeight;
        var camera;
        var scene;
        var renderer;
        var sun;
        var rollingGroundSphere;
        var treesInPath;
        var treesPool;
        var sphericalHelper;
        var pathAngleValues;
        var worldRadius = 26;

        
        var init = function(){
            // set up the scene
            createScene();

            //call animation loop
            update();
        }

        var createScene = function(){
            // initialize tree properties
            treesInPath=[];
            treesPool=[];
            sphericalHelper = new THREE.Spherical();
            pathAngleValues=[1.52,1.57,1.62];

            // initialize scene and renderer
            sceneWidth=window.innerWidth;
            sceneHeight=window.innerHeight;
            scene = new THREE.Scene();//the 3d scene
            //scene.fog = new THREE.Fog(0x00ff00, 50, 800);//enable fog
            scene.background = new THREE.Color( 0x000000 );
            camera = new THREE.PerspectiveCamera( 40, sceneWidth / sceneHeight, 0.1, 1000 );//perspective camera
            renderer = new THREE.WebGLRenderer({alpha:true, antialias: true});//renderer with transparent backdrop
            renderer.shadowMap.enabled = true;//enable shadow
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.setSize( sceneWidth, sceneHeight );
            renderer.setClearColor(0xfffafa, 1);
            var application = document.getElementsByClassName("App");
            application[0].appendChild( renderer.domElement );

            // camera.position.z = 4;
            // // camera.position.x = -0.2;
            // camera.position.y = 2.5;

            // set camera position
            camera.position.z = 6.5;
            camera.position.y = 3;
            
            //Set up shadow properties for the sun light
            // sun = new THREE.DirectionalLight( 0xcdc1c5, 0.1);
            // sun.castShadow = true;
            // sun.position.set( 0,4,-7 );
            // scene.add(sun);
            // sun.shadow.mapSize.width = 256;
            // sun.shadow.mapSize.height = 256;
            // sun.shadow.camera.near = 0.5;
            // sun.shadow.camera.far = 50 ;

            // var light = new THREE.AmbientLight(0x444444);
            // scene.add(light);
            
      
            // var helper = new THREE.CameraHelper( sun.shadow.camera );
            // scene.add( helper );// enable to see the light cone
            
            window.addEventListener('resize', onWindowResize, false); // resize callback
            
            // scene.fog = new THREE.FogExp2( 0xf0fff0, 0.16 );
            // var hemisphereLight = new THREE.HemisphereLight(0xfffafa,0x000000, .9)
            // scene.add(hemisphereLight);


            createTreesPool(); //create pool of trees

            // material for wireframe aesthetic
            // material 
            var wireframeMaterial = new THREE.MeshPhongMaterial( {
                color: 0x6600cc,
                polygonOffset: true,
                polygonOffsetFactor: 1, // positive value pushes polygon further away
                polygonOffsetUnits: 1
            } );

            // create rolling terrain
            var sides = 100;
            var tiers = 100;
            var sphereGeometry = new THREE.SphereGeometry( worldRadius, sides,tiers);
            // var sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, shading: THREE.FlatShading });
            var vertexIndex;
            var vertexVector = new THREE.Vector3();
            var nextVertexVector = new THREE.Vector3();
            var firstVertexVector = new THREE.Vector3();
            var offset = new THREE.Vector3();
            var currentTier = 1;
            var lerpValue = 0.5;
            var heightValue;
            var maxHeight = 0.07;
            for(var j=1;j<tiers-2;j++){
                currentTier=j;
                for(var i=0;i<sides;i++){
                    vertexIndex = (currentTier*sides)+1;
                    vertexVector = sphereGeometry.vertices[i+vertexIndex].clone();
                    if(j%2 !== 0){
                        if(i === 0){
                            firstVertexVector=vertexVector.clone();
                        }
                        nextVertexVector=sphereGeometry.vertices[i+vertexIndex+1].clone();
                        if(i == sides-1){
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
            rollingGroundSphere = new THREE.Mesh( sphereGeometry, wireframeMaterial );

            // creates wireframe mode
            var geo = new THREE.EdgesGeometry( rollingGroundSphere.geometry ); // or WireframeGeometry
            var mat = new THREE.LineBasicMaterial( { color: 0xd941d2, linewidth: 100 } );
            var wireframeMode = new THREE.LineSegments( geo, mat );

            rollingGroundSphere.add(wireframeMode);
            // rollingGroundSphere.scale.set(1,2.5,1);
            // rollingGroundSphere.rotation.z += Math.PI / 2;;
            rollingGroundSphere.rotation.z = Math.PI / 2;
            scene.add(rollingGroundSphere);
            rollingGroundSphere.position.y=-24;
            rollingGroundSphere.position.z=2;
            
            // add trees to scene
            addWorldTrees();

            // create physical background sun
            var cylinder = new THREE.CylinderGeometry( 16, 16, 1, 24 );
            var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
            var cylinderSun = new THREE.Mesh( cylinder, material );
            cylinderSun.scale.set(0.3, 0.3, 0.3);
            cylinderSun.position.y += 2.5;
            cylinderSun.position.z -= 15;
            cylinderSun.rotation.z += Math.PI / 2;
            cylinderSun.rotation.y += Math.PI / 2;
            scene.add( cylinderSun );


            // add lines to sun for [s y n t h w a v e] aesthetic
            var rectMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
            var rectGeo = new THREE.BoxGeometry(2, 0.1, 0.1);
            var rect1 = new THREE.Mesh(rectGeo, rectMaterial);
            rect1.position.y += 4;
            rect1.position.z -= 14;
            rect1.scale.set(5, 1.2, 2);
            scene.add(rect1);

            var rect2 = new THREE.Mesh(rectGeo, rectMaterial);
            rect2.position.y += 3.4;
            rect2.position.z -= 14;
            rect2.scale.set(5, 1.8, 2);
            scene.add(rect2);

            var rect3 = new THREE.Mesh(rectGeo, rectMaterial);
            rect3.position.y += 2.7;
            rect3.position.z -= 14;
            rect3.scale.set(5, 2.5, 2);
            scene.add(rect3);

            var rect4 = new THREE.Mesh(rectGeo, rectMaterial);
            rect4.position.y += 2;
            rect4.position.z -= 14;
            rect4.scale.set(5, 3, 2);
            scene.add(rect4);

            var rect5 = new THREE.Mesh(rectGeo, rectMaterial);
            rect5.position.y += 1.3;
            rect5.position.z -= 14;
            rect5.scale.set(5, 3.3, 2);
            scene.add(rect5);

            var rect6 = new THREE.Mesh(rectGeo, rectMaterial);
            rect6.position.y += 0.5;
            rect6.position.z -= 14;
            rect6.scale.set(5, 4.2, 2);
            scene.add(rect6);

            var rect7 = new THREE.Mesh(rectGeo, rectMaterial);
            rect7.position.y -= 0.2;
            rect7.position.z -= 14;
            rect7.scale.set(5, 3, 2);
            scene.add(rect7);
            

            // gltfLoader = new THREE.GLTFLoader();
            // const url = './mountains.gltf';
            // gltfLoader.load(url, (gltf) => {
            // const root = gltf.scene;
            // scene.add(root);
            // });

            // create the particle variables
            // var particleCount = 1800,
            // particles = new THREE.Geometry(),
            // var particleMaterial = new THREE.ParticleBasicMaterial({
            //     color: 0xFFFFFF,
            //     size: 20
            // });

            // var particleGeometry = new THREE.BufferGeometry();
            // var vertices = [];
            
            // for ( var i = 0; i < 10000; i ++ ) {

            //     var x = Math.random() * 2000 - 1000;
            //     var y = Math.random() * 2000 - 1000;
            //     var z = Math.random() * 2000 - 1000;

            //     vertices.push( x, y, z );

            // }

            // particleGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

            // for ( var i = 0; i < 4; i ++ ) {

            //     var particles = new THREE.Points( particleGeometry, particleMaterial );

            //     particles.rotation.x = Math.random() * 6;
            //     particles.rotation.y = Math.random() * 6;
            //     particles.rotation.z = Math.random() * 6;

            //     scene.add( particles );

            // }
        }

        // creates single tree
        var createTree = function(){
            var sides=8;
            var tiers=6;
            var scalarMultiplier=(Math.random()*(0.25-0.1))+0.05;
            var midPointVector= new THREE.Vector3();
            var vertexVector= new THREE.Vector3();
            var treeGeometry = new THREE.ConeGeometry( 0.5, 1, sides, tiers);

            var wireframeTreeMaterial = new THREE.MeshPhongMaterial( {
                color: 0xff0000,
                polygonOffset: true,
                polygonOffsetFactor: 1, // positive value pushes polygon further away
                polygonOffsetUnits: 1
            } );

            var treeMaterial = wireframeTreeMaterial; //new THREE.MeshStandardMaterial( { color: 0x33ff33,shading:THREE.FlatShading  } );
            var offset;
            midPointVector=treeGeometry.vertices[0].clone();
            var currentTier=0;
            var vertexIndex;
            blowUpTree(treeGeometry.vertices,sides,0,scalarMultiplier);
            tightenTree(treeGeometry.vertices,sides,1);
            blowUpTree(treeGeometry.vertices,sides,2,scalarMultiplier*1.1,true);
            tightenTree(treeGeometry.vertices,sides,3);
            blowUpTree(treeGeometry.vertices,sides,4,scalarMultiplier*1.2);
            tightenTree(treeGeometry.vertices,sides,5);
            var treeTop = new THREE.Mesh( treeGeometry, treeMaterial );
            // creates wireframe mode
            var treeTopGeo = new THREE.EdgesGeometry( treeTop.geometry ); // or WireframeGeometry
            var treeTopMat = new THREE.LineBasicMaterial( { color: 0x04e9ee, linewidth: 2 } );
            var wireframeTreeTopMode = new THREE.LineSegments( treeTopGeo, treeTopMat );
            treeTop.add(wireframeTreeTopMode);

            treeTop.castShadow=true;
            treeTop.receiveShadow=false;
            treeTop.position.y=0.9;
            // treeTop.rotation.y=(Math.random()*(Math.PI));
            var treeTrunkGeometry = new THREE.CylinderGeometry( 0.1, 0.1,0.5);
            var trunkMaterial = new THREE.MeshStandardMaterial( { color: 0x886633,shading:THREE.FlatShading  } );
            var treeTrunk = new THREE.Mesh( treeTrunkGeometry, trunkMaterial );
            var treeTrunkGeo = new THREE.EdgesGeometry( treeTrunk.geometry ); // or WireframeGeometry
            var treeTrunkMat = new THREE.LineBasicMaterial( { color: 0x04e9ee, linewidth: 2 } );
            var wireframeTreeTrunkMode = new THREE.LineSegments( treeTrunkGeo, treeTrunkMat );
            treeTrunk.add(wireframeTreeTrunkMode);

            treeTrunk.position.y=0.25;
            var tree =new THREE.Object3D();
            tree.add(treeTrunk);
            tree.add(treeTop);

            // // creates wireframe mode
            // var treeGeo = new THREE.EdgesGeometry( treeGeometry ); // or WireframeGeometry
            // var treeMat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
            // var wireframeTreeMode = new THREE.LineSegments( treeGeo, treeMat );

            // tree.add(wireframeTreeMode);
            return tree;
        }

        // configures tree geometry
        var blowUpTree = function(vertices,sides,currentTier,scalarMultiplier,odd){
            var vertexIndex;
            var vertexVector= new THREE.Vector3();
            var midPointVector=vertices[0].clone();
            var offset;
            for(var i=0;i<sides;i++){
                vertexIndex=(currentTier*sides)+1;
                vertexVector=vertices[i+vertexIndex].clone();
                midPointVector.y=vertexVector.y;
                offset=vertexVector.sub(midPointVector);
                if(odd){
                    if(i%2===0){
                        offset.normalize().multiplyScalar(scalarMultiplier/6);
                        vertices[i+vertexIndex].add(offset);
                    }else{
                        offset.normalize().multiplyScalar(scalarMultiplier);
                        vertices[i+vertexIndex].add(offset);
                        vertices[i+vertexIndex].y=vertices[i+vertexIndex+sides].y+0.05;
                    }
                }else{
                    if(i%2!==0){
                        offset.normalize().multiplyScalar(scalarMultiplier/6);
                        vertices[i+vertexIndex].add(offset);
                    }else{
                        offset.normalize().multiplyScalar(scalarMultiplier);
                        vertices[i+vertexIndex].add(offset);
                        vertices[i+vertexIndex].y=vertices[i+vertexIndex+sides].y+0.05;
                    }
                }
            }
        }

        // normalizes tree
        var tightenTree = function(vertices,sides,currentTier){
            var vertexIndex;
            var vertexVector= new THREE.Vector3();
            var midPointVector=vertices[0].clone();
            var offset;
            for(var i=0;i<sides;i++){
                vertexIndex=(currentTier*sides)+1;
                vertexVector=vertices[i+vertexIndex].clone();
                midPointVector.y=vertexVector.y;
                offset=vertexVector.sub(midPointVector);
                offset.normalize().multiplyScalar(0.06);
                vertices[i+vertexIndex].sub(offset);
            }
        }

        // add trees to world
        var addWorldTrees = function(){
            var numTrees=36;
            var gap=6.28/36;
            for(var i=0;i<numTrees;i++){
                addTree(false,i*gap, true);
                addTree(false,i*gap, false);
            }
        }
        
        // add tree to path
        var addTree = function(inPath, row, isLeft){
            var newTree;
            if(inPath){
                if(treesPool.length===0)return;
                newTree=treesPool.pop();
                newTree.visible=true;
                //console.log("add tree");
                treesInPath.push(newTree);
                sphericalHelper.set( worldRadius-5.3, pathAngleValues[row], -rollingGroundSphere.rotation.x );
            }else{
                newTree=createTree();
                var forestAreaAngle=0;//[1.52,1.57,1.62];
                if(isLeft){
                    forestAreaAngle=1.68+Math.random()*0.1;
                }else{
                    forestAreaAngle=1.46-Math.random()*0.1;
                }
                sphericalHelper.set( worldRadius-0.3, forestAreaAngle, row );
            }
            newTree.position.setFromSpherical( sphericalHelper );
            var rollingGroundVector=rollingGroundSphere.position.clone().normalize();
            var treeVector=newTree.position.clone().normalize();
            newTree.quaternion.setFromUnitVectors(treeVector,rollingGroundVector);
            // newTree.rotation.x+=(Math.random()*(2*Math.PI/10))+-Math.PI/10;
            // newTree.rotation.x += 0;
            newTree.position.x += 0.2;
            
            rollingGroundSphere.add(newTree);
        }
        
        // create amount of trees (default is 10)
        var createTreesPool = function(){
            var maxTreesInPool=10;
            var newTree;
            for(var i=0; i<maxTreesInPool;i++){
                newTree=createTree();
                treesPool.push(newTree);
            }
        }

        // add tree to path
        var addPathTree = function(){
            var options=[0,1,2];
            var lane= Math.floor(Math.random()*3);
            addTree(true,lane);
            options.splice(lane,1);
            if(Math.random()>0.5){
                lane= Math.floor(Math.random()*2);
                addTree(true,options[lane]);
            }
        }

        // add trees to scene
        var addWorldTrees = function(){
            var numTrees=36;
            var gap=6.28/36;
            for(var i=0;i<numTrees;i++){
                addTree(false,i*gap, true);
                addTree(false,i*gap, false);
            }
        }

        // updates animation loop
        var update = function(){
            // animate
            // if(this.bpm <= 50) rollingGroundSphere.rotation.x += 0.0005;
            // else if(this.bpm > 50 && this.bpm <= 70) rollingGroundSphere.rotation.x += 0.001;
            // else if(this.bpm > 70 && this.bpm <= 90) rollingGroundSphere.rotation.x += 0.0015;
            // else if(this.bpm > 90 && this.bpm <= 110) rollingGroundSphere.rotation.x += 0.0021;
            // else if(this.bpm > 110 && this.bpm <= 120) rollingGroundSphere.rotation.x += 0.0026;
            // else if(this.bpm > 120 && this.bpm <= 140) rollingGroundSphere.rotation.x += 0.003;
            // else if(this.bpm > 140 && this.bpm <= 155) rollingGroundSphere.rotation.x += 0.0035;
            // else if(this.bpm > 155 && this.bpm <= 170) rollingGroundSphere.rotation.x += 0.0041;
            // else if(this.bpm > 170 && this.bpm <= 185) rollingGroundSphere.rotation.x += 0.0045;
            // else if(this.bpm > 185 && this.bpm <= 200) rollingGroundSphere.rotation.x += 0.0051;
            // else rollingGroundSphere.rotation.x += 0.0056;

            rollingGroundSphere.rotation.x += 0.002;

            render();
            requestAnimationFrame(update); //request next update
        }

        // renders scene
        var render = function(){
            renderer.render(scene, camera); //draw
        }

        // resize scene/camera on resizing of window
        var onWindowResize = function() {
            //resize & align
            sceneHeight = window.innerHeight;
            sceneWidth = window.innerWidth;
            renderer.setSize(sceneWidth, sceneHeight);
            camera.aspect = sceneWidth/sceneHeight;
            camera.updateProjectionMatrix();
        }

        init(); // initialize scene
    }

    // render react component
    render() {
        return (
            <div id="canvas-mount" ref={ref => (this.mount = ref)}>
                <a href="#" id="backButton" onClick={() => this.props.turnOffVisualizer()}>Back to Spotifam Queue</a>
            </div>
        )
    }
}

// if want visualizer in the player page, here you go :)
// const rootElement = document.getElementById("root");
// ReactDOM.render(<SynthViz />, rootElement);
