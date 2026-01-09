
import supabase  from "./config.js";


async function createPost() {
  const content = document.getElementById("content").value;
  const file = document.getElementById("image").files[0];
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return alert("Login required");

  let image_url = null;

  if (file) {
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    await supabase.storage.from("post-images").upload(filePath, file);
    const { data } = supabase.storage.from("post-images").getPublicUrl(filePath);
    image_url = data.publicUrl;
  }

  await supabase.from("posts").insert({
    content: content || null,
    image_url,
    user_id: user.id
  });

  window.location.href = "feed.html";
}



// // Check auth
// async function checkAuth() {
//   const { data: { user } } = await supabase.auth.getUser();
//   if(!user) window.location.href="login.html";
//   window.user = user;
//   loadPosts();
// }

// // Logout
// document.getElementById("logoutBtn").onclick = async () => {
//   await supabase.auth.signOut();
//   window.location.href="login.html";
// }

// // Upload image
// async function uploadImage(file) {
//   const fileName = `${window.user.id}_${Date.now()}_${file.name}`;
//   const { data, error } = await supabase.storage.from("post-images").upload(fileName, file);
//   if(error) throw error;
//   const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(fileName);
//   return publicUrl;
// }

// // Add new post
// document.getElementById("addPostBtn").onclick = async () => {
//   const content = document.getElementById("postContent").value.trim();
//   const fileInput = document.getElementById("postImageFile");

//   if(!content && fileInput.files.length===0) return alert("Add text or image");

//   let image_url = null;
//   if(fileInput.files.length > 0) image_url = await uploadImage(fileInput.files[0]);

//   await supabase.from("posts").insert([{content, image_url, user_id: window.user.id}]);
//   document.getElementById("postContent").value = "";
//   fileInput.value = "";
//   loadPosts();
// }

// // Load user posts
// async function loadPosts() {
//   const { data: posts } = await supabase
//     .from("posts")
//     .select("*")
//     .eq("user_id", window.user.id)
//     .order("created_at",{ascending:false});

//   const container = document.getElementById("postsContainer");
//   container.innerHTML = "";

//   posts.forEach(post=>{
//     const card = document.createElement("div");
//     card.className="bg-white rounded shadow overflow-hidden";

//     card.innerHTML = `
//       ${post.image_url?`<img src="${post.image_url}" class="w-full object-cover max-h-[500px]">`:""}
//       <div class="p-3">
//         <textarea class="w-full border p-2 rounded mb-2 editContent">${post.content}</textarea>
//         <button data-id="${post.id}" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 updateBtn">Update</button>
//         <button data-id="${post.id}" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 deleteBtn">Delete</button>
//       </div>
//     `;
//     container.appendChild(card);

//     // Update
//     card.querySelector(".updateBtn").onclick = async e => {
//       const newContent = card.querySelector(".editContent").value.trim();
//       await supabase.from("posts").update({content:newContent}).eq("id", post.id);
//       loadPosts();
//     }

//     // Delete
//     card.querySelector(".deleteBtn").onclick = async e => {
//       await supabase.from("posts").delete().eq("id", post.id);
//       loadPosts();
//     }
//   });
// }

// checkAuth();

