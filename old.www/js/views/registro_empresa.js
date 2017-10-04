document.addEventListener("backbutton", function() {

}, false);
(function() {

    //Scope General
    var registroEmpresa = this;

    //Foto de la empresa
    var fotoEmpresa = null;

    //Cordenadas de la empresa
    var cordenadasEmpresa = null;

    //Mapa google maps
    var map = null;
    //Markers de mapa
    var markers = null;
    //Buscador de calles
    var searchBox = null;

    //marker seleccionado
    var marker = null;

    //Metodo de inicio
    registroEmpresa.init = function() {
        //UtilFn.selectCatalogos(9, 'tipoEmpresaRegistroEmpresa',null,null,null,true);
        registroEmpresa.listMultiple();
        registroEmpresa.mediaInit();

        navigator.geolocation.getCurrentPosition(
            registroEmpresa.buildMapaUbicaEmpresa,
            function() {}, {
                enableHighAccuracy: true
            }
        );

        $('#btnClearFotoEmpresa').click(function() {
            $('#imagenRegistroEmpresa').attr('src', 'images/default-image.png');
        });

        $('#btnRegistrarNegocio').click(function() {
            registroEmpresa.saveEmpresa();
        });

    }

    //Construir lista de negocios
    registroEmpresa.listMultiple = function() {
        UtilFn.buildComboSelect({
            url: BASE_URL_SERVICE_REST + "api/private/app/catalogo/" + 9 + "/listar",
            success: function(httpResponse) {
                $('#tipoNegocioMultiple').empty();
                var data = httpResponse.data;
                if (data) {
                    data.forEach(function(item, i) {
                        $('#tipoNegocioMultiple').append('<p><input type="checkbox" id="chk_' + item.id + '" class="chk_tn" value = "' + item.id + '" /><label class="texto-lista" for="chk_' + item.id + '" >' + item.desNombre + '</label></p>');
                    });
                }
            }
        });

    }

    //Inicializador de captura de camara o galeria de fotos
    registroEmpresa.mediaInit = function() {
        //Selection picker media
        UtilFn.windowSelectionMedia(
            //ID invoke selection media
            'imagenRegistroEmpresa',
            //Function click Camara
            function() {
                navigator.camera.getPicture(
                    //Ok
                    function(imageURI) {
                        fotoEmpresa = imageURI;
                        $('#imagenRegistroEmpresa').attr('src', imageURI);
                        $('#modalSeleccionCamaraPick').modal('close');
                    },
                    //Error
                    function(imageURI) {
                        console.log('captura camara error!');
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
                        fotoEmpresa = imageURI;
                        $('#imagenRegistroEmpresa').attr('src', imageURI);
                        $('#modalSeleccionCamaraPick').modal('close');
                    },
                    //Error
                    function(imageURI) {
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
    }


    //Creacion de mapa para ubicacion de empresa
    registroEmpresa.buildMapaUbicaEmpresa = function(position) {

        console.log('buildMapaUbicaEmpresa(latitude)->' + position.coords.latitude);
        console.log('buildMapaUbicaEmpresa(longitude)->' + position.coords.longitude);

        console.log('buildMapaUbicaEmpresa->');

        map = new google.maps.Map(document.getElementById('map-empresa'), {
            center: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            },
            mapTypeControl: false,
            zoom: 16,
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
        var input = document.getElementById('pac-input');
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
            cordenadasEmpresa = null;
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
            map.fitBounds(bounds);
        });

        map.addListener('click', function(event) {
            addMarker(event.latLng);
        });

        function addMarker(location) {
            clearMarkers();

            cordenadasEmpresa = location;

            var icon = {
                url: 'images/icon_orange.png',
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
    }

    //Registro de empresa/negocio
    registroEmpresa.saveEmpresa = function() {


        var arrTn = []
        $('.chk_tn').each(function() {
            var chk = this;
            if ($(chk).is(':checked')) {
                arrTn.push($(chk).val());
            }
        });

        if (arrTn.length == 0) {
            UtilFn.showMessageToast("Selecciona tipo empresa.");
            return;
        }

        var isValid = UtilFn.validateForm(
            [

                {
                    id: 'tituloRegistroEmpresa',
                    messageErrorReq: 'Ingreso el nombre de la empresa.'
                },
                {
                    id: 'telefonos',
                    messageErrorReq: 'Ingrese los telefonos..'
                },
                {
                    id: 'direccion',
                    messageErrorReq: 'Ingrese la dirección.'
                },
                {
                    id: 'horario',
                    messageErrorReq: 'Ingrese el horario de atención.'
                },
                {
                    id: 'descripcionRegistroEmpresa',
                    messageErrorReq: 'Ingrese la descripción de la empresa.'
                }
            ]
        );

        if (!isValid) {
            return;
        }

        if (!cordenadasEmpresa) {
            UtilFn.showMessageToast("Ubica la empresa en el mapa.");
            return;
        }


        // swal({
        //         title: "Confirma la acción",
        //         text: "Vas a enviar una solicitud para registrar a " + $('#tituloRegistroEmpresa').val() + ". ¿Estás seguro?",
        //         type: "warning",
        //         showCancelButton: true,
        //         confirmButtonColor: "#DD6B55",
        //         confirmButtonText: "Si",
        //         cancelButtonText: "No",
        //         closeOnConfirm: false,
        //         closeOnCancel: false
        //     },
        //     function(isConfirm) {
        //         if (isConfirm) {

        var restServiceUpload = BASE_URL_SERVICE_REST + "app/f/negocio/registro";

        var inputsMascota = $('.inputRegistroEmpresa');

        var params = new Object();

        inputsMascota.each(function() {
            if (this.name && this.value) {
                params[this.name] = $(this).val();
            }
        });

        console.log('tipos-----------------------------------------');
        console.log(JSON.stringify($('#tipoEmpresaRegistroEmpresa').val()));

        // if($('#tipoEmpresaRegistroEmpresa').val() && $('#tipoEmpresaRegistroEmpresa').val().length > 0){
        //   var c = 0;
        //   $('#tipoEmpresaRegistroEmpresa').val().forEach(function(item){
        //     if(item && item.length > 0){
        //       params['listNegociaCate['+c+']'] = parseInt(item);
        //       c++;
        //     }
        //   });
        //
        //   if(c == 0){
        //     UtilFn.showMessageToast("Selecciona tipo empresa.");
        //     return;
        //   }
        // }
        var c = 0;
        arrTn.forEach(function(elmentItem) {
            if (elmentItem && elmentItem.length > 0) {
                params['listNegociaCate[' + c + ']'] = parseInt(elmentItem);
                c++;
            }
        });

        params.access_token = UtilFn.getToken();
        params.ubicacionCatastro = cordenadasEmpresa.lat() + ' ' + cordenadasEmpresa.lng();


        params['usuario.id'] = UtilFn.getLoginUser().id;
        params['usuario.usuario'] = UtilFn.getLoginUser().usuario;
        params['usuario.rol.id'] = UtilFn.getLoginUser().rol.id;


        console.log('Empresa payload-----------------------------------------');
        console.log(JSON.stringify(params));
        if (cordenadasEmpresa) {
            console.log(JSON.stringify(cordenadasEmpresa));
        }
        console.log('--------------------------------------------------------');

        $('#btnRegistrarNegocio').addClass('disabled');

        UtilFn.showMaskLoading();

        if (fotoEmpresa) {

            var options = new FileUploadOptions();
            options.fileKey = "fileFoto";
            options.fileName = (new Date()).getTime() + '.jpg';
            options.mimeType = "image/jpeg";
            options.params = params;
            options.chunkedMode = false;
            var ft = new FileTransfer();

            ft.upload(fotoEmpresa, encodeURI(restServiceUpload), function(result) {
                    console.log('envia con upload empresa');
                    var response = JSON.parse(result.response);

                    console.log("response de empresa");
                    console.log(JSON.stringify(response));

                    if (response.success) {

                        //swal("Listo!", 'Su pedido fue recibido, se comunicarán Con usted cuando el proceso finalize.', "success");

                        swal({

                            title: '<span style="color:#60116A;">Listo!</span>',
                            text: '<span style="color:#60116A;">Su pedido fue recibido, se comunicarán Con usted cuando el proceso finalize.</span>',
                            type: "success",
                            html: true,
                            closeOnConfirm: false,
                            closeOnCancel: false
                        }, function() {
                            window.location = 'main.html';
                        });
                        registroEmpresa.resetForm();




                    } else {

                        swal("Error!", "Ups! Ha ocurrido un error!", "error");
                    }

                    $('#btnRegistrarNegocio').removeClass('disabled');

                    UtilFn.showMaskLoading('hide');

                }, function(error) {

                    $('#btnRegistrarNegocio').removeClass('disabled');
                    UtilFn.showMaskLoading('hide');

                    swal("Error!", "Ups! Ha ocurrido un error!", "error");
                    console.log('error-----------------------------------------');
                    console.log(JSON.stringify(error));
                    console.log('-----------------------------------------------');

                },

                options);

        } else {
            console.log('envia sin upload');
            UtilFn.ajaxInvokeService({
                isRaiz: true,
                messageTimeOut: 'La sesion a caducado!',
                //config ajax setup
                config: {
                    method: "POST",
                    url: restServiceUpload,
                    data: params
                }
                //success invoke
                ,
                success: function(httpResponse) {

                    var response = httpResponse;

                    console.log("response de mascota");
                    console.log(JSON.stringify(response));

                    if (response.success) {
                        //  swal("Listo!", 'Su pedido fue recibido, se comunicarán Con usted cuando el proceso finalize.', "success");

                        swal({

                            title: '<span style="color:#60116A;">Listo!</span>',
                            text: '<span style="color:#60116A;">Su pedido fue recibido, se comunicarán Con usted cuando el proceso finalize.</span>',
                            type: "success",
                            html: true,
                            closeOnConfirm: false,
                            closeOnCancel: false
                        }, function() {
                            window.location = 'main.html';
                        });

                        registroEmpresa.resetForm();

                    } else {

                    }

                    $('#btnRegistrarNegocio').removeClass('disabled');
                    UtilFn.showMaskLoading('hide');

                },
                error: function(jqXHR) {

                    Uswal("Error!", "Ups! Ha ocurrido un error!", "error");
                    $('#btnRegistrarNegocio').removeClass('disabled');
                    UtilFn.showMaskLoading('hide');
                    console.log('error-----------------------------------------');
                    console.log(JSON.stringify(jqXHR));
                    console.log('-----------------------------------------------');

                }
            });
        }


        //     } else {
        //         swal.close();
        //     }
        // });


    }

    registroEmpresa.resetForm = function() {
        fotoEmpresa = null;
        cordenadasEmpresa = null;
        UtilFn.selectCatalogos(9, 'tipoEmpresaRegistroEmpresa');
        $('.inputRegistroEmpresa').val('');
        $('#imagenRegistroEmpresa').attr('src', 'images/default-image.png');
        if (markers) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        }

        if (map) {
            var center = {
                lat: UtilFn.getCordenadas().latitud,
                lng: UtilFn.getCordenadas().longitud
            }
            if (center.latitud) {
                map.setCenter(center);
            }
            document.getElementById('pac-input').value = '';
        }

    }


    //:::::::::::::::::INICIAR:::::::::::::::::::::
    $(document).ready(function() {
        registroEmpresa.init();
    });
    //:::::::::::::::::::::::::::::::::::::::::::::

})();
