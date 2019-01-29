// Misha's functions for the cosine similarity comparison
let DIMENSION = 256;
function vectorDiff(vectorA, vectorB) {
    let sum = new Float32Array(DIMENSION);
    for(let comp = 0; comp < DIMENSION; comp++) {
        sum[comp] = vectorA[comp] - vectorB[comp];
    }
    return sum;
}
function scalarMultiplication(factor, vector) {
    let modified_vector = new Float32Array(256);
    for(let comp = 0; comp < vector.length; comp++) {
        modified_vector[comp] = factor * vector[comp];
    }
    return modified_vector;
}
function vectorSum(vectorA, vectorB) {
    let sum = new Float32Array(DIMENSION);
    for(let comp = 0; comp < DIMENSION; comp++) {
        sum[comp] = vectorA[comp] + vectorB[comp];
    }
    return sum;
}

function cosineSimilarity(vectorA, vectorB) {
    let dot_product = dotProduct((vectorA), (vectorB));
    let magnitude_product = magnitude(vectorA) * magnitude(vectorB);
    return dot_product / magnitude_product;
}

function dotProduct(vectorA, vectorB) {
    let dot_product = 0;
    for(let comp = 0; comp < DIMENSION; comp++) {
        dot_product += vectorA[comp] * vectorB[comp];
    }
    return dot_product;
}

function magnitude(vector) {
    return Math.sqrt(dotProduct(vector, vector));
}


function vectorDiff(vectorA, vectorB) {
    let sum = new Float32Array(DIMENSION);
    for(let comp = 0; comp < DIMENSION; comp++) {
        sum[comp] = vectorA[comp] - vectorB[comp];
    }
    return sum;
}

function normalize(vector) {
    let normalized = new Float32Array(256);
    let lowest = Math.min(vector) // added

    if(magnitude(vector)) {
        for(let comp = 0; comp < vector.length; comp++) {
          normalized[comp] = vector[comp]+lowest / magnitude(vector);
        }
    }
    return normalized;
}
