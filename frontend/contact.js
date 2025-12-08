// Base path to PHP backend
const API_BASE = "../Backend";

// Handle contact form submission
function handleContactSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();
  const formMessage = document.getElementById("form-message");
  
  // Basic validation
  if (!name || !email || !subject || !message) {
    formMessage.textContent = "Please fill in all required fields.";
    formMessage.style.color = "red";
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    formMessage.style.color = "red";
    return;
  }
  
  // Show loading message
  formMessage.textContent = "Sending your message...";
  formMessage.style.color = "black";
  
  // Send to backend
  fetch(`${API_BASE}/contact.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, subject, message }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        formMessage.textContent = data.message || "Thank you for contacting us! We'll get back to you soon.";
        formMessage.style.color = "green";
        form.reset();
      } else {
        formMessage.textContent = data.message || "Failed to send message. Please try again.";
        formMessage.style.color = "red";
      }
    })
    .catch((err) => {
      console.error("Contact error:", err);
      formMessage.textContent = "Server error. Please try again later.";
      formMessage.style.color = "red";
    });
}