/**
 * Calculate cosine similarity between two face embedding vectors
 * @param {number[]} vecA - First embedding vector
 * @param {number[]} vecB - Second embedding vector
 * @returns {number} Similarity score between -1 and 1
 */
export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
};

/**
 * Calculate Euclidean distance between two face embedding vectors
 * @param {number[]} vecA - First embedding vector
 * @param {number[]} vecB - Second embedding vector
 * @returns {number} Distance score
 */
export const euclideanDistance = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return Infinity;
  }

  let sum = 0;
  for (let i = 0; i < vecA.length; i++) {
    const diff = vecA[i] - vecB[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
};

/**
 * Validate face embedding dimensions
 * @param {number[]} embedding - Face embedding vector
 * @returns {boolean} Whether the embedding is valid
 */
export const isValidEmbedding = (embedding) => {
  if (!embedding || !Array.isArray(embedding)) return false;
  if (embedding.length !== 128) return false;
  if (embedding.some((v) => typeof v !== 'number' || isNaN(v))) return false;
  return true;
};

/**
 * Convert embedding to base64 for storage/transmission
 * @param {Float32Array|number[]} embedding - Face embedding vector
 * @returns {string} Base64 encoded string
 */
export const embeddingToBase64 = (embedding) => {
  const arr = embedding instanceof Float32Array ? Array.from(embedding) : embedding;
  return btoa(JSON.stringify(arr));
};

/**
 * Convert base64 back to embedding array
 * @param {string} base64 - Base64 encoded string
 * @returns {number[]} Face embedding vector
 */
export const base64ToEmbedding = (base64) => {
  return JSON.parse(atob(base64));
};
