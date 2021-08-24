let togs = document.querySelectorAll('.tog'),
		togClassOpen = '--open';
if (togs) {
	togs.forEach((tog)=>{
		tog.head = tog.querySelector('.tog-head');
		tog.body = tog.querySelector('.tog-body');

		tog.head.addEventListener('click', ()=>{
			tog.classList.toggle(togClassOpen);
			console.log(tog.body.scrollHeight);
			if (tog.classList.contains(togClassOpen)) {
				tog.body.style.height = tog.body.scrollHeight + 'px';
			} else {
				tog.body.style.height = 0 + 'px';
			}
		});
	});

	document.addEventListener('resize', ()=>{
		togs.forEach((tog)=>{
			if (tog.classList.contains(togClassOpen)) {
				tog.body.style.height = tog.body.scrollHeight + 'px';
			}
		});
	});
}