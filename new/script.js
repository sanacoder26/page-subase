import { supabase } from "./config.js";
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

/* SIGNUP */
const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Now login to continue",
        confirmButtonText: "Login"
      }).then(() => {
        window.location.href = "login.html";
      });
    }
  });
}

/* LOGIN */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        window.location.href = "profile.html";
      });
    }
  });
}

/* PROFILE PAGE PROTECTION */
async function checkSession() {
  const { data: { session } } = await supabase.auth.getSession();

  if (window.location.pathname.includes("profile.html")) {
    if (!session) {
      window.location.href = "login.html";
    } else {
      document.getElementById("userEmail").innerText =
        "Logged in as: " + session.user.email;
    }
  }
}

checkSession();

/* LOGOUT */
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      showConfirmButton: false,
      timer: 1200
    }).then(() => {
      window.location.href = "login.html";
    });
  });
}
/* ---------------- CONTACT FORM ---------------- */
const contactForm = document.querySelector(".contact-form form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = contactForm.querySelectorAll("input, textarea");
    let empty = false;

    inputs.forEach((input) => {
      if (input.value.trim() === "") empty = true;
    });

    if (empty) {
      Swal.fire({
        icon: "warning",
        title: "All fields required",
        text: "Please fill in all the fields first",
      });
      return;
    }

    Swal.fire({
      title: "Sending...",
      text: "Please wait a moment",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Thank you for your response",
        text: "Your message has been submitted successfully",
      });
      contactForm.reset();
    }, 2000);
  });
}
