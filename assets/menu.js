updateHeader = function () {
  var elem = document.getElementById('header');

  if (puppeteer._windowOffset > 500) {
    if (elem.classList.contains('header')) {
      elem.classList.remove('header');
      elem.classList.add('header2');
    }
  } else {
    if (elem.classList.contains('header2')) {
      elem.classList.remove('header2');
      elem.classList.add('header');
    }
  }
}

document.addEventListener('scroll', function (e) {
  updateHeader();
});