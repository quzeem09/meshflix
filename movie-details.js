import { getTrailerLink } from "./trailer.js";

const apiKey = "8577a892b057c57cabee01672d2b49d1";
const imageBase = "https://image.tmdb.org/t/p/w500";

// Helper to get query parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function loadMovieDetails() {
  const movieId = getQueryParam("id");
  if (!movieId) return alert("No movie ID provided.");

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
    );
    const movie = await response.json();

    const detailContainer = document.getElementById("movie-detail");
    detailContainer.innerHTML = `
      <div class="col-md-4">
        <img src="${imageBase + movie.poster_path}" alt="${movie.title}" />
      </div>
      <div class="col-md-8">
        <h2>${movie.title}</h2>
        <p><strong>Release Date:</strong> ${movie.release_date}</p>
        <p><strong>Rating:</strong> ⭐ ${movie.vote_average}</p>
        <p>${movie.overview}</p>
        <button id="trailer-link-btn" class="btn btn-primary me-2">▶ Watch Trailer</button>
        <a href="movies.html" class="btn btn-warning">🔙 Back to Movies</a>
      </div>
    `;

    const trailerBtn = document.getElementById("trailer-link-btn");
    trailerBtn.addEventListener("click", async () => {
      trailerBtn.disabled = true;
      trailerBtn.textContent = "Loading...";
      const url = await getTrailerLink(movie.id, movie.title);
      window.open(url, "_blank", "noopener,noreferrer");
      trailerBtn.disabled = false;
      trailerBtn.textContent = "▶ Watch Trailer";
    });
  } catch (error) {
    console.error("Failed to load movie details:", error);
    alert("Could not load movie details.");
  }
}

loadMovieDetails();
