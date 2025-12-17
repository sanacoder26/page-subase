import supabase from "./config.js";

const email = document.getElementById("email");
const pass = document.getElementById("password");
const lform = document.getElementById("lform");

async function login(e) {
    e.preventDefault();

    // Validation
    if (!email.value || !pass.value) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'All fields are required!'
        });
        return;
    }

try {
        
    const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: pass.value,
        });

        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message
            });
            return;
        }

        if (data) {
            // ✅ Save email and session token to localStorage
            localStorage.setItem("userEmail", email.value);
            localStorage.setItem("userEmail", pass.value);

            localStorage.setItem("userToken", data.session.access_token);

            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Redirecting...',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "welcome.html";
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Something went wrong',
            text: err.message
        });
    }
}

lform.addEventListener("submit", login);