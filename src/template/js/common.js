var html = document.querySelector('html'),
		body = document.querySelector('body'),
		wrap = document.querySelector('.wrap');

document.addEventListener('DOMContentLoaded', ()=>{
	// Fields
	let fields = document.querySelectorAll('.field');
	 
	if (fields) {
		fields.forEach((field)=>{
			new Field(field);
		});
	}


	// Checks
	let checks = document.querySelectorAll('.check');
	 
	if (checks) {
		checks.forEach((check)=>{
			new Check(check);
		});
	}


	// // Selects
	// var selects = document.querySelectorAll('.select');
	// if (selects) {
	// 		selects.forEach(select => {
	// 	  new Select(select);
	// 	});

	// 	document.addEventListener('click', (event)=>{
	// 		let openSelects = document.querySelectorAll('.select.--open');
	// 		if (!event.target.closest('.select') && openSelects) {
	// 			openSelects.forEach((select)=> {
	// 				select.classList.remove(Select.classOpen);
	// 			});
	// 		}
	// 	})
	// }


	let lines = document.querySelectorAll('.lines');
	if (lines) {
		lines.forEach((el)=>{
			el.lines = new Lines(el);
		});
	}


	document.body.sscroll = new Sscroll();

	let sideNav = document.querySelector('.sidenav'),
			sideNavItem = document.querySelectorAll('.nav-item'),
			sideNavClassShow = '--show',
			sideNavClassCurrent = '--current',
			sideNavCurrent = null,
			sideNavIsShow = false;

	if (sideNav && sideNavItem) {
		sideNavItem.forEach((item)=>{
			item.link = sideNav.querySelector('a[href*="' + item.id + '"]');
				
			item.section = item.closest('.section');
			item.inner = item.section.inner;
			item.inner.addEventListener('scroll', ()=>{
				sideNavToggleLink();
			});

			item.link.addEventListener('click', (event)=>{
				event.preventDefault();

				sideNavItem.forEach((i)=>{
					i.section.classList.remove('--current');
				});

				item.section.classList.add('--current');
				let section = document.querySelector('.section.--current');
				document.body.sscroll.currentSection = section;

				if (section == item.section) {
					item.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				} else {
					document.body.sscroll.moveSection(section);
					item.scrollIntoView({
						behavior: 'smooth',
						block: 'start'
					});
				}
			});
		});

		sideNavToggleLink();

		window.addEventListener('resize', ()=>{
			sideNavToggleLink();
		});

		document.addEventListener('scroll', ()=>{
			sideNavToggleLink();
		});

		function toggleCurrent(link) {
			if (sideNavCurrent == link) {
				return false;
			}

			if (sideNavCurrent) {
				sideNavCurrent.classList.remove(sideNavClassCurrent);
			}

			sideNavCurrent = link;
			sideNavCurrent.classList.add(sideNavClassCurrent);
		}

		function sideNavToggleLink(){
			sideNavItem.forEach((item, i)=>{
				if (i == 0) {
					sideNavIsShow = false;
				}
				// console.log(item.section.offsetTop, item.offsetHeight, window.pageYOffset)
				if (window.pageYOffset >= item.section.offsetTop && window.pageYOffset <= (item.section.offsetTop + item.section.offsetHeight) && item.section.inner.scrollTop >= item.offsetTop && item.section.inner.scrollTop <= (item.offsetTop + item.offsetHeight)) {
					item.link.classList.add(sideNavClassCurrent);
					toggleCurrent(item.link);
					sideNavIsShow = true;
					sideNav.classList.add(sideNavClassShow);
				}

				if (!sideNavIsShow) {
					sideNavIsShow = false;
					sideNav.classList.remove(sideNavClassShow);
				}
			});
		}
	}


	// let introPluses = document.querySelector('.intro__pluses');
	// if (introPluses) {
	// 	let ow = document.body.offsetWidth; 
	// 	if (ow < 768) {
	// 		introPluses.style.marginRight = - ow / 2 % 20 - ow / 20 + 'px';
	// 	} else {
	// 		introPluses.removeAttribute('style');
	// 	}
	// }

});