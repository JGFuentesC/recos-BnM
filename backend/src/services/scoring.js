/**
 * Normalize a numeric field across a set of items using min-max scaling.
 * norm(x) = (x - min) / (max - min)
 *
 * When all values are identical (max === min), assigns 0.5 to every item.
 *
 * @param {Array<Record<string, any>>} items
 * @param {string} key - field name to normalize
 * @returns {Array<Record<string, any>>} items with an added `norm_${key}` field
 */
function normalize(items, key) {
  if (!items || items.length === 0) return items;

  const values = items.map((i) => i[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (max === min) {
    return items.map((i) => ({ ...i, [`norm_${key}`]: 0.5 }));
  }

  return items.map((i) => ({
    ...i,
    [`norm_${key}`]: (i[key] - min) / (max - min),
  }));
}

/**
 * Compute the composite score for a set of candidate items.
 *
 * Base formula (PRD §7 HU3.1):
 *   score = 0.7 * norm(popularity) + 0.3 * norm(rating)
 *
 * Affinity signal (for feed >100 swipes):
 *   Each genre in `genreAffinity` has a multiplier (>1 boosts, <1 penalizes).
 *   An item's affinityMultiplier is the max multiplier among its genres (or 1.0 if none match).
 *   score = (0.7 * norm_popularity + 0.3 * norm_rating) * affinityMultiplier
 *
 * @param {Array<Record<string, any>>} items - each item must have `popularity`, `rating`, and `genres: string[]`
 * @param {Record<string, number>} [genreAffinity] - map of genre → multiplier, e.g. { Action: 1.2, Drama: 0.8 }
 * @returns {Array<Record<string, any>>} items sorted by `score` descending, with added
 *   `norm_popularity`, `norm_rating`, `affinityMultiplier`, and `score` fields
 */
function computeScore(items, genreAffinity = {}) {
  if (!items || items.length === 0) return [];

  let scored = normalize(items, "popularity");
  scored = normalize(scored, "rating");

  const hasAffinity = Object.keys(genreAffinity).length > 0;

  return scored
    .map((i) => {
      let affinityMultiplier = 1.0;
      if (hasAffinity && Array.isArray(i.genres) && i.genres.length > 0) {
        const boosts = i.genres.map((g) => genreAffinity[g]).filter((v) => v != null);
        if (boosts.length > 0) {
          affinityMultiplier = Math.max(...boosts);
        }
      }
      return {
        ...i,
        affinityMultiplier,
        score: (0.7 * i.norm_popularity + 0.3 * i.norm_rating) * affinityMultiplier,
      };
    })
    .sort((a, b) => b.score - a.score);
}

module.exports = { normalize, computeScore, scoreCandidates: computeScore };
