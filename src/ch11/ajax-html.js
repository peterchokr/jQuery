$(document).ready( function() {  
	$('#btnLoad3').click( function() {
		$('#listArea').empty();					
		$('#listArea').load('ajax-listinfo.html li', function(htmlData){		
			$('#listArea').listview('refresh');	
		});			
	});
});
