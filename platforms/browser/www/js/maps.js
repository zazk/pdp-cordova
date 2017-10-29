function verMapa(){

    $("#load-mapa").show();
    navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 30000 });
    function onSuccess(position) {

        $("#load-mapa").hide();
        var lat=position.coords.latitude;
        var lang=position.coords.longitude;

        //Google Maps
        var myLatlng = new google.maps.LatLng(lat,lang);
        var mapOptions = {zoom: 11,center: myLatlng, mapTypeId: google.maps.MapTypeId.ROADMAP}
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var marker = new google.maps.Marker({position: myLatlng,map: map});

      SanLuis = new google.maps.LatLng(-12.064442, -76.987847);
      addMarker(SanLuis, map);
      Fiori = new google.maps.LatLng(-12.010805, -77.060992);
      addMarker(Fiori, map);
      Comas = new google.maps.LatLng(-11.952624, -77.051688);
      addMarker(Comas, map);
      PlazaNorte = new google.maps.LatLng(-12.006357, -77.059615);
      addMarker(PlazaNorte), map;

    }
    function onError(error) {
        alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
    }
    google.maps.event.addDomListener(window, 'load', onSuccess);


    function addMarker(location, map) {
        marker = new google.maps.Marker({
            position: location,
            map: map,
            icon: 'images/icon_map.png'
        });
    }

}
