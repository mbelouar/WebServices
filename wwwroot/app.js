// API Base URL
const API_BASE_URL = '/api';

// State management
let currentFlights = [];
let currentSearchRequest = null;

// DOM Elements
const searchForm = document.getElementById('searchForm');
const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
const returnDateGroup = document.getElementById('returnDateGroup');
const originInput = document.getElementById('origin');
const destinationInput = document.getElementById('destination');
const originCodeInput = document.getElementById('originCode');
const destinationCodeInput = document.getElementById('destinationCode');
const originSuggestions = document.getElementById('originSuggestions');
const destinationSuggestions = document.getElementById('destinationSuggestions');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultsSection = document.getElementById('resultsSection');
const flightResults = document.getElementById('flightResults');
const resultsCount = document.getElementById('resultsCount');
const sortBySelect = document.getElementById('sortBy');
const flightModal = document.getElementById('flightModal');
const editModal = document.getElementById('editModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    setMinDates();
});

function initializeEventListeners() {
    // Trip type change
    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'oneway') {
                returnDateGroup.style.display = 'none';
                document.getElementById('returnDate').removeAttribute('required');
            } else {
                returnDateGroup.style.display = 'block';
                document.getElementById('returnDate').setAttribute('required', 'required');
            }
        });
    });

    // Autocomplete for origin
    originInput.addEventListener('input', debounce(async (e) => {
        const keyword = e.target.value.trim();
        if (keyword.length >= 2) {
            await searchLocations(keyword, originSuggestions, originInput, originCodeInput);
        } else {
            originSuggestions.classList.remove('active');
        }
    }, 300));

    // Autocomplete for destination
    destinationInput.addEventListener('input', debounce(async (e) => {
        const keyword = e.target.value.trim();
        if (keyword.length >= 2) {
            await searchLocations(keyword, destinationSuggestions, destinationInput, destinationCodeInput);
        } else {
            destinationSuggestions.classList.remove('active');
        }
    }, 300));

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete-wrapper')) {
            originSuggestions.classList.remove('active');
            destinationSuggestions.classList.remove('active');
        }
    });

    // Search form submit
    searchForm.addEventListener('submit', handleSearch);

    // Sort change
    sortBySelect.addEventListener('change', applySorting);

    // Modal close buttons
    document.querySelector('.close').addEventListener('click', () => {
        flightModal.classList.remove('active');
    });

    document.querySelector('.close-edit').addEventListener('click', () => {
        editModal.classList.remove('active');
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === flightModal) {
            flightModal.classList.remove('active');
        }
        if (e.target === editModal) {
            editModal.classList.remove('active');
        }
    });
}

function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departureDate').min = today;
    document.getElementById('returnDate').min = today;

    document.getElementById('departureDate').addEventListener('change', (e) => {
        document.getElementById('returnDate').min = e.target.value;
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function searchLocations(keyword, suggestionsElement, inputElement, codeInputElement) {
    try {
        const response = await fetch(`${API_BASE_URL}/flights/locations?keyword=${encodeURIComponent(keyword)}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch locations');
        }

        const data = await response.json();
        displaySuggestions(data.data, suggestionsElement, inputElement, codeInputElement);
    } catch (error) {
        console.error('Error searching locations:', error);
    }
}

function displaySuggestions(locations, suggestionsElement, inputElement, codeInputElement) {
    if (!locations || locations.length === 0) {
        suggestionsElement.classList.remove('active');
        return;
    }

    suggestionsElement.innerHTML = locations.map(location => `
        <div class="suggestion-item" data-code="${location.iataCode}" data-name="${location.name}">
            <div class="suggestion-main">${location.name} (${location.iataCode})</div>
            <div class="suggestion-detail">${location.address.cityName}, ${location.address.countryName}</div>
        </div>
    `).join('');

    suggestionsElement.classList.add('active');

    // Add click handlers to suggestions
    suggestionsElement.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const code = item.dataset.code;
            const name = item.dataset.name;
            inputElement.value = `${name} (${code})`;
            codeInputElement.value = code;
            suggestionsElement.classList.remove('active');
        });
    });
}

async function handleSearch(e) {
    e.preventDefault();

    // Validate location codes
    if (!originCodeInput.value) {
        alert('Veuillez sélectionner une ville de départ valide dans la liste');
        return;
    }

    if (!destinationCodeInput.value) {
        alert('Veuillez sélectionner une ville d\'arrivée valide dans la liste');
        return;
    }

    // Build search request
    const tripType = document.querySelector('input[name="tripType"]:checked').value;
    const departureDate = document.getElementById('departureDate').value;
    const returnDate = document.getElementById('returnDate').value;

    currentSearchRequest = {
        searchRequest: {
            originLocationCode: originCodeInput.value,
            destinationLocationCode: destinationCodeInput.value,
            departureDate: departureDate,
            returnDate: tripType === 'roundtrip' ? returnDate : null,
            adults: parseInt(document.getElementById('passengers').value),
            travelClass: document.getElementById('travelClass').value,
            nonStop: document.getElementById('directFlights').checked,
            currencyCode: 'EUR',
            maxResults: 50
        },
        filterOptions: buildFilterOptions(),
        sortBy: sortBySelect.value
    };

    // Show loading
    loadingIndicator.style.display = 'block';
    resultsSection.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE_URL}/flights/search-with-filters`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentSearchRequest)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to search flights');
        }

        const data = await response.json();
        currentFlights = data.data || [];
        displayResults(currentFlights);
    } catch (error) {
        console.error('Error searching flights:', error);
        alert(`Erreur lors de la recherche: ${error.message}`);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function buildFilterOptions() {
    const options = {};

    const directFlights = document.getElementById('directFlights').checked;
    if (directFlights) {
        options.directFlightsOnly = true;
    }

    const minDepartureTime = document.getElementById('minDepartureTime').value;
    const maxDepartureTime = document.getElementById('maxDepartureTime').value;
    const minArrivalTime = document.getElementById('minArrivalTime').value;
    const maxArrivalTime = document.getElementById('maxArrivalTime').value;
    const maxPrice = document.getElementById('maxPrice').value;

    if (minDepartureTime) options.minDepartureTime = minDepartureTime;
    if (maxDepartureTime) options.maxDepartureTime = maxDepartureTime;
    if (minArrivalTime) options.minArrivalTime = minArrivalTime;
    if (maxArrivalTime) options.maxArrivalTime = maxArrivalTime;
    if (maxPrice) options.maxPrice = parseFloat(maxPrice);

    return Object.keys(options).length > 0 ? options : null;
}

function displayResults(flights) {
    resultsSection.style.display = 'block';
    resultsCount.textContent = `${flights.length} vol(s) trouvé(s)`;

    if (flights.length === 0) {
        flightResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-plane-slash"></i>
                <h3>Aucun vol trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
            </div>
        `;
        return;
    }

    flightResults.innerHTML = flights.map((flight, index) => createFlightCard(flight, index)).join('');

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createFlightCard(flight, index) {
    const outboundItinerary = flight.itineraries[0];
    const returnItinerary = flight.itineraries[1];
    
    return `
        <div class="flight-card" data-flight-index="${index}">
            <div class="flight-header">
                <div class="flight-price">
                    ${parseFloat(flight.price.total).toFixed(2)} <span class="flight-currency">${flight.price.currency}</span>
                </div>
                <div class="flight-badges">
                    ${outboundItinerary.segments.length === 1 ? '<span class="badge badge-direct">Vol direct</span>' : 
                      `<span class="badge badge-stops">${outboundItinerary.segments.length - 1} escale(s)</span>`}
                    <span class="badge badge-class">${getClassLabel(flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin)}</span>
                </div>
            </div>

            <div class="flight-itinerary">
                <div class="itinerary-title">
                    <i class="fas fa-plane-departure"></i> Aller
                </div>
                ${createItinerarySegments(outboundItinerary)}
            </div>

            ${returnItinerary ? `
                <div class="flight-itinerary">
                    <div class="itinerary-title">
                        <i class="fas fa-plane-arrival"></i> Retour
                    </div>
                    ${createItinerarySegments(returnItinerary)}
                </div>
            ` : ''}

            <div class="flight-footer">
                <div>
                    <strong>Compagnie:</strong> ${flight.validatingAirlineCodes.join(', ')}
                </div>
                <div>
                    <button class="flight-details-btn" onclick="showFlightDetails(${index})">
                        <i class="fas fa-info-circle"></i> Détails
                    </button>
                    <button class="flight-edit-btn" onclick="showEditModal(${index})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                </div>
            </div>
        </div>
    `;
}

function createItinerarySegments(itinerary) {
    const firstSegment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
    const duration = parseDuration(itinerary.duration);
    const stops = itinerary.segments.length - 1;

    return `
        <div class="flight-segment">
            <div class="segment-departure">
                <div class="segment-time">${formatTime(firstSegment.departure.at)}</div>
                <div class="segment-location">${firstSegment.departure.iataCode}</div>
            </div>
            
            <div class="segment-duration">
                <div class="duration-time">${duration}</div>
                <div class="duration-stops">${stops === 0 ? 'Direct' : `${stops} escale(s)`}</div>
            </div>
            
            <div class="segment-arrival">
                <div class="segment-time">${formatTime(lastSegment.arrival.at)}</div>
                <div class="segment-location">${lastSegment.arrival.iataCode}</div>
            </div>
        </div>
        
        ${itinerary.segments.map(segment => `
            <div class="segment-info">
                <span><i class="fas fa-plane"></i> ${segment.carrierCode} ${segment.number}</span>
                <span><i class="fas fa-clock"></i> ${parseDuration(segment.duration)}</span>
            </div>
        `).join('')}
    `;
}

function showFlightDetails(index) {
    const flight = currentFlights[index];
    const detailsHtml = `
        <h2><i class="fas fa-ticket-alt"></i> Détails du vol</h2>
        
        <div class="detail-section">
            <h3>Prix</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Prix de base</div>
                    <div class="detail-value">${parseFloat(flight.price.base).toFixed(2)} ${flight.price.currency}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Prix total</div>
                    <div class="detail-value">${parseFloat(flight.price.total).toFixed(2)} ${flight.price.currency}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Places disponibles</div>
                    <div class="detail-value">${flight.numberOfBookableSeats}</div>
                </div>
            </div>
        </div>

        ${flight.itineraries.map((itinerary, idx) => `
            <div class="detail-section">
                <h3>${idx === 0 ? 'Aller' : 'Retour'}</h3>
                ${itinerary.segments.map((segment, segIdx) => `
                    <div class="detail-item" style="margin-bottom: 15px;">
                        <h4>Segment ${segIdx + 1}</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">Départ</div>
                                <div class="detail-value">${segment.departure.iataCode} - ${formatDateTime(segment.departure.at)}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Arrivée</div>
                                <div class="detail-value">${segment.arrival.iataCode} - ${formatDateTime(segment.arrival.at)}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Compagnie</div>
                                <div class="detail-value">${segment.carrierCode} ${segment.number}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Durée</div>
                                <div class="detail-value">${parseDuration(segment.duration)}</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Avion</div>
                                <div class="detail-value">${segment.aircraft.code}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('')}
    `;

    document.getElementById('flightDetails').innerHTML = detailsHtml;
    flightModal.classList.add('active');
}

function showEditModal(index) {
    const flight = currentFlights[index];
    const editFormHtml = `
        <form id="editFlightFormElement" onsubmit="handleFlightEdit(event, ${index})">
            <div class="form-grid">
                <div class="form-group">
                    <label for="editPrice">Prix total (${flight.price.currency})</label>
                    <input type="number" id="editPrice" step="0.01" value="${flight.price.total}" required>
                </div>
                
                <div class="form-group">
                    <label for="editSeats">Places disponibles</label>
                    <input type="number" id="editSeats" min="0" value="${flight.numberOfBookableSeats}" required>
                </div>
                
                <div class="form-group">
                    <label for="editClass">Classe</label>
                    <select id="editClass" required>
                        <option value="ECONOMY" ${flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin === 'ECONOMY' ? 'selected' : ''}>Économique</option>
                        <option value="PREMIUM_ECONOMY" ${flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin === 'PREMIUM_ECONOMY' ? 'selected' : ''}>Économique Premium</option>
                        <option value="BUSINESS" ${flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin === 'BUSINESS' ? 'selected' : ''}>Affaires</option>
                        <option value="FIRST" ${flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin === 'FIRST' ? 'selected' : ''}>Première</option>
                    </select>
                </div>
            </div>
            
            <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                <button type="button" class="flight-details-btn" onclick="editModal.classList.remove('active')">
                    <i class="fas fa-times"></i> Annuler
                </button>
                <button type="submit" class="btn-primary" style="width: auto;">
                    <i class="fas fa-save"></i> Enregistrer
                </button>
            </div>
        </form>
    `;

    document.getElementById('editFlightForm').innerHTML = editFormHtml;
    editModal.classList.add('active');
}

function handleFlightEdit(event, index) {
    event.preventDefault();
    
    const newPrice = parseFloat(document.getElementById('editPrice').value);
    const newSeats = parseInt(document.getElementById('editSeats').value);
    const newClass = document.getElementById('editClass').value;

    // Update the flight data
    currentFlights[index].price.total = newPrice;
    currentFlights[index].price.grandTotal = newPrice;
    currentFlights[index].numberOfBookableSeats = newSeats;
    
    if (currentFlights[index].travelerPricings[0]?.fareDetailsBySegment[0]) {
        currentFlights[index].travelerPricings[0].fareDetailsBySegment[0].cabin = newClass;
    }

    // Refresh the display
    displayResults(currentFlights);
    editModal.classList.remove('active');

    // Show success message
    alert('Les informations du vol ont été modifiées avec succès!');
}

function applySorting() {
    if (currentFlights.length === 0) return;

    const sortBy = sortBySelect.value;
    let sortedFlights = [...currentFlights];

    switch (sortBy) {
        case 'price_asc':
            sortedFlights.sort((a, b) => a.price.total - b.price.total);
            break;
        case 'price_desc':
            sortedFlights.sort((a, b) => b.price.total - a.price.total);
            break;
        case 'duration_asc':
            sortedFlights.sort((a, b) => getTotalDurationMinutes(a) - getTotalDurationMinutes(b));
            break;
        case 'duration_desc':
            sortedFlights.sort((a, b) => getTotalDurationMinutes(b) - getTotalDurationMinutes(a));
            break;
        case 'departure_asc':
            sortedFlights.sort((a, b) => new Date(a.itineraries[0].segments[0].departure.at) - new Date(b.itineraries[0].segments[0].departure.at));
            break;
        case 'departure_desc':
            sortedFlights.sort((a, b) => new Date(b.itineraries[0].segments[0].departure.at) - new Date(a.itineraries[0].segments[0].departure.at));
            break;
    }

    currentFlights = sortedFlights;
    displayResults(currentFlights);
}

// Utility functions
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function parseDuration(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    
    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${minutes}m`;
    }
}

function getTotalDurationMinutes(flight) {
    let totalMinutes = 0;
    flight.itineraries.forEach(itinerary => {
        const match = itinerary.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
        if (match) {
            const hours = match[1] ? parseInt(match[1]) : 0;
            const minutes = match[2] ? parseInt(match[2]) : 0;
            totalMinutes += hours * 60 + minutes;
        }
    });
    return totalMinutes;
}

function getClassLabel(cabin) {
    const labels = {
        'ECONOMY': 'Économique',
        'PREMIUM_ECONOMY': 'Premium',
        'BUSINESS': 'Affaires',
        'FIRST': 'Première'
    };
    return labels[cabin] || cabin;
}

