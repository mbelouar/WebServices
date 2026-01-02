using FlightSearchEngine.Models;

namespace FlightSearchEngine.Services;

public interface IAmadeusService
{
    Task<string> GetAccessTokenAsync();
    Task<FlightSearchResponse> SearchFlightsAsync(FlightSearchRequest request);
    Task<LocationSearchResponse> SearchLocationsAsync(string keyword);
}

