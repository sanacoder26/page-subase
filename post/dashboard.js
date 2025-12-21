import supabase  from "./config.js";

  document.getElementById("surveyForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const age = document.getElementById("age").value;
      const feedback = document.getElementById("feedback").value.trim();
      const imageFile = document.getElementById("image").files[0];

      if (!imageFile) {
        Swal.fire({
          icon: "warning",
          title: "Image required",
          text: "Please select an image before submitting",
          showClass: { popup: "animate__animated animate__fadeInDown" }
        });
        return;
      }

      Swal.fire({
        title: "Submitting survey",
        text: "Please wait...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      // Get logged-in user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        Swal.fire({
          icon: "error",
          title: "Login required",
          text: "Please login first"
        });
        return;
      }

      // Upload image
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("survey-images")
        .upload(fileName, imageFile);
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("survey-images")
        .getPublicUrl(fileName);
      const imageUrl = publicData.publicUrl;

      // Insert survey data
      const { error: insertError } = await supabase.from("surveys").insert([
        { user_id: user.id, name, email, age: parseInt(age), feedback, image_url: imageUrl }
      ]);
      if (insertError) throw insertError;

      Swal.fire({
        icon: "success",
        title: "Survey submitted",
        text: "Thank you for your feedback",
        showClass: { popup: "animate__animated animate__zoomIn" }
      });

      document.getElementById("surveyForm").reset();

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: err.message || "Please try again later",
        showClass: { popup: "animate__animated animate__shakeX" }
      });
    }
  });
const { data: { user } } = await supabase.auth.getUser();
console.log(user.id); // should NOT be null

