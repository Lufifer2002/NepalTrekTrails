// Blog Detail Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkLoginStatus();
    
    // Get blog ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');
    
    if (blogId) {
        loadBlogDetail(blogId);
    } else {
        // Redirect to blog page if no ID provided
        window.location.href = 'blog.html';
    }
    
    // Add event listener for delete button
    document.getElementById('deleteBlogBtn').addEventListener('click', function() {
        deleteBlog(blogId);
    });
});

// Load blog detail
async function loadBlogDetail(id) {
    try {
        const response = await fetch(`../Backend/blog.php?id=${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.blog) {
            displayBlogDetail(data.blog);
        } else {
            // If specific blog endpoint doesn't exist, try getting all blogs and filtering
            await loadBlogFromList(id);
        }
    } catch (error) {
        console.error('Error loading blog detail:', error);
        showErrorMessage('Failed to load blog post. Please try again later.');
    }
}

// Alternative method to load blog from list
async function loadBlogFromList(id) {
    try {
        const response = await fetch('../Backend/blog.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.blogs) {
            const blog = data.blogs.find(b => b.id == id);
            if (blog) {
                displayBlogDetail(blog);
            } else {
                showErrorMessage('Blog post not found.');
            }
        } else {
            showErrorMessage('Failed to load blog post.');
        }
    } catch (error) {
        console.error('Error loading blog from list:', error);
        showErrorMessage('Failed to load blog post. Please try again later.');
    }
}

// Display blog detail
function displayBlogDetail(blog) {
    // Update breadcrumb
    document.getElementById('blogTitleBreadcrumb').textContent = blog.title;
    
    // Update blog content
    document.getElementById('blogDetailTitle').textContent = blog.title;
    document.getElementById('blogDetailDate').innerHTML = `<i class="fas fa-calendar"></i> ${formatDate(blog.created_at)}`;
    document.getElementById('blogDetailAuthor').innerHTML = `<i class="fas fa-user"></i> ${blog.author_name}`;
    document.getElementById('blogDetailCategory').innerHTML = `<i class="fas fa-tag"></i> ${blog.category || 'General'}`;
    
    // Set image
    const imageUrl = blog.image_url || 'https://placehold.co/800x400/3498db/ffffff?text=Blog+Image';
    document.getElementById('blogDetailImage').src = imageUrl;
    document.getElementById('blogDetailImage').alt = blog.title;
    
    // Set content (convert newlines to paragraphs)
    const contentWithParagraphs = convertNewlinesToParagraphs(blog.content);
    document.getElementById('blogDetailContent').innerHTML = contentWithParagraphs;
    
    // Check if user is the author and show delete option
    checkUserAuthorization(blog);
}

// Check if the current user is the author of the blog
function checkUserAuthorization(blog) {
    const loggedUserRaw = localStorage.getItem("loggedUser");
    
    if (loggedUserRaw) {
        try {
            const userData = JSON.parse(loggedUserRaw);
            
            // Show "My Blogs" link for logged in users
            document.getElementById('myBlogsLink').style.display = 'inline-flex';
            
            // If user is the author, show delete button
            if (userData.email === blog.author_email) {
                document.getElementById('blogActions').style.display = 'block';
            }
        } catch (e) {
            console.warn("Invalid loggedUser data in localStorage");
        }
    }
}

// Convert newlines to paragraphs
function convertNewlinesToParagraphs(text) {
    if (!text) return '';
    
    // Split by double newlines (paragraphs)
    const paragraphs = text.split('\n\n');
    
    // Convert each paragraph to <p> tags
    return paragraphs.map(p => {
        // Replace single newlines with <br> tags within paragraphs
        const formatted = p.replace(/\n/g, '<br>');
        return `<p>${formatted}</p>`;
    }).join('');
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Show error message
function showErrorMessage(message) {
    const contentContainer = document.querySelector('.blog-post-content');
    contentContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error Loading Blog</h3>
            <p>${message}</p>
            <a href="blog.html" class="btn btn-primary">Back to All Blogs</a>
        </div>
    `;
}

// Check login status and display username
function checkLoginStatus() {
    const loggedUserRaw = localStorage.getItem("loggedUser");

    if (!loggedUserRaw) {
        // Hide profile container and username display if not logged in
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
        // Display username on left
        const usernameDisplay = document.getElementById("username-display");
        const usernameName = document.getElementById("username-name");
        const profileContainer = document.querySelector(".profile-container");

        if (usernameDisplay && usernameName) {
            usernameName.textContent = userData.name;
            usernameDisplay.style.display = "block";
        }
        
        // Show profile container
        if (profileContainer) {
            profileContainer.style.display = "block";
        }
    }
}

// Delete blog function
async function deleteBlog(blogId) {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch('../Backend/blog.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: blogId })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Blog deleted successfully!');
            // Redirect to my blogs page
            window.location.href = 'my-blogs.html';
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog. Please try again.');
    }
}