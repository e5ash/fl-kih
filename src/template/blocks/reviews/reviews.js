document.addEventListener('DOMContentLoaded', ()=>{
	let reviews = {
		wrap: document.querySelector('.reviews__wrap'),
		controlPrev: document.querySelector('.reviews__control.--prev'),
		controlNext: document.querySelector('.reviews__control.--next')
	}
	if (reviews) {
		reviews.slider = new Swiper(reviews.wrap, {
			loop: true,
			loopAdditionalSlides: 1,
			navigation: {
				prevEl: reviews.controlPrev,
				nextEl: reviews.controlNext
			}
		})
	}
});