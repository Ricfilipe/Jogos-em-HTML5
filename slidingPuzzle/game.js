function StateManager() {

	var state = {},
		active = null,
		anim = 1,
		right = false;
		this.next = false;
	this.active_name = null;

	this.add = function() {
		for (var i = arguments.length; i--;) {
			var arg = arguments[i];
			state[arg.name] = arg;
		}
	}
	
	
	this.set = function(name) {
		active = state[name];
		this.active_name = name;
	}
	this.get = function(name) {
		return state[name];
	}
	this.change = function(name, _right) {
		anim = 0;
		right = _right || false;
		this.next = name;
		this.active_name = name;
	}
	this.tick = function(ctx) {
		if (this.next) {
			if (anim <= 1) {
				anim += 0.02;
				
				active.update();
				state[this.next].update();
				
				var c1 = active.render(),
					c2 = state[this.next].render(),

					c1w = c1.width,
					c1h = c1.height,
					c2w = c2.width,
					c2h = c2.height,

					res = 2,

					p,
					t = anim;
				p = t < 0.5 ? 2*t*t : -2*(t*(t -2)) - 1;

				if (right) {
					p = 1 - p;
					var t = c2;
					c2 = c1;
					c1 = t;
				}

				for (var i = 0; i < c1h; i += res) {
					ctx.drawImage(c1, 0, i, c1w, res,
						(c1h - i)*p*0.2,
						i - p*i,
						c1w - (c1h - i)*p*0.4,
						res
					);
				}
				p = 1 - p;
				for (var i = 0; i < c2h; i += res) {
					ctx.drawImage(c2, 0, i, c2w, res,
						 i*p*0.2,
						i - (i - c2h)*p,
						c1w - i*p*0.4,
						res
					);
				}

			} else {
				active = state[this.next];
				this.next = false;
				active.update();
				active.render(ctx);
			}
		} else {
			active.update();
			active.render(ctx);
			
		}
	}
}

function Tile(x, y,type,imaget,size) {
	this.hidden_t;
	var x = x, y = y;
	var undo = false;
	var  tile ;
	this.type=type;
	var anim = 0;
	var aux;
	var size=size;
	var imagem=imaget;
	var win=false;
	
	if (tile == null) {
		(function() {
			var _c = document.createElement("canvas");
			_c.width = _c.height = size;
			var _ctx = _c.getContext("2d");

			_ctx.fillStyle = "#3366ff";
			_ctx.lineWidth = 10;
			_ctx.strokeStyle = "#ff6666";
			_ctx.lineCap = "round";

			// Blank
			_ctx.fillRect(0, 0, size, size); 
			
			Tile.BLANK = new Image();
			Tile.BLANK.src = _c.toDataURL();

			tile = new Image(525,525);
			tile.src = "slidingPuzzle/img/"+imagem;
		})();
		
	
		}
	
	
	
	
		

	this.undoTile = function(){
		anim = 2;
		undo=true;
	}
	
	this.getHidden = function(){
		return hidden_t;
	}
	
	this.active = function() {
		return anim > 0.20;
	}

	this.equals = function(_tile) {
		return this.hidden_t === _tile.hidden_t;
	}

	this.hasData = function() {
		return tile !== Tile.BLANK;
	}

	this.set = function(next,posx,posy) {
		anim = next;
		aux=[posx,posy];
	}
	
		this.setWinAnim = function() {
		anim = 2;
		win=true
	}
	
	


	this.flip = function( empty_pos,  idx,tile_empty) {
		if(empty_pos==idx+1 || empty_pos==idx-1 || empty_pos==idx+dificuldade_num[idx_dif] || empty_pos==idx-dificuldade_num[idx_dif]){
		if((empty_pos==idx+1 && empty_pos%dificuldade_num[idx_dif]!=(idx%dificuldade_num[idx_dif])+1 ) || (empty_pos%dificuldade_num[idx_dif]!=(idx%dificuldade_num[idx_dif])-1 && empty_pos==idx-1))
		{return false;}
		tile_empty.type=this.type;
		this.type=0;
		anim = 0.7;
		tile_empty.set(0.7,x,y);
		return true;
		}
		else{
		return false;
		}
	}

	this.update = function() {
		if (anim > 0) {
			anim -= 0.02;
		}
	}

	this.draw = function(ctx) {
				if(win && anim < 1.8){ 	
			console.log("teste");
			ctx.drawImage(tile,0,0,515,515);
			return;
		}
		
		if (anim <= 0.18 || anim >1) {

			if(this.type==0){
				ctx.drawImage(Tile.BLANK, x, y);
				return;
			}
			ctx.drawImage(tile,(size+5)*((this.type-1)%dificuldade_num[idx_dif]),(size+5)*Math.floor((this.type-1)/dificuldade_num[idx_dif]),size,size,x,y,size,size);
			return;
		}
		
			
	
		if( anim >0){
			if(this.type==0)
			return;
			
			
			if(anim>0.18)
			ctx.drawImage(Tile.BLANK, x, y);
			ctx.drawImage(Tile.BLANK, aux[0], aux[1]);
			ctx.drawImage(tile,(size+5)*((this.type-1)%dificuldade_num[idx_dif]),(size+5)*Math.floor((this.type-1)/dificuldade_num[idx_dif]),size,size,x-((anim-0.2)/0.5)*(x-aux[0]),y-((anim-0.2)/0.5)*(y-aux[1]),size,size);
			
		}
	}
	

}





function MenuButton(text, x, y, cb,h,w) {


	var text = text, x = x, y = y, callback = cb;
	var hover, normal, rect = {};

	canvas.addEventListener("mousedown", function(evt) {
		if (state.active_name !== "menu" ) return;

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
		_ctx.strokeStyle = "#3366ff";
		_ctx.lineWidth = _lw;
		_ctx.font = "30px Helvetica";

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
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 40);

		normal = new Image();
		normal.src = _c.toDataURL();

		_ctx.fill();
		_ctx.stroke();

		_ctx.fillStyle = "white";
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 40);

		hover = new Image();
		hover.src = _c.toDataURL();
	})();

	rect.hasPoint = function(x, y) {
		var xl = this.x < x && x < this.x+this.width,
			yl = this.y < y && y < this.y+this.height;

		return xl && yl;
	}

	this.draw = function(ctx) {
		var tile = rect.hasPoint(mouse.x, mouse.y) && (state.active_name==="menu")? hover : normal;
		ctx.drawImage(tile, x, y);
	}

}

function Scene(width, height) {
	
	var width = width, height = height;

	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	
	var ctx = canvas.getContext("2d");

	this.getContext = function() {
		return ctx;
	}
	


	this.getCanvas = function() {
		return canvas;
	}

	this.draw = function(_ctx) {
		_ctx.drawImage(canvas, 0, 0);
	}
}

function Cronometro() {
	var seg=0, min=0, start=false;
	var timer;
	
	(function() {
		var _c = document.createElement("canvas"),
			_w = _c.width = 80,
			_h = _c.height = 30,
			_lw = 2,
			s = 10;


		_w -= _lw;
		_h -= _lw;

		var _ctx = _c.getContext("2d");

		_ctx.fillStyle = "white";
		_ctx.strokeStyle = "#3366ff";
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
		var _txt = "00 : 00";
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 22);

		normal = new Image();
		normal.src = _c.toDataURL();


	})();
	
	function incrementar(){
			
			
			seg=seg+1;
			if(seg==60){
			seg=0;
			min=min+1;
			}
			
		if(min==60){
			min=0;	
		}
			
			var _c = document.createElement("canvas"),
			_w = _c.width = 80,
			_h = _c.height = 30,
			_lw = 2,
			s = 10;


		_w -= _lw;
		_h -= _lw;

		var _ctx = _c.getContext("2d");

		_ctx.fillStyle = "white";
		_ctx.strokeStyle = "#3366ff";
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
		var _txt =pad2(min)+" : "+pad2(seg);
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 22);

		normal = new Image();
		normal.src = _c.toDataURL();
	}

	this.start = function(){
		if(!start){
		timer =  setInterval(incrementar,1000);
		start = true;
		}
	}
	
		this.stop= function(){
		if(start){
		clearInterval(timer);
		start = false;
		}
	}
	
	function pad2(number) {
   
     return (number < 10 ? '0' : '') + number
   
}

	this.draw = function(ctx) {
		
		ctx.drawImage(normal, 215, 525);
	}

}
