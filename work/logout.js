import supabase from "./config.js";

async function logout(e) {
    e.preventDefault();  // STOP default button behavior

    const { error } = await supabase.auth.signOut();

    if (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out!'
    }).then(() => {
        // Redirect AFTER popup closes
        window.location.href = "index.html";
    });
}

window.logout = logout;