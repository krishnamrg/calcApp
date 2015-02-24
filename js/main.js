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
					//not supporting square root functionality right now
					var currKey = self.isSquareRoot($(this).val()) ? "" : $(this).val();
					var consoleText = previousText != undefined ? previousText+=currKey : currKey;
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
		var self = this;
		return self.getCharCode($(key).val())=="&#9003;";
	},

	removeLastCharacterFromConsole : function(key){
		var cText = $('#console').html();
		$('#console').html(cText.substring(0, cText.length-1));
	},

	clearConsole : function(){
		$('#console').html("");
	},

	computeAndDisplayResult : function(){
		var self = this;
		var expressionString = $('#console').html();
		var expressionArray = this.getExpressionArray(expressionString);
		var postfixExpressionArray = infixToPostfixRe(expressionArray, false);
		console.log(postfixExpressionArray);
		var result = self.computeResultFromPostFixExpressionArray(postfixExpressionArray);
		console.log(result);
		$('#console').html(result);
	},

	getCharCode : function(character){
		return "&#" + character.charCodeAt(0)+";";
	},

	isSquareRoot : function(value){
		var self = this;
		return self.getCharCode(value)=="&#8730;";
	},

	getExpressionArray : function(expressionString){
		var self = this;
		var expressionArray = [];
		var value = '';
		for(i=0;i<expressionString.length;i++){
				if(self.isOperator(expressionString[i])){
					expressionArray.push(value);
					expressionArray.push(expressionString[i]);
					value = '';
				}else{
					value += expressionString[i];	
				}
				if(i == expressionString.length-1){
					expressionArray.push(value);
				}
			}
		return expressionArray;
		},

	isOperator : function(str){
		var isOp = (str == '*' || str == '-' || str == '+' || str == '/');
		return isOp;
	},

	computeResultFromPostFixExpressionArray : function(postfixExpressionArray){
		var self = this;
		var result = '';

		var operand = '';
		var operator = '';
		for(var i = 0;i<postfixExpressionArray.length;i++){
			if(self.isOperator(postfixExpressionArray[i])){
				operator = postfixExpressionArray[i];
				result = self.evaluateExpresssion(result, operand, operator);
			}else{
				if(i == 0){
					result = postfixExpressionArray[i];
				}else{
					operand = postfixExpressionArray[i];	
				}
			}
		}
		return result;
	},

	evaluateExpresssion : function(operand1, operand2, operator){
		var result = '';
		switch(operator){
			case '+':
				result = parseFloat(operand1) + parseFloat(operand2);
				break;
			case '-':
				result = parseFloat(operand1) - parseFloat(operand2);
				break;
			case '*':
				result = parseFloat(operand1) * parseFloat(operand2);
				break;
			case '/':
				result = parseFloat(operand1) / parseFloat(operand2);
				break;
		}
		return result;
	}

};