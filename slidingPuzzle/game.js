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

function Tile(x, y,type,image) {
	this.hidden_t;
	var x = x, y = y;
	var undo = false;
	var  tile ;
	this.type=type;
	var anim = 0;

	
	if (tile == null) {
		(function() {
			var _c = document.createElement("canvas");
			_c.width = _c.height = 125;
			var _ctx = _c.getContext("2d");

			_ctx.fillStyle = "#00ff99";
			_ctx.lineWidth = 10;
			_ctx.strokeStyle = "#ff6666";
			_ctx.lineCap = "round";

			// Blank
			_ctx.fillRect(0, 0, 160, 160); 
			
			Tile.BLANK = new Image();
			Tile.BLANK.src = _c.toDataURL();

			Tile.img = new Image(525,525);
			Tile.img.src = "slidingPuzzle/img/teste.jpg";
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

	this.set = function(next) {
		tile = next;
	}

	this.flip = function( empty_pos,  idx,tile_empty) {
		if(empty_pos==idx+1 || empty_pos==idx-1 || empty_pos==idx+4 || empty_pos==idx-4){
		if((empty_pos==idx+1 && empty_pos%4!=(idx%4)+1 ) || (empty_pos%4!=(idx%4)-1 && empty_pos==idx-1))
		{return false;}
		tile_empty.type=this.type;
		this.type=0;
		
		//anim = 1; TODO
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
		if (anim <= 0||anim>1) {
			if(this.type==0){
			
				ctx.drawImage(Tile.BLANK, x, y);
				return;
			}
			ctx.drawImage(Tile.img,130*((this.type-1)%4),130*Math.floor((this.type-1)/4),125,125,x,y,125,125);
			return;
		}
		
		if(undo==true && anim >0){
		tile=Tile.BLANK;
		}
		
		var res = 2;
		if(!undo){
		var t = anim > 0.5 ? Tile.BLANK : tile;
		}else{
		var t = anim > 0.5 ? this.hidden_t : tile;
		}
		var p = -Math.abs(2*anim - 1) + 1;

		p *= p;

		for (var i = 0; i < 160; i += res) {
			if(!undo){
				var j = 50 - (anim > 0.5 ? 160 - i : i);
			}else{
			var j = 50 - (anim > 0.5 ? i: 160 - i );
			}
			
			ctx.drawImage(t, i, 0, res, 160,
				x + i - p*i + 50*p,
				y - j*p*0.2,
				res,
				160 + j*p*0.4
			);
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
		_ctx.strokeStyle = "#00ff99";
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
		var _txt = "00 : 00";
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 20);

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
		var _txt =pad2(min)+" : "+pad2(seg);
		_ctx.fillText(_txt, (_w - _ctx.measureText(_txt).width)/2, 20);

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
		
		ctx.drawImage(normal, 270, 525);
	}

}
