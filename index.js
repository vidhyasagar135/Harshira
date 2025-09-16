// Convert string "val" of given base to decimal
function baseToDecimal(val, base) {
  let num = 0n; // BigInt for safety
  for (let c of val) {
    let digit;
    if (/[0-9]/.test(c)) digit = BigInt(c.charCodeAt(0) - "0".charCodeAt(0));
    else digit = 10n + BigInt(c.toLowerCase().charCodeAt(0) - "a".charCodeAt(0));
    num = num * BigInt(base) + digit;
  }
  return Number(num); // convert back to Number (careful for very large values)
}

// Multiply matrix with vector
function matVecMul(M, v) {
  let n = M.length;
  let result = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i] += M[i][j] * v[j];
    }
  }
  return result;
}

// Invert a matrix using Gauss-Jordan elimination
function invertMatrix(A) {
  let n = A.length;
  let I = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );

  for (let i = 0; i < n; i++) {
    // pivot
    let maxRow = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(A[r][i]) > Math.abs(A[maxRow][i])) maxRow = r;
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [I[i], I[maxRow]] = [I[maxRow], I[i]];

    // normalize row
    let diag = A[i][i];
    for (let j = 0; j < n; j++) {
      A[i][j] /= diag;
      I[i][j] /= diag;
    }

    // eliminate
    for (let r = 0; r < n; r++) {
      if (r !== i) {
        let factor = A[r][i];
        for (let j = 0; j < n; j++) {
          A[r][j] -= factor * A[i][j];
          I[r][j] -= factor * I[i][j];
        }
      }
    }
  }
  return I;
}

function main() {
  let n = 10, k = 7;

  // (base, value) pairs from JSON
  let raw = [
    [6,  "13444211440455345511"],
    [15, "aed7015a346d635"],
    [15, "6aeeb69631c227c"],
    [16, "e1b5e05623d881f"],
    [8,  "316034514573652620673"],
    [3,  "2122212201122002221120200210011020220200"],
    [3,  "20120221122211000100210021102001201112121"],
    [6,  "20220554335330240002224253"],
    [12, "45153788322a1255483"],
    [7,  "1101613130313526312514143"]
  ];

  // Build points
  let points = [];
  for (let i = 0; i < n; i++) {
    let x = i + 1;
    let y = baseToDecimal(raw[i][1], raw[i][0]);
    points.push([x, y]);
  }

  // Construct Vandermonde matrix (k x k) from first k points
  let V = Array.from({ length: k }, () => Array(k).fill(0));
  let b = new Array(k).fill(0);

  for (let i = 0; i < k; i++) {
    let x = points[i][0];
    let powx = 1.0;
    for (let j = 0; j < k; j++) {
      V[i][j] = powx;
      powx *= x;
    }
    b[i] = points[i][1];
  }

  // Invert Vandermonde matrix
  let V_inv = invertMatrix(V);

  // Multiply V_inv * b to get coefficients
  let coeffs = matVecMul(V_inv, b);

  console.log("Coefficients (a0 + a1*x + ... + a6*x^6):");
  console.log(coeffs.map(c => c.toFixed(2)).join(" "));
}

main();
