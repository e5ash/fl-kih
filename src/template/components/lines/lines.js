class Lines {
	constructor(element, settings = {
		box: {
			size: 40,
			stroke: 1,
			opacity: 0.3,
			color: '#fff'
		},
		x: {
			stroke: 1,
			opacity: 0.1,
			color: '#fff',
		},
		line: {
			stroke: 2,
			opacity: 1,
			color: '#fff',
			speed: 100,
			min: 2,
			max: 10,
			dispersion: 1,
			rotatedFrom: 5,
			fadingPercent: 30 
		},
		layout: {
			max: 5,
			sm: {
				width: 324,
				height: 324,
				min: 1,
				max: 2,
				step: 10,
			},
			lg: {
				0: {
					size: 20,
					min: 2,
					max: 5,
					step: 5,
					lines: 2, 
				},
				768: {
					size: 30,
					min: 2,
					max: 5,
					step: 5,
					lines: 3, 
				},
				1024: {
					min: 2,
					max: 10,
					step: 5,
					lines: 6, 
				}
				width: 2560,
				height: 1400,
				min: 2,
				max: 10,
				step: 5,
			}
		},
		class: {
			name: 'lines'
		},
		attr: {
			size: 'data-lines-size'
		},

	}) {
		this.element = element;
		this.settings = settings;
		this.linesCount = 0;
		this.interval = null;
		this.attrSize = this.element.getAttribute(this.settings.attr.size);
		this.size = this.attrSize ? this.settings.layout[this.attrSize] : this.settings.layout['lg'];
		this.lines = [];
		
		// this.createGrid();
	}

	stopLines() {
		clearInterval(this.interval);

		for(let i = 0; i < this.lines.length; i++) {
			let line = this.lines[i];

			// console.log(line.canvas);

			// line.canvas.ctx.clearRect(0,0, canvas.width, canvas.height);
			line.line = null;
			line.canvas.remove();
			clearInterval(line.interval);
		}
		this.lines = [];
		this.linesCount = 0;
	}

	startLines() {
		this.interval = setInterval(()=>{
			if (this.linesCount <= this.settings.layout.max) {
				let x = this.roundDirection(this.random(0, this.element.offsetWidth)),
						y = this.roundDirection(this.random(0, this.element.offsetHeight)),
						d = this.random(1, 8);

				this.createLine(x, y, {X: this.dispersion(d - this.settings.line.dispersion), Y: this.dispersion(d + this.settings.line.dispersion), default: d});
			}
		}, 1000);
	}
	createCanvas(name, styles) {
		let canvas = document.createElement('canvas');
		canvas.classList.add(this.settings.class.name + '__' + name);

		this.setDefaultStyles(canvas, styles);
		this.element.append(canvas);

		canvas.ctx = canvas.getContext('2d');
		return canvas;
	}

	setDefaultStyles(canvas, styles) {
		canvas.style.position = 'absolute';
		canvas.style.zIndex = styles.zIndex;
		canvas.setAttribute('width', styles.width);
		canvas.setAttribute('height', styles.height);
		canvas.style.top = 0;
		canvas.style.left = 50 + '%';
		canvas.style.transform = 'translateX(-50%)';
	}

	createLine(X, Y, direction) {
		let item = {};
		let canvas = this.createCanvas('line', {
			zIndex: -2,
			width: this.size.width,
			height: this.size.height
		});

		let line = {};
		line.X = X;
		line.Y = Y; 
		line.boxes    = this.random(this.size.min, this.size.max);
		line.length   = this.settings.box.size / this.size.step * line.boxes;
		line.sizeMove = this.settings.box.size / this.size.step;
		line.fadinEls = Math.ceil(line.length / 100 * this.settings.line.fadingPercent);
		line.fadeFrom = line.length - line.fadinEls;
		line.fadePercent = 100 / line.fadinEls;
		line.dashes   = [];
		line.move     = 1;
		line.moves    = [];
		line.opacityEls = 0;
		line.interval = null;

		item.canvas = canvas;
		item.line = line;

		this.linesCount++;
		this.lines.push(item)
			
		canvas.ctx.lineWidth = this.settings.line.stroke;

		for (let i = 0; i < line.length; i++) {
			let opacity = this.settings.line.opacity;
			if (i >= line.fadeFrom) {
				line.opacityEls++;
				opacity = (line.fadinEls - line.opacityEls) * line.fadePercent / 100;
			}
			line.dashes[i] = {
				xM: line.X,
				yM: line.Y,
				xL: line.X,
				yL: line.Y,
				opacity: opacity,
				coords: []
			}
		}

		line.draw = (i)=>{
			canvas.ctx.beginPath();
			canvas.ctx.strokeStyle = this.settings.line.color;
			canvas.ctx.globalAlpha = line.dashes[i].opacity;

			canvas.ctx.moveTo(line.dashes[i].xM, line.dashes[i].yM);
			canvas.ctx.lineTo(line.dashes[i].xL, line.dashes[i].yL);
			canvas.ctx.stroke();
			canvas.ctx.closePath();
		}

		let draw = ()=>{
			item.interval = line.interval = setInterval(()=>{
				canvas.ctx.clearRect(0,0, canvas.width, canvas.height);
				for (let i = 0; i < line.move && i < line.length; i++) {
					let dash = line.dashes[i],
							prevDash = line.dashes[i - 1];

					dash.coords[i + 1] = {
						xM: dash.xM,
						yM: dash.yM,
						xL: dash.xL,
						yL: dash.yL
					};

					

					if (prevDash) {
						dash.xM = prevDash.coords[i]["xM"];
						dash.yM = prevDash.coords[i]["yM"];
						dash.xL = prevDash.coords[i]["xL"];
						dash.yL = prevDash.coords[i]["yL"];
					}


					line.draw(i);

					if (i == 0) {
						let lastMove = line.moves[line.moves.length - 1];
						if (line.move % line.sizeMove == 0) {
							if (line.move < 4) {
								line.moves.push(line.lastMove = this.move(dash, this.size.step, direction.default));
							} else {	
								line.moves.push(line.lastMove = this.move(dash, this.size.step, direction.X, direction.Y));
							}
						} else {
							line.moves.push(line.lastMove = this.move(dash, this.size.step, lastMove));
						}	
						line.draw(i);
					}
				}


				line.move++;


				if (line.dashes[line.dashes.length - 1].xM <= 0 || line.dashes[line.dashes.length - 1].yM  <= 0 || line.dashes[line.dashes.length - 1].xM >= this.element.offsetWidth || line.dashes[line.dashes.length - 1].yM >= this.element.offsetHeight) {
					canvas.ctx.clearRect(0,0, canvas.width, canvas.height);
					
					clearInterval(line.interval);
					canvas.remove();
					this.linesCount--;


					setTimeout(()=>{
						line = null;
						canvas = null;
					}, 500)
					
				}
			}, 60)
		}



		window.requestAnimationFrame(draw)

		


	}

	createGrid() {
		let canvas;
		this.grid = canvas = this.createCanvas('bg', {
			zIndex: -5,
			width: this.size.width,
			height: this.size.height
		});

		for (let x = 0; x <= this.size.width; x++) {
			for (let y = 0; y <= this.size.height; y += this.settings.box.size) {
				canvas.ctx.globalAlpha = this.settings.box.opacity;
				canvas.ctx.strokeStyle = this.settings.box.color;
				canvas.ctx.lineWidth = this.settings.box.stroke;

				canvas.ctx.beginPath();
				canvas.ctx.moveTo(x * this.settings.box.size, y);
		    canvas.ctx.lineTo(x * this.settings.box.size + this.settings.box.size, y);
				canvas.ctx.stroke();
				canvas.ctx.closePath();

				canvas.ctx.beginPath();
				canvas.ctx.moveTo(x * this.settings.box.size, y);
		    canvas.ctx.lineTo(x * this.settings.box.size, y + this.settings.box.size -1);
				canvas.ctx.stroke();
				canvas.ctx.closePath();


				canvas.ctx.globalAlpha = this.settings.x.opacity;
				canvas.ctx.strokeStyle = this.settings.x.color;
				canvas.ctx.lineWidth = this.settings.x.stroke;

				canvas.ctx.beginPath();
				canvas.ctx.moveTo(x * this.settings.box.size + 2, y +2);
		    canvas.ctx.lineTo(x * this.settings.box.size + this.settings.box.size - 2, y + this.settings.box.size - 2);
				canvas.ctx.stroke();
				canvas.ctx.closePath();

				canvas.ctx.beginPath();
				canvas.ctx.moveTo(x * this.settings.box.size + this.settings.box.size - 2, y + 2);
				canvas.ctx.lineTo(x * this.settings.box.size + 2, y + this.settings.box.size - 2);
				canvas.ctx.stroke();
				canvas.ctx.closePath();

				canvas.ctx.save();
			}
		}
	}

	move(dash, step, to, end) {
		let value = to && end ? this.random(to, end) : to;

		switch(value) {
			case 1:
				dash.xL = dash.xM;
				dash.xM = dash.xM;
				dash.yL = dash.yM;
				dash.yM -= step;
				break;
			case 2:
				dash.xL = dash.xM;
				dash.xM += step;
				dash.yL = dash.yM;
				dash.yM -= step;
				break;
			case 3:
				dash.xL = dash.xM;
				dash.xM += step;
				dash.yL = dash.yM;
				dash.yM = dash.yM;
				break;
			case 4:
				dash.xL = dash.xM;
				dash.xM += step;
				dash.yL = dash.yM;
				dash.yM += step;
				break;
			case 5:
				dash.xL = dash.xM;
				dash.xM = dash.xM;
				dash.yL = dash.yM;
				dash.yM += step;
				break;
			case 6:
				dash.xL = dash.xM;
				dash.xM -= step;
				dash.yL = dash.yM;
				dash.yM += step;
				break;
			case 7:
				dash.xL = dash.xM;
				dash.xM -= step;
				dash.yL = dash.yM;
				dash.yM = dash.yM;
				break;
			case 8:
				dash.xL = dash.xM;
				dash.xM -= step;
				dash.yL = dash.yM;
				dash.yM -= step;
				break;
		}

		return value;

	}
	dispersion(value) {
		if (value > 8) {
			return 8;
		} else if (value < 0) {
			return 0;
		} else {
			return value;
		}
	}

	roundDirection(value) {
		return value - (value % this.settings.box.size);
	}
	random(min = 0, max = 1) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}