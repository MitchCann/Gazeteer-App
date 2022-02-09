var currencyCode;
var border;
var countryName;
var capitalCityLat;
var capitalCityLon;
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
var countryName2;

// Leaflet Map 


var map = L.map('map', {
    zoom: 10,
    maxZoom: 19,
}).fitWorld();


var layerGroup = L.markerClusterGroup().addTo(map);

var Stadia_Outdoors = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://basemaps.cartocdn.com/">Base Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

//Icons

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

// Market Cluster
    var markers = L.markerClusterGroup();

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
          result.data.result.webcams.forEach((webcams) => {
              
              const newMarker = L.marker([webcams.location.latitude, webcams.location.longitude], {
                icon: camMarker,
                type: 'webcam',
                title: webcams.title,
                latitude: webcams.location.latitude,
                longitude: webcams.location.longitude,
              }).addTo(layerGroup).on('click', function(e) {
                console.log("clicked webcam");
                newMarker.bindPopup("<strong class='title'>Webcam</strong><hr>"+ webcams.title + "<br><br><iframe width='220' height='245' src='" + webcams.player.day.embed +"'></iframe>").openPopup();
                newMarker.unbindPopup();
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
                newMarker.bindPopup("<strong  class='title' >" + city.name + "</strong>" + "<br>(Capital City)" + "<br>Population: "+ city.population.toLocaleString("en-us") + "<br><a href='https://en.wikipedia.org/wiki/" + result.capital + "' target='_blank' ><img class='wiki-icon' src='img/wiki1.svg' alt='Wiki Link'></a>").openPopup();
                newMarker.unbindPopup();
              });
             
            } else {
              var newMarker = L.marker([city.lat, city.lng], {icon: marker, name: city.name, population: city.population, }).addTo(layerGroup).on('click', function(e) {
                console.log("city clicked");

                newMarker.bindPopup("<strong class ='title'>" + city.name + "</strong>" + "<br>Population: "+ city.population.toLocaleString("en-US") +"<br><a href='https://en.wikipedia.org/wiki/" + city.name + "' target='_blank' style='font-weight=300;'><img class='wiki-icon' src='img/wiki1.svg' alt='Wiki Link'> </a>").openPopup();
                newMarker.unbindPopup();
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
          console.log('POI Working')
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
            newMarker.bindPopup("<strong class='title'>Point of Interest" + "</strong><br><strong>" + poi.name + "</strong>" + "<br><a href='https://en.wikipedia.org/wiki/" + poi.name + "' target='_blank'><img class='wiki-icon' src='img/wiki1.svg' alt='Wiki Link'></a>").openPopup();
            newMarker.unbindPopup();
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
                      newerMarker.bindPopup("<strong class='title'>Earthquake</strong><br>Magnitude:<br>" + quake.magnitude + "<br>Happened Here: " +"<br>" + Date.parse(quake.datetime).toString().slice(3, 7) + Date.parse(quake.datetime).toString().slice(10,15)).openPopup(); 
                      newerMarker.unbindPopup();
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
                                                        color: '#A7ABDD',
                                                        weight: 3,
                                                        opacity: 0.75
                                                        }).addTo(map);
        let bounds = border.getBounds();
            map.fitBounds(bounds, {
            padding: [35, 35], 
            duration: 2,
            });      
            
            
    
  
  },



    
    error: function(jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus, errorThrown);
      console.log(jqXHR.responseText);
    }
  }); 

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
        }
    },

    error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
        console.log(errorThrown);
    } 
})
    },
    
    
    
});

$('#country-code').html('<td>' + $('#selCountry').val() + '</td>');
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
                  console.log(countryName2);
                  
                  $('#country-capital').html('<td>' + result.capital + '</td>');
                  $('#country-population').html('<td>' + result.population.toLocaleString("en-US") + '</td>');
                  $('#country-currency').html('<td>' + result.currency.name + '</td>');
                  $('#currency-code').html('<td>' + result.currency.code + '</td>');
                  $('#currency-symbol').html('<td>' + result.currency.symbol + '</td>');
                  $('#country-language').html('<td>' + result.language.name + '</td>');
                  $('#calling-codes').html('<td>+' + result.callingCodes + '</td>');
                  //Wiki link 
                  document.getElementById("myLink").href = "https://en.wikipedia.org/wiki/" + countryName;


                  if (countryName2 === `United Kingdom of Great Britain and Northern Ireland` ) {
                      countryName2 = 'UK'
                  };
                
                  /*const doSearch = () => {
                    let searchQuery = countryName2 + 'Travel Top Ten';
                    let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=AIzaSyDbPG_mru-trAvVr0eqngkVYBJVko3HmJY&q=' + searchQuery;
                      
                    $.ajax({
                      url: url,
                      method: 'GET',
                      success: (result) => {
                        $("#video-body").empty()
                        $('#video-body').text('');
                        $('#video-body').append(`<iframe id="my-iframe" src=https://www.youtube.com/embed/${result.items[0].id.videoId} allowFullScreen title='youtube player' />`)
                       
                      },
                      error: (err, response) => {
                        console.log(err.responseText);
                        $('#video-body').append(`<p>Sorry, we have reached the API limit for today.</p>`);
                      }
                    })
                  };
                
                  doSearch(); */

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
                  $('#country-temperature').html('<td id=weather>' + result.weatherData.main.temp + '°C</td>');
                  $('#feels-like').html('<td id=weather>' + result.weatherData.main.feels_like + '°C</td>');
                
                  $("#today-weather-type").html(result.weatherData.weather[0].description + '<hr> <p>Current Temp: ' + result.weatherData.main.temp + '°C </p> <p>Feels Like: ' +result.weatherData.main.feels_like + '°C </p>')
              }
          },
  
          error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR.responseText);
              console.log(errorThrown);
          } 
      })
          },
          
          
          
      });

      $.ajax({
        url: "./php/covid.php",
        type: 'POST',
        dataType: 'json',
        data: {
            country: $('#selCountry').val(),
        },
        success: function(result) {
          $('#modal-body').html('<div class="preloader"> <img class="preloader-icon" src="img/Ripple-loader.gif" alt="My Site Preloader"/> </div>')
            console.log('covid data', result);
            if (result.status.name == "ok") {
                $('#total-cases').html('<td>' + result.data[0].toLocaleString("en-US") + '</td>');
                $('#total-deaths').html('<td>' + result.data[1].toLocaleString("en-US") + '</td>');

                if (result.data[2] === 0) {
                  $('#total-recovered').html('<td><p>Data Not Yet Published</p></td>');
                } else {
                $('#total-recovered').html('<td>' + result.data[2].toLocaleString("en-US") + '</td>');
                }
                $('#new-confirmed').html('<td>' + result.data[3].toLocaleString("en-US") + '</td>');
                $('#new-deaths').html('<td>' + result.data[4].toLocaleString("en-US") + '</td>');
                if (result.data[5] === 0) {
                $('#new-recovered').html('<td><p>Data Not Yet Published</p></td>');
                } else {
                  $('#new-recovered').html('<td>' + result.data[5].toLocaleString("en-US") + '</td>');
                }
                $(".preloader").hide(); 
          
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(textStatus, errorThrown);
          console.log(jqXHR.responseText);
        }
        
        
    });

    $("#holiday-body").empty(),
        $.ajax({
          url: "./php/holidays.php",
          type: 'POST',
          dataType: 'json',
          data: {
              country: $('#selCountry').val()  
          },
          success: function(result) {
            
              console.log('holiday data', result);
              if (result.status.name == "ok") {

                if (result.data.totalResults === 0) {
                  $("#holiday-body").append('\n<article class="no-news">\n<h4>Sorry, no news is available for this country currently.</h4>\n</article>\n');
                }
                else {
                  for (let i = 0; i < 100; i++) {
                    $("#holiday-body").append(`<tr><td>` + Date.parse(result.data.holidays[i].observed).toString().slice(4,10) + `</td><td>` + result.data.holidays[i].name + `</td></tr>`);
                  }
            } 
                 
              }
  
          },
          error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(textStatus, errorThrown);
            console.log(jqXHR.responseText);
          }
          
          
      });

      $("#news-body").empty(),
      
        $.ajax({
          url: "./php/news.php",
          type: 'POST',
          dataType: 'json',
          data: {
              country: $('#selCountry').val()  
          },
          success: function(result) {
            
              console.log('news data', result);
              if (result.status.name == "ok") {
                  if (result.data.totalResults === 0) {
                    $("#news-body").append('\n<article class="no-news">\n<h4>Sorry, no news is available for this country currently.</h4>\n</article>\n');
                  }

                  else {
                    for (let i = 0; i < 10; i++) {
                      if(!result.data.articles[i].urlToImage) {
                        $("#news-body").append(`<div class="card news-card"><img class="card-img-top news-img" src="img/news.jpg" alt="article image"><div class="card-body"><h5 class="card-title">${result.data.articles[i].title}</h5><p class="card-text">${result.data.articles[i].description}</p><a href=${result.data.articles[i].url} target="_blank" class="card-link">Read More</a></div></div>`);                    

              
                      } else {
                      $("#news-body").append(`<div class="card news-card"><img class="card-img-top news-img" src="${result.data.articles[i].urlToImage}" alt="article image"><div class="card-body"><h5 class="card-title">${result.data.articles[i].title}</h5><p class="card-text">${result.data.articles[i].description}</p><a href=${result.data.articles[i].url} target="_blank" class="card-link">Read More</a></div></div>`);                    }
              } }
              }
  
          },
          error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(textStatus, errorThrown);
            console.log(jqXHR.responseText);
          }
          
          
      });

      $.ajax({
        url: "./php/weather.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: capitalCityLat,
            lng: capitalCityLon,
        },
        success: function(result) {            
            console.log('weather data', result);
            if (result.status.name == "ok") {
              
              $("#today-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[1].weather[0].icon +`.png`),
              $("#plus-one-date").html('Tomorrow'),
              $("#plus-one-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[2].weather[0].icon +`.png`),
              $("#plus-one-max-temp").html('Max Temp:<br>' + result.weatherForcast.daily[1].temp.max + '°C'),
              $("#plus-one-min-temp").html('Min Temp:<br>' +result.weatherForcast.daily[1].temp.min + '°C'),
              $("#plus-two-date").html('Third Day'),
              $("#plus-two-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[3].weather[0].icon+`.png`),
              $("#plus-two-max-temp").html('Max Temp:<br>' + result.weatherForcast.daily[2].temp.max + '°C'),
              $("#plus-two-min-temp").html('Min Temp:<br>' +result.weatherForcast.daily[2].temp.min + '°C'),
              $("#plus-three-date").html('Fourth Day'),
              $("#plus-three-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[4].weather[0].icon +`.png`),
              $("#plus-three-max-temp").html('Max Temp:<br>' + result.weatherForcast.daily[3].temp.max + '°C'),
              $("#plus-three-min-temp").html('Min Temp:<br>' +result.weatherForcast.daily[3].temp.min + '°C'),
              $("#plus-four-date").html('Fifth Day'),
              $("#plus-four-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[5].weather[0].icon +`.png`),
              $("#plus-four-max-temp").html('Max Temp:<br>' + result.weatherForcast.daily[4].temp.max + '°C'),
              $("#plus-four-min-temp").html('Min Temp:<br>' +result.weatherForcast.daily[4].temp.min + '°C') 
           
        }

        },
         
    });

    

  
//Preloader
$(".preloader").hide();
  
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

//Modal Apis 

//Info Modal
L.easyButton({
  id: "info-button",
  position: "topleft",
  states: [{
      stateName: "get-country-info",
      onClick: function() {
        $("#exampleModal").modal("show")
        
      },
      icon: "fa-info"
  }]
}).addTo(map) 

//COVID Modal
L.easyButton({
  id: "covid-button",
  position: "topleft",
  states: [{
      stateName: "get-covid-info",
      onClick: function() {
        $("#covidModal").modal("show")     
      },
      icon: "fa-virus"
  }]
}).addTo(map) 


//Holiday Modal
L.easyButton({
  id: "holiday-button",
  position: "topleft",
  states: [{
      stateName: "get-holiday-info",
      onClick: function() {
        $("#holidayModal").modal("show")
      },
      icon: "fa-gift"
  }]
}).addTo(map) 



//News Modal
L.easyButton({
  id: "news-button",
  position: "topleft",
  states: [{
      stateName: "get-news-info",
      onClick: function() {
        $("#newsModal").modal("show")
      },
      icon: "fa-newspaper"
  }]
}).addTo(map) 



//Weather Modal
L.easyButton({
  id: "weather-button",
  position: "topleft",
  states: [{
      stateName: "get-weather-info",
      onClick: function() {
        $("#weatherModal").modal("show")
        $.ajax({
          url: "./php/weather.php",
          type: 'POST',
          dataType: 'json',
          data: {
              lat: capitalCityLat,
              lng: capitalCityLon,
          },
          success: function(result) {            
              console.log('weather data', result);
              if (result.status.name == "ok") {
                
                $("#today-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[1].weather[0].icon +`.png`),
                $("#plus-one-date").html('Tomorrow'),
                $("#plus-one-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[2].weather[0].icon +`.png`),
                $("#plus-one-max-temp").html('Max Temp:<br>' + result.weatherForcast.daily[1].temp.max + '°C'),
                $("#plus-one-min-temp").html('Min Temp:<br>' +result.weatherForcast.daily[1].temp.min + '°C'),
                $("#plus-two-date").html('Third Day'),
                $("#plus-two-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[3].weather[0].icon+`.png`),
                $("#plus-two-max-temp").html('Max Temp:<br>' + result.weatherForcast.daily[2].temp.max + '°C'),
                $("#plus-two-min-temp").html('Min Temp:<br>' +result.weatherForcast.daily[2].temp.min + '°C'),
                $("#plus-three-date").html('Fourth Day'),
                $("#plus-three-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[4].weather[0].icon +`.png`),
                $("#plus-three-max-temp").html('Max Temp:<br>' + result.weatherForcast.daily[3].temp.max + '°C'),
                $("#plus-three-min-temp").html('Min Temp:<br>' +result.weatherForcast.daily[3].temp.min + '°C'),
                $("#plus-four-date").html('Fifth Day'),
                $("#plus-four-weather-icon").attr("src", `http://openweathermap.org/img/w/`+ result.weatherForcast.daily[5].weather[0].icon +`.png`),
                $("#plus-four-max-temp").html('Max Temp:<br>' + result.weatherForcast.daily[4].temp.max + '°C'),
                $("#plus-four-min-temp").html('Min Temp:<br>' +result.weatherForcast.daily[4].temp.min + '°C') 
             
          }
  
          },
          error: function(jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(textStatus, errorThrown);
            console.log(jqXHR.responseText);
          }
          
          
      });
      },
      icon: "fas fa-cloud-sun"
  }]
}).addTo(map) 

console.log(countryName2);

//Video Modal
L.easyButton({
  id: "video-button",
  position: "topleft",
  states: [{
      stateName: "get-video-info",
      onClick: function() {
        
        //$("#video-body").empty(),
        $("#videoModal").modal("show")
        console.log(countryName2);
      },
      icon: "fab fa-youtube"
  }]
}).addTo(map) 



//Flag Modal
L.easyButton({
  id: "flag-button",
  position: "topleft",
  states: [{
      stateName: "get-flag-info",
      onClick: function() {
        $("#flag-body").empty(),
        $("#flagModal").modal("show")
        $("#flag-body").append(`<img src="./img/flags/`+ $('#selCountry').val().toLowerCase() + `.svg"width="100%"alt="Country Flag">`);

      },
      icon: "fas fa-flag"
  }] 
}).addTo(map) 