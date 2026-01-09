// script.js

// Initialize Supabase
import { supabase } from "./config.js";

let currentUser = null;
let currentView = 'profile';

// SweetAlert configuration for dark theme popups
const swalDark = {
  background: '#1e1e1e',
  color: '#ffffff',
  confirmButtonColor: '#667eea',
  cancelButtonColor: '#d33',
  iconColor: '#ffffff'
};

// SINGLE MESSAGE FUNCTION using SweetAlert
function showMessage(message, type = 'info') {
  Swal.fire({
    text: message,
    icon: type,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    ...swalDark
  });
}

// SINGLE LOGOUT FUNCTION
async function logout() {
  try {
    showMessage('Logging out...', 'info');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.clear();
    sessionStorage.clear();
    showMessage('Logged out successfully! 👋', 'success');
  } catch (error) {
    showMessage('Logout failed: ' + error.message, 'error');
    console.error('Logout Error:', error);
  }
}

// Show sections
function showAuth() {
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('profile-section').classList.add('hidden');
  document.getElementById('logged-in-nav').classList.add('hidden');
  document.getElementById('createPostForm').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('profile-section').classList.remove('hidden');
  document.getElementById('logged-in-nav').classList.remove('hidden');
  document.getElementById('createPostForm').classList.remove('hidden');
}

function showProfileView() {
  currentView = 'profile';
  document.getElementById('profile-content').style.display = 'block';
  document.querySelector('#posts-section h2').style.display = 'none';
  document.getElementById('createPostForm').style.display = 'none';
  document.getElementById('posts-list').style.display = 'none';
  loadProfile();
}

function showPostsView() {
  currentView = 'posts';
  document.getElementById('profile-content').style.display = 'none';
  document.querySelector('#posts-section h2').style.display = 'block';
  document.getElementById('createPostForm').style.display = 'block';
  document.getElementById('posts-list').style.display = 'block';
  loadPosts();
}

// Initialize app
async function init() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    showDashboard();
    showProfileView();
  } else {
    showAuth();
  }
  loadPosts();  // Always load posts, even if not logged in
  setupEventListeners();
}

// SINGLE setupEventListeners
function setupEventListeners() {
  // Login
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    showMessage('Logging in...', 'info');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) showMessage(error.message, 'error');
  });

  // Signup
  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value;
    showMessage('Creating account...', 'info');
    
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: name } }
    });
    if (error) showMessage(error.message, 'error');
    else {
      await supabase.from('profiles').insert({
        id: data.user.id,
        display_name: name
      });
      showMessage('Check your email for confirmation!', 'success');
    }
  });

  // Update Profile (with pic upload)
  document.getElementById('updateProfileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('profile-name').value;
    const file = document.getElementById('profile-pic').files[0];
    let avatarUrl = null;

    if (file) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')  // Assuming 'avatars' bucket
        .upload(`${currentUser.id}/${file.name}`, file);
      if (uploadError) {
        showMessage(uploadError.message, 'error');
        return;
      }
      const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(`${currentUser.id}/${file.name}`);
      avatarUrl = publicData.publicUrl;
    }

    const updates = {
      id: currentUser.id,
      display_name: name,
      updated_at: new Date().toISOString()
    };
    if (avatarUrl) updates.avatar_url = avatarUrl;

    const { error } = await supabase.from('profiles').upsert(updates);
    if (error) {
      showMessage(error.message, 'error');
    } else {
      showMessage('Profile updated!', 'success');
      loadProfile();
    }
  });

  // Create Post (requires login)
  document.getElementById('createPostForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
      showMessage('Please login to post!', 'error');
      return;
    }
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    
    const { error } = await supabase.from('posts').insert({
      title, content, user_id: currentUser.id,
      user_name: currentUser.user_metadata?.display_name || currentUser.email
    });
    if (error) {
      showMessage(error.message, 'error');
    } else {
      showMessage('Post created!', 'success');
      document.getElementById('createPostForm').reset();
      loadPosts();
    }
  });

  // Toggle forms
  document.getElementById('showSignup').onclick = () => {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('signup-form').classList.remove('hidden');
  };
  document.getElementById('showLogin').onclick = () => {
    document.getElementById('signup-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
  };
}

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    currentUser = session.user;
    showDashboard();
    showProfileView();
  } else if (event === 'SIGNED_OUT') {
    currentUser = null;
    showAuth();
  }
  loadPosts();
});

// Load Profile
async function loadProfile() {
  const { data } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
  if (data) {
    document.getElementById('user-name').textContent = data.display_name || currentUser.email;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('profile-name').value = data.display_name || '';
    if (data.avatar_url) {
      document.getElementById('user-avatar').src = data.avatar_url;
    }
  }
}

// Load Posts (always loads all posts)
async function loadPosts() {
  const { data: posts } = await supabase.from('posts').select(`
    *, profiles!user_id(display_name, avatar_url)
  `).order('created_at', { ascending: false });
  
  const postsList = document.getElementById('posts-list');
  if (posts?.length) {
    postsList.innerHTML = posts.map(post => `
      <div class="post">
        <div class="post-header">
          <div style="display: flex; align-items: center;">
            <img src="${post.profiles?.avatar_url || 'https://placehold.co/40x40'}" class="post-avatar" alt="Avatar">
            <h3>${post.title}</h3>
          </div>
          ${post.user_id === currentUser?.id ? `
            <div class="post-actions">
              <button class="btn-sm" onclick="editPost('${post.id}', '${post.title.replace(/'/g,"\\'")}', '${post.content.replace(/'/g,"\\'")}')">✏️ Edit</button>
              <button class="btn-sm" onclick="deletePost('${post.id}')">🗑️ Delete</button>
            </div>
          ` : ''}
        </div>
        <p>By: ${post.profiles?.display_name || post.user_name} • ${new Date(post.created_at).toLocaleDateString()}</p>
        <p>${post.content}</p>
      </div>
    `).join('');
  } else {
    postsList.innerHTML = '<div class="post"><p>No posts yet. Create one above!</p></div>';
  }
}

// Global functions for onclick
window.showProfileView = showProfileView;
window.showPostsView = showPostsView;
window.logout = logout;
window.editPost = async (id, title, content) => {
  const newTitle = prompt('Edit title:', title);
  const newContent = prompt('Edit content:', content);
  if (newTitle && newContent) {
    const { error } = await supabase.from('posts').update({ 
      title: newTitle, 
      content: newContent 
    }).eq('id', id).eq('user_id', currentUser.id);
    if (error) showMessage(error.message, 'error');
    else {
      showMessage('Post updated!', 'success');
      loadPosts();
    }
  }
};
window.deletePost = async (id) => {
  const { isConfirmed } = await Swal.fire({
    title: 'Delete this post?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    ...swalDark
  });
  if (isConfirmed) {
    const { error } = await supabase.from('posts').delete().eq('id', id).eq('user_id', currentUser.id);
    if (error) showMessage(error.message, 'error');
    else {
      showMessage('Post deleted!', 'success');
      loadPosts();
    }
  }
};

// Start app
init();