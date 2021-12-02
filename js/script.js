$(document).ready(function(){

   

    $(".preloader").hide();

    var map = L.map('map').fitWorld();

        

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {

                maxZoom: 18,

                attribution: 'Map data &copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors, ' +

                    'Imagery © <a href=https://www.mapbox.com/>Mapbox</a>',

                id: 'mapbox/streets-v11',

                tileSize: 512,

                zoomOffset: -1

            }).addTo(map);

        

function onLocationFound(e) {

                var radius = e.accuracy / 2;

        

                L.marker(e.latlng).addTo(map)

                    .bindPopup("You are within " + radius + " meters from this point").openPopup();

        

                L.circle(e.latlng, radius).addTo(map);

                const latLngs = L.GeoJSON.coordsToLatLngs(data[0].geojson.coordinates,2); 
                    L.polyline(latLngs, {
                            color: "green",
                            weight: 14,
                            opacity: 1
                    }).addTo(map);

            }

        

function onLocationError(e) {

                alert(e.message);

            }

        

map.on('locationfound', onLocationFound);

map.on('locationerror', onLocationError);

        

map.locate({setView: true, maxZoom: 16});

    
    //Populate Select Element
        $.ajax({
            url: "geoJson.php",
            type: 'POST',
            dataType: "json",
            
            success: function(result) {
                console.log(result);
                
                for (var i=0; i<result.data.border.features.length; i++) {
                    $('#select-country').append($('<option>', {
                        value: result.data.border.features[i].properties.iso_a3,
                        text: result.data.border.features[i].properties.name,
                    }));
                   }
                }
            });
    
    
    
    });







