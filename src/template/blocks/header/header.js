let header = document.querySelector('.header'),
		headerClassScroll = '--scrolled';


toggleHeaderClassScroll();
window.addEventListener('scroll', ()=>{
	toggleHeaderClassScroll();
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