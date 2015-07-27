<HTML ng-app="cloudAttack" ng-controller="mainCtrl">
	<head>

		<style type="text/css">
		 body {background: #98C9EA;margin: 0;padding: 0}
			canvas {margim:0;padding: 0}

		</style>
	</head>
	<body>
		<canvas id="canvas" ></canvas>	
	<!-- <canvas id="canvas" ></canvas> -->
	</body>
	<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.17.0/TweenMax.min.js"></script>
	<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
	    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.min.js"></script>
		<script type="text/javascript" src="game.js"></script>
		<script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
		<script src="http://localhost:8080/socket.io/socket.io.js"></script>

</html>