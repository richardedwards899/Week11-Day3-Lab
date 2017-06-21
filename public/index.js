var onLoad = function(){
  var url = 'https://restcountries.eu/rest/v2';
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.send();

  request.addEventListener('load', function(){
    var jsonString = request.responseText;
    var countries = JSON.parse(jsonString);

    var dropdown = populateList(countries);
    var index = loadSavedCountry();
    displayCountryProperties(countries, index);
    preselectCountry(dropdown, index);
    setMapTo(countries[index]);
  });
}//app

var setMapTo = function(country){
  var divContainer = document.getElementById('map');
  console.log(divContainer);

  var latitude = country.latlng[0];
  var longitude = country.latlng[1];

  var coords = { lat: latitude, lng: longitude }

  var map = new MapWrapper(divContainer, coords, 5);
  console.log("map: ",map)

  var placeDescription =
    "<h1>"+ country.name+ "</h1>"+
    "<p><b>"+ country.name+ "</b> is a big place with lots of people and "+
    "amazing food. You can live there, if you want to. In fact, you should. Move.</p>";

  map.addMarker(coords, placeDescription);
}

var preselectCountry = function(dropdown, index){
  var options = document.querySelectorAll('option');
  options[index].selected = "selected";
}

var populateList = function(countries){
  var dropdown = document.getElementById('country-selector');

  countries.forEach(function(country){
    var optionElement = document.createElement('option');
    optionElement.innerText = country.name; //country["name"]
    dropdown.appendChild(optionElement);

    dropdown.onchange = function(){
      var index = this.selectedIndex;
      displayCountryProperties(countries, index);
      save(index);
    }
  })
  return dropdown;
}//populateList

var displayCountryProperties = function (countries, index) {
  var body = document.querySelector('body');
  var existingUl = document.querySelector('ul');
  var ul = createCountryDetails(countries, index);

  if (existingUl){
    body.replaceChild(ul, existingUl);
  }
  else {
    body.appendChild(ul);
  }
  setMapTo(countries[index]);
}

var createCountryDetails = function (countries, index) {
  var ul = document.createElement('ul');
  var liName = document.createElement('li');
  var liPopulation = document.createElement('li');
  var liCapital = document.createElement('li');

  var country = countries[index];
  var borderingCountryCodes = countries[index].borders;
  var borderingCountries = convertToCountries(countries, borderingCountryCodes);
  var ulBorderingCountries = buildBorderingCountriesLi(borderingCountries);

  liName.innerText = country.name;
  liPopulation.innerText = country.population;
  liCapital.innerText = country.capital;

  ul.appendChild(liName);
  ul.appendChild(liPopulation);
  ul.appendChild(liCapital);
  ul.appendChild(ulBorderingCountries);

  return ul;
}

var buildBorderingCountriesLi = function(borderingCountries){
  var ul = document.createElement('ul');

  borderingCountries.forEach(function(country) {
    var li = document.createElement('li');
    li.innerText = "Borders: "+country.name+", Population: "+ country.population+", Capital: " + country.capital;
    ul.appendChild(li);
  })

  return ul;
}


var convertToCountries = function(countries, borderingCountryCodes){
  var resultArray = [];

  borderingCountryCodes.forEach(function(countryCode){
    resultArray.push(getCountry(countries, countryCode));
  })
  return resultArray;
}

var getCountry = function(countries, countryCode) {
  for (var i = 0; i < countries.length; i++) {
   if (countries[i].alpha3Code === countryCode) {
     return countries[i];
   }
  }
}

var loadSavedCountry = function(){

  //get json from localStorage
  var json = localStorage.getItem('countryIndex');

  //create js object from json
  var countryIndex = JSON.parse(json) || 0;

  return countryIndex;
}

var save = function (index) {
  localStorage.setItem('countryIndex', JSON.stringify(index)); //save json to localStorage
}

window.addEventListener('load', onLoad);
