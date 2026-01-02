using FlightSearchEngine.Models;

namespace FlightSearchEngine.Services;

public interface IFlightService
{
    Task<FlightSearchResponse> SearchFlightsAsync(FlightSearchRequest request);
    Task<LocationSearchResponse> SearchLocationsAsync(string keyword);
    List<FlightOffer> SortFlights(List<FlightOffer> flights, string sortBy);
    List<FlightOffer> FilterFlights(List<FlightOffer> flights, FlightFilterOptions filterOptions);
}

public class FlightFilterOptions
{
    public bool? DirectFlightsOnly { get; set; }
    public TimeSpan? MinDepartureTime { get; set; }
    public TimeSpan? MaxDepartureTime { get; set; }
    public TimeSpan? MinArrivalTime { get; set; }
    public TimeSpan? MaxArrivalTime { get; set; }
    public decimal? MaxPrice { get; set; }
    public List<string>? Airlines { get; set; }
}

