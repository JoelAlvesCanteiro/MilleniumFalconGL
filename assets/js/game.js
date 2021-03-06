var container;
var camera, scene, renderer;


var game = {
	width: window.innerWidth,
	height: window.innerHeight
}


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
	if (e.keyCode == 81){ keyboard.q = true;}
	if (e.keyCode == 68){ keyboard.d = true;}
}, false);

window.document.addEventListener('keyup',function(e){
	if (e.keyCode == 37){ keyboard.gauche = false;}
	if (e.keyCode == 38){ keyboard.haut = false;}
	if (e.keyCode == 39){ keyboard.droite = false;}
	if (e.keyCode == 40){ keyboard.bas = false;}
	if (e.keyCode == 32){ keyboard.espace = false;}
	if (e.keyCode == 81){ keyboard.q = false;}
	if (e.keyCode == 68){ keyboard.d = false;}

}, false);

var ship = {
	vie: 1000,
	x: 0,
	y: 0,
	speed: 1,
	backflip: false,
	flip_l: false,
	flip_r: false,
	tir: [],
	cadenceTir : 750,
	cooldown : 0
}

var destroyer = {
	vie: 2000,
	x: 0,
	y: 0,
	speed: 1,
	tir: [],
	cadenceTir : 1000,
	cooldown : 0
}



init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 20, game.width / game.height, 1, 2000 );
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

			object.name = "main";

			object.position.y = 0;
			scene.add( object );


			object.position.y = -25;
			object.position.z = 20;

			object.rotation.x = -50;
			object.rotation.y = 600;


		}, onProgress, onError );
	});


	var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( 'assets/models/destroyer/' );
    mtlLoader.load( 'ship.mtl', function( materials ) {
    
        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( 'assets/models/destroyer/' );
        objLoader.load( 'ship.obj', function ( object ) {

            object.name = "destroyer";

            object.position.y = 0;
            scene.add( object );


            object.position.y = 8;
            object.position.z = 60;
            object.position.x = 20;

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
	var get = scene.getObjectByName( "main" );
	var tir = scene.getObjectByName( "tir" );

	var border = game.width/40;

	if (get.position.x < border && get.position.x > -border) {

		if ( keyboard.gauche === true) {
			get.position.x -= 1 * ship.speed;
			// get.rotation.y -= 0.01;
		}

		if (keyboard.droite === true) {
			get.position.x += 1 * ship.speed;
			// get.rotation.y += 0.01;
		}

		if (keyboard.q === true) {
			ship.flip_l = true;
		}

		if (keyboard.d === true) {
			ship.flip_r = true;
		}

		if (keyboard.bas === true) {
			ship.backflip = true;
		}
	} else if (get.position.x < border) {
		get.position.x = -border +1;
	} else if (get.position.x > -border) {
		get.position.x = border -1;
	}



	if (ship.backflip === true) {		
		var limite = -43.7;

		do {
			get.rotation.x += 0.1;
			break;
		} while (get.rotation.x < limite);

		if (get.rotation.x >= limite) {
			get.rotation.x = -50;
			ship.backflip = false;
		}

	}

	if (ship.flip_r === true) { 		
		var limite_r = 6;

		ship.flip_l = false;

		do {
			get.rotation.z += 0.2;
			break;
		} while (get.rotation.z < limite_r);

		if (get.rotation.z >= limite_r) {
			get.rotation.z = 0;
			ship.flip_r = false;
		}

	}

	if (ship.flip_l === true) {		
		var limite_l = -6;

		ship.flip_r = false;

		do {
			get.rotation.z -= 0.2;
			break;
		} while (get.rotation.z > limite_l);

		if (get.rotation.z <= limite_l) {
			get.rotation.z = 0;
			ship.flip_l = false;
		}

	}

}

function tir(){

	var get = scene.getObjectByName( "main" );


	if (keyboard.espace === true && Date.now() - ship.cooldown > ship.cadenceTir) {
		
		var audio = document.createElement('audio');
  		var source = document.createElement('source');
  		source.src = '/assets/music/Faucon laser 2.mp3';
  		audio.appendChild(source);
  		audio.play();
  		audio.volume = 0.2;
		var geometry = new THREE.ConeBufferGeometry( 0.2, 25, 3.5 );
		var material = new THREE.MeshBasicMaterial( {color: 0x70001B} );
		var cone = new THREE.Mesh( geometry, material );

		cone.position.x = get.position.x + 0.5;
		cone.position.y = get.position.y + 5;
		cone.rotation.x = 62;
		cone.rotation.y = 0;
		cone.rotation.z = 0;

		ship.tir.push(cone);

		ship.cooldown = Date.now();


	}



}

function moveTir(){

	for (var i = ship.tir.length - 1; i >= 0; i--) {

		var get = scene.getObjectByName( "destroyer" );

		var tirs = ship.tir;
		let laser = ship.tir[i];

		laser.name = "tir"+[i];

		laser.position.z -= 10;
		laser.position.y += 1.5;


		scene.add( laser );


		if (laser.position.y > get.position.y - 25 && laser.position.y < get.position.y + 25) {

			
			if (laser.position.x > get.position.x - 1000&& laser.position.x < get.position.x + 1000) {

				destroyer.vie -= 1;

			}

		}

		
	}

}


function tirDestroyer(){

	var get = scene.getObjectByName( "destroyer" );

	if (Date.now() - destroyer.cooldown > destroyer.cadenceTir) {
		
		var audio = document.createElement('audio');
  		var source = document.createElement('source');
  		source.src = '/assets/music/laser.mp3';
  		audio.appendChild(source);
	  		audio.play();
	  		audio.volume = 0.2;
		var geometry = new THREE.ConeBufferGeometry( 0.2, 25, 3.5 );
		var material = new THREE.MeshBasicMaterial( {color: 0x1DB000} );
		var cone = new THREE.Mesh( geometry, material );

		cone.position.x = get.position.x + (Math.floor((Math.random() * 50) - 50));
		cone.position.y = get.position.y + 5;
		cone.rotation.x = 250;
		cone.rotation.y = 0;
		cone.rotation.z = 0;

		destroyer.tir.push(cone);

		destroyer.cooldown = Date.now();


	}



}

function moveTirDestroyer(){

	for (var i = destroyer.tir.length - 1; i >= 0; i-=3) {

		var get = scene.getObjectByName( "main" );

		var shoot = destroyer.tir;
		let tir = destroyer.tir[i];

		border = game.height;

		tir.name = "tir"+[i];

		tir.position.z += 1;
		tir.position.y -= 1.5;


		scene.add( tir );

		if (tir.position.y > get.position.y - 25 && tir.position.y < get.position.y + 25) {

			
			if (tir.position.x > get.position.x - 10 && tir.position.x < get.position.x + 10) {
				ship.vie -= 1;

			}

		}
	}

}


function animate() {
	requestAnimationFrame( animate );
	render();
	tir();
	tirDestroyer();
	moveTir();
	moveTirDestroyer();
	move();
}

function render() {
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
}


function end() {
	if (ship.vie <= 0 || destroyer.vie <= 0) {
		window.location.replace('endgame.html');
	}
}