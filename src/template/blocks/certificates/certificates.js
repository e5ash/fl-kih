document.addEventListener('DOMContentLoaded', ()=>{
	let certificates = {
		wrap: document.querySelector('.certificates__wrap'),
		controlPrev: document.querySelector('.certificates__control.--prev'),
		controlNext: document.querySelector('.certificates__control.--next')
	}
	if (certificates) {
		certificates.slider = new Swiper(certificates.wrap, {
			slidesPerView: 4,
			spaceBetween: 40,
			loop: true,
			loopAdditionalSlides: 4,
			navigation: {
				prevEl: certificates.controlPrev,
				nextEl: certificates.controlNext
			}
		})
	}
});