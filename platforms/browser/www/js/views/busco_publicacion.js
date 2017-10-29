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

        buscoPublicacion.comboMascotas();
        buscoPublicacion.switchEsMiMascota();
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


        $('#chkOfreceRecompensa').change(function() {

            var chk = $(this);
            if (chk.is(':checked')) {
                console.log('mostrar recompensa');
                $('#content-recompensa').show();
            } else {
                console.log('ocultar recompensa');
                $('#content-recompensa').hide();
            }

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

    buscoPublicacion.switchEsMiMascota = function() {

        $('#chkBuscoPublicacionMiMascota').change(function() {

            var chk = $(this);
            if (chk.is(':checked')) {
                $('#content-nombre-o').hide();
                $('#content-nombre-p').show();
            } else {
                $('#content-nombre-p').hide();
                $('#content-nombre-o').show();
            }

            buscoPublicacion.clearChangeSelectionMiMascota();

        });

    }

    //Obtener mascotas
    buscoPublicacion.comboMascotas = function() {

        UtilFn.ajaxInvokeService({
            isRaiz: true,
            messageTimeOut: 'La sesion a caducado!',
            //config ajax setup
            config: {
                method: "GET",
                url: BASE_URL_SERVICE_REST + "api/private/app/mascota",
                data: {
                    access_token: UtilFn.getToken(),
                    personaId: buscoPublicacion.usuarioSesion.persona.id
                }
            }
            //success invoke
            ,
            success: function(httpResponse) {

                console.log('httpResponselist mascotas----------------------');
                console.log(JSON.stringify(httpResponse));
                console.log('-----------------------------------------------');

                var data = httpResponse.data;

                if (data) {

                    try {
                        $('#nombresCb').material_select('destroy');
                    } catch (e) {}

                    $('#nombresCb').find('option').remove();
                    var firstItem = '<option value="" selected >Selecciona tu mascota</option>';
                    $('#nombresCb').append(firstItem);

                    data.forEach(function(item, index) {
                        $('#nombresCb').append('<option ' +
                            ' data-idmascota = "' + item.id + '" ' +
                            ' data-nombre = "' + item.nombre + '" ' +
                            ' data-raza = "' + item.raza + '" ' +
                            ' data-genero = "' + item.genero + '" ' +
                            ' data-tamanio = "' + item.tamanio + '" ' +
                            ' data-color = "' + item.color + '" ' +
                            ' data-descripcion = "' + item.desComentario + '" ' +
                            ' data-foto = "' + item.fotoPrincipal.foto + '" ' +
                            ' value="' + item.id + '">' + item.nombre + '</option>');
                    });

                    $('#nombresCb').material_select();

                    $('#nombresCb').change(function() {
                        var mascota = {
                            id: $("#nombresCb option:selected").data('idmascota'),
                            nombre: $("#nombresCb option:selected").data('nombre'),
                            raza: $("#nombresCb option:selected").data('raza'),
                            genero: $("#nombresCb option:selected").data('genero'),
                            tamanio: $("#nombresCb option:selected").data('tamanio'),
                            color: $("#nombresCb option:selected").data('color'),
                            descripcion: $("#nombresCb option:selected").data('descripcion'),
                            foto: $("#nombresCb option:selected").data('foto'),
                        }
                        buscoPublicacion.loadMascota(mascota);
                    });

                }
            },
            error: function(jqXHR) {
                console.log('error listar mascotas publicacion------------------');
                console.log(JSON.stringify(jqXHR));
                console.log('---------------------------------------------------');
            }
        });

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

        buscoPublicacion.comboMascotas();
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

        if ($('#chkBuscoPublicacionMiMascota').is(':checked')) {
            itemsvalidators.push({
                id: 'nombresCb',
                messageErrorReq: 'Selecciona tu mascota.'
            });
        }

        itemsvalidators.push({
            id: 'razaMascota',
            messageErrorReq: 'Seleccione la raza de la mascota.'
        });

        itemsvalidators.push({
            id: 'generoMascota',
            messageErrorReq: 'Seleccione el sexo de la mascota.'
        });

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

        if ($('#chkOfreceRecompensa').is(':checked')) {
            itemsvalidators.push({
                id: 'montoRecompensa',
                messageErrorReq: 'Ingrese el monto.'
            });
        }

        var isValid = UtilFn.validateForm(itemsvalidators);

        if (!isValid) {
            return;
        }

        if (!cordenadasUbica) {
            UtilFn.showMessageToast("Ubica en el mapa la publicación.");
            return;
        }

        var restServiceUpload = BASE_URL_SERVICE_REST + "app/f/busqueda/registro";

        var inputPublicacion = $('.inputPublicacion');

        var params = new Object();

        inputPublicacion.each(function() {
            if (this.name && this.value) {
                params[this.name] = $(this).val();
            }
        });

        if (!$('#chkBuscoPublicacionMiMascota').is(':checked') && !fotoBusqueda) {
            UtilFn.showMessageToast("Ingrese una foto.");
            return;
        }

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

        if (params['mascota.id']) {
            params.mascotaId = params['mascota.id'];
            params['mascota.usuarioModifico'] = buscoPublicacion.usuarioSesion.usuario;
        } else {
            params['mascota.usuarioRegistro'] = buscoPublicacion.usuarioSesion.usuario;
        }

        params.usuarioRegistro = buscoPublicacion.usuarioSesion.id;

        if ($('#chkBuscoPublicacionMiMascota').is(':checked')) {
            params.indMascotaPropia = 1;
        } else {
            params.indMascotaPropia = 2;
            params['mascota.id'] = '';
            params['mascota.usuarioModifico'] = '';
            params['mascota.usuarioRegistro'] = buscoPublicacion.usuarioSesion.usuario;
        }

        if ($('#chkOfreceRecompensa').is(':checked')) {
            params.indRecompensa = 1;
        } else {
            params.indRecompensa = 2;
        }
        params['desParametro1'] = buscoPublicacion.usuarioSesion.usuario;
        params['nombrecompleto'] = buscoPublicacion.usuarioSesion.persona.nombreCompleto;

        params.ubicacionCatastro = cordenadasUbica.lat() + ' ' + cordenadasUbica.lng();

        if (params['mascota.desComentario']) {
            params.descripcion = params['mascota.desComentario'];
        }

        // console.log('TELEFONO->'+buscoPublicacion.usuarioSesion.persona.contactoPrincipal.numero);
        // localStorage.setItem("usuario",JSON.stringify(usuario));
        // return;
        //persona.contactoPrincipal.numero

        params['mascota.desRaza'] = $("#razaMascota").find('option:selected').text();

        console.log('Busca Publicacion payload-----------------------------------------');
        console.log(JSON.stringify(params));
        console.log('------------------------------------------------------------------');
        //return;
        $('#btnPublica').addClass('disabled');

        UtilFn.showMaskLoading();

        if (fotoBusqueda) {
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
                        //     text: '<span style="color:#60116A;">La publicacion se envio con exito!</span>',
                        //     type: "success",
                        //     html: true
                        //   },
                        //   function(){
                        //     setTimeout(function(){
                        //         window.location = 'busco.html'
                        //     }, 500);
                        //   });

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
                                        window.location = 'busco.html'
                                    }, 500);
                                    swal.close();
                                } else {
                                    UtilFn.compartirEnlace({
                                        img: BASE_URL_SERVER_WEB_IMAGES + response.busqueda.mascota.fotoPrincipal.foto,
                                        mensaje: 'Se perdió ' + (response.busqueda.mascota.nombre ? response.busqueda.mascota.nombre : 'Engreido sin nombre.') + ' de raza ' + params['mascota.desRaza'] + ' cerca a ti el ' + moment(new Date()).format('DD/MM/YYYY hh:mm A'),
                                        url: BASE_URL_WEB_PDP + 'mostrarPosterPublicacion?id=' + response.busqueda.id + '&tipo=B'
                                    });
                                }
                            }
                        );

                        //  swal("Listo!", '<span style="color:#60116A;">La publicación se envio con exito!.</span>', "success");
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

        } else {
            console.log('envia sin upload publicacion');
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

                    console.log("response de publicacion busqueda");
                    console.log(JSON.stringify(response));

                    if (response.success) {
                        // swal({
                        //     title: '<span style="color:#60116A;">Listo!</span>',
                        //     text: '<span style="color:#60116A;">La publicacion se envio con exito!.</span>.',
                        //     type: "success",
                        //     html: true
                        //   },
                        //   function(){
                        //     setTimeout(function(){
                        //         window.location = 'busco.html'
                        //     }, 500);
                        //   });
                        //swal("Listo!", '<span style="color:#60116A;">La publicacion se envio con exito!.</span>.', "success");

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
                                        window.location = 'busco.html'
                                    }, 500);
                                    swal.close();
                                } else {
                                    UtilFn.compartirEnlace({
                                        img: BASE_URL_SERVER_WEB_IMAGES + response.busqueda.mascota.fotoPrincipal.foto,
                                        mensaje: 'Se perdió ' + (response.busqueda.mascota.nombre ? response.busqueda.mascota.nombre : 'Engreido sin nombre.') + ' de raza ' + params['mascota.desRaza'] + ' cerca a ti el ' + moment(new Date()).format('DD/MM/YYYY hh:mm A')
                                            //mensaje:'Se perdio, '++''+$("#razaMascota").find('option:selected').text()
                                            //,url : BASE_URL_SERVER_WEB_IMAGES+'mostrarPosterBusqueda?id='+detalle.id
                                            ,
                                        url: BASE_URL_WEB_PDP + 'mostrarPosterPublicacion?id=' + response.busqueda.id + '&tipo=B'
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
