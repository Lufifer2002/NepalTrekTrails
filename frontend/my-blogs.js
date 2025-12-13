// My Blogs JavaScript
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    loadMyBlogs();
});

async function loadMyBlogs() {
    try {
        const loggedUserRaw = localStorage.getItem('loggedUser');
        if (!loggedUserRaw) {
            window.location.href = 'auth.html';
            return;
        }
        
        const userData = JSON.parse(loggedUserRaw);
        const userEmail = userData.email;
        
        const blogsList = document.getElementById('blogsList');
        blogsList.innerHTML = '<div class="loading">Loading your blogs...</div>';
        
        const response = await fetch(`../Backend/blog.php?email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.blogs && data.blogs.length > 0) {
            displayBlogs(data.blogs);
        } else {
            blogsList.innerHTML = `
                <div class="no-bookings">
                    <i class="fas fa-blog"></i>
                    <h3>No Blogs Yet</h3>
                    <p>You haven't written any blog posts yet.</p>
                    <a href="create-blog.html" class="btn btn-primary">Write Your First Blog</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading blogs:', error);
        document.getElementById('blogsList').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Blogs</h3>
                <p>Failed to load your blogs. Please try again later.</p>
            </div>
        `;
    }
}

function displayBlogs(blogs) {
    const blogsList = document.getElementById('blogsList');
    
    const blogsHTML = blogs.map(blog => `
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-id">
                    <span class="label">Blog ID:</span>
                    <span class="value">#${blog.id}</span>
                </div>
                <div class="booking-status ${blog.status.toLowerCase()}">
                    <span class="status-indicator"></span>
                    <span class="status-text">${capitalizeFirst(blog.status)}</span>
                </div>
            </div>
            
            <div class="booking-details">
                <div class="detail-row">
                    <div class="detail-item" style="flex: 1;">
                        <span class="label">Title:</span>
                        <span class="value" style="font-weight: 600;">${blog.title}</span>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-item">
                        <span class="label">Category:</span>
                        <span class="value">${blog.category}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Published:</span>
                        <span class="value">${formatDateTime(blog.created_at)}</span>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-item" style="flex: 1;">
                        <span class="label">Content Preview:</span>
                        <span class="value">${truncateText(blog.content, 150)}</span>
                    </div>
                </div>
            </div>
            
            <div class="booking-actions">
                <button class="btn btn-secondary" onclick="deleteBlog(${blog.id})">
                    <i class="fas fa-trash"></i> Delete Blog
                </button>
            </div>
        </div>
    `).join('');
    
    blogsList.innerHTML = blogsHTML;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function formatDateTime(dateTimeString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
}

function viewBlog(blogId) {
    // Redirect to blog detail page
    window.location.href = `blog-detail.html?id=${blogId}`;
}

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
            loadMyBlogs(); // Reload the blog list
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog. Please try again.');
    }
}

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