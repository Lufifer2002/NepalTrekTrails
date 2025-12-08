// packages.js - Handle package listing and interactions

document.addEventListener('DOMContentLoaded', () => {
    loadPackages();
});

// Load packages from backend
async function loadPackages() {
    const packagesGrid = document.getElementById('packagesGrid');
    
    if (!packagesGrid) {
        console.error('Packages grid container not found');
        return;
    }
    
    try {
        // Show loading state
        packagesGrid.innerHTML = '<div class="loading">Loading packages...</div>';
        
        // Fetch packages from backend
        const response = await fetch('../Backend/package.php');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.packages && data.packages.length > 0) {
            displayPackages(data.packages);
        } else {
            packagesGrid.innerHTML = '<div class="no-packages">No packages available at the moment. Please check back later.</div>';
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        packagesGrid.innerHTML = '<div class="error">Failed to load packages. Please try again later.</div>';
    }
}

// Display packages in the grid
function displayPackages(packages) {
    const packagesGrid = document.getElementById('packagesGrid');
    
    if (!packagesGrid) return;
    
    packagesGrid.innerHTML = packages.map(package => `
        <div class="package-card">
            <div class="package-image">
                ${package.image_url ? 
                    `<img src="${package.image_url}" alt="${package.name}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder-image\\'>${package.name.charAt(0) || 'P'}</div>'">` :
                    `<div class="placeholder-image">${package.name.charAt(0) || 'P'}</div>`
                }
            </div>
            <div class="package-content">
                <h3>${package.name}</h3>
                <span class="package-duration">${package.duration} days</span>
                <p class="package-description">${package.description}</p>
                <div class="package-price-wrapper">
                    <div class="package-price">$${parseFloat(package.price).toFixed(2)}</div>
                </div>
                <button class="package-btn" onclick="viewPackageDetails(${package.id})">
                    <span>View Details</span>
                </button>
            </div>
        </div>
    `).join('');
}

// View package details
function viewPackageDetails(packageId) {
    window.location.href = `package-detail.html?id=${packageId}`;
}