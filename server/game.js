var sys = require("sys");
var app = require("http").createServer(function(request, response){
	    sys.puts("I got kicked");
		response.writeHead(200, {'Content-Type': 'text/plain'}); 
		response.write("This is a automatic response");
		response.end();
});

var io = require("socket.io")(app);

var debug = true;


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
   			default_width : 100,
   			default_height : 100,
    	}
    },

   

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

    new_player : function(player_id){
    	var player = {
    		id : player_id ,
    		location : this.generePlayerLocation(),
    		width : this.config.players.default_width, 
    		height : this.config.players.default_height,
    	}
    	this.players.push(player);
    	this.players_id_key[player_id] = this.players.length - 1; 

    },

    update_player : function(data,player_id){
    	// if(data.hasOwnPropery("x") && data.hasOwnPropery("y")){
    	// 	//Update the player location
    		
    	// }
    }


}


var game = null;
app.listen(8080, function(){
	console.log("listening on port 8080");
	 game = new Object(init); 

});

io.sockets.on('connection', function(socket){
	game.new_player(socket.id);

	if(debug){
		console.log("\n Socket_id "+socket.id);
		console.log("\n New Player created:");console.log(game.players[game.players_id_key[socket.id]]);
		console.log("\n ALl players ");console.log(game.players);

	}
	socket.on('mousemove', function(data){
		console.log("Socket_Id: "+socket.id);
		console.log("\n Update player location \n"); 
		game.update_player(data);
	})

});



