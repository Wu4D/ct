$(function() {
  // Define blurAmount
  var blurAmount = 0.85;
	// Define Space
	function Space() {
		this.fps = 60;
		this.canvas = null; 
		this.width = 0;
		this.height = 0;
		this.minVelocity = 40;
		this.radius = 0;
		this.maxVelocity = 30;
		this.stars = 150;
		this.intervalId = 0;
	}

	// Define Stars
	function Star(x, y, radius, velocity) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.velocity = velocity;
	}

	Space.prototype.start = function() {

		// Set initial stars
		var stars = [],
		self = this;
		for (var i = 0; i < this.stars; i++) {
      var starRad = Math.random() * 2 + 1;
      var starVeloc = (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity;
      console.log("starRad: " + starRad * 4);
      console.log("starVeloc: " + starVeloc);
			stars[i] = new Star(
				Math.random() * this.width,
				Math.random() * this.height,
				starRad, (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity - (starRad * 4));
		}
		this.stars = stars;

		this.intervalId = setInterval(function() {
			self.update();
			self.draw();
		}, 1000 / this.fps);
	};

	Space.prototype.update = function() {
		var dt = 1 / this.fps;

		for (var i = 0; i < this.stars.length; i++) {
			var star = this.stars[i];
			star.x += dt * star.velocity * (mouseX/100);
			star.y += dt * star.velocity * (mouseY/50);

			// If the star has moved from the bottom of the screen, spawn it at the top.
			if (star.y > this.height) {
        rad1 = Math.random() * 2 + 1;
				this.stars[i] = new Star(
					Math.random() * this.width, 0, rad1, (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity);
			}
      if (star.x > this.width) {
        rad1 = Math.random() * 2 + 1;
				this.stars[i] = new Star( 0, Math.random() * this.height, rad1, (Math.random() * (this.maxVelocity - this.minVelocity )) + this.minVelocity);
			}
      // opposite ways
      if (star.y < 0) {
        rad1 = Math.random() * 2 + 1;
				this.stars[i] = new Star( Math.random() * this.width, this.height, rad1, (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity);
			}
      if (star.x < 0) {
        rad1 = Math.random() * 2 + 1;
				this.stars[i] = new Star( this.width, Math.random() * this.height, rad1, (Math.random() * (this.maxVelocity - this.minVelocity)) + this.minVelocity);
			}
		}
	};

	Space.prototype.draw = function() {

		var ctx = this.canvas.getContext("2d");
    ctx.globalAlpha = blurAmount;
		// Draw background
		ctx.fillStyle = 'rgba(22, 22, 55, 1)';
		ctx.fillRect(0, 0, this.width, this.height);
    this.stars[i] = new Star( this.width / 50, this.height / 50, 80, 0);
		// Draw stars.
		ctx.fillStyle = 'rgba(255, 255, 255, 0.73)';
		for (var i = 0; i < this.stars.length; i++) {
			var star = this.stars[i];
			ctx.beginPath();
			ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
			ctx.fill();
		}
	};

	var mouseX = 0,
		mouseY = 0;

	window.addEventListener('mousemove', function(event) {
		mouseX = event.clientX-(window.innerWidth/2);
		mouseY = event.clientY-(window.innerHeight/2);
	});

	Space.prototype.initialise = function(div) {

		var self = this;

		this.containerDiv = div;
		self.width = window.innerWidth;
		self.height = window.innerHeight;

		window.addEventListener('resize', function resize(event) {
			self.width = window.innerWidth;
			self.height = window.innerHeight;
			self.canvas.width = self.width;
			self.canvas.height = self.height;
			self.draw();
		});

		// Create the canvas.
		var canvas = document.createElement('canvas');
		div.appendChild(canvas);
		this.canvas = canvas;
		this.canvas.width = this.width;
		this.canvas.height = this.height;

	};

	var container = document.getElementById('space');
	var space = new Space();
	space.initialise(container);
	space.start();

});
