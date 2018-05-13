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

function Tile(x, y,type) {
	this.hidden_t;

	var x = x, y = y;	
	var undo = false;
	var tile = Tile.BLANK;
	var anim = 0;

	if (tile == null) {
		(function() {
			var _c = document.createElement("canvas");
			_c.width = 100;
			_c.height = 70;
			var _ctx = _c.getContext("2d");

			_ctx.fillStyle = "#cce6ff";
			_ctx.lineWidth = 10;
			_ctx.strokeStyle = "#ff6666";
			_ctx.lineCap = "round";

			// Blank
			_ctx.fillRect(0, 0, 160, 160); 
			
			Tile.BLANK = new Image();
			Tile.BLANK.src = _c.toDataURL();


			// IM0
			_ctx.fillStyle = "#cce6ff";
			_ctx.translate(5, 5);
			Tile.IM0 = new Image(160,160);
			Tile.IM0.src = "memoria-elefante/img/elefante1.png";
			
			// IM1
			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 160, 160);
			Tile.IM1 = new Image(160,160);
			Tile.IM1.src =  "memoria-elefante/img/elefante2.png";

			// IM2
			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 160, 160);
			Tile.IM2 = new Image(100,100);
			Tile.IM2.src = "memoria-elefante/img/elefante3.png";
			
			// IM3
			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 100, 100);
			_ctx.fillStyle = "#ff33cc";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM3 = new Image(100,100);
			Tile.IM3.src = "memoria-elefante/img/elefante4.png";
			
			// IM4
			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 160, 160);
			_ctx.fillStyle = "#66ff33";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM4 =new Image(160,160);
			Tile.IM4.src = "memoria-elefante/img/elefante5.png";
			
			// IM5
			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 160, 160);
			_ctx.fillStyle = "#00ffcc";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM5 = new Image(160,160);
			Tile.IM5.src ="memoria-elefante/img/elefante6.png";
			
			// IM6
			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 160, 160);
			_ctx.fillStyle = "#ffffff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM6 =new Image(160,160);
			Tile.IM6.src = "memoria-elefante/img/elefante7.png";
			
			// IM7
			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 160, 160);
			_ctx.fillStyle = "#000000";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM7 = new Image(160,160);;
			Tile.IM7.src ="memoria-elefante/img/elefante8.png";
			
				// IM8

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM8 =new Image(160,160);
			Tile.IM8.src = "memoria-elefante/img/elefante9.png";
			
			// IM9

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM9 = new Image(160,160);
			Tile.IM9.src = "memoria-elefante/img/elefante10.png";
			

			// IM10

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM10 = new Image(160,160);
			Tile.IM10.src = "memoria-elefante/img/elefante11.png";
			
			// IM11

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM11 = new Image(160,160);
			Tile.IM11.src = "memoria-elefante/img/elefante12.png";
			
			// IM12

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM12 = new Image(160,160);
			Tile.IM12.src = "memoria-elefante/img/elefante13.png";
			
			// IM13

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM13 = new Image(160,160);
			Tile.IM13.src = "memoria-elefante/img/elefante14.png";
			
			// IM14

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM14 = new Image(160,160);
			Tile.IM14.src = "memoria-elefante/img/elefante15.png";
			
			// IM15

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM15 = new Image(160,160);
			Tile.IM15.src = "memoria-elefante/img/elefante16.png";
			
						// IM16

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM16 = new Image(160,160);
			Tile.IM16.src = "memoria-elefante/img/elefante17.png";
			
						// IM17

			_ctx.fillStyle = "#cce6ff";
			_ctx.fillRect(0, 0, 150, 150);
			Tile.IM17 = new Image(160,160);
			Tile.IM17.src = "memoria-elefante/img/elefante18.png";
			

		})();
		tile = Tile.BLANK;
	
	
	}
	
	switch(type){
		case 0:
			this.hidden_t=Tile.IM0;
			break;
		case 1:
			this.hidden_t=Tile.IM1;
			break;
		case 2:
			this.hidden_t=Tile.IM2;
			break;
		case 3:
			this.hidden_t=Tile.IM3;
			break;
		case 4:
			this.hidden_t=Tile.IM4;
			break;
		case 5:
			this.hidden_t=Tile.IM5;
			break;
		case 6:
			this.hidden_t=Tile.IM6;
			break;
		case 7:
			this.hidden_t=Tile.IM7;
			break;
		case 8:
			this.hidden_t=Tile.IM8;
			break;
		case 9:
			this.hidden_t=Tile.IM9;
			break;
		case 10:
			this.hidden_t=Tile.IM10;
			break;
		case 11:
			this.hidden_t=Tile.IM11;
			break;
		case 12:
			this.hidden_t=Tile.IM12;
			break;
		case 13:
			this.hidden_t=Tile.IM13;
			break;
		case 14:
			this.hidden_t=Tile.IM14;
			break;
		case 15:
			this.hidden_t=Tile.IM15;
			break;
		case 16:
			this.hidden_t=Tile.IM16;
			break;
		case 17:
			this.hidden_t=Tile.IM17;
			break;
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

	this.flip = function() {
		undo=false;
		tile = this.hidden_t;
		anim = 1;
	}

	this.update = function() {
		if (anim > 0) {
			anim -= 0.02;
		}
	}

	this.draw = function(ctx) {
		if (anim <= 0||anim>1) {
			ctx.drawImage(tile, x, y);
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

		for (var i = 0; i < 155; i += res) {
			if(!undo){
				var j = 50 - (anim > 0.5 ? 155 - i : i);
			}else{
			var j = 50 - (anim > 0.5 ? i: 155 - i );
			}
			
			ctx.drawImage(t, i, 0, res, 155,
				x + i - p*i + 50*p,
				y - j*p*0.05,
				res,
				155 + j*p*0.1
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
		
		ctx.drawImage(normal, 275, 460);
	}

}
