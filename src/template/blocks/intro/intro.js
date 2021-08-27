document.addEventListener('DOMContentLoaded', ()=>{
	let introBgs = document.querySelector('.intro__bgs-wrap');
	if (introBgs) {
		new Swiper(introBgs, {
			allowTouchMove: false,
			effect: 'fade',
			parallax: true,
			// fadeEffect: {
			// 	crossFade: true
			// },
			autoplay: {
			 delay: 8000,
			},
		});
	}
})