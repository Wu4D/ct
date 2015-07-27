

var map = document.getElementById("canvas");
var map_context = map.getContext("2d");

var images = [];
var imagesLoaded = false;
images.push("http://www.clker.com/cliparts/a/G/t/e/m/W/solid-white-cloud-md.png"); 
images.push("http://localhost/cloudattack/red-circle-hi.png");



if(map_context){

}


var app = angular.module("cloudAttack",[]);
app = app.controller("mainCtrl", ['$scope', '$window', function($scope,$window){

	var url = "http://localhost:8080";

	var socket = io.connect(url);



	var map = document.getElementById("canvas");
	var map_context = map.getContext("2d");
	console.log($window.innerWidth);
	map.width = $window.innerWidth; 
	map.height = $window.innerHeight;


	var offScreenCanvas = document.createElement("canvas"); 
	offScreenCanvas.width = 2000;
	offScreenCanvas.height = 1300;
	var offScreenCanvas_context= offScreenCanvas.getContext("2d"); 

	var food = new Image(); 
	food.src = images[1]; 
	offScreenCanvas_context.drawImage(food, 0,0,25,25);

	$scope.map = {
		game_map : {
			width : 4000,
			height: 6000,
		} 
	}

	$scope.randomInt = function(min,max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	$scope.player = {
		life : 200, 
		bullets : 200,
		character : 1, 
		target_x : 0,
		target_y : 0,


	};


	$scope.free_bullets = []; 



	$scope.bullets = {
		character : {
			1 : {
				color : 'red',
			}, 
			2: {
				color : 'green',
			},
			3 : { 
				color : 'blue',
			}
		}
	}; 

	$scope.status  = { 
		game : 'running', 
		bullet_fired : false, 
		signature_active: false, 
	};


	$scope.keys = {
		space : {
			pressed : 1, 
			relesed : 1, 
		}
	}

	angular.element(map).on("mousemove", function(e){

		// $scope.player.character_x = e.pageX; 
		// $scope.player.character_y = e.pageY; 
		socket.emit('mousemove', {
			x : e.pageX, 
			y : e.pageY, 
		});
	});

	angular.element("body").on("keyup", function(e){
		console.log($scope.keys.space.pressed);

		if(e.keyCode == '32'){
			e.preventDefault();	
			


			//Check if fired bullete or activated signature
			$scope.keys.space.keydown = false;
			if((new Date().getTime() - $scope.keys.space.pressed.getTime())  / 1000  >= 0.5){
				$scope.status.signature_active = true;
				$scope.status.bullet_fired = false;
			}else{
				$scope.status.bullet_fired = true;
				$scope.status.signature_active = false;
			}
		}
		console.log($scope.status);
	});

	angular.element("body").on("keydown", function(e){

		if(e.keyCode == '32'){
			e.preventDefault(); 
			if(!$scope.keys.space.keydown){
				$scope.keys.space.pressed =  new Date();
				$scope.keys.space.keydown = true;
			}
		}



	});




	var lastTime;
	$scope.reset = function (){
		
	}


	$scope.update = function (){

	}

	$scope.createEntity = function(type){
		// var bullet = offScreenCanvas_context.getImageData(0,0,50,50); 
	
	 	var bullet = new Image();
		bullet.src= images[1];

		switch(type){
			case "free_bullets":
			// var bullet = offScreenCanvas.getImageData(0,0,50,50);
			 angular.forEach($scope.generate_free_bullets(200) , function(free_bullet){
			 	 if(free_bullet.activated){
			 	 	// map_context.putImageData(bullet, free_bullet.pos.x, free_bullet.pos.y);
			 	 	map_context.drawImage(bullet, free_bullet.pos.x, free_bullet.pos.y, 20,20);
			 	 }
			 });
			 break;
			 case "player":
			    var img = new Image(); 
			    img.src = images[0];
			 	 map_context.drawImage(img, Math.round(map.width / 2), Math.round(map.height / 2),80,50);

		}
	}

	$scope.createEntities = function(){
		$scope.createEntity("bullets");
		$scope.createEntity("free_bullets");
		$scope.createEntity("player");


	}



	$scope.render = function (){

		map_context.clearRect(0,0,map_context.canvas.width,map_context.canvas.height);

		var img = new Image();
		img.src = images[0];

		var img2 = new Image();
		img2.src = images[1]
			


		$scope.createEntities();


		if($scope.status.bullet_fired){
			map_context.drawImage(img2,$ .player.target_y, $scope.player.character_y,300,310); 
			$scope.status.bullet_fired = false;
		}

	}

	$scope.generate_free_bullets = function(number){
		if($scope.free_bullets.length <= 0){

			var free_bullets = [];
				for(var i = 0; i < number;i++){
						var free_bullet = {
						pos : {
							x : $scope.randomInt(0,map.width),
							y :  $scope.randomInt(0,map.height),
						},
						activated : true,
					}
					free_bullets.push(free_bullet);

				}
				$scope.free_bullets = free_bullets;
				return free_bullets;
		}else{
			return $scope.free_bullets;
		}

	}


	$scope.main = function(){
		var now = new Date();

		var passed = now - lastTime / 1000;

		$scope.update(passed);
		$scope.render();


		lastTime = now;
		requestAnimationFrame($scope.main);
	}


	$scope.init =  function (){
		$scope.reset();
		lastTime = new Date();
		$scope.main();
	}

	$scope.init();


}]);

