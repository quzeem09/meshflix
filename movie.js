import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  collection,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getTrailerLink } from "./trailer.js";

const apiKey = "8577a892b057c57cabee01672d2b49d1";
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
const imageBase = "https://image.tmdb.org/t/p/w500";

const moviesContainer = document.getElementById("movies-container");
const loader = document.getElementById("loader");

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
  moviesContainer.style.display = "flex";
}

async function fetchMovies() {
  showLoader();
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const movies = data.results;

    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("col");
      movieCard.innerHTML = `
        <div class="card h-100 bg-secondary text-white">
          <a href="movie-details.html?id=${movie.id}">
  <img src="${imageBase + movie.poster_path}" class="card-img-top" alt="${
        movie.title
      }" style="cursor: pointer;">
</a>

          <div class="card-body d-flex flex-column">
           <h5 class="card-title">
  <a href="movie-details.html?id=${
    movie.id
  }" class="text-white text-decoration-none">${movie.title}</a>
</h5>

            <p class="card-text">${movie.overview.substring(0, 100)}...</p>
            <button class="btn btn-primary mt-auto mb-2 trailer-btn">▶ Watch Trailer</button>
            <button class="btn btn-success mb-2" disabled>Download (Not Available)</button>
            <button class="btn btn-warning">Add to Wishlist</button>
          </div>
        </div>
      `;
      moviesContainer.appendChild(movieCard);

      const trailerBtn = movieCard.querySelector(".trailer-btn");
      trailerBtn.addEventListener("click", async () => {
        trailerBtn.disabled = true;
        trailerBtn.textContent = "Loading...";
        const url = await getTrailerLink(movie.id, movie.title);
        window.open(url, "_blank", "noopener,noreferrer");
        trailerBtn.disabled = false;
        trailerBtn.textContent = "▶ Watch Trailer";
      });

      const wishlistBtn = movieCard.querySelector(".btn-warning");

      wishlistBtn.addEventListener("click", async () => {
        try {
          const user = auth.currentUser;
          if (!user) return alert("You must be logged in to add to wishlist.");

          const wishlistRef = collection(db, "users", user.uid, "wishlist");
          const docRef = doc(wishlistRef, movie.id.toString()); 

          await setDoc(docRef, {
            id: movie.id, 
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path,
            addedAt: new Date(),
          });
          console.log("Added to wishlist with ID:", docRef.id);
          alert(`${movie.title} added to wishlist!`);
        } catch (err) {
          console.error("Error adding to wishlist:", err.message);
          alert("Failed to add to wishlist.");
        }
      });
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    alert("Failed to fetch movies.");
  } finally {
    hideLoader();
  }
}

// ✅ Ensure user is logged in before showing content
onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchMovies();
  } else {
    window.location.href = "login.html";
  }
});
