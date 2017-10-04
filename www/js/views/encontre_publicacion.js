document.addEventListener("backbutton", function() {


}, false);
(function() {

    //Scope General
    var buscoPublicacion = this;

    //Foto Busqueda
    var fotoBusqueda;

    //Mapa de google
    var map;

    //Component de busqueda de direcciones
    var searchBox;

    //Lista de masrkers
    var markers;

    //Cordenadas selccionadas
    var cordenadasUbica;

    //Usuario de sesion
    buscoPublicacion.usuarioSesion = UtilFn.getLoginUser();

    //Inicio
    buscoPublicacion.init = function() {

        console.log('Inicio buscoPublicacion!!');


        try {
            $('#telefonoTxt').val(buscoPublicacion.usuarioSesion.persona.contactoPrincipal.numero);
            $('#nombresTxt_').addClass('active');
        } catch (e) {}

        buscoPublicacion.buildCombos();
        UtilFn.picturePick('imagenFotoPublica', function(f) {
            fotoBusqueda = f;
        });
        UtilFn.buildMapaGoogle(map, 'map-publica', searchBox, 'g-s-input', markers, function(c, a, b) {
            cordenadasUbica = c;
            map = a;
            markers = b;
        });
        UtilFn.buildComboDistritos('distritoCb');
        $('#btnPublica').click(function() {
            buscoPublicacion.savePublicacion();
        });
        $('#btnClearFotoPublica').click(function() {
            $('#imagenFotoPublica').attr('src', 'images/default-image.png');
            fotoBusqueda = null;
        });

    }

    buscoPublicacion.buildCombos = function() {

        //combo raza
        UtilFn.selectCatalogos(3, 'razaMascota');
        //combo sexo
        UtilFn.selectCatalogos(2, 'generoMascota', 'desAbreviacion');
        //combo tamaño
        UtilFn.selectCatalogos(12, 'tamanioMascota');
        //combo color
        UtilFn.selectCatalogos(11, 'colorMascota');

    }


    //Obtener mascotas
    buscoPublicacion.loadMascota = function(mascota) {

        console.log('mascota load form---------------------------------');
        console.log(JSON.stringify(mascota));
        console.log('---------------------------------------------------');

        UtilFn.showMaskLoading();
        $('#nombresTxt').val(mascota.nombre);
        $('#descripcionMascota_').addClass('active');
        $('#descripcionMascota').val(mascota.descripcion);

        UtilFn.selectCatalogos(3, 'razaMascota', null, mascota.raza);
        UtilFn.selectCatalogos(2, 'generoMascota', 'desAbreviacion', mascota.genero);
        UtilFn.selectCatalogos(12, 'tamanioMascota', null, mascota.tamanio);
        UtilFn.selectCatalogos(11, 'colorMascota', null, mascota.color);

        $('#imagenFotoPublica').attr('src', BASE_URL_SERVER_WEB_IMAGES + mascota.foto + "?timestamp=" + new Date().getTime());

        setTimeout(function() {
            UtilFn.showMaskLoading('hide');
        }, 1800)

    }

    buscoPublicacion.clearChangeSelectionMiMascota = function() {

        UtilFn.showMaskLoading();

        $('#nombresTxt').val('');
        $('#descripcionMascota_').removeClass('active');
        $('#descripcionMascota').val('');

        buscoPublicacion.buildCombos();

        setTimeout(function() {
            UtilFn.showMaskLoading('hide');
        }, 2000)

    }

    buscoPublicacion.savePublicacion = function() {

        var itemsvalidators = [];

        // itemsvalidators.push({
        //                         id: 'razaMascota',
        //                         messageErrorReq: 'Seleccione la raza de la mascota.'
        //                     });

        // itemsvalidators.push({
        //                         id: 'generoMascota',
        //                         messageErrorReq: 'Seleccione el sexo de la mascota.'
        //                     });

        itemsvalidators.push({
            id: 'tamanioMascota',
            messageErrorReq: 'Seleccione el tamaño de la mascota.'
        });

        itemsvalidators.push({
            id: 'colorMascota',
            messageErrorReq: 'Seleccione el color de la mascota.'
        });

        itemsvalidators.push({
            id: 'descripcionMascota',
            messageErrorReq: 'Ingrese una descripción sobre su mascota.'
        });

        itemsvalidators.push({
            id: 'distritoCb',
            messageErrorReq: 'Selecciona el distrito.'
        });

        itemsvalidators.push({
            id: 'telefonoTxt',
            messageErrorReq: 'Ingrese su teléfono.'
        });

        var isValid = UtilFn.validateForm(itemsvalidators);

        if (!isValid) {
            return;
        }

        if (!fotoBusqueda) {
            UtilFn.showMessageToast("Ingrese una foto.");
            return;
        }

        if (!cordenadasUbica) {
            UtilFn.showMessageToast("Ubica en el mapa la publicación.");
            return;
        }

        var restServiceUpload = BASE_URL_SERVICE_REST + "app/f/encontre/registro";

        var inputPublicacion = $('.inputPublicacion');

        var params = new Object();

        inputPublicacion.each(function() {
            if (this.name && this.value) {
                params[this.name] = $(this).val();
            }
        });



        // swal({
        //         title: "Confirma la acción",
        //         text: "La publicacion será enviada. ¿Estás seguro?",
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

        params.access_token = UtilFn.getToken();

        params.usuarioRegistro = buscoPublicacion.usuarioSesion.id;
        params['usuarioEncontro'] = buscoPublicacion.usuarioSesion.id;
        params['mascota.usuarioModifico'] = '';
        params['mascota.usuarioRegistro'] = buscoPublicacion.usuarioSesion.usuario;

        params['desParametro1'] = buscoPublicacion.usuarioSesion.usuario;
        params['nombrecompleto'] = buscoPublicacion.usuarioSesion.persona.nombreCompleto;

        if ($('#chkLoTengo').is(':checked')) {
            params.tipoEncuentro = 1;
        } else {
            params.tipoEncuentro = 2;
        }

        params.ubicacionCatastro = cordenadasUbica.lat() + ' ' + cordenadasUbica.lng();

        if (params['mascota.desComentario']) {
            params.descripcion = params['mascota.desComentario'];
        }
        params['mascota.desRaza'] = $("#razaMascota").find('option:selected').text();
        console.log('Busca Publicacion payload-----------------------------------------');
        console.log(JSON.stringify(params));
        console.log('------------------------------------------------------------------');

        $('#btnPublica').addClass('disabled');

        UtilFn.showMaskLoading();

        $('#btnPublica').removeClass('disabled');

        var options = new FileUploadOptions();
        options.fileKey = "fileFoto";
        options.fileName = (new Date()).getTime() + '.jpg';
        options.mimeType = "image/jpeg";
        options.params = params;
        options.chunkedMode = false;
        var ft = new FileTransfer();

        ft.upload(fotoBusqueda, encodeURI(restServiceUpload), function(result) {
                console.log('envia con upload publicacion');
                var response = JSON.parse(result.response);

                console.log("response de empresa");
                console.log(JSON.stringify(response));

                if (response.success) {

                    try {
                        var usuarioActualizaTelefono = null;
                        if (!buscoPublicacion.usuarioSesion.persona.contactoPrincipal) {
                            buscoPublicacion.usuarioSesion.persona.contactoPrincipal = {};
                            buscoPublicacion.usuarioSesion.persona.contactoPrincipal.numero = params.telefono;
                            usuarioActualizaTelefono = buscoPublicacion.usuarioSesion;
                            localStorage.setItem("usuario", JSON.stringify(usuarioActualizaTelefono));
                        } else if (buscoPublicacion.usuarioSesion.persona.contactoPrincipal &&
                            !buscoPublicacion.usuarioSesion.persona.contactoPrincipal.numero) {
                            buscoPublicacion.usuarioSesion.persona.contactoPrincipal.numero = params.telefono;
                            usuarioActualizaTelefono = buscoPublicacion.usuarioSesion;
                            localStorage.setItem("usuario", JSON.stringify(usuarioActualizaTelefono));
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    // swal({
                    //     title: '<span style="color:#60116A;">Listo!</span>',
                    //     text: '<span style="color:#60116A;">La publicacion se envio con exito!.</span>.',
                    //     type: "success",
                    //     html: true
                    //   },
                    //   function(){
                    //     setTimeout(function(){
                    //         window.location = 'encontre.html'
                    //     }, 500);
                    //   });

                    //swal("Listo!", '<span style="color:#60116A;">La publicacion se envio con exito!.</span>', "success");

                    swal({

                            title: '<span style="color:#60116A;">Listo!</span>',
                            text: '<span style="color:#60116A;">La publicacion se envio con exito!</span>',
                            type: "success",
                            html: true,
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Ok!',
                            cancelButtonText: 'Compartir',
                            closeOnConfirm: false,
                            closeOnCancel: false
                        },
                        function(isConfirm) {
                            if (isConfirm) {
                                setTimeout(function() {
                                    window.location = 'encontre.html'
                                }, 500);
                                swal.close();
                            } else {
                                UtilFn.compartirEnlace({
                                    img: BASE_URL_SERVER_WEB_IMAGES + response.busqueda.mascota.fotoPrincipal.foto,
                                    mensaje: 'Se encontró al engreído ' + (response.busqueda.mascota.nombre ? response.busqueda.mascota.nombre : 'Engreido sin nombre.') + ' de raza ' + params['mascota.desRaza'] + ' cerca a ti el ' + moment(new Date()).format('DD/MM/YYYY hh:mm A'),
                                    url: BASE_URL_WEB_PDP + 'mostrarPosterPublicacion?id=' + response.busqueda.id + '&tipo=E'
                                });
                            }
                        }
                    );
                } else {
                    UtilFn.showMessageToast("Ha ocurrido un error al intentar enviar el registro.");
                }

                $('#btnPublica').removeClass('disabled');
                UtilFn.showMaskLoading('hide');

                buscoPublicacion.resetForm();

            }, function(error) {
                $('#btnRegistrarNegocio').removeClass('disabled');
                UtilFn.showMaskLoading('hide');
                console.log('error-----------------------------------------');
                console.log(JSON.stringify(error));
                console.log('-----------------------------------------------');

            },

            options);




        // } else {
        //     $('#btnRegistrarNegocio').removeClass('disabled');
        //     swal.close();
        // }
        //  });

    }

    buscoPublicacion.resetForm = function() {
        UtilFn.buildComboDistritos('distritoCb');
        buscoPublicacion.clearChangeSelectionMiMascota();
        $('#imagenFotoPublica').attr('src', 'images/default-image.png');
        fotoBusqueda = null;
        cordenadasUbica = null;

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
            document.getElementById('g-s-input').value = '';
        }

    }

    //:::::::::::::::::INICIAR:::::::::::::::::::::
    buscoPublicacion.init();
    //:::::::::::::::::::::::::::::::::::::::::::::

})()
