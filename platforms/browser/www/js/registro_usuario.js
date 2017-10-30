(function(){

  var me = this;

  me.access_token = null;

  me.init = function(){
    $('#modalTerminos').modal();
    $('#leerTerminos').click(function(){
      $('#modalTerminos').modal('open');
    });

      //loading
      $(".loader").show();
      $(".back-loader").show();

      //get access_token
      eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('$.y({j:\'v\',u:s+\'r/i\',6:{p:"o",n:"m"}}).l(0(a){k(!a.q){2.h("g. f c b 1 8.",7,\'\',0(){5.4(\'../3\')})}t{$(".e").d();$(".w-e").d();x.9=a.6.9}}).1(0(){2.h("g. f c b 1 8.",7,\'\',0(){5.4(\'../3\')})});',35,35,'function|error|Materialize|index|redirect|UtilFn|data|5000|inesperado|access_token||un|ocurrido|hide|loader|Ha|Ups|toast|token|method|if|done|153952ff0ed1fdd851a22c9277af8dd5|password|pdp_movil_user|usuario|success|oauth2|BASE_URL_SERVICE_REST|else|url|POST|back|me|ajax'.split('|'),0,{}))

      //Listeners click event registro
      $('#registrar').click(me.registrar);

      var jsonDistritos = {"data":[{"nombre":" Ancón","indDistrito":"02","id":1409,"catastro":"-11.733333 -77.15","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Ate","indDistrito":"03","id":1410,"catastro":"-12.010278 -76.87","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Barranco","indDistrito":"04","id":1411,"catastro":"-12.141667 -77.016667","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Breña","indDistrito":"05","id":1412,"catastro":"-12.070278 -77.0625","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Carabayllo","indDistrito":"06","id":1413,"catastro":"-11.85 -77.033333","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Chaclacayo","indDistrito":"07","id":1414,"catastro":"-11.983333 -76.766667","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Chorrillos","indDistrito":"08","id":1415,"catastro":"-12.186389 -77.021111","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Cieneguilla","indDistrito":"09","id":1416,"catastro":"-12.091667 -76.775","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Comas","indDistrito":"10","id":1417,"catastro":"-11.933333 -77.066667","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" El Agustino","indDistrito":"11","id":1418,"catastro":"-12.066667 -77.016667","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Independencia","indDistrito":"12","id":1419,"catastro":"-11.991667 -77.05","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Jesús María","indDistrito":"13","id":1420,"catastro":"-12.078333 -77.048056","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" La Molina","indDistrito":"14","id":1421,"catastro":"-12.077778 -76.911111","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" La Victoria","indDistrito":"15","id":1422,"catastro":"-12.065 -76.031111","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Lima","indDistrito":"01","id":1408,"catastro":"-12.043333 -77.028333","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Lince","indDistrito":"16","id":1423,"catastro":"-12.1 -77.05","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Los Olivos","indDistrito":"17","id":1424,"catastro":"-11.970278 -77.073889","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Lurigancho","indDistrito":"18","id":1425,"catastro":"-12.033333 -77.016667","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Lurin","indDistrito":"19","id":1426,"catastro":"-12.279167 -76.875","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Magdalena del Mar","indDistrito":"20","id":1427,"catastro":"-12.1 -77.083333","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Miraflores","indDistrito":"22","id":1429,"catastro":"-12.1175 -77.043056","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Pachacamac","indDistrito":"23","id":1430,"catastro":"-12.23 -76.859167","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Pucusana","indDistrito":"24","id":1431,"catastro":"-12.416667 -76.783333","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Pueblo Libre","indDistrito":"21","id":1428,"catastro":"-12.070278 -77.0625","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Puente Piedra","indDistrito":"25","id":1432,"catastro":"-11.875 -77.065278","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Punta Hermosa","indDistrito":"26","id":1433,"catastro":"-12.333333 -76.816667","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Punta Negra","indDistrito":"27","id":1434,"catastro":"-12.368056 -76.797222","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Rímac","indDistrito":"28","id":1435,"catastro":"-12.035278 -77.027222","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" San Bartolo","indDistrito":"29","id":1436,"catastro":"-12.416667 -76.783333","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" San Borja","indDistrito":"30","id":1437,"catastro":"-12.1 -77.016667","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" San Isidro","indDistrito":"31","id":1438,"catastro":"-12.099167 -77.034722","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" San Juan de Lurigancho","indDistrito":"32","id":1439,"catastro":"-12.033333 -77.016667","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" San Juan de Miraflores","indDistrito":"33","id":1440,"catastro":"-12.151444 -76.970042","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" San Luis","indDistrito":"34","id":1441,"catastro":"-12.075556 -76.996111","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" San Martín de Porres","indDistrito":"35","id":1442,"catastro":"-11.993889 -77.095833","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" San Miguel","indDistrito":"36","id":1443,"catastro":"-12.077222 -77.092778","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Santa Anita","indDistrito":"37","id":1444,"catastro":"-12.043056 -76.958333","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Santa María del Mar","indDistrito":"38","id":1445,"catastro":"-12.416667 -76.783333","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Santa Rosa","indDistrito":"39","id":1446,"catastro":"-11.806389 -77.165556","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Santiago de Surco","indDistrito":"40","id":1447,"catastro":"-12.15 -77.016667","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Surquillo","indDistrito":"41","id":1448,"catastro":"-12.117222 -77.020556","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Villa El Salvador","indDistrito":"42","id":1449,"catastro":"-12.2130782 -76.9372451","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Villa María del Triunfo","indDistrito":"43","id":1450,"catastro":"-12.156944 -76.931389","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"15","indProvincia":"01"},{"nombre":" Bellavista","indDistrito":"02","id":760,"estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"07","indProvincia":"01"},{"nombre":" Callao","indDistrito":"01","id":759,"estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"07","indProvincia":"01"},{"nombre":" Carmen de la Legua Reynoso","indDistrito":"03","id":761,"catastro":"-12.0417 -77.096","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"07","indProvincia":"01"},{"nombre":" La Perla","indDistrito":"04","id":762,"catastro":"-12.0737 -77.1184","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"07","indProvincia":"01"},{"nombre":" La Punta","indDistrito":"05","id":763,"catastro":"-12.0714 -77.1625","estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"07","indProvincia":"01"},{"nombre":" Mi Perú","indDistrito":"07","id":765,"estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"07","indProvincia":"01"},{"nombre":" Ventanilla","indDistrito":"06","id":764,"estado":1,"indPais":24,"gentilicio":" ","indDepartamento":"07","indProvincia":"01"}]};

var firstItem = '<option value=""  selected>Seleccione el distrito</option>';
            $('#distrito').append(firstItem);
            $.each(jsonDistritos.data, function(i, item) {
                $('#distrito').append('<option value="' + item.id + '">' + item.nombre + '</option>');
            });
            $('#distrito').material_select();

      // UtilFn.buildComboSelect({
      //     url: BASE_URL_SERVICE_REST + "api/public/app/direccion/24/15/01/distritos",
      //     params:{access_token:me.access_token},
      //     success: function(httpResponse) {
      //         var data = httpResponse.data;
      //         if (data) {
      //             var firstItem = '<option value=""  selected>Seleccione el distrito</option>';
      //             $('#distrito').append(firstItem);
      //             $.each(data, function(i, item) {
      //                 $('#distrito').append('<option value="' + item.id + '">' + item.nombre + '</option>');
      //             });
      //             $('#distrito').material_select();
      //         }
      //
      //     }
      //
      // });


  }

  //Metodo JS para registrar Usuario App
  me.registrar = function(){

    console.log(me.access_token);
		/*
		 if($("#dni").val()+""==""){
			 UtilFn.showMessageToast("Ingrese su nro de documento.");
			 $("#dni").focus();
		 }else 
		 */
		 if($("#nombres").val()+""==""){
			 UtilFn.showMessageToast("Ingrese sus nombres.");
			 $("#nombres").focus();
		 }else if($("#email").val()+""==""){
			 UtilFn.showMessageToast("Ingrese su email.");
			 $("#email").focus();
		 }else if($("#password").val()+""==""){
			 UtilFn.showMessageToast("Ingrese su contraseña.");
			 $("#password").focus();
		 }else if($("#repassword").val()+""==""){
			 UtilFn.showMessageToast("Ingrese nuevamente su contraseña.");
			 $("#repassword").focus();
		 }else if($("#telefono").val()+""==""){
			 UtilFn.showMessageToast("Ingrese su teléfono.");
			 $("#telefono").focus();
		 }else if($("#pais").val()+""==""){
			 UtilFn.showMessageToast("Seleccione su país.");
			 $("#pais").focus();
		 }else if($("#distrito").val()+""==""){
			 UtilFn.showMessageToast("Seleccione su distrito.");
			 $("#distrito").focus();
		 }else{

       if($("#email").val().length > 0){
         var filterEmail=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
         if (!filterEmail.test($("#email").val())){
           UtilFn.showMessageToast("Email invalido.");
           $("#email").focus();
           return;
         }
       }

       if($("#password").val() != $("#repassword").val()){
            UtilFn.showMessageToast("las contraseñas no coinciden.");
       }

			UtilFn.ajaxInvokeService(
			{
				config : {
					method: "POST",
					url: BASE_URL_SERVICE_REST+'api/private/app/usuario',
					data: {
						   "access_token":me.access_token,
						   "usuario": $("#email").val(),
						   "pass": $("#password").val(),
						   'persona.tipoDocumento':1,
						   'persona.nroDocumento' : $("#dni").val(),
						   'persona.nombreCompleto' : $("#nombres").val(),
						   'persona.estado' : 1,
						   'persona.tipoPersona' : 18,
						   'persona.contactoPrincipal.tipoTelefono' : 17,
						   'persona.contactoPrincipal.numero' : $("#telefono").val(),
							'persona.contactoPrincipal.estado' : 1,
							'persona.emailPrincipal.email' : $("#email").val(),
						   'persona.emailPrincipal.indPrincipal' : 1,
							'persona.emailPrincipal.estado' : 1,
              'indAlerta': ($('#chkRecibirAlertas').is(':checked')?'1':'2')

						},
					dataType: 'json'
				}
				,success : function(response){

					console.log("response");
					console.log(response);

					if(response.usuario && response.usuario.id){
						response.usuario.accessToken = me.access_token;
						UtilFn.setLoginUser(response.usuario);
						UtilFn.redirect("../main");
					}else{
						UtilFn.showMessageToast("Upps!, se genero un error inesperado." );
					}
				}
			}
			);

		 }

  }

  //Initialize
  me.init();

})();
