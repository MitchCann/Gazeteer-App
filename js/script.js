$(document).ready(function(){
    
    //Preloader
    $(".preloader").hide();

    //Map
    var map = L.map('map').fitWorld();

    //Tile Layer
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {

                maxZoom: 18,

                attribution: 'Map data &copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors, ' +

                    'Imagery © <a href=https://www.mapbox.com/>Mapbox</a>',

                id: 'mapbox/streets-v11',

                tileSize: 512,

                zoomOffset: -1

            }).addTo(map);

    //Location Found
     function onLocationFound(e) {

        

                var radius = e.accuracy / 2;

        

                 L.marker(e.latlng).addTo(map)

                    .bindPopup("You are within " + radius + " meters from this point").openPopup();

        

                L.circle(e.latlng, radius).addTo(map); 

                 const latLngs = L.GeoJSON.coordsToLatLngs(data[0].geojson.coordinates,2); 
                    L.polyline(latLngs, {
                            color: "red",
                            weight: 14,
                            opacity: 1
                    }).addTo(map);  


                    
            } 

        

function onLocationError(e) {

                alert(e.message);

            } 

        

map.on('locationfound', onLocationFound);

map.on('locationerror', onLocationError);

     

//map.locate({setView: true, maxZoom: 16});

    
    //Populate Select Element
    $.ajax({
        url:"js/geoJson.php",
        type: 'POST',
        dataType: "json",
        
        success: function(result) {
            console.log(result);
            
            for (var i=0; i<result.data.length; i++) {
                $('#select-country').append($('<option>', {
                    value: result.data[i].iso_a2,
                    text: result.data[i].name
                }));
               }
            }
        });

 
    
            
        //Get Border
            var border ;

            $('#select-country').change(function() {
                 let name = $('#select-country').val();
                $.ajax({
                    url: "js/geoJson.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        iso_a2: $('#select-country').val(),
                    },
                    success: function(result) {
                        console.log(result)

                        const filterData = result.data.filter((a) => (a.iso_a2 === name));
                        border = L.geoJSON(filterData[0]); 
                        map.fitBounds(border.getBounds());
                
                        
                    } ,error: function(jqXHR){

                        console.log(jqXHR);

                    }
                })
            });
            
          

    







    });





