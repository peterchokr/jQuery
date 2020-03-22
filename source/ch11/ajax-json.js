$(document).ready( function() {  
	$('#btnLoad2').click( function() {		
		$.getJSON('ajax-stuinfo.json', function(jsonData) {
			var tagList = "";
			$.each(jsonData.stuinfo, function() {
				tagList += "<li>" + this.schoolyear + "</li>";
			});
			$('#listArea').empty();				
			$('#listArea').append(tagList);
			$('#listArea').listview('refresh');
		});
	});
});	
