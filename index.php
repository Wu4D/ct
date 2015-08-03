<HTML ng-app="cloudAttack" ng-controller="mainCtrl">
	<head>
		<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
		<style type="text/css">
			body {background: #98C9EA;margin: 0;padding: 0}
			#canvas {margim:0;padding: 0;z-index:2;position: absolute;}
			.progress {position: absolute;width: 100%}
			#space {position: absolute;z-index:1;}
		</style>
	</head>
	<body>



		<div class="progress">
			<div class="progress-bar" role="progressbar" aria-valuenow="70"
			aria-valuemin="0" aria-valuemax="100" style="width:{{resources.prec}}%">
			{{resources.prec}}%
		</div>
	</div>
	<div id="space"></div>
	<canvas id="canvas" ></canvas>	
	<!-- <canvas id="canvas" ></canvas> -->
</body>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.17.0/TweenMax.min.js"></script>
<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
<script type="text/javascript" src="game.js"></script>
<script type="text/javascript" src="resource_loader.js"></script>
<script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
<script src="http://localhost:8080/socket.io/socket.io.js"></script>
<script type="text/javascript" src="js/background.js"></script>

</html>