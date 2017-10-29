(function(){

 $("select").material_select();

  var me = this;

  me.init = function() {

  console.log('access_token->'+UtilFn.getToken());
  console.log(UtilFn.getLoginUser());
  

  $("#index-id, .back").click(function(){

      $("#index").show();
	 //  me.listadoPrincipal();
	  
      $("#navigator").hide();

      var all = $("ul#mobile-menu li a");
       $.each(all, function(k, v){
         if($(v).data("info")+""!="index"){
          $("#"+$(v).data("info")).hide();
         }
       });
	   
	    $("#publicado").hide();
		$("#detalle").hide();
		$("#filtrado").hide();

   });

   
    $("#publicar").click(function(){

		$("#index").hide();
		$("#navigator").hide();
        $("#publicado").css({"z-index":"9999"}).show();

	});
   
   $(".collection-item").click(function(){

		$("#index").hide();
		$("#navigator").hide();
        $("#detalle").css({"z-index":"9999"}).show();

	});
   
   $("#filtro").click(function(){

		$("#index").hide();
		$("#navigator").hide();
        $("#filtrado").css({"z-index":"9999"}).show();

	});

   

  $("#navigator").hide();

  $("ul#mobile-menu li a").click(function() {
    var container = $(this).data("info");
    var view = $(this).data("view");
    var title = $(this).data("title");

    $("#index").hide();
    var all = $("ul#mobile-menu li a");
    $.each(all, function(k, v){
      if($(v).data("info")+""!=container+""){
        $("#"+$(v).data("info")).hide();
      }
    });


if(view){
    UtilFn.showMaskLoading();

    UtilFn.getView('views/'+view,null,function(response){

      UtilFn.showMaskLoading('hide');

      $("#"+container).html(response.html)
      $("#"+container).css({"z-index":"9999"}).show();
      $("#navigator").show();

    });
}else if(container+""=="mapa"){
  
  $("#"+container).css({"z-index":"9999"}).show();
  $("#navigator").show();
  me.getMapLocation();
  
}else{
	
	$("#"+container).css({"z-index":"9999"}).show();
  $("#navigator").show();
	
}


    $("#text-navigator").html(title);

    if(container+""=="cerrar"){
      $("#index").show();
      $("#navigator").hide();

      $(".loader").show();
      $(".back-loader").show();

      setTimeout(function(){

        $(".loader").hide();
        $(".back-loader").hide();

        window.location = "index.html";
      }, 1000);

    }

  });

  $(".button-collapse").sideNav({
          closeOnClick: true,
          draggable:false,
          menuWidth: 300
  });

  //me.listadoPrincipal();

  document.addEventListener('deviceready', me.onDeviceReady, false);

  document.addEventListener("backbutton", onBackKeyDown, false);

  function onBackKeyDown(e) {   e.preventDefault(); }
      console.log('onBackKeyDown!');
	  

	
  }


  // deviceready Event Handler
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  me.onDeviceReady =  function() {
      me.receivedEvent('deviceready');
  }

  // Update DOM on a Received Event
  me.receivedEvent = function(id) {
      var parentElement = document.getElementById(id);
      var listeningElement = parentElement.querySelector('.listening');
      var receivedElement = parentElement.querySelector('.received');

      listeningElement.setAttribute('style', 'display:none;');
      receivedElement.setAttribute('style', 'display:block;');

      console.log('Received Event: ' + id);
  }

  me.route = function(end){
    window.open("https://maps.google.com/?daddr="+end);
  }

  me.checkConnection = function() {
    var networkState = navigator.connection.type;
    if(networkState+""=="none"){
      window.location='./index.html';
    }else{
      window.location='./main.html';
    }
 }

 me.listadoPrincipal =  function(){

    UtilFn.ajaxInvokeService(
	{
		isRaiz : true,
		messageTimeOut : 'La sesion a caducado!',
		//config ajax setup
		config : {
			method: "GET",
			url: BASE_URL_SERVICE_REST+"api/private/app/anuncio",
			data: {access_token : UtilFn.getToken()}
		  }
		//success invoke  
		,success :  function( httpResponse ) {

        $(".loader").hide();
        $(".back-loader").hide();

         console.log("---httpResponse");
         console.log(httpResponse);
		 
		 var html = '<ul class="collection" style="margin-bottom:50px">';
		 
		 
		 $.each(httpResponse.data, function(k,v){
			
			html+='<li class="collection-item avatar">';
			  html+='<i class="material-icons circle red">play_arrow</i>';
			  html+='<span class="title">'+v.titulo+'</span>';
			  html+='<p>'+v.descripcion+'</p>';
			  html+='<a href="#!" class="secondary-content"><i class="material-icons">play_arrow</i></a>';
			html+='</li>';
			 
		 });
		 
		 
		 html+='</ul>';
		 
		 
		 $("#index").empty();
		 $("#index").html(html);
		 

      } 
	}
      
    
      
      
      );
 }
 
 /*MAPS*/
 
 me.getMapLocation = function() {

    navigator.geolocation.getCurrentPosition
    (me.onMapSuccess, me.onMapError, { enableHighAccuracy: true });
}



me.onMapSuccess = function (position) {

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;

    getMap(Latitude, Longitude);

}
 
 me.onMapError = function(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
 
  me.getMap = function(latitude, longitude) {

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map
    (document.getElementById("map"), mapOptions);


    var latLong = new google.maps.LatLng(latitude, longitude);

    var marker = new google.maps.Marker({
        position: latLong
    });

    marker.setMap(map);
    map.setZoom(15);
    map.setCenter(marker.getPosition());
}
 
 




 
 
 

me.init();

})();
