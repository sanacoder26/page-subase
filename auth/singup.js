import supabase from "./config.js";

const username = document.getElementById("username")
const email = document.getElementById("email")
const password = document.getElementById("password")
const signupBtn = document.getElementById("signupBtn")

signupBtn.addEventListener("click", async () => {

  if (!username.value || !email.value || !password.value) {
    Swal.fire({
      title: "Missing Fields",
      text: "Please fill all fields",
      icon: "warning",
      background: "#020617",
      color: "#e5e7eb",
      confirmButtonColor: "#2563eb"
    })
    return
  }

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        username: username.value
      }
    }
  })

  if (error) {
    Swal.fire({
      title: "Signup Failed",
      text: error.message,
      icon: "error",
      background: "#020617",
      color: "#e5e7eb",
      confirmButtonColor: "#dc2626"
    })
    return
  }

  Swal.fire({
    title: "Account Created",
    text: "Check your email to verify your account",
    icon: "success",
    background: "#020617",
    color: "#e5e7eb",
    confirmButtonColor: "#2563eb"
  }).then(() => {
    window.location.href = "login.html"
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
