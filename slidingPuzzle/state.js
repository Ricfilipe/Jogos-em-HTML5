
var tutorial=true;
var image="teste.jpg";
var dificuldade = ["F\341cil","Normal","Dif\355cil"];
var dificuldade_num = [2,3,4];
var idx_dif=1;

function MenuState(name) {

	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),
		ctx = scene.getContext();

	var btns = [], angle = 0, frames = 0;

	var _yPos = 150;
	btns.push(new MenuButton("Jogar", 150, _yPos+140, function() {
	if(!state.next){
		tutorial=true;
		state.get("game").init();
		state.change("game");
		}
	},70,240));
	
		btns.push(new MenuButton("\u25c0", 150, _yPos+60, function() {
	if(!state.next){
		idx_dif--;
		if(idx_dif<0)
			idx_dif=dificuldade.length-1;
		}
	},60,60));
			btns.push(new MenuButton("	\u25b6", 330, _yPos+60, function() {
	if(!state.next){
		idx_dif=(++idx_dif)%3;
		}
	},60,60));




	this.update = function() {
		frames++;
		angle = 0.2*Math.cos(frames*0.02);
	}

	this.render = function(_ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		ctx.save();
		ctx.translate(260, 80);
		ctx.font = "40px Helvetica";
		ctx.fillStyle = "black";
		var txt = "Quebra-Cabe\xE7as Deslizante";
		ctx.fillText(txt, -ctx.measureText(txt).width/2, 18);
		
		ctx.translate(50, 100);
		ctx.font = "25px Helvetica";
		ctx.fillText("Selecione dificuldade:", -ctx.measureText(txt).width/2, 18);
		
		ctx.translate(-40, 50);
		ctx.font = "30px Helvetica";
		var txt = dificuldade[idx_dif];
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
	var complete=true;
	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),counter=0,PARES_D=15,
		ctx = scene.getContext(),cronometro;
	var playsmade=[];
	var data, player, isPlayer, pares, mode, winner, winnerMsg, hastick;
	var tabuleiro;
	var empty_pos;
	var sizeTile;
	var size;
	
	canvas.addEventListener("mousedown", function(evt) {
		if (winnerMsg  &&(state.active_name === "game" || state.active_name === "game2" ) ) {
			return;
		}
		
		if ( winner || (state.active_name !== "game" && state.active_name !== "game2" ) || !hastick || tutorial ) return;
		var px = mouse.x;
		var py = mouse.y;
		
		
		

		if (px % sizeTile <= size	 && py % sizeTile <= size) {
			var idx = Math.floor(px/sizeTile);
			idx += Math.floor(py/sizeTile)*dificuldade_num[idx_dif];


			
			if(complete){
			if(data[idx].flip(empty_pos,idx,data[empty_pos])){
			tabuleiro[empty_pos]=tabuleiro[idx];
			tabuleiro[idx]=0;
			empty_pos=idx;
			cronometro.start();
			}
			}

		}
	}, false);


	this.init = function( tile) {
		tabuleiro=[];
		var imagens=["teste.jpg","estatuas.jpg","estatua2.jpg","barcos.jpg","barco2.jpg","lisboa.jpg","belem.jpg","praia.jpg","rio.jpg","moinho.jpg","ponte.jpg","descobrimentos.jpg","convento.jpg"];
		image=imagens[Math.floor(Math.random()*imagens.length)];
		switch(dificuldade_num[idx_dif]){
		case 2:
			sizeTile=260;
			size=255;
		
			break;
		case 3:
			sizeTile=173;
			size=168;
			break;
		case 4:
			sizeTile=130;
			size=125;
		break;
		}

			
		for(var j= 0; j<dificuldade_num[idx_dif]*dificuldade_num[idx_dif];j++)	
			tabuleiro.push(j+1);
		var type=1;
		winner=false;
		winnergb=false;
		winnerMsg=false;
		hastick = false;
		pares=0;
		data = [];
		counter=0;
		cronometro=new Cronometro();
		empty_pos = dificuldade_num[idx_dif]*dificuldade_num[idx_dif]-1;
		tabuleiro[empty_pos]=0;
			
		this.prepararTabuleiro(tabuleiro);
		console.log(tabuleiro);
		for (var i = 0; i < tabuleiro.length; i++) {
			var x = (i % dificuldade_num[idx_dif])*sizeTile;
			var y = Math.floor(i/dificuldade_num[idx_dif])*sizeTile;
			data.push(new Tile(x, y,tabuleiro[i],image,size));
		
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
		
		if(!activeAnim ){
		winner=true;
		
			for (var j = tabuleiro.length; j--;) {
				if(tabuleiro[j]!=0 &&tabuleiro[j]!=j+1) {
					winner=false;

					break;
			}
			}
		
		}
		
		if (!activeAnim) {
			if (winner) {
			console.log("winner");
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
			if(!state.next){
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
			if(!state.next){
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
			var start_text=40;
			var title=30;
			var line=18;
			var n_linhas=0;
			var n_title =0;
			
			ctx.fillStyle = "#00ff99";
			var txt = "Objectivo:";
			ctx.fillText(txt, 40, start_text+title*(n_title++));
			
			ctx.fillStyle = "#000000";
			ctx.font = "15px Helvetica";
			var txt = "Organizar as pe\xE7as de forma a obter uma imagem, o  mais ";
			ctx.fillText(txt, 40, start_text+title*n_title+line*(n_linhas++));
			ctx.fillText("r\xE1pido poss\xEDvel.", 40, start_text+title*n_title+line*(n_linhas++))
			
			ctx.font = "30px Helvetica";
			ctx.fillStyle = "#00ff99";
			n_title++;
			var txt = "Como Jogar:";
			ctx.fillText(txt, 40,  start_text+title*(n_title++)+line*(n_linhas));
			
			ctx.fillStyle = "#000000";
			ctx.font = "15px Helvetica";
			var txt = "Apenas pode movimentar as pe\xE7as adjacentes \xE0 pe\xE7a em branco.";
				ctx.fillText(txt, 40, start_text+title*n_title+line*(n_linhas++))
				ctx.fillText("Para movimentar a pe\xE7a, carrega-se na pe\xE7a que se quer", 40, start_text+title*n_title+line*(n_linhas++));
				ctx.fillText("movimentar.", 40, start_text+title*n_title+line*(n_linhas++));
				ctx.fillText("Deve repetir este processo at\xE9 obter uma imagem.", 40, start_text+title*n_title+line*(n_linhas++));
			
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
	
	this.prepararTabuleiro=function(tabuleiro){
		var movimentos=[-1,dificuldade_num[idx_dif],-dificuldade_num[idx_dif]];
		var aux;
		var mov_done=1;
		for(var i = 4*dificuldade_num[idx_dif]; i>0;){
			aux=Math.floor(Math.random()*movimentos.length);
			aux=movimentos[aux];
			if(empty_pos+aux>=0 && empty_pos+aux<tabuleiro.length){
				if((aux == 1 || aux ==-1) && (empty_pos%dificuldade_num[idx_dif]+aux <0 || empty_pos%dificuldade_num[idx_dif]+aux >dificuldade_num[idx_dif]-1)){continue;}
				movimentos.push(mov_done);
				mov_done=movimentos.indexOf(-aux);
				mov_done=movimentos.splice(mov_done,1)[0];
				console.log(mov_done);
				tabuleiro[empty_pos]=tabuleiro[empty_pos+aux];
				tabuleiro[empty_pos+aux]=0;
				empty_pos=empty_pos+aux;	
				i--;
			}
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
		

		var xl = this.x+109 < x && x < this.x+this.width+109,
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
		

		var xl = this.x+9		< x && x < this.x+this.width+9,
			yl = this.y+110 < y && y < this.y+this.height+110;

		return xl && yl;
	}

	this.draw = function(ctx) {
		var tile = rect.hasPoint(mouse.x, mouse.y) && (tutorial !== false)? hover : normal;
		ctx.drawImage(tile, x, y);
	}
}