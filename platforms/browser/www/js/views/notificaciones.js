document.addEventListener("backbutton", function() {

    $('#modalNotificacion').modal('close');


}, false);
(function() {

    var notifiacionService = this;

    notifiacionService.init = function() {
        $('#modalNotificacion').modal();
        notifiacionService.listarNotifiaciones();
    }

    notifiacionService.listarNotifiaciones = function(params) {
        console.log('entro listarNotifiaciones()');
        params = params || {};
        params.access_token = UtilFn.getToken();
        params['usuario.rol.nombre'] = 'USUARIO_MOBIL';
        params['usuario.id'] = UtilFn.getLoginUser().id,
            // UtilFn.showMaskLoading();
            UtilFn.ajaxInvokeService({
                    isRaiz: true,
                    messageTimeOut: 'La sesion a caducado!',
                    //config ajax setup
                    config: {
                        method: "GET",
                        url: BASE_URL_SERVICE_REST + "api/private/app/notificacion/bandeja",
                        data: params
                    }
                    //success invoke
                    ,
                    success: function(httpResponse) {

                        console.log('httpResponse-----------------------------------------');
                        console.log(JSON.stringify(httpResponse));
                        console.log('-----------------------------------------------------');

                        var html = '<ul class="collection" style="margin-bottom:30px">';

                        if (httpResponse.data.length > 0) {

                            $.each(httpResponse.data, function(k, v) {

                                html += '<li data-codigo="' + v.id + '" data-leido = "' + v.indLeido + '" data-titulo="' + v.desTipoNotificacion + '" data-descripcion="' + v.descripcion + '"  class="collection-item avatar waves-effect waves-light verDetalleAnuncio">';
                                html += '<i id="icono_' + v.id + '" class="material-icons ' + (v.indLeido == 1 ? 'grey darken-1' : 'grey darken-4') + ' circle">' + (v.indLeido == 1 ? 'notifications_none' : 'notifications_active') + '</i>';
                                html += '<span class="title" id="titulo_' + v.id + '"  >' + (v.indLeido == 1 ? v.desTipoNotificacion : '<b>' + v.desTipoNotificacion + '</b>') + '</span>';
                                html += '<p >' + (v.descripcion.length > 75 ? v.descripcion.substr(0, 75) + '...' : v.descripcion) + '</p>';
                                html += '</li>';

                            });

                        } else {
                            html += '<li class="collection-item center">';
                            html += '<p>Sin Notifiaciones para mostrar.</p>';
                            html += '</li>';
                        }

                        html += '</ul>';
                        $("#content-main").empty();
                        $("#content-main").html(html);

                        $('.verDetalleAnuncio').click(function() {
                            notifiacionService.checkNotificacion(this);
                        });

                        UtilFn.showMaskLoading('hide');

                    }
                }

            );
    }

    notifiacionService.checkNotificacion = function(ev) {

        console.log('codigo->' + $(ev).data('codigo'));
        console.log('leido->' + $(ev).data('leido'));

        if ($(ev).data('leido') != '1') {
            var params = {};

            params.access_token = UtilFn.getToken();
            UtilFn.showMaskLoading();
            UtilFn.ajaxInvokeService({
                    isRaiz: true,
                    messageTimeOut: 'La sesion a caducado!',
                    //config ajax setup
                    config: {
                        method: "GET",
                        url: BASE_URL_SERVICE_REST + "api/private/app/notificacion/check/" + $(ev).data('codigo'),
                        data: params
                    }
                    //success invoke
                    ,
                    success: function(httpResponse) {

                        console.log('checkresponse-----------------------------------------');
                        console.log(JSON.stringify(httpResponse));
                        console.log('-----------------------------------------------------');

                        $('#icono_' + $(ev).data('codigo')).removeClass('grey darken-4');
                        $('#icono_' + $(ev).data('codigo')).addClass('grey darken-1');
                        $('#icono_' + $(ev).data('codigo')).html('notifications_none');
                        $('#titulo_' + $(ev).data('codigo')).html($(ev).data('titulo'));
                        $(ev).data('leido', '1')

                        $('#tituloNotificacion').html($(ev).data('titulo'));
                        $('#descripcionNotificacion').html($(ev).data('descripcion'));

                        $('#modalNotificacion').modal('open');
                        UtilFn.refreshCountNotificaciones();
                        UtilFn.showMaskLoading('hide');

                    }
                }

            );

        } else {
            $('#tituloNotificacion').html($(ev).data('titulo'));
            $('#descripcionNotificacion').html($(ev).data('descripcion'));

            $('#modalNotificacion').modal('open');
        }



    }

    notifiacionService.init();

})();
