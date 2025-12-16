// UI helpers & slider//
function toggleMenu() {
  const navLeft = document.querySelector('.nav-left');
  const navRight = document.querySelector('.nav-right');
  
  navLeft.classList.toggle('show');
  navRight.classList.toggle('show');
}

const slides = document.querySelectorAll('.slides img');
const dots = document.querySelectorAll('.dot');
let current = 0;
let slideInterval;

function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  current = index;
}

function nextSlide() {
  showSlide((current + 1) % slides.length);
}

function currentSlide(index) {
  showSlide(index);
  restartInterval();
}

function restartInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 4000);
}

// 
// Check login status and display username
function checkLoginStatus() {
  const loggedUserRaw = localStorage.getItem("loggedUser");
  const profileContainer = document.querySelector(".profile-container");
  const usernameDisplay = document.getElementById("username-display");
  
  if (!loggedUserRaw) {
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

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize slider
  showSlide(0);
  slideInterval = setInterval(nextSlide, 4000);
  
  // Check login status to show/hide profile elements
  checkLoginStatus();
  
  // Profile dropdown functionality
  const profileBtn = document.getElementById("profileBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  
  if (profileBtn && dropdownMenu) {
    profileBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function(e) {
      if (!profileBtn.contains(e.target)) {
        dropdownMenu.classList.remove("show");
      }
    });
  }
  
  // SIGN OUT FUNCTIONALITY
  const signoutBtn = document.querySelector(".signout");
  if (signoutBtn) {
    signoutBtn.addEventListener("click", async function(e) {
      e.preventDefault();
      
      try {
        // Call backend logout
        const response = await fetch('../Backend/auth.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'logout'
          })
        });
        
        // We don't need to check the response since we're logging out anyway
      } catch (error) {
        console.error('Logout error:', error);
      }
      
      // Remove user data from localStorage
      localStorage.removeItem("loggedUser");
      
      // Redirect to auth page
      window.location.href = "auth.html";
    });
  }
});

document.addEventListener('click', (e) => {
  const navLeft = document.querySelector('.nav-left');
  const navRight = document.querySelector('.nav-right');
  const menuBtn = document.querySelector('.menu-btn');
  
  if (!navLeft.contains(e.target) && !navRight.contains(e.target) && !menuBtn.contains(e.target)) {
    navLeft.classList.remove('show');
    navRight.classList.remove('show');
  }
});