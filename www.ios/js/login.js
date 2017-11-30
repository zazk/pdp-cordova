$(document).ready(function(){

	$("select").material_select();
	$('#usuario').blur(function(){
		$(this).val(($(this).val()?$(this).val().trim():''));
	});

	$('#modalTerminos').modal();

});


var urlBase = "http://192.157.30.72/pdp-rest/";

var appLogin = {

loginGoogle : function(){

	function login(){
			window.plugins.googleplus.login(
		    {


		      //'scopes': 'email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
		    //  'webClientId': 'client id of the web app/server side', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
		      //'offline': true, // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
		    },
		    function (result) {
					console.log('Google Result-------------------------------------');
					console.log(JSON.stringify(result));
					appLogin.validateRS(result,'go');
		    },
		    function (msg) {
					console.log('Google Result Error-------------------------------------');
					console.log(JSON.stringify(msg));
					//alert(msg);
		    }
		);
	}

	window.plugins.googleplus.trySilentLogin(
    {

    },
    function (obj) {
			window.plugins.googleplus.logout(
					function (msg) {
						console.log("sesion cerrada->"+msg);
						login();
					}
			);
    },
    function (msg) {
			console.log("trySilentLogin error->"+msg);
      login();
    }
);


},

	testShared : function(){
			//window.plugins.socialsharing.shareViaFacebook('Message via Facebook', null /* img */, 'www.google.com' /* url */, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})

			//window.plugins.socialsharing.share('Message only');
			//window.plugins.socialsharing.share(null, null, '', 'http://138.197.88.11:8080/pdp/mostrarPosterBusqueda?id=34')
			//window.plugins.socialsharing.share('Nombre Mascota, me perdi!', null, 'https://www.google.nl/images/srpr/logo4w.png', 'http://138.197.88.11:8080/pdp/mostrarPosterBusqueda?id=34');
	}
	,
	validateRS : function(data,tipo){

		var dataFb;
		var dataGo;
		var idRs;
		var emailRs= '';
		if(tipo == 'fb'){
				dataFb = data;
				idRs = dataFb.userID;
				//emailRs = dataFb.email;
		}else if(tipo == 'go'){
				dataGo = data;
				idRs = dataGo.userId;
				emailRs = dataGo.email
		}else{
			  return;
		}

		//return;
		console.log('verrrr idRs->'+idRs);
		UtilFn.showMaskLoading();

		$.ajax({
			method: "GET",
			url: BASE_URL_SERVICE_REST + "api/public/app/usuario/rs/"+idRs,
			dataType:'json',
			data:{
				tipoRs	: tipo,
				emailRs	: emailRs
			}
		}).done(function(response) {

			UtilFn.showMaskLoading('hide');

			 if(response.usuario){
						UtilFn.showMessageToast("Ingresando...");
					  UtilFn.setLoginUser(response.usuario);
						setTimeout(function(){
							window.location = "main.html";
						}, 1000);
				}else{

					$('#modalTerminos').modal('open');
					$('#btnAceptarTerminos').unbind('click');
					$('#btnAceptarTerminos').click(function(){

						if(tipo == 'fb'){
							$.ajax({
								method: "GET",
								url: 'https://graph.facebook.com/v2.9/me?access_token='+dataFb.accessToken+'&fields=id,name,email&format=json',
								dataType:'json'
							}).done(function(responseFb) {
								UtilFn.showMaskLoading('hide');
								console.log('paso 2 FB-------------------------------------');
								console.log(JSON.stringify(responseFb));
								console.log('-----------------------------------------------');

								var dataUsuarioFb = {
										 "usuario": responseFb.email,
										 "pass": (new Date()).getTime(),
										 'persona.tipoDocumento':1,
										 'persona.nroDocumento' : '',
										 'persona.nombreCompleto' : responseFb.name,
										 'persona.estado' : 1,
										 'persona.tipoPersona' : 18,
										 'persona.contactoPrincipal.tipoTelefono' : 17,
										 'persona.contactoPrincipal.numero' : '',
										'persona.contactoPrincipal.estado' : 1,
										'persona.emailPrincipal.email' : responseFb.email,
										 'persona.emailPrincipal.indPrincipal' : 1,
										'persona.emailPrincipal.estado' : 1,
										'indAlerta': '1',
										'idUsuarioFb': responseFb.id
									}

								appLogin.saveUsuarioFB(dataUsuarioFb);
								setTimeout(function(){ UtilFn.showMaskLoading('hide'); },450000);

							});
						}else if(tipo == 'go'){

							var dataUsuarioGo = {
								"usuario": dataGo.email,
								"pass": (new Date()).getTime(),
								'persona.tipoDocumento':1,
								'persona.nroDocumento' : '',
								'persona.nombreCompleto' : dataGo.displayName,
								'persona.estado' : 1,
								'persona.tipoPersona' : 18,
								'persona.contactoPrincipal.tipoTelefono' : 17,
								'persona.contactoPrincipal.numero' : '',
							 'persona.contactoPrincipal.estado' : 1,
							 'persona.emailPrincipal.email' : dataGo.email,
								'persona.emailPrincipal.indPrincipal' : 1,
							 'persona.emailPrincipal.estado' : 1,
							 'indAlerta': '1',
							 'idUsuarioGo': dataGo.userId
								}

								appLogin.saveUsuarioFB(dataUsuarioGo);
								setTimeout(function(){ UtilFn.showMaskLoading('hide'); },450000);
						}

					});


				}

		});



	}
	,
	loginFb : function(){

		CordovaFacebook.logout({
		   onSuccess: function() {
		      console.log("FB The user is now logged out");
					CordovaFacebook.login({
					      permissions: ['email', 'user_likes'],
					       onSuccess: function(result) {
					          if(result.declined.length > 0) {
											console.log('FB Result-------------------------------------');
					            console.log(JSON.stringify(result));
											//alert('0:'+JSON.stringify(result))
											appLogin.validateRS(result,'fb');
					          }
					       },
					       onFailure: function(result) {
									 console.log('FB Login Error-------------------------------------');
									 console.log(JSON.stringify(result));
									 //alert('1:'+JSON.stringify(result))
					       }
					    });
		   }
		});

			// CordovaFacebook.getLoginStatus(
			// 		function(){
			// 			console.log('ok')
			// 			facebookConnectPlugin.logout(function(){
			//
			// 						console.log('fb sesion cerrada');
			//
			// 			 }, function(){})
			// 		},
			// 		function(){
			// 				console.log('no ok')
			// 		}
			// 	);

		// CordovaFacebook.login({
		//       permissions: ['email', 'user_likes'],
		//        onSuccess: function(result) {
		//           if(result.declined.length > 0) {
		// 						console.log('FB Result-------------------------------------');
	  //             console.log(JSON.stringify(result));
		// 						appLogin.validateRS(result,'fb');
		//           }
		//        },
		//        onFailure: function(result) {
		// 				 console.log('FB Login Error-------------------------------------');
		// 				 console.log(JSON.stringify(result));
		//        }
		//     });
	}
,
saveUsuarioFB : function(data){

	UtilFn.ajaxInvokeService(
	{
		config : {
			method: "POST",
			url: BASE_URL_SERVICE_REST+'api/public/app/usuario/fb',
			data: data,
			dataType: 'json'
		}
		,success : function(response){

			UtilFn.showMaskLoading('hide');
			if(response.usuario && response.usuario.id){
				//response.usuario.accessToken = me.access_token;
				UtilFn.setLoginUser(response.usuario);
				UtilFn.redirect("main");
			}else{
				UtilFn.showMessageToast("Upps!, se genero un error inesperado." );
			}
		}
	}
	);

},
	login : function(){


		 var usuario = new Object();

		 if($("#usuario").val()+""==""){
			 UtilFn.showMessageToast("Ingrese su usuario.");
			 $("#usuario").focus();
		 }else if($("#password").val()+""==""){
			 UtilFn.showMessageToast("Ingrese su password.");
			 $("#password").focus();
		 }else{

			// $(".loader").show();
			// $(".back-loader").show();

			$('.btnLoginManager').addClass('disabled');

			 usuario["usuario"] = $("#usuario").val();
			 usuario["pass"] = $("#password").val();

					$.ajax({
						 method: "POST",
						 url: urlBase+"oauth2/login",
						 data: usuario
						 })
					 .done(function( msg ) {

						// $(".loader").hide();
						// $(".back-loader").hide();

						 if(msg.success){
							 UtilFn.showMessageToast("Ingresando...");

							 UtilFn.setLoginUser(msg.usuario);

							setTimeout(function(){
								window.location = "main.html";
							}, 1000);

						 }else{
							 $('.btnLoginManager').removeClass('disabled');
							UtilFn.showMessageToast("Su usuario/contraseña errónea.");

						 }


					 });
		 }





	},

	redirect : function(url){

		window.location = url+".html";

	}

};
