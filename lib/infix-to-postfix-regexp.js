/**
 * Infix to postfix notation RegExp converter
 *
 * To implement RegExp machine (NFA, DFA) we need
 * to transform first RegExp string to postfix notation
 * for more convinient work with the stack. This function
 * does exactly this.
 *
 * See: http://swtch.com/~rsc/regexp/regexp1.html
 *
 * Note: we use already *transformed* infix RegExp form,
 * that is, with *explicit* concatenations:
 *
 * Example:
 *
 *   - Original: abc
 *   - Transformed (used in this function): a.b.c
 *   - After conversion to postfix: ab.c.
 *
 * For conversion Shunting yard algorithm is used,
 * See: http://en.wikipedia.org/wiki/Shunting_yard_algorithm
 *
 * by Dmitry Soshnikov <dmitry.soshnikov@gmail.com>
 * MIT Style License
 */
 
// helper, top element of an array w/o removing it
Array.prototype.peek = function () {
  return this[this.length - 1];
};
 
/**
 * infixToPostfixRe
 * @param {String} reStr - a RegExp in transformed view
 * with explicit contatenations: abc -> a.b.c => result: ab.c.
 */
 var output = [];
 var stack = [];
function infixToPostfixRe(expressionArray, dontPrint) {
 output = [];
 stack = [];
  for (var k = 0, length = expressionArray.length; k < length;  k++) {
 
    // current char
    var c = expressionArray[k];
 
    if (c == '(')
      stack.push(c);
 
    else if (c == ')') {
      while (stack.peek() != '(') {
        output.push(stack.pop())
      }
      stack.pop(); // pop '('
    }
 
    // else work with the stack
    else {
      while (stack.length) {
        var peekedChar = stack.peek();
 
        var peekedCharPrecedence = precedenceOf(peekedChar);
        var currentCharPrecedence = precedenceOf(c);
 
        if (peekedCharPrecedence >= currentCharPrecedence) {
          output.push(stack.pop());
        } else {
          break;
        }
      }
      stack.push(c);
    }
 
  } // end for loop
 
  while (stack.length)
    output.push(stack.pop());
 
  var result = output.join("");
 
  !dontPrint && console.log(expressionArray, "=>", result);
 
  return output;
}
 
// precedence
 
var precedenceMap = {
  '(': 1,
  '|': 2, // alternate
  '.': 3, // concatenate
 
  '?': 4, // zero or one
  '*': 4, // zero or more
  '+': 4, // one or more
  '-': 4, // one or more
  '/': 4, // one or more
  '%': 4, // one or more
 
  '^': 5 // complement
 
  // else 6
 
};
 
function precedenceOf(c) {
  return precedenceMap[c] || 6;
}