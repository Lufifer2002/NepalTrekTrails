// Package Detail Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check login status first
    checkLoginStatus();
    
    // Get package ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    
    if (packageId) {
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
    
    event.currentTarget.classList.add('active');
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

// Load trek route map
function loadTrekMap(pkg) {
    const mapContainer = document.getElementById('packageMap');
    
    // Check if map image URL is provided in database
    if (pkg.map_image_url && pkg.map_image_url.trim()) {
        const mapHTML = `
            <div class="map-image-container" style="text-align: center; background: #f8f9fa; padding: 20px; border-radius: 8px;">
                <img src="${pkg.map_image_url.trim()}" alt="Trek Route Map" 
                     style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer;"
                     onclick="openMapModal(this.src)"
                     onerror="this.parentElement.innerHTML='<p style=\"color: #95a5a6; padding: 40px;\"><i class=\"fas fa-map-marked-alt fa-3x\"></i><br><br>Map image not available</p>'">
                <p style="margin-top: 15px; color: #7f8c8d; font-size: 14px;">
                    <i class="fas fa-search-plus"></i> Click image to view full size
                </p>
            </div>
        `;
        mapContainer.innerHTML = mapHTML;
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

// Load reviews
function loadReviews(pkg) {
    const reviewsContainer = document.getElementById('packageReviews');
    
    // Sample reviews - in a real app, this would come from the database
    const sampleReviews = {
        1: [ // Everest Base Camp Trek
            { author: "John Smith", rating: 5, text: "Absolutely incredible experience! The views from Kala Patthar were breathtaking. Our guide was knowledgeable and helpful throughout the journey." },
            { author: "Sarah Johnson", rating: 4, text: "Challenging but rewarding trek. Well organized trip with great accommodations. Would recommend to anyone with moderate fitness level." },
            { author: "Michael Brown", rating: 5, text: "Life-changing adventure! The team at Nepal Trek Trails made everything seamless. The local culture experience was amazing." }
        ],
        2: [ // Annapurna Circuit Trek
            { author: "Emma Wilson", rating: 5, text: "Fantastic trek with diverse landscapes. Crossing Thorung La Pass was challenging but worth every step. Great support from guides." },
            { author: "David Lee", rating: 4, text: "Well-planned itinerary with good balance of challenge and comfort. The Mustang region was particularly stunning." },
            { author: "Lisa Chen", rating: 5, text: "Amazing cultural immersion. The teahouses were cozy and the food was surprisingly good. Highly recommend this trek!" }
        ],
        3: [ // Langtang Valley Trek
            { author: "Robert Garcia", rating: 4, text: "Beautiful valley trek with less crowds than Everest or Annapurna regions. Perfect for those wanting a shorter but fulfilling trek." },
            { author: "Jennifer Martinez", rating: 5, text: "Great introduction to trekking in Nepal. The Langtang village and Kyanjin Gompa were highlights. Excellent guide and porter service." },
            { author: "Thomas Anderson", rating: 4, text: "Scenic trek with varied terrain. The views of Langtang Lirung were spectacular. Good option for intermediate trekkers." }
        ]
    };
    
    // Use pkg.id instead of just id
    const reviews = sampleReviews[pkg.id] || [];
    let reviewsHTML = '';
    
    reviews.forEach(review => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < review.rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        // Get initials for avatar
        const initials = review.author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        reviewsHTML += `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-author">
                        <div class="author-avatar">${initials}</div>
                        ${review.author}
                    </div>
                    <div class="review-rating">${stars}</div>
                </div>
                <div class="review-text">${review.text}</div>
            </div>
        `;
    });
    
    reviewsContainer.innerHTML = reviewsHTML;
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
            special_requests: document.getElementById('specialRequests').value
        };
        
        // Validate that email matches logged in user
        if (bookingData.email !== userData.email) {
            alert('Email must match your logged in account.');
            return;
        }
        
        // If eSewa is selected, redirect to payment page
        if (bookingData.payment_option === 'Esewa') {
            // First save the booking with pending status if it doesn't exist or is pending
            const response = await fetch('../Backend/booking.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...bookingData, status: 'pending'})
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Generate a unique transaction ID for eSewa (booking ID + timestamp)
                const amount = parseFloat(document.getElementById('modalPackagePrice').textContent);
                const bookingId = data.booking_id;
                const transactionId = bookingId + '_' + Date.now(); // Unique transaction ID
                
                // Store booking info in localStorage for use after payment
                localStorage.setItem('currentBooking', JSON.stringify({
                    booking_id: bookingId,
                    transaction_id: transactionId,
                    amount: amount,
                    package_name: bookingData.package_name
                }));
                
                // Redirect to eSewa payment page with unique transaction ID
                window.location.href = `../Backend/esewaPay.php?orderId=${transactionId}&bookingId=${bookingId}&amount=${amount}`;
            } else {
                alert('Error: ' + data.message);
            }
        } else {
            // For other payment methods, save booking directly
            const response = await fetch('../Backend/booking.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
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
                alert('Error: ' + data.message);
            }
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
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