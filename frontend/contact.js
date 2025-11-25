// Handle Contact Form Submission
function handleContactSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();
  const messageElement = document.getElementById('form-message');
  
  // Basic validation
  if (!name || !email || !subject || !message) {
    showFormMessage('Please fill in all required fields', 'error');
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showFormMessage('Please enter a valid email address', 'error');
    return;
  }
  
  // Store contact message (in a real app, this would be sent to a server)
  const contactData = {
    name: name,
    email: email,
    phone: phone || 'Not provided',
    subject: subject,
    message: message,
    date: new Date().toISOString()
  };
  
  // Save to localStorage (for demo purposes)
  try {
    let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push(contactData);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    
    // Show success message
    showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
    
    // Reset form
    form.reset();
    
    // Clear message after 5 seconds
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.className = 'form-message';
    }, 5000);
  } catch (error) {
    console.error('Error saving contact:', error);
    showFormMessage('An error occurred. Please try again.', 'error');
  }
}

function showFormMessage(text, type) {
  const messageElement = document.getElementById('form-message');
  messageElement.textContent = text;
  messageElement.className = `form-message ${type}`;
}