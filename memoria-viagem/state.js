
var tutorial=true;
function MenuState(name) {

	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),
		ctx = scene.getContext(),logo=new Logo();

	var btns = [], angle = 0, frames = 0;

	var _yPos = 200;
	btns.push(new MenuButton("Jogar", 350, _yPos, function() {
	if(!state.next){
		tutorial=true;
		state.get("game").init();
		state.change("game");
		}
	},70,200));




	this.update = function() {
		frames++;
		angle = 0.2*Math.cos(frames*0.02);
	}

	this.render = function(_ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.save();
		ctx.translate(450, 80);
		ctx.font = "40px Helvetica";
		ctx.fillStyle = "black";
		var txt = "Jogo da Mem\u00F3ria";
		ctx.fillText(txt, -ctx.measureText(txt).width/2, 18);
		ctx.translate(-50, 40);
		ctx.font = "30px Helvetica";
		ctx.fillText("Viagens pela minha terra", -ctx.measureText(txt).width/2, 18);
		ctx.restore();
		logo.draw(ctx);

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
	var complete=true;
	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),counter=0,PARES_D=15,
		ctx = scene.getContext(),cronometro;
	var playsmade=[];
	var data, player, isPlayer, pares, mode, winner, winnerMsg, hastick;

	canvas.addEventListener("mousedown", function(evt) {
		if (winnerMsg  &&(state.active_name === "game" || state.active_name === "game2" ) ) {
			return;
		}

		
		if ( winner || (state.active_name !== "game" && state.active_name !== "game2" ) || !hastick || tutorial ) return;
		var px = mouse.x;
		var py = mouse.y;
		
		if(counter==2)return;

		if (px % 155 <= 150 && py % 105 <= 100) {
			var idx = Math.floor(px/155);
			idx += Math.floor(py/105)*6;

			if (data[idx].hasData()) {
				return;
			}
			if(complete){
			cronometro.start();
			data[idx].flip();
			playsmade[counter]=idx;
			counter+=1;
			}

		}
	}, false);


	this.init = function( tile) {
		var spots=[];
		
		for(var i = 0; i<PARES_D;i++){
		spots.push(i);
		spots.push(i);
		}
		
		var type=1;
		winner=false;
		winnergb=false;
		winnerMsg=false;
		hastick = false;
		pares=0;
		data = [];
		counter=0;
		cronometro=new Cronometro();
		for (var i = 0; i < PARES_D*2; i++) {
			var x = (i % 6)*155;
			var y = Math.floor(i/6)*105;
			aux=Math.floor(Math.random()*(spots.length))
			type=  spots[aux];
			spots.splice(aux,1);
			data.push(new Tile(x, y,type));
		}

	}

	this.update = function() {
	var par_certo=false;
		if (winnerMsg) return;

			
		var activeAnim = false;
		for (var i = data.length; i--;) {
			data[i].update();
			activeAnim = activeAnim || data[i].active();
		}
		
	if(counter==2 && complete && !activeAnim){
			complete=false;
			if((data[playsmade[0]].equals(data[playsmade[1]]))){
			 par_certo=true;
			}else{
				data[playsmade[0]].undoTile();
				data[playsmade[1]].undoTile();
				activeAnim=true;
				}
			}
		if(!complete && !activeAnim ){
		counter=0;
		complete=true;
		if(par_certo){
			pares+=1;
			console.log(pares);
			par_certo=false;
			if(pares==PARES_D)
				winner=true;
		}
		}
		if (!activeAnim) {
			if (winner) {
			cronometro.stop();
			winnergb=winner;
				if (winner === true) {
					winnerMsg = "Parab\u00E9ns!";
					
				} 
			}

		} 
		hastick = true;
	}

	this.render = function(_ctx) {

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = data.length; i--;) {
			data[i].draw(ctx);
		}
		
	
		
		if (winner) {
			var s = 10, lw = 2, w = 300, h = 200;

			w -= lw;
			h -= lw;

			ctx.save();
			ctx.translate((canvas.width - w + lw)/2, (canvas.height - h + lw)/2-10 );
			ctx.fillStyle = "white";
			ctx.strokeStyle = "#00ff99";
			ctx.lineWidth = lw;
			ctx.font = "40px Helvetica";

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
			ctx.fillText(txt, w/2 -ctx.measureText(txt).width/2, 50);
			var btns  = []
			btns.push(new EndButton("Repetir", 200, 130, function() {
			if(!state.next && (state.active_name=="game2" || state.active_name=="game" )){
			 if(state.active_name=="game2"){
			state.get("game").init();
			state.change("game");
			}else{
				state.get("game2").init();
				state.change("game2");
			}
			}
			},40,80));
			
			btns.push(new EndButton("Voltar", 20, 130, function() {
			if(!state.next &&  (state.active_name=="game2" || state.active_name=="game" )){
			state.change("menu",true);
			}
			},40,80));
			for (var i = btns.length;i--;) {
				btns[i].draw(ctx);
			}
			ctx.restore();
		}
		
		if (tutorial) {
			var s = 10, lw = 2, w = 500, h = 320;

			w -= lw;
			h -= lw;

			ctx.save();
			ctx.translate((canvas.width - w + lw)/2, (canvas.height - h + lw)/2-10 );
			ctx.fillStyle = "white";
			ctx.strokeStyle = "#00ff99";
			ctx.lineWidth = lw;
			ctx.font = "30px Helvetica";

			ctx.beginPath();
			ctx.arc(s, s, s, Math.PI, 1.5*Math.PI);
			ctx.arc(w-s, s, s, 1.5*Math.PI, 0);
			ctx.arc(w-s, h-s, s, 0, 0.5*Math.PI);
			ctx.arc(s, h-s, s, 0.5*Math.PI, Math.PI);
			ctx.closePath();

			ctx.fill();
			ctx.stroke();
		
			ctx.fillStyle = "#00ff99";
			var txt = "Objectivo:";
			ctx.fillText(txt, 40, 40);
		
			var txt = "Como Jogar:";
			ctx.fillText(txt, 40, 120);
			ctx.fillStyle = "#000000";
			ctx.font = "15px Helvetica";
			var txt = "Encontre os pares das figuras o mais r\xE1pido poss\xEDvel.";
				ctx.fillText(txt, 40, 70)
	
				var line=18;
			var txt = "Primeiro deve clicar em duas cartas. Se as imagens forem";
				ctx.fillText(txt, 40, 150)
				ctx.fillText("iguais, ficam voltadas para cima; se as imagens forem diferentes  ", 40, 168);
				ctx.fillText("deve clicar novamente em duas cartas, at\u00E9 descobrir o par.", 40, 168+line);
				ctx.fillText("E assim, sucessivamente at\u00E9 todas as cartas ficarem voltadas", 40, 168+line*3-10);
				ctx.fillText("para cima.", 40, 168+line*4-10);
			
			var btns  = []
			
			btns.push(new MidButton("OK", 205, 260, function() {
				tutorial=false;
				
			}
			,40,80));
			for (var i = btns.length;i--;) {
				btns[i].draw(ctx);
			}
			ctx.restore();
		}
		cronometro.draw(ctx);

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
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 25);

		normal = new Image();
		normal.src = _c.toDataURL();

		_ctx.fill();
		_ctx.stroke();

		_ctx.fillStyle = "white";
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 25);

		hover = new Image();
		hover.src = _c.toDataURL();
	})();
	
		rect.hasPoint = function(x, y) {
		

		var xl = this.x+314 < x && x < this.x+this.width+314,
			yl = this.y+170 < y && y < this.y+this.height+170;

		return xl && yl;
	}

	this.draw = function(ctx) {
		var tile = rect.hasPoint(mouse.x, mouse.y) && (winnergb !== false)? hover : normal;
		ctx.drawImage(tile, x, y);
	}
}

function MidButton(text, x, y, cb,h,w) {


	var text = text, x = x, y = y, callback = cb;
	var hover, normal, rect = {};

	canvas.addEventListener("mousedown", function(evt) {
		if (tutorial === false ) return;

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
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 25);

		normal = new Image();
		normal.src = _c.toDataURL();

		_ctx.fill();
		_ctx.stroke();

		_ctx.fillStyle = "white";
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 25);

		hover = new Image();
		hover.src = _c.toDataURL();
	})();
	
		rect.hasPoint = function(x, y) {
		

		var xl = this.x+214 < x && x < this.x+this.width+214,
			yl = this.y+110 < y && y < this.y+this.height+110;

		return xl && yl;
	}

	this.draw = function(ctx) {
		var tile = rect.hasPoint(mouse.x, mouse.y) && (tutorial !== false)? hover : normal;
		ctx.drawImage(tile, x, y);
	}
}