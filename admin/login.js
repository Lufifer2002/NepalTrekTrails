// Admin Login Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Check if already logged in
    checkAdminSession();
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        try {
            const response = await fetch('../Backend/admin_auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email: username,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Store admin info in localStorage as backup
                localStorage.setItem('adminUser', JSON.stringify({
                    email: username,
                    loggedIn: true,
                    sessionId: data.session_id
                }));
                
                // Show success message
                alert('Login successful! Welcome Admin.');
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message || 'Invalid username or password');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Network error. Please check your connection.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    });
});

// Check admin session
async function checkAdminSession() {
    try {
        const response = await fetch('../Backend/admin_auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'check_session'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success' && data.logged_in) {
            // Already logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Session check error:', error);
    }
}