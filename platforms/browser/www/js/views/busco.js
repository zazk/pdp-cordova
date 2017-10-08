var ESTA_EN_PRINCIPAL = true;
document.addEventListener(
  'backbutton',
  function() {
    $('#filtro').hide();
    $('#detalle').hide();
    $('#main_body').show();
  },
  false
);

(function() {
  var buscoService = this;

  var mapRadio;

  var markers_on_map = [];

  //Inicio
  buscoService.init = function() {
    buscoService.ListarBusquedas();
    buscoService.buildCombos();
    $('.regresar_busco').click(function() {
      $('#detalle').hide();
      $('#filtro').hide();
      $('#main_body').show();

      ESTA_EN_PRINCIPAL = true;
    });

    $('#tabs-publicacion').tabs({
      onShow: function(tab) {
        if ($(tab).attr('id') == 'test-swipe-2') {
          var center = mapRadio.getCenter();
          google.maps.event.trigger(mapRadio, 'resize'); // fixes map display
          mapRadio.setCenter(center);
        }
      }
    });

    $('#filtroPublicacion').click(function() {
      $('#main_body').hide();
      $('#detalle').hide();
      $('#filtro').show();
      ESTA_EN_PRINCIPAL = false;
    });

    $('.aplicarFiltro').click(function() {
      buscoService.aplicarFiltro();
    });

    $('.limpiarFiltro').click(function() {
      buscoService.limpiarFiltro();
    });
  };

  buscoService.buildCombos = function() {
    //Ditritos
    UtilFn.buildComboDistritos('distritoCb', null, 'TODOS');
    //combo raza
    UtilFn.selectCatalogos(3, 'razaMascota', null, null, 'TODOS');
    //combo sexo
    UtilFn.selectCatalogos(2, 'generoMascota', 'desAbreviacion', null, 'TODOS');
    //combo tamaño
    UtilFn.selectCatalogos(12, 'tamanioMascota', null, null, 'TODOS');
    //combo color
    UtilFn.selectCatalogos(11, 'colorMascota', null, null, 'TODOS');

    //Radio alcance
    $('#cbxRadio').material_select();
  };

  buscoService.aplicarFiltro = function() {
    var dataCatastroDistrito = $('#distritoCb')
      .find('option:selected')
      .data('catastro');
    console.log('distrito-catastro->' + dataCatastroDistrito);

    var inputPublicacion = $('#filtro').find('.inputPublicacion');

    var params = new Object();

    inputPublicacion.each(function() {
      if (this.name && this.value) {
        params[this.name] = $(this).val();
      }
    });

    console.log('filtros-----------------------------------------');
    console.log(JSON.stringify(params));
    console.log('-----------------------------------------------');
    UtilFn.showMaskLoading();
    buscoService.ListarBusquedas(params, dataCatastroDistrito);
  };

  buscoService.limpiarFiltro = function(item) {
    UtilFn.showMaskLoading();
    buscoService.buildCombos();
    try {
      $('#cbxRadio').material_select('destroy');
    } catch (e) {}
    $('#cbxRadio').val('0');
    $('#cbxRadio').material_select();

    buscoService.ListarBusquedas();
  };

  buscoService.formatoFechaPerdida = function(item) {
    var a = moment(new Date());
    var b = moment(new Date(item.fechaPerdida));
    var horas = a.diff(b, 'hours');
    var minutos = a.diff(b, 'minutes');

    var textPerdida = '';

    if (minutos < 60) {
      textPerdida =
        minutos <= 1
          ? 'Se perdió hace un minuto.'
          : 'Se perdió  hace ' + minutos + ' minutos.';
    } else {
      if (horas >= 1 && horas < 24) {
        textPerdida =
          horas == 1
            ? 'Se perdió hace una hora.'
            : 'Se perdió hace ' + horas + ' horas.';
      } else {
        textPerdida =
          'Se perdió el ' +
          moment(new Date(item.fechaPerdida)).format('DD/MM/YYYY') +
          ' a las ' +
          moment(new Date(item.fechaPerdida)).format('h:mm a');
      }
    }
    return textPerdida;
  };

  buscoService.buildList = function(data) {
    var html;

    var textPerdida = '';
    $('#list-busqueda').empty();
    data.forEach(function(item, index) {
      textPerdida = buscoService.formatoFechaPerdida(item);

      //if (diff < 18) { /* do something */ }

      html =
        ' <li class="collection-item avatar "> ' +
        ' <img src="' +
        (item.fotoBusqueda && item.fotoBusqueda.foto
          ? BASE_URL_SERVER_WEB_IMAGES + item.fotoBusqueda.foto
          : 'images/pets_default.png') +
        '" alt="" style="margin-top:10px;border-radius: 0px !important;" class="circle"> ' +
        ' <span class="title">' +
        item.nombre +
        '</span> ' +
        ' <p>' +
        (item.descripcion.length > 60
          ? item.descripcion.substr(0, 56) + '...'
          : item.descripcion) +
        '<br><small>' +
        textPerdida +
        '</small>' +
        (item.desDistrito
          ? '<br><small>En el distrito de' + item.desDistrito + '</small>'
          : '') +
        ' </p> ' +
        ' <a href="#!" id="' +
        item.id +
        '_item_busco" class="secondary-content valign-wrapper"><i class="material-icons" style="font-size: 15.5vw !important; margin-right:-20px !important;">keyboard_arrow_right</i></a>' +
        ' </li>';

      $('#list-busqueda').append(html);

      $('#' + item.id + '_item_busco').parent().click(function() {
        buscoService.showDetalle(item);
      });

      // $('#' + item.id + '_item_busco').click(function() {
      //     buscoService.showDetalle(item);
      // });
    });
  };

  //Obtener el listado de perritos perdidos
  buscoService.ListarBusquedas = function(filtros, dataCatastroDistrito) {
    var params = filtros || {};
    params.access_token = UtilFn.getToken();

    UtilFn.ajaxInvokeService({
      isRaiz: true,
      messageTimeOut: 'La sesion a caducado!',
      //config ajax setup
      config: {
        method: 'GET',
        url: BASE_URL_SERVICE_REST + 'api/private/app/busqueda',
        data: params
      },
      //success invoke
      success: function(httpResponse) {
        var data = httpResponse.data;

        // console.log('data publicacion -----------------------------------------');
        // console.log(JSON.stringify(data));
        // console.log('---------------------------------------------------------');
        console.log('We got an If');
        if (params.mascotaClave) {
          console.log(params.mascotaClave);
          var clave = params.mascotaClave.toLowerCase();
          var filtered = [];
          for (var k = 0, t = data.length; k < t; k++) {
            var item = data[k];
            var descripcion = item.descripcion || '';
            var nombre = item.nombre || '';
            console.log(item.mascotaNombre);
            console.log(item.descripcion);
            console.log(item.desDistrito);
            console.log(item.desRaza);
            if (
              nombre.toLowerCase().search(clave) >= 0 ||
              descripcion.toLowerCase().search(clave) >= 0 ||
              item.desDistrito.toLowerCase().search(clave) >= 0
            ) {
              filtered.push(item);
            }
          }
          data = filtered;
        }

        if (data) {
          if (dataCatastroDistrito) {
            try {
              var distritoPosition = {
                coords: {
                  latitude: parseFloat(dataCatastroDistrito.split(' ')[0]),
                  longitude: parseFloat(dataCatastroDistrito.split(' ')[1])
                }
              };
              buscoService.crearMapaRadio(data, distritoPosition, true);
            } catch (e) {
              if (UtilFn.getPosicionActual()) {
                buscoService.crearMapaRadio(data, UtilFn.getPosicionActual());
              } else {
                navigator.geolocation.getCurrentPosition(
                  function(position) {
                    buscoService.crearMapaRadio(data, position);
                  },
                  function() {},
                  {
                    enableHighAccuracy: true
                  }
                );
              }
            }
          } else {
            if (UtilFn.getPosicionActual()) {
              buscoService.crearMapaRadio(data, UtilFn.getPosicionActual());
            } else {
              navigator.geolocation.getCurrentPosition(
                function(position) {
                  buscoService.crearMapaRadio(data, position);
                },
                function() {},
                {
                  enableHighAccuracy: true
                }
              );
            }
            //latitude->-12.066101
            //longitude->-76.9760914
            // navigator.geolocation.getCurrentPosition(
            //     function(position){
            //         buscoService.crearMapaRadio(data,position);
            //     },
            //     function() {}, {
            //         enableHighAccuracy: true
            //     }
            // );
          }
        } else {
          UtilFn.showMaskLoading('hide');
        }
      },
      error: function(jqXHR) {
        //show loading
        UtilFn.showMaskLoading('hide');
        UtilFn.showMessageToast('Ups! ha ocurrido un error!', 4000);
        console.log('error-----------------------------------------');
        console.log(JSON.stringify(jqXHR));
        console.log('-----------------------------------------------');
      }
    });
  };

  buscoService.showDetalle = function(detalle) {
    // console.log('detalle-----------------------------------------');
    // console.log(JSON.stringify(detalle));
    // console.log('-----------------------------------------------');
    UtilFn.showMaskLoading();
    $('#imgDetallePrincipal').attr(
      'src',
      BASE_URL_SERVER_WEB_IMAGES + detalle.fotoBusqueda.foto
    );
    $('#detalleNombrePerro').html(detalle.nombre);

    $('#razaDetalle').html(detalle.desRaza);
    $('#sexoDetalle').html(detalle.desGenero);
    $('#tamanioDetalle').html(detalle.desTamanio);
    $('#colorDetalle').html(detalle.desColor);
    $('#decripcionDetalle').html(
      detalle.descripcion +
        (detalle.desDistrito
          ? '<br><b>Distrito</b>: ' + detalle.desDistrito
          : '') +
        '<br><b>' +
        buscoService.formatoFechaPerdida(detalle) +
        '</b>'
    );
    $('#decripcionDetalle').append(
      '<br>Recompensa: ' + detalle.montoRecompensa
    );
    // $('#decripcionDetalle').html(detalle.descripcion+'<br><b>'+buscoService.formatoFechaPerdida(detalle)+'</b>');
    $('#nombrePersonaDetalle').html(
      detalle.usuario && detalle.usuario.persona
        ? detalle.usuario.persona.nombreCompleto
        : ''
    );
    $('#telefonoPersonaDetalle').html(
      detalle.telefono
        ? detalle.telefono
        : detalle.usuario && detalle.usuario.persona
          ? detalle.usuario.persona.contactoPrincipal.numero
          : ''
    );
    $('#emailPersonaDetalle').html(
      detalle.desParametro1
        ? detalle.desParametro1
        : UtilFn.getLoginUser().usuario
    );
    // $('#qrDetalle').attr('src',BASE_URL_SERVER_WEB_IMAGES+detalle.fotoQr);
    //desParametro1
    $('#filtro').hide();
    $('#main_body').hide();
    //$('#detalle').show();

    var htmlTemp = $('#detalle').html();
    $('#detalle').empty();
    setTimeout(function() {
      $('#detalle').html(htmlTemp);
      ESTA_EN_PRINCIPAL = false;

      $('#btnCompartir').unbind('click');

      $('#btnCompartir').click(function() {
        UtilFn.compartirEnlace({
          img: BASE_URL_SERVER_WEB_IMAGES + detalle.fotoBusqueda.foto,
          mensaje:
            'Se perdió, ' +
            (detalle.nombre ? detalle.nombre : 'engreido sin nombre.') +
            ' de raza ' +
            (detalle.desRaza ? detalle.desRaza : '') +
            ' cerca a ti el ' +
            moment(new Date(detalle.fechaPerdida)).format('DD/MM/YYYY hh:mm A'),
          url:
            BASE_URL_WEB_PDP +
            'mostrarPosterPublicacion?id=' +
            detalle.id +
            '&tipo=B'
        });
      });

      $('#btnDescargaPdf').unbind('click');

      $('#btnDescargaPdf').click(function() {
        window.open(
          BASE_URL_SERVER_WEB_IMAGES +
            'descargarPosterpdfBusqueda?id=' +
            detalle.id,
          '_blank',
          'location=yes'
        );
      });
      $('.regresar_busco').unbind('click');
      $('.regresar_busco').click(function() {
        $('#detalle').hide();
        $('#filtro').hide();
        $('#main_body').show();

        ESTA_EN_PRINCIPAL = true;
      });

      $('#detalle').show();
      UtilFn.showMaskLoading('hide');
    }, 500);
  };

  buscoService.crearMapaRadio = function(data, position, isDistrito) {
    var radius_circle = null;
    markers_on_map = [];

    var all_locations = [];

    if (data) {
      data.forEach(function(item, index) {
        if (index == 0 && isDistrito) {
          position.coords.latitude = parseFloat(
            item.busquedaUbicacionCatastro.split(' ')[0]
          );
          position.coords.longitude = parseFloat(
            item.busquedaUbicacionCatastro.split(' ')[1]
          );
        }
        all_locations.push({
          item: item,
          lat: parseFloat(item.busquedaUbicacionCatastro.split(' ')[0]),
          lng: parseFloat(item.busquedaUbicacionCatastro.split(' ')[1])
        });
      });
    }

    //initialize map on document ready
    var latlng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    ); //you can use any location as center on map startup
    var myOptions = {
      zoom: 15,
      center: latlng,
      mapTypeControl: false,
      navigationControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP
      }
    };
    mapRadio = new google.maps.Map(
      document.getElementById('mapa-publicaciones'),
      myOptions
    );

    //google.maps.event.addListener(map, 'click', showCloseLocations);

    function printUbicacionesEnRadio() {
      var i;
      var radius_km = $.isNumeric($('#cbxRadio').val())
        ? parseInt($('#cbxRadio').val())
        : 0;
      console.log('radius_km->' + radius_km);

      //remove all radii and markers from map before displaying new ones
      if (radius_circle) {
        radius_circle.setMap(null);
        radius_circle = null;
      }
      for (i = 0; i < markers_on_map.length; i++) {
        if (markers_on_map[i]) {
          markers_on_map[i].setMap(null);
          markers_on_map[i] = null;
        }
      }
      var dataEnradio = [];
      if (radius_km > 0) {
        var address_lat_lng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        ); //e.latLng;
        radius_circle = new google.maps.Circle({
          center: address_lat_lng,
          radius: radius_km * 1000,
          clickable: false,
          map: mapRadio,
          visible: false
        });
        //if(radius_circle) map.fitBounds(radius_circle.getBounds());

        for (var j = 0; j < all_locations.length; j++) {
          (function(location) {
            var marker_lat_lng = new google.maps.LatLng(
              location.lat,
              location.lng
            );
            var distance_from_location = google.maps.geometry.spherical.computeDistanceBetween(
              address_lat_lng,
              marker_lat_lng
            ); //distance in meters between your location and the marker
            if (distance_from_location <= radius_km * 1000) {
              dataEnradio.push(location.item);

              var icon = {
                url: 'images/icon_orange.png',
                size: new google.maps.Size(91, 91),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(37, 54),
                scaledSize: new google.maps.Size(45, 45)
              };

              var new_marker = new google.maps.Marker({
                position: marker_lat_lng,
                map: mapRadio,
                title: 'test',
                icon: icon
              });

              var infowindow = new google.maps.InfoWindow({
                content:
                  '<h5 class="verDetalleMapa">' +
                  location.item.nombre +
                  '</h5>' +
                  '<p class="flow-text verDetalleMapa">' +
                  location.item.descripcion +
                  '<br><br><small class="cyan-text text-darken-3" >' +
                  buscoService.formatoFechaPerdida(location.item) +
                  '</small></p>'
              });

              google.maps.event.addListener(infowindow, 'domready', function() {
                $('.verDetalleMapa').click(function() {
                  buscoService.showDetalle(location.item);
                });
              });

              google.maps.event.addListener(new_marker, 'click', function() {
                infowindow.setPosition(this.getPosition());
                infowindow.open(mapRadio, this);
              });
              markers_on_map.push(new_marker);
            }
          })(all_locations[j]);
        }
      } else {
        for (var j = 0; j < all_locations.length; j++) {
          (function(location) {
            var marker_lat_lng = new google.maps.LatLng(
              location.lat,
              location.lng
            );

            dataEnradio.push(location.item);

            var icon = {
              url: 'images/icon_orange.png',
              size: new google.maps.Size(91, 91),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(37, 54),
              scaledSize: new google.maps.Size(45, 45)
            };

            var new_marker = new google.maps.Marker({
              position: marker_lat_lng,
              map: mapRadio,
              title: 'test',
              icon: icon
            });

            var infowindow = new google.maps.InfoWindow({
              content:
                '<h5 class="verDetalleMapa">' +
                location.item.nombre +
                '</h5>' +
                '<p class="flow-text verDetalleMapa">' +
                location.item.descripcion +
                '<br><br><small class="cyan-text text-darken-3" >' +
                buscoService.formatoFechaPerdida(location.item) +
                '</small></p>'
            });

            google.maps.event.addListener(infowindow, 'domready', function() {
              $('.verDetalleMapa').click(function() {
                buscoService.showDetalle(location.item);
              });
            });

            google.maps.event.addListener(new_marker, 'click', function() {
              infowindow.setPosition(this.getPosition());
              infowindow.open(mapRadio, this);
            });
            markers_on_map.push(new_marker);
          })(all_locations[j]);
        }
      }

      if (mapRadio) {
        setTimeout(function() {
          console.log('rezise del mapa BUSCOOO');
          var centerTemp = mapRadio.getCenter();
          google.maps.event.trigger(mapRadio, 'resize');
          mapRadio.setCenter(centerTemp);

          //Added Marker from Local position.
          var marker = new google.maps.Marker({
            position: { lat: centerTemp.lat(), lng: centerTemp.lng() },
            map: mapRadio,
            title: 'Mi Posiciòn'
          });
          //------------
        }, 500);
      }

      dataEnradio = dataEnradio.sort(function(a, b) {
        var a1 = b.fechaPerdida,
          b1 = a.fechaPerdida;
        if (a1 == b1) return 0;
        return a1 > b1 ? 1 : -1;
      });

      buscoService.buildList(dataEnradio);
      $('#filtro').hide();
      $('#detalle').hide();
      $('#main_body').show();

      document.documentElement.scrollTop = 0;
      UtilFn.showMaskLoading('hide');
      ESTA_EN_PRINCIPAL = true;
    }

    printUbicacionesEnRadio();
  };

  //:::::::::::::::::INICIAR:::::::::::::::::::::
  buscoService.init();
  //:::::::::::::::::::::::::::::::::::::::::::::
})();
