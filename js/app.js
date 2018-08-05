'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var dialog = document.querySelector('dialog');
var searchArtist = document.getElementById('search-artist');
var cancelButton = document.getElementById('cancel');
var showArtistDialog = document.getElementById('search-artist-dialog');
var searchForm = showArtistDialog.querySelector('form');
var searchButton = showArtistDialog.querySelector('.search-button');
var searchResult = document.getElementById('result');
var searchContainer = document.getElementById('search');
var searchTermContainer = document.getElementById('search-term');
var clearResult = document.getElementById('clear-result');
var searchTerm = searchForm.querySelector('input[name="term"]');
var searchCount = searchForm.querySelector('input[name="limit"]');
var albums = document.getElementById('albums');
var iTunesUrl = '//itunes.apple.com/search/search';
var albumItem = function albumItem(data) {
	return '<div class="album row"> \t\t\t<div class="thumbnail column three no-padding"> \t\t\t\t<img src="' + data.artworkUrl100 + '"> \t\t\t</div> \t\t\t<div class="album-info column nine"> \t\t\t\t<h3 class="artist-name">Artist Name : ' + data.artistName + '</h3> \t\t\t\t<h4 class="track-name">Track Name : ' + (data.trackName || data.collectionName || '') + '</h4> \t\t\t\t<p class="album-description">' + (data.description || data.longDescription || '&nbsp;') + '</p> \t\t\t</div> \t\t</div>';
};

var validation = function validation(element, event, messages) {
	var message = event.target.validity.valueMissing ? messages.missing : messages.generic;

	if (!event.target.validity.valid) {
		element.classList.add('error');
	} else {
		element.classList.remove('error');
	}

	if (event.target.validity.valueMissing || !event.target.validity.valid) {
		element.parentElement.querySelector('p.error-message').innerText = message;
	} else {
		element.parentElement.querySelector('p.error-message').innerText = '';
	}
};

var searchTermErrors = {
	missing: 'Artist Name can not be blank.',
	generic: 'Artist Name can not be other than Jack.'
};

var searchCountErrors = {
	missing: 'No. of tracks is required',
	generic: 'No. of tracks cannot be greater than 4'
};

dialogPolyfill.registerDialog(dialog);

searchArtist.addEventListener('click', function () {
	showArtistDialog.showModal();
});

searchForm.addEventListener('submit', function (e) {
	e.preventDefault();
	searchButton.innerText = 'Searching...';

	fetch(iTunesUrl + '?term=' + searchTerm.value + '&limit=' + searchCount.value, {
		method: 'GET'
	}).then(function (response) {
		return response.json();
	}).then(function (json) {
		return Object.entries(json.results).map(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 2),
			    index = _ref2[0],
			    item = _ref2[1];

			return albumItem(item);
		}).join('');
	}).then(function (result) {
		albums.innerHTML = result;
		searchButton.innerText = 'Search';
		searchTermContainer.innerText = searchTerm.value;
		searchContainer.classList.toggle('fadeOut');
		searchResult.classList.toggle('fadeIn');
	}).then(function () {
		showArtistDialog.close();
	}).catch(function (err) {
		alert('API Error: ' + err);
	});
});

clearResult.addEventListener('click', function () {
	searchContainer.classList.toggle('fadeIn');
	searchContainer.classList.toggle('fadeOut');
	searchResult.classList.toggle('fadeIn');
});

cancelButton.addEventListener('click', function () {
	showArtistDialog.close();
});

searchTerm.addEventListener('invalid', function (e) {
	e.preventDefault();
	validation(this, e, searchTermErrors);
});

searchTerm.addEventListener('input', function (e) {
	validation(this, e, searchTermErrors);
});

searchCount.addEventListener('invalid', function (e) {
	e.preventDefault();
	validation(this, e, searchCountErrors);
});

searchCount.addEventListener('input', function (e) {
	validation(this, e, searchCountErrors);
});