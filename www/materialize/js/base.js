$( document ).ready(function(){

	$(".button-collapse").sideNav({ 
        closeOnClick: true,
		draggable:false
		});

	$("#index-id").click(function(){
		
		$("#index").show();
		
		var all = $('nav ul li a');
		
		$.each(all, function(k, v){
			if($(v).data("info")+""!="index"){

				$("#"+$(v).data("info")).hide();	
			}
		});
	});
		
	$('nav ul li a').click(function() {
		var data = $(this).data('info');
		$("#index").hide();
		
		var all = $('nav ul li a');
		
		$.each(all, function(k, v){
			if($(v).data("info")+""!=data+""){

				$("#"+$(v).data("info")).hide();	
			}
		});
		
		$("#"+data).css({"z-index":"9999"}).show();
	});

	 
			
		
	  
		
});