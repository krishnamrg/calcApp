

$(document).ready(function(){
	var self = this;
	calc.addEventListeners(event);
});

var calc = {
	addEventListeners : function(event){
		var self = this;
		$('.key').click(function(event){
			if(self.isShowResult(this)){
				self.computeAndDisplayResult();
			}else{
				if(self.isClearKeyPressed(this)){
					self.clearConsole();
				}else if(self.isBackSpacePressed(this)){
					self.removeLastCharacterFromConsole();
				}else{
					var previousText = $('#console').html();
					var consoleText = previousText != undefined ? previousText+=$(this).val() : $(this).val();
					$('#console').html(consoleText);	
				}
			}
		});
	},

	isShowResult : function(key){
		return ($(key).val() == '=' ? true : false);
	},

	isClearKeyPressed : function(key){
		return ($(key).val() == 'C' ? true : false);
	},

	isBackSpacePressed : function(key){
		return ($(key).val() == 'Back Space' ? true : false);
	},

	removeLastCharacterFromConsole : function(key){
		var cText = $('#console').html();
		$('#console').html(cText.substring(0, cText.length-1));
	},

	clearConsole : function(){
		$('#console').html("");
	},

	computeAndDisplayResult : function(){

	}
};