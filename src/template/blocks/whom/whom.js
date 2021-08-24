let whoms = document.querySelectorAll('.whom__item');
if (whoms) {
	document.addEventListener('DOMContentLoaded', ()=>{
		setWhomArrowHeight();
	});

	window.addEventListener('resize', ()=>{
		setWhomArrowHeight();
	});

	function setWhomArrowHeight() {
		whoms.forEach((whom)=>{
			let offsetTop = whom.offsetTop;
			let arrow = whom.querySelector('.whom__arrow');
			let arrowDiv = arrow.querySelector('div')
			let height = whom.offsetHeight;

			arrowDiv.style.height = (height - (arrow.offsetTop - offsetTop) - 15) + 'px';
		});
	}
}