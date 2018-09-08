var headerElements = document.querySelectorAll('main h2, main h3');
var headerElementsArray = Array.prototype.slice.call(headerElements);

headerElementsArray.forEach(function(header) {
    header.insertAdjacentHTML('beforeend', '&nbsp;<a href="#' + header.id + '">&sect;</a>');
});