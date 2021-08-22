class Sscroll {
	static classCurrent = '--current';

	constructor(sections, settings = {
		
	}) {
		this.sections = sections;
		this.settings = settings;
		this.event    = {};
			

		this.sections.forEach((section)=>{


			this.setSectionHeight(section);

			window.addEventListener('resize', ()=>{
				this.setSectionHeight(section);
			})

		})

		// events for moves
		// document.addEventListener('scroll', (event)=>{
		// 	console.log(event);
		// 	let section = event.target.closest('.section');

		// 	if (!section) {
		// 		return false;
		// 	} 

		// 	this.event.scroll = true;

		// 	if (this.goto) {
		// 		this.event.scroll = false;
		// 		return false;
		// 	}

		// 	if (this.isMoved) {
		// 		return false;
		// 	}
			
		// 	section.scrollEnd = Math.ceil(section.scrollTop + section.clientHeight);
		// 	// this.alert.innerHTML = `section.scrollEnd: ${section.scrollEnd}<br> section.scrollTop: ${section.scrollTop}<br> section.scrollHeight: ${section.scrollHeight}<br> move: ${this.isMoved}`;
		// 	if (section.clientHeight != section.scrollHeight) {
		// 		if (section.scrollTop == 0) {
		// 			this.movePrev(section);
		// 		} else if(section.scrollEnd >= section.scrollHeight){
		// 			this.moveNext(section);
		// 		}
		// 	}
		// 	this.event.scroll = false;
		// });

		document.addEventListener('wheel', (event)=>{
			let section = event.target.closest('.section');

			if (!section) {
				return false;
			} 

			this.event.wheel = true;

			if (event.ctrlKey || this.goto) {
				this.event.wheel = false;
				return false;
			}

			if (this.isMoved) {
				return false;
			}

			section.scrollEnd = Math.ceil(section.scrollTop + section.clientHeight);
			
			if (event.deltaY < 0) {
				this.movePrev(section);
			} else if(event.deltaY > 0){
				this.moveNext(section);
			}
			

			this.event.wheel = false;
		});

		document.addEventListener('touchstart', (event)=> {
			let section = event.target.closest('.section');

			if (!section) {
				return false;
			} 

			this.event.touch = true;

			this.touchStartY = event.touches[0].pageY;
			this.touchStartX = event.touches[0].pageX;
			section.scrollEnd = Math.ceil(section.scrollTop + section.clientHeight);
		});

		document.addEventListener('touchmove', (event)=>{
			let section = event.target.closest('.section');

			if (!section) {
				return false;
			} 

			this.touchEndY = event.touches[0].pageY;
			this.touchEndX = event.touches[0].pageX;

			this.touchY = this.touchStartY - this.touchEndY;
			this.touchX = this.touchStartX - this.touchEndX;

			if (this.isMoved) {
				// return false;
			}

			if (this.goto) {
				this.event.touch = false;
				return false;
			}

			if (event.target.closest('.wheel-false')) {
				this.event.touch = false;
				return false;
			}

			if (swiper) {
				if (swiper.swiper.touches.diff != 0) {
					this.event.touch = false;
					return false;	
				}
			}

			section.scrollEnd = Math.ceil(section.scrollTop + section.clientHeight);
			if (section.clientHeight != section.scrollHeight) {
				if (section.scrollTop == 0 && this.touchY < 0) {
					this.movePrev(section);
				} else if(section.scrollEnd >= section.scrollHeight && this.touchY > 0){
					this.moveNext(section);
				}
			} else {
				if (this.touchY < 0) {
					this.movePrev(section);
				} else if(this.touchY > 0){
					this.moveNext(section);
				}
			}

			this.event.touch = false;
		});
	}

	setSectionHeight(section) {
		section.style.height = window.innerHeight + 'px';
	}

	scrollToSection(section) {
		if (this.goto) {
			return false;
		}

		this.goto = true;

		let sTop = section.offsetTop;
		let wY = window.pageYOffset;
		let scrollSize = sTop - wY;
		let intervalSpeed = this.event == 'touch' ? 5 : 10;
		let speed = this.event == 'touch' ? 35 : 300;
		let speedStep = +(scrollSize / speed * intervalSpeed);
		let interval = null;
			

		if (wY > sTop) {
			interval = setInterval(()=>{
				if (window.pageYOffset <= sTop) {
					clearInterval(interval);
					window.scrollTo(0, sTop);
					this.goto = false;
				} else {
					this.goto = true;
					window.scrollBy(0, speedStep);
				}
			}, intervalSpeed);
		} else if (wY < sTop){
			interval = setInterval(()=>{
				if (window.pageYOffset >= sTop) {
					clearInterval(interval);
					window.scrollTo(0, sTop);
					this.goto = false;
				} else {
					this.goto = true;
					window.scrollBy(0, speedStep);
				}
			}, intervalSpeed);
		}
	}

	moveSection(direction, section) {
		// this.movePosition = null;
		if (this.isMoved) {
			return false;
		}
		this.isMoved = true;
		setTimeout(()=>{
			this.isMoved = false;
		}, 900);

		let position = null;

		if (direction  == 'next') {
			position = section.nextSibling;
		} else if (direction == 'prev') {
			position = section.previousSibling;
		}  else if (typeof direction == 'object') {
			position = direction;
		}

		section.classList.remove(Sscroll.classCurrent);

		// console.log(section, position);
		if (position) {
			position.classList.add(Sscroll.classCurrent);
			this.scrollToSection(position);
		}

		
	}
	moveNext(section) {
		this.moveSection('next', section);
		
	}
	movePrev(section) {
		this.moveSection('prev', section);
	}
}