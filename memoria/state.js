function MenuState(name) {

	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),
		ctx = scene.getContext();

	var btns = [], angle = 0, frames = 0;

	var _yPos = 250;
	btns.push(new MenuButton("Jogar", 260, _yPos, function() {
	if(!state.next){
		state.get("game").init();
		state.change("game");
		}
	},80,400));




	this.update = function() {
		frames++;
		angle = 0.2*Math.cos(frames*0.02);
	}

	this.render = function(_ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		ctx.translate(460, 100);
		ctx.font = "60px Helvetica";
		ctx.fillStyle = "black";
		var txt = "Jogo da Memória";
		ctx.fillText(txt, -ctx.measureText(txt).width/2, 18);
		ctx.restore();

		for (var i = btns.length;i--;) {
			btns[i].draw(ctx);
		}

		if (_ctx) { 
			scene.draw(_ctx);
		} else {
			return scene.getCanvas();
		}
	}
}



function GameState(name) {
	var complete=false;
	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),counter=0,
		ctx = scene.getContext();
	var playsmade=[];
	var data, player, isPlayer, aiMoved, mode, winner, winnerMsg, hastick;

	canvas.addEventListener("mousedown", function(evt) {
		if (winnerMsg && (state.active_name === "game")) {
			return;
		}

		
		if ( winner || (state.active_name !== "game") || !hastick) return;
		var px = mouse.x;
		var py = mouse.y;
		
		if(counter==2)return;

		if (px % 180 >= 20 && py % 180 >= 20) {
			var idx = Math.floor(px/180);
			idx += Math.floor(py/180)*5;

			if (data[idx].hasData()) {
				return;
			}
			
			data[idx].flip();
			playsmade[counter]=idx;
			counter+=1;

		}
	}, false);


	this.init = function( tile) {
		var spots=[0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9];
		var type=1;
		data = [];
		counter=0;
		for (var i = 0; i < 20; i++) {
			var x = (i % 5)*180 + 20;
			var y = Math.floor(i/5)*180 + 20;
			aux=Math.floor(Math.random()*(spots.length))
			type=  spots[aux];
			spots.splice(aux,1);
			console.log(type);
			console.log(spots);
			data.push(new Tile(x, y,type));
		}
		ai= new AIPlayer(data);

	}

	this.update = function() {
		if (winnerMsg) return;
		console.log( counter==2 && !data[playsmade[1]].active() );
		if(counter==2 && !complete && !(data[playsmade[0]].active()) && !(data[playsmade[1]].active()) ){
			complete=true;
			if((data[playsmade[0]].equals(data[playsmade[1]]))){
			
			}else{
				data[playsmade[0]].undoTile();
				data[playsmade[1]].undoTile();
				}
			}
		if(complete && !(data[playsmade[0]].active()) && !(data[playsmade[1]].active()) ){
		counter=0;
		complete=false;
		}
			
		var activeAnim = false;
		var randomplay=0;
		for (var i = data.length; i--;) {
			data[i].update();
			activeAnim = activeAnim || data[i].active();
		}
		if (!activeAnim) {
			if (winner) {
			winnergb=winner;
				if (winner === true) {
					winnerMsg = "Paranbéns!";
				} 
			}

		} else {
				//winner = ai.hasWinner();
		}
		hastick = true;
	}

	this.render = function(_ctx) {

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = data.length; i--;) {
			data[i].draw(ctx);
		}
		if (winnerMsg) {
			var s = 10, lw = 2, w = 300, h = 80;

			w -= lw;
			h -= lw;

			ctx.save();
			ctx.translate((canvas.width - w + lw)/2, (canvas.height - h + lw)/2);
			ctx.fillStyle = "white";
			ctx.strokeStyle = "#00ff99";
			ctx.lineWidth = lw;
			ctx.font = "20px Helvetica";

			ctx.beginPath();
			ctx.arc(s, s, s, Math.PI, 1.5*Math.PI);
			ctx.arc(w-s, s, s, 1.5*Math.PI, 0);
			ctx.arc(w-s, h-s, s, 0, 0.5*Math.PI);
			ctx.arc(s, h-s, s, 0.5*Math.PI, Math.PI);
			ctx.closePath();

			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = "#00ff99";
			var txt = winnerMsg;
			ctx.fillText(txt, w/2 -ctx.measureText(txt).width/2, 20);
			var btns  = []
			btns.push(new EndButton("Repetir", 180, 40, function() {
			if(!state.next){
			 if(state.active_name=="game2"){
			state.get("game").init();
			state.change("game");
			}else{
				state.get("game2").init();
				state.change("game2");
			}
			}
			},30,100));
			
			btns.push(new EndButton("Voltar", 30, 40, function() {
			if(!state.next){
			if(modegb==ONE_PLAYER ){
			state.change("menu",true);
			}else{
			state.change("menu");
			}}
			},30,100));
			for (var i = btns.length;i--;) {
				btns[i].draw(ctx);
			}
			ctx.restore();
		}

		if (_ctx) { 
			scene.draw(_ctx);
		} else {
			return scene.getCanvas();
		}
	}
}


function EndButton(text, x, y, cb,h,w) {


	var text = text, x = x, y = y, callback = cb;
	var hover, normal, rect = {};

	canvas.addEventListener("mousedown", function(evt) {
		if (winnergb === false ) return;

		if (rect.hasPoint(mouse.x, mouse.y)) {
			if (callback) {
				callback();
			}
		}
	}, false);

	(function() {
		var _c = document.createElement("canvas"),
			_w = _c.width = w,
			_h = _c.height = h,
			_lw = 2,
			s = 10;

		rect.x = x;
		rect.y = y;
		rect.width = _c.width;
		rect.height = _c.height;

		_w -= _lw;
		_h -= _lw;

		var _ctx = _c.getContext("2d");

		_ctx.fillStyle = "white";
		_ctx.strokeStyle = "#00ff99";
		_ctx.lineWidth = _lw;
		_ctx.font = "20px Helvetica";

		_ctx.translate(_lw/2, _lw/2);
		_ctx.beginPath();
		_ctx.arc(s, s, s, Math.PI, 1.5*Math.PI);
		_ctx.arc(_w-s, s, s, 1.5*Math.PI, 0);
		_ctx.arc(_w-s, _h-s, s, 0, 0.5*Math.PI);
		_ctx.arc(s, _h-s, s, 0.5*Math.PI, Math.PI);
		_ctx.closePath();
		_ctx.fill();
		_ctx.stroke();

		_ctx.fillStyle = _ctx.strokeStyle;
		var _txt = text;
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 20);

		normal = new Image();
		normal.src = _c.toDataURL();

		_ctx.fill();
		_ctx.stroke();

		_ctx.fillStyle = "white";
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 20);

		hover = new Image();
		hover.src = _c.toDataURL();
	})();
	
		rect.hasPoint = function(x, y) {
		

		var xl = this.x+42 < x && x < this.x+this.width+42,
			yl = this.y+152 < y && y < this.y+this.height+152;

		return xl && yl;
	}

	this.draw = function(ctx) {
		var tile = rect.hasPoint(mouse.x, mouse.y) && (winnergb !== false)? hover : normal;
		ctx.drawImage(tile, x, y);
	}
}