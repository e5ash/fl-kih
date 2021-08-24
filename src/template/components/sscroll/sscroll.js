class Sscroll {
	// static classHeightNormal = '';
	static classCurrent = '--current';
	static classHeightAuto = '--h-auto';

	constructor(settings = {
		wrap: '.sections',
		section: '.section',
		nav: '.nav',
		class: {
			wrap: 'sscroll',
			section: 'sscroll__section',
			sectionInner: 'sscroll__section-inner',
			sectionInnerAdd: 'section__inner',
			overflowDisable: 'sscroll-overflow-disable'
		}
	}) {
		// set default fields
		this.settings  = settings;
		this.wrap      = document.querySelector(this.settings.wrap);
		this.links  = [];
		this.event = {};
		this.prevScrollTop = 0;
		this.timeStamp = 0;


		// error if not found els
		if (this.wrap) {
			this.wrap.classList.add(this.settings.class.wrap);
		} else {
			throw new Error('Not found wrapper');
		}

		this.sections = document.querySelectorAll(this.settings.section);
		if (!this.sections) {
			throw new Error('Not found section(s)');	
		}
		// this.sections = Array.from(this.sections);
		this.nav = this.settings.nav ? document.querySelector(this.settings.nav) : null;


		// set overflow hidden for wraps
		document.querySelector('html').classList.add(this.settings.class.overflowDisable);
		document.body.classList.add(this.settings.class.overflowDisable);

		// init sections
		this.sections.forEach((section)=>{
			// set default fields
			section.classList.add(this.settings.class.section);
			
			if (!section.classList.contains(Sscroll.classHeightAuto)) {
				section.style.height = window.innerHeight + 'px';
			}

			section.inner = section.querySelector('.section__inner');
			section.inner.classList.add(this.settings.class.sectionInner)
			
			// nav
			if (this.nav) {
				section.link = this.nav.querySelector('a[href*="' + section.id + '"]');
				if (section.link) {
					this.links.push(section.link);

					section.link.addEventListener('click', (event)=>{
						event.preventDefault();

						if (section.link.classList.contains(Sscroll.classCurrent)) {
							return false;
						}

						// this.setCurrentLink(section.link);
						this.moveSection(section);
					});
				}
			}

			if (section.classList.contains(Sscroll.classCurrent)) {
				this.currentSection = section;
			}

			// events for moves
			section.inner.addEventListener('scroll', (event)=>{
				this.event.scroll = true;

				if (this.goto) {
					this.event.scroll = false;
					return false;
				}

				if (this.isMoved) {
					return false;
				}
				
				section.inner.scrollEnd = Math.ceil(section.inner.scrollTop + section.inner.clientHeight);
				// this.alert.innerHTML = `section.inner.scrollEnd: ${section.inner.scrollEnd}<br> section.inner.scrollTop: ${section.inner.scrollTop}<br> section.inner.scrollHeight: ${section.inner.scrollHeight}<br> move: ${this.isMoved}`;
				if (section.inner.clientHeight < section.inner.scrollHeight) {
					if (section.inner.scrollTop == 0) {
						this.movePrev();
					} else if(section.inner.scrollEnd >= section.inner.scrollHeight){
						this.moveNext();
					}
				}
				this.event.scroll = false;
			});

			section.inner.addEventListener('wheel', (event)=>{
				this.event.wheel = true;

				if (event.ctrlKey || this.goto) {
					this.event.wheel = false;
					return false;
				}

				if (this.isMoved) {
					return false;
				}

				section.inner.scrollEnd = Math.ceil(section.inner.scrollTop + section.inner.clientHeight);
				// this.alert.innerHTML = `section.inner.scrollEnd: ${section.inner.scrollEnd}<br> section.inner.scrollTop: ${section.inner.scrollTop}<br> section.inner.scrollHeight: ${section.inner.scrollHeight}<br> move: ${this.isMoved}`;
				
				if (section.classList.contains('timeline')) {

					let timeline = section.timeline,
							length   = timeline.value.length,
							current  = timeline.value.current;

					if (current == 0 && event.deltaY < 0) {
						this.movePrev(section);

					} else if(current == length - 1 && event.deltaY > 0) {
						this.moveNext(section);
					} else {
						let el = null;

						if (event.deltaY < 0) {
							timeline.skip.setAttribute('data-prev', 'true');
							el = timeline.items[current - 1];
						} else if (event.deltaY > 0) {
							timeline.skip.removeAttribute('data-prev');
							el = timeline.items[current + 1];
						}

						timeline.changeItem(el);
					}
					return false;
				}

				if (section.inner.clientHeight < section.inner.scrollHeight) {
					if (section.inner.scrollTop == 0 && event.deltaY < 0) {
						this.movePrev();
					} else if(section.inner.scrollEnd >= section.inner.scrollHeight && event.deltaY > 0){
						this.moveNext();
					}
				} else {
					if (event.deltaY < 0) {
						this.movePrev();
					} else if(event.deltaY > 0){
						this.moveNext();
					}
				}
				

				this.event.wheel = false;
			});

			section.inner.addEventListener('touchstart', (event)=> {
				this.event.touch = true;

				this.touchStartY = event.touches[0].pageY;
				this.touchStartX = event.touches[0].pageX;
				section.inner.scrollEnd = Math.ceil(section.inner.scrollTop + section.inner.clientHeight);
			});

			section.inner.addEventListener('touchmove', (event)=>{
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

				if (event.target.closest('.noUi-target') || event.target.closest('.tabs__nav') || event.target.closest('.wheel-false')) {
					this.event.touch = false;
					return false;
				}

				let swiper = event.target.closest('.swiper-container');
				if (swiper) {
					if (swiper.swiper.touches.diff != 0) {
						this.event.touch = false;
						return false;	
					}
				}

				section.inner.scrollEnd = Math.ceil(section.inner.scrollTop + section.inner.clientHeight);
				if (section.inner.clientHeight != section.inner.scrollHeight) {
					if (section.inner.scrollTop == 0 && this.touchY < 0) {
						this.movePrev();
					} else if(section.inner.scrollEnd >= section.inner.scrollHeight && this.touchY > 0){
						this.moveNext();
					}
				} else {
					if (this.touchY < 0) {
						this.movePrev();
					} else if(this.touchY > 0){
						this.moveNext();
					}
				}

				this.event.touch = false;
			});
		});


		// set current section & link
		if (!this.currentSection) {
			let checkingSection = this.checkCurrentSection();

			this.currentSection = checkingSection ? checkingSection : this.sections[0]
		}

		this.currentLink = this.currentSection.link;

		this.currentSection.classList.add(Sscroll.classCurrent);
		if (this.currentLink) {
			this.currentLink.classList.add(Sscroll.classCurrent);
		}


		// change section height on resize window
		window.addEventListener('resize', ()=>{
			this.changeHeight();
			this.setScrollSectionDefault();
		});

	}

	checkCurrentSection() {
		let hash    = window.location.hash,
				section = hash ? document.querySelector(hash) : null;

		if (section) {
			return section;
		} else {
			return false;
		}
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
					this.addHash(100);
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
					this.addHash(100);
				} else {
					this.goto = true;
					window.scrollBy(0, speedStep);
				}
			}, intervalSpeed);
		}
	}

	addHash(delay) {
		if (this.currentSection.id) {
			setTimeout(()=>{
				window.location.hash = this.currentSection.id;
			}, delay);
		}
		
	}
	changeHeight() {
		this.sections.forEach((section)=>{
			section.style.height = window.innerHeight + 'px';
		});
	}

	removeCurrent() {
		this.currentSection.classList.remove(Sscroll.classCurrent);
	}

	addCurrent() {
		this.currentSection.classList.add(Sscroll.classCurrent);
	}

	moveSection(direction) {
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
			position = this.next();
		} else if (direction == 'prev') {
			position = this.prev();
		}  else if (typeof direction == 'object') {
			position = direction;
		}

		if (position) {
			if (this.currentSection.lines) {
				this.currentSection.lines.stopLines();
			}
			this.removeCurrent();

			this.currentSection = position;
			if (document.body.offsetWidth > 767) {
				this.currentSection.inner.scrollTo(0, 0);
				this.currentSection.inner.scrollTop = 0;
				this.currentSection.inner.scrollEnd = 0;
			}

			this.addCurrent();
			this.setCurrentLink(this.currentSection.link);
			
			this.scrollToSection(this.currentSection);

			let lines = this.currentSection.querySelectorAll('.lines');
			if (lines) {
				if (this.currentSection.classList.contains('lines')) {
					this.currentSection.lines.startLines();
				}
			}
		}

		
	}
	moveNext() {
		this.moveSection('next');
		
	}
	movePrev() {
		this.moveSection('prev');
	}
	
	setScrollSectionDefault() {
		html.scrollTop = body.scrollTop = this.currentSection.offsetTop;
	}
	setCurrentLink(link) {
		if (this.currentLink) {
			this.currentLink.classList.remove(Sscroll.classCurrent);
		}

		this.currentLink = link;

		if (this.currentLink) {
			this.currentLink.classList.add(Sscroll.classCurrent);
		}
	}

	prev() {
		let el = this.currentSection.previousSibling;
		if (!el.classList && !el.classList.contains('section')) {
			el = el.previousSibling;
		}

		return el;
	}

	next() {
		let el = this.currentSection.nextSibling;

		if (!el.classList && !el.classList.contains('section')) {
			el = el.nextSibling;
		}

		return el;
	}
}