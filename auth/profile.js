import supabase from "./config.js";

const logoutBtn = document.getElementById("logoutBtn")
const updatePasswordBtn = document.getElementById("updatePasswordBtn")
const userEmail = document.getElementById("userEmail")

// Check if user is logged in
const checkAuth = async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    Swal.fire({
      title: "Access Denied",
      text: "Please login first.",
      icon: "error"
    }).then(() => window.location.href = "login.html")
  } else {
    userEmail.textContent = `Logged in as: ${data.session.user.email}`
  }
}

checkAuth()

// Logout
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut()
  Swal.fire("Logged out", "You have been logged out", "success").then(() => {
    window.location.href = "login.html"
  })
})

// Update Password
updatePasswordBtn.addEventListener("click", () => {
  window.location.href = "profile.html"
})
