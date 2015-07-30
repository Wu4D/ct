
var resource_loader = {

	resources : {},

	status : {
		total : 0,
		loaded: 0,
	},

	load : function(urlOrArray){
		if(urlOrArray != '' || urlOrArray != undefined)
		{
			if(urlOrArray instanceof Array){
				for(var i  = 0 ; i < urlOrArray.length;i++){
					this.resources[urlOrArray[i]] = new Image();
					// image.src = urlOrArray[i];
					this.resources[urlOrArray[i]] = urlOrArray[i];
				}
			}else if(urlOrArray instanceof Object){

				for(var property in urlOrArray){

					this.resources[property] = new Image();
					this.resources[property].src = urlOrArray[property]; 

				}
			}else{
				this.resources[urlOrArray] = new Image();
				// resources[urlOrArray].src = urlOrArray;
				this.resources[urlOrArray].src = urlOrArray;
			}

			this.status.total++;
		}
	},

	checkFiles : function (){
		for(var image in this.resources){
			if(this.resources[image].complete || (this.resources[image].onload = function(){return true})){
				if(this.status.loaded < this.status.total){
					this.status.loaded++;
				}
			}
		
		}
	},

	isReady : function(){
		this.checkFiles();
		if(this.status.loaded < this.status.total){
			
			return false;

		}else{
			return true;
		}
	},

	//Get a precented based on how many images loaded so far
	getPrecent : function(){
		this.checkFiles();
		return Math.round(this.status.loaded * 100 / this.status.total);
	},

	get : function(property){
		if(this.resources.hasOwnProperty(property)){
			return this.resources[property]; 
		}
	}

}

