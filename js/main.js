$(document).ready(function(){
	var self = this;
	calc.addEventListeners(event);
});

var CONSOLE_DISPLAY_LENGTH = 30;
var INVALID_OPERATION ='Invalid Operation';
var DIVIDE_BY_ZERO_ERROR = 'Divide by Zero error';
var CONTINUE_MSG = 'Press C to Continue';

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
					if(self.isValidOperationString(previousText)){
						if(self.hasStringExceededConsoleDisplayLength(consoleText)){
							self.showConsoleWarning();
						}else{
							$('#console').html(consoleText);	
						}
					}else{
						self.displayResetConsoleMsg();
					}
				}
			}
		});
	},

	displayResetConsoleMsg : function(){
		$('#console').html(CONTINUE_MSG);
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
		var self = this;
		var cText = $('#console').html();
		if(self.isValidOperationString(cText)){
			$('#console').html(cText.substring(0, cText.length-1));	
		}else{
			self.displayResetConsoleMsg();
		}
	},

	clearConsole : function(){
		$('#console').html("");
	},

	isValidOperationString : function(text){
		if((text.search(INVALID_OPERATION) >= 0 || text.search(DIVIDE_BY_ZERO_ERROR) >= 0) || text.search(CONTINUE_MSG) >= 0){
			return false;
		}
		return true;
		//check with regular expression for numbers and operators instead of string compare.
		//var pattern = ([-+]?[0-9]*\.?[0-9]+[\/\+\-\*])+([-+]?[0-9]*\.?[0-9]+);
		//var n = text.search(pattern);
	},

	computeAndDisplayResult : function(){
		var self = this;
		var expressionString = $('#console').html();
		if(!self.hasStringExceededConsoleDisplayLength(expressionString)){
			var expressionArray = this.getExpressionArray(expressionString);
			var postfixExpressionArray = infixToPostfixRe(expressionArray, false);
			console.log(postfixExpressionArray);
			var result = self.computeResultFromPostFixExpressionArray(postfixExpressionArray);
			console.log(result);
			if(self.hasStringExceededConsoleDisplayLength(result)){
					self.showConsoleWarning();
			}else{
				$('#console').html(result);	
			}
		}else{
			self.showConsoleWarning();
		}
	},

	showConsoleWarning : function(){
		$('#console').html("Sorry! operation exceeds display length");
	},

	hasStringExceededConsoleDisplayLength : function(str){
		return str.length > CONSOLE_DISPLAY_LENGTH;
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
		var isOp = (str == '*' || str == '-' || str == '+' || str == '/' || str == '%');
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

	isValidOperation : function(operand1, operand2, operator){
		if(operator && operator.length){
			if(operand1 && operand2){		
				if(isFinite(operand1) && !isNaN(operand1) && isFinite(operand2) && !isNaN(operand2)){
					return true;
				}
			}
		}
		return false;
	},

	performDivision : function(operand1, operand2){
		var result = '';
		if(operand2 == 0){
			result = DIVIDE_BY_ZERO_ERROR;
		}else{
			result = operand1 / operand2;
		}
		return result;
	},

	evaluateExpresssion : function(operand1, operand2, operator){
		var self = this;
		var result = INVALID_OPERATION;
		if(self.isValidOperation(operand1, operand2, operator)){
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
					result = self.performDivision(parseFloat(operand1), parseFloat(operand2));
					break;
				case '%':
					result = parseFloat(operand1) % parseFloat(operand2);
					break;
			}
		}
		return result.toLocaleString();
	}

};