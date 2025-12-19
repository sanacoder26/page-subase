import supabase from "./config.js";

const emailInput = document.getElementById("email")
const resetBtn = document.getElementById("resetBtn")

resetBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim()

  if (!email) {
    Swal.fire({
      title: "Error",
      text: "Please enter your email",
      icon: "warning",
      background: "#2c2c2c",
      color: "#fff"
    })
    return
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/update-profile.html"
  })

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
    text: "Password reset email sent successfully",
    icon: "success",
    background: "#2c2c2c",
    color: "#fff",
    timer: 2500,
    showConfirmButton: false
  })
})
