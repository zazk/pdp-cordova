document.addEventListener("backbutton", function() {

    $('#modalSeleccionCamaraPick').modal('close');


}, false);
(function() {

    //Scope General
    var perfilUsuario = this;
    //Variable que contine el imgeUri del dispositivo
    var fotoPrincipal;
    //Flag para indicar si la foto va a ser actualizada
    var actualizarFoto = true;
    //Objeto temporal para almacener la mascota seleccionada
    perfilUsuario.mascotaSeleccionada = null;
    //Obtencion del Usuario Logeado
    perfilUsuario.usuarioSesion = UtilFn.getLoginUser();

    //Metodo de Inicializacion
    perfilUsuario.init = function() {

        setTimeout(function() {
            $('#passwordPerfil').val('');
        }, 200)


        //initialize select distritos
        UtilFn.buildComboSelect({
            url: BASE_URL_SERVICE_REST + "api/private/app/direccion/24/15/01/distritos",
            success: function(httpResponse) {
                var data = httpResponse.data;
                if (data) {
                    var firstItem = '<option value="" selected>Seleccione el distrito</option>';
                    $('#distritoPerfil').append(firstItem);
                    $.each(data, function(i, item) {
                        $('#distritoPerfil').append('<option value="' + item.id + '">' + item.nombre + '</option>');
                    });
                    $('#distritoPerfil').val(perfilUsuario.usuarioSesion.persona.distrito);
                }
                $('#distritoPerfil').material_select();
            }
        });
        //Selection picker media
        UtilFn.windowSelectionMedia(
            //ID invoke selection media
            'imageNewPet',
            //Function click Camara
            function() {
                navigator.camera.getPicture(
                    //Ok
                    function(imageURI) {
                        fotoPrincipal = imageURI;
                        actualizarFoto = true;
                        $('#imageNewPet').attr('src', imageURI);
                        $('#modalSeleccionCamaraPick').modal('close');
                    },
                    //Error
                    function(imageURI) {
                        actualizarFoto = true;
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
                        fotoPrincipal = imageURI;
                        actualizarFoto = true;
                        $('#imageNewPet').attr('src', imageURI);
                        $('#modalSeleccionCamaraPick').modal('close');
                    },
                    //Error
                    function(imageURI) {
                        actualizarFoto = true;
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

        //Form mascotas
        perfilUsuario.buildCatalogos();
        //contador descripcion mascota
        $('#descripcionMascota').characterCounter();
        //Inicimos lista de mascotas
        //Validar si es que existen mascotas
        //para este usuario
        $('.collapsible').collapsible();
        //Open modal nueva mascotas
        $('#modalEditarMascota').modal({
            dismissible: false,
            ready: function(modal, trigger) {
                console.log('ready modal mascota');
                perfilUsuario.loadFormMascota();
            },
            complete: function() {
                console.log('limpiando el formulario');
                perfilUsuario.clearFormMascota();
            }
        });
        //Abrir modal mascotas
        $('#btnOpenNewPet').click(function() {
            $('#modalEditarMascota').modal('open');
        });
        //Close modal mascotas
        $('#closeBtnModalMascota').click(function() {
            $('#modalEditarMascota').modal('close');
        });
        //Si existe usuario de sesion
        //Cargamos la informacion en el form de perfil
        if (perfilUsuario.usuarioSesion) {
            $('#dniPerfil').val(perfilUsuario.usuarioSesion.persona.nroDocumento);
            $('#nombresPerfil').val(perfilUsuario.usuarioSesion.persona.nombreCompleto);
            $('#usuarioPerfil').val(perfilUsuario.usuarioSesion.usuario);
            $('#telefonoPerfil').val(perfilUsuario.usuarioSesion.persona && perfilUsuario.usuarioSesion.persona.contactoPrincipal && perfilUsuario.usuarioSesion.persona.contactoPrincipal.numero ? perfilUsuario.usuarioSesion.persona.contactoPrincipal.numero : '');
            if (perfilUsuario.usuarioSesion.indAlerta == 1) {
                $('#chkRecibirAlertas').prop("checked", true);
            }
        }
        //Click actualizar perfil
        $('#btnActualizarPerfil').click(function() {
            perfilUsuario.actualizarPerfil();
        });
        //Click grabar mascota
        $('#btnGrabarMascota').click(function() {
            console.log('registro mascota 111');
            perfilUsuario.saveMascota();
        });
        //print listar mascotas
        perfilUsuario.listarMascotas();
    }
    //Metodo que obtiene y crea select en base catalogo por grupo
    perfilUsuario.createComboCatalogo = function(grupo, idSelect, displayName, value) {
        UtilFn.buildComboSelect({
            url: BASE_URL_SERVICE_REST + "api/private/app/catalogo/" + grupo + "/listar",
            success: function(httpResponse) {
                var data = httpResponse.data;
                if (data) {
                    try {
                        $('#' + idSelect).material_select('destroy');
                    } catch (e) {}
                    $('#' + idSelect).find('option').remove();
                    var firstItem = '<option value="" ' + (value ? '' : 'selected') + '>Seleccione</option>';
                    $('#' + idSelect).append(firstItem);
                    $.each(data, function(i, item) {
                        $('#' + idSelect).append('<option ' + ((value && (item.id) == value) ? 'selected' : '') + ' value="' + item.id + '">' + (item[displayName || 'desNombre']) + '</option>');
                    });
                }
                $('#' + idSelect).material_select();
            }
        });
    }

    //Metodo que construye los catalogos para el formulario de mascota
    perfilUsuario.buildCatalogos = function() {
        //combo raza
        perfilUsuario.createComboCatalogo(3, 'razaMascota');
        //combo sexo
        perfilUsuario.createComboCatalogo(2, 'generoMascota', 'desAbreviacion');
        //combo tamaño
        perfilUsuario.createComboCatalogo(12, 'tamanioMascota');
        //combo color
        perfilUsuario.createComboCatalogo(11, 'colorMascota');
    }

    //Limpiar formulario de mascotas
    perfilUsuario.clearFormMascota = function() {
        perfilUsuario.buildCatalogos();
        $('#modalEditarMascota').find('input').val('');
        $('#modalEditarMascota').find('textarea').val('');
        $('#imageNewPet').attr('src', 'images/default-image.png');
        fotoPrincipal = null;
        perfilUsuario.mascotaSeleccionada = null;
        actualizarFoto = true;
        $('#mascotaNombre_').removeClass("active");
        $('#descripcionMascota_').removeClass("active");
        $('#btnGrabarMascota').html('Listo!');
    }

    //Carga formulario mascota
    perfilUsuario.loadFormMascota = function() {
        if (perfilUsuario.mascotaSeleccionada) {
            $('#btnGrabarMascota').html('Listo!');
            var mSel = perfilUsuario.mascotaSeleccionada;
            $('#imageNewPet').attr('src', BASE_URL_SERVER_WEB_IMAGES + mSel.fotoPrincipal.foto + "?timestamp=" + new Date().getTime());
            $('#mascotaNombre_').addClass("active");
            $('#descripcionMascota_').addClass("active");
            $('#mascotaNombre').val(mSel.nombre);
            perfilUsuario.createComboCatalogo(3, 'razaMascota', null, mSel.raza);
            perfilUsuario.createComboCatalogo(2, 'generoMascota', 'desAbreviacion', mSel.genero);
            perfilUsuario.createComboCatalogo(12, 'tamanioMascota', null, mSel.tamanio);
            perfilUsuario.createComboCatalogo(11, 'colorMascota', null, mSel.color);
            $('#descripcionMascota').val(mSel.desComentario);
            $('#idMascotaForm').val(mSel.id);
            actualizarFoto = false;
        }
    }

    //Metodo para actualizar perfil
    perfilUsuario.actualizarPerfil = function() {

        var isValid = UtilFn.validateForm(
            [{
                    id: 'dniPerfil',
                    messageErrorReq: 'Ingrese su Dni.'
                },
                {
                    id: 'nombresPerfil',
                    messageErrorReq: 'Ingrese su nombre completo.'
                },
                {
                    id: 'usuarioPerfil',
                    messageErrorReq: 'Ingrese su correo electrónico.'
                },
                {
                    id: 'telefonoPerfil',
                    messageErrorReq: 'Ingrese su teléfono.'
                },
                {
                    id: 'distritoPerfil',
                    messageErrorReq: 'Seleccione su distrito.'
                }
            ]
        );

        if (!isValid) {
            return;
        }

        var inputsInit = $('.inputPerfil');
        var dataForm = {};
        inputsInit.each(function() {
            if (this.name && this.value) {
                dataForm[this.name] = this.value;
            }
        });
        if ($('#chkRecibirAlertas').is(':checked')) {
            dataForm['indAlerta'] = ESTADO_ACTIVO;
        } else {
            dataForm['indAlerta'] = ESTADO_INACTIVO;
        }
        if ($('#chkUbicacion').is(':checked')) {
            dataForm['persona.ubicacionCatastro'] = UtilFn.getCordenadas().latitud + ' ' + UtilFn.getCordenadas().longitud;
        }
        dataForm.id = perfilUsuario.usuarioSesion.id;
        dataForm['persona.id'] = perfilUsuario.usuarioSesion.persona.id;
        dataForm.access_token = UtilFn.getToken();
        if (dataForm['usuario']) {
            dataForm['persona.emailPrincipal.email'] = dataForm['usuario'];
        }
        console.log('payload enviado para la actualizacion de perfil');
        console.log(JSON.stringify(dataForm));
        console.log('-----------------------------------------------');
        //show loading
        UtilFn.showMaskLoading();
        //send service actualizar perfil
        UtilFn.ajaxInvokeService({
            isRaiz: true,
            messageTimeOut: 'La sesion a caducado!',
            //config ajax setup
            config: {
                method: "POST",
                url: BASE_URL_SERVICE_REST + "api/private/app/usuario/update",
                data: dataForm
            }
            //success invoke
            ,
            success: function(httpResponse) {
                //show loading
                UtilFn.showMaskLoading('hide');
                var usuario = httpResponse.usuario;
                if (usuario) {
                    localStorage.setItem("usuario", JSON.stringify(usuario));
                    swal("Listo!", "Tu perfil ha sido actualizado.", "success");
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
    }
    //agregar Mascota a la lista
    perfilUsuario.addMascota = function(mascota, isUpdate) {
        var contentList = $('#mascotasList');
        console.log('perfilUsuario.addMascota.isUpdate->' + isUpdate);
        if (isUpdate && mascota.idContentLi) {
            $('#' + mascota.id + '_li_mascota').find('.f_m_nombre').html(mascota.nombre);
            $('#' + mascota.id + '_li_mascota').find('.f_m_foto').attr('src', BASE_URL_SERVER_WEB_IMAGES + mascota.fotoPrincipal.foto + "?timestamp=" + new Date().getTime());
            $('#' + mascota.id + '_li_mascota').find('.f_m_raza').html(mascota.desRaza);
            $('#' + mascota.id + '_li_mascota').find('.f_m_sexo').html(mascota.desGenero);
            $('#' + mascota.id + '_li_mascota').find('.f_m_tamanio').html(mascota.desTamanio?mascota.desTamanio:'');
            $('#' + mascota.id + '_li_mascota').find('.f_m_color').html(mascota.desColor);
            $('#' + mascota.id + '_li_mascota').find('.f_m_descripcion').html(mascota.desComentario);
        } else {
            var itemHtml = '<li id = "' + mascota.id + '_li_mascota" >' +
                '<div class="collapsible-header"><i class="material-icons">pets</i><span class="f_m_nombre">' + mascota.nombre + '</span></div>' +
                '<div  class="collapsible-body">' +
                '<div class="card">' +
                '<div class="card-image">' +
                '<img class="activator f_m_foto" src="' + BASE_URL_SERVER_WEB_IMAGES + mascota.fotoPrincipal.foto + '">' +
                '</div>' +
                '<div class="card-content" style="padding-bottom:40px !important;line-height:2.2em;">' +
                '<div  class="card-title center" style="border-bottom:1px #e0e0e0 solid;"><b style="text-transform: uppercase;font-size:25px;color:#000;" class="f_m_nombre">' + mascota.nombre + '</b></div>' +

                '<b>Raza: </b> <span class="f_m_raza">' + mascota.desRaza + '</span>' +
                '<br>' +
                '<b>Sexo: </b> <span class="f_m_sexo">' + mascota.desGenero + '</span>' +
                '<br>' +
                '<b>Tamaño: </b> <span class="f_m_tamanio">' + (mascota.desTamanio?mascota.desTamanio:'') + '</span>' +
                '<br>' +
                '<b>Color: </b> <span class="f_m_color">' + mascota.desColor + '</span>' +
                '<br>' +
                '<b>Descripción: </b> <span class="f_m_descripcion">' + mascota.desComentario + '</span>' +
                '<br>' +
                '<div class="card-action">' +
                '<a id="' + mascota.id + '_car_mascota" style="margin-bottom:15px" class="waves-effect waves-light btn indigo lighten-1 left">Editar</a>' +
                '<a id="' + mascota.id + '_delete_mascota" data-idmascota = "' + mascota.id + '"  style="margin-bottom:15px" class="waves-effect waves-light btn red lighten-1 right">Eliminar</a>' +
                '<a id="' + mascota.id + '_share_mascota" class="waves-effect waves-light btn total-width" data-idmascota="' + mascota.id + '" id="btnCompartir">COMPARTIR</a>'
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</li>';
            contentList.append(itemHtml);
        }
        $('#' + mascota.id + '_car_mascota').unbind("click");
        $('#' + mascota.id + '_car_mascota').click(function() {
            console.log('se selecciono a la mascota->' + mascota.nombre);
            mascota.idContentLi = mascota.id + '_li_mascota';
            perfilUsuario.mascotaSeleccionada = mascota;
            $('#modalEditarMascota').modal('open');
        });
        $('#' + mascota.id + '_share_mascota').unbind("click");
        $('#' + mascota.id + '_share_mascota').click(function() {
            console.log('se selecciono compartir mascota->' + mascota.id);
            UtilFn.compartirEnlace({
                img: BASE_URL_SERVER_WEB_IMAGES + mascota.fotoPrincipal.foto,
                mensaje: mascota.nombre.toUpperCase() + ' AHORA PERTENECE A LA COMUNIDAD MAS GRANDE DE AMANTES DE LOS PERROS',
                url: BASE_URL_WEB_PDP + 'posterRegistroMascota?id=' + mascota.id
            });
        });
        $('#' + mascota.id + '_delete_mascota').unbind("click");
        $('#' + mascota.id + '_delete_mascota').click(function() {
            console.log('se selecciono eliminar mascota->' + mascota.nombre);
            perfilUsuario.eliminarMascota($(this).data('idmascota'), mascota.id + '_li_mascota', mascota.nombre);
        });
    }

    //listar mascotas
    perfilUsuario.listarMascotas = function() {

        UtilFn.ajaxInvokeService({
            isRaiz: true,
            messageTimeOut: 'La sesion a caducado!',
            //config ajax setup
            config: {
                method: "GET",
                url: BASE_URL_SERVICE_REST + "api/private/app/mascota",
                data: {
                    access_token: UtilFn.getToken(),
                    personaId: perfilUsuario.usuarioSesion.persona.id
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
                    data.forEach(function(item, index) {
                        perfilUsuario.addMascota(item);
                    });


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

    }


    //grabar mascota
    perfilUsuario.saveMascota = function() {

        if (actualizarFoto) {
            if (!fotoPrincipal) {
                UtilFn.showMessageToast('Agregue una imagen para la mascota.', 4000);
                return;
            }
        }

        var isValid = UtilFn.validateForm(
            [{
                    id: 'mascotaNombre',
                    messageErrorReq: 'Ingreso el nombre de la mascota.'
                },
                {
                    id: 'razaMascota',
                    messageErrorReq: 'Seleccione la raza de la mascota.'
                },
                {
                    id: 'generoMascota',
                    messageErrorReq: 'Seleccione el sexo de la mascota.'
                },
                {
                    id: 'tamanioMascota',
                    messageErrorReq: 'Seleccione el tamaño de la mascota.'
                },

                {
                    id: 'colorMascota',
                    messageErrorReq: 'Seleccione el color de la mascota.'
                },
                {
                    id: 'descripcionMascota',
                    messageErrorReq: 'Ingrese una descripción sobre su mascota.'
                }
            ]
        );

        if (!isValid) {
            return;
        }

        var restServiceUpload = BASE_URL_SERVICE_REST + "app/f/mascota";

        var inputsMascota = $('.inputMascota');

        var params = new Object();

        inputsMascota.each(function() {
            if (this.name && this.value) {
                params[this.name] = $(this).val();
            }
        });

        params.access_token = UtilFn.getToken();

        params.personaId = perfilUsuario.usuarioSesion.persona.id;

        var isUpdate = ($('#idMascotaForm').val() && $('#idMascotaForm').val().length > 0);

        $('#btnGrabarMascota').addClass('disabled');

        if (actualizarFoto || fotoPrincipal) {

            var options = new FileUploadOptions();
            options.fileKey = "fileFoto";
            options.fileName = 'foto_principal.jpg';
            options.mimeType = "image/jpeg";
            options.params = params;
            options.chunkedMode = false;
            var ft = new FileTransfer();

            ft.upload(fotoPrincipal, encodeURI(restServiceUpload), function(result) {
                    console.log('envia con upload');
                    var response = JSON.parse(result.response);

                    console.log("response de mascota");
                    console.log(JSON.stringify(response));

                    if (response.success) {
                        if (perfilUsuario.mascotaSeleccionada) {
                            response.mascota.idContentLi = perfilUsuario.mascotaSeleccionada.idContentLi;
                        }
                        perfilUsuario.addMascota(response.mascota, isUpdate);
                        $('#modalEditarMascota').modal('close');

                        //swal("Listo!", (isUpdate ? "Se editaron los datos de " + response.mascota.nombre + "." : response.mascota.nombre + " se agregó a tu lista de mascotas."), "success");

                        swal({

                                title: '<span style="color:#60116A;">Listo!</span>',
                                text: (isUpdate ? "Se editaron los datos de " + response.mascota.nombre + "." : response.mascota.nombre + " AHORA PERTENECE A LA COMUNIDAD MAS GRANDE DE AMANTES DE LOS PERROS."),
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

                                    swal.close();
                                } else {
                                    UtilFn.compartirEnlace({
                                        img: BASE_URL_SERVER_WEB_IMAGES + response.mascota.fotoPrincipal.foto,
                                        mensaje: response.mascota.nombre.toUpperCase() + ', AHORA PERTENECE A LA COMUNIDAD MAS GRANDE DE AMANTES DE LOS PERROS'
                                            //mensaje:'Se perdio, '++''+$("#razaMascota").find('option:selected').text()
                                            //,url : BASE_URL_SERVER_WEB_IMAGES+'mostrarPosterBusqueda?id='+detalle.id
                                            ,
                                        url: BASE_URL_WEB_PDP + 'posterRegistroMascota?id=' + response.mascota.id
                                    });
                                }
                            }
                        );

                    } else {
                        UtilFn.showMessageToast("Ha ocurrido un error al registrar a la mascota.");
                    }

                    $('#btnGrabarMascota').removeClass('disabled');

                }, function(error) {
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
                        if (perfilUsuario.mascotaSeleccionada) {
                            response.mascota.idContentLi = perfilUsuario.mascotaSeleccionada.idContentLi;
                        }
                        perfilUsuario.addMascota(response.mascota, isUpdate);
                        $('#modalEditarMascota').modal('close');
                        //  swal("Listo!", (isUpdate ? "Se editaron los datos de " + response.mascota.nombre + "." : response.mascota.nombre + " se agregó a tu lista de mascotas."), "success");
                        swal({

                                title: '<span style="color:#60116A;">Listo!</span>',
                                text: (isUpdate ? "Se editaron los datos de " + response.mascota.nombre + "." : response.mascota.nombre + " AHORA PERTENECE A LA COMUNIDAD MAS GRANDE DE AMANTES DE LOS PERROS."),
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

                                    swal.close();
                                } else {
                                    UtilFn.compartirEnlace({
                                        img: BASE_URL_SERVER_WEB_IMAGES + response.mascota.fotoPrincipal.foto,
                                        mensaje: response.mascota.nombre.toUpperCase() + ', AHORA PERTENECE A LA COMUNIDAD MAS GRANDE DE AMANTES DE LOS PERROS'
                                            //mensaje:'Se perdio, '++''+$("#razaMascota").find('option:selected').text()
                                            //,url : BASE_URL_SERVER_WEB_IMAGES+'mostrarPosterBusqueda?id='+detalle.id
                                            ,
                                        url: BASE_URL_WEB_PDP + 'posterRegistroMascota?id=' + response.mascota.id
                                    });
                                }
                            }
                        );
                    } else {
                        UtilFn.showMessageToast("Ha ocurrido un error al registrar a la mascota.");
                    }

                    $('#btnGrabarMascota').removeClass('disabled');

                },
                error: function(jqXHR) {
                    UtilFn.showMessageToast('Ups! ha ocurrido un error!', 4000);
                    console.log('error-----------------------------------------');
                    console.log(JSON.stringify(jqXHR));
                    console.log('-----------------------------------------------');
                }
            });
        }
    }

    //Metodo para eliminar mascota
    perfilUsuario.eliminarMascota = function(idMascota, idContent, nombreMascota) {
        console.log('a eliminar idMascota->' + idMascota);
        console.log('a eliminar del content id->' + idContent);

        swal({
                title: "Confirma la acción",
                text: "Vas a quitar de tu lista de mascotas a " + nombreMascota + " ¿Estás seguro?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {

                    //send eliminar mascota
                    UtilFn.ajaxInvokeService({
                        isRaiz: true,
                        messageTimeOut: 'La sesion a caducado!',
                        //config ajax setup
                        config: {
                            method: "POST",
                            async: false,
                            url: BASE_URL_SERVICE_REST + "api/private/app/mascota/delete/" + idMascota,
                            data: {
                                access_token: UtilFn.getToken()
                            }
                        }
                        //success invoke
                        ,
                        success: function(httpResponse) {
                            //show loading
                            if (httpResponse.success) {

                                $('#' + idContent).remove();
                                swal("Listo!", "La mascota se removió de la lista de mascotas.", "success");

                            } else {
                                swal("Error!", "La mascota no pudo ser removida de la lista de mascotas.", "error");
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

                } else {
                    swal.close();
                }
            });

    }

    //:::::::::::::::::INICIAR:::::::::::::::::::::
    perfilUsuario.init();
    //:::::::::::::::::::::::::::::::::::::::::::::
})();
