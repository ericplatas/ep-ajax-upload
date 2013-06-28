/*!
 * jQuery HTML5Upload Plugin
 * Permite o envio de arquivos de maneira assincrônica
 * Examples and documentation at: http://www.ericplatas.com.br/cycle/
 * Copyright (c) 2013 Eric Platas
 */
 
(function ( $ ) {
	$.fn.epAjaxUpload = function( options ){
		// Configurações do Plugin
        var settings = $.extend({
            // Configurações padrão.
			progressBar: null,
			progressCounter: null,
            bootstrap: false,
            success: null,
			error: function(msgError){
				$("#rst").append('<p class="epAjaxUpload-error">Desculpe, ocorreu um erro ao fazer upload!</p>');
				console.log('epAjaxupload error: ' + msgError);
			}
        }, options );
		
		var parentSelector = this;
		
		if(!settings.progressBar && !settings.progressCounter) {
			$('<progress></progress>').insertAfter(parentSelector);
		}
		
		var progressHandlingFunction = function(e){
			if(e.lengthComputable){
				if(settings.progressBar){
					$(settings.progressBar).css({ width: Math.round((e.loaded / e.total) * 200) });
				}
				
				if(settings.progressCounter){
					$(settings.progressCounter).html(Math.round((e.loaded / e.total) * 100));
				} 
				
				
				if(!settings.progressBar && !settings.progressCounter) {
					parentSelector.find('progress').attr({value:e.loaded,max:e.total});
				}
			}
		}		
		
		this.submit(function(e){
			e.preventDefault();
			
			var formData = new FormData($('form')[0]);
					
			$.ajax({
				url: 'uploader.php',  //server script to process data
				type: 'POST',
				dataType: "json",
				xhr: function() {  // custom xhr
					var myXhr = $.ajaxSettings.xhr();
					if(myXhr.upload){ // check if upload property exists
						myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
					}
					return myXhr;
				},
				//Ajax events
				beforeSend: function(){
					console.log("Enviando");
				},
				success: function(data){
					for (var i = 0; i < data.length; i++){
						if(data[i]['status'] == 'success'){
							if(settings.success){
                                settings.success(data[i]['filename']);
                            } else if(settings.bootstrap){
                                $("#rst").append('<div class="alert"><button type="button" class="close" data-dismiss="alert">&times;</button><strong>Warning!</strong> Best check yo self, you\'re not looking too good.</div>');
                                console.log('epAjaxupload return: ' + data);
                            } else {
                                $("#rst").append('<p class="epAjaxUpload-success">Upload completo com sucesso!</p>');
                                console.log('epAjaxupload return: ' + data);
                            }
						} else {
							settings.error(data[i]['msgerror']);
						}
					}
				},
				error: function(){
					
				},
				// Form data
				data: formData,
				//Options to tell JQuery not to process data or worry about content-type
				cache: false,
				contentType: false,
				processData: false
			});
		});
	}
}( jQuery ));
