let solutions = {
	wrap: document.querySelector('.solutions__wrap'),
	timeline: document.querySelector('.solutions__timeline')
}

if (solutions.wrap && solutions.timeline) {
	solutions.timeline.slider = new Swiper(solutions.timeline, {
		slidesPerView: 6,
		spaceBetween: 40,
		breakpoints: {
			0: {
				slidesPerView: 'auto',
			},
			767: {
				slidesPerView: 6,
			}
		}
	});

	solutions.wrap.slider = new Swiper(solutions.wrap, {
		slidesPerView: 1,
		effect: 'fade',
		fadeEffect: {
			crossFade: true
		},
		thumbs: {
			swiper: solutions.timeline.slider
		}
	});
}