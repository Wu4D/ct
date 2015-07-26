

var map = document.getElementById("canvas");
var map_context = map.getContext("2d");

var images = [];
var imagesLoaded = false;
images.push("http://www.clker.com/cliparts/a/G/t/e/m/W/solid-white-cloud-md.png"); 
images.push("http://www.clker.com/cliparts/y/l/j/w/s/a/red-circle-hi.png");



if(map_context){

}


var app = angular.module("cloudAttack",[]);
app = app.controller("mainCtrl", ['$scope', function($scope){
	var map = document.getElementById("canvas");
	var map_context = map.getContext("2d");

	$scope.map = {
		width : 1280,
		height: 1200,
	}

	$scope.randomInt = function(min,max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	$scope.player = {
		life : 200, 
		bullets : 200,
		character : 1, 
		character_x : 0,
		character_y : 0,


	};



	$scope.bullets = {
		character : {
			1 : {
				çolor : 'red',
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
		$scope.player.character_x = e.pageX; 
		$scope.player.character_y = e.pageY; 
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

	$scope.render = function (){

		map_context.clearRect(0,0,map_context.canvas.width,map_context.canvas.height);

		var img = new Image();
		img.src = images[0];

		var img2 = new Image();
		img2.src = images[1]
			console.log("2");

		map_context.drawImage(img, $scope.player.character_x, $scope.player.character_y,80,50);




		if($scope.status.bullet_fired){
			map_context.drawImage(img2,$scope.player.character_x, $scope.player.character_y,300,310); 
			$scope.status.bullet_fired = false;
		}

	}

	$scope.free_bullets = function(number){
		var free_bullets = []; 
		for(var i = 0; i < number;i++){
				var free_bullet = {
				pos : {
					x : $scope.randomInt(0,$scope.map.width),
					y :  $scope.randomInt(0,$scope.map.height),
				},
				activated : true,
			}
			free_bullets.push(free_bullet);

		}
		return free_bullets;
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

