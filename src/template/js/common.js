var html = document.querySelector('html'),
		body = document.querySelector('body'),
		wrap = document.querySelector('.wrap');

document.addEventListener('DOMContentLoaded', ()=>{
	// Fields
	// let fields = document.querySelectorAll('.field');
	 
	// if (fields) {
	// 	fields.forEach((field)=>{
	// 		new Field(field);
	// 	});
	// }


	// // Checks
	// let checks = document.querySelectorAll('.check');
	 
	// if (checks) {
	// 	checks.forEach((check)=>{
	// 		new Check(check);
	// 	});
	// }


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
	
	let sections = document.querySelectorAll('.section');
	if (sections) {
		new Sscroll(sections);
	}


	let lines = document.querySelectorAll('.lines');
	if (lines) {
		lines.forEach((el)=>{
			// new Lines(el);
		});
	}



});