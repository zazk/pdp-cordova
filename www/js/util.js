var VERIFY_ENABLE_ACTIVE = false;

var UtilFn = {
  //shared
  compartirEnlace: function(options) {
    if (options) {
      window.plugins.socialsharing.share(
        options.mensaje ? options.mensaje : null, // Mensaje
        options.asunto ? options.asunto : null, // Asunto
        null, //(options.img?options.img:null) //Image or Image[]
        options.url
      ); // Link shared
    }
  },
  //validar sesion de usuario
  validateSesion: function() {
    return localStorage.getItem('usuario') ? true : false;
  },
  //redireccionar html view
  redirect: function(url) {
    window.location = url + '.html';
  },
  //obtener html de una vista por metodo "get"
  getView: function(url, params, done) {
    params = params || {};
    console.log('llego url->' + url);
    $.ajax({
      url: url,
      dataType: 'html',
      data: params,
      success: done
    });
  },
  //obtener access_token GLOBAL
  getToken: function() {
    return localStorage.getItem('access-token');
  },
  //ajax Generic
  ajaxInvokeService: function(options) {
    options = options || {};

    if (options.isRedirect) {
      options.redirect =
        options.redirect ||
        function() {
          localStorage.removeItem('usuario');
          UtilFn.redirect((options.isRaiz ? '' : '../') + 'index');
        };
    } else {
      options.redirect = function() {
        localStorage.removeItem('usuario');
        UtilFn.redirect((options.isRaiz ? '' : '../') + 'index');
      };
    }

    if (!options.config) {
      console.log('no config sender!');
      return;
    }

    options.error =
      options.error ||
      function(jqXHR) {
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          UtilFn.showMessageToast(
            jqXHR.responseJSON.message,
            4000,
            options.redirect
          );
        } else {
          UtilFn.showMessageToast(
            options.messageTimeOut || 'Tiempo de espera agotado',
            4000,
            function() {
              localStorage.removeItem('usuario');
              UtilFn.redirect('index');
            }
          );
        }
      };

    $.ajax(options.config).done(options.success).fail(options.error);
  },
  saveInfoPendiente: function() {
    if (!$('#distritoInformacionPendiente').val()) {
      UtilFn.showMessageToast('Selecciona el distrito.');
      return;
    }

    if ($('#distritoInformacionPendiente').val().length == 0) {
      UtilFn.showMessageToast('Selecciona el distrito.');
      return;
    }

    console.log('distrito id->' + $('#distritoInformacionPendiente').val());

    var params = {
      'persona.distrito': $('#distritoInformacionPendiente').val(),
      id: UtilFn.getLoginUser().id,
      'persona.id': UtilFn.getLoginUser().persona.id,
      access_token: UtilFn.getToken()
    };

    // console.log('payload enviado para la actualizacion de perfil');
    // console.log(JSON.stringify(params));
    // console.log('-----------------------------------------------');

    $('#modalInformacionImportante').modal('close');
    UtilFn.showMaskLoading();
    //send service actualizar perfil
    UtilFn.ajaxInvokeService({
      isRaiz: true,
      messageTimeOut: 'La sesion a caducado!',
      //config ajax setup
      config: {
        method: 'POST',
        url: BASE_URL_SERVICE_REST + 'api/private/app/usuario/update',
        data: params
      },
      //success invoke
      success: function(httpResponse) {
        var user = UtilFn.getLoginUser();
        user.persona.distrito = params['persona.distrito'];
        localStorage.setItem('usuario', JSON.stringify(user));
        UtilFn.showMaskLoading('hide');
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
  },
  buildModalDataImportant: function() {
    var html =
      '<div id="modalInformacionImportante" class="modal modal-fixed-footer">' +
      '<div class="modal-content">' +
      '<div class="row">' +
      '<h5 style="padding-bottom:15px;">Información pendiente</h5>' +
      '<div class="input-field col s12" >' +
      '<select  id="distritoInformacionPendiente" ></select>' +
      '<label>Ingresa tu distrito</label>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="modal-footer">' +
      '<a href="#!" class="modal-action waves-effect waves-green btn-flat btnInformacionImportante">Ok!</a>' +
      '</div>' +
      '</div>';

    $('body').append(html);

    $('.btnInformacionImportante').click(function() {
      UtilFn.saveInfoPendiente();
    });
  },
  //active loading
  showMaskLoading: function(action) {
    if (action == 'hide') {
      $('.loader').hide();
      $('.back-loader').hide();
    } else {
      $('.loader').show();
      $('.back-loader').show();
    }
  },
  setLoginUser: function(usuario) {
    localStorage.setItem('access-token', usuario.accessToken);

    if (typeof usuario == 'string') {
      localStorage.setItem('usuario', usuario);
    } else {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
  },

  getLoginUser: function(usuario) {
    var usuarioStorage = localStorage.getItem('usuario');
    var user = JSON.parse(usuarioStorage);
    return user;
  },
  latitud: null,
  longitud: null,
  getCordenadas: function() {
    return {
      latitud: UtilFn.latitud,
      longitud: UtilFn.longitud
    };
  },
  getPosicionActual: function() {
    if (localStorage.getItem('_actualPosition')) {
      return JSON.parse(localStorage.getItem('_actualPosition'));
    }
    return null;
  },
  setCordenadas: function(position) {
    console.log('latitude->' + position.coords.latitude);
    console.log('longitude->' + position.coords.longitude);
    UtilFn.latitud = position.coords.latitude;
    UtilFn.longitud = position.coords.longitude;
    var actualPosition = {
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    };
    localStorage.setItem('_actualPosition', JSON.stringify(actualPosition));
  },
  initCordenadas: function() {
    navigator.geolocation.getCurrentPosition(
      UtilFn.setCordenadas,
      function() {
        alert('no hay cordenadas');
      },
      {
        enableHighAccuracy: true
      }
    );
  },

  showMessageToast: function(msg, tiempo, callback) {
    callback = callback || function() {};
    tiempo = tiempo || 3000;
    Materialize.toast(msg, tiempo, '', callback);
  },
  windowSelectionMedia: function(idElement, fnCamara, fnGaleria) {
    var html =
      '<div id="modalSeleccionCamaraPick" class="modal">' +
      '<div class="modal-content">' +
      '<div class="row">' +
      '<div class="center-align">' +
      '<div id="modalSeleccionCamaraPick_camara" class="col s6 center-align"><i class="material-icons large  orange-text text-lighten-1">album</i><br>Cámara</div>' +
      '<div id="modalSeleccionCamaraPick_album" class="col s6 center-align"><i class="material-icons large indigo-text text-lighten-1">collections</i><br>Galeria</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>';

    $('body').append(html);

    setTimeout(function() {
      $('#modalSeleccionCamaraPick').modal();

      $('#modalSeleccionCamaraPick_camara').click(fnCamara);

      $('#modalSeleccionCamaraPick_album').click(fnGaleria);

      $('#' + idElement).click(function() {
        console.log('Seleccionando imagen defaul');
        $('#modalSeleccionCamaraPick').modal('open');
      });
    }, 120);
  },
  buildComboSelect: function(options) {
    options = options || {};

    options.params = options.params || {};
    if (!options.params['access_token']) {
      options.params['access_token'] = UtilFn.getToken();
    }
    options.success = options.success || function() {};
    options.error = options.error || function() {};

    UtilFn.ajaxInvokeService({
      isRaiz: options.isRaiz,
      messageTimeOut: options.messageTimeOut || 'La sesion a caducado!',
      //config ajax setup
      config: {
        method: options.method || 'GET',
        url: options.url,
        data: options.params,
        dataType: options.dataType || 'json'
      },
      //success invoke
      success: options.success,
      //error invoke
      error: options.error
    });
  },

  validateForm: function(elements) {
    var validate = true;

    if (elements) {
      var errors = 0;
      elements.forEach(function(element, index) {
        var type = element.type;
        var requerid;
        if (errors > 0) {
          return;
        }
        var messageErrorReq = element.messageErrorReq;
        var messageErrorEmail = element.messageErrorEmail;
        var messageErrorNumber = element.messageErrorNumber;
        var idElement = element.id;
        if (element.requerid === undefined) {
          requerid = true;
        } else {
          requerid = element.requerid;
        }

        console.log('es requerido->' + requerid);

        var value = $('#' + idElement).val();
        if (!value) {
          $('#' + idElement).val('');
        }

        if (!type && requerid) {
          if ($('#' + idElement).val().length == 0) {
            UtilFn.showMessageToast(messageErrorReq || 'Campo requerido.');
            $('#' + idElement).focus();
            validate = false;
            errors++;
          }
        } else {
          if (requerid) {
            if ($('#' + idElement).val().length == 0) {
              UtilFn.showMessageToast(messageErrorReq || 'Campo requerido.');
              $('#' + idElement).focus();
              validate = false;
              errors++;
            }
          }
          if (validate) {
            switch (type) {
              case 'email':
                var filterEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (!filterEmail.test($('#' + idElement).val())) {
                  UtilFn.showMessageToast(
                    messageErrorEmail || 'Email invalido.'
                  );
                  $('#' + idElement).focus();
                  validate = false;
                  errors++;
                }
                break;
              case 'number':
                $('#' + idElement).val(
                  $('#' + idElement).val()
                    ? $('#' + idElement).val().trim()
                    : ''
                );
                if (isNaN($('#' + idElement).val())) {
                  UtilFn.showMessageToast(
                    messageErrorNumber || 'Formato numérico invalido.'
                  );
                  $('#' + idElement).focus();
                  validate = false;
                  errors++;
                }
                break;
            }
          }
        }
      });
    }
    return validate;
  },
  selectCatalogos: function(
    grupo,
    idSelect,
    displayName,
    value,
    emptyText,
    disabled
  ) {
    UtilFn.buildComboSelect({
      url:
        BASE_URL_SERVICE_REST + 'api/private/app/catalogo/' + grupo + '/listar',
      success: function(httpResponse) {
        var data = httpResponse.data;
        if (data) {
          try {
            $('#' + idSelect).material_select('destroy');
          } catch (e) {}
          $('#' + idSelect).find('option').remove();
          var firstItem =
            '<option ' +
            (disabled ? 'disabled="disabled"' : '') +
            ' value="" ' +
            (value ? '' : 'selected') +
            '>' +
            (emptyText ? emptyText : 'Seleccione') +
            '</option>';
          $('#' + idSelect).append(firstItem);
          $.each(data, function(i, item) {
            $('#' + idSelect).append(
              '<option ' +
                (value && item.id == value ? 'selected' : '') +
                ' value="' +
                item.id +
                '">' +
                item[displayName || 'desNombre'] +
                '</option>'
            );
          });
        }
        $('#' + idSelect).material_select();
      }
    });
  },
  picturePick: function(idImageDom, fn_callback) {
    //Selection picker media
    UtilFn.windowSelectionMedia(
      //ID invoke selection media
      idImageDom,
      //Function click Camara
      function() {
        navigator.camera.getPicture(
          //Ok
          function(imageURI) {
            if (fn_callback) {
              fn_callback(imageURI);
            }
            $('#' + idImageDom).attr('src', imageURI);
            $('#modalSeleccionCamaraPick').modal('close');
          },
          //Error
          function(imageURI) {
            console.log('error al obtener la imagen del dispositivo.');
            $('#modalSeleccionCamaraPick').modal('close');
          },
          //Config
          {
            quality: CALIDAD_IMG_MEDIA,
            allowEdit: true,
            destinationType: Camera.DestinationType.FILE_URI,
            correctOrientation: true
          }
        );
      },
      //Function clic album
      function() {
        navigator.camera.getPicture(
          //Ok
          function(imageURI) {
            if (fn_callback) {
              fn_callback(imageURI);
            }
            $('#' + idImageDom).attr('src', imageURI);
            $('#modalSeleccionCamaraPick').modal('close');
          },
          //Error
          function(imageURI) {
            console.log('error al obtener la imagen del dispositivo.');
            $('#modalSeleccionCamaraPick').modal('close');
          },
          //Config
          {
            quality: CALIDAD_IMG_MEDIA,
            allowEdit: true,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: Camera.DestinationType.DATA_URL
          }
        );
      }
    );
  },
  buildMapaGoogle: function(
    map,
    idDom,
    searchBox,
    idInput,
    markers,
    fn_callback,
    marker,
    iconUrl,
    zoom
  ) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        UtilFn.createMapaGoogle(
          position,
          map,
          idDom,
          searchBox,
          idInput,
          markers,
          fn_callback,
          marker,
          iconUrl,
          zoom
        );
      },
      function() {},
      {
        enableHighAccuracy: true
      }
    );
  },
  modalInfoErrorGpsAndNetwork: function(title, msg, errorType) {
    swal(
      {
        title: title, //"Error GPS",
        text: msg, //"por favor active el GPS de su dispositivo.",
        type: errorType || 'warning',
        closeOnConfirm: false,
        closeOnCancel: false,
        confirmButtonText: 'Ok!'
      },
      function(isConfirm) {
        try {
          var redirectTemp = window.location.href.substr(
            window.location.href.lastIndexOf('/') + 1
          );
          window.location = redirectTemp;
        } catch (e) {
          window.location = 'main.html';
        }
      }
    );
  },
  checkEnabled: function() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    if (Connection.NONE == networkState) {
      VERIFY_ENABLE_ACTIVE = true;
      UtilFn.modalInfoErrorGpsAndNetwork(
        'Error de Red',
        'Existe un error de conectividad.'
      );
      return;
    }

    if (VERIFY_ENABLE_ACTIVE) {
      return;
    }

    VERIFY_ENABLE_ACTIVE = true;

    cordova.plugins.diagnostic.isLocationAvailable(
      function(available) {
        if (!available) {
          UtilFn.modalInfoErrorGpsAndNetwork(
            'Error GPS',
            'por favor active el GPS de su dispositivo.'
          );
        }
      },
      function(error) {
        if (!available) {
          UtilFn.modalInfoErrorGpsAndNetwork(
            'Error GPS',
            'por favor active el GPS de su dispositivo.'
          );
        }
      }
    );
  },

  createMapaGoogle: function(
    position,
    map,
    idDom,
    searchBox,
    idInput,
    markers,
    fn_callback,
    marker,
    iconUrl,
    zoom
  ) {
    marker = marker || {};
    console.log('buildMapaGoogle(latitude)->' + position.coords.latitude);
    console.log('buildMapaGoogle(longitude)->' + position.coords.longitude);

    map = new google.maps.Map(document.getElementById(idDom), {
      center: {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      },
      mapTypeControl: false,
      zoom: zoom || 16,
      mapTypeId: 'roadmap',
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER
      }
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById(idInput);
    searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      clearMarkers();
      if (fn_callback) {
        fn_callback(null, map, markers);
      }
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log('Returned place contains no geometry');
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    map.addListener('click', function(event) {
      addMarker(event.latLng);
    });

    function addMarker(location) {
      clearMarkers();

      var icon = {
        url: iconUrl || 'images/icon_orange.png',
        size: new google.maps.Size(91, 91),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(37, 54),
        scaledSize: new google.maps.Size(45, 45)
      };

      marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: icon
      });

      markers.push(marker);

      if (fn_callback) {
        fn_callback(location, map, markers);
      }
    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setMapOnAll(null);
      markers = [];
    }
  },
  buildComboDistritos: function(idDom, value, options, disabled) {
    options = options || {};
    UtilFn.buildComboSelect({
      url:
        BASE_URL_SERVICE_REST + 'api/private/app/direccion/24/15/01/distritos',
      success: function(httpResponse) {
        var data = httpResponse.data;
        if (data) {
          try {
            $('#' + idDom).material_select('destroy');
          } catch (e) {}

          var firstItem =
            '<option  value="" ' +
            (disabled ? 'disabled' : '') +
            ' selected >' +
            (options.textEmpty ? options.textEmpty : 'Seleccione el distrito') +
            '</option>';
          $('#' + idDom).append(firstItem);
          var allItem =
            '<option  value="all" ' +
            ' selected >' +
            'Todos los distritos' +
            '</option>';
          $('#' + idDom).append(allItem);
          $.each(data, function(i, item) {
            $('#' + idDom).append(
              '<option ' +
                (item.catastro
                  ? 'data-catastro = "' + item.catastro + '"'
                  : '') +
                ' value="' +
                item.id +
                '">' +
                item.nombre +
                '</option>'
            );
          });
          if (value) {
            $('#' + idDom).val(value);
          }
        }
        $('#' + idDom).material_select();
      }
    });
  },
  refreshCountNotificaciones: function() {
    if (!UtilFn.getLoginUser()) {
      return;
    }
    UtilFn.ajaxInvokeService({
      isRaiz: true,
      messageTimeOut: 'La sesion a caducado!',
      //config ajax setup
      config: {
        method: 'GET',
        url: BASE_URL_SERVICE_REST + 'api/private/app/notificacion/count',
        data: {
          access_token: UtilFn.getToken(),
          'usuario.rol.nombre': 'USUARIO_MOBIL',
          'usuario.id': UtilFn.getLoginUser().id,
          indLeido: 0
        }
      },
      //success invoke
      success: function(response) {
        $('.countNotifiacionesView').html(
          response.data > 9 ? '9+' : response.data
        );
      },
      //error invoke
      error: function() {}
    });
  },
  filtrarClave: function(params, data) {
    if (params.mascotaClave) {
      console.log(params.mascotaClave);
      var clave = params.mascotaClave.toLowerCase();
      var filtered = [];
      for (var k = 0, t = data.length; k < t; k++) {
        var item = data[k];
        var descripcion = item.descripcion || '';
        var nombre = item.nombre || '';
        var distrito = item.desDistrito || '';
        console.log(item.mascotaNombre);
        console.log(item.descripcion);
        console.log(item.desDistrito);
        console.log(item.desRaza);
        if (
          nombre.toLowerCase().search(clave) >= 0 ||
          descripcion.toLowerCase().search(clave) >= 0 ||
          distrito.toLowerCase().search(clave) >= 0
        ) {
          filtered.push(item);
        }
      }
      data = filtered;
    }
    return data;
  }
};
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  UtilFn.checkEnabled();
  UtilFn.initCordenadas();
  //manejo de geo posicion actual
  setInterval(function() {
    UtilFn.initCordenadas();
  }, 30 * 1000);
  //Verificacion de GPS e Internet
  setInterval(function() {
    UtilFn.checkEnabled();
  }, 10 * 1000);
}
