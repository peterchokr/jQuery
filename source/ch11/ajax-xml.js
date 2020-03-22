$(document).ready( function() {  
	$('#btnLoad1').click( function() {		
		$.ajax({
			url: 'ajax-stuinfo.xml',
			type: 'get',
			dataType: 'xml',
			timeout: 10000,
			success: function(xmlData) {
				var tagList = "";
				$(xmlData).find('student').each(function(){
					tagList += "<li>" + $(this).find('gradepoint').text() + "</li>";
				});
				$('#listArea').empty();		
				$('#listArea').append(tagList);
				$('#listArea').listview('refresh');
			},
			error: function() {
				$("#listArea").html("<p>Error!!</p>");
			}
		});
	});
});


