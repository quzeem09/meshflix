import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const signupForm = document.getElementById("signup-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const usernameInput = document.getElementById("username");

const signupBtn = document.getElementById("signup-btn");
const signupText = document.getElementById("signup-text");
const signupSpinner = document.getElementById("signup-spinner");

// Toggle password visibility
document.getElementById("togglePassword").addEventListener("click", function () {
  const type = passwordInput.type === "password" ? "text" : "password";
  passwordInput.type = type;
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});

document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
  const type = confirmPasswordInput.type === "password" ? "text" : "password";
  confirmPasswordInput.type = type;
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});

// Real-time password rule validation
passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;

  const rules = {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    lowercase: /[a-z]/.test(value),
    special: /[^a-zA-Z0-9]/.test(value),
  };

  updateRule("rule-length", rules.length);
  updateRule("rule-uppercase", rules.uppercase);
  updateRule("rule-lowercase", rules.lowercase);
  updateRule("rule-special", rules.special);
});

function updateRule(id, isValid) {
  const element = document.getElementById(id);
  if (isValid) {
    element.classList.remove("text-danger");
    element.classList.add("text-success");
    element.textContent = "✅ " + element.textContent.slice(2);
  } else {
    element.classList.add("text-danger");
    element.classList.remove("text-success");
    element.textContent = "❌ " + element.textContent.slice(2);
  }
}

// Signup form submit
signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();
  const displayName = usernameInput.value.trim();

  let emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z.-]+\.[A-Za-z]{2,}$/;
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

  if (!emailRegex.test(email)) {
    alert("Invalid email format.");
    return;
  }

  if (!passwordRegex.test(password)) {
    alert(
      "Password must be at least 8 characters, including uppercase, lowercase, and a special character."
    );
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    signupSpinner.style.display = "inline-block";
    signupBtn.disabled = true;
    signupText.textContent = "Loading...";

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      displayName,
      createdAt: new Date(),
    });

    console.log("✅ User signed up and data stored:", user.uid);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Signup error:", error.message);
    alert(`Signup failed: ${error.message}`);
  } finally {
    signupSpinner.style.display = "none";
    signupBtn.disabled = false;
    signupText.textContent = "Sign Up";
  }
});
