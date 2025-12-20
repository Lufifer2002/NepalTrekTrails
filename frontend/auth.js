// Base path to PHP backend (if needed)
const API_BASE = "../Backend";

// Utility: Show message
function showMessage(text, type = "error") {
  const msg = document.getElementById("message");
  msg.innerHTML = text;
  msg.className = "message " + type;
  msg.style.display = "block";
  
  // Auto-hide success messages after 3 seconds
  if (type === "success") {
    setTimeout(() => {
      msg.style.display = "none";
    }, 3000);
  }
}

// Social Menu Functions
function showSocialMenu() {
  const socialMenu = document.getElementById('socialMenu');
  socialMenu.classList.add('active');
}

function hideSocialMenu() {
  const socialMenu = document.getElementById('socialMenu');
  socialMenu.classList.remove('active');
}

// Toggle between Login and Register forms
function setupFormToggles() {
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toggleText = document.getElementById("toggleText");
  
  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
    toggleText.innerHTML = 
      `Don't have an account? <a href="#" id="showRegister">Sign up</a>`;
    showMessage("", "error");
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
    toggleText.innerHTML = 
      `Already have an account? <a href="#" id="showLogin">Login</a>`;
    showMessage("", "error");
  });

  // Also handle the links in the form footer
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "showRegister") {
      e.preventDefault();
      registerTab.click();
    }
    
    if (e.target && e.target.id === "showLogin") {
      e.preventDefault();
      loginTab.click();
    }
  });
}

// Validate Email Format
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Register Function
async function registerUser() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const confirmPassword = document.getElementById("registerConfirmPassword").value.trim();
  const button = document.getElementById("registerBtn");

  // Validations
  if (!name || !email || !password || !confirmPassword)
    return showMessage("🏔️ All fields are required!", "error");

  if (!isValidEmail(email))
    return showMessage("🏔️ Invalid email address!", "error");

  if (password.length < 6)
    return showMessage("🏔️ Password must be at least 6 characters!", "error");

  if (password !== confirmPassword)
    return showMessage("🏔️ Passwords do not match!", "error");

  // Disable button while loading
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing your trail...';

  // Show loading message
  showMessage("🎒 Preparing your adventure...", "success");

  // Make API call to backend
  try {
    const response = await fetch('../Backend/auth.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'register',
        name: name,
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (data.status === 'success') {
      showMessage("✅ Trail account created! You can now login to start your adventure.", "success");
      
      // Reset button
      button.disabled = false;
      button.innerHTML = originalText;
      
      // Switch to login form after successful registration
      setTimeout(() => {
        document.getElementById("loginTab").click();
        // Clear register form
        document.getElementById("registerName").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";
        document.getElementById("registerConfirmPassword").value = "";
      }, 1500);
    } else {
      // Reset button
      button.disabled = false;
      button.innerHTML = originalText;
      
      // Handle duplicate email specifically
      if (data.message && data.message.includes("Email already registered")) {
        showMessage("🏔️ This email is already registered. Please use a different email or login instead.", "error");
      } else {
        showMessage("❌ " + (data.message || "Registration failed. Please try again."), "error");
      }
    }
  } catch (error) {
    // Reset button
    button.disabled = false;
    button.innerHTML = originalText;
    
    console.error('Registration error:', error);
    showMessage("❌ Network error. Please check your connection and try again.", "error");
  }
}

// Login Function
async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const button = document.getElementById("loginBtn");

  if (!email || !password)
    return showMessage("🏔️ Enter email and password!", "error");

  if (!isValidEmail(email))
    return showMessage("🏔️ Enter a valid email!", "error");

  // Disable button while loading
  const originalText = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Navigating trail...';

  // Show loading message
  showMessage("🥾 Finding your trail path...", "success");

  // Make API call to backend
  try {
    const response = await fetch('../Backend/auth.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'login',
        email: email,
        password: password
      })
    });

    const data = await response.json();

    if (data.status === 'success') {
      showMessage("✅ Trail accessed! Redirecting to your adventure...", "success");
      
      // Store user info in localStorage with the correct key
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem("loggedUser", JSON.stringify(userData));
      
      // Reset button
      button.disabled = false;
      button.innerHTML = originalText;
      
      // Redirect to dashboard after delay
      setTimeout(() => {
        window.location.href = "dashboard.html";
        // Clear login form
        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";
      }, 1500);
    } else {
      // Reset button
      button.disabled = false;
      button.innerHTML = originalText;
      
      showMessage("❌ " + (data.message || "Login failed. Please try again."), "error");
    }
  } catch (error) {
    // Reset button
    button.disabled = false;
    button.innerHTML = originalText;
    
    console.error('Login error:', error);
    showMessage("❌ Network error. Please check your connection and try again.", "error");
  }
}

// Get initials from name
function getInitials(name) {
  return name.substring(0, 2).toUpperCase();
}

// Setup event listeners for buttons
function setupEventListeners() {
  const socialButton = document.getElementById("socialButton");
  const closeMenu = document.getElementById("closeMenu");
  
  if (socialButton) {
    socialButton.addEventListener("click", showSocialMenu);
  }
  
  if (closeMenu) {
    closeMenu.addEventListener("click", hideSocialMenu);
  }
  
  // Close social menu when clicking outside
  document.addEventListener('click', function(event) {
    const socialMenu = document.getElementById('socialMenu');
    const socialButton = document.getElementById('socialButton');
    
    if (socialMenu && socialMenu.classList.contains('active') && 
        !socialMenu.contains(event.target) && 
        !socialButton.contains(event.target)) {
      hideSocialMenu();
    }
  });

  // Button Event Listeners
  document.getElementById("registerBtn").addEventListener("click", registerUser);
  document.getElementById("loginBtn").addEventListener("click", loginUser);

  // Allow form submission with Enter key
  document.getElementById("loginForm").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginUser();
    }
  });

  document.getElementById("registerForm").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      registerUser();
    }
  });
}

// Initialize the page
function initializePage() {
  setupFormToggles();
  setupEventListeners();
  
  // Check if user is already logged in via session
  checkUserSession();
}

// Check user session
async function checkUserSession() {
  try {
    const response = await fetch('../Backend/auth.php', {
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
      // User is already logged in, redirect to dashboard
      window.location.href = 'dashboard.html';
    }
  } catch (error) {
    console.error('Session check error:', error);
  }
}

// Run initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage);