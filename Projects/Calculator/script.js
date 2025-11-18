// Get the display input field
const display = document.getElementById("display");

// Append a value to the display
function appendToDisplay(value) {
  display.value += value;
}

// Clear the display
function clearDisplay() {
  display.value = "";
}

// Calculate the result without using eval()
function calculate() {
  try {
    const expression = display.value;
    const result = evaluateExpression(expression);
    display.value = result;
  } catch (error) {
    alert("Invalid expression");
    clearDisplay();
  }
}

// Function to evaluate a mathematical expression
function evaluateExpression(expression) {
  const operators = /[+\-*/]/g; // Match +, -, *, or /
  const operands = expression.split(operators).map(Number);
  const operatorMatches = expression.match(operators);

  if (!operatorMatches || operands.length - 1 !== operatorMatches.length) {
    throw new Error("Invalid expression");
  }

  // Process operations in order of precedence
  const operations = {
    "*": (a, b) => a * b,
    "/": (a, b) => {
      if (b === 0) throw new Error("Division by zero");
      return a / b;
    },
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
  };

  // Process * and / first
  for (let i = 0; i < operatorMatches.length; i++) {
    const operator = operatorMatches[i];
    if (operator === "*" || operator === "/") {
      const result = operations[operator](operands[i], operands[i + 1]);
      operands.splice(i, 2, result);
      operatorMatches.splice(i, 1);
      i--; // Adjust index to account for removed operator
    }
  }

  // Process + and -
  while (operatorMatches.length > 0) {
    const operator = operatorMatches.shift();
    const result = operations[operator](operands.shift(), operands[0]);
    operands[0] = result;
  }

  return operands[0];
}
