

var map = document.getElementById("canvas");
var map_context = map.getContext("2d");

var images = [];
var imagesLoaded = false;
images.push("http://www.clker.com/cliparts/a/G/t/e/m/W/solid-white-cloud-md.png"); 
images.push("http://localhost/cloudattack/red-circle-hi.png");







var app = angular.module("cloudAttack",[]);
app = app.controller("mainCtrl", ['$scope', '$window', function($scope,$window){
	

	//Nodejs socket	
	var url = "http://localhost:8080";
	var socket = io.connect(url);


	/*
	 Handle loading all resources 

	 */
	$scope.resources = {
		res : new Object(resource_loader),
		prec : 0,
	}

	$scope.resources.res.load({bullet : 'http://localhost/cloudattack/assets/img/bullet.png'});

	var prec_timer = setInterval(function(){
		$scope.resources.prec = $scope.resources.res.getPrecent();
		$scope.$apply();
		if($scope.resources.prec >= 100){
			clearInterval(prec_timer);
		}
		
	},200);






	var map = document.getElementById("canvas");
	var map_context = map.getContext("2d");
	console.log($window.innerWidth);
	map.width = $window.innerWidth; 
	map.height = $window.innerHeight;


	socket.on("connect", function(){
	
		socket.emit("new_player", {screen_location_x : map.width / 2, screen_location_y : map.height / 2} );
	});


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

	//x2,y2 represents player position, in report to object
	$scope.isWithinDistance = function(x,y,x2,y2){
		if( (x <= x2 - (map.width / 2) || x <= x2 + (map.width / 2)) && ( (y <= y2 - (map.height / 2))  || (y <= y2 + (map.height / 2))) ){
			//If is withing range return the screen coordonates
			var screen_x = map.width / 2;
			var screen_y = map.height / 2;



			if(x < x2){
				screen_x = screen_x - (x2 - x);
			}else if(x > x2){
				screen_x = screen_x + (x - x2);
			}

			if(y < y2){
				screen_y = screen_y - (y2 - y);
			}else if(y > y2){
				screen_y = screen_y + (y - y2);
			}

			return [screen_x,screen_y];
		}

	}

	$scope.player = {
		id : '' ,
		location : '',
		width : '', 
		height : '',
		prev_location : [0,0],
		target_location : [0,0],
		screen_location : [0,0],

	};


	$scope.free_bullets = []; 
	$scope.bullets = []; 
	$scope.players = []; 

	socket.on("bullets", function(bullets){
		$scope.bullets = bullets;
	});

	socket.on("player", function(player){
		if(player != null){
			$scope.player = player ; 
		}
		// $scope.$apply();
	});

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
		// console.log($scope.keys.space.pressed);
		if(e.keyCode == '32'){
			e.preventDefault();	
			//Check if fired bullete or activated signature
			$scope.keys.space.keydown = false;
			if((new Date().getTime() - $scope.keys.space.pressed.getTime())  / 1000  >= 0.5){
				$scope.status.signature_active = true;
				$scope.status.bullet_fired = false;
					// console.log(socket.connected);
				  socket.emit("spacepress",{bullet : false});
			}else{
				$scope.status.bullet_fired = true;
				$scope.status.signature_active = false;

				socket.emit("spacepress",{bullet : true,});
				
				socket.on("disconect", function(){
					socket.socket.reconnect();
				});

			}


		}
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
		map_context.drawImage($scope.resources.res.get("bullet"),22, 22, 32,32);
		switch(type){
			case "free_bullets":
			// var bullet = offScreenCanvas.getImageData(0,0,50,50);
			 angular.forEach($scope.generate_free_bullets(200) , function(free_bullet){
			 	 if(free_bullet.activated){
			 	 	// map_context.putImageData(bullet, free_bullet.pos.x, free_bullet.pos.y);
			 	 	// map_context.drawImage(bullet, free_bullet.pos.x, free_bullet.pos.y, 20,20);
			 	 }
			 });
			 break;
			 case "player":
			    var img = new Image(); 
			    img.src = images[0];
			 	 map_context.drawImage(img, Math.round(map.width / 2), Math.round(map.height / 2),80,50);
			 break; 
			 case "bullets":
			 	for(var i = 0; i < $scope.bullets.length; i++){
			 		
			 		var bullet_screen_location = $scope.isWithinDistance($scope.bullets[i].location[0], $scope.bullets[i].location[1], $scope.player.location[0], $scope.player.location[1]);
			 		if(bullet_screen_location != undefined){
						map_context.drawImage($scope.resources.res.get("bullet"), bullet_screen_location[0], bullet_screen_location[1], 15,12);
			 		}
			 	}
			 break;
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

