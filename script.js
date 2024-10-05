// Show loading overlay and hide main content
function showLoading() {
    const overlay = document.querySelector('.loading-overlay');
    overlay.style.display = 'flex';  // Show loading overlay
    setTimeout(() => {
        overlay.style.opacity = 1;  // Smooth transition for fade in
    }, 10); // Small delay for transition effect
    
    document.querySelector('.main-content').style.opacity = 0; // Hide form content smoothly
}

// Hide loading overlay and show main content
function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    overlay.style.opacity = 0;  // Smooth transition for fade out
    setTimeout(() => {
        overlay.style.display = 'none'; // Hide after fade out
        document.querySelector('.main-content').style.opacity = 1;  // Show form content smoothly
    }, 500); // Delay hiding the overlay to match transition duration
}

// Simulate data fetching and load image preview
function previewImage(event) {
    showLoading();

    // Simulate a short delay to mimic "fetching" data
    setTimeout(() => {
        const imagePreview = document.getElementById('image-preview');
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreview.innerHTML = ''; // Clear previous content
            imagePreview.appendChild(img); // Add the image to the preview
            document.querySelector('.image-preview-container').style.display = 'block'; // Show the preview container
        };

        if (file) {
            reader.readAsDataURL(file);  // Read the uploaded file as a data URL
        }

        // Hide loading overlay after data is "fetched"
        hideLoading();

        // Randomize the fields after upload
        randomizeFields();
    }, 1000); // Simulate 2 seconds loading time
}

// Function to randomize fields
function randomizeFields() {
    const addressField = document.getElementById('address');
    const consumptionField = document.getElementById('consumption');
    const priceField = document.getElementById('price');

    // List of addresses (2 from Riga, 2 from Czech Republic)
    const addresses = [
        'Jāņa sēta 3, Rīga, Latvia',
        'Brīvības iela 53, Rīga, Latvia',
        'Václavské náměstí 42, Prague, Czech Republic',
        'Karlova 10, Prague, Czech Republic'
    ];

    // Generate random index to select an address
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    const randomConsumption = `${Math.floor(Math.random() * 500) + 100}`;
    const randomPrice = `${(Math.random() * 100).toFixed(2)}`;

    // Set random values to the input fields
    addressField.value = randomAddress;
    consumptionField.value = randomConsumption;
    priceField.value = randomPrice;

    console.log("randomizing fetching coordinates")

    // Fetch coordinates for the randomized address
    fetchCoordinates(randomAddress);
}

async function fetchCoordinates(address) {
    showLoading(); // Show loading overlay

    try {
        const response = await fetch('http://127.0.0.1:5000/get_coordinates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address })
        });

        if (response.ok) {
            const data = await response.json(); // Parse JSON data from response
            console.log(`Latitude: ${data.latitude}, Longitude: ${data.longitude}`); // Log latitude and longitude
        } else {
            const errorData = await response.json();
            console.error(`Error: ${errorData.error}`); // Log error message
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
    } finally {
        hideLoading(); // Hide loading overlay after fetch
    }
}

// Event listener for file input
document.getElementById('file-input').addEventListener('change', previewImage);

document.getElementById('submit-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Generate random values for the results
    const yearlySavings = Math.floor(Math.random() * 1700) + 300; // Random savings between 500 and 5500
    const solarCompanies = ['SolarCo', 'GreenTech', 'SunPower', 'EcoSolar'];
    const recommendedCompany = solarCompanies[Math.floor(Math.random() * solarCompanies.length)];
    const peakPower = (Math.random() * (10 - 2) + 2).toFixed(2); // Random peak power between 2 and 10 kW
    const estimatedPrice = Math.floor(Math.random() * 20000) + 5000; // Random price between 5000 and 25000 USD

    // Redirect to the results page with the data passed as URL parameters
    window.location.href = `results.html?yearlySavings=${yearlySavings}&solarCompany=${recommendedCompany}&peakPower=${peakPower}&estimatedPrice=${estimatedPrice}`;
});



