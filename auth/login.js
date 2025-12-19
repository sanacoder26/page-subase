import supabase from "./config.js";

const email = document.getElementById("email")
const password = document.getElementById("password")
const loginBtn = document.getElementById("loginBtn")

loginBtn.addEventListener("click", async () => {

  if (!email.value || !password.value) {
    Swal.fire({
      title: "Missing Fields",
      text: "Please enter email and password",
      icon: "warning",
      background: "#020617",
      color: "#e5e7eb",
      confirmButtonColor: "#2563eb"
    })
    return
  }

  const { data, error } = await supabase.auth.signInWithPassword({
  email: email.value,
  password: password.value
})

  if (error) {
    Swal.fire({
      title: "Login Failed",
      text: error.message,
      icon: "error",
      background: "#020617",
      color: "#e5e7eb",
      confirmButtonColor: "#dc2626"
    })
    return
  }

  Swal.fire({
    title: "Login Successful",
    text: "Welcome back!",
    icon: "success",
    background: "#020617",
    color: "#e5e7eb",
    confirmButtonColor: "#2563eb"
  }).then(() => {
    window.location.href = "dashboard.html"
  })
})


// password toggle
document.querySelectorAll(".toggle").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.dataset.target)
    input.type = input.type === "password" ? "text" : "password"
    icon.classList.toggle("fa-eye")
    icon.classList.toggle("fa-eye-slash")
  })
})
