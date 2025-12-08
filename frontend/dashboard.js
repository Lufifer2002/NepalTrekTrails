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
//

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

// Handle Newsletter Subscription
function handleNewsletterSubmit(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value.trim();

  if (!email) {
    alert("Please enter your email address");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Send to backend newsletter API
  fetch("../Backend/newsletter.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert(data.message || "Thank you for subscribing to our newsletter!");
        event.target.reset();
      } else {
        alert(data.message || "Subscription failed. Please try again.");
      }
    })
    .catch((err) => {
      console.error("Newsletter error:", err);
      alert("Server error. Please try again later.");
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize slider
  showSlide(0);
  slideInterval = setInterval(nextSlide, 4000);
  
  // Add event listeners for newsletter forms
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    if (!form.onsubmit) {
      form.addEventListener('submit', handleNewsletterSubmit);
    }
  });
  
  // Check login status to show/hide profile elements
  checkLoginStatus();
  
  // Profile dropdown functionality
  const profileBtn = document.getElementById("profileBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");

  // Toggle dropdown
  if (profileBtn && dropdownMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      // Check if click is outside the profile button and dropdown
      if (!profileBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove("show");
      }
    });

    // SIGN OUT LOGIC
    const signoutBtn = document.querySelector(".signout");
    if (signoutBtn) {
      signoutBtn.addEventListener("click", async () => {
        try {
          // Call backend logout
          await fetch('../Backend/auth.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'logout'
            })
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
        
        // Remove user data from localStorage
        localStorage.removeItem("loggedUser");
        
        // Redirect to auth page
        window.location.href = "auth.html";
      });
    }
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