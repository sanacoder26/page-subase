  import supabase  from "./config.js";

    const form = document.getElementById("instituteForm");

    // Function to check login
    async function isLoggedIn() {
      const { data: { session } } = await supabase.auth.getSession();
      return session !== null;
    }

    // Function to handle form submission
    async function submitForm(event) {
      event.preventDefault();

      if (!await isLoggedIn()) {
        Swal.fire({
          icon: "warning",
          title: "Not Logged In",
          text: "You must be logged in to submit this form.",
          confirmButtonColor: "#ff7f50"
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
          text: "Please select an image!"
        });
        return;
      }

      try {
        // Upload image
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("profile-images")
          .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);

        if (uploadError) throw uploadError;

        const { publicUrl, error: urlError } = supabase.storage
          .from("profile-images")
          .getPublicUrl(uploadData.path);

        if (urlError) throw urlError;

        // Insert data
        const { error: tableError } = await supabase.from("students").insert([
          { name, email, phone, image_url: publicUrl }
        ]);

        if (tableError) throw tableError;

        Swal.fire({
          icon: "success",
          title: "Submitted!",
          text: "Your data has been saved successfully.",
          confirmButtonColor: "#ff7f50"
        });

        form.reset();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message
        });
      }
    }

    // Attach submit listener
    form.addEventListener("submit", submitForm);

  
