// Create Blog JavaScript
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    
    const createBlogForm = document.getElementById('createBlogForm');
    if (createBlogForm) {
        createBlogForm.addEventListener('submit', handleBlogSubmit);
    }
    
    // Image preview
    const blogImageInput = document.getElementById('blogImage');
    if (blogImageInput) {
        blogImageInput.addEventListener('change', previewImage);
    }
});

// Preview selected image
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('previewImg').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Remove selected image
function removeImage() {
    document.getElementById('blogImage').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('previewImg').src = '';
}

async function handleBlogSubmit(e) {
    e.preventDefault();
    
    // Check if user is logged in
    const loggedUserRaw = localStorage.getItem('loggedUser');
    if (!loggedUserRaw) {
        alert('Please login to create a blog post.');
        window.location.href = 'auth.html';
        return;
    }
    
    try {
        const userData = JSON.parse(loggedUserRaw);
        
        // First, upload the image
        const imageFile = document.getElementById('blogImage').files[0];
        if (!imageFile) {
            alert('Please select an image for your blog post.');
            return;
        }
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        submitBtn.disabled = true;
        
        // Upload image
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await fetch('../Backend/upload_image.php', {
            method: 'POST',
            body: formData
        });
        
        const uploadData = await uploadResponse.json();
        
        if (uploadData.status !== 'success') {
            throw new Error(uploadData.message || 'Failed to upload image');
        }
        
        // Now create the blog post with the uploaded image URL
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Blog...';
        
        const blogData = {
            title: document.getElementById('blogTitle').value,
            category: document.getElementById('blogCategory').value,
            image_url: uploadData.url,
            content: document.getElementById('blogContent').value,
            author_name: userData.name,
            author_email: userData.email,
            user_id: userData.id || null
        };
        
        const response = await fetch('../Backend/blog.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(blogData)
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Blog submitted successfully! Your blog is pending approval and will be published once reviewed by our team.');
            setTimeout(() => {
                window.location.href = 'my-blogs.html';
            }, 500);
        } else {
            throw new Error(data.message || 'Failed to submit blog');
        }
    } catch (error) {
        console.error('Error submitting blog:', error);
        alert('Error: ' + error.message);
        
        // Reset button
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Blog';
        submitBtn.disabled = false;
    }
}

// Check login status
function checkLoginStatus() {
    const loggedUserRaw = localStorage.getItem("loggedUser");

    if (!loggedUserRaw) {
        const profileContainer = document.querySelector(".profile-container");
        const usernameDisplay = document.getElementById("username-display");
        
        if (profileContainer) profileContainer.style.display = "none";
        if (usernameDisplay) usernameDisplay.style.display = "none";
        return;
    }

    let userData;
    try {
        userData = JSON.parse(loggedUserRaw);
    } catch (e) {
        console.warn("Invalid loggedUser data in localStorage");
        return;
    }

    if (userData && userData.name) {
        const usernameDisplay = document.getElementById("username-display");
        const usernameName = document.getElementById("username-name");
        const profileContainer = document.querySelector(".profile-container");

        if (usernameDisplay && usernameName) {
            usernameName.textContent = userData.name;
            usernameDisplay.style.display = "block";
        }
        
        if (profileContainer) {
            profileContainer.style.display = "block";
        }
    }
}
