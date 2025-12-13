// Blog Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load approved blogs
    loadApprovedBlogs();
});

// Load approved blogs for public display
async function loadApprovedBlogs() {
    try {
        const response = await fetch('../Backend/blog.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.blogs && data.blogs.length > 0) {
            displayBlogs(data.blogs);
        } else {
            document.getElementById('blogGrid').innerHTML = `
                <div class="no-blogs">
                    <i class="fas fa-newspaper"></i>
                    <h3>No Published Blogs Yet</h3>
                    <p>Check back later for exciting travel stories and trekking guides.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading blogs:', error);
        document.getElementById('blogGrid').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Blogs</h3>
                <p>Failed to load travel stories. Please try again later.</p>
                <button class="btn btn-primary" onclick="loadApprovedBlogs()">Retry</button>
            </div>
        `;
    }
}

// Display blogs in the grid
function displayBlogs(blogs) {
    const blogGrid = document.getElementById('blogGrid');
    
    const blogsHTML = blogs.map(blog => `
        <article class="blog-card">
            <div class="blog-image">
                <img src="${blog.image_url || 'https://placehold.co/600x400/3498db/ffffff?text=Blog+Image'}" alt="${blog.title}">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-date"><i class="fas fa-calendar"></i> ${formatDate(blog.created_at)}</span>
                    <span class="blog-author"><i class="fas fa-user"></i> ${blog.author_name}</span>
                </div>
                <h3 class="blog-title">${blog.title}</h3>
                <p class="blog-excerpt">${truncateText(blog.content, 120)}</p>
                <a href="blog-detail.html?id=${blog.id}" class="blog-read-more">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `).join('');
    
    blogGrid.innerHTML = blogsHTML;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// View blog - now redirects to blog detail page
function viewBlog(blogId) {
    window.location.href = `blog-detail.html?id=${blogId}`;
}