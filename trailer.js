// Shared helper for getting a YouTube trailer link for a movie.
// Used by movie.js, explore.js, wishlist.js, and movie-details.js so the
// "Watch Trailer" behaviour stays identical everywhere it appears.

const TRAILER_API_KEY = "8577a892b057c57cabee01672d2b49d1";

/**
 * Looks up a movie's official YouTube trailer via TMDB.
 * Falls back to a YouTube search link if no trailer is found or the
 * lookup fails, so the button always opens somewhere useful.
 */
export async function getTrailerLink(movieId, movieTitle) {
  const searchFallback = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    (movieTitle || "movie") + " official trailer"
  )}`;

  if (!movieId) return searchFallback;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TRAILER_API_KEY}&language=en-US`
    );
    const data = await response.json();
    const videos = data.results || [];

    const trailer =
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      videos.find((v) => v.site === "YouTube");

    if (trailer) {
      return `https://www.youtube.com/watch?v=${trailer.key}`;
    }
    return searchFallback;
  } catch (err) {
    console.error("Trailer lookup failed:", err);
    return searchFallback;
  }
}
