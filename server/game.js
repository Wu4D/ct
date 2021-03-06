var sys = require("sys");
var app = require("http").createServer(function(request, response){

});

app.listen(8080, function(){
	console.log("listening on port 8080");
});

var io = require("socket.io")(app, {log: true});
var debug = true;
var sockets = {};


var vector = {
	x : 0 ,
	y : 0, 
	distance: 0,
	angle: 0,

	//This function is for converting from screen map 
	toPolar : function(){
		this.angle = Math.atan2(this.y, this.x);
	},

	magnitude : function(){

		this.distance = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
		// console.log("distance"+y );
		// console.log("X:"+this.x);

	},

	toCartesian : function(){

		this.x = this.distance * Math.cos(this.angle); 
		this.y = this.distance * Math.sin(this.angle);
		// console.log("Here "+this.x+ " y:"+this.y+ " ditance :"+this.distance+ " angle :"+this.angle);
	},

	screenToMap : function(x,y, target_x,target_y){
		if(x - target_x < 0 ){
			this.x +=  Math.abs(x - target_x); 
		}else{
			this.x -= Math.abs(x - target_x);
		}

		if(y - target_y < 0){
			this.y += Math.abs(y - target_y);
		}else{
			this.y -= Math.abs(y - target_y);
		}

	},

	div : function(value){
		this.x = this.x / value; 
		this.y = this.y / value;
	},


	normalize : function(){

		if(this.distance != 0){
			this.div(this.distance);
		}
		// console.log('Normal x :'+this.x);

	},


	multiply : function(value){
		this.x = this.x * value;
		this.y = this.y * value;
		// this.distance  = this.distance * value;
	}

} 

var init = {

	players : [], 
	players_id_key : {},
	bullets : [],
	free_buulets : [],
	config : {
		map : 
		{
			width : 4000, 
			height : 4000,
		}, 
		players : {
   			minimum_spawn_distance : 200, // The minmum spawned player distance from another player
   			default_width : 80,
   			default_height : 50,
   			default_speed : 250, //7 px per second 
   			default_bullet_distance: 1000,  
   			default_bullet_speed : 700, //200 px per second
   		},

   		time : {
   			lastUpdate : 0 ,
   			last_update_sec_diff : 0,
   		}
   	},


   	foods : [],



   	generateInt : function(min,max){
   		return Math.floor(Math.random() * (max - min +1)) + min;
   	},

   	generePlayerLocation : function(){
    	//Loop trough all the players location and set the minimum distance of 300 pixels
    	if(this.players.length == 0){
    		var x = this.generateInt(1 + this.config.players.default_width, this.config.map.width - this.config.players.default_width); 
    		var y = this.generateInt(1 + this.config.players.default_height, this.config.map.height - this.config.players.default_height); 

    		return [x, y];
    	}

    	for(var i =0; i < this.players.length; i++){
    		var x = this.generateInt(1 + this.config.players.default_width, this.config.map.width - this.config.players.default_width); 
    		var y = this.generateInt(1 + this.config.players.default_height, this.config.map.height - this.config.players.default_height); 
    		if( (x <  this.players[i].location[0] +  this.players[i].width || x >  this.players[i].location[0] +  this.players[i].width ) &&
    			(y <  this.players[i].location[1] +  this.players[i].height || y >  this.players[i].location[1] +  this.players[i].height)){
    			return [x, y];
    	}else{
    		if(i ==  this.players.length){
    			i = 0;
    		}
    	}

    }
},

generate_free_bullets : function(number){
	

	var free_bullets = [];
	for(var i = 0; i < number;i++){
		var free_bullet = {
			location : 
			[this.generateInt(0,this.config.map.width),
			this.generateInt(0,this.config.map.height)]
			,
			activated : true,
		}
		free_bullets.push(free_bullet);

	}
	this.free_bullets = free_bullets;

	

},

new_player : function(player_id,data){
	var player = {
		id : player_id ,
		location : this.generePlayerLocation(),
		width : this.config.players.default_width, 
		height : this.config.players.default_height,
		before_location : [0,0],
		target_location : [0,0],
		screen_location : [(data.hasOwnProperty("screen_location_x") ? data.screen_location_x : 0), (data.hasOwnProperty("screen_location_y") ? data.screen_location_y : 0)],

	}


	this.players.push(player);
	this.players_id_key[player_id] = this.players.length - 1; 


},

update_player_location : function(player){
   		//Calculate the player location and update the x and y 
   		
   		var x = player.location[0];
   		var y = player.location[1];
   		// console.log("HEre  \n\n\n\n"+x);


   		var player_vector = new Object(vector); 
   		player_vector.x =  player.target_location[0] - player.before_location[0]; 
   		player_vector.y =   player.target_location[1] - player.before_location[1]; 
   		// console.log("target_location x: "+player.before_location[0] + " y : "+player.before_location[1]);


	 	// console.log(player_vector.x);
	 	player_vector.magnitude();
	 	player_vector.normalize();
	 	player_vector.multiply((this.config.players.default_speed * this.config.time.last_update_sec_diff)); 

   	    // console.log("X::::"+player.target_location[0]);

   	    player.location[0] +=  player_vector.x;
   	    player.location[1] +=  player_vector.y;
   	    // console.log("loc:     x = "+player.location[0] + ", y = "+player.location[1]);



   	    if(player.location[0] >= this.config.map.width - this.config.players.default_width && player.location[1] >= this.config.map.height - this.config.players.default_height){

   	    	player.location[0] = x;
   	    	player.location[1] = y;


   	    // console.log("X: "+player.location[0]);
   	    // console.log("y: "+player.location[1]);
   	}

   },

   update_player : function(data,player_id){
   	var player = this.players[this.players_id_key[player_id]];
   	if(data.hasOwnProperty("x") && data.hasOwnProperty("y")){

   		var player_vector = new Object(vector); 

   		player_vector.x = player.location[0] ; 
   		player_vector.y = player.location[1];

   		player_vector.screenToMap(player.screen_location[0], player.screen_location[1], data.x, data.y); 
   		player.target_location[0] = player_vector.x;
   		player.target_location[1] = player_vector.y;

   		player.before_location[0] = player.location[0];
   		player.before_location[1] = player.location[1];

   	}
   	if(data.hasOwnProperty('screen_location_x') && data.hasOwnProperty('screen_location_y')){
   		player.screen_location[0] = data.screen_location_x;
   		player.screen_location[1] = data.screen_location_y;

   	}



   },

   update_players_location: function(){
   	var length = this.players.length;
   	for(var i = 0; i < length;i++){
   		this.update_player_location(this.players[i]);
   	}
   },

   spacepress : function(data,player_id){
   	var player = this.players[this.players_id_key[player_id]];

   	if(data.bullet){

   		


    		//Fire bullet
    		var bullet = {
    			id : player.id + this.bullets.length, 
    			// fired_location : [player.screen_location[0], player.screen_location[1]], //This is the player on screen location: ex x: screenWidth / 2 
    			fired_location :  [player.location[0] + (this.config.players.default_width / 2), player.location[1] + (this.config.players.default_height / 2)],
    			prev_location : [0,0],
    			location :  [player.location[0] + (this.config.players.default_width / 2), player.location[1] + (this.config.players.default_height / 2)],
    			target_location : [player.target_location[0], player.target_location[1]],
    			distance : 0,
    		};
    		console.log("BULLET");
    		console.log(bullet);

    		console.log("PLAyer");

    		console.log(player);
    		this.bullets.push(bullet);
    	}else{
    		//Activate special ability
    	}
    },

    update_bullet_movments : function(){

    	for(var i = 0 ; i < this.bullets.length;i++){
    		var bullet = this.bullets[i];

    		if(bullet.distance < this.config.players.default_bullet_distance){
    			// console.log("heree");
    			var x = bullet.location[0];
    			var y = bullet.location[1];

    			// console.log(bullet.distance);
    			var bullet_vector = new Object(vector);
    			bullet_vector.x = bullet.target_location[0] - bullet.fired_location[0];
    			bullet_vector.y = bullet.target_location[1] - bullet.fired_location[1];


    			bullet_vector.magnitude();
    			bullet_vector.normalize();
    			bullet_vector.multiply(this.config.players.default_bullet_speed * this.config.time.last_update_sec_diff);


				// console.log(bullet.target_location[0]);

				bullet.location[0] += bullet_vector.x ;
				bullet.location[1] += bullet_vector.y ;
		   	    // console.log(bullet.location);

		   	    bullet.distance += this.config.players.default_bullet_speed * this.config.time.last_update_sec_diff ;


		   	}else{

		   		// console.log("Deleting");
		   		this.bullets.splice(i,1);
		   		console.log(this.bullets);
		   	}
		   	// console.log(bullet.distance);

		   }
		},








	}



	var game = new Object(init); 
	game.generate_free_bullets(200);
	console.log(game.free_bullets);


	io.sockets.on('connect', function(socket){
		sockets[socket.id] = socket; 




		if(debug){
			console.log("\n Socket_id "+socket.id);
			console.log("\n New Player created:");console.log(game.players[game.players_id_key[socket.id]]);
			console.log("\n ALl players ");console.log(game.players);

		}
		socket.on('mousemove', function(data){
			game.update_player(data,socket.id);
			// console.log(game.players[game.players_id_key[socket.id]].location);
		// console.log("Socket_Id: "+socket.id);
		// console.log("\n Update player location \n"); 
			// console.log(game.bullets);
		});


		socket.on('spacepress', function(data){
			// console.log("\n Space press");
			game.spacepress(data,socket.id);

			console.log(game.bullets);
			// console.log(game.players[game.players_id_key[socket.id]].location);
		// console.log("Socket_Id: "+socket.id);
		// console.log("\n Update player location \n"); 

	});




		

	});





//Game loop 
var i = 0;
function gameLoop(){

	setTimeout(function(){
		var now = new Date();
		
		// console.log((now - game.config.time.lastUpdate));
		game.config.time.last_update_sec_diff = (now - game.config.time.lastUpdate) == 0 ? 0.001 : (now - game.config.time.lastUpdate) / 1000;

		game.update_players_location();
		game.update_bullet_movments();

		game.config.time.lastUpdate = now;

		for(var socket_id in sockets){
			var socket = sockets[socket_id];

			socket.on('new_player', function(data){
				if(typeof game.players_id_key[socket.id] == 'undefined'){
					game.new_player(socket.id,data);
					console.log("Creating player");
					

				}
			});

			socket.on('disconnect', function(){
				delete sockets[socket.id];
				if(typeof game.players_id_key[socket.id] != 'undefined'){
					game.players.splice(game.players_id_key[socket.id],1);
				}
			});


		
			// console.log(game.players);


			socket.emit("player", game.players[game.players_id_key[socket.id]]);
			socket.emit('bullets', game.bullets);
			socket.emit('free_bullets', game.free_bullets);
			socket.emit('players', game.players);

		}

		setImmediate(gameLoop);


	}, 1000 / 30);
	
}
gameLoop();


io.on("beforeExist", function(){
	game = new Object(game);
});


process.on('SIGINT', function(){
	process.exit(0);

		// game = new Object(game);
	});

