let header = document.querySelector('.header'),
		headerClassScroll = '--scrolled',
		headerClassWhite = '--white',
		ham = document.querySelector('.header__ham'),
		nav = document.querySelector('.nav'),
		classToggle = '--toggle';


toggleHeaderClassScroll();
window.addEventListener('scroll', ()=>{
	toggleHeaderClassScroll();
});

ham.addEventListener('click', ()=>{
	ham.classList.toggle(classToggle);
	nav.classList.toggle(classToggle);
	header.classList.toggle(headerClassWhite);
});

// document.addEventListener('wheel', ()=>{
// 	toggleHeaderClassScroll();
// });

function toggleHeaderClassScroll() {
	if (window.pageYOffset > 0) {
		header.classList.add(headerClassScroll);
	} else {
		header.classList.remove(headerClassScroll);
	}
}