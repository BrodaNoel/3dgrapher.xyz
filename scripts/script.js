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
		{from: /E/gi, to: 'Math.E'},
		{from: /LN10/gi, to: 'Math.LN10'}
	],

	f,

	x = {
		from: -10,
		to: 10,
		increment: 0.1
	},

	y = {
		from: -10,
		to: 10,
		increment: 0.1
	},

	coors = [],
	points = [],

	style = {
		is3D: true,
		material: new THREE.PointsMaterial({color: 0xFFFFFF, size: this.x.increment / 5}),
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
	// Iniciamos el timmer
	time = new Date().getTime();

	init();
	// show_time('init');

	config();
	// show_time('config');

	if(style.is3D)
		define_coors_3D();
	else
		define_coors_2D();
	// show_time('define_coors');

	define_points();
	// show_time('define_points');

	$('.canvas .loading').hide();

	canvas = document.querySelector('.canvas');
	WIDTH = canvas.getBoundingClientRect().width;
	HEIGHT = canvas.getBoundingClientRect().height;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 600);
	camera.position.z = 40;

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	canvas.appendChild(renderer.domElement);

	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.enableZoom = true;
	controls.autoRotate = true;
	controls.autoRotateSpeed = 8;

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
	coors = [];
	points = [];

	style.max = {
		x: 10,
		y: 10,
		z: 10
	};

	style.min = {
		x: -10,
		y: -10,
		z: -10
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

	x = {
		from: Number(document.getElementById('fromx').value),
		to: Number(document.getElementById('tox').value),
		increment: Number(document.getElementById('incrementx').value)
	};

	y = {
		from: Number(document.getElementById('fromy').value),
		to: Number(document.getElementById('toy').value),
		increment: Number(document.getElementById('incrementy').value)
	};
}

function define_coors_2D() {
	for(var currentX = x.from; currentX <= x.to; currentX += x.increment) {
		var y = eval(f.replace(/x/gi, currentX));

		if(isFinite(y)){
			coors.push({
				x: currentX,
				y: y,
				z: 0
			});
		}

		// X: Max and Min
		if(currentX < style.min.x)
			style.min.x = currentX;

		if(currentX > style.max.x)
			style.max.x = currentX;

		// Y: Max and Min
		if(y < style.min.y)
			style.min.y = y;

		if(y > style.max.y)
			style.max.y = y;
	}
}

function define_coors_3D() {
	for(var currentX = x.from; currentX <= x.to; currentX += x.increment) {
		for(var currentY = y.from; currentY <= y.to; currentY += y.increment) {
			var z = eval(f.replace(/x/gi, currentX).replace(/y/gi, currentY));

			if(isFinite(z)){
				coors.push({
					x: currentX,
					y: currentY,
					z: z
				});
			}

			// X: Max and Min
			if(currentX < style.min.x)
				style.min.x = currentX;

			if(currentX > style.max.x)
				style.max.x = currentX;

			// Y: Max and Min
			if(currentY < style.min.y)
				style.min.y = currentY;

			if(currentY > style.max.y)
				style.max.y = currentY;

			// Z: Max and Min
			if(z < style.min.z)
				style.min.z = z;

			if(z > style.max.z)
				style.max.z = z;
		}
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

	// Textos
	// TODO
}

function draw_points() {
	points.forEach(function(point) {
		scene.add(point);
	});
}

function render() {
	controls.update();
	renderer.render(scene, camera);

	if(continueRendering){
		requestAnimationFrame(render);
	}
}

function show_time(text) {
	if(typeof time !== 'undefined'){
		var mili = new Date().getTime();
		console.log((mili - time) / 1000, 'seconds to do:', text);
	}

	time = new Date().getTime();
}