var container;
var camera, scene, renderer;


var keyboard ={
	gauche: false,
	droite: false,
	haut: false,
	bas: false,
	espace: false
}

window.document.addEventListener('keydown',function(e){
	if (e.keyCode == 37){ keyboard.gauche = true;}
	if (e.keyCode == 38){ keyboard.haut = true;}
	if (e.keyCode == 39){ keyboard.droite = true;}
	if (e.keyCode == 40){ keyboard.bas = true;}
	if (e.keyCode == 32){ keyboard.espace = true;}
}, false);

window.document.addEventListener('keyup',function(e){
	if (e.keyCode == 37){ keyboard.gauche = false;}
	if (e.keyCode == 38){ keyboard.haut = false;}
	if (e.keyCode == 39){ keyboard.droite = false;}
	if (e.keyCode == 40){ keyboard.bas = false;}
	if (e.keyCode == 32){ keyboard.espace = false;}
}, false);

var ship = {
	x: 0,
	y: 0,
	speed: 1
}



init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 200;

	// scene
	
	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 1, 1 ).normalize();
	scene.add( directionalLight );


	// model
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};


	var onError = function ( xhr ) { };


	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setPath( 'assets/models/millenium_falcon/' );
	mtlLoader.load( 'ship.mtl', function( materials ) {

		materials.preload();

		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.setPath( 'assets/models/millenium_falcon/' );
		objLoader.load( 'ship.obj', function ( object ) {

			object.name = "destroyer";

			object.position.y = 0;
			scene.add( object );


			object.position.y = -25;
			object.position.z = 20;

			object.rotation.x = -50;
			object.rotation.y = 600;


		}, onProgress, onError );
	});

	// var geometry = new THREE.ConeBufferGeometry( 1, 5, 3.5 );
	// var material = new THREE.MeshBasicMaterial( {color: 0xff00000, wireframe: true} );
	// var cone = new THREE.Mesh( geometry, material );


	

	// cone.rotation.x = 62;
	// cone.rotation.y = 600;

	// cone.name = "tir";

	// scene.add( cone );


	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	//

}

function move() {
	var get = scene.getObjectByName( "destroyer" );
	var tir = scene.getObjectByName( "tir" );


	if ( keyboard.gauche === true) {
		get.position.x -= 1 * ship.speed;
		get.rotation.y -= 0.01;
	}

	if (keyboard.droite === true) {
		get.position.x += 1 * ship.speed;
		get.rotation.y += 0.01;
	}

	if (keyboard.haut === true) {
		get.rotation.z -= 0.2;
	}

	if (keyboard.bas === true) {
		var limite = -43.7;

		while(get.rotation.x < limite){
			get.rotation.x += 0.1;
			break;
		}
	}

}

function animate() {
	requestAnimationFrame( animate );
	render();
	move();
}

function render() {
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}