export type Matrix = number[][];

export function createMatrix(rows: number, cols: number, defaultValue: number = 0): Matrix {
    return Array(rows).fill(0).map(() => Array(cols).fill(defaultValue));
}

export function multiplyMatrix(a: Matrix, b: Matrix): Matrix {
    if (a[0].length !== b.length) {
        throw new Error('Invalid matrix dimensions for multiplication');
    }

    const result = createMatrix(a.length, b[0].length);
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < b.length; k++) {
                sum += a[i][k] * b[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

export function transposeMatrix(matrix: Matrix): Matrix {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = createMatrix(cols, rows);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            result[j][i] = matrix[i][j];
        }
    }
    return result;
}

export function addMatrix(a: Matrix, b: Matrix): Matrix {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error('Matrices must have the same dimensions for addition');
    }

    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

export function subtractMatrix(a: Matrix, b: Matrix): Matrix {
    if (a.length !== b.length || a[0].length !== b[0].length) {
        throw new Error('Matrices must have the same dimensions for subtraction');
    }

    return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

export function scalarMultiply(matrix: Matrix, scalar: number): Matrix {
    return matrix.map(row => row.map(val => val * scalar));
}
