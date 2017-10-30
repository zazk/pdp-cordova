var PROCESO_VIGENCIA = true;
(function(){
      UtilFn.getView('views/generic/menu_principal.html',null,function(html){
        $("#container_menu_principal").html(html)
        $(".button-collapse").sideNav({
                                     closeOnClick: true,
                                     draggable:true,
                                     menuWidth: 300
        });

        $('.linkLogoutPrincipal').click(function(){
          localStorage.removeItem('access-token');
          localStorage.removeItem('usuario');
          window.location = "index.html";
        });


        var botonActivoMenuFoot = window.BOTON_SELECTED;
        if(botonActivoMenuFoot == '0'){
            $('#foot_btn_incio').attr('src','images/inicio_active.png');
        }else if(botonActivoMenuFoot == '1'){
            $('#foot_btn_busca').attr('src','images/busca_active.png');
        }else if(botonActivoMenuFoot == '2'){
            $('#foot_btn_encuentra').attr('src','images/encuentra_active.png');
        }else if(botonActivoMenuFoot == '3'){
            $('#foot_btn_servicio').attr('src','images/servicio_active.png');
        }

        $('#content-botones-foot').show();


        var user = UtilFn.getLoginUser();

        if(!user.persona && !user.persona.distrito){
                UtilFn.buildModalDataImportant();
                $('#modalInformacionImportante').modal({dismissible:false});
                UtilFn.buildComboDistritos('distritoInformacionPendiente',null,null,true);
                setTimeout(function(){
                  $('#modalInformacionImportante').modal('open');
                },100);
        }

      });

      UtilFn.getView('views/generic/notificacion_vigencia.html',null,function(html){
        $("body").append(html);
        $('#modalVigencia').modal({
           dismissible: false,
           complete: function() {  PROCESO_VIGENCIA = true; }
        });

        function vigencia(item,tipo,estado){
          $('.btnsVigencia').addClass('disabled');
          $.ajax({
            url: BASE_URL_SERVICE_REST+'api/public/app/vigencia',
            method: "POST",
            data:{
                  tipo : tipo,
                  id : item.id,
                  estado : estado
            },
            success:function(){
              $('.btnsVigencia').removeClass('disabled');
              $('#modalVigencia').modal('close');
            }
            ,
            error:function(){
              $('.btnsVigencia').removeClass('disabled');
              $('#modalVigencia').modal('close');
            }
          });
        }

        function jobVerificacionVigencia(){
          PROCESO_VIGENCIA = false;
          UtilFn.ajaxInvokeService({
              isRaiz: true,
              messageTimeOut: 'La sesion a caducado!',
              //config ajax setup
              config: {
                  method: "GET",
                  url: BASE_URL_SERVICE_REST + "api/public/app/vigencia/4"//+ UtilFn.getLoginUser().id
              }
              //success invoke
              ,
              success: function(httpResponse) {

                  var data = httpResponse.data;
                  if(data){
                    $('#imgVigencia').attr('src',BASE_URL_SERVER_WEB_IMAGES+data.item.fotoBusqueda.foto);
                    $('#vigenciaNombrePerro').html('<br>'+data.item.nombre);
                    $('#textoVigencia').append('<b>Descripción</b><br>');
                    $('#textoVigencia').append(data.item.desComentario+'<br>');
                    $('#textoVigencia').append('Tu publicacion la hiciste el '+moment(new Date(data.fecha_publicacion)).format('DD/MM/YYYY hh:mm A'));
                    $('#textoVigencia').append('<br><b>¿Deseas que continue su vigencia?</b>');

                    $("#btndescartarVigencia").unbind( "click" );
                    $("#btndescartarVigencia").click(function(){
                      console.log('descartar->data.item->'+data.item.id);
                      vigencia(data.item , data.tipo , 2);
                    });

                    $("#btnContinuarVigencia").unbind( "click" );
                    $("#btnContinuarVigencia").click(function(){
                      console.log('continuar->data.item->'+data.item.id);
                      vigencia(data.item , data.tipo , 1);
                    });

                    $('#modalVigencia').modal('open');
                  }
                  // console.log('VIGENCIA SUCCESS-----------------------------------------');
                  // console.log(JSON.stringify(data));
                  // console.log('---------------------------------------------------------');

              },
              error: function(jqXHR) {

                  console.log('VIGENCIA ERROR-----------------------------------------');
                  console.log(JSON.stringify(jqXHR));
                  console.log('-------------------------------------------------------');
              }
          });
        }
        jobVerificacionVigencia();
        setInterval(function(){
              if(PROCESO_VIGENCIA){
                  jobVerificacionVigencia();
              }
          },
          30*(60)*(1000) // 30 minutos
         );
      });

      UtilFn.getView('views/generic/pre-loading.html',null,function(html){
        $("#container_pre_loading").html(html)
        if(window.SHOW_PRE_LOADING){
          UtilFn.showMaskLoading();
        }

        if(window.SLEEP_LOADING){
          setTimeout(function(){UtilFn.showMaskLoading('hide');},window.SLEEP_LOADING);
        }

      });


      function countNotifiacionesView(){
        UtilFn.refreshCountNotificaciones();
      }

        countNotifiacionesView();
        setInterval(function(){
            countNotifiacionesView();
         }, (4)*(60)*(1000));









})();
