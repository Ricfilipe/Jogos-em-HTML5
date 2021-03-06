function MenuState(name) {

	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),
		ctx = scene.getContext();

	var btns = [], angle = 0, frames = 0;

	var _yPos = 100;
	btns.push(new MenuButton("1 Jogador", 20, _yPos, function() {
	if(!state.next){
		state.get("game").init(ONE_PLAYER);
		state.change("game");
		}
	},50,340));
	btns.push(new MenuButton("2 Jogadores", 20, _yPos+70, function() {
		if(!state.next){
		state.get("game").init(TWO_PLAYER);
		state.change("game",true);
		}
	},50,340));



	this.update = function() {
		frames++;
		angle = 0.2*Math.cos(frames*0.02);
	}

	this.render = function(_ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		ctx.translate(190, 40);
		ctx.font = "40px Helvetica";
		ctx.fillStyle = "black";
		var txt = "Jogo do Galo";
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

var ONE_PLAYER = 1,
	TWO_PLAYER = 2;
var winnergb;
var modegb;
function GameState(name) {

	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),counter=0,
		ctx = scene.getContext();
	
	var data, player, ai, isPlayer, aiMoved, mode, winner, winnerMsg, hastick;

	canvas.addEventListener("mousedown", function(evt) {
		if (winnerMsg && (state.active_name === "game" || state.active_name === "game2")) {
			return;
		}

		
		if (!isPlayer || winner || (state.active_name !== "game" && state.active_name !== "game2" ) || !hastick) return;

		var px = mouse.x;
		var py = mouse.y;

		if (px % 120 >= 20 && py % 120 >= 20) {
			var idx = Math.floor(px/120);
			idx += Math.floor(py/120)*3;

			if (data[idx].hasData()) {
				return;
			}
			data[idx].flip(player);
			if (mode & ONE_PLAYER) {
				counter=counter+1;
				isPlayer = false;
			} else {
				counter=counter+1;
				player = player === Tile.NOUGHT ? Tile.CROSS : Tile.NOUGHT;
			}
		}
	}, false);


	this.init = function(_mode, tile) {
		modegb=_mode;
		mode = _mode || ONE_PLAYER;
		data = [];
		counter=0;
		for (var i = 0; i < 9; i++) {
			var x = (i % 3)*120 + 20;
			var y = Math.floor(i/3)*120 + 20;
			data.push(new Tile(x, y));
		}

		player = tile || Tile.NOUGHT;

		isPlayer = player === Tile.NOUGHT;
		aiMoved = false;
		winner = false;
		winnerMsg = false;
		hastick = false;
		winnergb=winner;
		ai = new AIPlayer(data);
		ai.setSeed(player === Tile.NOUGHT ? Tile.CROSS : Tile.NOUGHT);

		if (mode & TWO_PLAYER) {
			player = Tile.NOUGHT;
			isPlayer = true;
		}
	}

	this.update = function() {
		if (winnerMsg) return;
		var activeAnim = false;
		var randomplay=0;
		for (var i = data.length; i--;) {
			data[i].update();
			activeAnim = activeAnim || data[i].active();
		}
		if (!activeAnim) {
			if (!aiMoved && !isPlayer) {
				var m = ai.move();
				if (m === -1) {
					if(winner===false){
					winner = true;
					}
				} else {
					if(Math.random()*10>6){
					data[m].flip(ai.getSeed());
					}else{
					for(;;){
					randomplay = Math.floor(Math.random()*(10-(counter*2)));
					console.log(ai.getmvs()[randomplay]);

							data[ai.getmvs()[randomplay]].flip(ai.getSeed());
							break;
							}
					
					}
				}
				isPlayer = true;
			}

			if (winner && !aiMoved) {
			winnergb=winner;
				if (winner === true) {
					winnerMsg = "O Jogo Empatou";
				} else if (winner === Tile.NOUGHT) {
					winnerMsg = "O Primeiro Jogador Ganhou";
					
				} else {
					if(mode==TWO_PLAYER)
					winnerMsg = "O Segundo Jogador Ganhou";
					else{
					winnerMsg = "O Computador Ganhou";
				}
				}
			}

			aiMoved = true;
		} else {
				winner = ai.hasWinner();
				console.log(winner === Tile.NOUGHT);
				if(counter==9 && winner==false)
				winner=true;
				aiMoved = false;
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
			if(modegb==ONE_PLAYER){
			 if(state.active_name=="game2"){
			state.get("game").init(ONE_PLAYER);
			state.change("game");
			}else{
				state.get("game2").init(ONE_PLAYER);
				state.change("game2");
			}
			}else{
				if(state.active_name=="game2"){
			state.get("game").init(TWO_PLAYER);
			state.change("game",true);
			}else{
			state.get("game2").init(TWO_PLAYER);
			state.change("game2",true);
			}
			}}
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