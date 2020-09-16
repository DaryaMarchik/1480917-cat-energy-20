var contactForm = document.querySelector(".form");
if (contactForm) {
  var catName = contactForm.querySelector(".form__input--name");
  var catWeight = contactForm.querySelector(".form__input--weight");
  var userEmail = contactForm.querySelector(".form__input--email");
  var userPhone = contactForm.querySelector(".form__input--phone");
  var submitButton = contactForm.querySelector(".program-selection__button");

  catName.required = false;
  catWeight.required = false;
  userEmail.required = false;
  userPhone.required = false;

  submitButton.addEventListener("click", function () {
    catName.required = true;
    catWeight.required = true;
    userEmail.required = true;
    userPhone.required = true;
  });
}

var mapPicture = document.querySelector(".location__map-picture");
var map;
var marker;
var icon;

mapPicture.classList.remove("location__map-picture--nojs");

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 59.9387, lng: 30.323},
    zoom: 14.25,
    disableDefaultUI:true
  });
  icon = {
    url: "img/map-pin.png"
  };
  marker = new google.maps.Marker({
    position: { lat: 59.93838, lng: 30.3231},
    map: map,
    icon: icon
  });
}

var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');
navMain.classList.remove('main-nav--nojs');
navToggle.addEventListener('click', function() {
if (navMain.classList.contains('main-nav--closed')) {
  navMain.classList.remove('main-nav--closed');
  navMain.classList.add('main-nav--opened');
} else {
  navMain.classList.add('main-nav--closed');
  navMain.classList.remove('main-nav--opened');
}
});
