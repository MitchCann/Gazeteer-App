var currencyCode;
var border;
var countryName;
let iso_a2;
let visitedCountries = [];
let popup;
let currentLat;
let currentLng;
let currentCapital;
let capitalLat;
let capitalLng;
let capitalCity;
let countryOptionText;
let marker;
let north;
let south;
let east; 
let west;


var redMarker = L.ExtraMarkers.icon({
    icon: 'fa-landmark',
    markerColor: 'violet',
    shape: 'square',
    prefix: 'fa'
  });

var quakeMarker = L.ExtraMarkers.icon({
    icon: 'fa-forumbee',
    markerColor: 'blue',
    shape: 'square',
    prefix: 'fab'
});

var camMarker = L.ExtraMarkers.icon({
    icon: 'fa-camera',
    markerColor: 'red',
    shape: 'square',
    prefix: 'fas'
})



// Leaflet Map 


var map = L.map('map', {
    zoom: 10,
}).fitWorld();



var myCircles = new L.featureGroup().addTo(map);
var layerGroup = L.layerGroup().addTo(map);

var Stadia_Outdoors = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);


// New Select Dropdown
$.ajax({
    url: "./php/getCountrySelect.php",
    type: 'POST',
    dataType: "json",
    
    success: function(result) {
        console.log(' new populate options' , result);
        if (result.status.name == "ok") {
            for (var i=0; i<result.data.length; i++) {
                        $('#selCountry').append($('<option>', {
                            value: result.data[i].code,
                            text: result.data[i].name,
                        }));
                    }
                }
            //sort options alphabetically
            // $("#selCountry").html($("#selCountry option").sort(function (a, b) {
            //     return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
            // }));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            console.log(jqXHR.responseText);
        }
      });


// User Location
const successCallback = (position) => {
  $.ajax({
      url: "./php/openCage.php",
      type: 'GET',
      dataType: 'json',
      data: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
      },

      success: function(result) {
          console.log('openCage PHP',result);
          currentLat = result.data[0].geometry.lat;
          currentLng = result.data[0].geometry.lng;
           
          $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-2"]);
          
          let currentCountry = result.data[0].components["ISO_3166-1_alpha-2"];
          $("#selCountry").val(currentCountry).change();
      
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
          console.log(jqXHR.responseText);
      },

     
  });

}

const errorCallback = (error) => {
          console.error(error);
          console.log(error.responseText);
}
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);


// Border

$('#selCountry').on('change', function() {
  let iso_a2 = $('#selCountry').val();
  let countryOptionText= $('#selCountry').find('option:selected').text();
  layerGroup.clearLayers();
   
  // Check if country in array
  if(!visitedCountries.includes(countryOptionText)) {
    visitedCountries.push(countryOptionText)
    console.log('Array visited countries', visitedCountries)
  }

 
  //Webcams

  $.ajax({
    url: './php/webcams.php',
    dataType: 'json',
    type: 'POST',
    data: {
      country: iso_a2,
    },
    success: function(result) {
        console.log('webcams are working', result);
          [result.data.webcams].forEach((webcams) => {
              
              const newMarker = L.marker([webcams.location.latitude, webcams.location.longitude], {
                icon: redMarker,
                type: 'webcam',
                title: webcams.title,
                latitude: webcams.location.latitude,
                longitude: webcams.location.longitude,
              }).addTo(layerGroup).on('click', function(e) {
                console.log("clicked webcam");
                newMarker.bindPopup("<strong>" + webcams.title + "</strong>" + "<br>(Capital City)" +"<br><a href='https://en.wikipedia.org/wiki/" + webcams.title + "' target='_blank'>Wiki Link</a>").openPopup();
            });
             
            
          });
        

    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    console.log(jqXHR.responseText);
  }});

    //Cities

    $.ajax({
    url: './php/cities.php',
    dataType: 'json',
    type: 'POST',
    data: {
      country: iso_a2,
    },
    success: function(result) {
        console.log('cities are working', result);
        
        const marker = L.ExtraMarkers.icon({
            icon: ' fa-location-arrow',
            markerColor: '#BBDEF0',
            shape: 'square',
            svg: true,
            prefix: 'fa',
          });
          const capitalMarker = L.ExtraMarkers.icon({
            icon: ' fa-location-arrow',
            markerColor: '#2C95C9',
            shape: 'star',
            svg: true,
            prefix: 'fa',
          });
          result['data'].forEach((city) => {
              
            //Check if the city is the capital
            if (city.fcode == 'PPLC') {
              //Change marker to indicate the capital
              const newMarker = L.marker([city.lat, city.lng], {
                icon: redMarker,
                type: 'city',
                name: city.name,
                population: city.population,
                latitude: city.lat,
                longitude: city.lng,
                capital: true,
                geonameId: city.geonameId,
              }).addTo(layerGroup).on('click', function(e) {
                console.log("click click");
                newMarker.bindPopup("<strong>" + city.name + "</strong>" + "<br>(Capital City)" +"<br><a href='https://en.wikipedia.org/wiki/" + result.capital + "' target='_blank'>Wiki Link</a>").openPopup();
            });
             
            } else {
              var newMarker = L.marker([city.lat, city.lng], {icon: marker, name: city.name, population: city.population, }).addTo(layerGroup).on('click', function(e) {
                console.log("city clicked");

                newMarker.bindPopup("<strong>" + city.name + "</strong>" + "<br>Population:"+ city.population +"<br><a href='https://en.wikipedia.org/wiki/" + city.name + "' target='_blank'>Wiki Link</a>").openPopup();
            });
              
            }
          });
        

    
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
    console.log(jqXHR.responseText);
  }});
  
  //Points of Interest

    $.ajax({
      url: './php/poi.php',
      dataType: 'json',
      type: 'POST',
      data: {
        countryCode: iso_a2,
      },
    })
      .done((result) => {
          console.log('POI Working', result)
        const marker = L.ExtraMarkers.icon({
          icon: 'fa-binoculars',
          markerColor: '#AFD5AA',
          shape: 'penta',
          svg: true,
          prefix: 'fa',
        });
        result['data'].forEach((poi) => {
          const newMarker = L.marker([poi.lat, poi.lng], {
            icon: marker,
            name: poi.name,
            latitude: poi.lat,
            longitude: poi.lng,
            type: 'monument',
          }).addTo(layerGroup).on('click', function(e) {
            console.log("click POI");
            newMarker.bindPopup("<strong>" + poi.name + "</strong>" + "<br>Point of Interest" +"<br><a href='https://en.wikipedia.org/wiki/" + poi.name + "' target='_blank'>Wiki Link</a>").openPopup();
        });
        });
        
      });

    // Earthquakes

    $.ajax({
        url: './php/compass.php',
        dataType: 'json',
        type: 'POST',
        data: {
          country: iso_a2,
        },
        success: function(result) {
            console.log('compass is working', result);
            north = result.data[0].north;
            south = result.data[0].south;
            west = result.data[0].west;        
            east = result.data[0].east;
            console.log(north, south, east, west);

            $.ajax({
                url: './php/earthquakes.php',
                dataType: 'json',
                type: 'POST',
                data: {
                  north: north,
                  south: south,
                  east: east,
                  west: west,
                },
                success: function(result) {
                  console.log('Earthquakes are working', result);
                  result['data'].forEach((quake) => {
                    const newerMarker = L.marker([quake.lat, quake.lng], {
                      icon: quakeMarker,
                      name: quake.name,
                      latitude: quake.lat,
                      longitude: quake.lng,
                      date: quake.datetime,
                      mag: quake.magnitude,
                      type: 'quake',
                    }).addTo(layerGroup).on('click', function(e) {
                      console.log("click quake");
                      newerMarker.bindPopup("<strong>Earthquake</strong><br>Magnitude:" + quake.magnitude + "<br>Happened Here:" +"<br>" + quake.datetime).openPopup();
                  });
                  });
                  
             }
                
              })
       } });

  //Home Default 
  const showFirstTab = function () {
         $('#nav-home-tab').tab('show');
       }
  showFirstTab();

  console.log($('#selCountry').val());
  $.ajax({
    url: "./php/geoJson.php",
    type: 'POST',
    dataType: 'json',
    data: {
        iso_a2: $('#selCountry').val(),
    },

    success: function(result) {

        console.log('all borders result', result);

        if (map.hasLayer(border)) {
            map.removeLayer(border);
        }
          
        let countryArray = result.data;
        let countryOptionTextArray = [];
    
        /*for (let i = 0; i < result.data.border.features.length; i++) {
            if (result.data.border.features[i].properties.iso_a3 === countryCode) {
                countryArray.push(result.data.border.features[i]);
            }
        };
        for (let i = 0; i < result.data.border.features.length; i++) {
            if (result.data.border.features[i].properties.name === countryOptionText) {
                countryOptionTextArray.push(result.data.border.features[i]);
            }
        }; */
     
        border = L.geoJSON(countryArray[0], {
                                                        color: 'lime',
                                                        weight: 3,
                                                        opacity: 0.75
                                                        }).addTo(map);
        let bounds = border.getBounds();
            map.fitBounds(bounds, {
            padding: [35, 35], 
            duration: 2,
            });      
            
            //Preloader
    $(".preloader").hide(); 
    },



    
    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus, errorThrown);
      console.log(jqXHR.responseText);
    }
  }); 
});



// Map click event
map.on('click', function(e) {        
  var popLocation = e.latlng;
  
  $.ajax({
    url: "./php/openCage.php",
    type: 'GET',
    dataType: 'json',
    data: {
        lat: popLocation.lat,
        lng: popLocation.lng,
    },

    success: function(result) {

        if (result.data[0].components["ISO_3166-1_alpha-2"]) {
            console.log('openCage PHP',result);
           
            currentLat = result.data[0].geometry.lat;
            currentLng = result.data[0].geometry.lng;

            
           

            $("selectOpt select").val(result.data[0].components["ISO_3166-1_alpha-2"]);
            
            let currentCountry = result.data[0].components["ISO_3166-1_alpha-2"];
            $("#selCountry").val(currentCountry).change();
        }
        else {
            console.log("clicked on water")
            console.log('openCage PHP',result);

            currentLat = result.data[0].geometry.lat;
            currentLng = result.data[0].geometry.lng;

            

            L.popup()
                .setLatLng([currentLat, currentLng])
                .setContent("<div><strong>" + result.data[0].formatted + "</strong></div>")
                .openOn(map);
        }
     
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        console.log(jqXHR, errorThrown)
        console.log(jqXHR.responseText);
       
    }
  });        

});



// Return Country Code
$('#btnRun').click(function() {
    //Country Code 
    $('#country-code').html('<td>' + $('#selCountry').val() + '</td>');
    
// Info Modal  

    $.ajax({
        url: "./php/restCountries.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selCountry').val()   
        },
        success: function(result) {
          
            console.log('restCountries', result);
            if (result.status.name == "ok") {
                currencyCode = result.currency.code;
                currentCapital= result.capital;
                var countryName2 = result.name;
                countryName = countryName2.replace(/\s+/g, '_');
                console.log(currentCapital);
                
                $('#country-capital').html('<td>' + result.capital + '</td>');
                $('#country-population').html('<td>' + result.population.toLocaleString("en-US") + '</td>');
                $('#country-currency').html('<td>' + result.currency.name + '</td>');
                $('#country-language').html('<td>' + result.language.name + '</td>');
                //Wiki link 
                document.getElementById("myLink").href = "https://en.wikipedia.org/wiki/" + countryName;
            }

    //openWeather API          
    $.ajax({
        url: "./php/openWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            capital: currentCapital,
        }, 
        success: function(result) {
            console.log('currentCapital', result);
            capitalCityLat = result.weatherData.coord.lat;
            capitalCityLon = result.weatherData.coord.lon;
            
            
            if (result.status.name == "ok") {

                $('#country-weather').html('<td id=weather>' + result.weatherData.weather[0].description + '</td>');
            }
        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
            console.log(errorThrown);
        } 
    })
        },
        
        
        
    });

    
        
  });
