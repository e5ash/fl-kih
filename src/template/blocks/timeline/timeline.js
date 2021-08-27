class Timeline {
	constructor(items, bgs, texts, timeline, skip, date, settings = {
		class: {
			current: '--current'
		}
	}) {
		this.items = items;
		this.bgs   = bgs;
		this.texts = texts;
		this.date  = date;
		this.skip  = skip;
		this.timeline = timeline;
		this.settings = settings;
		this.current  = this.getCurrent();
		this.currents = {};
		this.value = {
			current: 0,
			length: this.items.length
		}


		this.setElementsForItems();
		this.createDefaultYear();
		this.setCurrent(this.items[this.current]);
		this.setDefaultTransformNumbers();
		this.setDefaultTransformTimeline();
		
		this.items.forEach((item)=>{
			item.addEventListener('click', ()=>{
				if (!item.classList.contains(this.settings.class.current)) {
					this.changeItem(item);
				}
			});
		});

		this.skip.addEventListener('click', ()=>{
			let section = event.target.closest('.section');
			if (this.skip.getAttribute('data-prev') == 'true') {
				document.body.sscroll.movePrev(section);
			} else {
				document.body.sscroll.moveNext(section);
			}

			this.skip.removeAttribute('data-prev');
		});

	}

	setElementsForItems() {
		let indexs = [0, 0, 0, 0]
		this.items.forEach((item, i)=>{
			item.index = i;
			item.date = item.innerText;
			item.bg = this.bgs[i];
			item.text = this.texts[i];
			item.compare = [];

			let prevEl = this.items[i - 1];
			if (prevEl) {
				this.compareYears(item, prevEl, indexs);
			}
		});
	}


	getCurrent() {
		return 0;
		// return localStorage.getItem('timeline-current') ? localStorage.getItem('timeline-current') : 0;
	}

	removeCurrent() {
		this.currents.item.classList.remove(this.settings.class.current);
		this.currents.bg.classList.remove(this.settings.class.current);
		this.currents.text.classList.remove(this.settings.class.current);
	}

	setCurrent(item) {

		this.currents.item = item;
		this.currents.bg   = item.bg;
		this.currents.text = item.text;

		item.classList.add(this.settings.class.current);
		item.bg.classList.add(this.settings.class.current);
		item.text.classList.add(this.settings.class.current);

		this.value.current = this.currents.item.index;
		localStorage.setItem('timeline-current', this.currents.item.index);
	}

	createYear(value, el, tag = 'div', cls = 'timedate__year') {
		let year = document.createElement(tag);
		year.className = cls;
		year.innerText = value;
		year.el = el;

		return year;
	}

	createDefaultYear() {
		this.items[0].compare = [0, 0, 0, 0];
		for (let i = 0; i < 4; i++) {
			this.date[i].prepend(this.createYear(this.items[0].date[i], this.items[0].date[i]));
		}
	}

	compareYears(current, prev, indexs) {
		for (let i = 0; i < 4; i++) {
			if (current.date[i] != prev.date[i]) {
				indexs[i]++;
				this.date[i].append(this.createYear(current.date[i], current));
			}

			current.compare[i] = indexs[i];
		}
	}


	setDefaultTransformNumbers() {
		this.date.forEach((number, numberIndex)=>{
			number.years = number.querySelectorAll('.timedate__year');
			number.years.forEach((year, i)=>{
				if (year.el == this.currents.item) { 
					let transformValue = year.offsetHeight * i;
					number.style.transform = 'translateY(-' + transformValue + 'px)';
				}
			});
		});
	}

	setDefaultTransformTimeline() {
		let transformValue = this.currents.item.offsetWidth * this.currents.item.index;
		this.timeline.style.transform = 'translateX(-' + transformValue  + 'px)';
	}

	transformYear(el) {
		for (let i = 0; i < 4; i++) {
			if (el.compare[i] != this.currents.item.compare[i]) {
				let transformValue = this.date[0].years[0].offsetHeight * el.compare[i];
				this.date[i].style.transform = 'translateY(-' + transformValue + 'px)';
			}
		}
	}
	changeItem(el) {
		this.transformYear(el);
		this.removeCurrent();
		this.setCurrent(el);

		this.setDefaultTransformTimeline();

		
	}

}

let timelineBlock = document.querySelector('.timeline');

if (timelineBlock) {
	timelineBlock.timeline = new Timeline(
		document.querySelectorAll('.timeline__item'),
		document.querySelectorAll('.timebgs__item'),
		document.querySelectorAll('.timeline__text'),
		document.querySelector('.timeline__list'),
		document.querySelector('.timeline__btn-skip'),
		[
			document.querySelector('.timedate__number.--first .timedate__inner'),
			document.querySelector('.timedate__number.--second .timedate__inner'),
			document.querySelector('.timedate__number.--third .timedate__inner'),
			document.querySelector('.timedate__number.--fourth .timedate__inner')
		]
	);
}