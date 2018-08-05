const dialog = document.querySelector('dialog');
const searchArtist = document.getElementById('search-artist');
const cancelButton = document.getElementById('cancel');
const showArtistDialog = document.getElementById('search-artist-dialog');
const searchForm = showArtistDialog.querySelector('form');
const searchButton = showArtistDialog.querySelector('.search-button');
const searchResult = document.getElementById('result');
const searchContainer = document.getElementById('search');
const searchTermContainer = document.getElementById('search-term');
const clearResult = document.getElementById('clear-result');
const searchTerm = searchForm.querySelector('input[name="term"]');
const searchCount = searchForm.querySelector('input[name="limit"]');
const albums = document.getElementById('albums');
const iTunesUrl = '//itunes.apple.com/search/search';
const albumItem = (data) => {
	return (
		`<div class="album row"> \
			<div class="thumbnail column three no-padding"> \
				<img src="${data.artworkUrl100}"> \
			</div> \
			<div class="album-info column nine"> \
				<h3 class="artist-name">Artist Name : ${data.artistName}</h3> \
				<h4 class="track-name">Track Name : ${(data.trackName || data.collectionName || '')}</h4> \
				<p class="album-description">${(data.description || data.longDescription || '&nbsp;')}</p> \
			</div> \
		</div>`
	);
};

const validation = (element, event, messages) => {
		let message = event.target.validity.valueMissing ?
			messages.missing : messages.generic;

		if (! event.target.validity.valid ) {
			element.classList.add('error');
		}	else {
			element.classList.remove('error');
		}

		if(event.target.validity.valueMissing || ! event.target.validity.valid) {
			element.parentElement.querySelector('p.error-message').innerText = message;
		} else {
			element.parentElement.querySelector('p.error-message').innerText = '';
		}
};

const searchTermErrors = {
	missing: 'Artist Name can not be blank.',
	generic: 'Artist Name can not be other than Jack.'
};

const searchCountErrors = {
	missing: 'No. of tracks is required',
	generic: 'No. of tracks cannot be greater than 4'
};

dialogPolyfill.registerDialog(dialog);

searchArtist.addEventListener('click', function() {
	showArtistDialog.showModal();
});

searchForm.addEventListener('submit', function(e) {
	e.preventDefault();
	searchButton.innerText = 'Searching...';

	fetch(`${iTunesUrl}?term=${searchTerm.value}&limit=${searchCount.value}`, {
			method: 'GET'
	})
	.then(function(response) {
			return response.json();
	})
	.then(function(json) {
		return (
				Object.entries(json.results).map(([index, item]) => {
					return albumItem(item);
			}).join('')
		)
	})
	.then(function(result) {
		albums.innerHTML = result;
		searchButton.innerText = 'Search';
		searchTermContainer.innerText = searchTerm.value;
		searchContainer.classList.toggle('fadeOut');
		searchResult.classList.toggle('fadeIn');
	})
	.then(function() {
		searchButton.innerText = 'Search';
		showArtistDialog.close();
	})
	.catch(function(err) {
			alert('API Error: ' + err);
	});
});

clearResult.addEventListener('click', function() {
	searchContainer.classList.toggle('fadeIn');
	searchContainer.classList.toggle('fadeOut');
	searchResult.classList.toggle('fadeIn');
});

cancelButton.addEventListener('click', function() {
	showArtistDialog.close();
});

searchTerm.addEventListener('invalid', function(e){
		e.preventDefault();
		validation(this, e, searchTermErrors);
});

searchTerm.addEventListener('input', function(e){
		validation(this, e, searchTermErrors);
});

searchCount.addEventListener('invalid', function(e){
		e.preventDefault();
		validation(this, e, searchCountErrors);
});

searchCount.addEventListener('input', function(e){
	validation(this, e, searchCountErrors);
});
