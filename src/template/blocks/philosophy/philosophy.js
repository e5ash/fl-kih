let philosophy = document.querySelector('.philosophy');
if (philosophy) {

	let phyClassShow = '--show',
			phyItems = document.querySelectorAll('.philosophy__item'),
			phyInfo  = {
				block: document.querySelector('.phy-info'),
				close: document.querySelector('.phy-info__close'),
				title: document.querySelector('.phy-info__title'),
				text: document.querySelector('.phy-info__text')
			};

	phyInfo.close.addEventListener('click', ()=>{
		phyInfo.block.classList.remove(phyClassShow);
		phyItems.forEach((el)=>{
			el.classList.remove(phyClassShow);
			el.content.style.transform = 'translateY(' + el.desc.offsetHeight + 'px)';
		});
	});

	document.addEventListener('resize', ()=>{
		phyItems.forEach((el)=>{
			if (el == item) {
				return false;
			}

			if (el.classList.contains(phyClassShow)) {
				// item.lines.stopLines();
				el.content.style.transform = 'translateY(' + 0 + 'px)';
				// el.content.style.transform = 'translateY(' + 0 + 'px)';
			} else {
				el.content.style.transform = 'translateY(' + el.desc.offsetHeight + 'px)';
			}
			
		});
	});

	phyItems.forEach((item)=>{
		item.box = item.querySelector('.phi__box');
		item.titleus = item.querySelector('.phi__name').innerText;
		item.content = item.querySelector('.phi__content'),
		item.desc = item.querySelector('.phi__desc'),
		item.text = item.querySelector('.phi__text').innerHTML;

		item.content.style.transform = 'translateY(' + item.desc.offsetHeight + 'px)';

		item.addEventListener('click', (event)=>{
			item.classList.toggle(phyClassShow);
				
			if (item.classList.contains(phyClassShow)) {
				phyInfo.block.classList.add(phyClassShow);
				item.content.style.transform = 'translateY(' + 0 + 'px)';
				item.lines.startLines();
			} else {
				phyInfo.block.classList.remove(phyClassShow);
				item.content.style.transform = 'translateY(' + item.desc.offsetHeight + 'px)';
				// item.lines.stopLines();
			}

			phyInfo.title.innerText = item.titleus;
			phyInfo.text.innerHTML = item.text;

			phyItems.forEach((el)=>{
				if (el == item) {
					return false;
				}

				if (item.classList.contains(phyClassShow)) {
					// item.lines.stopLines();
					el.classList.remove(phyClassShow);
					el.content.style.transform = 'translateY(' + el.desc.offsetHeight + 'px)';
					// el.content.style.transform = 'translateY(' + 0 + 'px)';
				}
				
			});
		});
	});
}