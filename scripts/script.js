var scene,
	camera,
	controls,
	renderer,

	canvas,
	WIDTH,
	HEIGHT,

	functions = [
		{from: /Log/gi, to: 'Math.log'},

		{from: /Sin/gi, to: 'Math.sin'},
		{from: /Cos/gi, to: 'Math.cos'},
		{from: /Tan/gi, to: 'Math.tan'},

		{from: /ASin/gi, to: 'Math.asin'},
		{from: /ACos/gi, to: 'Math.acos'},
		{from: /ATan/gi, to: 'Math.atan'},

		{from: /SinH/gi, to: 'Math.sinh'},
		{from: /CosH/gi, to: 'Math.cosh'},
		{from: /TanH/gi, to: 'Math.tanh'},

		{from: /ASinH/gi, to: 'Math.asinh'},
		{from: /ACosH/gi, to: 'Math.acosh'},
		{from: /ATanH/gi, to: 'Math.atanh'},

		// Exponente 2^2
		{from: /(\d*|x|y)\^(\d*|x|y)/gi, to: 'Math.pow($1, $2)'}
	],
	constants = [
		{from: /Pi/gi, to: 'Math.PI'},
		{from: /E/gi, to: 'Math.E'}
	],

	f,

	x = {
		from: -10,
		to: 10,

		current: -10,
		increment: 0.1
	},

	coors = [],
	points = [],

	style = {
		material: new THREE.PointsMaterial({color: 0xFFFFFF, size: this.x.increment / 10}),
		max: {
			x: 10,
			y: 10,
			z: 10
		},
		min: {
			x: -10,
			y: -10,
			z: -10
		}
	},

	time;

function draw() {
	// INiciamos el timmer
	time = new Date().getTime();

	document.querySelector('.canvas .loading').style.display = 'block';

	init();
	// show_time('init');

	config();
	// show_time('config');

	define_coors();
	// show_time('define_coors');

	define_points();
	// show_time('define_points');

	document.querySelector('.canvas .loading').style.display = 'none';

	canvas = document.querySelector('.canvas');
	WIDTH = canvas.getBoundingClientRect().width;
	HEIGHT = canvas.getBoundingClientRect().height;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 1000);
	camera.position.z = 50;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	canvas.appendChild(renderer.domElement);

	controls = new THREE.OrbitControls(camera, renderer.domElement); 
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = true;

	// show_time('things...');

	draw_vertices();
	// show_time('draw_vertices');

	draw_points();
	// show_time('draw_points');

	render();
	// show_time('render');
	

	show_time('all');
}

function init() {
	// Eliminamos los canvas
	var losCanvas = document.querySelectorAll('.canvas canvas');

	if(losCanvas.length > 0) {
		for (var i = losCanvas.length - 1; i >= 0; i--) {
			losCanvas[i].remove();
		}
	}

	x = {
		from: -10,
		to: 10,

		current: -10,
		increment: 0.1
	};
	coors = [];
	points = [];

	style = {
		material: new THREE.PointsMaterial({color: 0xFFFFFF, size: this.x.increment / 10}),
		max: {
			x: 10,
			y: 10,
			z: 10
		},
		min: {
			x: -10,
			y: -10,
			z: -10
		}
	};
}

function config() {
	f = document.getElementById('f').value;

	// Eliminamos los espacios
	f = f.replace(/\s/g, '');

	// Cambiamos , por .
	f = f.replace(/\,/g, '.');

	// Reemplazamos las funciones por las nativas
	functions.forEach(function(funct) {
		f = f.replace(funct.from, funct.to);
	});

	// Reemplazamos las constantes por las nativas
	constants.forEach(function(c) {
		f = f.replace(c.from, c.to);
	});
}

function define_coors() {
	while(x.current <= x.to) {
		var y = eval(f.replace(/x/gi, x.current));

		if(isFinite(y)){
			coors.push({
				x: x.current,
				y: y,
				z: 0
			});
		}

		// X: Max and Min
		if(x.current < style.min.x)
			style.min.x = x.current;

		if(x.current > style.max.x)
			style.max.x = x.current;

		// Y: Max and Min
		if(y < style.min.y)
			style.min.y = y;

		if(y > style.max.y)
			style.max.y = y;

		x.current += x.increment;
	}
}

function define_points() {
	coors.forEach(function(coor) {
		points.push(create_point(coor.x, coor.y, coor.z));
	});
}

function create_point(x, y, z) {
	var geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(x, y, z));

	return new THREE.Points(geometry, style.material);
}

function draw_vertices() {
	var geometry,
		material;

	// Creamos X
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(style.min.x, 0, 0));
	geometry.vertices.push(new THREE.Vector3(style.max.x, 0, 0));
	material = new THREE.PointsMaterial({color: 0xFF0000});
	scene.add(new THREE.Line(geometry, material));

	// Creamos Y
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, style.min.y, 0));
	geometry.vertices.push(new THREE.Vector3(0, style.max.y, 0));
	material = new THREE.PointsMaterial({color: 0x00FF00});
	scene.add(new THREE.Line(geometry, material));

	// Creamos X
	geometry = new THREE.Geometry();
	geometry.vertices.push(new THREE.Vector3(0, 0, style.min.z));
	geometry.vertices.push(new THREE.Vector3(0, 0, style.max.z));
	material = new THREE.PointsMaterial({color: 0x0000FF});
	scene.add(new THREE.Line(geometry, material));
}

function draw_points() {
	points.forEach(function(point) {
		scene.add(point);
	});
}

function render() {
	requestAnimationFrame(render);

	controls.update();
	renderer.render(scene, camera);
}

function show_time(text) {
	if(typeof time !== 'undefined'){
		var mili = new Date().getTime();
		console.log((mili - time) / 1000, 'seconds to do:', text);
	}

	time = new Date().getTime();
}