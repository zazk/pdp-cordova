document.addEventListener("backbutton", function() {


}, false);
(function() {

    var negocioService = this;

    var markers = null;

    var map = null;

    var searchBox = null;

    negocioService.init = function() {

        negocioService.createFilters();

        UtilFn.ajaxInvokeService({
            isRaiz: true,
            messageTimeOut: 'La sesion a caducado!',
            //config ajax setup
            config: {
                method: "GET",
                url: BASE_URL_SERVICE_REST + "api/private/app/negocio/",
                data: {
                    access_token: UtilFn.getToken()
                }
            }
            //success invoke
            ,
            success: function(httpResponse) {

                var response = httpResponse;

                var isFirst = true;

                console.log("response de negocio");
                console.log(JSON.stringify(response));

                console.log('alto->' + $(window).height());
                $('#main_body').css('height', ($(window).height() - 145) + 'px');


                var executeMapa = function(position) {

                    map = new google.maps.Map(document.getElementById('main_body'), {
                        center: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        },
                        mapTypeControl: false,
                        zoom: 10,
                        mapTypeId: 'roadmap',
                        streetViewControl: true,
                        streetViewControlOptions: {
                            position: google.maps.ControlPosition.RIGHT_CENTER
                        },
                        zoomControl: true,
                        zoomControlOptions: {
                            position: google.maps.ControlPosition.LEFT_CENTER
                        }
                    });

                    //Added Marker from Local position.
                    var marker = new google.maps.Marker({
                      position: { lat: position.coords.latitude, lng: position.coords.longitude },
                      map: map,
                      title: 'Mi Posiciòn'
                    });
                    //----------------
                    var input = document.getElementById('g-s-input');
                    searchBox = new google.maps.places.SearchBox(input);
                    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

                    // Bias the SearchBox results towards current map's viewport.
                    map.addListener('bounds_changed', function() {
                        if (!isFirst) {

                            map.setZoom(14);
                        }
                        searchBox.setBounds(map.getBounds());
                    });

                    markers = [];

                    searchBox.addListener('places_changed', function() {
                        var places = searchBox.getPlaces();

                        if (places.length == 0) {
                            return;
                        }


                        // For each place, get the icon, name and location.
                        var bounds = new google.maps.LatLngBounds();
                        places.forEach(function(place) {
                            if (!place.geometry) {
                                console.log("Returned place contains no geometry");
                                return;
                            }

                            if (place.geometry.viewport) {
                                // Only geocodes have viewport.
                                bounds.union(place.geometry.viewport);
                            } else {
                                bounds.extend(place.geometry.location);
                            }
                        });
                        if (!isFirst) {

                            map.setZoom(14);
                        }
                        map.fitBounds(bounds);
                        isFirst = true;
                    });

                    function addMarker(location, item) {

                        var icon = {
                            url: 'images/icon_orange.png',
                            size: new google.maps.Size(45, 45),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(37, 54),
                            scaledSize: new google.maps.Size(45, 45)
                        };

                        var marker = new google.maps.Marker({
                            position: location,
                            map: map,
                            icon: icon,
                            visible: false
                        });

                        var htmlContent = '<div class="col s12 m7">' +
                            '<div class="card small" style="box-shadow: none  !important;">' +
                            (item.foto ?
                            //     '<div class="card-image">' +
                                '<img "responsive-img" style = "width:210px;"  src="' + BASE_URL_SERVER_WEB_IMAGES + item.foto + '">' : ''
                            //     '</div>' : ''
                            ) +
                            '<div class="card-content" style="padding-bottom:250px !important;" >' +
                            '<b style="font-size:4.5vw;">' + item.titulo + '</b><br>' +
                            '<small style="line-height:20px;">' + (item.tipoNegocio ? item.tipoNegocio : '--') + '</small><br>' +
                            '<p style="line-height:20px;">' + item.descripcion + '<br>' +
                            '<span><b>Dirección:</b> ' + (item.direccion ? item.direccion : '') + '</span><br>' +
                            '<span><b>Teléfonos:</b> ' + (item.telefonos ? item.telefonos : '') + '</span><br>' +
                            '<span><b>Horario atención:</b> ' + (item.horario ? item.horario : '') + '</span>' +
                            '</p>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
  console.log("::::::::::::.EL ITEM-------");
  console.log(JSON.stringify(item));
                        var infowindow = new google.maps.InfoWindow({
                            content: htmlContent
                        });


                        google.maps.event.addListener(marker, 'click', function() {
                            infowindow.setPosition(this.getPosition());
                            infowindow.open(map, this);
                        });

                        markers.push({
                            tipo: item.tipoNegocio,
                            marker: marker
                        });

                    }

                    if (response.data) {
                        response.data.forEach(function(item, index) {

                            if (item.ubicacionCatastro) {
                                var cordenadas = new google.maps.LatLng(parseFloat(item.ubicacionCatastro.split(' ')[0]), parseFloat(item.ubicacionCatastro.split(' ')[1]));
                                addMarker(cordenadas, item);

                            }

                        });
                    }

                    UtilFn.showMaskLoading('hide');
                }


                if (UtilFn.getPosicionActual()) {
                    executeMapa(UtilFn.getPosicionActual());
                } else {
                    navigator.geolocation.getCurrentPosition(
                        executeMapa,
                        function() {}, {
                            enableHighAccuracy: true
                        }
                    );
                }




            },
            error: function(jqXHR) {
                UtilFn.showMessageToast('Ups! ha ocurrido un error!', 4000);
                $('#btnRegistrarNegocio').removeClass('disabled');
                UtilFn.showMaskLoading('hide');
                console.log('error-----------------------------------------');
                console.log(JSON.stringify(jqXHR));
                console.log('-----------------------------------------------');

            }
        });

    }

    negocioService.createFilters = function() {
        $('#modal1').modal();
        $('#btnFiltroNegocio').click(function() {
            $('#modal1').modal('open');
        });

        UtilFn.buildComboSelect({
            url: BASE_URL_SERVICE_REST + "api/private/app/catalogo/" + 9 + "/listar",
            success: function(httpResponse) {
                var data = httpResponse.data;
                if (data) {

                    function estaEnArray(array, elem) {
                        var len = array.length;
                        for (var i = 0; i < len; i++) {
                            if (array[i] == elem) {
                                return true;
                            }
                        }
                        return false;
                    }

                    data.forEach(function(item, i) {

                        $('#formFiltroNegocio').append('<p><input type="checkbox" id="chk_' + item.id + '" class="chk_tn filled-in" value = "' + item.desNombre + '" /><label style="color:#8e24aa;font-size:3vw" for="chk_' + item.id + '" >' + item.desNombre + '</label></p>');

                    });

                    $('.chk_tn').change(function() {

                        var arr = [];

                        $('.chk_tn').each(function() {

                            var chk = this;
                            if ($(chk).is(':checked')) {
                                arr.push($(chk).val());
                            }




                        });


                        var findOne = function(haystack, arr) {
                            return arr.some(function(v) {
                                return haystack.indexOf(v) >= 0;
                            });
                        };

                        console.log('seleccionados-----------------------------------------');
                        console.log(JSON.stringify(arr));
                        console.log('-----------------------------------------------');
                        if (arr && arr.length > 0) {
                            markers.forEach(function(el, i) {

                                if (el.tipo && el.tipo.length > 0 && el.tipo.split(',').length > 0) {
                                    //  el.marker.setVisible(true);

                                    if (findOne(el.tipo.split(','), arr)) {
                                        el.marker.setVisible(true);
                                    } else {
                                        el.marker.setVisible(false);
                                    }
                                } else {
                                    el.marker.setVisible(false);
                                }
                            });
                        } else {
                            markers.forEach(function(el, i) {
                                el.marker.setVisible(true);
                            });
                        }

                    });
                    $('#modal1').modal('open');

                }

            }
        });


    }

    negocioService.init();

})();
