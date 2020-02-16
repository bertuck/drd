/*The MIT License (MIT)

Copyright (c) 2014 Romain Gervois
http://www.romaingervois.fr/carrousel/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

var carrousels = {};

var carrouselsvar = {
	duration: 5000,
	help: 'Accéder aux autres panneaux via les flèches directionnelles, appuyez sur la touche entrée pour vous rendre sur le panneau courant ou appuyez sur la touche supprimer pour annuler ce message.'
};

var carrouselssrc = {
	selectedtab: ['', ''],
	previoustab: ['./img/carrousel/arrow-left.svg', './img/carrousel/arrow-left.svg'],
	nexttab: ['./img/carrousel/arrow-right.svg', './img/carrousel/arrow-right.svg']
};

var carrouselstxt = {
	playpause: ['Relancer le carrousel ci-après', 'Arrêter le carrousel ci-après'],
	previoustab: ['Aucun item précédent', 'Item précédent'],
	nexttab: ['Aucun item suivant', 'Item suivant']
};

function createCarrousel(fragment) {
	if (!fragment.hasAttribute('id')) {
		fragment.setAttribute('id', getAvailableId('carrousel'));
	}
	fragment.addEventListener('click', function(event) {
		var node = event.target;
		while (['li', 'button'].indexOf(node.tagName.toLowerCase()) == -1 && node != fragment) {
			node = node.parentNode;
		}
		if (node != fragment) {
			var matches = (node.matches || node.mozMatchesSelector || node.msMatchesSelector || node.webkitMatchesSelector);
			matches = matches.name || matches.toString().match(/^\s*function\s*(\S*)\s*\(/)[1]; // IE9.
			if (node[matches]('#' + this.getAttribute('id') + ' > ol[role="tablist"] > li[role="tab"]') || node[matches]('#' + this.getAttribute('id') + ' > p.carrousel-previousitem button, #' + this.getAttribute('id') + ' > p.carrousel-nextitem button')) {
				this.removeAttribute('data-reverse');
			}
		}
	}, false);
	var tabpanels = document.querySelectorAll('#' + fragment.getAttribute('id') + ' > div');
	var tabs = document.createElement('ol');
	tabs.setAttribute('role', 'tablist');
	fragment.insertBefore(tabs, fragment.firstChild);
	var carrouselhelp = null;
	if (fragment.getAttribute('data-help') == 'true' && !(readCookie('carrouselhelp') == 'false')) {
		carrouselhelp = document.createElement('p');
		carrouselhelp.setAttribute('id', fragment.getAttribute('id') + '-tooltip');
		carrouselhelp.setAttribute('role', 'tooltip');
		carrouselhelp.setAttribute('hidden', 'hidden');
		carrouselhelp.appendChild(document.createTextNode(carrouselsvar.help));
		tabs.addEventListener('keydown', deleteCarrouselHelp, false);
	}
	var selectedtabi = fragment.getAttribute('data-selectedpanel');
	if (selectedtabi == 'last') {
		selectedtabi = tabpanels.length - 1;
	}
	else if (selectedtabi >= 1 && selectedtabi <= tabpanels.length) {
		selectedtabi = selectedtabi - 1;
	}
	else {
		selectedtabi = 0;
	}
	var carrouselviewport = document.createElement('div');
	for (var i = 0; i < tabpanels.length; i++) {
		if (!tabpanels[i].hasAttribute('id')) {
			tabpanels[i].setAttribute('id', getAvailableId('tabpanel'));
		}
		var tab = document.createElement('li');
		tab.setAttribute(fragment.getAttribute('data-ariacontrols') == 'false' ? 'data-controls' : 'aria-controls', tabpanels[i].getAttribute('id'));
		tab.setAttribute('role', 'tab');
		var heading = tabpanels[i].querySelector('[role="heading"], h1, h2, h3, h4, h5, h6');
		if (i == selectedtabi) {
			tabpanels[i].setAttribute('aria-hidden', 'false');
			tab.setAttribute('aria-selected', 'true');
			tab.setAttribute('tabindex', '0');
		}
		else {
			tabpanels[i].setAttribute('aria-hidden', 'true');
			tab.setAttribute('aria-selected', 'false');
			tab.setAttribute('tabindex', '-1');
		}
		if (fragment.getAttribute('data-tabs') == 'text') {
			tab.setAttribute('aria-label', heading.textContent);
			var span = document.createElement('span');
			span.setAttribute('title', tab.getAttribute('aria-label'));
			span.appendChild(document.createTextNode(i + 1));
			tab.appendChild(span);
		}
		else {
			var tabimg = document.createElement('img');
			tabimg.setAttribute('src', carrouselssrc.selectedtab[(i == selectedtabi ? 1 : 0)]);
			tabimg.setAttribute('alt', heading.textContent);
			// tabimg.setAttribute('height', '24');
			// tabimg.setAttribute('width', '24');
			tabimg.setAttribute('title', tabimg.getAttribute('alt'));
			tab.appendChild(tabimg);
		}
		if (i != selectedtabi) {
			var focusables = tabpanels[i].querySelectorAll('a, area, button, input, select, textarea, [contenteditable="true"], [tabindex]');
			for (var f = 0; f < focusables.length; f++) {
				if (focusables[f].hasAttribute('contenteditable')) {
					focusables[f].setAttribute('data-contenteditable', 'true');
					focusables[f].removeAttribute('contenteditable');
				}
				if (focusables[f].hasAttribute('tabindex')) {
					focusables[f].setAttribute('data-tabindex', focusables[f].getAttribute('tabindex'));
				}
				else {
					focusables[f].setAttribute('data-removetabindex', 'true');
				}
				focusables[f].setAttribute('tabindex', '-1');
			}
		}
		tab.setAttribute('id', getAvailableId('tab'));
		if (carrouselhelp) {
			tab.setAttribute('aria-describedby', carrouselhelp.getAttribute('id'));
			tab.addEventListener('mousedown', carrouselHelpTabMouseDown, false);
			tab.addEventListener('keydown', carrouselHelpTabKeyDown, false);
			tab.addEventListener('focus', carrouselHelpTabFocus, false);
			tab.addEventListener('blur', carrouselHelpTabBlur, false);
		}
		tab.addEventListener('click', function(event) {
			if (this.getAttribute('aria-selected') == 'false') {
				if (!(this.parentNode.parentNode.getAttribute('data-navbuttons') == 'false')) {
					var previousitem = this.parentNode.nextSibling;
					while (previousitem.nodeType != 1) {
						previousitem = previousitem.nextSibling;
					}
					previousitem = previousitem.firstChild;
					if (!this.previousSibling) {
						previousitem.setAttribute('disabled', 'disabled');
						previousitem.firstChild.setAttribute('alt', carrouselstxt.previoustab[0]);
						previousitem.firstChild.setAttribute('src', carrouselssrc.previoustab[0]);
						previousitem.firstChild.setAttribute('title', previousitem.firstChild.getAttribute('alt'));
					}
					else {
						previousitem.removeAttribute('disabled');
						var txt = this.previousSibling.firstChild;
						if (txt.tagName.toLowerCase() == 'img') {
							txt = txt.getAttribute('alt');
						}
						else {
							txt = txt.parentNode.getAttribute('aria-label');
						}
						previousitem.firstChild.setAttribute('alt', txt + ', ' + carrouselstxt.previoustab[1].toLowerCase());
						previousitem.firstChild.setAttribute('src', carrouselssrc.previoustab[1]);
						previousitem.firstChild.setAttribute('title', previousitem.firstChild.getAttribute('alt'));
					}
					var nextitem = this.parentNode.parentNode.lastChild;
					if (nextitem.getAttribute('role') == 'tooltip') {
						nextitem = nextitem.previousSibling;
					}
					nextitem = nextitem.firstChild;
					if (!this.nextSibling) {
						nextitem.setAttribute('disabled', 'disabled');
						nextitem.firstChild.setAttribute('alt', carrouselstxt.nexttab[0]);
						nextitem.firstChild.setAttribute('src', carrouselssrc.nexttab[0]);
						nextitem.firstChild.setAttribute('title', nextitem.firstChild.getAttribute('alt'));
					}
					else {
						nextitem.removeAttribute('disabled');
						var txt = this.nextSibling.firstChild;
						if (txt.tagName.toLowerCase() == 'img') {
							txt = txt.getAttribute('alt');
						}
						else {
							txt = txt.parentNode.getAttribute('aria-label');
						}
						nextitem.firstChild.setAttribute('alt', txt + ', ' + carrouselstxt.nexttab[1].toLowerCase());
						nextitem.firstChild.setAttribute('src', carrouselssrc.nexttab[1]);
						nextitem.firstChild.setAttribute('title', nextitem.firstChild.getAttribute('alt'));
					}
				}
				var itemslist = this.parentNode;
				var n = 0;
				for (var i = 0; i < itemslist.childNodes.length; i++) {
					n++;
					if (itemslist.childNodes[i] == this) {
						break;
					}
				}
				var carrouselviewport = itemslist.nextSibling;
				while (carrouselviewport.nodeType != 1 || (carrouselviewport.tagName && carrouselviewport.tagName.toLowerCase() != 'div')) {
					carrouselviewport = carrouselviewport.nextSibling;
				}
				carrouselviewport.setAttribute('class', itemslist.parentNode.getAttribute('id') + '-' + n);
				var selected = this.parentNode.querySelector('[aria-selected="true"]');
				if (!itemslist.parentNode.getAttribute('data-tabs') || itemslist.parentNode.getAttribute('data-tabs') == 'dots') {
					selected.firstChild.setAttribute('src', carrouselssrc.selectedtab[0]);
				}
				selected.setAttribute('aria-selected', 'false');
				selected.setAttribute('tabindex', '-1');
				var ariacontrols = this.parentNode.parentNode.getAttribute('data-ariacontrols') == 'false' ? 'data-controls' : 'aria-controls';
				var selectedtabpanel = document.getElementById(selected.getAttribute(ariacontrols));
				selectedtabpanel.setAttribute('aria-hidden', 'true');
				var focusables = selectedtabpanel.querySelectorAll('a, area, button, input, select, textarea, [contenteditable="true"], [tabindex]');
				for (var f = 0; f < focusables.length; f++) {
					if (focusables[f].hasAttribute('contenteditable')) {
						focusables[f].setAttribute('data-contenteditable', 'true');
						focusables[f].removeAttribute('contenteditable');
					}
					if (focusables[f].hasAttribute('tabindex')) {
						focusables[f].setAttribute('data-tabindex', focusables[f].getAttribute('tabindex'));
					}
					else {
						focusables[f].setAttribute('data-removetabindex', 'true');
					}
					focusables[f].setAttribute('tabindex', '-1');
				}
				if (!itemslist.parentNode.getAttribute('data-tabs') || itemslist.parentNode.getAttribute('data-tabs') == 'dots') {
					this.firstChild.setAttribute('src', carrouselssrc.selectedtab[1]);
				}
				this.setAttribute('aria-selected', 'true');
				this.setAttribute('tabindex', '0');
				var tabpanel = document.getElementById(this.getAttribute(ariacontrols));
				tabpanel.setAttribute('aria-hidden', 'false');
				focusables = tabpanel.querySelectorAll('[data-tabindex], [data-removetabindex]');
				for (var f = 0; f < focusables.length; f++) {
					if (focusables[f].hasAttribute('data-contenteditable')) {
						focusables[f].setAttribute('contenteditable', 'true');
						focusables[f].removeAttribute('data-contenteditable');
					}
					if (focusables[f].hasAttribute('data-tabindex')) {
						focusables[f].setAttribute('tabindex', focusables[f].getAttribute('data-tabindex'));
						focusables[f].removeAttribute('data-tabindex');
					}
					else {
						focusables[f].removeAttribute('data-removetabindex');
						focusables[f].removeAttribute('tabindex');
					}
				}
			}
		}, false);
		tab.addEventListener('keydown', function(event) {
			if ([37, 38].indexOf(event.keyCode) > -1) {
				var previous = this.previousSibling;
				if (!previous) {
					previous = this.parentNode.lastChild;
				}
				var e = document.createEvent('MouseEvent');
				e.initEvent('click', true, true);
				previous.focus();
				previous.dispatchEvent(e);
				event.preventDefault();
			}
			else if ([39, 40].indexOf(event.keyCode) > -1) {
				var next = this.nextSibling;
				if (!next) {
					next = this.parentNode.firstChild;
				}
				var e = document.createEvent('MouseEvent');
				e.initEvent('click', true, true);
				next.focus();
				next.dispatchEvent(e);
				event.preventDefault();
			}
			else if (event.keyCode == 13) {
				var tabpanel = document.getElementById(this.getAttribute(this.hasAttribute('data-controls') ? 'data-controls' : 'aria-controls'));
				tabpanel.setAttribute('tabindex', '-1');
				tabpanel.focus();
			}
		}, false);
		tabs.appendChild(tab);
		tabpanels[i].setAttribute('aria-labelledby', tab.getAttribute('id'));
		tabpanels[i].setAttribute('role', 'tabpanel');
		tabpanels[i].addEventListener('keydown', function(event) {
			if (event.ctrlKey && [38, 33, 34].indexOf(event.keyCode) > -1) {
				var current = document.getElementById(this.getAttribute('aria-labelledby'));
				if (event.keyCode == 38) {
					current.focus();
				}
				else if (event.keyCode == 33) {
					var previous = current.previousSibling;
					if (!previous) {
						previous = current.parentNode.lastChild;
					}
					var e = document.createEvent('MouseEvent');
					e.initEvent('click', true, true);
					previous.focus();
					previous.dispatchEvent(e);
				}
				else if (event.keyCode == 34) {
					var next = current.nextSibling;
					if (!next) {
						next = current.parentNode.firstChild;
					}
					var e = document.createEvent('MouseEvent');
					e.initEvent('click', true, true);
					next.focus();
					next.dispatchEvent(e);
				}
				event.preventDefault();
			}
		}, false);
		tabpanels[i].addEventListener('transitionend', carrouselItemChangeEnd, false);
		tabpanels[i].addEventListener('oTransitionEnd', carrouselItemChangeEnd, false);
		tabpanels[i].addEventListener('webkitTransitionEnd', carrouselItemChangeEnd, false);
	}
	var styles = [];
	for (var i = 0; i < tabpanels.length; i++) {
		if (i == selectedtabi) {
			carrouselviewport.setAttribute('class', fragment.getAttribute('id') + '-' + (i + 1));
		}
		carrouselviewport.appendChild(tabpanels[i].parentNode.removeChild(tabpanels[i]));
		styles.push('#' + fragment.getAttribute('id') + ' .' + fragment.getAttribute('id') + '-' + (i + 1) + ' > div { left: ' + (i > 0 ? -(i * 100) + '%' : 0) + '; }');
	}
	var style = document.createElement('style');
	style.setAttribute('type', 'text/css');
	style.appendChild(document.createTextNode(styles.join(' ')));
	document.querySelector('head').appendChild(style);
	if (!(fragment.getAttribute('data-navbuttons') == 'false')) {
		var globalpreviousp = document.createElement('p');
		globalpreviousp.setAttribute('class', 'carrousel-previousitem');
		var globalpreviousbutton = document.createElement('button');
		globalpreviousbutton.setAttribute('type', 'button');
		if (selectedtabi == 0) {
			globalpreviousbutton.setAttribute('title', carrouselstxt.previoustab[0]);
			globalpreviousbutton.setAttribute('disabled', 'disabled');
		}
		else {
			var txt = document.getElementById(tabpanels[selectedtabi - 1].getAttribute('aria-labelledby')).firstChild;
			if (txt.tagName.toLowerCase() == 'img') {
				txt = txt.getAttribute('alt');
			}
			else {
				txt = txt.parentNode.getAttribute('aria-label');
			}
			globalpreviousbutton.setAttribute('title', txt + ', ' + carrouselstxt.previoustab[1].toLowerCase());
		}
		if (carrouselhelp) {
			globalpreviousbutton.addEventListener('keydown', carrouselHelpGlobalButtonKeyDown, false);
			globalpreviousbutton.addEventListener('mousedown', carrouselHelpGlobalPreviousButtonMouseDown, false);
		}
		globalpreviousbutton.addEventListener('click', function(event) {
			var e = document.createEvent('MouseEvent');
			e.initEvent('click', false, true);
			var tab = this.parentNode.parentNode.querySelector('ol[role="tablist"] li[role="tab"][aria-selected="true"]');
			tab = tab.previousSibling ? tab.previousSibling : tab.parentNode.lastChild;
			tab.focus();
			tab.dispatchEvent(e);
		}, false);
		var globalpreviousbuttonimg = document.createElement('img');
		globalpreviousbuttonimg.setAttribute('src', carrouselssrc.previoustab[globalpreviousbutton.disabled ? 0 : 1]);
		globalpreviousbuttonimg.setAttribute('alt', globalpreviousbutton.getAttribute('title'));
		globalpreviousbutton.removeAttribute('title');
		// globalpreviousbuttonimg.setAttribute('height', '24');
		// globalpreviousbuttonimg.setAttribute('width', '24');
		globalpreviousbuttonimg.setAttribute('title', globalpreviousbuttonimg.getAttribute('alt'));
		globalpreviousbutton.appendChild(globalpreviousbuttonimg);
		globalpreviousp.appendChild(globalpreviousbutton);
		fragment.appendChild(globalpreviousp);
	}
	fragment.appendChild(carrouselviewport);
	if (!(fragment.getAttribute('data-navbuttons') == 'false')) {
		var globalnextp = document.createElement('p');
		globalnextp.setAttribute('class', 'carrousel-nextitem');
		var globalnextbutton = document.createElement('button');
		globalnextbutton.setAttribute('type', 'button');
		if (selectedtabi == tabpanels.length - 1) {
			globalnextbutton.setAttribute('title', carrouselstxt.nexttab[0]);
			globalnextbutton.setAttribute('disabled', 'disabled');
		}
		else {
			var txt = document.getElementById(tabpanels[selectedtabi + 1].getAttribute('aria-labelledby')).firstChild;
			if (txt.tagName.toLowerCase() == 'img') {
				txt = txt.getAttribute('alt');
			}
			else {
				txt = txt.parentNode.getAttribute('aria-label');
			}
			globalnextbutton.setAttribute('title', txt + ', ' + carrouselstxt.nexttab[1].toLowerCase());
		}
		if (carrouselhelp) {
			globalnextbutton.addEventListener('keydown', carrouselHelpGlobalButtonKeyDown, false);
			globalnextbutton.addEventListener('mousedown', carrouselHelpGlobalNextButtonMouseDown, false);
		}
		globalnextbutton.addEventListener('click', function(event) {
			var e = document.createEvent('MouseEvent');
			e.initEvent('click', false, true);
			var tab = this.parentNode.parentNode.querySelector('ol[role="tablist"] li[role="tab"][aria-selected="true"]');
			tab = tab.nextSibling ? tab.nextSibling : tab.parentNode.firstChild;
			tab.focus();
			tab.dispatchEvent(e);
		}, false);
		var globalnextbuttonimg = document.createElement('img');
		globalnextbuttonimg.setAttribute('src', carrouselssrc.nexttab[globalnextbutton.disabled ? 0 : 1]);
		globalnextbuttonimg.setAttribute('alt', globalnextbutton.getAttribute('title'));
		globalnextbutton.removeAttribute('title');
		// globalnextbuttonimg.setAttribute('height', '24');
		// globalnextbuttonimg.setAttribute('width', '24');
		globalnextbuttonimg.setAttribute('title', globalnextbuttonimg.getAttribute('alt'));
		globalnextbutton.appendChild(globalnextbuttonimg);
		globalnextp.appendChild(globalnextbutton);
		fragment.appendChild(globalnextp);
	}
	if (carrouselhelp) {
		fragment.appendChild(carrouselhelp);
	}
	var play = fragment.getAttribute('data-play');
	if (['auto', 'demand'].indexOf(play) > -1) {
		var carrouselstopbutton = document.createElement('button');
		carrouselstopbutton.setAttribute('type', 'button');
		carrouselstopbutton.setAttribute('data-stop', play == 'demand' ? 'true' : 'false');
		carrouselstopbutton.addEventListener('click', function(event) {
			if (this.getAttribute('data-stop') == 'true') {
				this.setAttribute('data-stop', 'false');
				var fragmentid = this.parentNode.parentNode.getAttribute('id');
				var duration = this.parentNode.parentNode.hasAttribute('data-duration') ? this.parentNode.parentNode.getAttribute('data-duration') : carrouselsvar.duration;
				carrousels[fragmentid] = window.setInterval(function () { carrouselItemChange(fragmentid); }, duration);
				this.replaceChild(document.createTextNode(carrouselstxt.playpause[1]), this.firstChild);
			}
			else {
				this.setAttribute('data-stop', 'true');
				window.clearInterval(carrousels[this.parentNode.parentNode.getAttribute('id')]);
				carrousels[this.parentNode.parentNode.getAttribute('id')] = null;
				this.replaceChild(document.createTextNode(carrouselstxt.playpause[0]), this.firstChild);
			}
		}, false);
		carrouselstopbutton.appendChild(document.createTextNode(carrouselstxt.playpause[play == 'demand' ? 0 : 1]));
		var carrouselstopp = document.createElement('p');
		carrouselstopp.setAttribute('class', 'carrousel-playpause');
		carrouselstopp.appendChild(carrouselstopbutton);
		fragment.insertBefore(carrouselstopp, fragment.firstChild);
		fragment.addEventListener('mouseover', function(event) {
			this.setAttribute('data-stop', 'true');
		}, false);
		fragment.addEventListener('mouseout', function(event) {
			var activeelement = document.activeElement;
			var parent = activeelement.parentNode;
			var child = false;
			while (parent) {
				if (parent == this) {
					child = true;
					break;
				}
				parent = parent.parentNode;
			}
			if (!child) {
				this.removeAttribute('data-stop');
			}
		}, false);
		if (play == 'auto') {
			var duration = fragment.hasAttribute('data-duration') ? fragment.getAttribute('data-duration') : carrouselsvar.duration;
			var fragmentid = fragment.getAttribute('id');
			carrousels[fragmentid] = window.setInterval(function () { carrouselItemChange(fragmentid); }, duration);
		}
	}
}

function carrouselItemChange(fragmentid) {
	var carrousel = document.getElementById(fragmentid);
	var parent = document.activeElement.parentNode;
	var focus = false;
	if (document.querySelector(':focus')) { // FX.
		while (parent) {
			if (parent == carrousel) {
				focus = true;
				break;
			}
			parent = parent.parentNode;
		}
	}
	var parent = document.querySelector(':hover'); // IE9.
	var hover = false;
	while (parent) {
		if (parent == carrousel) {
			hover = true;
			break;
		}
		parent = parent.parentNode;
	}
	if (focus || hover || document.querySelector('#' + carrousel.getAttribute('id') + ':hover')) {
		carrousel.setAttribute('data-stop', 'true');
	}
	else {
		carrousel.removeAttribute('data-stop');
	}
	if (!carrousel.hasAttribute('data-stop')) {
		var selecteditem = carrousel.querySelector('[role="tab"][aria-selected="true"]');
		var nextitem = selecteditem.nextSibling;
		if (['reverse', 'imitate'].indexOf(carrousel.getAttribute('data-playmode')) > -1) {
			if (carrousel.hasAttribute('data-reverse')) {
				nextitem = selecteditem.previousSibling;
				if (!nextitem.previousSibling) {
					carrousel.removeAttribute('data-reverse');
				}
			}
			else {
				if (!nextitem) {
					carrousel.setAttribute('data-reverse', 'true');
					nextitem = selecteditem.previousSibling;
				}
			}
		}
		else {
			if (!nextitem) {
				nextitem = selecteditem.parentNode.firstChild;
			}
		}
		var e = document.createEvent('MouseEvent');
		e.initEvent('click', false, true);
		nextitem.dispatchEvent(e);
	}
}

function carrouselItemChangeEnd() {
	if (this.getAttribute('aria-hidden') == 'true' && this.querySelector(':focus')) {
		this.parentNode.parentNode.querySelector('[role="tab"][aria-selected="true"]').focus();
	}
}

function carrouselHelpGlobalButtonKeyDown(event) {
	if ([13, 32].indexOf(event.keyCode) > -1) {
		this.setAttribute('data-help', 'false');
	}
}

function carrouselHelpGlobalPreviousButtonMouseDown() {
	var tab = this.parentNode.parentNode.querySelector('ol[role="tablist"] li[role="tab"][aria-selected="true"]');
	tab = tab.previousSibling ? tab.previousSibling : tab.parentNode.lastChild;
	tab.setAttribute('data-help', 'false');
}

function carrouselHelpGlobalNextButtonMouseDown() {
	var tab = this.parentNode.parentNode.querySelector('ol[role="tablist"] li[role="tab"][aria-selected="true"]');
	tab = tab.nextSibling ? tab.nextSibling : tab.parentNode.firstChild;
	tab.setAttribute('data-help', 'false');
}

function carrouselHelpTabMouseDown(event) {
	this.setAttribute('data-help', 'false');
}

function carrouselHelpTabKeyDown(event) {
	if (event.keyCode == 27) {
		document.getElementById(this.getAttribute('aria-describedby')).setAttribute('hidden', 'hidden');
	}
}

function carrouselHelpTabFocus(event) {
	if (this.getAttribute('data-help') != 'false') {
		document.getElementById(this.getAttribute('aria-describedby')).removeAttribute('hidden');
	}
	this.removeAttribute('data-help');
}

function carrouselHelpTabBlur(event) {
	document.getElementById(this.getAttribute('aria-describedby')).setAttribute('hidden', 'hidden');
}

function deleteCarrouselHelp(event) {
	if (event.keyCode == 46) {
		createCookie('carrouselhelp', 'false', null);
		var tooltip = document.getElementById(event.target.getAttribute('aria-describedby'));
		tooltip.parentNode.removeChild(tooltip);
		var tabs = this.parentNode.parentNode.querySelectorAll('#' + this.parentNode.getAttribute('id') + ' > ol[role="tablist"] > li[role="tab"]');
		for (var i = 0; i < tabs.length; i++) {
			tabs[i].removeAttribute('aria-describedby');
			tabs[i].removeEventListener('mousedown', carrouselHelpTabMouseDown, false);
			tabs[i].removeEventListener('keydown', carrouselHelpTabKeyDown, false);
			tabs[i].removeEventListener('focus', carrouselHelpTabFocus, false);
			tabs[i].removeEventListener('blur', carrouselHelpTabBlur, false);
		}
		var globalbuttons = this.parentNode.parentNode.querySelectorAll('#' + this.parentNode.getAttribute('id') + ' > p.carrousel-previousitem button, #' + this.parentNode.getAttribute('id') + ' > p.carrousel-nextitem button');
		if (globalbuttons.length > 0) {
			globalbuttons[0].removeEventListener('keydown', carrouselHelpGlobalButtonKeyDown, false);
			globalbuttons[0].removeEventListener('mousedown', carrouselHelpGlobalPreviousButtonMouseDown, false);
			globalbuttons[1].removeEventListener('keydown', carrouselHelpGlobalButtonKeyDown, false);
			globalbuttons[1].removeEventListener('mousedown', carrouselHelpGlobalNextButtonMouseDown, false);
		}
		this.removeEventListener('keydown', deleteCarrouselHelp, false);
	}
}

function getAvailableId(prefixid) {
	var id = 1;
	while (document.getElementById(prefixid + '-' + id)) {
		id++;
	}
	return prefixid + '-' + id;
}

function createCookie(name, value, days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = '; expires=' + date.toGMTString();
	}
	else {
		var expires = '';
	}
	document.cookie = name + '=' + value + expires + '; path=/';
}

function readCookie(name) {
	var nameeq = name + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1, c.length);
		}
		if (c.indexOf(nameeq) == 0) {
			return c.substring(nameeq.length,c.length);
		}
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name, '', -1);
}

window.addEventListener('DOMContentLoaded', function(event) {
	var carrousels = document.querySelectorAll('[data-custompattern="carrousel"]');
	for (var i = 0; i < carrousels.length; i++) {
		createCarrousel(carrousels[i]);
	}
}, false);