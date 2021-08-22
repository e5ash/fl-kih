let header = document.querySelector('.header'),
		headerClassScroll = '--scrolled';



toggleHeaderClassScroll();
document.addEventListener('scroll', ()=>{
	toggleHeaderClassScroll();
});

function toggleHeaderClassScroll() {
	console.log(document.body.scrollTop);
	if (window.pageYOffset > 0) {
		header.classList.add(headerClassScroll);
	} else {
		header.classList.remove(headerClassScroll);
	}
}