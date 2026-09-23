// wishlist.js

import { db, auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getTrailerLink } from "./trailer.js";

const wishlistContainer = document.getElementById("wishlist-container");
const loader = document.getElementById("loader");
const imageBase = "https://image.tmdb.org/t/p/w500";

function showLoader() {
  loader.style.display = "block";
}

function hideLoader() {
  loader.style.display = "none";
  wishlistContainer.style.display = "flex";
}

async function fetchWishlist(user) {
  showLoader();
  wishlistContainer.innerHTML = ""; 

  try {
    const wishlistRef = collection(db, "users", user.uid, "wishlist");
    const snapshot = await getDocs(wishlistRef);

    if (snapshot.empty) {
      wishlistContainer.innerHTML = `
        <div class="col text-center">
          <p>No movies in your wishlist yet.</p>
        </div>
      `;
      return; 
    }

    snapshot.forEach((docSnap) => {
      const movie = docSnap.data();

      const card = document.createElement("div");
      card.classList.add("col");
      card.innerHTML = `
        <div class="card h-100 bg-secondary text-white">
          <img src="${
            movie.poster_path ? imageBase + movie.poster_path : "./fallback.jpg"
          }" class="card-img-top" alt="${movie.title}">
          <div class="card-body d-flex flex-column">
           <h5 class="card-title">
  <a href="movie-details.html?id=${
    movie.id
  }" class="text-white text-decoration-none">${movie.title}</a>
</h5>
         <p class="card-text">${
           movie.overview
             ? movie.overview.substring(0, 100) + "..."
             : "No description available."
         }</p>
            <button class="btn btn-danger mt-auto">Remove from Wishlist</button>
            <button class="btn btn-primary mt-2 trailer-btn">▶ Watch Trailer</button>
          </div>
        </div>
      `;
      wishlistContainer.appendChild(card);

      const trailerBtn = card.querySelector(".trailer-btn");
      trailerBtn.addEventListener("click", async () => {
        trailerBtn.disabled = true;
        trailerBtn.textContent = "Loading...";
        const url = await getTrailerLink(movie.id, movie.title);
        window.open(url, "_blank", "noopener,noreferrer");
        trailerBtn.disabled = false;
        trailerBtn.textContent = "▶ Watch Trailer";
      });

      // Remove from wishlist logic
      const removeBtn = card.querySelector(".btn-danger");
      removeBtn.addEventListener("click", async () => {
        const confirmDelete = confirm(
          `Remove "${movie.title}" from your wishlist?`
        );
        if (!confirmDelete) return;

        try {
          await deleteDoc(doc(db, "users", user.uid, "wishlist", docSnap.id));
          card.remove();
          alert("Movie removed from wishlist.");
        } catch (err) {
          console.error("Error removing movie:", err);
          alert("Failed to remove movie.");
        }
      });
    });
  } catch (err) {
    console.error("Error loading wishlist:", err);
    alert("Failed to load wishlist.");
  } finally {
    hideLoader();
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    fetchWishlist(user);
  } else {
    window.location.href = "login.html";
  }
});
