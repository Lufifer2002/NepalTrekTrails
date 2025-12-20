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
    
    // Add event listeners to remove highlighting when user starts typing
    const requiredFields = ['blogTitle', 'blogCategory', 'blogContent'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                this.classList.remove('required-empty');
                const label = document.querySelector(`label[for="${fieldId}"]`);
                if (label) {
                    label.classList.remove('required-label');
                }
            });
        }
    });
    
    // For file input, remove highlighting when a file is selected
    const blogImage = document.getElementById('blogImage');
    if (blogImage) {
        blogImage.addEventListener('change', function() {
            if (this.files.length > 0) {
                this.parentElement.classList.remove('required-empty');
                const label = document.querySelector('label[for="blogImage"]');
                if (label) {
                    label.classList.remove('required-label');
                }
            }
        });
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
    
    // Highlight empty required fields
    highlightEmptyFields();
    
    // Check if user is logged in
    const loggedUserRaw = localStorage.getItem('loggedUser');
    if (!loggedUserRaw) {
        showError('Please login to create a blog post.');
        window.location.href = 'auth.html';
        return;
    }
    
    // Get form values
    const title = document.getElementById('blogTitle').value;
    const category = document.getElementById('blogCategory').value;
    const imageFile = document.getElementById('blogImage').files[0];
    const content = document.getElementById('blogContent').value;
    
    // Validate all fields are filled
    if (!title || !category || !content || !imageFile) {
        showError('Please fill in all required fields (Title, Category, Featured Image, Content)');
        return;
    }
    
    // Validate content length
    if (content.trim().length < 50) {
        showError('Blog content must be at least 50 characters long');
        return;
    }
    
    try {
        const userData = JSON.parse(loggedUserRaw);
        
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

// Highlight empty required fields
function highlightEmptyFields() {
    // Remove existing error highlights
    const errorElements = document.querySelectorAll('.required-empty, .required-label');
    errorElements.forEach(el => {
        el.classList.remove('required-empty', 'required-label');
    });
    
    // Check required fields
    const requiredFields = [
        'blogTitle',
        'blogCategory',
        'blogImage',
        'blogContent'
    ];
    
    let firstEmptyField = null;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if ((field.type === 'file' && !field.files.length) || 
                (field.type !== 'file' && !field.value.trim())) {
                // Highlight the field
                if (field.type === 'file') {
                    field.parentElement.classList.add('required-empty');
                } else {
                    field.classList.add('required-empty');
                }
                
                // Highlight the label
                const label = document.querySelector(`label[for="${fieldId}"]`);
                if (label) {
                    label.classList.add('required-label');
                }
                
                // Store first empty field for focus
                if (!firstEmptyField) {
                    firstEmptyField = field;
                }
            }
        }
    });
    
    // Focus on first empty field
    if (firstEmptyField) {
        firstEmptyField.focus();
    }
}

// Show error message
function showError(message) {
    alert(message);
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
