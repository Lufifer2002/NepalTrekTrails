// Check admin authentication
async function checkAdminAuth() {
    try {
        const response = await fetch('../Backend/admin_auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'check_session'
            })
        });
        
        const data = await response.json();
        
        if (!data.logged_in) {
            // Session expired or not logged in
            localStorage.removeItem('adminUser');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Auth check error:', error);
        // On error, check localStorage as fallback
        const adminUser = localStorage.getItem('adminUser');
        if (!adminUser) {
            window.location.href = 'login.html';
        }
    }
}

// Logout function
async function logout() {
    try {
        await fetch('../Backend/admin_auth.php', {
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
    
    // Clear localStorage and redirect
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(`${sectionId}-section`).style.display = 'block';
    
    // Update active nav link
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Load data for the selected section
    switch(sectionId) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'packages':
            loadPackages();
            break;
        case 'bookings':
            loadBookings();
            break;
        case 'blogs':
            loadBlogs();
            break;
        case 'contacts':
            loadContacts();
            break;
        case 'subscribers':
            loadSubscribers();
            break;
    }
}

// Fetch and display statistics
async function loadDashboardStats() {
    try {
        // Fetch packages count
        const packagesResponse = await fetch('../Backend/admin_package.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'list',
                admin_key: 'admin_secret_key_123'
            })
        });
        const packagesData = await packagesResponse.json();
        document.getElementById('total-packages').textContent = packagesData.data ? packagesData.data.length : 0;
        
        // For other stats, we would need dedicated endpoints
        // For now, we'll use dummy data
        document.getElementById('total-bookings').textContent = '24';
        
        // Fetch blogs count
        const blogsResponse = await fetch('../Backend/admin_blog.php');
        const blogsData = await blogsResponse.json();
        document.getElementById('total-blogs').textContent = blogsData.blogs ? blogsData.blogs.length : 0;
        
        document.getElementById('total-contacts').textContent = '8';
        document.getElementById('total-subscribers').textContent = '156';
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Fetch and display packages
async function loadPackages() {
    try {
        const response = await fetch('../Backend/admin_package.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'list',
                admin_key: 'admin_secret_key_123'
            })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            const tbody = document.getElementById('packages-table-body');
            tbody.innerHTML = '';
            
            data.data.forEach(pkg => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${pkg.id}</td>
                    <td>${pkg.name}</td>
                    <td>${pkg.duration || 'N/A'} days</td>
                    <td>$${parseFloat(pkg.price).toFixed(2)}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-package" data-id="${pkg.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-package" data-id="${pkg.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-package').forEach(button => {
                button.addEventListener('click', (e) => {
                    const packageId = e.target.closest('button').getAttribute('data-id');
                    editPackage(packageId);
                });
            });
            
            document.querySelectorAll('.delete-package').forEach(button => {
                button.addEventListener('click', (e) => {
                    const packageId = e.target.closest('button').getAttribute('data-id');
                    deletePackage(packageId);
                });
            });
        }
    } catch (error) {
        console.error('Error loading packages:', error);
    }
}

// Edit package
async function editPackage(packageId) {
    try {
        // Fetch package details
        const response = await fetch('../Backend/admin_package.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'list',
                admin_key: 'admin_secret_key_123'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            const packageData = data.data.find(pkg => pkg.id == packageId);
            if (packageData) {
                document.getElementById('modalTitle').textContent = 'Edit Package';
                document.getElementById('packageId').value = packageData.id;
                document.getElementById('packageName').value = packageData.name;
                document.getElementById('packageDescription').value = packageData.description || '';
                document.getElementById('packageDuration').value = packageData.duration || '';
                document.getElementById('packagePrice').value = packageData.price || '';
                document.getElementById('packageDifficulty').value = packageData.difficulty || '';
                document.getElementById('packageImageUrl').value = packageData.image_url || '';
                document.getElementById('trekHighlights').value = packageData.trek_highlights || '';
                document.getElementById('dailyItinerary').value = packageData.daily_itinerary || '';
                document.getElementById('whatsIncluded').value = packageData.whats_included || '';
                document.getElementById('galleryUrls').value = packageData.gallery_urls || '';
                document.getElementById('mapImageUrl').value = packageData.map_image_url || '';
                
                // Show existing image preview if available
                if (packageData.image_url) {
                    document.getElementById('packagePreviewImg').src = packageData.image_url;
                    document.getElementById('packageImagePreview').style.display = 'block';
                } else {
                    document.getElementById('packageImagePreview').style.display = 'none';
                }
                
                // Show existing gallery images if available
                if (packageData.gallery_urls) {
                    const galleryImages = document.getElementById('galleryImages');
                    galleryImages.innerHTML = '';
                    const urls = packageData.gallery_urls.split(',').filter(url => url.trim());
                    urls.forEach((url, index) => {
                        const imgDiv = document.createElement('div');
                        imgDiv.style.position = 'relative';
                        imgDiv.innerHTML = `
                            <img src="${url.trim()}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 5px;">
                            <button onclick="removeGalleryImage(${index})" style="position: absolute; top: 5px; right: 5px; background: #e74c3c; color: white; border: none; padding: 5px; border-radius: 3px; cursor: pointer;">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        galleryImages.appendChild(imgDiv);
                    });
                    document.getElementById('galleryPreview').style.display = 'block';
                } else {
                    document.getElementById('galleryPreview').style.display = 'none';
                }
                
                // Show existing map image if available
                if (packageData.map_image_url) {
                    document.getElementById('mapPreviewImg').src = packageData.map_image_url;
                    document.getElementById('mapImagePreview').style.display = 'block';
                } else {
                    document.getElementById('mapImagePreview').style.display = 'none';
                }
                
                // Clear file input
                document.getElementById('packageImage').value = '';
                document.getElementById('trekGallery').value = '';
                document.getElementById('mapImage').value = '';
                
                document.getElementById('packageModal').style.display = 'flex';
            }
        }
    } catch (error) {
        console.error('Error fetching package details:', error);
        alert('Error fetching package details');
    }
}

// Delete package
async function deletePackage(packageId) {
    if (!confirm('Are you sure you want to delete this package?')) {
        return;
    }
    
    try {
        const response = await fetch('../Backend/admin_package.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                id: packageId,
                admin_key: 'admin_secret_key_123'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Package deleted successfully!');
            loadPackages(); // Refresh the package list
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting package:', error);
        alert('Error deleting package');
    }
}

// Open package modal for adding
function openAddPackageModal() {
    document.getElementById('modalTitle').textContent = 'Add Package';
    document.getElementById('packageId').value = '';
    document.getElementById('packageName').value = '';
    document.getElementById('packageDescription').value = '';
    document.getElementById('packageDuration').value = '';
    document.getElementById('packagePrice').value = '';
    document.getElementById('packageDifficulty').value = '';
    document.getElementById('packageImageUrl').value = '';
    document.getElementById('packageImage').value = '';
    document.getElementById('packageImagePreview').style.display = 'none';
    document.getElementById('trekHighlights').value = '';
    document.getElementById('dailyItinerary').value = '';
    document.getElementById('whatsIncluded').value = '';
    document.getElementById('trekGallery').value = '';
    document.getElementById('galleryUrls').value = '';
    document.getElementById('galleryPreview').style.display = 'none';
    document.getElementById('galleryImages').innerHTML = '';
    document.getElementById('mapImage').value = '';
    document.getElementById('mapImageUrl').value = '';
    document.getElementById('mapImagePreview').style.display = 'none';
    document.getElementById('packageModal').style.display = 'flex';
}

// Close modal
function closePackageModal() {
    document.getElementById('packageModal').style.display = 'none';
}

// Save package (add or edit)
async function savePackage() {
    // Get form values
    const id = document.getElementById('packageId').value;
    const name = document.getElementById('packageName').value;
    const description = document.getElementById('packageDescription').value;
    const duration = document.getElementById('packageDuration').value;
    const price = document.getElementById('packagePrice').value;
    const difficulty = document.getElementById('packageDifficulty').value;
    const imageFile = document.getElementById('packageImage').files[0];
    let imageUrl = document.getElementById('packageImageUrl').value;
    const galleryFiles = document.getElementById('trekGallery').files;
    let galleryUrls = document.getElementById('galleryUrls').value;
    const mapImageFile = document.getElementById('mapImage').files[0];
    let mapImageUrl = document.getElementById('mapImageUrl').value;
    
    // Collect formatted data from dynamic inputs
    const trekHighlights = collectTrekHighlights();
    const dailyItinerary = collectDailyItinerary();
    const whatsIncluded = collectWhatsIncluded();
    
    // Validation
    if (!name || !description || !duration || !price || !difficulty) {
        alert('Please fill in all required fields');
        return;
    }
    
    // For new packages or when image is changed, require image upload
    if (!id && !imageFile) {
        alert('Please select an image for the package');
        return;
    }
    
    try {
        const saveBtn = document.getElementById('savePackageBtn');
        const originalText = saveBtn.innerHTML;
        
        // If new image is selected, upload it first
        if (imageFile) {
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading Image...';
            saveBtn.disabled = true;
            
            const formData = new FormData();
            formData.append('image', imageFile);
            
            const uploadResponse = await fetch('../Backend/upload_image.php', {
                method: 'POST',
                body: formData
            });
            
            const uploadData = await uploadResponse.json();
            
            if (uploadData.status !== 'success') {
                throw new Error(uploadData.message || 'Failed to upload image');
            }
            
            imageUrl = uploadData.url;
        }
        
        // Upload gallery images if any
        if (galleryFiles.length > 0) {
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading Gallery Images...';
            
            const uploadedGalleryUrls = [];
            for (let i = 0; i < galleryFiles.length; i++) {
                const formData = new FormData();
                formData.append('image', galleryFiles[i]);
                
                const uploadResponse = await fetch('../Backend/upload_image.php', {
                    method: 'POST',
                    body: formData
                });
                
                const uploadData = await uploadResponse.json();
                
                if (uploadData.status === 'success') {
                    uploadedGalleryUrls.push(uploadData.url);
                }
            }
            
            // Combine with existing gallery URLs if editing
            if (galleryUrls) {
                const existingUrls = galleryUrls.split(',').filter(url => url.trim());
                galleryUrls = [...existingUrls, ...uploadedGalleryUrls].join(',');
            } else {
                galleryUrls = uploadedGalleryUrls.join(',');
            }
        }
        
        // Upload map image if selected
        if (mapImageFile) {
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading Map Image...';
            
            const formData = new FormData();
            formData.append('image', mapImageFile);
            
            const uploadResponse = await fetch('../Backend/upload_image.php', {
                method: 'POST',
                body: formData
            });
            
            const uploadData = await uploadResponse.json();
            
            if (uploadData.status === 'success') {
                mapImageUrl = uploadData.url;
            }
        }
        
        // Now save the package
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Package...';
        
        const action = id ? 'update' : 'create';
        const requestData = {
            action: action,
            admin_key: 'admin_secret_key_123',
            name: name,
            description: description,
            duration: parseInt(duration),
            price: parseFloat(price),
            difficulty: difficulty,
            image_url: imageUrl,
            trek_highlights: trekHighlights,
            daily_itinerary: dailyItinerary,
            whats_included: whatsIncluded,
            gallery_urls: galleryUrls,
            map_image_url: mapImageUrl
        };
        
        // Add ID for update action
        if (id) {
            requestData.id = parseInt(id);
        }
        
        const response = await fetch('../Backend/admin_package.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert(`Package ${id ? 'updated' : 'added'} successfully!`);
            closePackageModal();
            loadPackages(); // Refresh the package list
        } else {
            throw new Error(data.message || 'Failed to save package');
        }
        
        // Reset button
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    } catch (error) {
        console.error('Error saving package:', error);
        alert('Error: ' + error.message);
        
        // Reset button
        const saveBtn = document.getElementById('savePackageBtn');
        saveBtn.innerHTML = 'Save Package';
        saveBtn.disabled = false;
    }
}

// Fetch and display bookings
async function loadBookings() {
    try {
        const response = await fetch('../Backend/admin_booking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'list',
                admin_key: 'admin_secret_key_123'
            })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            const tbody = document.getElementById('bookings-table-body');
            tbody.innerHTML = '';
            
            data.data.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.id}</td>
                    <td>${booking.package_name || 'N/A'}</td>
                    <td>${booking.customer_name || booking.name || 'N/A'}</td>
                    <td>${booking.customer_email || booking.email || 'N/A'}</td>
                    <td>${booking.travel_date || 'N/A'}</td>
                    <td>${booking.status || 'Pending'}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-booking" data-id="${booking.id}" data-status="${booking.status || 'Pending'}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-booking" data-id="${booking.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-booking').forEach(button => {
                button.addEventListener('click', (e) => {
                    const bookingId = e.target.closest('button').getAttribute('data-id');
                    const status = e.target.closest('button').getAttribute('data-status');
                    editBooking(bookingId, status);
                });
            });
            
            document.querySelectorAll('.delete-booking').forEach(button => {
                button.addEventListener('click', (e) => {
                    const bookingId = e.target.closest('button').getAttribute('data-id');
                    deleteBooking(bookingId);
                });
            });
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

// Edit booking
function editBooking(bookingId, currentStatus) {
    const newStatus = prompt('Enter new status (Pending, Confirmed, Cancelled):', currentStatus);
    if (newStatus !== null && newStatus !== currentStatus) {
        updateBookingStatus(bookingId, newStatus);
    }
}

// Update booking status
async function updateBookingStatus(bookingId, status) {
    try {
        const response = await fetch('../Backend/admin_booking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'update',
                id: bookingId,
                status: status,
                admin_key: 'admin_secret_key_123'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Booking status updated successfully!');
            loadBookings(); // Refresh the booking list
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error updating booking status:', error);
        alert('Error updating booking status');
    }
}

// Delete booking
async function deleteBooking(bookingId) {
    if (!confirm('Are you sure you want to delete this booking?')) {
        return;
    }
    
    try {
        const response = await fetch('../Backend/admin_booking.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                id: bookingId,
                admin_key: 'admin_secret_key_123'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Booking deleted successfully!');
            loadBookings(); // Refresh the booking list
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Error deleting booking');
    }
}

// Fetch and display contacts
async function loadContacts() {
    try {
        const response = await fetch('../Backend/admin_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'list',
                admin_key: 'admin_secret_key_123'
            })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            const tbody = document.getElementById('contacts-table-body');
            tbody.innerHTML = '';
            
            data.data.forEach(contact => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td>${contact.email}</td>
                    <td>${contact.subject}</td>
                    <td>${new Date(contact.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-primary btn-sm view-contact" data-id="${contact.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-danger btn-sm delete-contact" data-id="${contact.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Add event listeners to view and delete buttons
            document.querySelectorAll('.view-contact').forEach(button => {
                button.addEventListener('click', (e) => {
                    const contactId = e.target.closest('button').getAttribute('data-id');
                    viewContact(contactId);
                });
            });
            
            document.querySelectorAll('.delete-contact').forEach(button => {
                button.addEventListener('click', (e) => {
                    const contactId = e.target.closest('button').getAttribute('data-id');
                    deleteContact(contactId);
                });
            });
        }
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
}

// View contact
async function viewContact(contactId) {
    try {
        const response = await fetch('../Backend/admin_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'view',
                id: contactId,
                admin_key: 'admin_secret_key_123'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            const contact = data.data;
            alert(`Contact Details:

Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone || 'N/A'}
Subject: ${contact.subject}
Message: ${contact.message}
Date: ${new Date(contact.created_at).toLocaleString()}`);
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error viewing contact:', error);
        alert('Error viewing contact');
    }
}

// Delete contact
async function deleteContact(contactId) {
    if (!confirm('Are you sure you want to delete this contact message?')) {
        return;
    }
    
    try {
        const response = await fetch('../Backend/admin_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                id: contactId,
                admin_key: 'admin_secret_key_123'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Contact message deleted successfully!');
            loadContacts(); // Refresh the contact list
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Error deleting contact');
    }
}

// Fetch and display subscribers
async function loadSubscribers() {
    try {
        const response = await fetch('../Backend/admin_subscriber.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'list',
                admin_key: 'admin_secret_key_123'
            })
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            const tbody = document.getElementById('subscribers-table-body');
            tbody.innerHTML = '';
            
            data.data.forEach(subscriber => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${subscriber.id}</td>
                    <td>${subscriber.email}</td>
                    <td>${new Date(subscriber.subscribed_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-subscriber" data-id="${subscriber.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-subscriber').forEach(button => {
                button.addEventListener('click', (e) => {
                    const subscriberId = e.target.closest('button').getAttribute('data-id');
                    deleteSubscriber(subscriberId);
                });
            });
        }
    } catch (error) {
        console.error('Error loading subscribers:', error);
    }
}

// Delete subscriber
async function deleteSubscriber(subscriberId) {
    if (!confirm('Are you sure you want to delete this subscriber?')) {
        return;
    }
    
    try {
        const response = await fetch('../Backend/admin_subscriber.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                id: subscriberId,
                admin_key: 'admin_secret_key_123'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Subscriber deleted successfully!');
            loadSubscribers(); // Refresh the subscriber list
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        alert('Error deleting subscriber');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAdminAuth();
    
    // Load initial data
    loadDashboardStats();
    loadPackages();
    
    // Navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('data-section') || e.target.parentElement.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Package management
    document.getElementById('addPackageBtn').addEventListener('click', openAddPackageModal);
    
    // Package image preview
    const packageImageInput = document.getElementById('packageImage');
    if (packageImageInput) {
        packageImageInput.addEventListener('change', previewPackageImage);
    }
    
    // Gallery images preview
    const galleryInput = document.getElementById('trekGallery');
    if (galleryInput) {
        galleryInput.addEventListener('change', previewGalleryImages);
    }
    
    // Map image preview
    const mapImageInput = document.getElementById('mapImage');
    if (mapImageInput) {
        mapImageInput.addEventListener('change', previewMapImage);
    }
    
    // Modal events
    document.querySelector('#packageModal .close-btn').addEventListener('click', closePackageModal);
    document.getElementById('cancelPackageBtn').addEventListener('click', closePackageModal);
    document.getElementById('savePackageBtn').addEventListener('click', savePackage);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('packageModal');
        if (e.target === modal) {
            closePackageModal();
        }
    });
});

// Load blogs
async function loadBlogs() {
    try {
        const response = await fetch('../Backend/admin_blog.php');
        const data = await response.json();
        
        if (data.status === 'success') {
            const tbody = document.getElementById('blogs-table-body');
            tbody.innerHTML = '';
            
            data.blogs.forEach(blog => {
                const row = document.createElement('tr');
                const statusClass = blog.status === 'approved' ? 'success' : blog.status === 'pending' ? 'warning' : 'danger';
                row.innerHTML = `
                    <td>${blog.id}</td>
                    <td style="max-width: 300px;">${blog.title}</td>
                    <td>${blog.author_name}</td>
                    <td>${blog.category}</td>
                    <td><span class="badge ${statusClass}">${blog.status}</span></td>
                    <td>${new Date(blog.created_at).toLocaleDateString()}</td>
                    <td>
                        ${blog.status === 'pending' ? `
                            <button class="btn btn-success btn-sm" onclick="approveBlog(${blog.id})">
                                <i class="fas fa-check"></i> Approve
                            </button>
                            <button class="btn btn-warning btn-sm" onclick="rejectBlog(${blog.id})">
                                <i class="fas fa-times"></i> Reject
                            </button>
                        ` : ''}
                        <button class="btn btn-danger btn-sm" onclick="deleteBlogAdmin(${blog.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading blogs:', error);
    }
}

// Approve blog
async function approveBlog(blogId) {
    try {
        const response = await fetch('../Backend/admin_blog.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: blogId,
                status: 'approved'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Blog approved successfully!');
            loadBlogs();
            loadDashboardStats();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error approving blog:', error);
        alert('Error approving blog');
    }
}

// Reject blog
async function rejectBlog(blogId) {
    try {
        const response = await fetch('../Backend/admin_blog.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: blogId,
                status: 'rejected'
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Blog rejected');
            loadBlogs();
            loadDashboardStats();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error rejecting blog:', error);
        alert('Error rejecting blog');
    }
}

// Delete blog (admin)
async function deleteBlogAdmin(blogId) {
    if (!confirm('Are you sure you want to delete this blog post?')) {
        return;
    }
    
    try {
        const response = await fetch('../Backend/admin_blog.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: blogId
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert('Blog deleted successfully!');
            loadBlogs();
            loadDashboardStats();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Error deleting blog');
    }
}

// Preview package image
function previewPackageImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('packagePreviewImg').src = e.target.result;
            document.getElementById('packageImagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Remove package image
function removePackageImage() {
    document.getElementById('packageImage').value = '';
    document.getElementById('packageImagePreview').style.display = 'none';
    document.getElementById('packagePreviewImg').src = '';
}

// Preview gallery images
function previewGalleryImages(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const galleryImages = document.getElementById('galleryImages');
        
        // Keep existing previews if any
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgDiv = document.createElement('div');
                imgDiv.style.position = 'relative';
                imgDiv.innerHTML = `
                    <img src="${e.target.result}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 5px;">
                `;
                galleryImages.appendChild(imgDiv);
            };
            reader.readAsDataURL(file);
        }
        
        document.getElementById('galleryPreview').style.display = 'block';
    }
}

// Remove specific gallery image
function removeGalleryImage(index) {
    const galleryUrlsInput = document.getElementById('galleryUrls');
    const urls = galleryUrlsInput.value.split(',').filter(url => url.trim());
    urls.splice(index, 1);
    galleryUrlsInput.value = urls.join(',');
    
    // Refresh gallery preview
    const galleryImages = document.getElementById('galleryImages');
    galleryImages.children[index].remove();
    
    if (galleryImages.children.length === 0) {
        document.getElementById('galleryPreview').style.display = 'none';
    }
}

// Clear all gallery images
function clearGallery() {
    document.getElementById('trekGallery').value = '';
    document.getElementById('galleryUrls').value = '';
    document.getElementById('galleryPreview').style.display = 'none';
    document.getElementById('galleryImages').innerHTML = '';
}

// Preview map image
function previewMapImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('mapPreviewImg').src = e.target.result;
            document.getElementById('mapImagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Remove map image
function removeMapImage() {
    document.getElementById('mapImage').value = '';
    document.getElementById('mapImagePreview').style.display = 'none';
    document.getElementById('mapPreviewImg').src = '';
    document.getElementById('mapImageUrl').value = '';
}

// Format trek highlights for storage
function formatTrekHighlights(highlightsText) {
    if (!highlightsText || !highlightsText.trim()) {
        return '';
    }
    
    // Split by newlines, trim each line, and filter out empty lines
    return highlightsText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
}

// Format daily itinerary for storage
function formatDailyItinerary(itineraryText) {
    if (!itineraryText || !itineraryText.trim()) {
        return '';
    }
    
    // Split by newlines, trim each line, and filter out empty lines
    return itineraryText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
}

// Format what's included for storage
function formatWhatsIncluded(includedText) {
    if (!includedText || !includedText.trim()) {
        return '';
    }
    
    // Split by newlines, trim each line, and filter out empty lines
    return includedText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
}

// Functions for trek highlights
function addHighlightItem() {
    const container = document.getElementById('trekHighlightsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'highlight-item';
    newItem.style.display = 'flex';
    newItem.style.marginBottom = '10px';
    
    newItem.innerHTML = `
        <input type="text" class="form-control highlight-input" placeholder="Enter a trek highlight" style="flex: 1; margin-right: 10px;">
       <div><button type="button" class="btn btn-danger remove-highlight" onclick="removeHighlightItem(this)">Remove</button></div>
    `;
    
    container.appendChild(newItem);
    
    // Show remove buttons when there's more than one item
    updateRemoveButtons('highlight-item', 'remove-highlight');
    
    // Update hidden field
    updateHiddenFields();
}

function removeHighlightItem(button) {
    button.closest('.highlight-item').remove();
    updateRemoveButtons('highlight-item', 'remove-highlight');
    
    // Update hidden field
    updateHiddenFields();
}

// Functions for daily itinerary
function addItineraryDay() {
    const container = document.getElementById('dailyItineraryContainer');
    const dayNumber = container.children.length + 1;
    
    const newDay = document.createElement('div');
    newDay.className = 'itinerary-day';
    newDay.style.border = '1px solid #ddd';
    newDay.style.borderRadius = '5px';
    newDay.style.padding = '15px';
    newDay.style.marginBottom = '15px';
    
    newDay.innerHTML = `
        <div class="form-row">
            <div class="form-group" style="flex: 0 0 100px; margin-right: 15px;">
                <label>Day</label>
                <input type="number" class="form-control day-number" min="1" value="${dayNumber}" placeholder="Day">
            </div>
            <div class="form-group" style="flex: 1;">
                <label>Title</label>
                <input type="text" class="form-control day-title" placeholder="Day title (e.g., Arrival in Kathmandu)">
            </div>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea class="form-control day-description" rows="2" placeholder="Describe activities for this day"></textarea>
        </div>
        <button type="button" class="btn btn-danger remove-day" onclick="removeItineraryDay(this)">Remove Day</button>
    `;
    
    container.appendChild(newDay);
    
    // Show remove buttons when there's more than one item
    updateRemoveButtons('itinerary-day', 'remove-day');
    
    // Update hidden field
    updateHiddenFields();
}

function removeItineraryDay(button) {
    button.closest('.itinerary-day').remove();
    updateRemoveButtons('itinerary-day', 'remove-day');
    
    // Reorder day numbers
    const dayNumbers = document.querySelectorAll('.day-number');
    dayNumbers.forEach((input, index) => {
        input.value = index + 1;
    });
    
    // Update hidden field
    updateHiddenFields();
}

// Functions for what's included
function addIncludedItem() {
    const container = document.getElementById('whatsIncludedContainer');
    const newItem = document.createElement('div');
    newItem.className = 'included-item';
    newItem.style.display = 'flex';
    newItem.style.marginBottom = '10px';
    
    newItem.innerHTML = `
        <input type="text" class="form-control included-input" placeholder="Enter an included item" style="flex: 1; margin-right: 10px;">
        <div><button type="button" class="btn btn-danger remove-included" onclick="removeIncludedItem(this)">Remove</button><div>
    `;
    
    container.appendChild(newItem);
    
    // Show remove buttons when there's more than one item
    updateRemoveButtons('included-item', 'remove-included');
    
    // Update hidden field
    updateHiddenFields();
}

function removeIncludedItem(button) {
    button.closest('.included-item').remove();
    updateRemoveButtons('included-item', 'remove-included');
    
    // Update hidden field
    updateHiddenFields();
}

// Update remove buttons visibility
function updateRemoveButtons(itemClass, buttonClass) {
    const items = document.querySelectorAll('.' + itemClass);
    const buttons = document.querySelectorAll('.' + buttonClass);
    
    if (items.length > 1) {
        buttons.forEach(button => {
            button.style.display = 'inline-block';
        });
    } else {
        buttons.forEach(button => {
            button.style.display = 'none';
        });
    }
}

// Collect trek highlights data
function collectTrekHighlights() {
    const highlightInputs = document.querySelectorAll('.highlight-input');
    const highlights = [];
    
    highlightInputs.forEach(input => {
        if (input.value.trim()) {
            highlights.push(input.value.trim());
        }
    });
    
    return highlights.join('\n');
}

// Collect daily itinerary data
function collectDailyItinerary() {
    const dayElements = document.querySelectorAll('.itinerary-day');
    const itinerary = [];
    
    dayElements.forEach(dayElement => {
        const dayNumber = dayElement.querySelector('.day-number').value;
        const title = dayElement.querySelector('.day-title').value.trim();
        const description = dayElement.querySelector('.day-description').value.trim();
        
        if (title) {
            const line = description ? 
                `Day ${dayNumber}: ${title} | ${description}` : 
                `Day ${dayNumber}: ${title}`;
            itinerary.push(line);
        }
    });
    
    return itinerary.join('\n');
}

// Collect what's included data
function collectWhatsIncluded() {
    const includedInputs = document.querySelectorAll('.included-input');
    const includedItems = [];
    
    includedInputs.forEach(input => {
        if (input.value.trim()) {
            includedItems.push(input.value.trim());
        }
    });
    
    return includedItems.join('\n');
}

// Update hidden fields with collected data
function updateHiddenFields() {
    document.getElementById('trekHighlights').value = collectTrekHighlights();
    document.getElementById('dailyItinerary').value = collectDailyItinerary();
    document.getElementById('whatsIncluded').value = collectWhatsIncluded();
}

// Add event listeners to update hidden fields when inputs change
document.addEventListener('DOMContentLoaded', function() {
    // Add input event listeners to all dynamic inputs
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('highlight-input') || 
            e.target.classList.contains('day-number') || 
            e.target.classList.contains('day-title') || 
            e.target.classList.contains('day-description') || 
            e.target.classList.contains('included-input')) {
            updateHiddenFields();
        }
    });
    
    // Also update when items are added/removed
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-highlight') || 
            e.target.classList.contains('remove-day') || 
            e.target.classList.contains('remove-included') ||
            e.target.textContent.includes('Add Another')) {
            // Small delay to ensure DOM is updated
            setTimeout(updateHiddenFields, 100);
        }
    });
});

// Package form submission
async function submitPackageForm(action, id = null) {
    try {
        showLoadingSpinner();
        
        // Get form values
        const name = document.getElementById('packageName').value;
        const description = document.getElementById('packageDescription').value;
        const duration = document.getElementById('packageDuration').value;
        const price = document.getElementById('packagePrice').value;
        const difficulty = document.getElementById('packageDifficulty').value;
        const imageUrl = document.getElementById('packageImageUrl').value;
        const mapImageUrl = document.getElementById('packageMapImageUrl').value;
        
        // Collect formatted data from dynamic inputs
        const trekHighlights = collectTrekHighlights();
        const dailyItinerary = collectDailyItinerary();
        const whatsIncluded = collectWhatsIncluded();
        
        // Get gallery URLs
        const galleryUrls = getGalleryUrls();
        
        // Validate required fields
        if (!name || !duration || !price) {
            hideLoadingSpinner();
            alert('Please fill in all required fields (Name, Duration, Price)');
            return;
        }
        
        // Prepare request data
        const requestData = {
            action: action,
            admin_key: 'admin_secret_key_123',
            name: name,
            description: description,
            duration: parseInt(duration),
            price: parseFloat(price),
            difficulty: difficulty,
            image_url: imageUrl,
            trek_highlights: trekHighlights,
            daily_itinerary: dailyItinerary,
            whats_included: whatsIncluded,
            gallery_urls: galleryUrls,
            map_image_url: mapImageUrl
        };
        
        // Add ID for update action
        if (id) {
            requestData.id = parseInt(id);
        }
        
        // Send request to backend
        const response = await fetch('../Backend/admin_package.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        const data = await response.json();
        
        hideLoadingSpinner();
        
        if (data.status === 'success') {
            alert(`Package ${action === 'create' ? 'created' : 'updated'} successfully!`);
            
            // Reset form if creating new package
            if (action === 'create') {
                resetPackageForm();
            }
            
            // Refresh packages list
            loadPackages();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        hideLoadingSpinner();
        console.error('Error submitting package:', error);
        alert('Error submitting package. Please try again.');
    }
}

// Populate package form for editing
function populatePackageForm(packageData) {
    document.getElementById('packageName').value = packageData.name || '';
    document.getElementById('packageDescription').value = packageData.description || '';
    document.getElementById('packageDuration').value = packageData.duration || '';
    document.getElementById('packagePrice').value = packageData.price || '';
    document.getElementById('packageDifficulty').value = packageData.difficulty || 'Easy';
    document.getElementById('packageImageUrl').value = packageData.image_url || '';
    document.getElementById('packageMapImageUrl').value = packageData.map_image_url || '';
    
    // Populate trek highlights
    populateHighlights(packageData.trek_highlights || '');
    
    // Populate daily itinerary
    populateItinerary(packageData.daily_itinerary || '');
    
    // Populate what's included
    populateIncludedItems(packageData.whats_included || '');
    
    // Load gallery images
    loadGalleryImages(packageData.gallery_urls || '');
    
    // Show preview if image URL exists
    if (packageData.image_url) {
        document.getElementById('packageImagePreview').style.display = 'block';
        document.getElementById('packagePreviewImg').src = packageData.image_url;
    } else {
        document.getElementById('packageImagePreview').style.display = 'none';
    }
}

// Populate trek highlights from stored data
function populateHighlights(highlightsText) {
    const container = document.getElementById('trekHighlightsContainer');
    container.innerHTML = ''; // Clear existing items
    
    if (highlightsText) {
        const highlights = highlightsText.split('\n').filter(h => h.trim());
        
        highlights.forEach((highlight, index) => {
            const newItem = document.createElement('div');
            newItem.className = 'highlight-item';
            newItem.style.display = 'flex';
            newItem.style.marginBottom = '10px';
            
            newItem.innerHTML = `
                <input type="text" class="form-control highlight-input" placeholder="Enter a trek highlight" value="${highlight}" style="flex: 1; margin-right: 10px;">
                <div><button type="button" class="btn btn-danger remove-highlight" onclick="removeHighlightItem(this)"${highlights.length > 1 ? '' : ' style="display: none;"'}>Remove</button></div>
            `;
            
            container.appendChild(newItem);
        });
        
        // If no items were added, add an empty one
        if (highlights.length === 0) {
            addHighlightItem();
        }
    } else {
        // Add an empty item if no data
        addHighlightItem();
    }
}

// Populate daily itinerary from stored data
function populateItinerary(itineraryText) {
    const container = document.getElementById('dailyItineraryContainer');
    container.innerHTML = ''; // Clear existing items
    
    if (itineraryText) {
        const days = itineraryText.split('\n').filter(d => d.trim());
        
        days.forEach((dayLine, index) => {
            // Parse format: Day X: Title | Description
            const match = dayLine.match(/Day\s+(\d+):\s*([^|]+)\|?(.*)/);
            
            if (match) {
                const dayNum = match[1];
                const title = match[2].trim();
                const description = match[3] ? match[3].trim() : '';
                
                const newDay = document.createElement('div');
                newDay.className = 'itinerary-day';
                newDay.style.border = '1px solid #ddd';
                newDay.style.borderRadius = '5px';
                newDay.style.padding = '15px';
                newDay.style.marginBottom = '15px';
                
                newDay.innerHTML = `
                    <div class="form-row">
                        <div class="form-group" style="flex: 0 0 100px; margin-right: 15px;">
                            <label>Day</label>
                            <input type="number" class="form-control day-number" min="1" value="${dayNum}" placeholder="Day">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Title</label>
                            <input type="text" class="form-control day-title" placeholder="Day title (e.g., Arrival in Kathmandu)" value="${title}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="form-control day-description" rows="2" placeholder="Describe activities for this day">${description}</textarea>
                    </div>
                    <button type="button" class="btn btn-danger remove-day" onclick="removeItineraryDay(this)"${days.length > 1 ? '' : ' style="display: none;"'}>Remove Day</button>
                `;
                
                container.appendChild(newDay);
            }
        });
        
        // If no items were parsed, add an empty one
        if (days.length === 0) {
            addItineraryDay();
        }
    } else {
        // Add an empty item if no data
        addItineraryDay();
    }
}

// Populate what's included from stored data
function populateIncludedItems(includedText) {
    const container = document.getElementById('whatsIncludedContainer');
    container.innerHTML = ''; // Clear existing items
    
    if (includedText) {
        const includedItems = includedText.split('\n').filter(i => i.trim());
        
        includedItems.forEach((item, index) => {
            const newItem = document.createElement('div');
            newItem.className = 'included-item';
            newItem.style.display = 'flex';
            newItem.style.marginBottom = '10px';
            
            newItem.innerHTML = `
                <input type="text" class="form-control included-input" placeholder="Enter an included item" value="${item}" style="flex: 1; margin-right: 10px;">
                <div><button type="button" class="btn btn-danger remove-included" onclick="removeIncludedItem(this)"${includedItems.length > 1 ? '' : ' style="display: none;"'}>Remove</button></div>
            `;
            
            container.appendChild(newItem);
        });
        
        // If no items were added, add an empty one
        if (includedItems.length === 0) {
            addIncludedItem();
        }
    } else {
        // Add an empty item if no data
        addIncludedItem();
    }
}

// Reset package form
function resetPackageForm() {
    document.getElementById('packageForm').reset();
    document.getElementById('packageImagePreview').style.display = 'none';
    document.getElementById('packagePreviewImg').src = '';
    document.getElementById('packageImageUrl').value = '';
    document.getElementById('mapImagePreview').style.display = 'none';
    document.getElementById('mapPreviewImg').src = '';
    document.getElementById('mapImageUrl').value = '';
    document.getElementById('galleryPreview').style.display = 'none';
    document.getElementById('galleryImages').innerHTML = '';
    document.getElementById('galleryUrls').value = '';
    
    // Reset dynamic fields to default state
    populateHighlights('');
    populateItinerary('');
    populateIncludedItems('');
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with one empty item for each section
    updateRemoveButtons('highlight-item', 'remove-highlight');
    updateRemoveButtons('itinerary-day', 'remove-day');
    updateRemoveButtons('included-item', 'remove-included');
});
