document.addEventListener("backbutton", function() {




}, false);
(function() {

    var Contacto = this;

    //Obtencion del Usuario Logeado
    var usuarioSesion = UtilFn.getLoginUser();

    Contacto.init = function() {
        Contacto.loadData();
        $('#btnEnviar').click(Contacto.enviar);
    }

    Contacto.loadData = function() {
        $('#nombreCompleto').val(usuarioSesion.persona.nombreCompleto);
        $('#email').val(usuarioSesion.usuario);
    }

    Contacto.enviar = function(t) {

        var itemsvalidators = [];

        itemsvalidators.push({
            id: 'email',
            messageErrorReq: 'Ingrese su correo electrónico.',
            messageErrorEmail: 'Ingrese un correo válido.',
            type: 'email'
        });

        itemsvalidators.push({
            id: 'comentario',
            messageErrorReq: 'Ingrese un comentario.'
        });

        var isValid = UtilFn.validateForm(itemsvalidators);

        if (!isValid) {
            return;
        }



        swal({
                title: "Confirma la acción",
                text: "¿Seguro de enviar el comentario?",
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

                    var url = BASE_URL_SERVICE_REST + "api/private/app/notificacion";

                    var inputsInit = $('.inputContacto');
                    var params = {};
                    inputsInit.each(function() {
                        if (this.name && this.value) {
                            params[this.name] = this.value;
                        }
                    });

                    params.tipoNotificacion = 33;
                    params.usuarioEmisorId = usuarioSesion.id;
                    params.usuarioRegistro = usuarioSesion.usuario;
                    params.rolId = 1;
                    params.tipoMedio = 14;
                    params.access_token = UtilFn.getToken();

                    console.log('payload enviado para contacto');
                    console.log(JSON.stringify(params));
                    console.log('-----------------------------------------------');

                    $('#btnEnviar').addClass('disabled');

                    UtilFn.showMaskLoading();

                    UtilFn.ajaxInvokeService({
                        isRaiz: true,
                        messageTimeOut: 'La sesion a caducado!',
                        //config ajax setup
                        config: {
                            method: "POST",
                            url: url,
                            data: params
                        }
                        //success invoke
                        ,
                        success: function(httpResponse) {

                            var response = httpResponse;

                            console.log("response de contacto");
                            console.log(JSON.stringify(response));

                            if (response.success) {
                                $('#nombreCompleto').val('');
                                $('#email').val('');
                                $('#comentario').val('');
                                swal("Listo!", 'Tu comentario se envio con exito.', "success");
                            } else {
                                swal.close();
                                UtilFn.showMessageToast("Ha ocurrido un error al intentar enviar el registro.");
                            }

                            $('#btnEnviar').removeClass('disabled');
                            UtilFn.showMaskLoading('hide');

                        },
                        error: function(jqXHR) {
                            UtilFn.showMessageToast('Ups! ha ocurrido un error!', 4000);
                            $('#btnEnviar').removeClass('disabled');
                            UtilFn.showMaskLoading('hide');
                            console.log('error-----------------------------------------');
                            console.log(JSON.stringify(jqXHR));
                            console.log('-----------------------------------------------');

                        }
                    });

                } else {
                    $('#btnEnviar').removeClass('disabled');
                    swal.close();
                }
            });


    }

    Contacto.init();


})();
