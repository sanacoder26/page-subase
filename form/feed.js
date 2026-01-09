
import supabase from "./config.js";

let editPostId = null;
let oldImageUrl = null;

async function loadFeed() {
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const feed = document.getElementById("feed");
  feed.innerHTML = "";

  posts.forEach(post => {
    feed.innerHTML += `
      <div class="bg-white mb-6 border">
        ${post.image_url ? `<img src="${post.image_url}" class="w-full">` : ""}
        <div class="p-3 text-sm">
          <p>${post.content || ""}</p>

          ${
            user && user.id === post.user_id
              ? `<button class="text-blue-500 text-xs mt-2"
                   onclick="openEdit(${post.id}, '${post.content || ""}', '${post.image_url || ""}')">
                   Edit
                 </button>`
              : ""
          }
        </div>
      </div>
    `;
  });
}

function openEdit(id, content, imageUrl) {
  editPostId = id;
  oldImageUrl = imageUrl;
  document.getElementById("editContent").value = content;
  document.getElementById("editModal").classList.remove("hidden");
}

function closeEdit() {
  document.getElementById("editModal").classList.add("hidden");
}

async function updatePost() {
  const content = document.getElementById("editContent").value;
  const file = document.getElementById("editImage").files[0];
  const { data: { user } } = await supabase.auth.getUser();

  let image_url = oldImageUrl;

  if (file) {
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    await supabase.storage.from("post-images").upload(filePath, file);
    const { data } = supabase.storage.from("post-images").getPublicUrl(filePath);
    image_url = data.publicUrl;
  }

  await supabase.from("posts")
    .update({ content, image_url })
    .eq("id", editPostId);

  closeEdit();
  loadFeed();
}

loadFeed();


