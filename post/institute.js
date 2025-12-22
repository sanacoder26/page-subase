import supabase  from "./config.js";

const container = document.getElementById('form-container');

// Check if user is logged in
async function isLoggedIn() {
  const { data: { session } } = await supabase.auth.getSession();
  return session !== null;
}

// Render form or login notice
async function renderForm() {
  if (!await isLoggedIn()) {
    container.innerHTML = `
      <div class="text-center">
        <h4>You must sign up or log in to fill this form.</h4>
        <button id="loginBtn" class="btn mt-3" style="background-color:#ff7f50;color:#fff;">Login</button>
      </div>
    `;

    document.getElementById('loginBtn').addEventListener('click', () => {
      Swal.fire({
        title: 'Login Required',
        text: 'Redirecting to login page...',
        icon: 'info',
        background: '#1f1f1f',
        color: '#fff',
        confirmButtonColor: '#ff7f50'
      }).then(() => window.location.href = "/login.html");
    });
    return;
  }

  container.innerHTML = `
    <h2>Institute Form</h2>
    <form id="instituteForm">
      <div class="mb-3">
        <label for="name">Name</label>
        <input type="text" class="form-control" id="name" required>
      </div>
      <div class="mb-3">
        <label for="email">Email</label>
        <input type="email" class="form-control" id="email" required>
      </div>
      <div class="mb-3">
        <label for="phone">Phone</label>
        <input type="text" class="form-control" id="phone" required>
      </div>
      <div class="mb-3">
        <label for="image">Profile Image</label>
        <input type="file" class="form-control" id="image" accept="image/*" required>
      </div>
      <button type="submit" class="btn w-100">Submit</button>
    </form>
  `;

  document.getElementById('instituteForm').addEventListener('submit', handleSubmit);
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  if (!await isLoggedIn()) {
    Swal.fire({
      icon: "warning",
      title: "Not Logged In",
      text: "You must log in to submit this form.",
      background: '#1f1f1f',
      color: '#fff',
      confirmButtonColor: '#ff7f50'
    });
    return;
  }

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const imageFile = document.getElementById("image").files[0];

  if (!imageFile) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please select an image!",
      background: '#1f1f1f',
      color: '#fff',
      confirmButtonColor: '#ff7f50'
    });
    return;
  }

  try {
    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);

    if (uploadError) throw uploadError;

    const { publicUrl, error: urlError } = supabase.storage
      .from("profile-images")
      .getPublicUrl(uploadData.path);

    if (urlError) throw urlError;

    // Insert into students table
    const { error: tableError } = await supabase.from("students").insert([
      { name, email, phone, image_url: publicUrl }
    ]);

    if (tableError) throw tableError;

    Swal.fire({
      icon: "success",
      title: "Submitted!",
      text: "Your data has been saved successfully.",
      background: '#1f1f1f',
      color: '#fff',
      confirmButtonColor: '#ff7f50'
    });

    document.getElementById("instituteForm").reset();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message,
      background: '#1f1f1f',
      color: '#fff',
      confirmButtonColor: '#ff7f50'
    });
  }
}

// Initialize
renderForm();
