// Package Detail Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check login status first
    checkLoginStatus();
    
    // Get package ID or booking ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    const bookingId = urlParams.get('bookingId');
    
    if (bookingId) {
        // Load booking details if booking ID is provided
        loadBookingDetails(bookingId);
    } else if (packageId) {
        // Load package details if package ID is provided
        loadPackageDetails(packageId);
    } else {
        window.location.href = 'packages.html';
    }
    
    // Booking form submission
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBooking();
        });
    }
    
    // Add event listener for people count dropdown to update price
    const peopleCountDropdown = document.getElementById('peopleCount');
    if (peopleCountDropdown) {
        peopleCountDropdown.addEventListener('change', updateTotalPrice);
    }
    
    // Book now button
    const bookNowBtn = document.getElementById('bookNowBtn');
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', function() {
            // Check if user is logged in before showing booking modal
            const loggedUserRaw = localStorage.getItem('loggedUser');
            if (!loggedUserRaw) {
                alert('Please login to book this package.');
                window.location.href = 'auth.html';
                return;
            }
            
            // Pre-fill form with user data
            try {
                const userData = JSON.parse(loggedUserRaw);
                if (userData.name) document.getElementById('customerName').value = userData.name;
                if (userData.email) document.getElementById('customerEmail').value = userData.email;
            } catch (e) {
                console.warn('Error parsing user data:', e);
            }
            
            // Update the total price when opening the modal
            updateTotalPrice();
            
            document.getElementById('bookingModal').style.display = 'block';
        });
    }
    
    // Wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            const icon = wishlistBtn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                icon.style.color = '#e74c3c';
                alert('Package saved to your wishlist!');
            } else {
                icon.classList.replace('fas', 'far');
                icon.style.color = '';
                alert('Package removed from your wishlist.');
            }
        });
    }
    
    // Close modal
    const closeModal = document.querySelector('.close');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            document.getElementById('bookingModal').style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('bookingModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Expand all itinerary items
    const expandAllBtn = document.querySelector('.expand-all');
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function() {
            const dayDetails = document.querySelectorAll('.day-details');
            dayDetails.forEach(detail => {
                detail.style.display = detail.style.display === 'none' ? 'block' : 'none';
            });
        });
    }
    
});

// Global variable to store the base price per person
let basePricePerPerson = 0;

// Function to update the total price based on number of people
function updateTotalPrice() {
    // Get the base price per person from the modal
    const basePriceElement = document.getElementById('modalPackagePrice');
    if (!basePriceElement) return;
    
    // Get the people count
    const peopleCountElement = document.getElementById('peopleCount');
    if (!peopleCountElement) return;
    
    const peopleCount = parseInt(peopleCountElement.value) || 1;
    
    // Calculate total price
    const totalPrice = basePricePerPerson * peopleCount;
    
    // Update the displayed price
    basePriceElement.textContent = totalPrice.toFixed(2);
}

// Load package details
async function loadPackageDetails(id) {
    try {
        // Fetch specific package by ID from backend
        const response = await fetch(`../Backend/package.php?id=${id}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.package) {
            const pkg = data.package;
            
            // Update breadcrumb
            document.getElementById('breadcrumbPackage').textContent = pkg.name;
            
            // Update DOM with package details
            document.getElementById('packageName').textContent = pkg.name;
            document.getElementById('packageDuration').textContent = `${pkg.duration} days`;
            document.getElementById('packageDifficulty').textContent = pkg.difficulty || 'Moderate';
            document.getElementById('packagePrice').textContent = parseFloat(pkg.price).toFixed(2);
            document.getElementById('packageDescription').textContent = pkg.description || 'No description available.';
            document.getElementById('packageImage').src = pkg.image_url || 'https://via.placeholder.com/600x400?text=Package+Image';
            
            // Set package ID in booking form
            document.getElementById('packageId').value = pkg.id;
            
            // Update modal package info
            document.getElementById('modalPackageName').textContent = pkg.name;
            document.getElementById('modalPackageDuration').textContent = `${pkg.duration} days`;
            document.getElementById('modalPackagePrice').textContent = parseFloat(pkg.price).toFixed(2);
            
            // Store the base price per person for calculations
            basePricePerPerson = parseFloat(pkg.price) || 0;
            
            // Initialize the total price display
            updateTotalPrice();
            
            // Load additional package information
            loadAdditionalPackageInfo(pkg);
            
            // Load thumbnail gallery
            loadThumbnailGallery(pkg);
        } else {
            // Package not found or error occurred
            alert(data.message || 'Package not found.');
            window.location.href = 'packages.html';
        }
    } catch (error) {
        console.error('Error loading package details:', error);
        alert('Error loading package details. Please try again.');
        window.location.href = 'packages.html';
    }
}

// Load booking details
async function loadBookingDetails(bookingId) {
    try {
        // Get user email from localStorage
        const loggedUserRaw = localStorage.getItem('loggedUser');
        if (!loggedUserRaw) {
            alert('Please login to view booking details.');
            window.location.href = 'auth.html';
            return;
        }
        
        let userData;
        try {
            userData = JSON.parse(loggedUserRaw);
        } catch (e) {
            console.error('Error parsing user data:', e);
            alert('Error loading user data. Please login again.');
            window.location.href = 'auth.html';
            return;
        }
        
        // Fetch user's bookings from backend
        const response = await fetch('../Backend/user_bookings.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'list',
                email: userData.email
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success' && data.bookings) {
            // Find the specific booking by ID
            const booking = data.bookings.find(b => b.id == bookingId);
            
            if (booking) {
                // Update page title and breadcrumb
                document.title = `Booking #${booking.id} - Nepal Trek Trails`;
                document.getElementById('breadcrumbPackage').textContent = `Booking #${booking.id}`;
                
                // Show only the booking information div
                let bookingInfoHTML = `
                    <div class="booking-form-details">
                        <h3>Booking Information</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <strong>Booking ID:</strong>
                                <span>${booking.id}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Package:</strong>
                                <span>${booking.package_name}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Full Name:</strong>
                                <span>${booking.customer_name}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Email:</strong>
                                <span>${booking.email}</span>
                            </div>
                `;
                
                // Only show phone if it was provided
                if (booking.phone && booking.phone.trim() !== '') {
                    bookingInfoHTML += `
                        <div class="detail-item">
                            <strong>Phone:</strong>
                            <span>${booking.phone}</span>
                        </div>
                    `;
                }
                
                bookingInfoHTML += `
                            <div class="detail-item">
                                <strong>Number of People:</strong>
                                <span>${booking.people_count}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Travel Date:</strong>
                                <span>${booking.travel_date}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Payment Method:</strong>
                                <span>${booking.payment_option}</span>
                            </div>
                `;
                
                // Show payment details if booking is confirmed
                if (booking.status === 'confirmed') {
                    const totalAmount = parseFloat(booking.total_amount || 0);
                    const paidAmount = parseFloat(booking.paid_amount || 0);
                    const remainingAmount = totalAmount - paidAmount;
                    
                    bookingInfoHTML += `
                        <div class="detail-item">
                            <strong>Paid Amount:</strong>
                            <span>Rs. ${paidAmount.toFixed(2)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Remaining Amount:</strong>
                            <span>Rs. ${remainingAmount.toFixed(2)}</span>
                        </div>
                        <div class="detail-item">
                            <strong>Transaction ID:</strong>
                            <span>${booking.transaction_id || 'N/A'}</span>
                        </div>
                    `;
                }
                
                // Only show special requests if provided
                if (booking.special_requests && booking.special_requests.trim() !== '') {
                    bookingInfoHTML += `
                        <div class="detail-item full-width">
                            <strong>Special Requests:</strong>
                            <span>${booking.special_requests}</span>
                        </div>
                    `;
                }
                
                bookingInfoHTML += `
                            <div class="detail-item">
                                <strong>Status:</strong>
                                <span class="status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Booking Date:</strong>
                                <span>${new Date(booking.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                // Show action buttons based on booking status
                let actionButtonsHTML = '';
                if (booking.status === 'pending' || booking.status === 'failed') {
                    actionButtonsHTML = `
                        <div class="booking-actions-detail">
                            <button class="btn btn-primary" onclick="retryPayment(${booking.id}, ${parseFloat(booking.total_amount || 0)})">
                                <i class="fas fa-credit-card"></i> Pay Now
                            </button>
                            <button class="btn btn-secondary" onclick="cancelBookingFromDetail(${booking.id})">
                                <i class="fas fa-times"></i> Cancel Booking
                            </button>
                        </div>
                    `;
                } else if (booking.status === 'confirmed') {
                    // Show only cancel button for confirmed bookings
                    actionButtonsHTML = `
                        <div class="booking-actions-detail">
                            <button class="btn btn-secondary" onclick="cancelBookingFromDetail(${booking.id})">
                                <i class="fas fa-times"></i> Cancel Booking
                            </button>
                        </div>
                    `;
                }
                
                // Add action buttons after the description
                const actionContainer = document.createElement('div');
                actionContainer.innerHTML = actionButtonsHTML;
                document.getElementById('packageDescription').parentNode.insertBefore(actionContainer, document.getElementById('packageDescription').nextSibling);

                // Set the content to only the booking information
                document.getElementById('packageDescription').innerHTML = bookingInfoHTML;
                
                // Hide booking button since this is already booked
                const bookNowBtn = document.getElementById('bookNowBtn');
                if (bookNowBtn) {
                    bookNowBtn.style.display = 'none';
                }
                
                // Update page heading to indicate this is a booking detail view
                const heading = document.querySelector('.package-heading h1');
                if (heading) {
                    heading.textContent = `Booking Details #${booking.id}`;
                }
                
                // Hide all other sections except the main content
                const highlightsSection = document.querySelector('.package-highlights');
                if (highlightsSection) {
                    highlightsSection.style.display = 'none';
                }
                
                // Hide all info sections (itinerary, what's included, gallery, map, recommendations)
                const infoSections = document.querySelectorAll('.info-section');
                infoSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // Also hide the package gallery section
                const packageGallery = document.querySelector('.package-gallery');
                if (packageGallery) {
                    packageGallery.style.display = 'none';
                }
                
                // Hide the package actions section (contains Save for Later button)
                const packageActions = document.querySelector('.package-actions');
                if (packageActions) {
                    packageActions.style.display = 'none';
                }
                
                // Hide the package meta section (duration, difficulty, price, rating)
                const packageMeta = document.querySelector('.package-meta');
                if (packageMeta) {
                    packageMeta.style.display = 'none';
                }
                
                // Hide the "About This Trek" heading, but keep the description container for booking info
                const aboutHeading = document.querySelector('.package-description h3');
                if (aboutHeading) {
                    aboutHeading.style.display = 'none';
                }

            } else {
                // Booking not found
                alert('Booking not found.');
                window.location.href = 'my-bookings.html';
            }
        } else {
            // Error occurred
            alert(data.message || 'Error loading booking details.');
            window.location.href = 'my-bookings.html';
        }
    } catch (error) {
        console.error('Error loading booking details:', error);
        alert('Error loading booking details. Please try again.');
        window.location.href = 'my-bookings.html';
    }
}

// Load thumbnail gallery
function loadThumbnailGallery(pkg) {
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    
    let thumbnails = [];
    
    // Check if gallery URLs are provided in database
    if (pkg.gallery_urls && pkg.gallery_urls.trim()) {
        thumbnails = pkg.gallery_urls.split(',').filter(url => url.trim()).map(url => url.trim());
    }
    
    // If no database gallery, use sample thumbnails
    if (thumbnails.length === 0) {
        const sampleThumbnails = {
            1: [ // Everest Base Camp Trek
                'https://api.luxuryholidaynepal.com/media/attachments/media-1f303bbb-1756878207.jpg',
                'https://www.nepaltrekhub.com/wp-content/uploads/2020/12/tilicho-lake-trek.jpg',
                'https://completewellbeing.com/wp-content/uploads/2014/04/discover-the-beauty-of-trekking.jpg',
                'https://www.trekkersofindia.com/product/1805634489060260.webp'
            ],
            2: [ // Annapurna Circuit Trek
                'https://www.nepaltrekhub.com/wp-content/uploads/2020/12/tilicho-lake-trek.jpg',
                'https://api.luxuryholidaynepal.com/media/blog/banner/top-trekking-destinations-in-nepal-for-2022.jpg',
                'https://api.luxuryholidaynepal.com/media/attachments/media-1f303bbb-1756878207.jpg',
                'https://completewellbeing.com/wp-content/uploads/2014/04/discover-the-beauty-of-trekking.jpg'
            ],
            3: [ // Langtang Valley Trek
                'https://completewellbeing.com/wp-content/uploads/2014/04/discover-the-beauty-of-trekking.jpg',
                'https://www.trekkersofindia.com/product/1805634489060260.webp',
                'https://api.luxuryholidaynepal.com/media/blog/banner/top-trekking-destinations-in-nepal-for-2022.jpg',
                'https://api.luxuryholidaynepal.com/media/attachments/media-1f303bbb-1756878207.jpg'
            ]
        };
        
        thumbnails = sampleThumbnails[pkg.id] || [];
    }
    let thumbnailsHTML = '';
    
    thumbnails.forEach((img, index) => {
        thumbnailsHTML += `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}')">
                <img src="${img}" alt="Thumbnail ${index + 1}">
            </div>
        `;
    });
    
    thumbnailGallery.innerHTML = thumbnailsHTML;
}

// Change main image when thumbnail is clicked
function changeMainImage(imageUrl) {
    document.getElementById('packageImage').src = imageUrl;
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    // Find the clicked thumbnail and make it active
    const clickedThumb = event.currentTarget;
    if (clickedThumb) {
        clickedThumb.classList.add('active');
    }
}

// Load additional package information
function loadAdditionalPackageInfo(pkg) {
    // Load trek highlights
    loadTrekHighlights(pkg);
    
    // Load itinerary
    loadItinerary(pkg);
    
    // Load what's included
    loadIncludedItems(pkg);
    
    // Load gallery
    loadGallery(pkg);
    
    // Load trek route map
    loadTrekMap(pkg);
    
    // Load reviews
    loadReviews(pkg);
}

// Load trek highlights
function loadTrekHighlights(pkg) {
    const highlightsList = document.querySelector('.highlights-list');
    
    if (pkg.trek_highlights && pkg.trek_highlights.trim()) {
        // Split by newline and filter empty lines
        const highlights = pkg.trek_highlights.split('\n').filter(h => h.trim());
        
        if (highlights.length > 0) {
            let highlightsHTML = '';
            highlights.forEach(highlight => {
                highlightsHTML += `<li><i class="fas fa-check-circle"></i> ${highlight.trim()}</li>`;
            });
            highlightsList.innerHTML = highlightsHTML;
        } else {
            // Default highlights if none provided
            highlightsList.innerHTML = `
                <li><i class="fas fa-check-circle"></i> Panoramic mountain views</li>
                <li><i class="fas fa-check-circle"></i> Experienced local guides</li>
                <li><i class="fas fa-check-circle"></i> Cultural experiences</li>
                <li><i class="fas fa-check-circle"></i> Sustainable tourism</li>
            `;
        }
    } else {
        // Default highlights if none provided
        highlightsList.innerHTML = `
            <li><i class="fas fa-check-circle"></i> Panoramic mountain views</li>
            <li><i class="fas fa-check-circle"></i> Experienced local guides</li>
            <li><i class="fas fa-check-circle"></i> Cultural experiences</li>
            <li><i class="fas fa-check-circle"></i> Sustainable tourism</li>
        `;
    }
}

// Load itinerary information
function loadItinerary(pkg) {
    const itineraryContainer = document.getElementById('packageItinerary');
    
    if (pkg.daily_itinerary && pkg.daily_itinerary.trim()) {
        // Parse the itinerary format: Day X: Title | Description
        const itineraryLines = pkg.daily_itinerary.split('\n').filter(line => line.trim());
        let itineraryHTML = '';
        
        itineraryLines.forEach((line, index) => {
            // Parse format: Day X: Title | Description
            const match = line.match(/Day\s+(\d+):\s*([^|]+)\|?(.*)/);
            
            if (match) {
                const dayNum = match[1];
                const title = match[2].trim();
                const description = match[3] ? match[3].trim() : '';
                
                itineraryHTML += `
                    <div class="itinerary-day">
                        <h4>
                            <span class="day-number">${dayNum}</span>
                            Day ${dayNum}: ${title}
                        </h4>
                        ${description ? `<p>${description}</p>` : ''}
                    </div>
                `;
            } else {
                // If format doesn't match, just display the line
                itineraryHTML += `
                    <div class="itinerary-day">
                        <h4>
                            <span class="day-number">${index + 1}</span>
                            ${line.trim()}
                        </h4>
                    </div>
                `;
            }
        });
        
        itineraryContainer.innerHTML = itineraryHTML;
    } else {
        // Use sample itinerary data if none provided
    
        // Sample itinerary data - in a real app, this would come from the database
        const sampleItineraries = {
        1: [ // Everest Base Camp Trek
            { day: "Day 1", title: "Arrival in Kathmandu", description: "Arrive at Tribhuvan International Airport in Kathmandu. Transfer to hotel and rest. Evening briefing about the trek." },
            { day: "Day 2", title: "Flight to Lukla & Trek to Phakding", description: "Early morning flight to Lukla (2,840m). Begin trek to Phakding (2,610m)." },
            { day: "Day 3", title: "Trek to Namche Bazaar", description: "Ascend to Namche Bazaar (3,440m), the gateway to Everest region." },
            { day: "Day 4", title: "Rest Day in Namche", description: "Acclimatization day with optional hike to Everest View Hotel." },
            { day: "Day 5", title: "Trek to Tengboche", description: "Continue to Tengboche (3,860m), home to famous monastery." },
            { day: "Day 6", title: "Trek to Dingboche", description: "Descend to Pangboche then ascend to Dingboche (4,410m)." },
            { day: "Day 7", title: "Rest Day in Dingboche", description: "Another acclimatization day with optional hike." },
            { day: "Day 8", title: "Trek to Lobuche", description: "Continue to Lobuche (4,910m) through stone moraines." },
            { day: "Day 9", title: "Trek to Everest Base Camp", description: "Reach Everest Base Camp (5,364m) and return to Gorakshep." },
            { day: "Day 10", title: "Hike Kala Patthar & Trek to Pheriche", description: "Early morning hike to Kala Patthar for sunrise views, then descend to Pheriche." },
            { day: "Day 11", title: "Trek to Namche", description: "Return trek to Namche Bazaar." },
            { day: "Day 12", title: "Trek to Lukla", description: "Final day of trekking back to Lukla." },
            { day: "Day 13", title: "Flight to Kathmandu", description: "Fly back to Kathmandu and celebrate!" },
            { day: "Day 14", title: "Departure", description: "Transfer to airport for departure." }
        ],
        2: [ // Annapurna Circuit Trek
            { day: "Day 1", title: "Arrival in Kathmandu", description: "Arrive at Tribhuvan International Airport in Kathmandu. Transfer to hotel and rest." },
            { day: "Day 2", title: "Drive to Besisahar", description: "Drive to Besisahar, the starting point of the trek." },
            { day: "Day 3", title: "Trek to Bhulbhule", description: "Begin trekking to Bhulbhule (840m) through rice terraces." },
            { day: "Day 4", title: "Trek to Ngadi", description: "Continue to Ngadi village with views of Annapurna II." },
            { day: "Day 5", title: "Trek to Chame", description: "Ascend to Chame (2,670m), district headquarters." },
            { day: "Day 6", title: "Trek to Pisang", description: "Trek to Pisang (3,200m) with views of Annapurna III." },
            { day: "Day 7", title: "Trek to Manang", description: "Continue to Manang (3,540m) for acclimatization." },
            { day: "Day 8", title: "Rest Day in Manang", description: "Acclimatization day with optional hikes." },
            { day: "Day 9", title: "Trek to Thorong Phedi", description: "Cross to Thorong Phedi (4,450m) near Thorung La Pass." },
            { day: "Day 10", title: "Cross Thorung La Pass", description: "Cross Thorung La Pass (5,416m) to Muktinath." },
            { day: "Day 11", title: "Trek to Kagbeni", description: "Descend to Kagbeni (2,800m) in Mustang region." },
            { day: "Day 12", title: "Trek to Jomsom", description: "Continue to Jomsom (2,720m) with flights available." },
            { day: "Day 13", title: "Drive to Pokhara", description: "Drive to Pokhara (900m) along scenic route." },
            { day: "Day 14", title: "Drive to Kathmandu", description: "Drive back to Kathmandu." },
            { day: "Day 15", title: "Departure", description: "Transfer to airport for departure." }
        ],
        3: [ // Langtang Valley Trek
            { day: "Day 1", title: "Arrival in Kathmandu", description: "Arrive at Tribhuvan International Airport in Kathmandu." },
            { day: "Day 2", title: "Drive to Syabrubesi", description: "Drive to Syabrubesi, the starting point of the trek." },
            { day: "Day 3", title: "Trek to Lama Hotel", description: "Begin trekking through forests to Lama Hotel." },
            { day: "Day 4", title: "Trek to Langtang Village", description: "Continue to Langtang Village (3,430m)." },
            { day: "Day 5", title: "Trek to Kyanjin Gompa", description: "Ascend to Kyanjin Gompa (3,870m) with monastery visit." },
            { day: "Day 6", title: "Rest Day & Climb Kyanjin Ri", description: "Acclimatization day with optional climb to Kyanjin Ri." },
            { day: "Day 7", title: "Trek to Lama Hotel", description: "Return trek to Lama Hotel." },
            { day: "Day 8", title: "Trek to Syabrubesi", description: "Continue descending back to Syabrubesi." },
            { day: "Day 9", title: "Drive to Kathmandu", description: "Drive back to Kathmandu." },
            { day: "Day 10", title: "Departure", description: "Transfer to airport for departure." }
        ]
        };
        
        // Use pkg.id instead of just id
        const itinerary = sampleItineraries[pkg.id] || [];
        let itineraryHTML = '';
        
        itinerary.forEach((item, index) => {
            itineraryHTML += `
                <div class="itinerary-day">
                    <h4>
                        <span class="day-number">${index + 1}</span>
                        ${item.day}: ${item.title}
                    </h4>
                    <p>${item.description}</p>
                </div>
            `;
        });
        
        itineraryContainer.innerHTML = itineraryHTML;
    }
}

// Load what's included information
function loadIncludedItems(pkg) {
    const includedContainer = document.getElementById('packageIncluded');
    
    if (pkg.whats_included && pkg.whats_included.trim()) {
        // Split by newline and filter empty lines
        const includedItems = pkg.whats_included.split('\n').filter(item => item.trim());
        
        if (includedItems.length > 0) {
            let includedHTML = '<ul>';
            includedItems.forEach(item => {
                includedHTML += `<li>${item.trim()}</li>`;
            });
            includedHTML += '</ul>';
            includedContainer.innerHTML = includedHTML;
            return;
        }
    }
    
    // Default included items if none provided
    const includedHTML = `
        <ul>
            <li>Airport pick-up and drop-off services</li>
            <li>All ground transportation as per itinerary</li>
            <li>Domestic flights (Kathmandu-Lukla-Kathmandu)</li>
            <li>Accommodation in Kathmandu (2 nights twin sharing basis)</li>
            <li>Teahouse accommodation during trek</li>
            <li>Three meals a day (breakfast, lunch, dinner) during trek</li>
            <li>Experienced, government licensed English-speaking guide</li>
            <li>Porter service (1 porter for 2 clients)</li>
            <li>All necessary permits and entry fees</li>
            <li>First aid kit and oxygen meter</li>
            <li>Trekking map and company equipment</li>
            <li>Government taxes and official fees</li>
        </ul>
    `;
    
    includedContainer.innerHTML = includedHTML;
}

// Load gallery images
function loadGallery(pkg) {
    const galleryContainer = document.getElementById('packageGallery');
    
    // Check if gallery URLs are provided in database
    if (pkg.gallery_urls && pkg.gallery_urls.trim()) {
        const galleryUrls = pkg.gallery_urls.split(',').filter(url => url.trim());
        
        if (galleryUrls.length > 0) {
            let galleryHTML = '';
            galleryUrls.forEach(url => {
                galleryHTML += `
                    <div class="gallery-item">
                        <img src="${url.trim()}" alt="Gallery Image" onerror="this.parentElement.style.display='none'">
                    </div>
                `;
            });
            galleryContainer.innerHTML = galleryHTML;
            return;
        }
    }
    
    // Use sample gallery images if none provided
    const sampleImages = {
        1: [ // Everest Base Camp Trek
            'https://api.luxuryholidaynepal.com/media/attachments/media-1f303bbb-1756878207.jpg',
            'https://www.nepaltrekhub.com/wp-content/uploads/2020/12/tilicho-lake-trek.jpg',
            'https://completewellbeing.com/wp-content/uploads/2014/04/discover-the-beauty-of-trekking.jpg',
            'https://www.trekkersofindia.com/product/1805634489060260.webp',
            'https://api.luxuryholidaynepal.com/media/blog/banner/top-trekking-destinations-in-nepal-for-2022.jpg'
        ],
        2: [ // Annapurna Circuit Trek
            'https://www.nepaltrekhub.com/wp-content/uploads/2020/12/tilicho-lake-trek.jpg',
            'https://api.luxuryholidaynepal.com/media/blog/banner/top-trekking-destinations-in-nepal-for-2022.jpg',
            'https://api.luxuryholidaynepal.com/media/attachments/media-1f303bbb-1756878207.jpg',
            'https://completewellbeing.com/wp-content/uploads/2014/04/discover-the-beauty-of-trekking.jpg',
            'https://www.trekkersofindia.com/product/1805634489060260.webp'
        ],
        3: [ // Langtang Valley Trek
            'https://completewellbeing.com/wp-content/uploads/2014/04/discover-the-beauty-of-trekking.jpg',
            'https://www.trekkersofindia.com/product/1805634489060260.webp',
            'https://api.luxuryholidaynepal.com/media/blog/banner/top-trekking-destinations-in-nepal-for-2022.jpg',
            'https://api.luxuryholidaynepal.com/media/attachments/media-1f303bbb-1756878207.jpg',
            'https://www.nepaltrekhub.com/wp-content/uploads/2020/12/tilicho-lake-trek.jpg'
        ]
    };
    
    // Use pkg.id instead of just id
    const images = sampleImages[pkg.id] || [];
    let galleryHTML = '';
    
    images.forEach(img => {
        galleryHTML += `
            <div class="gallery-item">
                <img src="${img}" alt="Gallery Image">
            </div>
        `;
    });
    
    galleryContainer.innerHTML = galleryHTML;
}
// load trek map function //
function loadTrekMap(pkg) {
    const mapContainer = document.getElementById('packageMap');
    mapContainer.innerHTML = ''; // Clear previous content

    if (pkg.map_image_url && pkg.map_image_url.trim()) {
        const img = document.createElement('img');
        img.src = pkg.map_image_url.trim();
        img.alt = 'Trek Route Map';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        img.style.cursor = 'pointer';
        img.onclick = () => openMapModal(img.src);

        // Only show placeholder if image really fails
        img.onerror = () => {
            img.style.display = 'none'; // hide broken image
            const fallback = document.createElement('p');
            fallback.style.color = '#95a5a6';
            fallback.style.padding = '40px';
            fallback.style.textAlign = 'center';
            fallback.innerHTML = '<i class="fas fa-map-marked-alt fa-3x"></i><br><br>Map image not available';
            mapContainer.appendChild(fallback);
        };

        const wrapper = document.createElement('div');
        wrapper.className = 'map-image-container';
        wrapper.style.textAlign = 'center';
        wrapper.style.background = '#f8f9fa';
        wrapper.style.padding = '20px';
        wrapper.style.borderRadius = '8px';

        const caption = document.createElement('p');
        caption.style.marginTop = '15px';
        caption.style.color = '#7f8c8d';
        caption.style.fontSize = '14px';
        caption.innerHTML = '<i class="fas fa-search-plus"></i> Click image to view full size';

        wrapper.appendChild(img);
        wrapper.appendChild(caption);
        mapContainer.appendChild(wrapper);

    } else {
        // No map image provided
        mapContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 8px;">
                <i class="fas fa-map-marked-alt" style="font-size: 48px; color: #bdc3c7; margin-bottom: 15px;"></i>
                <p style="color: #95a5a6; font-size: 16px;">Trek route map will be available soon</p>
            </div>
        `;
    }
}


// Load reviews - but this element doesn't exist in the HTML, so we'll load recommendations instead
function loadReviews(pkg) {
    // Since the reviews section was replaced with recommendations, we'll load recommendations here
    loadRecommendations(pkg);
}

// Submit booking
async function submitBooking() {
    try {
        // Verify user is logged in
        const loggedUserRaw = localStorage.getItem('loggedUser');
        if (!loggedUserRaw) {
            alert('Please login to complete your booking.');
            window.location.href = 'auth.html';
            return;
        }
        
        const userData = JSON.parse(loggedUserRaw);
        
        const bookingData = {
            package_id: document.getElementById('packageId').value,
            package_name: document.getElementById('modalPackageName').textContent,
            customer_name: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            people_count: document.getElementById('peopleCount').value,
            travel_date: document.getElementById('travelDate').value,
            payment_option: document.getElementById('paymentOption').value,
            special_requests: document.getElementById('specialRequests').value,
            total_amount: basePricePerPerson * parseInt(document.getElementById('peopleCount').value)
        };
        
        // Validate that email matches logged in user
        if (bookingData.email !== userData.email) {
            alert('Email must match your logged in account.');
            return;
        }
        
        // Show loading indicator
        const bookBtn = document.querySelector('#bookingForm .btn-primary');
        const originalBtnText = bookBtn.innerHTML;
        bookBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        bookBtn.disabled = true;
        
        // First check if user already has an active booking
        const activeBookingCheck = await fetch(`../Backend/user_bookings.php?email=${encodeURIComponent(userData.email)}`);
        if (activeBookingCheck.ok) {
            const bookingDataResponse = await activeBookingCheck.json();
            if (bookingDataResponse.status === 'success') {
                // Filter out cancelled and completed bookings
                const activeBookings = bookingDataResponse.bookings.filter(booking => 
                    booking.status !== 'cancelled' && booking.status !== 'completed'
                );
                
                if (activeBookings.length > 0) {
                    bookBtn.innerHTML = originalBtnText;
                    bookBtn.disabled = false;
                    alert('You already have an active booking. Please complete or cancel your existing booking before making a new one. You can view your bookings in the "My Bookings" section.');
                    return;
                }
            }
        }
        
        // If eSewa is selected, redirect to payment page
        if (bookingData.payment_option === 'Esewa') {
            // First save the booking with pending status if it doesn't exist or is pending
            const response = await fetch('../Backend/booking.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include credentials (cookies) for session
                body: JSON.stringify({...bookingData, status: 'pending'})
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Generate a unique transaction ID for eSewa (booking ID + timestamp)
                const amount = basePricePerPerson * parseInt(document.getElementById('peopleCount').value);
                // Calculate 10% deposit instead of full amount
                const depositAmount = amount * 0.10;
                const bookingId = data.booking_id;
                const transactionId = bookingId + '_' + Date.now(); // Unique transaction ID
                
                // Store booking info in localStorage for use after payment
                localStorage.setItem('currentBooking', JSON.stringify({
                    booking_id: bookingId,
                    transaction_id: transactionId,
                    amount: amount,
                    deposit_amount: depositAmount,
                    package_name: bookingData.package_name
                }));
                
                // Redirect to eSewa payment page with 10% deposit amount
                window.location.href = `../Backend/esewaPay.php?orderId=${transactionId}&bookingId=${bookingId}&amount=${depositAmount}`;
            } else {
                // Reset button
                bookBtn.innerHTML = originalBtnText;
                bookBtn.disabled = false;
                alert('Error: ' + data.message);
            }
        } else {
            // For other payment methods, save booking directly
            const response = await fetch('../Backend/booking.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include credentials (cookies) for session
                body: JSON.stringify(bookingData)
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Reset button
                bookBtn.innerHTML = originalBtnText;
                bookBtn.disabled = false;
                
                alert('Booking submitted successfully! You can view your booking in "My Bookings" section.');
                document.getElementById('bookingModal').style.display = 'none';
                document.getElementById('bookingForm').reset();
                
                // Optionally redirect to my bookings page
                setTimeout(() => {
                    if (confirm('Would you like to view your bookings now?')) {
                        window.location.href = 'my-bookings.html';
                    }
                }, 500);
            } else {
                // Reset button
                bookBtn.innerHTML = originalBtnText;
                bookBtn.disabled = false;
                alert('Error: ' + data.message);
            }
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        // Reset button in case of error
        const bookBtn = document.querySelector('#bookingForm .btn-primary');
        if (bookBtn) {
            bookBtn.innerHTML = originalBtnText;
            bookBtn.disabled = false;
        }
        alert('Error submitting booking. Please try again.');
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

// Open map modal for full-screen view
function openMapModal(imageSrc) {
    // Create modal if it doesn't exist
    let mapModal = document.getElementById('mapViewModal');
    if (!mapModal) {
        mapModal = document.createElement('div');
        mapModal.id = 'mapViewModal';
        mapModal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.95);
            cursor: pointer;
        `;
        
        mapModal.innerHTML = `
            <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px;">
                <span style="position: absolute; top: 20px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer;" onclick="closeMapModal()">&times;</span>
                <img id="mapModalImg" style="max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 8px;">
            </div>
        `;
        
        document.body.appendChild(mapModal);
        
        // Close when clicking outside the image
        mapModal.addEventListener('click', function(e) {
            if (e.target === mapModal) {
                closeMapModal();
            }
        });
    }
    
    // Set the image source and show modal
    document.getElementById('mapModalImg').src = imageSrc;
    mapModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close map modal
function closeMapModal() {
    const mapModal = document.getElementById('mapViewModal');
    if (mapModal) {
        mapModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Load recommendations based on CONTENT BASED ALGORITHM
async function loadRecommendations(currentPkg) {
    try {
        // Fetch all packages for comparison
        const response = await fetch('../Backend/package.php'); // Assuming this returns all packages if no ID is provided
        const data = await response.json();
        
        if (data.status === 'success' && data.packages) {
            const allPackages = data.packages;
            const recommendations = filterRecommendations(currentPkg, allPackages);
            
            renderRecommendations(recommendations);
        } else {
            document.getElementById('packageRecommendations').innerHTML = '<p style="text-align: center; color: #95a5a6;">Unable to load recommendations at this time.</p>';
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
        document.getElementById('packageRecommendations').innerHTML = '<p style="text-align: center; color: #95a5a6;">Error loading recommendations. Please try again.</p>';
    }
}

// Content-based filtering algorithm with weighted scoring
function filterRecommendations(currentPkg, allPackages) {
    const currentDifficulty = currentPkg.difficulty || 'Moderate';
    const currentPrice = parseFloat(currentPkg.price) || 0;
    const currentDuration = parseInt(currentPkg.duration) || 0;
    
    // Define ranges
    const priceRange = 0.25; // ±25%
    const durationRange = 3; // ±3 days
    
    // Filter and score packages
    const scoredPackages = allPackages
        .filter(pkg => pkg.id !== currentPkg.id) // Exclude current package
        .map(pkg => {
            const pkgPrice = parseFloat(pkg.price) || 0;
            const pkgDuration = parseInt(pkg.duration) || 0;
            const pkgDifficulty = pkg.difficulty || 'Moderate';
            
            // Calculate similarity scores (0-1 scale)
            const difficultyScore = pkgDifficulty === currentDifficulty ? 1 : 0; // Exact match only
            const priceScore = Math.max(0, 1 - Math.abs(pkgPrice - currentPrice) / (currentPrice * priceRange));
            const durationScore = Math.max(0, 1 - Math.abs(pkgDuration - currentDuration) / durationRange);
            
            // Weighted total score (difficulty: 50%, price: 30%, duration: 20%)
            const totalScore = (difficultyScore * 0.5) + (priceScore * 0.3) + (durationScore * 0.2);
            
            return { ...pkg, score: totalScore };
        })
        .filter(pkg => pkg.score > 0.3) // Minimum threshold for relevance
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 3); // Top 3 recommendations
    
    return scoredPackages;
}

// Render recommendations
function renderRecommendations(recommendations) {
    const container = document.getElementById('packageRecommendations');
    
    if (recommendations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #95a5a6;">No similar treks found. Try exploring other packages!</p>';
        return;
    }
    
    let html = '<div class="recommendations-grid">';
    recommendations.forEach(pkg => {
        const image = pkg.image_url || 'https://via.placeholder.com/300x200?text=Trek+Image';
        const difficulty = pkg.difficulty || 'Moderate';
        const price = parseFloat(pkg.price).toFixed(2);
        const duration = `${pkg.duration} days`;
        
        html += `
            <div class="recommendation-card">
                <img src="${image}" alt="${pkg.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Trek+Image'">
                <div class="card-content">
                    <h4>${pkg.name}</h4>
                    <p><i class="fas fa-mountain"></i> ${difficulty} | <i class="fas fa-clock"></i> ${duration}</p>
                    <p class="price">Rs. ${price}</p>
                    <a href="package-detail.html?id=${pkg.id}" class="btn btn-outline">View Details</a>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    // Add "View All" if there are more potential matches (optional)
    if (recommendations.length >= 3) {
        html += '<div style="text-align: center; margin-top: 20px;"><a href="packages.html" class="btn btn-secondary">View All Packages</a></div>';
    }
    
    container.innerHTML = html;
}

// Cancel booking from detail page
function cancelBookingFromDetail(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    // Get user email from localStorage
    const loggedUserRaw = localStorage.getItem('loggedUser');
    if (!loggedUserRaw) {
        alert('Please login to cancel booking.');
        window.location.href = 'auth.html';
        return;
    }
    
    let userData;
    try {
        userData = JSON.parse(loggedUserRaw);
    } catch (e) {
        console.error('Error parsing user data:', e);
        alert('Error loading user data. Please login again.');
        window.location.href = 'auth.html';
        return;
    }
    
    // Send cancel request to backend
    fetch('../Backend/cancel_booking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            booking_id: bookingId,
            email: userData.email
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Booking cancelled successfully!');
            // Reload the page to reflect the changes
            location.reload();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error cancelling booking:', error);
        alert('Error cancelling booking. Please try again.');
    });
}

// Retry payment for a booking
function retryPayment(bookingId, totalAmount) {
    // Redirect to payment page
    window.location.href = `../Backend/esewaPay.php?orderId=${bookingId}_${Date.now()}&bookingId=${bookingId}&amount=${totalAmount * 0.1}`;
}

// Set minimum date to today to prevent selecting past dates
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const travelDateInput = document.getElementById('travelDate');
    if (travelDateInput) {
        travelDateInput.setAttribute('min', today);
    }
}

// Call setMinDate when the page loads
document.addEventListener('DOMContentLoaded', function() {
    setMinDate();
});
