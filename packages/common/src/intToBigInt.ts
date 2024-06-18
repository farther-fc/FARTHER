// Function to convert large javascript numbers represented as floats to BigInt
// Ex: 1e23 === 100000000000000000000000n
export function intToBigInt(num: number): bigint {
  // Handle special case when number is zero
  if (num === 0) return BigInt(0);

  if (num < 0) {
    throw new Error("Negative numbers are not supported.");
  }
  if (num !== Math.floor(num) && num.toString().includes(".")) {
    throw new Error("Decimals are not supported.");
  }

  // Convert number to string in exponential form
  let numStr = num.toExponential();

  // Split the string into coefficient and exponent parts
  let [coefficient, exponent] = numStr.split("e");

  // Remove the decimal point from the coefficient
  coefficient = coefficient.replace(".", "");

  // Convert coefficient and exponent to BigInt and number respectively
  let coefficientBigInt = BigInt(coefficient);
  let exponentInt = parseInt(exponent, 10);

  // Calculate the final BigInt result
  if (exponentInt >= 0) {
    return (
      coefficientBigInt *
      BigInt(10) ** BigInt(exponentInt - (coefficient.length - 1))
    );
  } else {
    return (
      coefficientBigInt /
      BigInt(10) ** BigInt(-(exponentInt + (coefficient.length - 1)))
    );
  }
}

// // Tests
// function runTests() {
//   const tests: { input: number; expected: bigint }[] = [
//     { input: 1e23, expected: 100000000000000000000000n },
//     { input: 13213.3e20, expected: 1321330000000000000000000n },
//     { input: 0, expected: 0n },
//   ];

//   tests.forEach((test, index) => {
//     const result = intToBigInt(test.input);
//     console.log(
//       `Test ${index + 1}:`,
//       result === test.expected
//         ? "PASSED"
//         : `FAILED (expected ${test.expected}, got ${result})`,
//     );
//   });
// }

// // Run tests
// runTests();
