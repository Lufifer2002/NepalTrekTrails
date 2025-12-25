// ================================
// My Bookings Page Functionality
// ================================

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadUserBookings();
});

// ================================
// Load User Bookings
// ================================
async function loadUserBookings() {
    try {
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

        const bookingsList = document.getElementById('bookingsList');
        bookingsList.innerHTML = `<div class="loading">Loading your bookings...</div>`;

        const response = await fetch(
            `../Backend/user_bookings.php?email=${encodeURIComponent(userEmail)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'success' && data.bookings.length > 0) {
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
        console.error(error);
        document.getElementById('bookingsList').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Bookings</h3>
                <p>Please try again later.</p>
                <button class="btn btn-primary" onclick="loadUserBookings()">Retry</button>
            </div>
        `;
    }
}

// ================================
// Display Bookings
// ================================
function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');

    bookingsList.innerHTML = bookings.map(booking => {
        const status = booking.status.toLowerCase();

        const showPayNow =
            status === 'pending' &&
            booking.payment_option === 'Esewa';

        const showCancel =
            ['pending', 'confirmed', 'payment_failed'].includes(status);

        return `
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-id">
                    <span class="label">Booking ID:</span>
                    <span class="value">#${booking.id}</span>
                </div>

                <div class="booking-status ${status}">
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
                        <span class="label">Payment:</span>
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

                ${showPayNow ? `
                <button class="btn btn-primary"
                    onclick="retryPayment(${booking.id}, ${booking.total_amount || 0}, ${booking.paid_amount || 0})">
                    <i class="fas fa-credit-card"></i> Pay Now
                </button>` : ''}

                ${showCancel ? `
                <button class="btn btn-secondary"
                    onclick="cancelBooking(${booking.id})">
                    <i class="fas fa-times"></i> Cancel Booking
                </button>` : ''}
            </div>
        </div>
        `;
    }).join('');
}

// ================================
// Retry Payment
// ================================
function retryPayment(bookingId, totalAmount, paidAmount = 0) {
    // Calculate the amount to pay based on booking status and payments already made
    // If no payment has been made yet (paidAmount is 0), take 10% deposit
    // If some payment has been made, calculate the remaining balance
    
    let amountToPay;
    if (paidAmount === 0) {
        // If no payment has been made yet, take 10% deposit
        amountToPay = totalAmount * 0.10;
    } else {
        // If there's already a payment, calculate the remaining balance
        const remainingBalance = totalAmount - paidAmount;
        amountToPay = remainingBalance;
    }
    
    // Ensure the amount to pay is not negative or zero
    if (amountToPay <= 0) {
        alert('No amount is due for payment.');
        return;
    }
    
    const transactionId = bookingId + "_" + Date.now();

    localStorage.setItem("currentBooking", JSON.stringify({
        booking_id: bookingId,
        transaction_id: transactionId,
        amount: totalAmount,
        paid_amount: paidAmount,
        amount_to_pay: amountToPay
    }));

    // Use the calculated amount for the payment
    window.location.href =
        `../Backend/esewaPay.php?orderId=${transactionId}&bookingId=${bookingId}&amount=${amountToPay}`;
}

// ================================
// Cancel Booking
// ================================
async function cancelBooking(bookingId) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
        const user = JSON.parse(localStorage.getItem("loggedUser"));
        if (!user || !user.email) {
            alert("Please login first");
            return;
        }

        const response = await fetch('../Backend/cancel_booking.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                booking_id: bookingId,
                email: user.email
            })
        });

        const data = await response.json();

        if (data.status === 'success') {
            alert("Booking cancelled successfully");
            loadUserBookings();
        } else {
            alert(data.message || "Cancellation failed");
        }
    } catch (err) {
        console.error(err);
        alert("Error cancelling booking");
    }
}

// ================================
// Helpers
// ================================
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateStr) {
    return new Date(dateStr).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatPaymentMethod(method) {
    const map = {
        'Esewa': 'eSewa',
        'credit_card': 'Credit Card',
        'paypal': 'PayPal',
        'bank_transfer': 'Bank Transfer'
    };
    return map[method] || method;
}

// ================================
// View Booking (Placeholder)
// ================================
function viewBookingDetails(id) {
    // Redirect to package detail page with booking ID
    // We'll pass the booking ID as a parameter so we can fetch the booking details
    window.location.href = `package-detail.html?bookingId=${id}`;
}

// ================================
// Login Status / Header UI
// ================================
function checkLoginStatus() {
    const loggedUserRaw = localStorage.getItem("loggedUser");
    const profile = document.querySelector(".profile-container");
    const usernameDisplay = document.getElementById("username-display");
    const usernameName = document.getElementById("username-name");

    if (!loggedUserRaw) {
        if (profile) profile.style.display = "none";
        if (usernameDisplay) usernameDisplay.style.display = "none";
        return;
    }

    const user = JSON.parse(loggedUserRaw);
    if (usernameName) usernameName.textContent = user.name || "User";
    if (usernameDisplay) usernameDisplay.style.display = "block";
    if (profile) profile.style.display = "block";
}
