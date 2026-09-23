import { auth } from "./firebase.js"; // Firebase authentication instance
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { firebaseErrorMessage } from "./firebasemessage.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const loginBtn = document.getElementById("login-btn");
const loginText = document.getElementById("login-text");
const loginSpinner = document.getElementById("login-spinner");

document
  .getElementById("togglePassword")
  .addEventListener("click", function () {
    const passwordField = passwordInput;
    const type =
      passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
  });

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    loginBtn.disabled = true;
    loginSpinner.style.display = "inline-block";
    loginText.textContent = "Loading...";

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    console.log("✅ User logged in:", user);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.log("❌ Full error object:", error);
    console.log("Error code:", error.code);
    console.log("Error message:", error.message);

    const message =
      firebaseErrorMessage[error.code] ||
      "An unknown error occurred. Please try again.";
    alert(message);
  } finally {
    loginBtn.disabled = false;
    loginSpinner.style.display = "none";
    loginText.textContent = "Login";
  }
});
