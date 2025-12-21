import supabase  from "./config.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector("input[type='email']").value.trim();
  const password = loginForm.querySelector("input[type='password']").value.trim();

  if (!email || !password) {
    Swal.fire({
      icon: "error",
      title: "Missing Credentials",
      text: "Please enter email and password.",
      background: "#0f172a",
      color: "#e5e7eb",
      iconColor: "#ef4444",
      confirmButtonColor: "#2563eb"
    });
    return;
  }

  Swal.fire({
    title: "Logging In...",
    text: "Please wait",
    allowOutsideClick: false,
    background: "#0f172a",
    color: "#e5e7eb",
    didOpen: () => Swal.showLoading()
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  Swal.close();

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: error.message,
      background: "#0f172a",
      color: "#e5e7eb",
      iconColor: "#ef4444",
      confirmButtonColor: "#2563eb"
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "Welcome Back",
      text: "Login successful",
      background: "#0f172a",
      color: "#e5e7eb",
      iconColor: "#22c55e",
      confirmButtonColor: "#2563eb"
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  }
});
