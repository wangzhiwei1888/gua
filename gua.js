(function(root, factory) {
	if (typeof define === 'function' && (define.amd || define.cmd)) {
		define(factory);
	} else {
		root.gua = factory();
	}
})(this, function() {
	var dc = document,
		tool = {},
		gua = {},
		b = false,
		pixels = 0,
		dpi = window.devicePixelRatio || 1;;
	tool.opt = {
		bg: '',//奖项图片
		fg: '#6699ff',//奖项待刮图片，默认颜色
		size: 5,	//刮奖大小
		w: 0,	//内部
		h: 0,	//内部
		p: 0,	//挂掉部分是剩余部分的百分之比
		start: null,	//刮的开始执行函数
		move: null,		//move开始的时候 执行的函数
		end: null,		//手指抬起执行的函数
		clear: null		//清除后执行的回调
	};
	tool.hasTouch = ('ontouchstart' in window);
	tool.getStyle = function(obj, attr) {
		if (obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj, false)[attr];
		}
	};
	tool.qs = function(el) {
		if (typeof el !== 'string' || !el) {
			return undefined;
		}
		return dc.querySelector(el);
	};
	tool.setContent = function(el) {
		var canvas = dc.createElement('canvas'),
			cW = parseInt(this.getStyle(el, 'width'), 10),
			cH = parseInt(this.getStyle(el, 'height'), 10),
			nImg = dc.createElement('img');
		tool.opt.w = cW;
		tool.opt.h = cH;
		canvas.width = cW;
		canvas.height = cH;
		canvas.style.cssText = 'position:absolute;top:0;left:0';
		nImg.src = tool.opt.bg;
		nImg.style.cssText = 'display:block;max-width:100%;height:100%;'
		el.style.position = 'relative';
		nImg.id = 'canImg';
		canvas.id = 'canvas';
		el.appendChild(nImg);
		el.appendChild(canvas);
	};
	tool.setCanvas = function() {
		var can = this.qs('canvas'),
			image = new Image();
		gua.ctx = can.getContext('2d');
		if (tool.opt.fg.charAt(0) === '#') {
			gua.ctx.fillStyle = tool.opt.fg;
			gua.ctx.fillRect(0, 0, tool.opt.w, tool.opt.h);
		} else {
			image.src = tool.opt.fg;
			image.onload = function() {
				gua.ctx.drawImage(image, 0, 0, tool.opt.w, tool.opt.h);
			};
		}
	};
	tool.clear = function() {
		gua.ctx.clearRect(0, 0, tool.opt.w, tool.opt.h);
		tool.opt.clear && tool.opt.clear();
	};

	function huayuan(ev) {
		var r = tool.opt.size || 5;
		b = true;
		var touch = ev.touches[0];
		var el = ev.target;
		var x = touch.pageX - el.getBoundingClientRect().left;
		var y = touch.pageY - el.getBoundingClientRect().top;
		gua.ctx.globalCompositeOperation = "destination-out";
		gua.ctx.lineJoin = "round";
		gua.ctx.lineCap = "round";
		gua.ctx.lineWidth = r;
		gua.ctx.beginPath();
		gua.ctx.arc(x, y, r / 2, 0, Math.PI * 2);
		gua.ctx.closePath();
		gua.ctx.fillStyle = "#000";
		gua.ctx.fill();
		gua.ctx.beginPath();
		gua.ctx.moveTo(x, y);
	}

	function core(ev) {
		switch (ev.type) {
			case 'touchstart':
			case 'mousedown':
				ev.preventDefault();
				tool.opt.start && tool.opt.start();
				huayuan(ev);
				break;
			case 'touchmove':
			case 'mousemove':
				setAnd(ev)
				ev.preventDefault();
				tool.opt.move && tool.opt.move();
				var touch = ev.touches[0];
				var el = ev.target;
				var x = touch.pageX - el.getBoundingClientRect().left;
				var y = touch.pageY - el.getBoundingClientRect().top;
				if (b) {
					gua.ctx.lineTo(x, y);
					gua.ctx.stroke();
				}
				if (tool.opt.p !== 0) {
					if (getPercent(ev) >= (tool.opt.p / 10)) {
						tool.clear();
						return false;
					}
				}
				break;
			case 'touchend':
			case 'touchcancel':
			case 'mouseup':
			case 'mouseout':
				b = false;
				tool.opt.end && tool.opt.end();
				gua.ctx.closePath();
				break;
		}
	}

	function setAnd(ev) {
		ev.target.style.display = 'none';
		ev.target.offsetHeight;
		ev.target.style.display = 'inherit';
	}

	function forinObj(obj) {
		for (var i in tool.opt) {
			tool.opt[i] = obj[i] || tool.opt[i];
		}
	}

	function getPercent(ev) {
		var b = gua.ctx.getImageData(0, 0, tool.opt.w, tool.opt.h);
		for (var a = 0, c = 0, d = b.data.length; d > c; c += 4)
			0 === b.data[c] && 0 === b.data[c + 1] && 0 === b.data[c + 2] && 0 === b.data[c + 3] && a++;
		return a / pixels * 100
	}
	gua.init = function(obj, opt) {
		var el,
			eventNames = tool.hasTouch ? 'touchstart touchmove touchend touchcancel' : 'mouseup mousedown mousemove mouseout';
		opt = opt || tool.opt;
		forinObj(opt);
		if (!obj) {
			return false;
		};
		if (typeof obj !== 'string') {
			el = obj;
		} else {
			el = tool.qs(obj);
		}
		if (!el) {
			return false;
		}
		el.innerHTML = '';
		dc.body.style.mozUserSelect = 'none';
		dc.body.style.webkitUserSelect = 'none';
		tool.setContent(obj);
		pixels = tool.opt.w * tool.opt.h * dpi * dpi;
		tool.setCanvas();
		eventNames.split(' ').forEach(function(item) {
			obj.addEventListener(item, core, false);
		});
	};
	gua.changeImg = function(url){
		if(!url){return false;}
		var oImg = tool.qs('#canImg');
		if(!oImg){return false;}
		oImg.src = url;
	};
	return gua;
})