document.addEventListener("backbutton", function(){

    $('#filtro').hide();
    $('#detalle').hide();
    $('#main_body').show();
    
}, false);
(function() {

    var me = this;

    me.init = function() {
        // console.log('access_token->' + UtilFn.getToken());
        // console.log('------------------Usuario Sesion---------------------');
        // console.log(JSON.stringify(UtilFn.getLoginUser()));
        // console.log('-----------------------------------------------------');
        me.listarAnuncios();
        //Ditritos
        UtilFn.buildComboDistritos('distritoCb',null,'TODOS');

        $('#filtroPublicacion').click(function(){
          $('#main_body').hide();
          $('#detalle').hide();
          $('#filtro').show();
        });

        $('.regresar_busco').click(function(){
          $('#filtro').hide();
          $('#detalle').hide();
          $('#main_body').show();
        });

        $('.limpiarFiltro').click(function(){
           me.clear();
        });

        $('.aplicarFiltro').click(function(){
           me.aplicarFiltro();
        });

    }

    me.aplicarFiltro = function(){

      var inputFiltro = $('#filtro').find('.inputFiltro');

      var params = new Object();

      inputFiltro.each(function() {
          if (this.name && this.value) {
              params[this.name] = $(this).val();
          }
      });

      console.log('filtros-----------------------------------------');
      console.log(JSON.stringify(params));
      console.log('-----------------------------------------------');

        UtilFn.showMaskLoading();
        me.listarAnuncios(params);

        $('#filtro').hide();
        $('#main_body').show();

    }

    me.clear = function(){
        UtilFn.buildComboDistritos('distritoCb',null,'TODOS');
        $('#asunto').val('');
        UtilFn.showMaskLoading();
        me.listarAnuncios();
        $('#filtro').hide();
        $('#main_body').show();
    }

    me.listarAnuncios = function(params) {

        params = params || {};
        params.access_token = UtilFn.getToken();

        UtilFn.ajaxInvokeService({
                isRaiz: true,
                messageTimeOut: 'La sesion a caducado!',
                //config ajax setup
                config: {
                    method: "GET",
                    url: BASE_URL_SERVICE_REST + "api/private/app/anuncio",
                    data: params
                }
                //success invoke
                ,
                success: function(httpResponse) {

                    $(".loader").hide();
                    $(".back-loader").hide();

                    console.log('httpResponse-----------------------------------------');
                    console.log(JSON.stringify(httpResponse));
                    console.log('-----------------------------------------------------');

                    var html = '<ul class="collection" style="margin-bottom:50px">';

                    if (httpResponse.data.length > 0) {

                          $.each(httpResponse.data, function(k, v) {

                            html += '<li data-foto="'+BASE_URL_SERVER_WEB_IMAGES+v.foto+'" data-titulo="'+v.titulo+'" data-descripcion="'+v.descripcion+'"  class="collection-item avatar waves-effect waves-light verDetalleAnuncio">';

                            if(v.foto){
                              html += ' <img src="'+ (v.foto ? BASE_URL_SERVER_WEB_IMAGES+v.foto : 'images/pets_default.png' )+'" style="margin-top:10px;border-radius: 0px !important;" alt="" class="circle z-depth-1"> ';
                            }else{
                                html += '<i class="material-icons red">play_arrow</i>';
                            }

                            html += '<span class="title" style="color:#60116A;" >' + v.titulo + '</span>';
                            html += '<p >' + (v.descripcion.length > 75?v.descripcion.substr(0, 75)+'...':v.descripcion) + '</p>';
                            // html += '<a href="#!" class="secondary-content"><i class="material-icons">play_arrow</i></a>';
                            html += '</li>';

                        });

                    } else {
                        html += '<li class="collection-item center">';
                        html += '<p>Sin anuncios para mostrar.</p>';
                        html += '</li>';
                    }

                    html += '</ul>';
                    $("#content-main").empty();
                    $("#content-main").html(html);

                    $('.verDetalleAnuncio').click(function(){

                      $('#imgDetallePrincipal').attr('src',$(this).data('foto'));
                      $('#detalleTitulo').html($(this).data('titulo'));
                      $('#decripcionDetalle').html($(this).data('descripcion'));
                      $('#filtro').hide();
                      $('#main_body').hide();
                      $('#detalle').show();

                    });

                    UtilFn.showMaskLoading('hide');

                }
            }

        );
    }

    me.init();

})();
