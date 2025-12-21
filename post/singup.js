import supabase from "./config.js";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    Swal.fire({
      icon: "error",
      title: "Missing Information",
      text: "Please fill all required fields.",
      background: "#0f172a",
      color: "#e5e7eb",
      iconColor: "#ef4444",
      confirmButtonColor: "#2563eb"
    });
    return;
  }

  Swal.fire({
    title: "Creating Account...",
    text: "Please wait",
    allowOutsideClick: false,
    background: "#0f172a",
    color: "#e5e7eb",
    didOpen: () => Swal.showLoading()
  });

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  });

  Swal.close();

  if (error) {
    Swal.fire({
      icon: "error",
      title: "Signup Failed",
      text: error.message,
      background: "#0f172a",
      color: "#e5e7eb",
      iconColor: "#ef4444",
      confirmButtonColor: "#2563eb"
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "Account Created",
      text: "Check your email for verification.",
      background: "#0f172a",
      color: "#e5e7eb",
      iconColor: "#22c55e",
      confirmButtonColor: "#2563eb"
    }).then(() => {
      window.location.href = "login.html";
    });
  }
});
