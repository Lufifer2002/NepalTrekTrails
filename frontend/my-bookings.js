// My Bookings Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    checkLoginStatus();
    
    // Load user bookings
    loadUserBookings();
});

// Load user bookings
async function loadUserBookings() {
    try {
        // Get logged in user data
        const loggedUserRaw = localStorage.getItem("loggedUser");
        if (!loggedUserRaw) {
            window.location.href = 'auth.html';
            return;
        }
        
        const userData = JSON.parse(loggedUserRaw);
        const userEmail = userData.email;
        
        if (!userEmail) {
            window.location.href = 'auth.html';
            return;
        }
        
        // Show loading state
        const bookingsList = document.getElementById('bookingsList');
        bookingsList.innerHTML = '<div class="loading">Loading your bookings...</div>';
        
        // Fetch bookings from backend
        const response = await fetch(`../Backend/user_bookings.php?email=${encodeURIComponent(userEmail)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.bookings && data.bookings.length > 0) {
            displayBookings(data.bookings);
        } else {
            bookingsList.innerHTML = `
                <div class="no-bookings">
                    <i class="fas fa-calendar-times"></i>
                    <h3>No Bookings Found</h3>
                    <p>You haven't made any bookings yet.</p>
                    <a href="packages.html" class="btn btn-primary">Browse Packages</a>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        document.getElementById('bookingsList').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Bookings</h3>
                <p>Failed to load your bookings. Please try again later.</p>
                <button class="btn btn-primary" onclick="loadUserBookings()">Retry</button>
            </div>
        `;
    }
}

// Display bookings in the list
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    const bookingsHTML = bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-id">
                    <span class="label">Booking ID:</span>
                    <span class="value">#${booking.id}</span>
                </div>
                <div class="booking-status ${booking.status.toLowerCase()}">
                    <span class="status-indicator"></span>
                    <span class="status-text">${booking.status}</span>
                </div>
            </div>
            
            <div class="booking-details">
                <div class="detail-row">
                    <div class="detail-item">
                        <span class="label">Package:</span>
                        <span class="value">${booking.package_name}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Travel Date:</span>
                        <span class="value">${formatDate(booking.travel_date)}</span>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-item">
                        <span class="label">People:</span>
                        <span class="value">${booking.people_count}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Payment Method:</span>
                        <span class="value">${formatPaymentMethod(booking.payment_option)}</span>
                    </div>
                </div>
                
                <div class="detail-row">
                    <div class="detail-item">
                        <span class="label">Booked On:</span>
                        <span class="value">${formatDateTime(booking.created_at)}</span>
                    </div>
                </div>
            </div>
            
            <div class="booking-actions">
                <button class="btn btn-outline" onclick="viewBookingDetails(${booking.id})">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${booking.status.toLowerCase() === 'pending' && booking.payment_option === 'Esewa' ? 
                `<button class="btn btn-primary" onclick="retryPayment(${booking.id}, ${booking.package_price || 0})">
                    <i class="fas fa-credit-card"></i> Pay Now
                </button>` : ''}
                <button class="btn btn-secondary" onclick="cancelBooking(${booking.id})">
                    <i class="fas fa-times"></i> Cancel Booking
                </button>
            </div>
        </div>
    `).join('');
    
    bookingsList.innerHTML = bookingsHTML;
}

// Retry payment for a pending booking
function retryPayment(bookingId, amount) {
    // Generate a unique transaction ID for eSewa (booking ID + timestamp)
    const transactionId = bookingId + '_' + Date.now();
    
    // Store booking info in localStorage for use after payment
    localStorage.setItem('currentBooking', JSON.stringify({
        booking_id: bookingId,
        transaction_id: transactionId,
        amount: amount
    }));
    
    // Redirect to eSewa payment page with unique transaction ID
    window.location.href = `../Backend/esewaPay.php?orderId=${transactionId}&bookingId=${bookingId}&amount=${amount}`;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format datetime
function formatDateTime(dateTimeString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateTimeString).toLocaleDateString(undefined, options);
}

// Format payment method
function formatPaymentMethod(method) {
    const methods = {
        'Esewa': 'eSewa',
        'credit_card': 'Credit Card',
        'paypal': 'PayPal',
        'bank_transfer': 'Bank Transfer'
    };
    return methods[method] || method;
}

// View booking details
function viewBookingDetails(bookingId) {
    alert(`Viewing details for booking #${bookingId}\n(This would open a detailed view in a real implementation)`);
}

// Cancel booking
function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        alert(`Canceling booking #${bookingId}\n(This would process the cancellation in a real implementation)`);
    }
}

// Check login status and display username
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