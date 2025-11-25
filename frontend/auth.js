// Switch to Login Form
function showLogin() {
  document.getElementById("form-title").innerText = "Login";

  document.getElementById("name").style.display = "none";
  document.getElementById("confirmPassword").style.display = "none";

  document.getElementById("registerBtn").style.display = "none";
  document.getElementById("loginBtn").style.display = "block";

  document.getElementById("toggleText").innerHTML =
    `Don't have an account? <span onclick="showRegister()">Register</span>`;
}

// Switch to Register Form
function showRegister() {
  document.getElementById("form-title").innerText = "Register";

  document.getElementById("name").style.display = "block";
  document.getElementById("confirmPassword").style.display = "block";

  document.getElementById("registerBtn").style.display = "block";
  document.getElementById("loginBtn").style.display = "none";

  document.getElementById("toggleText").innerHTML =
    `Already have an account? <span onclick="showLogin()">Login</span>`;
}

// REGISTER
document.getElementById("registerBtn").onclick = () => {
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let confirmPassword = document.getElementById("confirmPassword").value.trim();
  let msg = document.getElementById("message");

  // Validations
  if (!name || !email || !password || !confirmPassword) {
    msg.innerHTML = "❌ All fields are required!";
    msg.style.color = "red";
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    msg.innerHTML = "❌ Invalid email address!";
    msg.style.color = "red";
    return;
  }

  if (password.length < 6) {
    msg.innerHTML = "❌ Password must be at least 6 characters!";
    msg.style.color = "red";
    return;
  }

  if (password !== confirmPassword) {
    msg.innerHTML = "❌ Passwords do not match!";
    msg.style.color = "red";
    return;
  }

  if (localStorage.getItem(email)) {
    msg.innerHTML = "❌ Email already registered!";
    msg.style.color = "red";
    return;
  }

  // Save user in localStorage
  let user = { name, email, password };
  localStorage.setItem(email, JSON.stringify(user));

  msg.innerHTML = "✅ Registration successful! Redirecting...";
  msg.style.color = "green";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1200);
};

// LOGIN
document.getElementById("loginBtn").onclick = () => {
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let msg = document.getElementById("message");

  if (!email || !password) {
    msg.innerHTML = "❌ Enter email & password!";
    msg.style.color = "red";
    return;
  }

  let user = JSON.parse(localStorage.getItem(email));

  if (!user) {
    msg.innerHTML = "❌ User not found!";
    msg.style.color = "red";
    return;
  }

  if (password !== user.password) {
    msg.innerHTML = "❌ Incorrect password!";
    msg.style.color = "red";
    return;
  }

  // Save login session
  localStorage.setItem("loggedUser", email);

  msg.innerHTML = "✅ Login successful! Redirecting...";
  msg.style.color = "green";

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1200);
};
