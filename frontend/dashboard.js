
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
document.addEventListener('DOMContentLoaded', () => {
  showSlide(0);
  slideInterval = setInterval(nextSlide, 4000);
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
// 
// Check login status and display username
//
function checkLoginStatus() {
  const loggedUserEmail = localStorage.getItem("loggedUser");
  
  if (loggedUserEmail) {
    // User is logged in
    const userData = JSON.parse(localStorage.getItem(loggedUserEmail));
    
    if (userData && userData.name) {
      // Display username on left
      const usernameDisplay = document.getElementById("username-display");
      const usernameName = document.getElementById("username-name");
      
      if (usernameDisplay && usernameName) {
        usernameName.textContent = userData.name;
        usernameDisplay.style.display = "block";
      }
      
      // Display sign out button on right
      const signoutDisplay = document.getElementById("signout-display");
      if (signoutDisplay) {
        signoutDisplay.style.display = "block";
      }
    }
  }
}

// Sign out function
function signOut() {
  // Clear the logged user session
  localStorage.removeItem("loggedUser");
  
  // Redirect to dashboard (home page)
  window.location.href = "dashboard.html";
}

// Check login status when page loads
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
});
// Handle Newsletter Subscription
function handleNewsletterSubmit(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value.trim();
  
  if (!email) {
    alert('Please enter your email address');
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }
  
  // Store newsletter subscription
  let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
    alert('Thank you for subscribing to our newsletter!');
    event.target.reset();
  } else {
    alert('You are already subscribed to our newsletter!');
  }
}