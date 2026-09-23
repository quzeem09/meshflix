import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const usernameInput = document.getElementById("username");
const profileImageInput = document.getElementById("profile-image");
const profileDisplay = document.getElementById("profile-display");
const saveProfileBtn = document.getElementById("save-profile-btn");
const subscribeBtn = document.getElementById("subscribe-btn");
const logoutBtn = document.getElementById("logout-btn");
const saveProfileText = document.getElementById("save-profile-text");
const saveProfileSpinner = document.getElementById("save-spinner");

let currentUser = null;

// Check auth state
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  await loadUserProfile(user);
});

// Load profile from Firestore
async function loadUserProfile(user) {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const data = userSnap.data();

      // Username
      if (data.displayName) {
        usernameInput.value = data.displayName;
        document.getElementById("user-name-display").textContent =
          data.displayName;
      } else {
        document.getElementById("user-name-display").textContent = "User";
      }

      // Profile image
      if (data.photoURL) {
        profileDisplay.src = data.photoURL;
      }

      // Subscription button
      if (data.subscribed) {
        subscribeBtn.textContent = "Subscribed";
        subscribeBtn.disabled = true;
      }
    }
  } catch (err) {
    console.error("Failed to load profile:", err);
    alert("Could not load profile.");
  }
}

// Save profile with image (base64) or just name
saveProfileBtn.addEventListener("click", async () => {
  if (!currentUser) return;

  // Start loading state
  saveProfileBtn.disabled = true;
  saveProfileSpinner.style.display = "inline-block";
  saveProfileText.textContent = "Saving...";

  const displayName = usernameInput.value.trim();
  const photoFile = profileImageInput.files[0];
  const userDocRef = doc(db, "users", currentUser.uid);

  try {
    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const photoURL = reader.result;
        profileDisplay.src = photoURL;

        try {
          await setDoc(
            userDocRef,
            {
              displayName,
              photoURL,
              email: currentUser.email,
            },
            { merge: true }
          );

          alert("Profile saved successfully!");
        } catch (err) {
          console.error("Failed to save profile with image:", err);
          alert("Failed to save profile.");
        } finally {
          restoreSaveButton();
        }
      };

      reader.readAsDataURL(photoFile);
    } else {
      await setDoc(
        userDocRef,
        {
          displayName,
          email: currentUser.email,
        },
        { merge: true }
      );

      alert("Profile saved successfully!");
      restoreSaveButton();
    }
  } catch (err) {
    console.error("Failed to save profile:", err);
    alert("An error occurred while saving your profile.");
    restoreSaveButton();
  }
});

// Restore Save button state
function restoreSaveButton() {
  saveProfileBtn.disabled = false;
  saveProfileSpinner.style.display = "none";
  saveProfileText.textContent = "Save Profile";
}

// Subscribe button
subscribeBtn.addEventListener("click", async () => {
  if (!currentUser) return;

  try {
    const userDocRef = doc(db, "users", currentUser.uid);
    await setDoc(
      userDocRef,
      {
        subscribed: true,
      },
      { merge: true }
    );

    subscribeBtn.textContent = "Subscribed";
    subscribeBtn.disabled = true;
    alert("You are now subscribed!");
  } catch (err) {
    console.error("Subscription error:", err);
    alert("Failed to subscribe.");
  }
});

// Logout
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (err) {
    console.error("Logout error:", err);
    alert("Failed to log out.");
  }
});
