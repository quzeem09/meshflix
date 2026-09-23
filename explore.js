import { getTrailerLink } from "./trailer.js";

const apiKey = "8577a892b057c57cabee01672d2b49d1";
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
const imageBase = "https://image.tmdb.org/t/p/w500";

const previewContainer = document.getElementById("preview-movies");

async function fetchPopularPreview() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const topThree = data.results.slice(0, 3); // Just show 3 movies

    topThree.forEach((movie) => {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML = `
        <div class="card bg-secondary text-white h-100">
          <img src="${
            imageBase + movie.poster_path
          }" class="card-img-top" alt="${movie.title}">
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">${movie.overview.substring(0, 200)}...</p>
            <button class="btn btn-primary trailer-btn">▶ Watch Trailer</button>
          </div>
        </div>
      `;
      previewContainer.appendChild(col);

      const trailerBtn = col.querySelector(".trailer-btn");
      trailerBtn.addEventListener("click", async () => {
        trailerBtn.disabled = true;
        trailerBtn.textContent = "Loading...";
        const url = await getTrailerLink(movie.id, movie.title);
        window.open(url, "_blank", "noopener,noreferrer");
        trailerBtn.disabled = false;
        trailerBtn.textContent = "▶ Watch Trailer";
      });
    });
  } catch (err) {
    console.error("Error loading previews:", err);
  }
}

fetchPopularPreview();
