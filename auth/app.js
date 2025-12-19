
import supabase from "./config.js";


const newPass = document.getElementById("newPass")
const confirmPass = document.getElementById("confirmPass")
const newEmail = document.getElementById("newEmail")
const updateBtn = document.getElementById("updateBtn")

// -------- SESSION CHECK --------
const checkSession = async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    Swal.fire({
      title: "Login Required",
      text: "Please login first",
      icon: "info",
      background: "#2c2c2c",
      color: "#fff"
    }).then(() => window.location.href = "login.html")
  }
}

checkSession()

// -------- UPDATE PROFILE --------
const updateProfile = async () => {
  const password = newPass.value.trim()
  const confirm = confirmPass.value.trim()
  const email = newEmail.value.trim()

  if (!password && !email) {
    Swal.fire({
      title: "Error",
      text: "Enter new password or email",
      icon: "warning",
      background: "#2c2c2c",
      color: "#fff"
    })
    return
  }

  if (password && password !== confirm) {
    Swal.fire({
      title: "Error",
      text: "Passwords do not match",
      icon: "warning",
      background: "#2c2c2c",
      color: "#fff"
    })
    return
  }

  const updateData = {}
  if (password) updateData.password = password
  if (email) updateData.email = email

  const { error } = await supabase.auth.updateUser(updateData)

  if (error) {
    Swal.fire({
      title: "Failed",
      text: error.message,
      icon: "error",
      background: "#2c2c2c",
      color: "#fff"
    })
    return
  }

  Swal.fire({
    title: "Success",
    text: "Profile updated successfully",
    icon: "success",
    background: "#2c2c2c",
    color: "#fff",
    timer: 2500,
    showConfirmButton: false
  }).then(() => window.location.href = "profile.html")
}

updateBtn.addEventListener("click", updateProfile)

// -------- SHOW / HIDE PASSWORD --------
document.querySelectorAll(".toggle").forEach(icon => {
  icon.addEventListener("click", () => {
    const input = document.getElementById(icon.dataset.target)
    input.type = input.type === "password" ? "text" : "password"
    icon.classList.toggle("fa-eye")
    icon.classList.toggle("fa-eye-slash")
  })
})
