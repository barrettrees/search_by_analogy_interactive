/* 
	Rocchio Formula
	Qm = (a * Qo) + (b * 1/|R| * ∑(r)) - (c * 1/|N| * ∑(n))
	
	Qm: modified query
	Qo: original query
	R: set of relevant vectors
	N: set of nonrelevant vectors
*/  

let a = 1.0;
let b = 0.8;
let c = 0.1;

function rocchio(query, relevant, nonrelevant) {
	var modified_query = scalarMultiplication(a, query);
	modified_query = vectorSum(modified_query, scalarMultiplication(b, summationOf(relevant)));
	modified_query = vectorDiff(modified_query, scalarMultiplication(c, summationOf(nonrelevant)));
	return modified_query;
}

function normalize(vector) {
	var normalized = new Float32Array(256);
	var lowest = Math.min(vector) // added

	if(magnitude(vector)) {
		for(var comp = 0; comp < vector.length; comp++) {
			normalized[comp] = vector[comp]+lowest / magnitude(vector);
		}
	}
	return normalized;
}

function summationOf(set) {
	var sum = new Float32Array(256);
	for(let vector of set) {
		sum = vectorSum(sum, vector);
	}
	return sum;
}

function cardinalityOf(set) {
	return set.length;
}

function scalarMultiplication(factor, vector) {
	var modified_vector = new Float32Array(256);
	for(var comp = 0; comp < vector.length; comp++) {
		modified_vector[comp] = factor * vector[comp];
	}
	return modified_vector;
}

function magnitude(vector) {
	return Math.sqrt(dotProduct(vector, vector));
}

function dotProduct(vectorA, vectorB) {
	var dot_product = 0;
	for(var comp = 0; comp < DIMENSION; comp++) {
		dot_product += vectorA[comp] * vectorB[comp];
	}
	return dot_product;
}

function cosineSimilarity(vectorA, vectorB) {
	var dot_product = dotProduct(vectorA, vectorB);
	var magnitude_product = magnitude(vectorA) * magnitude(vectorB);
	return dot_product / magnitude_product;
}

function vectorSum(vectorA, vectorB) {
	var sum = new Float32Array(DIMENSION);
	for(var comp = 0; comp < DIMENSION; comp++) {
		sum[comp] = vectorA[comp] + vectorB[comp];
	}
	return sum;
}

function vectorDiff(vectorA, vectorB) {
	var sum = new Float32Array(DIMENSION);
	for(var comp = 0; comp < DIMENSION; comp++) {
		sum[comp] = vectorA[comp] - vectorB[comp];
	}
	return sum;
}


