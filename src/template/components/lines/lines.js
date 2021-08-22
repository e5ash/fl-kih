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
			step: 10,
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
			lg: {
				width: 1920,
				height: 1200
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
		this.attrSize = this.element.getAttribute(this.settings.attr.size);
		this.size = this.attrSize ? this.settings.layout[this.attrSize] : this.settings.layout['lg'];

		
		
		this.createGrid();



			
		setInterval(()=>{
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
		let canvas = this.createCanvas('line', {
			zIndex: -2,
			width: this.size.width,
			height: this.size.height
		});

		let line = {};
		line.X = X;
		line.Y = Y; 
		line.boxes    = this.random(this.settings.line.min, this.settings.line.max);
		line.length   = this.settings.box.size / this.settings.line.step * line.boxes;
		line.sizeMove = this.settings.box.size / this.settings.line.step;
		line.fadinEls = Math.ceil(line.length / 100 * this.settings.line.fadingPercent);
		line.fadeFrom = line.length - line.fadinEls;
		line.fadePercent = 100 / line.fadinEls;
		line.dashes   = [];
		line.move     = 1;
		line.moves    = [];
		line.opacityEls = 0;
		line.interval = null;

		this.linesCount++;
			
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
			line.interval = setInterval(()=>{
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
								line.moves.push(line.lastMove = this.move(dash, this.settings.line.step, direction.default));
							} else {	
								line.moves.push(line.lastMove = this.move(dash, this.settings.line.step, direction.X, direction.Y));
							}
						} else {
							line.moves.push(line.lastMove = this.move(dash, this.settings.line.step, lastMove));
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
		this.grid = canvas = this.grid = this.createCanvas('bg', {
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