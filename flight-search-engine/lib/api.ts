// API configuration and service functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AmadeusFlightSearchRequest {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children?: number;
  infants?: number;
  travelClass: string;
  nonStop?: boolean;
  currencyCode?: string;
  maxResults?: number;
}

export interface FlightFilterOptions {
  directFlightsOnly?: boolean;
  minDepartureTime?: string;
  maxDepartureTime?: string;
  minArrivalTime?: string;
  maxArrivalTime?: string;
  maxPrice?: number;
  airlines?: string[];
}

export interface FlightSearchWithFiltersRequest {
  searchRequest: AmadeusFlightSearchRequest;
  filterOptions?: FlightFilterOptions;
  sortBy?: string;
}

export interface LocationSearchResponse {
  data: Array<{
    type: string;
    subType: string;
    name: string;
    detailedName: string;
    id: string;
    iataCode: string;
    address: {
      cityName: string;
      cityCode: string;
      countryName: string;
      countryCode: string;
      regionCode: string;
    };
    geoCode: {
      latitude: number;
      longitude: number;
    };
  }>;
  meta: {
    count: number;
  };
}

export interface AmadeusFlightOffer {
  id: string;
  type: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: number;
    base: number;
    fees: Array<{
      amount: number;
      type: string;
    }>;
    grandTotal: number;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: number;
      base: number;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      class: string;
      includedCheckedBags?: {
        weight?: number;
        weightUnit?: string;
        quantity?: number;
      };
    }>;
  }>;
}

export interface FlightSearchResponse {
  data: AmadeusFlightOffer[];
  dictionaries?: any;
  meta: {
    count: number;
  };
}

// Search flights with filters
export async function searchFlights(
  request: FlightSearchWithFiltersRequest
): Promise<FlightSearchResponse> {
  const response = await fetch(`${API_BASE_URL}/flights/search-with-filters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to search flights' }));
    throw new Error(error.error || 'Failed to search flights');
  }

  return response.json();
}

// Search locations for autocomplete
export async function searchLocations(keyword: string): Promise<LocationSearchResponse> {
  const response = await fetch(
    `${API_BASE_URL}/flights/locations?keyword=${encodeURIComponent(keyword)}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to search locations' }));
    throw new Error(error.error || 'Failed to search locations');
  }

  return response.json();
}

// Helper function to format duration from ISO 8601 (PT8H30M) to readable format
export function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;

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

// Helper function to format time from ISO date string
export function formatTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

// Helper function to get total duration in minutes
export function getTotalDurationMinutes(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;

  return hours * 60 + minutes;
}

